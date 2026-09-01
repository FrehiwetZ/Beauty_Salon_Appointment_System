import React, { useState } from 'react';
import Button from '../../../components/Button';
import ImageUpload from '../../../components/ImageUpload';
import { useData } from '../../../context/DataContext';
import { NewsPost } from '../../News/types/news';

function AdminNews() {
  const { newsList, addNews, deleteNews, updateNews } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: NewsPost = {
      id: crypto.randomUUID(),
      title: formData.title,
      content: formData.content,
      imageUrl: formData.imageUrl,
      date: new Date().toISOString(),
      published: true,
      status: 'APPROVED',
    };
    addNews(newPost);
    setIsAdding(false);
    setFormData({ title: '', content: '', imageUrl: '' });
  };

  const handleTogglePublish = (id: string) => {
    const news = newsList.find(n => n.id === id);
    if (news) {
      updateNews({ ...news, status: (news as any).status === 'APPROVED' ? 'PENDING' : 'APPROVED' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">News & Announcements</h2>
        {!isAdding && <Button onClick={() => setIsAdding(true)}>+ Create Post</Button>}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
          <h3 className="font-bold text-gray-800 text-lg">New Announcement</h3>
          <input required placeholder="Announcement Title" className="w-full p-2.5 border rounded-lg bg-white text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <ImageUpload
            label="Announcement Cover Image (Cloudflare R2)"
            folder="posts"
            value={formData.imageUrl}
            onChange={url => setFormData({...formData, imageUrl: url})}
          />
          <textarea required placeholder="Write announcement details..." className="w-full p-2.5 border rounded-lg bg-white text-sm" rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          <div className="flex gap-2">
            <Button type="submit">Publish Now</Button>
            <button type="button" onClick={() => setIsAdding(false)} className="text-gray-500 hover:underline px-3 text-sm">Cancel</button>
          </div>
        </form>
      )}
      
      <div className="space-y-4">
        {newsList.map(news => (
          <div key={news.id} className="border border-gray-100 p-5 rounded-lg flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-800">{news.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded ${((news as any).status === 'APPROVED' || news.published) ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {((news as any).status === 'APPROVED' || news.published) ? 'Published' : 'Draft/Pending'}
              </span>
            </div>
            {news.imageUrl && <img src={news.imageUrl} alt={news.title} className="w-full h-48 object-cover rounded-lg" />}
            <p className="text-sm text-gray-600">{news.content}</p>
            <p className="text-xs text-gray-400">Date: {news.date || (news as any).createdAt}</p>
            <div className="flex gap-3 mt-2 pt-2 border-t border-gray-50">
              <button onClick={() => handleTogglePublish(news.id)} className="text-blue-600 hover:underline text-sm font-medium">
                {((news as any).status === 'APPROVED' || news.published) ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => deleteNews(news.id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminNews;
