import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiShoppingCart, FiX, FiSend } from 'react-icons/fi';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi there! I'm your shopping assistant. Ask me about products, orders, or recommendations!",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const response = await axios.post('http://localhost:8000/api/ai/chat', {
                message: inputMessage,
            });

            const botMessage = {
                id: messages.length + 2,
                text: response.data.response,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: messages.length + 2,
                text: "Sorry, I'm having trouble connecting. Please try again later.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString(),
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen) {
    return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 pl-4 pr-5 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50 flex items-center"
            aria-label="Open chat"
        >
            <FiShoppingCart size={24} className="mr-2" />
            <span className="font-medium">Chat with us</span>
        </button>
    );
}
    return (
        <div className="fixed bottom-8 right-8 w-80 h-[500px] flex flex-col bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 z-50">
            {/* Chat header */}
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {/* Replace with your logo */}
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <FiShoppingCart className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold">ShopAssist</h3>
                        <p className="text-xs text-white/80">Your personal shopping helper</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-indigo-200"
                    aria-label="Close chat"
                >
                    <FiX size={20} />
                </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs p-3 rounded-lg ${msg.sender === 'user'
                                ? 'bg-indigo-100 text-indigo-900'
                                : 'bg-gray-100 text-gray-900'}`}
                        >
                            <p>{msg.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 text-gray-900 max-w-xs p-3 rounded-lg">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={e => setInputMessage(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputMessage.trim()}
                        className="bg-indigo-600 text-white p-2 rounded-r-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                    >
                        <FiSend size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
