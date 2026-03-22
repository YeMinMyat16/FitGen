import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Heart } from 'lucide-react';
import { Outfit, WardrobeItem } from '../types';
import { cn } from '../lib/utils';

interface OutfitCardProps {
  outfit: Outfit;
  items: WardrobeItem[];
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function OutfitCard({ outfit, items, onDelete, onToggleFavorite }: OutfitCardProps) {
  const top = items.find(i => i.id === outfit.topId);
  const bottom = items.find(i => i.id === outfit.bottomId);
  const shoes = items.find(i => i.id === outfit.shoesId);

  if (!top || !bottom || !shoes) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card rounded-[2.5rem] p-6 space-y-4 group"
    >
      <div className="flex gap-2 h-48">
        <div className="flex-1 rounded-2xl overflow-hidden">
          <img src={top.imageUrl} alt="Top" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex-1 rounded-2xl overflow-hidden">
            <img src={bottom.imageUrl} alt="Bottom" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden">
            <img src={shoes.imageUrl} alt="Shoes" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">Curated Look</h3>
          <p className="text-xs text-neutral-500">Created {new Date(outfit.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleFavorite(outfit.id)}
            className={cn(
              "p-2 rounded-full transition-all",
              outfit.isFavorite 
                ? "bg-pink-50 text-pink-500 dark:bg-pink-900/30" 
                : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 hover:text-pink-500"
            )}
          >
            <Heart className={cn("w-5 h-5", outfit.isFavorite && "fill-current")} />
          </button>
          <button
            onClick={() => onDelete(outfit.id)}
            className="p-2 bg-neutral-100 text-neutral-400 dark:bg-neutral-800 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 rounded-full transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
