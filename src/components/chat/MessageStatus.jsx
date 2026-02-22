import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageStatus = ({ status }) => {
    if (status === 'seen') return <CheckCheck size={16} className="text-blue-500" />;
    if (status === 'delivered') return <CheckCheck size={16} className="text-gray-400" />;
    return <Check size={16} className="text-gray-400" />;
};

export default MessageStatus;
