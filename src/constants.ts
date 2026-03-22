import { Category, Season, Style } from './types';

export const CATEGORIES: Category[] = ['Tops', 'Bottoms', 'Shoes', 'Accessories', 'Outerwear'];
export const SEASONS: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter', 'All-Season'];
export const STYLES: Style[] = ['Casual', 'Formal', 'Sporty', 'Chic', 'Business'];

export const INITIAL_ITEMS: any[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    category: 'Tops',
    color: 'White',
    season: 'Summer',
    style: 'Casual',
    createdAt: Date.now(),
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800',
    category: 'Bottoms',
    color: 'Blue',
    season: 'All-Season',
    style: 'Casual',
    createdAt: Date.now(),
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
    category: 'Shoes',
    color: 'Beige',
    season: 'Spring',
    style: 'Chic',
    createdAt: Date.now(),
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    category: 'Outerwear',
    color: 'Camel',
    season: 'Autumn',
    style: 'Formal',
    createdAt: Date.now(),
  }
];
