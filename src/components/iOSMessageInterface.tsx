
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft, Phone, Video, Info } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  isTyping?: boolean;
}

interface IOSMessageInterfaceProps {
  agent: Agent;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onBack: () => void;
}

export const IOSMessageInterface: React.FC<IOSMessageInterfaceProps> = ({
  agent,
  messages,
  onSendMessage,
  onBack
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'sent': return <span className="text-xs text-white/70">✓</span>;
      case 'delivered': return <span className="text-xs text-white/70">✓✓</span>;
      case 'read': return <span className="text-xs text-white/70">Read</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      {/* iOS Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1 hover:bg-gray-100/50 rounded-full w-8 h-8"
          >
            <ArrowLeft className="w-5 h-5 text-blue-500" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-8 h-8">
                <AvatarImage src={agent.avatar} alt={agent.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                agent.status === 'online' ? 'bg-green-500' : 
                agent.status === 'busy' ? 'bg-red-500' : 
                agent.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
              }`} />
            </div>
            
            <div>
              <h2 className="font-semibold text-black text-sm leading-tight">{agent.name}</h2>
              <p className="text-xs text-gray-500">
                {agent.isTyping ? 'typing...' : agent.status}
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100/50 rounded-full w-8 h-8">
            <Phone className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100/50 rounded-full w-8 h-8">
            <Video className="w-4 h-4 text-blue-500" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-white">
        {messages.map((message, index) => {
          const showTimestamp = index === 0 || 
            new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000;
          
          const isConsecutive = index > 0 && 
            messages[index - 1].sender === message.sender && 
            new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() < 60000;
          
          return (
            <div key={message.id} className="mb-1">
              {showTimestamp && (
                <div className="text-center text-xs text-gray-500 mb-4 mt-4">
                  {formatTime(message.timestamp)}
                </div>
              )}
              
              <div className={`flex items-end space-x-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mb-1' : 'mb-2'}`}>
                <div className={`ios-message-bubble ${message.sender} ${isConsecutive ? 'mb-0' : ''}`}>
                  <p className="text-sm leading-relaxed break-words">{message.content}</p>
                </div>
              </div>
              
              {message.sender === 'user' && !isConsecutive && (
                <div className="flex justify-end mr-2 mt-1">
                  {getStatusIndicator(message.status)}
                </div>
              )}
            </div>
          );
        })}
        
        {agent.isTyping && (
          <div className="flex justify-start mb-4">
            <div className="ios-message-bubble agent">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* iOS Input Area */}
      <div className="bg-white border-t border-gray-200/50 px-4 py-3 safe-area-bottom">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="iMessage"
              className="rounded-full border border-gray-300 pr-12 bg-gray-100/50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm min-h-[36px] py-2"
              maxLength={1000}
            />
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`w-8 h-8 rounded-full p-0 transition-all duration-200 ${
              newMessage.trim() 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
