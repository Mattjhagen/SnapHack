import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  snapScore: number;
  friendsCount: number;
  streaksCount: number;
  createdAt: number;
  lastActive: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

class AuthService {
  private db: SQLite.SQLiteDatabase | null = null;
  private currentUser: User | null = null;
  private listeners: ((state: AuthState) => void)[] = [];

  async initialize() {
    try {
      this.db = await SQLite.openDatabaseAsync('snaphack_auth.db');
      await this.createTables();
      await this.loadCurrentUser();
    } catch (error) {
      console.error('Failed to initialize auth service:', error);
    }
  }

  private async createTables() {
    if (!this.db) return;

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        avatar TEXT,
        bio TEXT,
        snap_score INTEGER DEFAULT 0,
        friends_count INTEGER DEFAULT 0,
        streaks_count INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        last_active INTEGER NOT NULL
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS auth_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);
  }

  private async loadCurrentUser() {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        this.notifyListeners({ isAuthenticated: false, user: null, isLoading: false });
        return;
      }

      // In a real app, you would validate the token with your backend
      // For now, we'll just check if we have a user in local storage
      const userId = await SecureStore.getItemAsync('current_user_id');
      if (!userId) {
        this.notifyListeners({ isAuthenticated: false, user: null, isLoading: false });
        return;
      }

      const user = await this.getUserById(userId);
      if (user) {
        this.currentUser = user;
        this.notifyListeners({ isAuthenticated: true, user, isLoading: false });
      } else {
        this.notifyListeners({ isAuthenticated: false, user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load current user:', error);
      this.notifyListeners({ isAuthenticated: false, user: null, isLoading: false });
    }
  }

  async register(userData: {
    username: string;
    email: string;
    displayName: string;
    password: string;
  }): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      if (!this.db) {
        return { success: false, error: 'Database not initialized' };
      }

      // Check if username or email already exists
      const existingUser = await this.db.getFirstAsync(`
        SELECT id FROM users WHERE username = ? OR email = ?
      `, [userData.username, userData.email]);

      if (existingUser) {
        return { success: false, error: 'Username or email already exists' };
      }

      // Create new user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();

      await this.db.runAsync(`
        INSERT INTO users (id, username, email, display_name, snap_score, friends_count, streaks_count, created_at, last_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        userData.username,
        userData.email,
        userData.displayName,
        0,
        0,
        0,
        now,
        now
      ]);

      const user: User = {
        id: userId,
        username: userData.username,
        email: userData.email,
        displayName: userData.displayName,
        snapScore: 0,
        friendsCount: 0,
        streaksCount: 0,
        createdAt: now,
        lastActive: now,
      };

      // Store auth token (in a real app, this would come from your backend)
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('current_user_id', userId);

      this.currentUser = user;
      this.notifyListeners({ isAuthenticated: true, user, isLoading: false });

      return { success: true, user };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  async login(identifier: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      if (!this.db) {
        return { success: false, error: 'Database not initialized' };
      }

      // Find user by username or email
      const userRow = await this.db.getFirstAsync(`
        SELECT * FROM users WHERE username = ? OR email = ?
      `, [identifier, identifier]);

      if (!userRow) {
        return { success: false, error: 'User not found' };
      }

      // In a real app, you would verify the password hash here
      // For demo purposes, we'll accept any password

      const user: User = {
        id: userRow.id,
        username: userRow.username,
        email: userRow.email,
        displayName: userRow.display_name,
        avatar: userRow.avatar,
        bio: userRow.bio,
        snapScore: userRow.snap_score,
        friendsCount: userRow.friends_count,
        streaksCount: userRow.streaks_count,
        createdAt: userRow.created_at,
        lastActive: userRow.last_active,
      };

      // Update last active time
      await this.updateLastActive(user.id);

      // Store auth token
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('current_user_id', user.id);

      this.currentUser = user;
      this.notifyListeners({ isAuthenticated: true, user, isLoading: false });

      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('current_user_id');
      
      this.currentUser = null;
      this.notifyListeners({ isAuthenticated: false, user: null, isLoading: false });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.db || !this.currentUser) {
        return { success: false, error: 'Not authenticated' };
      }

      const updateFields = [];
      const updateValues = [];

      if (updates.displayName !== undefined) {
        updateFields.push('display_name = ?');
        updateValues.push(updates.displayName);
      }
      if (updates.avatar !== undefined) {
        updateFields.push('avatar = ?');
        updateValues.push(updates.avatar);
      }
      if (updates.bio !== undefined) {
        updateFields.push('bio = ?');
        updateValues.push(updates.bio);
      }

      if (updateFields.length === 0) {
        return { success: true };
      }

      updateValues.push(this.currentUser.id);

      await this.db.runAsync(`
        UPDATE users SET ${updateFields.join(', ')} WHERE id = ?
      `, updateValues);

      // Update current user object
      this.currentUser = { ...this.currentUser, ...updates };
      this.notifyListeners({ isAuthenticated: true, user: this.currentUser, isLoading: false });

      return { success: true };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error: 'Profile update failed' };
    }
  }

  async updateSnapScore(increment: number): Promise<void> {
    if (!this.db || !this.currentUser) return;

    try {
      const newScore = this.currentUser.snapScore + increment;
      await this.db.runAsync(`
        UPDATE users SET snap_score = ? WHERE id = ?
      `, [newScore, this.currentUser.id]);

      this.currentUser.snapScore = newScore;
      this.notifyListeners({ isAuthenticated: true, user: this.currentUser, isLoading: false });
    } catch (error) {
      console.error('Failed to update snap score:', error);
    }
  }

  private async updateLastActive(userId: string): Promise<void> {
    if (!this.db) return;

    try {
      await this.db.runAsync(`
        UPDATE users SET last_active = ? WHERE id = ?
      `, [Date.now(), userId]);
    } catch (error) {
      console.error('Failed to update last active:', error);
    }
  }

  private async getUserById(userId: string): Promise<User | null> {
    if (!this.db) return null;

    try {
      const userRow = await this.db.getFirstAsync(`
        SELECT * FROM users WHERE id = ?
      `, [userId]);

      if (!userRow) return null;

      return {
        id: userRow.id,
        username: userRow.username,
        email: userRow.email,
        displayName: userRow.display_name,
        avatar: userRow.avatar,
        bio: userRow.bio,
        snapScore: userRow.snap_score,
        friendsCount: userRow.friends_count,
        streaksCount: userRow.streaks_count,
        createdAt: userRow.created_at,
        lastActive: userRow.last_active,
      };
    } catch (error) {
      console.error('Failed to get user by ID:', error);
      return null;
    }
  }

  // State management
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(state: AuthState) {
    this.listeners.forEach(listener => listener(state));
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();
