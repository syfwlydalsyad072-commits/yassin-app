
import React, { useEffect, useState } from 'react';
import { Message } from '../types';
import { marked } from 'marked';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isYassin = message.role === 'model';
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const parse = async () => {
      const html = await marked.parse(message.content);
      setHtmlContent(html);
    };
    parse();
  }, [message.content]);

  return (
    <div className={`flex w-full mb-4 animate-message ${isYassin ? 'justify-start' : 'justify-end'}`}>
      <div className={`group relative max-w-[90%] md:max-w-[70%] rounded-2xl p-4 shadow-xl border transition-all duration-300 hover:scale-[1.005] ${
        isYassin 
        ? 'bg-black/70 backdrop-blur-xl border-white/10 text-gray-100 rounded-tr-none' 
        : 'bg-red-600/15 border-red-500/40 text-white rounded-tl-none'
      }`}>
        {isYassin && (
          <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-1.5">
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
               ياسين <span className="text-[8px] text-gray-500 opacity-50">ヤシン</span>
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${message.mood === 'epic' ? 'bg-yellow-400 animate-pulse shadow-[0_0_5px_#facc15]' : 'bg-green-500 shadow-[0_0_5px_#22c55e]'}`}></div>
          </div>
        )}
        
        <div 
          className="prose prose-invert prose-xs max-w-none text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        
        {isYassin && message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-2 border-t border-white/5">
            <p className="text-[8px] text-gray-600 mb-1.5 uppercase font-black tracking-widest">المصادر 🔍</p>
            <div className="flex flex-wrap gap-1.5">
              {message.sources.map((source, idx) => (
                <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg transition-all text-blue-400 border border-white/5 truncate max-w-[150px]">
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
        
        <span className="absolute bottom-[-15px] text-[8px] text-gray-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
          {new Date(message.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
