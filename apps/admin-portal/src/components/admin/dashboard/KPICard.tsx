import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  onClick?: () => void;
  loading?: boolean;
  subtitle?: string;
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600',
};

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-600',
};

export default function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  onClick,
  loading,
  subtitle
}: KPICardProps) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4`}>
            <Icon size={24} />
          </div>
          <h3 className="text-sm text-gray-600 font-medium mb-1">{title}</h3>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 ${trendColors[trend.direction]}`}>
              <TrendIcon size={14} />
              <span className="text-xs font-medium">
                {trend.value > 0 && '+'}{trend.value} {trend.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
