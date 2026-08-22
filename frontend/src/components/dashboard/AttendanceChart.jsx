import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import ChartCard from './ChartCard';

const DEFAULT_ATTENDANCE_DATA = [
  { day: 'Mon', present: 235, absent: 13, rate: 94 },
  { day: 'Tue', present: 238, absent: 10, rate: 96 },
  { day: 'Wed', present: 231, absent: 17, rate: 93 },
  { day: 'Thu', present: 240, absent: 8, rate: 97 },
  { day: 'Fri', present: 228, absent: 20, rate: 92 },
  { day: 'Sat', present: 195, absent: 53, rate: 78 },
  { day: 'Sun', present: 242, absent: 6, rate: 98 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3)',
        boxShadow: 'var(--shadow-md)',
        fontSize: 'var(--text-xs)',
      }}>
        <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{label}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 500 }}>
            Present: <strong className="table-num">{payload[0]?.value}</strong>
          </span>
          <span style={{ color: 'var(--danger)', fontWeight: 500 }}>
            Absent: <strong className="table-num">{payload[1]?.value}</strong>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const AttendanceChart = ({
  data = DEFAULT_ATTENDANCE_DATA,
  title = 'Attendance Trends',
  subtitle = 'Last 7 days presence vs absence',
  actions,
  loading = false,
  height = 260,
  className = '',
}) => {
  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      actions={actions}
      loading={loading}
      minHeight={height}
      className={className}
    >
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--danger)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="present"
              stroke="var(--primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#presentGrad)"
              name="Present"
            />
            <Area
              type="monotone"
              dataKey="absent"
              stroke="var(--danger)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#absentGrad)"
              name="Absent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default AttendanceChart;
