import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Check } from 'lucide-react';
import { CATEGORIES, SEASONS, STYLES } from '../constants';
import { Category, Season, Style, WardrobeItem } from '../types';
import { cn } from '../lib/utils';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: WardrobeItem) => void;
}

export default function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('Tops');
  const [season, setSeason] = useState<Season>('All-Season');
  const [style, setStyle] = useState<Style>('Casual');
  const [color, setColor] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    const newItem: WardrobeItem = {
      id: Math.random().toString(36).substr(2, 9),
      imageUrl: image,
      category,
      season,
      style,
      color: color || 'Neutral',
      createdAt: Date.now(),
    };

    onAdd(newItem);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setImage(null);
    setCategory('Tops');
    setSeason('All-Season');
    setStyle('Casual');
    setColor('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl glass-card rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-semibold">Add New Item</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Upload Area */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Clothing Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "relative aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all",
                      image ? "border-transparent" : "border-neutral-300 dark:border-neutral-700 hover:border-brand-400",
                      isDragging && "border-brand-500 bg-brand-50/50 dark:bg-brand-900/20 scale-[1.02]"
                    )}
                  >
                    {image ? (
                      <>
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-sm font-medium">Change Image</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <motion.div
                          animate={isDragging ? { y: -10 } : { y: 0 }}
                        >
                          <Upload className={cn("w-10 h-10 mx-auto mb-3 transition-colors", isDragging ? "text-brand-500" : "text-neutral-400")} />
                        </motion.div>
                        <p className="text-sm font-medium">Drag and drop or click</p>
                        <p className="text-xs text-neutral-500 mt-1">Supports JPG, PNG</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Details Area */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            category === cat
                              ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Season</label>
                    <div className="flex flex-wrap gap-2">
                      {SEASONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSeason(s)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            season === s
                              ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {STYLES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStyle(s)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                            style === s
                              ? "border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/20"
                              : "border-neutral-200 text-neutral-600 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Color</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['Black', 'White', 'Navy', 'Gray', 'Beige'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                            color === c
                              ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="Or type a custom color..."
                      className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!image}
                  className={cn(
                    "px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all",
                    image
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 hover:shadow-brand-500/40"
                      : "bg-neutral-200 text-neutral-400 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-600"
                  )}
                >
                  <Check className="w-5 h-5" />
                  Save to Closet
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
