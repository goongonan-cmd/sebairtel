import React, { useState } from 'react';
import { Check, Copy, Play } from 'lucide-react';

const CodeBlock = ({ code, language, isRunnable = true, darkMode, setToast }) => {
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [runMode, setRunMode] = useState(null);

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

export default CodeBlock;
