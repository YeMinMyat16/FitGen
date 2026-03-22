import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Heart, Tag } from 'lucide-react';
import { WardrobeItem } from '../types';
import { cn } from '../lib/utils';

interface WardrobeItemCardProps {
  item: WardrobeItem;
  onDelete: (id: string) => void;
}

export default function WardrobeItemCard({ item, onDelete }: WardrobeItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group relative glass-card rounded-3xl overflow-hidden"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.category}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-white font-semibold text-sm">{item.category}</p>
            <div className="flex gap-2">
              <span className="text-[10px] uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full">
                {item.style}
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full">
                {item.season}
              </span>
            </div>
          </div>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white">{item.color} {item.category}</h3>
          <p className="text-xs text-neutral-500">{item.style} • {item.season}</p>
        </div>
        <Tag className="w-4 h-4 text-neutral-300" />
      </div>
    </motion.div>
  );
}
