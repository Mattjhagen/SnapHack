import * as SQLite from 'expo-sqlite';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'snap';
  timestamp: number;
  isRead: boolean;
  mediaUrl?: string;
  duration?: number; // For snaps
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  isGroup: boolean;
  participants: string[];
}

export interface Snap {
  id: string;
  senderId: string;
  recipientId: string;
  mediaUrl: string;
  type: 'image' | 'video';
  duration: number;
  timestamp: number;
  isViewed: boolean;
  isOpened: boolean;
  viewTime?: number;
}

class ChatService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize() {
    try {
      this.db = await SQLite.openDatabaseAsync('snaphack_chat.db');
      
      // Create tables
      await this.createTables();
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }

  private async createTables() {
    if (!this.db) return;

    // Chats table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT,
        last_message TEXT,
        last_message_time INTEGER,
        unread_count INTEGER DEFAULT 0,
        is_group INTEGER DEFAULT 0,
        participants TEXT
      );
    `);

    // Messages table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        content TEXT,
        type TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        is_read INTEGER DEFAULT 0,
        media_url TEXT,
        duration INTEGER,
        FOREIGN KEY (chat_id) REFERENCES chats (id)
      );
    `);

    // Snaps table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS snaps (
        id TEXT PRIMARY KEY,
        sender_id TEXT NOT NULL,
        recipient_id TEXT NOT NULL,
        media_url TEXT NOT NULL,
        type TEXT NOT NULL,
        duration INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        is_viewed INTEGER DEFAULT 0,
        is_opened INTEGER DEFAULT 0,
        view_time INTEGER
      );
    `);
  }

  // Chat methods
  async getChats(): Promise<Chat[]> {
    if (!this.db) return [];

    try {
      const result = await this.db.getAllAsync(`
        SELECT * FROM chats 
        ORDER BY last_message_time DESC
      `);

      return result.map((row: any) => ({
        id: row.id,
        name: row.name,
        avatar: row.avatar,
        lastMessage: row.last_message,
        lastMessageTime: row.last_message_time,
        unreadCount: row.unread_count,
        isGroup: Boolean(row.is_group),
        participants: row.participants ? JSON.parse(row.participants) : [],
      }));
    } catch (error) {
      console.error('Failed to get chats:', error);
      return [];
    }
  }

  async createChat(chat: Omit<Chat, 'id' | 'lastMessage' | 'lastMessageTime' | 'unreadCount'>): Promise<string> {
    if (!this.db) return '';

    const id = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      await this.db.runAsync(`
        INSERT INTO chats (id, name, avatar, last_message, last_message_time, unread_count, is_group, participants)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        chat.name,
        chat.avatar,
        '',
        Date.now(),
        0,
        chat.isGroup ? 1 : 0,
        JSON.stringify(chat.participants)
      ]);

      return id;
    } catch (error) {
      console.error('Failed to create chat:', error);
      return '';
    }
  }

  // Message methods
  async getMessages(chatId: string): Promise<Message[]> {
    if (!this.db) return [];

    try {
      const result = await this.db.getAllAsync(`
        SELECT * FROM messages 
        WHERE chat_id = ? 
        ORDER BY timestamp ASC
      `, [chatId]);

      return result.map((row: any) => ({
        id: row.id,
        chatId: row.chat_id,
        senderId: row.sender_id,
        content: row.content,
        type: row.type,
        timestamp: row.timestamp,
        isRead: Boolean(row.is_read),
        mediaUrl: row.media_url,
        duration: row.duration,
      }));
    } catch (error) {
      console.error('Failed to get messages:', error);
      return [];
    }
  }

  async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Promise<string> {
    if (!this.db) return '';

    const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();

    try {
      await this.db.runAsync(`
        INSERT INTO messages (id, chat_id, sender_id, content, type, timestamp, is_read, media_url, duration)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        message.chatId,
        message.senderId,
        message.content,
        message.type,
        timestamp,
        0,
        message.mediaUrl,
        message.duration
      ]);

      // Update chat's last message
      await this.db.runAsync(`
        UPDATE chats 
        SET last_message = ?, last_message_time = ?, unread_count = unread_count + 1
        WHERE id = ?
      `, [message.content, timestamp, message.chatId]);

      return id;
    } catch (error) {
      console.error('Failed to send message:', error);
      return '';
    }
  }

  async markMessageAsRead(messageId: string) {
    if (!this.db) return;

    try {
      await this.db.runAsync(`
        UPDATE messages SET is_read = 1 WHERE id = ?
      `, [messageId]);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  }

  // Snap methods
  async sendSnap(snap: Omit<Snap, 'id' | 'timestamp' | 'isViewed' | 'isOpened'>): Promise<string> {
    if (!this.db) return '';

    const id = `snap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();

    try {
      await this.db.runAsync(`
        INSERT INTO snaps (id, sender_id, recipient_id, media_url, type, duration, timestamp, is_viewed, is_opened)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        snap.senderId,
        snap.recipientId,
        snap.mediaUrl,
        snap.type,
        snap.duration,
        timestamp,
        0,
        0
      ]);

      return id;
    } catch (error) {
      console.error('Failed to send snap:', error);
      return '';
    }
  }

  async getSnaps(userId: string): Promise<Snap[]> {
    if (!this.db) return [];

    try {
      const result = await this.db.getAllAsync(`
        SELECT * FROM snaps 
        WHERE recipient_id = ? 
        ORDER BY timestamp DESC
      `, [userId]);

      return result.map((row: any) => ({
        id: row.id,
        senderId: row.sender_id,
        recipientId: row.recipient_id,
        mediaUrl: row.media_url,
        type: row.type,
        duration: row.duration,
        timestamp: row.timestamp,
        isViewed: Boolean(row.is_viewed),
        isOpened: Boolean(row.is_opened),
        viewTime: row.view_time,
      }));
    } catch (error) {
      console.error('Failed to get snaps:', error);
      return [];
    }
  }

  async viewSnap(snapId: string) {
    if (!this.db) return;

    try {
      await this.db.runAsync(`
        UPDATE snaps 
        SET is_viewed = 1, is_opened = 1, view_time = ?
        WHERE id = ?
      `, [Date.now(), snapId]);
    } catch (error) {
      console.error('Failed to view snap:', error);
    }
  }

  async deleteSnap(snapId: string) {
    if (!this.db) return;

    try {
      await this.db.runAsync(`
        DELETE FROM snaps WHERE id = ?
      `, [snapId]);
    } catch (error) {
      console.error('Failed to delete snap:', error);
    }
  }

  // Utility methods
  async clearAllData() {
    if (!this.db) return;

    try {
      await this.db.execAsync(`
        DELETE FROM messages;
        DELETE FROM snaps;
        DELETE FROM chats;
      `);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }
}

export const chatService = new ChatService();
