import { useState, useEffect } from 'react';
import { Trash2, Mail, Download } from 'lucide-react';
import * as api from '../../api';

export default function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    api.fetchSubscribers().then(setSubscribers).catch(() => {});
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Remove this subscriber?')) {
      await api.deleteSubscriber(id);
      setSubscribers(await api.fetchSubscribers());
    }
  };

  const exportCsv = () => {
    const rows = [
      ['Email', 'Subscribed'],
      ...subscribers.map((s) => [s.email || '', s.created_at || s.subscribedAt || '']),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bicc-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1F85A8]">Newsletter Subscribers <span className="text-sm font-normal text-gray-400">({subscribers.length})</span></h2>
        {subscribers.length > 0 && (
          <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
            <Download size={16} /> Export CSV
          </button>
        )}
      </div>

      <div className="space-y-2">
        {subscribers.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No subscribers yet.</div>
        ) : (
          subscribers.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="text-blue-600" size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-800 text-sm truncate">{item.email}</p>
                {(item.created_at || item.subscribedAt) && (
                  <p className="text-xs text-gray-400">Subscribed {new Date(item.created_at || item.subscribedAt).toLocaleDateString()}</p>
                )}
              </div>
              {api.canDelete() && (
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg shrink-0" title="Remove">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
