import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const TOPICS = ["Anxiety", "Loneliness", "School Stress", "Family Issues", "Self-Esteem", "General"];

export default function SafeCircle() {
  const { user } = useAuth();
  const [topic, setTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [members, setMembers] = useState(0);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (!topic) return;
    const socket = io();
    socketRef.current = socket;
    socket.emit("join-safe-circle", { topic, userId: user?.id || "anon" });
    socket.on("circle-update", (data) => setMembers(data.members));
    socket.on("new-circle-message", (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.disconnect();
  }, [topic]);

  const send = () => {
    if (!input.trim()) return;
    socketRef.current?.emit("circle-message", { topic, message: input.trim(), userId: user?.id || "anon" });
    setInput("");
  };

  if (!topic) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 Safe Circle</h1>
        <p className="text-gray-500 mb-8">Join an anonymous peer support group by topic.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {TOPICS.map((t) => (
            <button key={t} onClick={() => setTopic(t)} className="bg-white border border-gray-200 rounded-2xl p-6 hover:bg-brand-50 hover:border-brand-300 transition text-center">
              <div className="text-lg font-semibold text-gray-900">{t}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Safe Circle: {topic}</h1>
          <p className="text-sm text-gray-500">{members} member{members !== 1 && "s"} online</p>
        </div>
        <button onClick={() => { setTopic(null); setMessages([]); }} className="text-sm text-danger-500 hover:text-danger-600">Leave</button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        {messages.map((m, i) => (
          <div key={i}>
            <span className="text-xs text-brand-500 font-mono">{m.userId}</span>
            <p className="text-sm text-gray-800">{m.message}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Share anonymously..." className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-400" />
        <button onClick={send} className="px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600">Send</button>
      </div>
    </div>
  );
}
