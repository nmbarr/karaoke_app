import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [queue, setQueue] = useState([]);

  const fetchQueue = async () => {
    const res = await axios.get('/api/singers');
    setQueue(res.data);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.patch(`/api/singers/${id}/status`, { status });
    fetchQueue();
  };

  const deleteSinger = async (id) => {
    await axios.delete(`/api/singers/${id}`);
    fetchQueue();
  };

  const resetQueue = async () => {
    if (window.confirm("Are you sure you want to clear the queue?")) {
      await axios.delete('/api/singers');
      fetchQueue();
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🎤 Admin Panel</h1>
      <button onClick={resetQueue} className="mb-4 bg-red-500 text-white px-4 py-2">Reset Queue</button>
      <ul>
        {queue.map((singer, i) => (
          <li key={singer._id} className="mb-3 border p-2">
            <div className="font-semibold">{singer.name} - {singer.songTitle}</div>
            <div className="text-sm text-gray-500">Status: {singer.status}</div>
            <div className="space-x-2 mt-1">
              <button onClick={() => updateStatus(singer._id, 'performing')} className="bg-blue-500 text-white px-2 py-1">Performing</button>
              <button onClick={() => updateStatus(singer._id, 'done')} className="bg-green-600 text-white px-2 py-1">Done</button>
              <button onClick={() => deleteSinger(singer._id)} className="bg-gray-500 text-white px-2 py-1">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
