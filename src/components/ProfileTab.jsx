import React from 'react';
import { User, LogOut, Trash2 } from 'lucide-react';

const ProfileTab = ({ currentUser, settings, setSettings, darkMode }) => {
  return (
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
      <div className="mt-3">
        <button 
          onClick={() => {
            if (window.confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 flex items-center gap-2 text-sm"
        >
          <Trash2 size={16} /> مسح جميع البيانات
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;
