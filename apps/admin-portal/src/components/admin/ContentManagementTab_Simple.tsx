import { useState } from 'react';
import { FileText } from 'lucide-react';

export default function ContentManagementTab() {
  const [message] = useState('Content Management System - Coming Soon!');

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText size={32} className="text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-[#1F85A8]">Content Management</h2>
          <p className="text-gray-600 text-sm">Edit website text content from here</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
        <FileText size={64} className="text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-blue-900 mb-2">{message}</h3>
        <p className="text-blue-700">
          The CMS interface is being set up. You'll be able to edit:
        </p>
        <ul className="text-left max-w-md mx-auto mt-4 space-y-2 text-blue-800">
          <li>• Home page content (Hero, Stats, About, CTA)</li>
          <li>• Footer information and links</li>
          <li>• Navigation menu items</li>
          <li>• Contact page details</li>
        </ul>
      </div>
    </div>
  );
}
