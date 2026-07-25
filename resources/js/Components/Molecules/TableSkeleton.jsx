import React from 'react';
import Skeleton from '@/Components/Atoms/Skeleton';

export default function TableSkeleton({ rows = 5, columns = 4 }) {
    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <Skeleton variant="text" className="w-1/3 h-6" />
                <Skeleton variant="rectangular" className="w-24 h-8" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                            {Array.from({ length: columns }).map((_, i) => (
                                <th key={i} className="p-4 border-b dark:border-gray-600">
                                    <Skeleton variant="text" className="w-20" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex} className="border-b dark:border-gray-700">
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <td key={colIndex} className="p-4">
                                        <Skeleton variant="text" className={colIndex === 0 ? "w-32" : "w-full"} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 flex justify-between items-center">
                <Skeleton variant="text" className="w-32" />
                <div className="flex gap-2">
                    <Skeleton variant="rectangular" className="w-8 h-8" />
                    <Skeleton variant="rectangular" className="w-8 h-8" />
                    <Skeleton variant="rectangular" className="w-8 h-8" />
                </div>
            </div>
        </div>
    );
}
