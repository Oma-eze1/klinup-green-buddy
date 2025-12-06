export type UserRole = 'user' | 'wmc' | 'ngo' | 'recycler';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
  // Role-specific fields
  company_name?: string;
  organization_name?: string;
  business_name?: string;
  address?: string;
  material_type?: string;
  certification_url?: string;
}

export interface WasteReport {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'photo' | 'video';
  gps_lat: number;
  gps_lng: number;
  description: string;
  status: 'submitted' | 'in_review' | 'resolved' | 'invalid';
  created_at: string;
}

export interface Recyclable {
  id: string;
  user_id: string;
  category: 'plastic' | 'metal' | 'glass' | 'e-waste' | 'paper' | 'others';
  weight: number;
  image_url: string;
  price_min: number;
  price_max: number;
  status: 'available' | 'pending' | 'sold';
  recycler_id?: string;
  created_at: string;
}

export interface GiftItem {
  id: string;
  user_id: string;
  title: string;
  category: 'clothes' | 'electronics' | 'furniture' | 'books' | 'toys' | 'others';
  condition: 'new' | 'fairly_used' | 'needs_repair';
  image_url: string;
  description: string;
  status: 'available' | 'requested' | 'donated';
  ngo_id?: string;
  created_at: string;
}

export const RECYCLABLE_PRICES: Record<Recyclable['category'], { min: number; max: number }> = {
  plastic: { min: 50, max: 150 },
  metal: { min: 200, max: 500 },
  glass: { min: 30, max: 80 },
  'e-waste': { min: 500, max: 2000 },
  paper: { min: 20, max: 60 },
  others: { min: 10, max: 100 },
};
