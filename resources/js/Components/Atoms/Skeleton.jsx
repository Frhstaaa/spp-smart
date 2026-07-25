import React from 'react';
import { motion } from 'framer-motion';

export default function Skeleton({ className = '', variant = 'rectangular', width, height }) {
    const baseClasses = 'bg-gray-200 dark:bg-gray-700 overflow-hidden relative';
    
    const variants = {
        circular: 'rounded-full',
        rectangular: 'rounded-md',
        text: 'rounded h-4 w-full',
    };

    return (
        <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut', repeatType: 'reverse' }}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            style={{ width, height }}
        >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>
    );
}
