import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  adminGetUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminResetPassword,
  getDrives,
  adminDeleteDrive,
  getDistributions,
  adminDeleteDistribution,
  adminGetAttachments,
  adminDeleteAttachment,
} from '../api/client';
import type { User, Drive, Distribution, Attachment } from '../api/types';
import LoadingSpinner from '../components/LoadingSpinner';

type Tab = 'users' | 'drives' | 'distributions' | 'photos';

export default function Admin() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>('users');

  if (!isAdmin) {
    return (
      <div className="text-center py-20 text-red-600 font-semibold">
        Access denied. Admin only.
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'users', label: 'Users', icon: '👥' },
    { key: 'drives', label: 'Drives', icon: '🚗' },
    { key: 'distributions', label: 'Distributions', icon: '💧' },
    { key: 'photos', label: 'Photos', icon: '📸' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-water-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Manage users, drives, distributions and photos</p>
      </div>

      <div className="flex gap-2 mb-8 border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-water-100 text-water-800 border-b-2 border-water-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'users' && <UsersPanel />}
      {tab === 'drives' && <DrivesPanel />}
      {tab === 'distributions' && <DistributionsPanel />}
      {tab === 'photos' && <PhotosPanel />}
    </div>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ email: '', full_name: '', password: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try { setUsers(await adminGetUsers()); } catch { /* noop */ }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      await adminCreateUser(form);
      setForm({ email: '', full_name: '', password: '' });
      setShowCreate(false);
      await loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create user');
    }
    setCreating(false);
  }

  async function handleToggleRole(user: User) {
    const newRole = user.role === 'admin' ? 'member' : 'admin';
    await adminUpdateUser(user.id, { role: newRole });
    await loadUsers();
  }

  async function handleToggleActive(user: User) {
    await adminUpdateUser(user.id, { is_active: !user.is_active });
    await loadUsers();
  }

  async function handleDelete(user: User) {
    if (!confirm(`Delete user ${user.full_name}?`)) return;
    await adminDeleteUser(user.id);
    await loadUsers();
  }

  async function handleResetPassword(user: User) {
    const newPw = prompt(`New password for ${user.full_name}:`);
    if (!newPw || newPw.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    await adminResetPassword(user.id, newPw);
    alert('Password reset.');
  }

  if (loading) return <LoadingSpinner message="Loading users..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-water-800">{users.length} Users</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-water-600 text-white font-semibold rounded-lg hover:bg-water-700 text-sm"
        >
          {showCreate ? 'Cancel' : '+ Create User'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border p-5 space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" required placeholder="Full name" value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm" />
            <input type="email" required placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm" />
            <input type="password" required placeholder="Password (6+ chars)" minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm" />
          </div>
          <button type="submit" disabled={creating}
            className="px-6 py-2 bg-leaf-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
            {creating ? 'Creating...' : 'Create'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.full_name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-water-100 text-water-700'
                  }`}>{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>{u.is_active ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => handleToggleRole(u)}
                      className="text-xs text-purple-600 hover:underline">
                      {u.role === 'admin' ? 'Demote' : 'Promote'}
                    </button>
                    <button onClick={() => handleToggleActive(u)}
                      className="text-xs text-yellow-600 hover:underline">
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleResetPassword(u)}
                      className="text-xs text-water-600 hover:underline">
                      Reset PW
                    </button>
                    <button onClick={() => handleDelete(u)}
                      className="text-xs text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DrivesPanel() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDrives(); }, []);

  async function loadDrives() {
    setLoading(true);
    try { setDrives(await getDrives()); } catch { /* noop */ }
    setLoading(false);
  }

  async function handleDelete(drive: Drive) {
    if (!confirm(`Delete drive "${drive.name}"?`)) return;
    await adminDeleteDrive(drive.id);
    await loadDrives();
  }

  if (loading) return <LoadingSpinner message="Loading drives..." />;

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {drives.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{d.name}</td>
              <td className="px-4 py-3 text-gray-500">{d.planned_date}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  d.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-water-100 text-water-700'
                }`}>{d.status}</span>
              </td>
              <td className="px-4 py-3">
                <button onClick={() => handleDelete(d)}
                  className="text-xs text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DistributionsPanel() {
  const [dists, setDists] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDists(); }, []);

  async function loadDists() {
    setLoading(true);
    try { setDists(await getDistributions()); } catch { /* noop */ }
    setLoading(false);
  }

  async function handleDelete(dist: Distribution) {
    if (!confirm(`Delete distribution by "${dist.name}"?`)) return;
    await adminDeleteDistribution(dist.id);
    await loadDists();
  }

  if (loading) return <LoadingSpinner message="Loading distributions..." />;

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {dists.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{d.name}</td>
              <td className="px-4 py-3 text-gray-500 truncate max-w-xs">{d.address}</td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(d.created_at).toLocaleDateString('en-IN')}
              </td>
              <td className="px-4 py-3">
                <button onClick={() => handleDelete(d)}
                  className="text-xs text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PhotosPanel() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAttachments(); }, []);

  async function loadAttachments() {
    setLoading(true);
    try { setAttachments(await adminGetAttachments()); } catch { /* noop */ }
    setLoading(false);
  }

  async function handleDelete(att: Attachment) {
    if (!confirm(`Delete "${att.original_filename || att.blob_name}"?`)) return;
    await adminDeleteAttachment(att.id);
    await loadAttachments();
  }

  if (loading) return <LoadingSpinner message="Loading photos..." />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {attachments.length === 0 && (
        <p className="col-span-full text-center text-gray-500 py-10">
          No attachments found.
        </p>
      )}
      {attachments.map((att) => (
        <div key={att.id} className="bg-white rounded-xl border overflow-hidden shadow-sm group">
          {att.content_type?.startsWith('image/') ? (
            <img
              src={att.blob_url}
              alt={att.original_filename || 'attachment'}
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
              📎 {att.content_type}
            </div>
          )}
          <div className="p-3">
            <p className="text-xs text-gray-600 truncate">
              {att.original_filename || att.blob_name}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {att.entity_type} / {att.field_name}
            </p>
            <button
              onClick={() => handleDelete(att)}
              className="mt-2 text-xs text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
