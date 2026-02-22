import React, { useState, useEffect, useRef } from 'react';
import {
  Phone, Video, Send, Code,
  Edit3,
  Paperclip, MoreVertical,
  CornerDownRight, X, File as FileIcon,
  MicOff, VideoOff, PhoneOff, Search, BellOff, XCircle,
  ArrowLeft, Trash2
} from 'lucide-react';
import MessageStatus from './MessageStatus';
import MessageActions from './MessageActions';
import MessageContent from './MessageContent';

const ChatTab = ({ chat, messages, setMessages, darkMode, addMessage, onBack, setToast, setShowConfirmation }) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const handleSendMessage = (content) => {
    const textToSend = content || newMessage;
    if (!textToSend.trim() && !attachment) return;

    let message;
    const baseMessage = {
        id: Date.now(),
        user: 'أنت',
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        avatar: '👤',
        status: 'sent',
        replyTo: replyingTo ? replyingTo.id : null
    };

    if (attachment) {
        message = { ...baseMessage, ...attachment, text: textToSend };
    } else {
        message = { ...baseMessage, type: 'text', text: textToSend };
    }
    
    addMessage(message);
    setNewMessage('');
    setAttachment(null);
    setReplyingTo(null);
  };
  
  const handleSendCode = () => {
    if (!newMessage.trim()) return;
    const codeMessage = `\`\`\`js\n${newMessage}\n\`\`\``;
    handleSendMessage(codeMessage);
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const fileDataUrl = event.target.result;
        if (file.type.startsWith('image/')) {
            setAttachment({ type: 'image', src: fileDataUrl, fileInfo: { name: file.name, type: file.type } });
        } else if (file.type.startsWith('video/')) {
            setAttachment({ type: 'video', src: fileDataUrl, fileInfo: { name: file.name, type: file.type } });
        } else {
            setAttachment({ type: 'file', src: fileDataUrl, fileInfo: { name: file.name, size: file.size, type: file.type } });
        }
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };
  
  const startCall = (type) => {
    setCallType(type);
    setInCall(true);
  }

  const endCall = () => {
    setInCall(false);
    setCallType(null);
  }
  
  const handleMenuAction = (action) => {
    setIsMenuOpen(false);
    switch(action) {
        case 'search':
            setToast({ show: true, message: 'سيتم تفعيل خاصية البحث قريباً!' });
            break;
        case 'mute':
            setIsMuted(!isMuted);
            setToast({ show: true, message: isMuted ? 'تم إلغاء كتم الصوت' : 'تم كتم الإشعارات' });
            break;
        case 'clear':
            setShowConfirmation({
                show: true,
                title: 'مسح المحادثة',
                message: 'هل أنت متأكد أنك تريد مسح جميع الرسائل في هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.',
                action: () => { setMessages([]); setIsBlocked(false); },
            });
            break;
        case 'block':
            setShowConfirmation({
                show: true,
                title: 'حظر المستخدم',
                message: 'هل أنت متأكد أنك تريد حظر هذا المستخدم؟ لن تتمكن من إرسال أو استقبال رسائل منه.',
                action: () => setIsBlocked(true),
            });
            break;
        default:
            break;
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const handleDeleteMessage = (messageId) => {
     setMessages(messages.filter(m => m.id !== messageId));
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow max-w-xl mx-auto flex flex-col" style={{ height: '70vh' }}>
      {inCall && (
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl flex flex-col items-center justify-center text-white">
          <span className="text-5xl mb-4">{chat.avatar || '👤'}</span>
          <h3 className="text-xl font-bold mb-1">{chat.name}</h3>
          <p className="text-sm text-gray-300 mb-6">{callType === 'video' ? 'مكالمة فيديو' : 'مكالمة صوتية'}...</p>
          <div className="flex gap-4">
            <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'}`}>
              <MicOff size={20} />
            </button>
            {callType === 'video' && (
              <button className="p-3 rounded-full bg-gray-600">
                <VideoOff size={20} />
              </button>
            )}
            <button onClick={endCall} className="p-3 rounded-full bg-red-600">
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ArrowLeft size={20} />
          </button>
          <span className="text-2xl">{chat.avatar || '👤'}</span>
          <div>
            <h3 className="font-bold text-sm">{chat.name}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => startCall('voice')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <Phone size={18} />
          </button>
          <button onClick={() => startCall('video')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <Video size={18} />
          </button>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <MoreVertical size={18} />
            </button>
            {isMenuOpen && (
              <div className={`absolute left-0 top-full mt-1 w-48 rounded-lg shadow-lg z-30 ${darkMode ? 'bg-gray-700' : 'bg-white'} border dark:border-gray-600`}>
                <button onClick={() => handleMenuAction('search')} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg">
                  <Search size={16} /> بحث
                </button>
                <button onClick={() => handleMenuAction('mute')} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                  <BellOff size={16} /> {isMuted ? 'إلغاء الكتم' : 'كتم الإشعارات'}
                </button>
                <button onClick={() => handleMenuAction('clear')} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                  <Trash2 size={16} /> مسح المحادثة
                </button>
                <button onClick={() => handleMenuAction('block')} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-b-lg">
                  <XCircle size={16} /> حظر المستخدم
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isBlocked ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <XCircle size={48} className="mb-2" />
          <p className="font-bold">تم حظر هذا المستخدم</p>
          <p className="text-sm">لن تتمكن من إرسال أو استقبال رسائل</p>
          <button onClick={() => setIsBlocked(false)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">إلغاء الحظر</button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map(message => (
              <div key={message.id} className={`group flex ${message.user === 'أنت' ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative p-3 rounded-lg max-w-xs ${message.user === 'أنت' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  {message.replyTo && (
                    <div className={`text-xs mb-1 p-1 rounded border-r-2 border-blue-400 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                      <CornerDownRight size={12} className="inline ml-1" />
                      رد على رسالة
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{message.avatar}</span>
                    <span className="font-semibold text-xs">{message.user}</span>
                    <span className="text-xs text-gray-400">{message.time}</span>
                  </div>
                  <MessageContent message={message} darkMode={darkMode} formatFileSize={formatFileSize} setToast={setToast} />
                  <div className="flex justify-end gap-2 mt-1">
                    <MessageStatus status={message.status} />
                  </div>
                  <MessageActions message={message} onDelete={handleDeleteMessage} setToast={setToast} />
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          {replyingTo && (
            <div className={`flex items-center justify-between px-3 py-2 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-2 text-sm">
                <CornerDownRight size={14} className="text-blue-500" />
                <span>رد على: <strong>{replyingTo.user}</strong></span>
              </div>
              <button onClick={() => setReplyingTo(null)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                <X size={14} />
              </button>
            </div>
          )}

          {editingMessage && (
            <div className={`flex items-center justify-between px-3 py-2 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-2 text-sm">
                <Edit3 size={14} className="text-yellow-500" />
                <span>تعديل الرسالة</span>
              </div>
              <button onClick={() => setEditingMessage(null)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                <X size={14} />
              </button>
            </div>
          )}

          {attachment && (
            <div className={`flex items-center gap-2 px-3 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {attachment.type === 'image' && <img src={attachment.src} alt="preview" className="w-16 h-16 object-cover rounded" />}
              {attachment.type === 'video' && <Video size={24} className="text-blue-500" />}
              {attachment.type === 'file' && <FileIcon size={24} />}
              <span className="text-sm flex-1 truncate">{attachment.fileInfo?.name}</span>
              <button onClick={() => setAttachment(null)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="p-3 border-t dark:border-gray-700">
            <div className="flex items-end gap-2">
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
              <button onClick={() => fileInputRef.current.click()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0">
                <Paperclip size={18} />
              </button>
              <textarea
                ref={textareaRef}
                className={`flex-1 rounded-lg p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                rows={1}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                placeholder="اكتب رسالة..."
              />
              <button onClick={handleSendCode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0">
                <Code size={18} />
              </button>
              <button onClick={() => handleSendMessage()} className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 flex-shrink-0">
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatTab;
