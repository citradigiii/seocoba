'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'loading';
  timestamp: Date;
}

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
}

// ✅ Perbaikan: Hapus titik di akhir domain (penting untuk menghindari error browser)
const CHATBOT_API_URL = 'https://api.sedulurtechnology.com/chatbot.php';

const Chat: React.FC<ChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo! Saya Ratna, AI Assistant yang siap membantu Anda 24/7. Ada yang bisa saya bantu?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const loadingMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingMessageId,
      text: 'Ratna sedang mengetik...',
      sender: 'loading',
      timestamp: new Date()
    }]);

    try {
      const response = await fetch(CHATBOT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.text }),
      });

      const responseText = await response.text();

      // ✅ Coba parse JSON manual
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        throw new Error(`Gagal parsing respons JSON: ${responseText}`);
      }

      console.log('✅ Respon dari chatbot.php:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      const aiText = data.response || 'Maaf, tidak ada jawaban dari chatbot.';

      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date()
      }]);

    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        text: 'Maaf, Ratna sedang tidak bisa merespons saat ini. Silakan coba lagi nanti atau hubungi CS WhatsApp.',
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={chatRef}
      className="fixed bottom-24 right-8 w-[90vw] sm:w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col z-50"
      style={{ maxHeight: 'calc(100vh - 120px)', minHeight: '400px' }}
    >
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://ik.imagekit.io/4hotelsolution/Ellipse%201.webp?updatedAt=1747834374892"
              alt="AI Assistant"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-medium text-white">Ratna</h3>
            <p className="text-xs text-blue-100">Online 24/7 Live</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:bg-blue-500 p-2 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="bg-green-50 p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaWhatsapp className="text-green-500 text-xl" />
          <div>
            <p className="text-sm font-medium text-gray-800">Citra Digital Hotel Order</p>
            <p className="text-xs text-gray-500">Pesan via WhatsApp</p>
          </div>
        </div>
        <a
          href="https://wa.me/6285198526632?text=Halo%2C%20saya%20tertarik%20membuat%20website%20untuk%20penginapan%20saya.%20Boleh%20dibantu%20info%20lebih%20lanjut%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          Chat & Order
        </a>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 ${message.sender === 'user'
                ? 'bg-blue-500 text-white'
                : message.sender === 'loading'
                  ? 'bg-gray-200 text-gray-600 italic animate-pulse'
                  : 'bg-gray-100 text-gray-800'
              }`}>
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ketik pesan Anda..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className={`p-2 rounded-full transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
