import { MongoClient } from "mongodb";

/**
 * Database Storage Adapter for AI Conversation Memory System
 * Provides MongoDB integration while maintaining same interface as file storage
 */

class DatabaseStorage {
  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;
    this.isConnected = false;
    this.mongoUri = process.env.MONGODB_URI;
    this.dbName = process.env.MONGODB_DB_NAME;
    this.collectionName = "conv-data";
  }

  /**
   * Initialize MongoDB connection
   */
  async connect() {
    try {
      if (!this.mongoUri || !this.dbName) {
        throw new Error("MongoDB configuration missing in .env file");
      }

      console.log("🔌 Connecting to MongoDB...");
      this.client = new MongoClient(this.mongoUri);
      await this.client.connect();

      this.db = this.client.db(this.dbName);
      this.collection = this.db.collection(this.collectionName);

      // Create index on conversationId for faster queries
      await this.collection.createIndex(
        { conversationId: 1 },
        { unique: true }
      );

      this.isConnected = true;
      console.log(`✅ Connected to MongoDB database: ${this.dbName}`);
      // console.log(`📁 Using collection: ${this.collectionName}`);

      return true;
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log("🔌 Disconnected from MongoDB");
    }
  }

  /**
   * Check if database is available and connected
   */
  isAvailable() {
    return this.isConnected && this.client && this.db;
  }

  /**
   * Save conversation data to MongoDB
   * Equivalent to saving JSON file in /data folder
   */
  async saveConversationData(conversationId, userData) {
    try {
      if (!this.isAvailable()) {
        throw new Error("Database not connected");
      }

      // Add metadata for database storage
      const documentData = {
        conversationId: conversationId,
        ...userData,
        updatedAt: new Date(),
        storageType: "database",
      };

      // Use upsert to create or update
      const result = await this.collection.replaceOne(
        { conversationId: conversationId },
        documentData,
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        console.log(`💾 Created new conversation document: ${conversationId}`);
      } else if (result.modifiedCount > 0) {
        console.log(`💾 Updated conversation document: ${conversationId}`);
      }

      return true;
    } catch (error) {
      console.error(`❌ Failed to save to database: ${error.message}`);
      throw error;
    }
  }

  /**
   * Load conversation data from MongoDB
   * Equivalent to reading JSON file from /data folder
   */
  async loadConversationData(conversationId) {
    try {
      if (!this.isAvailable()) {
        throw new Error("Database not connected");
      }

      const document = await this.collection.findOne({
        conversationId: conversationId,
      });

      if (!document) {
        console.log(
          `📂 No conversation data found in database for: ${conversationId}`
        );
        return null;
      }

      // Remove MongoDB-specific fields and return clean data
      const { _id, updatedAt, storageType, ...userData } = document;

      console.log(
        `📂 Loaded conversation data from database: ${conversationId}`
      );
      return userData;
    } catch (error) {
      console.error(`❌ Failed to load from database: ${error.message}`);
      return null;
    }
  }

  /**
   * Delete conversation data from MongoDB
   * Equivalent to deleting JSON file from /data folder
   */
  async deleteConversationData(conversationId) {
    try {
      if (!this.isAvailable()) {
        throw new Error("Database not connected");
      }

      const result = await this.collection.deleteOne({
        conversationId: conversationId,
      });

      if (result.deletedCount > 0) {
        console.log(`🗑️ Deleted conversation document: ${conversationId}`);
        return true;
      } else {
        console.log(
          `⚠️ No conversation document found to delete: ${conversationId}`
        );
        return false;
      }
    } catch (error) {
      console.error(`❌ Failed to delete from database: ${error.message}`);
      return false;
    }
  }

  /**
   * List all conversation IDs in database
   * Equivalent to listing all JSON files in /data folder
   */
  async listConversations() {
    try {
      if (!this.isAvailable()) {
        throw new Error("Database not connected");
      }

      const conversations = await this.collection
        .find(
          {},
          {
            projection: { conversationId: 1, updatedAt: 1, _id: 0 },
          }
        )
        .sort({ updatedAt: -1 })
        .toArray();

      console.log(`📋 Found ${conversations.length} conversations in database`);
      return conversations;
    } catch (error) {
      console.error(`❌ Failed to list conversations: ${error.message}`);
      return [];
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    try {
      if (!this.isAvailable()) {
        return { connected: false, conversations: 0 };
      }

      const count = await this.collection.countDocuments();
      const dbStats = await this.db.stats();

      return {
        connected: true,
        conversations: count,
        dbName: this.dbName,
        collectionName: this.collectionName,
        dbSize: dbStats.dataSize,
        indexCount: dbStats.indexes,
      };
    } catch (error) {
      console.error(`❌ Failed to get database stats: ${error.message}`);
      return { connected: false, error: error.message };
    }
  }

  /**
   * Test database connection and operations
   */
  async testConnection() {
    try {
      console.log("🧪 Testing database connection...");

      if (!this.isAvailable()) {
        await this.connect();
      }

      // Test basic operations
      const testId = "test-" + Date.now();
      const testData = {
        conversationId: testId,
        userProfile: { name: "Test User" },
        compressionHistory: [],
        totalProcessedCount: 0,
        lastUpdated: Date.now(),
      };

      // Test save
      await this.saveConversationData(testId, testData);

      // Test load
      const loaded = await this.loadConversationData(testId);

      // Test delete
      await this.deleteConversationData(testId);

      if (loaded && loaded.conversationId === testId) {
        console.log("✅ Database connection test successful");
        return true;
      } else {
        console.log("❌ Database connection test failed: data mismatch");
        return false;
      }
    } catch (error) {
      console.error(`❌ Database connection test failed: ${error.message}`);
      return false;
    }
  }
}

export default DatabaseStorage;
