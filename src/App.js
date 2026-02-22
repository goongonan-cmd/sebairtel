import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, User, Settings, 
  Moon, Sun,
  Bell,
  Users as UsersGroupIcon
} from 'lucide-react';

import NewSebairTelLogo from './components/NewSebairTelLogo';
import ConfirmationModal from './components/ConfirmationModal';
import Toast from './components/Toast';
import SocialFeed from './components/SocialFeed';
import NotificationsTab from './components/NotificationsTab';
import ProfileTab from './components/ProfileTab';
import ChatTab from './components/chat/ChatTab';
import ChatContactList from './components/chat/ChatContactList';

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

  const defaultSettings = { notifications: true, privacy: false };
  const defaultNotifications = [
      {id: 1, type: 'like', user: 'فاطمة سالم', message: 'أعجبها منشورك.', time: 'منذ 5 دقائق', isRead: false},
      {id: 2, type: 'comment', user: 'علياء', message: 'علقت على منشورك: "عمل رائع!"', time: 'منذ 15 دقيقة', isRead: false},
      {id: 3, type: 'request', user: 'خالد', message: 'أرسل لك طلب صداقة.', time: 'منذ ساعة', isRead: true},
  ];
  const defaultAllUsers = [
      { id: 1, name: 'أحمد محمد', avatar: '👨‍💻', isFriend: false, requestSent: false },
      { id: 2, name: 'سارة أحمد', avatar: '👩‍🎨', isFriend: true, requestSent: false },
      { id: 3, name: 'محمد العلي', avatar: '👨‍💼', isFriend: true, requestSent: false },
      { id: 4, name: 'فاطمة سالم', avatar: '👩‍🔬', isFriend: false, requestSent: false },
      { id: 5, name: 'علياء', avatar: '🧕', isFriend: false, requestSent: true },
      { id: 6, name: 'خالد', avatar: '🧑‍🚀', isFriend: false, requestSent: false },
  ];
  const defaultFriendRequests = [
      { id: 7, name: 'يوسف', avatar: '🧑‍🔧' }
  ];

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('sebairtel-messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });
  const [showConfirmation, setShowConfirmation] = useState({show: false, action: null, title: '', message: ''});
  const [toast, setToast] = useState({ show: false, message: '' });
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sebairtel-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('sebairtel-notifications');
    return saved ? JSON.parse(saved) : defaultNotifications;
  });

    const [allUsers, setAllUsers] = useState(() => {
      const saved = localStorage.getItem('sebairtel-allUsers');
      return saved ? JSON.parse(saved) : defaultAllUsers;
    });
    const [friendRequests, setFriendRequests] = useState(() => {
      const saved = localStorage.getItem('sebairtel-friendRequests');
      return saved ? JSON.parse(saved) : defaultFriendRequests;
    });

  const addNotification = (notification) => {
      if (settings.notifications) {
          setNotifications(prev => [notification, ...prev]);
      }
  }

  const defaultPosts = [
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
  ];

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('sebairtel-posts');
    return saved ? JSON.parse(saved) : defaultPosts;
  });

  useEffect(() => {
    localStorage.setItem('sebairtel-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('sebairtel-posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('sebairtel-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('sebairtel-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sebairtel-allUsers', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('sebairtel-friendRequests', JSON.stringify(friendRequests));
  }, [friendRequests]);

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
          <SocialFeed posts={posts} setPosts={setPosts} darkMode={darkMode} handleShareToChat={handleShareToChat} currentUser={currentUser} />
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
                setToast={setToast}
                setShowConfirmation={setShowConfirmation}
              />
            ) : (
              <ChatContactList
                allUsers={allUsers}
                setAllUsers={setAllUsers}
                friendRequests={friendRequests}
                setFriendRequests={setFriendRequests}
                currentUser={currentUser}
                darkMode={darkMode}
                setSelectedChat={setSelectedChat}
                setToast={setToast}
                addNotification={addNotification}
              />
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <NotificationsTab notifications={notifications} setNotifications={setNotifications} darkMode={darkMode} />
        )}

        {activeTab === 'profile' && (
          <ProfileTab currentUser={currentUser} settings={settings} setSettings={setSettings} darkMode={darkMode} />
        )}

      </main>

      <footer className="text-center py-6 text-gray-400 text-xs">
        SebairTel © جميع الحقوق محفوظة 2025
      </footer>
    </div>
  );
};

export default App;
