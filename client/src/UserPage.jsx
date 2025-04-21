import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');  // use your backend URL

function UserPage() {
  const [queue, setQueue] = useState([]);
  const [form, setForm] = useState({ name: '', songTitle: '', artist: '' });

  // Fetch queue once on page load
  const fetchQueue = async () => {
    const res = await axios.get('/api/singers');
    setQueue(res.data);
    console.log('📥 Initial queue loaded:', res.data.length, 'items');
  };

  useEffect(() => {
    fetchQueue();

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('queueUpdate', (updatedQueue) => {
      console.log('🔥 Received queueUpdate:', updatedQueue);
      console.log('📋 Current queue state before update:', queue);
      setQueue([...updatedQueue]);  // 👈 force re-render by using new array ref
    });

    return () => {
      socket.off('queueUpdate');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/singers', form);
    setForm({ name: '', songTitle: '', artist: '' });
  };

  // ⬇️ Log render confirmation
  console.log('🖼️ Rendering queue with', queue.length, 'items');

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">🎤 Karaoke Queue</h1>
      <ul className="my-4">
        {queue.map((s, i) => (
          <li key={s._id || i}>
            {i + 1}. {s.name} - {s.songTitle} - {s.artist} ({s.status})
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Name" required className="w-full p-2 border" />
        <input value={form.songTitle} onChange={e => setForm({ ...form, songTitle: e.target.value })} placeholder="Song Title" required className="w-full p-2 border" />
        <input value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} placeholder="Artist" required className="w-full p-2 border" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2">Join Queue</button>
      </form>
    </div>
  );
}

export default UserPage;
