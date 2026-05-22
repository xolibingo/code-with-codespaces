import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  timestamp: string;
}

const BOT_RESPONSES: Record<string, string> = {
  track: 'To track your package, go to the Track page and enter your tracking number (starts with BC). You can also visit /track on our website.',
  tracking: 'To track your package, go to the Track page and enter your tracking number (starts with BC). You can also visit /track on our website.',
  price: 'Our pricing starts from R315/kg for ZA→BW routes. Visit our Pricing page for the full breakdown, or use the Rate Calculator on our homepage to get an instant quote.',
  pricing: 'Our pricing starts from R315/kg for ZA→BW routes. Visit our Pricing page for the full breakdown, or use the Rate Calculator on our homepage to get an instant quote.',
  quote: 'Use our Rate Calculator on the homepage to get an instant quote! Just select your origin, destination, weight, and whether you need clearance documents.',
  route: 'We serve 5 routes: ZA→ZW (3-5 days), ZA→BW (2-3 days), ZA→ZM (5-7 days), ZA→MZ (3-4 days), ZA→NA (4-5 days). Visit our Routes page for details.',
  routes: 'We serve 5 routes: ZA→ZW (3-5 days), ZA→BW (2-3 days), ZA→ZM (5-7 days), ZA→MZ (3-4 days), ZA→NA (4-5 days). Visit our Routes page for details.',
  clearance: 'Clearance documentation service costs R200 extra. Our customs agent will handle all paperwork for your cross-border shipment.',
  customs: 'Clearance documentation service costs R200 extra. Our customs agent will handle all paperwork for your cross-border shipment.',
  contact: 'You can reach us at info@bingocouriers.co.za, call +27 000 000 0000, or WhatsApp us at wa.me/27000000000. We respond within 24 hours.',
  whatsapp: 'Chat with us on WhatsApp: wa.me/27000000000. Just click the link and send us your query!',
  truck: 'We offer truck rental at R3,150/day. Log in to your dashboard and go to "Request Truck" to book a truck for your cargo delivery.',
  discount: 'Our first 50 users get a 10% discount automatically! You can also use a referral code from a friend to get benefits.',
  referral: 'Share your unique referral code from your Profile page. When friends sign up using your code, you both benefit!',
  register: 'Sign up at bingocouriers.co.za/signup. The first 50 users get a 10% discount automatically!',
  signup: 'Sign up at bingocouriers.co.za/signup. The first 50 users get a 10% discount automatically!',
  help: 'I can help you with: tracking packages, pricing information, route details, clearance documents, truck rental, and contacting us. What do you need?',
};

const GREETING = "Hello! I'm Bingo, your virtual courier assistant. How can I help you today? You can ask about tracking, pricing, routes, clearance documents, or anything else!";

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return "I'm not sure about that. You can ask me about tracking, pricing, routes, clearance, truck rental, or contact information. Or call us at +27 000 000 0000!";
}

const STORAGE_KEY = 'bc_chatbot_history';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [{ id: '1', role: 'bot', text: GREETING, timestamp: new Date().toISOString() }];
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
  }, [messages]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };
    const botResponse = getBotResponse(input.trim());
    const botMsg: Message = {
      id: crypto.randomUUID(),
      role: 'bot',
      text: botResponse,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = ['Track my package', 'Get a quote', 'View routes', 'Contact support'];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-brand-600 hover:bg-brand-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        aria-label="Open chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-h-[500px]">
          {/* Header */}
          <div className="bg-brand-600 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Bingo Assistant</div>
              <div className="text-xs text-orange-200 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                Online
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ maxHeight: 300 }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'bot' ? 'bg-brand-100' : 'bg-brand-600'
                  }`}>
                    {msg.role === 'bot' ? (
                      <Bot className="w-4 h-4 text-brand-600" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 flex flex-wrap gap-1 border-t border-gray-100">
              {quickReplies.map(reply => (
                <button
                  key={reply}
                  onClick={() => {
                    setInput(reply);
                    setTimeout(() => sendMessage(), 50);
                  }}
                  className="text-xs bg-brand-50 text-brand-700 hover:bg-brand-100 px-2 py-1 rounded-full transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg p-2 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
