'use client';

import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    change: string;
    trend: 'up' | 'down';
    icon: React.ReactNode;
    iconBgColor: string;
    iconColor: string;
}

export default function StatCard({ title, value, change, trend, icon, iconBgColor, iconColor }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${iconBgColor}`}>
                    <div className={`w-6 h-6 ${iconColor}`}>
                        {icon}
                    </div>
                </div>
                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                    {change}
                </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}
