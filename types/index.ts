export type VehicleStatus = "available" | "rented" | "service";
export type VehicleType = "car" | "motorcycle" | "minibus";
export type TransactionStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type BookingStatus = "active" | "completed" | "pending" | "cancelled";

export interface RentalPackage {
  id?: string;
  vehicleId?: string;
  duration: "full_day" | "half_day";
  driverType: "self_drive" | "with_driver";
  fuelOption: "with_fuel" | "without_fuel";
  price: number;
}

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  licensePlate: string;
  pricePerDay?: number;
  status: VehicleStatus;
  imageUrl: string | null;
  category: string;
  createdAt: string;
  description?: string;
  fuelType?: string;
  withFuel?: boolean;
  rentalDuration?: string;
  maxSpeed?: number;
  seatCapacity?: number;
  selfDrive?: boolean;
  features?: string[];
  hasPhoneCharger?: boolean;
  packages?: RentalPackage[];
  availableUnits?: number;
}

export interface Transaction {
  id: number;
  vehicleId: number;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: TransactionStatus;
  createdAt: string;
}

export interface NavItemType {
  label: string;
  href: string;
  icon: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  children?: NavItemType[];
}

export interface PackageVehicleOption {
  id: string;
  name: string;
  capacity: number;
  pricePerDay: number;
}

export interface ItineraryActivity {
  time: string;
  description: string;
  type: string;
}

export interface ItineraryDay {
  day: number;
  title?: string;
  activities?: ItineraryActivity[];
}

export interface TourPackage {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  imageUrl: string;
  estimatedPrice: number;
  duration: string;
  minPax: number;
  maxPax: number;
  startTime: string;
  endTime: string;
  includes: string[];
  excludes: string[];
  vehicleOptions: PackageVehicleOption[];
  itinerary?: ItineraryDay[];
  category?: string;
  priceType?: "per_car" | "per_person";
  destinationTags?: string[];
  status?: "active" | "draft";
  recommendation?: "New" | "Best Seller" | "Recommended" | "None" | null;
}

export interface TourPackageFormData {
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  destinationTags: string[];
  includes: string[];
  excludes: string[];
  priceType: "per_car" | "per_person";
  recommendation: "New" | "Best Seller" | "Recommended" | "None";
  durationDays: number;
  durationNights: number;
  pricingOptions: Array<{
    id: string;
    type: "per_car" | "per_person";
    vehicleName?: string;
    capacity?: number;
    price: number;
  }>;
  itineraryDays: Array<{
    day: number;
    title?: string;
    activities?: Array<{ time: string; description: string; type: string }>;
  }>;
}

// Dashboard
export interface DashboardStat {
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface ChartDataPoint {
  label: string;
  bookings: number;
  revenue: number;
}

export interface PerformanceChartDataPoint {
  label: string;
  vehicleBookings: number;
  tourBookings: number;
  vehicleRevenue: number;
  tourRevenue: number;
}

export interface RecentBooking {
  id: number;
  vehicleName: string;
  licensePlate: string;
  vehicleType: string;
  duration: string;
  date: string;
  initial: string;
}

export interface BookingHistory {
  id: string;
  vehicleName: string;
  licensePlate: string;
  category?: string;
  type: string;
  bookingDate: string;
  time: string;
  duration: string;
  customer: string;
  phone: string;
  status: string;
  notes: string;
  packageId?: string | null;
  basePrice?: number | null;
  finalPrice?: number | null;
  vehicleRentalDuration?: string | null;
  vehiclePackages?: RentalPackage[] | null;
}

export interface TourBookingHistory {
  id: string;
  packageName: string;
  customerName: string;
  priceType: "per_car" | "per_person";
  vehicleType: string;
  pax: number;
  totalPrice: number;
  bookingDate: string;
  time: string;
  phone: string;
  notes?: string;
  status?: string;
  category?: string;
}

// Landing Page
export interface Destination {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  imageUrl: string;
}

export interface HeroContent {
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  featuredVehicle: string;
}

// Email Broadcasting
export interface EmailBroadcast {
  id: string;
  subject: string;
  body: string;
  recipientCount: number;
  sentAt?: string;
  createdAt?: string;
  status: "sent" | "draft" | "failed";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalBookings: number;
  registeredAt: string;
}

export interface Tourist {
  id: string;
  nationality: string;
  continent: "Asia" | "Europe" | "Americas";
  packageTaken: string;
  photoUrl?: string;
}

export interface GoogleReview {
  id: string;
  name: string;
  country: string;
  rating: number;
  comment: string;
  avatarPath?: string | null;
  mediaType?: string | null;
  mediaPath?: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: "booking" | "complaint" | "information";
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}
