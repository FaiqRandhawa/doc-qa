import { useState } from 'react';

interface Source {
  text: string;
  distance: number;
}

interface AskResponse {
  question: string;
  sources: Source[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

function Chat() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/ask?question=${encodeURIComponent(question)}`,
        { method: 'POST' },
      );
      const data: AskResponse = await res.json();

      const topAnswer = data.sources[0]?.text ?? 'No relevant answer found.';

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: topAnswer, sources: data.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAsk();
  };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto px-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-white text-black'
                  : 'bg-zinc-900 text-zinc-100 border border-zinc-800'
              }`}
            >
              <p>{msg.content}</p>
              {msg.sources && (
                <details className="mt-2 text-xs text-zinc-500">
                  <summary className="cursor-pointer hover:text-zinc-300">
                    View {msg.sources.length} sources
                  </summary>
                  <div className="mt-2 flex flex-col gap-2">
                    {msg.sources.map((s, j) => (
                      <div
                        key={j}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg p-2"
                      >
                        <p className="text-zinc-400">
                          {s.text.slice(0, 150)}...
                        </p>
                        <p className="text-zinc-600 mt-1">
                          distance: {s.distance.toFixed(3)}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-500">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your document..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-white text-black hover:bg-zinc-200 transition-colors px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-50"
        >
          Ask
        </button>
      </div>
    </div>
  );
}

export default Chat;
