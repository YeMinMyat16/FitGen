export type Category = 'Tops' | 'Bottoms' | 'Shoes' | 'Accessories' | 'Outerwear';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All-Season';
export type Style = 'Casual' | 'Formal' | 'Sporty' | 'Chic' | 'Business';

export interface WardrobeItem {
  id: string;
  imageUrl: string;
  category: Category;
  color: string;
  season: Season;
  style: Style;
  createdAt: number;
}

export interface Outfit {
  id: string;
  topId: string;
  bottomId: string;
  shoesId: string;
  accessoryId?: string;
  isFavorite: boolean;
  createdAt: number;
}
