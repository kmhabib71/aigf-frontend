// @ts-nocheck
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { OpenAI } from "openai";
import DatabaseStorage from "./databaseStorage";

class AdvancedConversation {
  constructor(id = null, openaiClient = null, storageMode = "auto") {
    this.id = id || crypto.randomUUID();
    this.messages = [];
    this.compressionHistory = []; // Array of compressed summaries from each 20-message chunk
    this.userProfile = {}; // Persistent user information
    this.maxMessages = 20; // Compress every 20 messages
    this.maxTokens = 1000; // Token limit for context
    this.openai = openaiClient;
    this.dataDir = "./data";
    this.totalProcessedCount = 0; // Track total messages processed across all compressions

    // Storage configuration
    this.storageMode = this.determineStorageMode(storageMode);
    this.databaseStorage = null;
    this.useDatabase = false;

    this.initializeStorage();
  }

  /**
   * Determine storage mode based on configuration and environment
   */
  determineStorageMode(requestedMode) {
    const hasMongoConfig =
      process.env.MONGODB_URI && process.env.MONGODB_DB_NAME;

    switch (requestedMode) {
      case "database":
        if (!hasMongoConfig) {
          console.log(
            "⚠️ Database mode requested but MongoDB config missing, falling back to offline"
          );
          return "offline";
        }
        return "database";
      case "offline":
        return "offline";
      case "auto":
      default:
        return hasMongoConfig ? "database" : "offline";
    }
  }

  /**
   * Initialize storage system based on determined mode
   */
  async initializeStorage() {
    console.log(`🏗️ Initializing storage mode: ${this.storageMode}`);

    if (this.storageMode === "database") {
      try {
        this.databaseStorage = new DatabaseStorage();
        const connected = await this.databaseStorage.connect();

        if (connected) {
          this.useDatabase = true;
          console.log(`✅ Online storage enabled for conversation ${this.id}`);
        } else {
          console.log(
            `⚠️ Database connection failed, falling back to offline storage`
          );
          this.useDatabase = false;
          await this.ensureDataDirectory();
        }
      } catch (error) {
        console.error(`❌ Database initialization failed: ${error.message}`);
        this.useDatabase = false;
        await this.ensureDataDirectory();
      }
    } else {
      this.useDatabase = false;
      await this.ensureDataDirectory();
      console.log(`📁 Offline storage enabled for conversation ${this.id}`);
    }
  }

