import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', deadline: '' });
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: 'https://considerate-manifestation-production-eebf.up.railway.app/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tasks', form);
      setForm({ title: '', description: '', deadline: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus task ini?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatus = async (task) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        ...task,
        status: task.status === 'pending' ? 'done' : 'pending'
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Halo, {user?.name}!</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        {/* Form tambah task */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Tambah Task</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Judul task"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Deskripsi (opsional)"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              type="date"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : '+ Tambah Task'}
            </button>
          </form>
        </div>

        {/* List tasks */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              Belum ada task. Tambahkan task pertamamu!
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl shadow p-4 flex items-start justify-between gap-4 ${
                  task.status === 'done' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex-1">
                  <h3 className={`font-semibold text-gray-800 ${task.status === 'done' ? 'line-through' : ''}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  )}
                  {task.deadline && (
                    <p className="text-xs text-gray-400 mt-1">
                      Deadline: {new Date(task.deadline).toLocaleDateString('id-ID')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatus(task)}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      task.status === 'done'
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {task.status === 'done' ? 'Undo' : 'Selesai'}
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}