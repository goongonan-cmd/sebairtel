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
            const codeMatch = !message.deleted && message.text
