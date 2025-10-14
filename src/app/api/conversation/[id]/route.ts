import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import AdvancedConversationManager from "@/lib/advancedConversationManager";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize conversation manager
const conversationManager = new AdvancedConversationManager(openai);

// Get conversation history endpoint
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversation = await conversationManager.getConversation(id);
    const stats = conversation.getStats();

    return NextResponse.json({
      id: conversation.id,
      messages: conversation.messages,
      userProfile: conversation.userProfile,
      compressionHistory: conversation.compressionHistory,
      stats: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }
}

// Clear conversation endpoint
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await conversationManager.clearConversation(id);
    return NextResponse.json({ message: "Conversation and user data cleared" });
  } catch (error) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }
}
