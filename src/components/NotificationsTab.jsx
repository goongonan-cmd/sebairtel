import React from 'react';
import { Bell } from 'lucide-react';

const NotificationsTab = ({ notifications, darkMode }) => {
  return (
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
  );
};

export default NotificationsTab;
