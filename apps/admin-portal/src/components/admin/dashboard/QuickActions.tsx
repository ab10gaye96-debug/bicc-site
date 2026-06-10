import { LucideIcon, Plus, Zap } from 'lucide-react';

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: 'blue' | 'green' | 'purple' | 'yellow';
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const colorClasses = {
  blue: 'bg-blue-600 hover:bg-blue-700',
  green: 'bg-green-600 hover:bg-green-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
  yellow: 'bg-yellow-600 hover:bg-yellow-700',
};

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Zap size={20} className="text-yellow-500" />
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const colorClass = colorClasses[action.color || 'blue'];

          return (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex flex-col items-center gap-2 p-4 ${colorClass} text-white rounded-lg transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Icon size={24} />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
