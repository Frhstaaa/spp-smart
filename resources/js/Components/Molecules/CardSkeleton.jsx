import React from 'react';
import Skeleton from '@/Components/Atoms/Skeleton';

export default function CardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
                <Skeleton variant="circular" className="w-12 h-12" />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-1/2" />
                    <Skeleton variant="text" className="w-1/4 h-3" />
                </div>
            </div>
            <div className="space-y-3">
                <Skeleton variant="text" />
                <Skeleton variant="text" className="w-5/6" />
                <Skeleton variant="text" className="w-4/6" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
                <Skeleton variant="rectangular" className="w-20 h-9" />
                <Skeleton variant="rectangular" className="w-20 h-9" />
            </div>
        </div>
    );
}
