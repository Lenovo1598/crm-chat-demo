'use client';
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function MessageContent({ content, isUser }: { content: string; isUser: boolean }) {
  const parts = content.split(URL_REGEX);
  return (
    <>
      {parts.map((part, i) =>
        URL_REGEX.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline break-all ${isUser ? 'text-white/90 hover:text-white' : 'text-green-400 hover:text-green-300'}`}
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  loading: boolean;
}

export default function ChatPanel({ messages, onSendMessage, loading }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function handleSend() {
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput('');
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="p-4 md:p-8 border-b border-white/10">
        <p className="text-xs text-green-400/70 italic mb-2">✦ Demo en vivo</p>
        <h1 className="text-2xl md:text-4xl text-white mb-2 md:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Conversá con <em>BriqIA</em>
        </h1>
        <p className="text-sm text-white/40 max-w-lg leading-relaxed hidden sm:block">
          Probá el copiloto en tiempo real. Hacele preguntas, pedile que simule un cliente
          o que califique un lead. La conversación se mantiene mientras no reinicies.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 relative">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/8 border border-white/10 text-white/90'
              }`}
            >
              <MessageContent content={msg.content} isUser={msg.role === 'user'} />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-white/8 border border-white/10 px-4 py-3 rounded-2xl">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-green-400/60 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-green-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-green-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/10 p-4 bg-black/20">
        <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 px-4 py-3">
          <input
            type="text"
            placeholder="Escribí un mensaje"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
            className="flex-1 outline-none text-sm bg-transparent text-white placeholder-white/30 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-400 disabled:opacity-30 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-white/20 mt-2">Enter para enviar · Shift + Enter para salto de línea</p>
      </div>
    </div>
  );
}