  async ensureDataDirectory() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      // Directory already exists or other error
    }
  }

  async addMessage(role, content) {
    this.messages.push({
      role,
      content,
      timestamp: Date.now(),
    });

    // Check if we need to compress after every 20 messages
    if (this.messages.length >= this.maxMessages) {
      await this.performSequentialCompression();
    }
  }

  // Sequential compression: compress every 20 messages and merge with previous compressions
  async performSequentialCompression() {
    console.log(
      `\n🗜️ STARTING SEQUENTIAL COMPRESSION for conversation ${this.id}`
    );
    console.log(
      `📊 Current state: ${this.messages.length} messages → will become chunk ${
        this.compressionHistory.length + 1
      }`
    );
    console.log(
      `📚 Existing compression history: ${this.compressionHistory.length} chunks`
    );

    // Get the 20 messages to compress
    const messagesToCompress = this.messages.slice(0, this.maxMessages);
    console.log(`📝 Messages to compress:`);
    messagesToCompress.forEach((msg, i) => {
      console.log(
        `  ${i + 1}. [${msg.role}]: ${msg.content.substring(0, 80)}...`
      );
    });

    try {
      // Step 1: AI-powered summarization of the 20 messages
      const newSummary = await this.createAICompressedSummary(
        messagesToCompress
      );

      // Step 2: Extract user profile information from these messages
      const userInfo = await this.extractUserProfile(messagesToCompress);

      // Step 3: Merge with existing user profile (avoid duplication)
      this.mergeUserProfile(userInfo);

      // Step 4: Add new summary to compression history
      this.compressionHistory.push({
        summary: newSummary,
        messageCount: messagesToCompress.length,
        timestamp: Date.now(),
        chunkNumber: this.compressionHistory.length + 1,
      });

      // Step 5: Keep only the remaining messages (after 20)
      this.messages = this.messages.slice(this.maxMessages);

      // Step 6: Update processed count tracking
      this.totalProcessedCount += messagesToCompress.length;

      // Step 7: Save user profile and compression history to file
      await this.saveUserData();

      console.log(
        `✅ Compression complete. Total chunks: ${this.compressionHistory.length}`
      );
      console.log(`📊 Total processed: ${this.totalProcessedCount} messages`);
    } catch (error) {
      console.error("❌ Error during compression:", error.message);
      // Fallback: use simple compression if AI fails
      this.performFallbackCompression(messagesToCompress);
    }
  }

  // AI-powered summarization using OpenAI
  async createAICompressedSummary(messages) {
    if (!this.openai) {
      throw new Error("OpenAI client not available for summarization");
    }

    // Prepare messages for summarization
    const conversationText = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const summarizationPrompt = `Please create a highly compressed summary of this conversation chunk. Focus on:
1. Key facts and important information
2. User personal details (name, job, location, interests)
3. Important topics discussed
4. Decisions or conclusions reached
5. Any memorable events or stories mentioned

Keep the summary very concise but comprehensive. Avoid unnecessary details.

Conversation to summarize:
${conversationText}

Provide a compressed summary in this format:
FACTS: [key facts]
USER: [user information]
TOPICS: [main topics discussed]`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at creating highly compressed but comprehensive conversation summaries. Focus on retaining the most important 20% of information that represents 80% of the context.",
          },
          {
            role: "user",
            content: summarizationPrompt,
          },
        ],
        max_completion_tokens: 300,
        reasoning_effort: "minimal",
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("AI summarization failed:", error.message);
      throw error;
    }
  }

  // Extract user profile information using AI
  async extractUserProfile(messages) {
    if (!this.openai) {
      return this.extractUserProfileFallback(messages);
    }

    const conversationText = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const profilePrompt = `Extract key user information from this conversation. Focus on persistent facts about the user that would help an AI remember them in future sessions.

Extract information in this JSON format:
{
  "name": "user's name",
  "location": "where they live",
  "profession": "their job/career",
  "interests": ["interest1", "interest2"],
  "personalDetails": ["important personal fact1", "fact2"],
  "relationships": ["important relationship info"],
  "preferences": ["preferences mentioned"]
}

Only include information that is clearly stated. Leave fields empty if not mentioned.

Conversation:
${conversationText}`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at extracting and structuring user profile information. Return only valid JSON.",
          },
          {
            role: "user",
            content: profilePrompt,
          },
        ],
        max_completion_tokens: 200,
        reasoning_effort: "minimal",
      });

      const response = completion.choices[0].message.content;

      // Try to parse JSON response
      try {
        return JSON.parse(response);
      } catch (parseError) {
        console.error("Failed to parse user profile JSON:", response);
        return this.extractUserProfileFallback(messages);
      }
    } catch (error) {
      console.error("AI profile extraction failed:", error.message);
      return this.extractUserProfileFallback(messages);
    }
  }

  // Fallback user profile extraction without AI
  extractUserProfileFallback(messages) {
    const profile = {
      name: "",
      location: "",
      profession: "",
      interests: [],
      personalDetails: [],
      relationships: [],
      preferences: [],
    };

    messages.forEach((msg) => {
      if (msg.role === "user") {
        const content = msg.content.toLowerCase();

        // Extract name
        if (content.includes("i'm ") && content.includes("i'm ")) {
          const nameMatch = content.match(/i'm (\w+)/);
          if (nameMatch) profile.name = nameMatch[1];
        }

        // Extract location
        if (content.includes("live in") || content.includes("from ")) {
          const locationMatch = content.match(/live in (\w+)|from (\w+)/);
          if (locationMatch)
            profile.location = locationMatch[1] || locationMatch[2];
        }

        // Extract profession
        if (
          content.includes("developer") ||
          content.includes("engineer") ||
          content.includes("work")
        ) {
          profile.profession = msg.content;
        }

        // Extract personal details
        if (msg.content.length > 50) {
          profile.personalDetails.push(msg.content);
        }
      }
    });

    return profile;
  }

  // Merge new user information with existing profile, avoiding duplication
  mergeUserProfile(newInfo) {
    if (!newInfo) return;

    // Merge basic fields
    if (newInfo.name && !this.userProfile.name) {
      this.userProfile.name = newInfo.name;
    }
    if (newInfo.location && !this.userProfile.location) {
      this.userProfile.location = newInfo.location;
    }
    if (newInfo.profession && !this.userProfile.profession) {
      this.userProfile.profession = newInfo.profession;
    }

    // Merge arrays, avoiding duplicates
    const mergeArray = (existing, newItems, key = null) => {
      if (!existing) existing = [];
      if (!newItems) return existing;

      const combined = [...existing, ...newItems];
      return [...new Set(combined)]; // Remove duplicates
    };

    this.userProfile.interests = mergeArray(
      this.userProfile.interests,
      newInfo.interests
    );
    this.userProfile.personalDetails = mergeArray(
      this.userProfile.personalDetails,
      newInfo.personalDetails
    );
    this.userProfile.relationships = mergeArray(
      this.userProfile.relationships,
      newInfo.relationships
    );
    this.userProfile.preferences = mergeArray(
      this.userProfile.preferences,
      newInfo.preferences
    );

    console.log("👤 User profile updated");
  }

  // Fallback compression without AI
  performFallbackCompression(messages) {
    const summary = `Fallback summary of ${messages.length} messages: ${messages
      .slice(0, 3)
      .map((m) => m.content)
      .join(" | ")}`;

    this.compressionHistory.push({
      summary: summary,
      messageCount: messages.length,
      timestamp: Date.now(),
      chunkNumber: this.compressionHistory.length + 1,
      type: "fallback",
    });

    this.messages = this.messages.slice(this.maxMessages);
  }

  // Save user profile and compression history to storage (JSON file or Database)
  async saveUserData() {
    try {
      const userData = {
        conversationId: this.id,
        userProfile: this.userProfile,
        compressionHistory: this.compressionHistory,
        totalProcessedCount: this.totalProcessedCount,
        lastUpdated: Date.now(),
      };

      if (this.useDatabase && this.databaseStorage) {
        // Save to MongoDB
        await this.databaseStorage.saveConversationData(this.id, userData);
        console.log(`💾 User data saved to database (online)`);
      } else {
        // Save to JSON file
        const filePath = path.join(this.dataDir, `user_${this.id}.json`);
        await fs.writeFile(filePath, JSON.stringify(userData, null, 2));
        console.log(`💾 User data saved to file (offline)`);
      }
    } catch (error) {
      console.error("Failed to save user data:", error.message);

      // Fallback to file storage if database save fails
      if (this.useDatabase) {
        console.log("⚠️ Database save failed, falling back to file storage");
        try {
          await this.ensureDataDirectory();
          const filePath = path.join(this.dataDir, `user_${this.id}.json`);
          const userData = {
            conversationId: this.id,
            userProfile: this.userProfile,
            compressionHistory: this.compressionHistory,
            totalProcessedCount: this.totalProcessedCount,
            lastUpdated: Date.now(),
          };
          await fs.writeFile(filePath, JSON.stringify(userData, null, 2));
          console.log(`💾 User data saved to file as fallback`);
        } catch (fallbackError) {
          console.error("Fallback save also failed:", fallbackError.message);
        }
      }
    }
  }

  // Load user profile and compression history from storage (JSON file or Database)
  async loadUserData() {
    try {
      let userData = null;

      if (this.useDatabase && this.databaseStorage) {
        // Load from MongoDB
        userData = await this.databaseStorage.loadConversationData(this.id);
        if (userData) {
          console.log(
            `📂 User data loaded from database (online) for ${this.id}`
          );
        }
      }

      // If database load failed or returned null, try file storage as fallback
      if (!userData) {
        try {
          const filePath = path.join(this.dataDir, `user_${this.id}.json`);
          const data = await fs.readFile(filePath, "utf8");
          userData = JSON.parse(data);
          console.log(`📂 User data loaded from file (offline) for ${this.id}`);
        } catch (fileError) {
          console.log(
            `📂 No existing user data found for ${this.id} (this is normal for new conversations)`
          );
          return false;
        }
      }

      // Apply loaded data
      this.userProfile = userData.userProfile || {};
      this.compressionHistory = userData.compressionHistory || [];
      this.totalProcessedCount = userData.totalProcessedCount || 0;

      console.log(`📊 Loaded: ${this.totalProcessedCount} total processed`);
      return true;
    } catch (error) {
      console.error(`Failed to load user data: ${error.message}`);
      return false;
    }
  }

  // Get optimized messages for OpenAI API with compressed history
  getOptimizedMessages() {
    console.log(`\n🔍 BUILDING SYSTEM PROMPT for conversation ${this.id}`);
    console.log(`- Current messages in memory: ${this.messages.length}`);
    console.log(`- Compression chunks: ${this.compressionHistory.length}`);
    console.log(
      `- User profile fields: ${Object.keys(this.userProfile).length}`
    );

    const messages = [];

    // Build comprehensive system message with user profile and compression history
    let systemMessage =
      "You are a helpful AI assistant. IMPORTANT: Keep responses very short (1-2 sentences max), casual, and friendly - like texting a friend. Be extremely concise and conversational. No lists, no bullet points, just brief friendly responses.";

    // Add user profile information
    if (Object.keys(this.userProfile).length > 0) {
      console.log(`📋 Adding user profile data:`, this.userProfile);
      systemMessage += "\n\n=== USER PROFILE ===\n";
      if (this.userProfile.name)
        systemMessage += `Name: ${this.userProfile.name}\n`;
      if (this.userProfile.location)
        systemMessage += `Location: ${this.userProfile.location}\n`;
      if (this.userProfile.profession)
        systemMessage += `Profession: ${this.userProfile.profession}\n`;
      if (this.userProfile.interests && this.userProfile.interests.length > 0) {
        systemMessage += `Interests: ${this.userProfile.interests.join(
          ", "
        )}\n`;
      }
      if (
        this.userProfile.personalDetails &&
        this.userProfile.personalDetails.length > 0
      ) {
        systemMessage += `Personal Details: ${this.userProfile.personalDetails
          .slice(0, 3)
          .join(", ")}\n`;
      }
    }

    // Add compressed conversation history
    if (this.compressionHistory.length > 0) {
      console.log(
        `📚 Adding ${this.compressionHistory.length} compression chunks:`
      );
      systemMessage += "\n=== CONVERSATION HISTORY ===\n";
      this.compressionHistory.forEach((chunk, index) => {
        console.log(
          `  Chunk ${chunk.chunkNumber}: ${chunk.summary.substring(0, 100)}...`
        );
        systemMessage += `Chunk ${chunk.chunkNumber}: ${chunk.summary}\n`;
      });
    }

    console.log(
      `📝 Final system message length: ${
        systemMessage.length
      } chars (~${Math.ceil(systemMessage.length / 4)} tokens)`
    );

    messages.push({
      role: "system",
      content: systemMessage,
    });

    // Add current messages
    messages.push(...this.messages);

    console.log(
      `✅ Total messages to send to OpenAI: ${messages.length} (1 system + ${this.messages.length} conversation)`
    );
    return messages;
  }

  // Get conversation statistics
  getStats() {
    return {
      messageCount: this.messages.length,
      compressionChunks: this.compressionHistory.length,
      totalProcessedMessages: this.totalProcessedCount + this.messages.length,
      userProfileFields: Object.keys(this.userProfile).length,
      estimatedTokens: this.getOptimizedMessages().reduce(
        (sum, msg) => sum + Math.ceil(msg.content.length / 4),
        0
      ),
    };
  }
}

