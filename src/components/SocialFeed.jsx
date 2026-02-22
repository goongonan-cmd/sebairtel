import React from 'react';
import { Heart, MessageSquare, Share2, Users as UsersGroupIcon } from 'lucide-react';

const SocialFeed = ({ posts, setPosts, darkMode, handleShareToChat }) => {
  return (
    <div>
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><UsersGroupIcon /> منشورات الأصدقاء</h2>
      <div className="grid gap-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
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
  );
};

export default SocialFeed;
