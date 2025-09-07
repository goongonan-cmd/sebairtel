// كل الكود الذي أرسلته سابقاً بدون تغيير حتى نهاية MessageContent ...

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

  // --- واجهة التطبيق الرئيسية ---

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <Toast message={toast.message} show={toast.show} onDismiss={() => setToast({ show: false, message: '' })} darkMode={darkMode} />
      <ConfirmationModal {...showConfirmation} onConfirm={confirmAction} onCancel={cancelAction} darkMode={darkMode} />

      {/* Header */}
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

      {/* Tabs */}
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

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-2 py-4">

        {/* Tab: Social Network */}
        {activeTab === 'social' && (
          <div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><UsersGroupIcon /> منشورات الأصدقاء</h2>
            <div className="grid gap-4">
              {posts.map(post => (
                <div key={post.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4`}>
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

        {/* Tab: Chat / Community */}
        {activeTab === 'community' && (
          <div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><MessageCircle /> الدردشة</h2>
            {selectedChat ? (
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow p-4 max-w-xl mx-auto">
                <button className="absolute left-2 top-2 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full" onClick={() => setSelectedChat(null)}><ArrowLeft size={16} /> رجوع</button>
                <h3 className="font-bold mb-2 flex items-center gap-2">{selectedChat.name} <User size={18} /></h3>
                <div className="max-h-96 overflow-y-auto py-2 space-y-3">
                  {messages.map(message => (
                    <div key={message.id} className={`group flex ${message.user === currentUser.name || message.user === 'أنت' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`relative p-3 rounded-lg max-w-xs ${message.user === currentUser.name || message.user === 'أنت' ? 'bg-blue-100 dark:bg-blue-900 text-right' : 'bg-gray-200 dark:bg-gray-700 text-left'}`}>
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
                <div className="mt-4 flex flex-col gap-2">
                  <textarea
                    ref={textareaRef}
                    className="w-full rounded-lg p-2 border focus:outline-blue-500 dark:bg-gray-900 dark:border-gray-700"
                    rows={1}
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="اكتب رسالة..."
                  />
                  <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                    <button onClick={() => fileInputRef.current.click()} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"><Paperclip size={18} /></button>
                    <button onClick={handleSendCode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"><Code size={18} /></button>
                    <button onClick={() => handleSendMessage()} className="p-2 rounded-full bg-blue-500 text-white"><Send size={18} /></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 max-w-xl mx-auto">
                <h4 className="font-bold text-md mb-2">اختر محادثة:</h4>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700" onClick={() => setSelectedChat({id: 2, name: 'سارة أحمد'})}>
                  <User size={18} /> سارة أحمد
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700" onClick={() => setSelectedChat({id: 1, name: 'أحمد محمد'})}>
                  <User size={18} /> أحمد محمد
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab: Notifications */}
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

        {/* Tab: Profile */}
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
              <button className="px-4 py-2 rounded-lg bg-red-500 text-white"><LogOut size={18} /> تسجيل الخروج</button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-xs">
        SebairTel © جميع الحقوق محفوظة 2025
      </footer>
    </div>
  );
};

export default App;
