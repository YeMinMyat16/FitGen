import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  Sparkles, 
  Heart, 
  Moon, 
  Sun,
  Activity,
  ShoppingBag,
  Menu,
  X
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { WardrobeItem, Outfit, Category } from './types';
import { CATEGORIES, INITIAL_ITEMS } from './constants';
import { cn } from './lib/utils';

// Components
import WardrobeItemCard from './components/WardrobeItemCard';
import OutfitCard from './components/OutfitCard';
import AddItemModal from './components/AddItemModal';
import OutfitGenerator from './components/OutfitGenerator';

type Tab = 'closet' | 'generator' | 'outfits';

export default function App() {
  const [items, setItems] = useState<WardrobeItem[]>(() => {
    const saved = localStorage.getItem('vogue-closet-items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [outfits, setOutfits] = useState<Outfit[]>(() => {
    const saved = localStorage.getItem('vogue-closet-outfits');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<Tab>('closet');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load for skeleton effect
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('vogue-closet-items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('vogue-closet-outfits', JSON.stringify(outfits));
  }, [outfits]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.color.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const handleAddItem = (item: WardrobeItem) => {
    setItems(prev => [item, ...prev]);
    toast.success('Item added to your closet!');
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success('Item removed');
  };

  const handleSaveOutfit = (outfit: Outfit) => {
    setOutfits(prev => [outfit, ...prev]);
  };

  const handleDeleteOutfit = (id: string) => {
    setOutfits(prev => prev.filter(o => o.id !== id));
    toast.success('Outfit deleted');
  };

  const handleToggleFavorite = (id: string) => {
    setOutfits(prev => prev.map(o => o.id === id ? { ...o, isFavorite: !o.isFavorite } : o));
  };

  return (
    <div className="min-h-screen pb-24 sm:pb-0">
      <Toaster position="top-center" />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 glass-card border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Activity className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter hidden sm:block">FITGEN</h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[
              { id: 'closet', label: 'My Closet', icon: LayoutGrid },
              { id: 'generator', label: 'Stylist', icon: Sparkles },
              { id: 'outfits', label: 'Outfits', icon: ShoppingBag },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold transition-all relative py-2",
                  activeTab === tab.id ? "text-neutral-900 dark:text-white" : "text-neutral-400 hover:text-neutral-600"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="md:hidden p-3" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-64 z-50 bg-white dark:bg-neutral-900 p-6 shadow-2xl"
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-6">
                {[
                  { id: 'closet', label: 'My Closet', icon: LayoutGrid },
                  { id: 'generator', label: 'Stylist', icon: Sparkles },
                  { id: 'outfits', label: 'Outfits', icon: ShoppingBag },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as Tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-4 text-lg font-semibold w-full p-4 rounded-2xl transition-all",
                      activeTab === tab.id ? "bg-neutral-100 dark:bg-neutral-800" : "text-neutral-400"
                    )}
                  >
                    <tab.icon className="w-6 h-6" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'closet' && (
            <motion.div
              key="closet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search your wardrobe..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                      selectedCategory === 'All' 
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" 
                        : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400"
                    )}
                  >
                    All Items
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                        selectedCategory === cat 
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" 
                          : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <AnimatePresence>
                  {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <div key={`skeleton-${i}`} className="glass-card rounded-3xl overflow-hidden animate-pulse">
                        <div className="aspect-[3/4] bg-neutral-200 dark:bg-neutral-800" />
                        <div className="p-4 space-y-2">
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                        </div>
                      </div>
                    ))
                  ) : (
                    filteredItems.map(item => (
                      <WardrobeItemCard 
                        key={item.id} 
                        item={item} 
                        onDelete={handleDeleteItem}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-24 space-y-4">
                  <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto">
                    <Activity className="w-10 h-10 text-neutral-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">No items found</h3>
                    <p className="text-neutral-500">Try adjusting your search or filters.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'generator' && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <OutfitGenerator items={items} onSaveOutfit={handleSaveOutfit} />
            </motion.div>
          )}

          {activeTab === 'outfits' && (
            <motion.div
              key="outfits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Saved Outfits</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-pink-50 text-pink-500 dark:bg-pink-900/30 rounded-full text-xs font-bold uppercase tracking-wider">
                    {outfits.filter(o => o.isFavorite).length} Favorites
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {outfits.map(outfit => (
                    <OutfitCard 
                      key={outfit.id} 
                      outfit={outfit} 
                      items={items}
                      onDelete={handleDeleteOutfit}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {outfits.length === 0 && (
                <div className="text-center py-24 space-y-4">
                  <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-10 h-10 text-neutral-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">No saved outfits yet</h3>
                    <p className="text-neutral-500">Use the Stylist to generate and save your favorite looks.</p>
                    <button 
                      onClick={() => setActiveTab('generator')}
                      className="mt-6 px-6 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-full font-semibold"
                    >
                      Go to Stylist
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-full shadow-2xl flex items-center justify-center z-40"
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      {/* Bottom Nav Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-around z-40">
        {[
          { id: 'closet', icon: LayoutGrid },
          { id: 'generator', icon: Sparkles },
          { id: 'outfits', icon: ShoppingBag },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={cn(
              "p-2 transition-all",
              activeTab === tab.id ? "text-neutral-900 dark:text-white" : "text-neutral-400"
            )}
          >
            <tab.icon className="w-6 h-6" />
          </button>
        ))}
      </div>

      <AddItemModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddItem}
      />
    </div>
  );
}
