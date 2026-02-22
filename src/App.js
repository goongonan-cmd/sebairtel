import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Phone, Video, User, Settings, 
  Moon, Sun, Send, Code,
  Share2, Heart, Edit3, Play,
  Copy, Download,
  Bell,
  Paperclip, MoreVertical, Check, CheckCheck, 
  MessageSquare, Trash2, CornerDownRight, X, File as FileIcon,
  MicOff, VideoOff, PhoneOff, Search, BellOff, XCircle, LogOut,
  Users as UsersGroupIcon, UserPlus, CheckCircle, ArrowLeft
} from 'lucide-react';

// --- Helper & Global Components ---

const NewSebairTelLogo = ({ className }) => (
    <svg width="36" height="36" viewBox="0 0 100 100" className={className}>
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#34D399'}} />
                <stop offset="50%" style={{stopColor: '#3B82F6'}} />
                <stop offset="100%" style={{stopColor: '#A78BFA'}} />
            </linearGradient>
        </defs>
        <path d="M50 10 A 40 40 0 1 1 49 10" stroke="url(#logoGradient)" strokeWidth="8" fill="none" transform="rotate(15 50 50)"/>
        <path d="M50 10 A 40 40 0 1 1 49 10" stroke="url(#logoGradient)" strokeWidth="8" fill="none" transform="rotate(90 50 50)"/>
        <path d="M10 50 A 40 40 0 1 1 10 49" stroke="url(#logoGradient)" strokeWidth="8" fill="none" transform="rotate(45 50 50)"/>
        <circle cx="20" cy="20" r="5" fill="url(#logoGradient)" />
        <circle cx="80" cy="20" r="5" fill="url(#logoGradient)" />
        <circle cx="20" cy="80" r="5" fill="url(#logoGradient)" />
        <circle cx="80" cy="80" r="5" fill="url(#logoGradient)" />
        <circle cx="50" cy="50" r="3" fill="white" />
    </svg>
);

