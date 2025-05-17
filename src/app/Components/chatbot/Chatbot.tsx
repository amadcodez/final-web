'use client';
import { useEffect, useRef, useState } from 'react';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions = [
    'What are your shipping charges?',
    'How long does delivery take?',
    'What is your return policy?',
    'What payment methods do you accept?',
    'Can I track my order?',
  ];

  const predefinedAnswers: { [key: string]: string } = {
    'What are your shipping charges?': 'Shipping charges depend on the product. If the product price is more than 3000 PKR, you will get free shipping. Otherwise, a shipping fee of 200 PKR will apply.',
    'How long does delivery take?': 'Delivery usually takes 5–7 business days.',
    'What is your return policy?': 'We accept returns within 15 days as long as the product is not damaged.',
    'What payment methods do you accept?': 'We accept direct bank transfers, Easypaisa, JazzCash, SadaPay, NayaPay, and also Cash on Delivery.',
    'Can I track my order?': 'Yes! Visit our tracking page and enter your Order ID to track your order.',
  };

  useEffect(() => {
    const saved = localStorage.getItem('chatbotMessages');
    const savedTheme = localStorage.getItem('chatbotTheme');
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) setMessages(parsed);
    } catch (err) {
      console.error('Error parsing messages:', err);
    }
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    if (open) {
      localStorage.setItem('chatbotMessages', JSON.stringify(messages));
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    localStorage.setItem('chatbotTheme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSend = async (customMessage?: string) => {
    const msgToSend = customMessage || input;
    if (!msgToSend.trim()) return;

    const predefinedReply = predefinedAnswers[msgToSend];

    if (predefinedReply) {
      setMessages((prev) => [...prev, `You: ${msgToSend}`, `Bot: ${predefinedReply}`]);
      setInput('');
      return;
    }

    setMessages((prev) => [...prev, `You: ${msgToSend}`, `Bot: Typing...`]);
    setInput('');

    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msgToSend }),
    });

    const data = await res.json();

    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = `Bot: ${data.reply}`;
      return updated;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-[#fa4a00] text-white p-4 rounded-full shadow-lg hover:bg-[#e23f00] transition"
        >
          💬
        </button>
      ) : (
        <div
          className={`w-80 max-h-[550px] overflow-hidden border rounded-xl shadow-xl flex flex-col ${
            darkMode ? 'bg-[#1e1e1e] text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'
          }`}
        >
          {/* Header */}
          <div
            className={`flex justify-between items-center px-4 py-3 rounded-t-xl ${
              darkMode ? 'bg-[#333] text-white' : 'bg-[#fa4a00] text-white'
            }`}
          >
            <span className="font-semibold text-base">Ask Assistant</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-lg bg-transparent text-white hover:text-yellow-300 transition"
                title="Toggle Theme"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-black text-xl font-bold bg-transparent border-none outline-none"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Questions */}
          <div className={`px-4 py-2 text-sm ${darkMode ? 'bg-[#2a2a2a] text-gray-300' : 'bg-[#fff3ea] text-gray-700'} border-b`}>
            <p className="font-medium mb-2">💡 Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {predefinedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    darkMode
                      ? 'bg-transparent text-white border-gray-500 hover:bg-[#fa4a00]'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-[#fa4a00] hover:text-white'
                  } transition`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Chat */}
          <div className="flex justify-end px-4 pt-2">
            <button
              onClick={() => {
                localStorage.removeItem('chatbotMessages');
                setMessages([]);
              }}
              className="text-xs text-[#fa4a00] hover:underline bg-transparent border-none p-0"
            >
              🧹 Clear Chat
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className={`px-4 py-3 h-64 overflow-y-auto space-y-2 text-sm ${
              darkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'
            }`}
          >
            {messages.map((msg, i) => {
              const isUser = msg.startsWith('You:');
              const content = msg.replace('You: ', '').replace('Bot: ', '');
              return (
                <div
                  key={i}
                  className={`w-full flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && <div className="text-lg">🤖</div>}
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-xl ${
                      isUser
                        ? 'bg-[#fa4a00] text-white rounded-br-none'
                        : `border ${darkMode ? 'bg-[#2a2a2a] border-gray-700 text-white' : 'bg-white border text-gray-800'} rounded-bl-none`
                    }`}
                  >
                    {content}
                  </div>
                  {isUser && <div className="text-lg">🧑</div>}
                </div>
              );
            })}
          </div>

          {/* Input + Send */}
          <div className={`flex items-center border-t px-2 py-2 ${darkMode ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-200'}`}>
            <input
              className={`flex-1 p-2 text-sm border rounded-md mr-2 focus:outline-none ${
                darkMode
                  ? 'bg-[#1e1e1e] text-white border-gray-600 placeholder-gray-400'
                  : 'border-gray-300 text-gray-800'
              }`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              onClick={() => handleSend()}
              className="bg-[#fa4a00] text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-[#e23f00]"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