class AdvancedConversationManager {
  constructor(openaiClient, storageMode = "auto") {
    this.conversations = new Map();
    this.maxConversations = 100;
    this.openai = openaiClient;
    this.storageMode = storageMode;
    this.databaseStorage = null;

    // Initialize database storage if needed
    this.initializeManager();
  }

  async initializeManager() {
    const hasMongoConfig =
      process.env.MONGODB_URI && process.env.MONGODB_DB_NAME;
    const shouldUseDatabase =
      this.storageMode === "database" ||
      (this.storageMode === "auto" && hasMongoConfig);

    if (shouldUseDatabase) {
      // console.log('🏗️ Initializing conversation manager with database storage');
    } else {
      // console.log('🏗️ Initializing conversation manager with file storage');
    }
  }

  async getConversation(id = null) {
    if (!id) {
      // Create new conversation
      const conversation = new AdvancedConversation(
        null,
        this.openai,
        this.storageMode
      );
      await conversation.initializeStorage(); // Wait for storage initialization
      this.conversations.set(conversation.id, conversation);
      return conversation;
    }

    if (this.conversations.has(id)) {
      return this.conversations.get(id);
    }

    // Create conversation with specific ID and try to load existing data
    const conversation = new AdvancedConversation(
      id,
      this.openai,
      this.storageMode
    );
    await conversation.initializeStorage(); // Wait for storage initialization
    await conversation.loadUserData();
    this.conversations.set(id, conversation);
    return conversation;
  }

