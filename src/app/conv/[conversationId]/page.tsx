"use client";

import { useParams } from "next/navigation";
import ChatPage from "../../chat/page";

interface ConversationPageProps {
  params: {
    conversationId: string;
  };
}

export default function ConversationPage({ params }: ConversationPageProps) {
  // This component renders the same ChatPage but with the conversation ID from the URL
  // The ChatPage component will automatically detect the conversation ID from the URL path
  return <ChatPage />;
}