const ConfirmationModal = ({ show, title, message, onConfirm, onCancel, darkMode }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`p-6 rounded-lg shadow-xl w-full max-w-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <h3 className="text-xl font-bold mb-4">{title}</h3>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            <button onClick={onCancel} className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>إلغاء</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg">تأكيد</button>
          </div>
        </div>
      </div>
    );
};

const Toast = ({ message, show, onDismiss, darkMode }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onDismiss, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onDismiss]);
    return <div className={`fixed top-5 left-1/2 -translate-x-1/2 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'} ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'} px-4 py-2 rounded-lg shadow-lg z-[100]`}>{message}</div>
}


const App = () => {
  const [activeTab, setActiveTab] = useState('social');
  const [selectedChat, setSelectedChat] = useState(null); // State lifted up
  const [darkMode, setDarkMode] = useState(false);
  const currentUser = { id: 1, name: 'أحمد محمد', avatar: '👨‍💻' };
  
  const initialMessages = [
    { id: 1, user: 'أحمد محمد', type: 'text', text: 'مرحباً! كيف حالك اليوم؟', time: '10:30', avatar: '👨‍💻', status: 'seen' },
    { id: 2, user: 'سارة أحمد', type: 'text', text: 'أعمل على مشروع جديد، هل يمكنك مساعدتي؟ https://example.com', time: '10:45', avatar: '👩‍🎨', status: 'seen', suggestions: ['بالتأكيد!', 'متى نبدأ؟', 'أنا مشغول الآن'] },
    { id: 3, user: 'أنت', type: 'text', text: 'أهلاً سارة، بالطبع يمكنني المساعدة.', time: '10:46', avatar: '👤', status: 'seen', replyTo: 2 },
    { id: 4, user: 'أحمد محمد', type: 'text', text: 'هذا رائع. هل يمكنك مراجعة هذا الكود؟\n```js\nfunction greet(name) {\n  return `Hello, ${name}! Welcome to interactive chat.`;\n}\nconsole.log(greet("Developer"));\n```', time: '10:50', avatar: '👨‍💻', status: 'seen' },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [showConfirmation, setShowConfirmation] = useState({show: false, action: null, title: '', message: ''});
  const [toast, setToast] = useState({ show: false, message: '' });
  const [settings, setSettings] = useState({ notifications: true, privacy: false });
  const [notifications, setNotifications] = useState([
      {id: 1, type: 'like', user: 'فاطمة سالم', message: 'أعجبها منشورك.', time: 'منذ 5 دقائق', isRead: false},
      {id: 2, type: 'comment', user: 'علياء', message: 'علقت على منشورك: "عمل رائع!"', time: 'منذ 15 دقيقة', isRead: false},
      {id: 3, type: 'request', user: 'خالد', message: 'أرسل لك طلب صداقة.', time: 'منذ ساعة', isRead: true},
  ]);

    const [allUsers, setAllUsers] = useState([
        { id: 1, name: 'أحمد محمد', avatar: '👨‍💻', isFriend: false, requestSent: false },
        { id: 2, name: 'سارة أحمد', avatar: '👩‍🎨', isFriend: true, requestSent: false },
        { id: 3, name: 'محمد العلي', avatar: '👨‍💼', isFriend: true, requestSent: false },
        { id: 4, name: 'فاطمة سالم', avatar: '👩‍🔬', isFriend: false, requestSent: false },
        { id: 5, name: 'علياء', avatar: '🧕', isFriend: false, requestSent: true },
        { id: 6, name: 'خالد', avatar: '🧑‍🚀', isFriend: false, requestSent: false },
    ]);
    const [friendRequests, setFriendRequests] = useState([
        { id: 7, name: 'يوسف', avatar: '🧑‍🔧' }
    ]);

  const addNotification = (notification) => {
      if (settings.notifications) {
          setNotifications(prev => [notification, ...prev]);
      }
  }

  const [posts, setPosts] = useState([
    { 
      id: 1, 
      user: 'محمد العلي', 
      avatar: '👨‍💼',
      content: 'تم إطلاق ميزة جديدة في SebairTel! استمتعوا بالترجمة الفورية والذكاء الاصطناعي المتطور 🚀',
      media: null,
      time: 'منذ ساعتين',
      likes: 24,
      isLiked: false,
      isSaved: false,
      comments: [
        {user: 'علياء', text: 'عمل رائع!'},
        {user: 'خالد', text: 'متحمس لتجربتها'}
      ]
    },
    {
      id: 2,
      user: 'فاطمة سالم',
      avatar: '👩‍🔬',
      content: 'شكراً لكم على SebairTel! أصبح التواصل والعمل أسهل بكثير مع الميزات الذكية 💙',
      media: {type: 'image', src: 'https://placehold.co/600x400/a3e635/172554?text=SebairTel+Screenshot'},
      time: 'منذ 4 ساعات',
      likes: 42,
      isLiked: true,
      isSaved: true,
      comments: []
    }
  ]);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };
  
  const handleShareToChat = (post) => {
     const baseMessage = {
        id: Date.now(),
        user: 'أنت',
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        avatar: '👤',
        status: 'sent',
    };
    
    let messageContent = `مشاركة منشور من ${post.user}:\n\n${post.content}`;
    let message;
    
    if (post.media) {
      message = {
        ...baseMessage,
        type: post.media.type,
        src: post.media.src,
        fileInfo: { name: `post_${post.id}` },
        text: messageContent
      };
    } else {
      message = {
        ...baseMessage,
        type: 'text',
        text: messageContent
      };
    }
    
    addMessage(message);
    setToast({ show: true, message: 'تمت مشاركة المنشور في الدردشة!' });
    setSelectedChat({id: 2, name: 'سارة أحمد'}); // Navigate to chat
    setActiveTab('community');
  };

  const confirmAction = () => {
    if (showConfirmation.show && showConfirmation.action) {
        showConfirmation.action();
    }
    setShowConfirmation({ show: false, action: null, title: '', message: ''});
  };

  const cancelAction = () => {
    setShowConfirmation({ show: false, action: null, title: '', message: '' });
  };
  
  const ChatTab = ({ chat, messages, setMessages, darkMode, addMessage, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  const typingTimeout = useRef(null);
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

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if(typingTimeout.current) clearTimeout(typingTimeout.current);
    setIsTyping(true);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 2000);
  }

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

  const MessageStatus = ({ status }) => {
    if (status === 'seen') return <CheckCheck size={16} className="text-blue-500" />;
    if (status === 'delivered') return <CheckCheck size={16} className="text-gray-400" />;
    return <Check size={16} className="text-gray-400" />;
  };
  
  const CodeBlock = ({ code, language, isRunnable = true }) => {
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [runMode, setRunMode] = useState(null); // 'js', 'html' or null

    const runCode = () => {
        setOutput(null); setError(null); setRunMode(null);

        const isHtml = /<[a-z][\s\S]*>/i.test(code);

        if (isHtml) {
            setRunMode('html');
        } else {
            setRunMode('js');
            const originalLog = console.log;
            let logs = [];
            console.log = (...args) => logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
            try {
                new Function(code)();
                setOutput(logs.join('\n'));
            } catch (e) {
                setError(e.toString());
            } finally {
                console.log = originalLog;
            }
        }
    };
    
    const copyCode = () => {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }

    return (
        <div className={`mt-2 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white font-mono`}>
            <div className={`flex justify-between items-center p-2 rounded-t-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-600'}`}>
                <span className="text-xs text-gray-300">{language || 'code'}</span>
                {isRunnable &&
                    <div className="flex gap-2">
                        <button onClick={copyCode} className="text-xs flex items-center gap-1 hover:text-green-400">
                            {isCopied ? <><Check size={14} /> تم النسخ</> : <><Copy size={14} /> نسخ</>}
                        </button>
                        <button onClick={runCode} className="text-xs flex items-center gap-1 hover:text-green-400">
                            <Play size={14} /> تشغيل
                        </button>
                    </div>
                }
            </div>
            <pre className="p-3 text-sm whitespace-pre-wrap text-green-300"><code>{code}</code></pre>
            {runMode === 'js' && output !== null && <pre className={`p-3 text-xs border-t ${darkMode ? 'border-gray-700' : 'border-gray-600'} whitespace-pre-wrap text-white`}>{output || ' '}</pre>}
            {runMode === 'js' && error && <pre className={`p-3 text-xs border-t ${darkMode ? 'border-gray-700' : 'border-gray-600'} whitespace-pre-wrap text-red-400`}>{error}</pre>}
            {runMode === 'html' && <iframe srcDoc={code} className="w-full h-64 border-t border-gray-700 bg-white" title="HTML Preview" sandbox="allow-scripts allow-same-origin"></iframe>}
        </div>
    );
  };

  const MessageActions = ({ message, onDelete }) => {
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

  const MessageContent = ({ message }) => {
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
                return <CodeBlock code={codeMatch[2]} language={codeMatch[1]} />;
            }
            return <span>{message.text}</span>;
    }
  };

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
            {isTyping && <span className="text-xs text-green-500">يكتب...</span>}
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
                  <MessageContent message={message} />
                  <div className="flex justify-end gap-2 mt-1">
                    <MessageStatus status={message.status} />
                  </div>
                  <MessageActions message={message} onDelete={handleDeleteMessage} />
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
                onChange={handleTyping}
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

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <Toast message={toast.message} show={toast.show} onDismiss={() => setToast({ show: false, message: '' })} darkMode={darkMode} />
      <ConfirmationModal {...showConfirmation} onConfirm={confirmAction} onCancel={cancelAction} darkMode={darkMode} />

      <header className="flex items-center justify-between px-4 py-2 shadow-sm bg-white dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <NewSebairTelLogo className="w-12 h-12" />
          <div>
            <h1 className="font-bold text-xl">SebairTel</h1>
            <span className="text-blue-600 text-sm">منصة الاتصالات الذكية</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            {darkMode ? <Sun /> : <Moon />}
          </button>
          <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"><Settings /></button>
        </div>
      </header>

      <nav className="flex justify-center gap-2 py-2 bg-gray-50 dark:bg-gray-900 border-b">
        <button className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTab === 'social' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`} onClick={() => setActiveTab('social')}>
          <UsersGroupIcon size={18} /> الشبكة
        </button>
        <button className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTab === 'community' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`} onClick={() => setActiveTab('community')}>
          <MessageCircle size={18} /> الدردشة
        </button>
        <button className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTab === 'notifications' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`} onClick={() => setActiveTab('notifications')}>
          <Bell size={18} /> الإشعارات
        </button>
        <button className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`} onClick={() => setActiveTab('profile')}>
          <User size={18} /> حسابي
        </button>
      </nav>

      <main className="flex-1 container mx-auto px-2 py-4">

        {activeTab === 'social' && (
          <div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><UsersGroupIcon /> منشورات الأصدقاء</h2>
            <div className="grid gap-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{post.avatar}</span>
                    <span className="font-bold">{post.user}</span>
                    <span className="text-xs text-gray-400">{post.time}</span>
                  </div>
                  <div className="mb-2">{post.content}</div>
                  {post.media && post.media.type === 'image' && <img src={post.media.src} alt="post" className="rounded-lg mb-2 max-w-full h-auto" />}
                  <div className="flex gap-2 mb-2">
                    <button className={`flex items-center gap-1 px-2 py-1 rounded ${post.isLiked ? 'bg-red-200 text-red-600' : 'bg-gray-200 dark:bg-gray-700'}`} onClick={() => {
                      setPosts(posts.map(p => p.id === post.id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
                    }}>
                      <Heart size={16} /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
                      <MessageSquare size={16} /> {post.comments.length}
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={() => handleShareToChat(post)}>
                      <Share2 size={16} /> مشاركة في الدردشة
                    </button>
                  </div>
                  {post.comments.length > 0 && (
                    <div className="border-t pt-2 mt-2">
                      <h4 className="font-semibold text-sm mb-1">تعليقات:</h4>
                      {post.comments.map((c, i) => (
                        <div key={i} className="text-xs text-gray-700 dark:text-gray-200 mb-1 flex gap-2 items-center">
                          <span className="font-bold">{c.user}:</span>
                          <span>{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><MessageCircle /> الدردشة</h2>
            {selectedChat ? (
              <ChatTab
                chat={selectedChat}
                messages={messages}
                setMessages={setMessages}
                darkMode={darkMode}
                addMessage={addMessage}
                onBack={() => setSelectedChat(null)}
              />
            ) : (
              <div className="grid gap-3 max-w-xl mx-auto">
                <h4 className="font-bold text-md mb-2">الأصدقاء</h4>
                {allUsers.filter(u => u.isFriend).map(user => (
                  <button key={user.id} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow w-full text-right" onClick={() => setSelectedChat({ id: user.id, name: user.name, avatar: user.avatar })}>
                    <span className="text-2xl">{user.avatar}</span>
                    <span className="font-bold">{user.name}</span>
                  </button>
                ))}

                {friendRequests.length > 0 && (
                  <>
                    <h4 className="font-bold text-md mt-4 mb-2">طلبات الصداقة</h4>
                    {friendRequests.map(req => (
                      <div key={req.id} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow">
                        <span className="text-2xl">{req.avatar}</span>
                        <span className="font-bold flex-1">{req.name}</span>
                        <button onClick={() => {
                          setAllUsers(prev => [...prev, { ...req, isFriend: true, requestSent: false }]);
                          setFriendRequests(prev => prev.filter(r => r.id !== req.id));
                          addNotification({ id: Date.now(), type: 'friend', user: req.name, message: 'أصبحتما أصدقاء الآن!', time: 'الآن', isRead: false });
                        }} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1">
                          <CheckCircle size={14} /> قبول
                        </button>
                        <button onClick={() => {
                          setFriendRequests(prev => prev.filter(r => r.id !== req.id));
                        }} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm">
                          رفض
                        </button>
                      </div>
                    ))}
                  </>
                )}

                <h4 className="font-bold text-md mt-4 mb-2">أشخاص قد تعرفهم</h4>
                {allUsers.filter(u => !u.isFriend && u.id !== currentUser.id).map(user => (
                  <div key={user.id} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow">
                    <span className="text-2xl">{user.avatar}</span>
                    <span className="font-bold flex-1">{user.name}</span>
                    {user.requestSent ? (
                      <span className="text-sm text-gray-400">تم الإرسال</span>
                    ) : (
                      <button onClick={() => {
                        setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, requestSent: true } : u));
                        setToast({ show: true, message: `تم إرسال طلب صداقة إلى ${user.name}` });
                      }} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1">
                        <UserPlus size={14} /> إضافة
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Bell /> الإشعارات</h2>
            <div className="max-w-xl mx-auto grid gap-3">
              {notifications.length === 0 && <div className="text-gray-400">لا توجد إشعارات بعد.</div>}
              {notifications.map(n => (
                <div key={n.id} className={`p-3 rounded-lg flex items-center gap-3 ${n.isRead ? 'bg-gray-100 dark:bg-gray-800' : 'bg-yellow-50 dark:bg-yellow-900'}`}>
                  <span className="text-2xl">{n.user[0]}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{n.user}</div>
                    <div className="text-sm">{n.message}</div>
                  </div>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><User /> حسابي</h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{currentUser.avatar}</span>
              <span className="font-bold text-xl">{currentUser.name}</span>
            </div>
            <div className="mb-2">إعدادات:</div>
            <label className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={settings.notifications} onChange={e => setSettings({...settings, notifications: e.target.checked})} />
              تفعيل الإشعارات
            </label>
            <label className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={settings.privacy} onChange={e => setSettings({...settings, privacy: e.target.checked})} />
              وضع الخصوصية
            </label>
            <div className="mt-4">
              <button className="px-4 py-2 rounded-lg bg-red-500 text-white flex items-center gap-2"><LogOut size={18} /> تسجيل الخروج</button>
            </div>
          </div>
        )}

      </main>

      <footer className="text-center py-6 text-gray-400 text-xs">
        SebairTel © جميع الحقوق محفوظة 2025
      </footer>
    </div>
  );
};

export default App;
