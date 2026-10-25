export type UserRole = 'admin' | 'agent';

export type PropertyPurpose = 'sale' | 'rent';

export type PropertyCategory =
  | 'residential_plot'
  | 'house'
  | 'apartment'
  | 'commercial_plot'
  | 'shop'
  | 'office'
  | 'plaza';

export type PublicationStatus = 'draft' | 'published' | 'archived';

export type AvailabilityStatus = 'available' | 'under_offer' | 'sold' | 'rented';

export type PlotFileStatus =
  | 'not_applicable'
  | 'file'
  | 'allocated'
  | 'balloted'
  | 'possession';

export type InquiryStatus = 'new' | 'contacted' | 'qualified' | 'closed' | 'spam';

export type AreaUnitType = 'marla' | 'kanal' | 'sqft' | 'sqyd';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  reference_code: string;
  title: string;
  slug: string;
  description: string | null;
  purpose: PropertyPurpose;
  category: PropertyCategory;
  publication_status: PublicationStatus;
  availability_status: AvailabilityStatus;
  plot_file_status: PlotFileStatus;
  is_price_on_call: boolean;
  price_pkr: number | null;
  area_value: number;
  area_unit: AreaUnitType;
  marla_sqft_standard: number;
  area_in_marla: number;
  area_in_sqft: number;
  city: string;
  area_location: string;
  sector_block: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  features: string[];
  images: string[];
  featured_image: string | null;
  agent_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  property_id: string | null;
  customer_name: string;
  phone: string;
  email: string | null;
  message: string;
  status: InquiryStatus;
  ip_hash: string | null;
  created_at: string;
}
