import React from 'react';
import { File as FileIcon } from 'lucide-react';
import CodeBlock from './CodeBlock';

const MessageContent = ({ message, darkMode, formatFileSize, setToast }) => {
    switch (message.type) {
        case 'image':
            return (
                <div>
                    <img src={message.src} alt={message.fileInfo?.name || 'Image'} className="rounded-lg max-w-full h-auto" />
                    {message.text && <p className="text-sm mt-2">{message.text}</p>}
                </div>
            );
        case 'video':
            return (
                <div>
                    <video src={message.src} controls className="rounded-lg max-w-full h-auto bg-black">
                        متصفحك لا يدعم عرض الفيديو.
                    </video>
                    {message.text && <p className="text-sm mt-2">{message.text}</p>}
                </div>
            );
        case 'file':
            return (
                <div className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                    <FileIcon size={32} className="flex-shrink-0" />
                    <div className="overflow-hidden">
                        <p className="font-semibold text-sm truncate">{message.fileInfo.name}</p>
                        <p className="text-xs opacity-80">{formatFileSize(message.fileInfo.size)}</p>
                    </div>
                </div>
            );
        default: // text
            const codeBlockRegex = /```(\w+)?\n([\s\S]+?)```/;
            const codeMatch = !message.deleted && message.text && message.text.match(codeBlockRegex);
            if (codeMatch) {
                return <CodeBlock code={codeMatch[2]} language={codeMatch[1]} darkMode={darkMode} setToast={setToast} />;
            }
            return <span>{message.text}{message.edited && <span className="text-xs text-gray-400 mr-1">(معدّل)</span>}</span>;
    }
};

export default MessageContent;
