import ChatPresence from "./ChatPresence";

export default function ChatHeader() {
  return (
    <div className="h-10">
      <div className="p-5 border-b flex items-center justify-between h-full">
        <h1 className="text-xl font-bold">Chat</h1>
        <ChatPresence />
      </div>
    </div>
  );
}
