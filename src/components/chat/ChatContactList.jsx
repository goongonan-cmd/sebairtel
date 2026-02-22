import React from 'react';
import { CheckCircle, UserPlus } from 'lucide-react';

const ChatContactList = ({ allUsers, setAllUsers, friendRequests, setFriendRequests, currentUser, darkMode, setSelectedChat, setToast, addNotification, messagesMap }) => {
  return (
    <div className="grid gap-3 max-w-xl mx-auto">
      <h4 className="font-bold text-md mb-2">الأصدقاء</h4>
      {allUsers.filter(u => u.isFriend).map(user => {
        const contactMessages = messagesMap[user.id] || [];
        const lastMsg = contactMessages[contactMessages.length - 1];
        return (
          <button key={user.id} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow w-full text-right" onClick={() => setSelectedChat({ id: user.id, name: user.name, avatar: user.avatar })}>
            <span className="text-2xl">{user.avatar}</span>
            <div className="flex-1 min-w-0">
              <span className="font-bold block">{user.name}</span>
              {lastMsg && (
                <span className="text-xs text-gray-400 block truncate">
                  {lastMsg.user === 'أنت' ? 'أنت: ' : ''}{lastMsg.text ? lastMsg.text.substring(0, 40) : (lastMsg.type === 'image' ? '📷 صورة' : lastMsg.type === 'video' ? '🎥 فيديو' : '📎 ملف')}
                </span>
              )}
            </div>
            {lastMsg && <span className="text-xs text-gray-400 flex-shrink-0">{lastMsg.time}</span>}
          </button>
        );
      })}

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
  );
};

export default ChatContactList;
