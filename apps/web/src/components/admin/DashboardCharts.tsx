"use client";

import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Mon', bookings: 400, revenue: 2400 },
    { name: 'Tue', bookings: 300, revenue: 1398 },
    { name: 'Wed', bookings: 200, revenue: 9800 },
    { name: 'Thu', bookings: 278, revenue: 3908 },
    { name: 'Fri', bookings: 189, revenue: 4800 },
    { name: 'Sat', bookings: 239, revenue: 3800 },
    { name: 'Sun', bookings: 349, revenue: 4300 },
];

export function RevenueChart() {
    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF4500" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#FF4500" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderColor: 'rgba(0,0,0,0.06)',
                            borderRadius: '12px',
                            fontSize: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#FF4500"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRev)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function BookingsChart() {
    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderColor: 'rgba(0,0,0,0.06)',
                            borderRadius: '12px',
                            fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="#FF8C00"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#FF8C00', strokeWidth: 2, stroke: '#FFFFFF' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
