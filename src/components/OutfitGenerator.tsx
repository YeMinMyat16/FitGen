import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Heart, Save } from 'lucide-react';
import { WardrobeItem, Outfit } from '../types';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

interface OutfitGeneratorProps {
  items: WardrobeItem[];
  onSaveOutfit: (outfit: Outfit) => void;
}

export default function OutfitGenerator({ items, onSaveOutfit }: OutfitGeneratorProps) {
  const [currentOutfit, setCurrentOutfit] = useState<{
    top: WardrobeItem | null;
    bottom: WardrobeItem | null;
    shoes: WardrobeItem | null;
  }>({ top: null, bottom: null, shoes: null });
  
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRandomOutfit = () => {
    setIsGenerating(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      const tops = items.filter(i => i.category === 'Tops');
      const bottoms = items.filter(i => i.category === 'Bottoms');
      const shoes = items.filter(i => i.category === 'Shoes');

      if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
        toast.error('Add more items to generate outfits!');
        setIsGenerating(false);
        return;
      }

      setCurrentOutfit({
        top: tops[Math.floor(Math.random() * tops.length)],
        bottom: bottoms[Math.floor(Math.random() * bottoms.length)],
        shoes: shoes[Math.floor(Math.random() * shoes.length)],
      });
      setIsGenerating(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!currentOutfit.top || !currentOutfit.bottom || !currentOutfit.shoes) return;

    const newOutfit: Outfit = {
      id: Math.random().toString(36).substr(2, 9),
      topId: currentOutfit.top.id,
      bottomId: currentOutfit.bottom.id,
      shoesId: currentOutfit.shoes.id,
      isFavorite: false,
      createdAt: Date.now(),
    };

    onSaveOutfit(newOutfit);
    toast.success('Outfit saved to your collection!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Outfit Stylist</h2>
        <p className="text-neutral-500">Let our AI curate the perfect look for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Top', 'Bottom', 'Shoes'].map((label, idx) => {
          const item = idx === 0 ? currentOutfit.top : idx === 1 ? currentOutfit.bottom : currentOutfit.shoes;
          return (
            <div key={label} className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 px-2">{label}</span>
              <div className="aspect-[3/4] rounded-3xl glass-card overflow-hidden relative group">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-beige-100/50 dark:bg-neutral-800/50"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-12 h-12 border-4 border-beige-400 border-t-transparent rounded-full"
                      />
                    </motion.div>
                  ) : item ? (
                    <motion.img
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      src={item.imageUrl}
                      alt={item.category}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                      <Sparkles className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateRandomOutfit}
          disabled={isGenerating}
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold flex items-center justify-center gap-2 shadow-xl shadow-neutral-900/20 disabled:opacity-50"
        >
          {isGenerating ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {currentOutfit.top ? 'Regenerate Look' : 'Generate Outfit'}
        </motion.button>

        {currentOutfit.top && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-neutral-900 dark:border-white font-bold flex items-center justify-center gap-2 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-all"
          >
            <Heart className="w-5 h-5" />
            Save Outfit
          </motion.button>
        )}
      </div>
    </div>
  );
}
