import React from 'react';

const NewSebairTelLogo = ({ className }) => (
    <svg width="36" height="36" viewBox="0 0 100 100" className={className}>
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#34D399'}} />
                <stop offset="50%" style={{stopColor: '#3B82F6'}} />
                <stop offset="100%" style={{stopColor: '#A78BFA'}} />
            </linearGradient>
        </defs>
        <path d="M50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10" fill="url(#logoGradient)" />
        <text x="50" y="60" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="Arial">ST</text>
    </svg>
);

export default NewSebairTelLogo;
