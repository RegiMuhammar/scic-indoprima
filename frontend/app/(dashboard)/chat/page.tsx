import { Metadata } from "next"
import { ChatPanel } from "@/components/chat/ChatPanel"

export const metadata: Metadata = {
  title: "AI Analytics Copilot | SCIC Indoprima",
  description: "Asisten analitik cerdas manufaktur dan rantai pasok berbasis MotherDuck NL2SQL dan LangGraph multi-tier agent.",
}

export default function ChatPage() {
  return <ChatPanel />
}