  async clearConversation(id) {
    if (this.conversations.has(id)) {
      this.conversations.delete(id);

      // Delete from appropriate storage based on mode
      try {
        if (this.useDatabase && this.databaseStorage) {
          // Delete from MongoDB
          await this.databaseStorage.deleteConversationData(id);
          console.log(`🗑️ Conversation data deleted from database for ${id}`);
        } else {
          // Delete from file storage
          const filePath = path.join("./data", `user_${id}.json`);
          await fs.unlink(filePath);
          console.log(`🗑️ User data file deleted for conversation ${id}`);
        }
      } catch (error) {
        console.log(`⚠️ Storage cleanup error for ${id}: ${error.message}`);
        // File doesn't exist, database not available, or other error
      }

      return true;
    }
    return false;
  }

  cleanup() {
    if (this.conversations.size > this.maxConversations) {
      const entries = Array.from(this.conversations.entries());
      const toRemove = entries.slice(0, entries.length - this.maxConversations);

      toRemove.forEach(([id]) => {
        this.conversations.delete(id);
      });

      console.log(`Cleaned up ${toRemove.length} old conversations`);
    }
  }

  getStats() {
    return {
      activeConversations: this.conversations.size,
      conversations: Array.from(this.conversations.values()).map((conv) => ({
        id: conv.id,
        ...conv.getStats(),
      })),
    };
  }
}

export default AdvancedConversationManager;
