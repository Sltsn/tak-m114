'use client';

import { useState } from 'react';

const mockPosts = [
  {
    id: '1',
    user: { name: 'Ahmet Çiftçi', avatar: '👨‍🌾', profession: 'Çiftçi' },
    plant: 'Domates',
    disease: 'Yaprak Yanıklığı',
    image: '🍅',
    description: 'Domatesimin yapraklarında bu lekeleri fark ettim. Ne yapmalıyım?',
    status: 'çözüldü',
    likes: 24,
    comments: 8,
    date: '2 saat önce',
  },
  {
    id: '2',
    user: { name: 'Fatma Bahçıvan', avatar: '🪴', profession: 'Hobi Bahçıvanı' },
    plant: 'Gül',
    disease: 'Yaprak Biti',
    image: '🌹',
    description: 'Güllerime yaprak biti bulaştı. Organik çözüm arıyorum.',
    status: 'devam ediyor',
    likes: 15,
    comments: 12,
    date: '5 saat önce',
  },
  {
    id: '3',
    user: { name: 'Mustafa Ziraat', avatar: '🌾', profession: 'Ziraat Mühendisi' },
    plant: 'Buğday',
    disease: 'Pas Hastalığı',
    image: '🌾',
    description: 'Tarlada pas hastalığı belirtileri görüyorum. Acil müdahale gerekiyor.',
    status: 'beklemede',
    likes: 32,
    comments: 18,
    date: '1 gün önce',
  },
];

export function PostFeed() {
  return (
    <div className="space-y-6">
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }: { post: typeof mockPosts[0] }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const statusColors: Record<string, string> = {
    'çözüldü': 'bg-green-100 text-green-700',
    'devam ediyor': 'bg-amber-100 text-amber-700',
    'beklemede': 'bg-gray-100 text-gray-600',
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-green-200 hover:shadow-lg hover:shadow-green-100/50 transition-all">
      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
            {post.user.avatar}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{post.user.name}</p>
            <p className="text-sm text-gray-500">{post.user.profession} • {post.date}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[post.status]}`}>
            {post.status}
          </span>
        </div>

        {/* Content */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-medium">
              🌱 {post.plant}
            </span>
            <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-sm font-medium">
              🦠 {post.disease}
            </span>
          </div>
          <p className="text-gray-700">{post.description}</p>
        </div>

        {/* Image Placeholder */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl h-48 flex items-center justify-center mb-4 border border-green-100">
          <span className="text-6xl">{post.image}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-6">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`flex items-center gap-2 font-medium transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <span>{isLiked ? '❤️' : '🤍'}</span>
          {post.likes + (isLiked ? 1 : 0)}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-medium transition-colors"
        >
          <span>💬</span>
          {post.comments} yorum
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors ml-auto">
          <span>🔗</span>
          Paylaş
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Yorum yazın..."
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors">
              Gönder
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">
                🧑‍🌾
              </div>
              <div className="flex-1 bg-white rounded-xl p-3">
                <p className="text-sm font-medium text-gray-900">Ali Yılmaz</p>
                <p className="text-sm text-gray-600">Ben de aynı sorunu yaşadım, bakır sülfat işe yaradı.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
