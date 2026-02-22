import React, { useEffect } from 'react';

const Toast = ({ message, show, onDismiss, darkMode }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onDismiss, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onDismiss]);
    return <div className={`fixed top-5 left-1/2 -translate-x-1/2 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'} ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'} px-4 py-2 rounded-lg shadow-lg z-[100]`}>{message}</div>
}

export default Toast;
