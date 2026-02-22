import React from 'react';
import { Download, Share2, Trash2 } from 'lucide-react';

const MessageActions = ({ message, onDelete, setToast }) => {
    const handleDownload = () => {
        if (!message.src) return;
        const a = document.createElement('a');
        a.href = message.src;
        a.download = message.fileInfo.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleShare = async () => {
        if (navigator.share && message.src) {
            try {
                const response = await fetch(message.src);
                const blob = await response.blob();
                const file = new File([blob], message.fileInfo.name, { type: message.fileInfo.type });
                await navigator.share({
                    title: 'SebairTel File',
                    text: `Check out this file: ${message.fileInfo.name}`,
                    files: [file],
                });
            } catch (error) {
                console.error('Error sharing', error);
                setToast({ show: true, message: 'لا يمكن مشاركة الملف.' });
            }
        } else {
            setToast({ show: true, message: 'خاصية المشاركة غير مدعومة في متصفحك.' });
        }
    };
      
    return (
        <div className="absolute top-0 -left-8 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 bg-gray-300 dark:bg-gray-600 p-1 rounded-md">
            <button onClick={handleDownload} title="تنزيل" className="hover:bg-gray-400 dark:hover:bg-gray-500 p-1 rounded"><Download size={16} /></button>
            <button onClick={handleShare} title="مشاركة" className="hover:bg-gray-400 dark:hover:bg-gray-500 p-1 rounded"><Share2 size={16} /></button>
            <button onClick={() => onDelete(message.id)} title="حذف" className="hover:bg-gray-400 dark:hover:bg-gray-500 p-1 rounded"><Trash2 size={16} /></button>
        </div>
    )
}

export default MessageActions;
