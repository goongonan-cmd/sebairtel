import React from 'react';

const ConfirmationModal = ({ show, title, message, onConfirm, onCancel, darkMode }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className={`p-6 rounded-lg shadow-xl w-full max-w-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="mb-4">{message}</p>
                <div className="flex justify-end gap-2">
                    <button onClick={onCancel} className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>إلغاء</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white">تأكيد</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
