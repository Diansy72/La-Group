import {
  Vehicle,
  NavItemType,
  TourPackage,
  DashboardStat,
  ChartDataPoint,
  RecentBooking,
  Destination,
  HeroContent,
  EmailBroadcast,
  Customer,
  Tourist,
  GoogleReview,
  BookingHistory,
  TourBookingHistory,
} from "@/types";

export const mockVehicles: Vehicle[] = [
  {
    id: "mv-001",
    name: "Toyota Avanza",
    type: "car",
    licensePlate: "AB 1234 CD",
    pricePerDay: 350000,
    status: "rented",
    imageUrl: null,
    category: "Car",
    createdAt: "2024-01-15",
  },
  {
    id: "mv-002",
    name: "Honda Beat 110",
    type: "motorcycle",
    licensePlate: "AB 5678 EF",
    pricePerDay: 75000,
    status: "available",
    imageUrl: null,
    category: "Motorcycle",
    createdAt: "2024-01-15",
  },
  {
    id: "mv-003",
    name: "Honda Scoopy",
    type: "motorcycle",
    licensePlate: "DK 9012 CC",
    pricePerDay: 80000,
    status: "available",
    imageUrl: null,
    category: "Motorcycle",
    createdAt: "2024-02-10",
  },
  {
    id: "mv-004",
    name: "Honda Beat 110",
    type: "motorcycle",
    licensePlate: "AB 3456 IJ",
    pricePerDay: 75000,
    status: "available",
    imageUrl: null,
    category: "Motorcycle",
    createdAt: "2024-02-10",
  },
  {
    id: "mv-005",
    name: "Honda Beat 110",
    type: "motorcycle",
    licensePlate: "AB 7890 KL",
    pricePerDay: 75000,
    status: "available",
    imageUrl: null,
    category: "Motorcycle",
    createdAt: "2024-03-05",
  },
  {
    id: "mv-006",
    name: "Honda Beat 110",
    type: "motorcycle",
    licensePlate: "AB 2345 MN",
    pricePerDay: 75000,
    status: "available",
    imageUrl: null,
    category: "Motorcycle",
    createdAt: "2024-03-05",
  },
  {
    id: "mv-007",
    name: "Toyota Innova Reborn",
    type: "car",
    licensePlate: "AB 6789 OP",
    pricePerDay: 500000,
    status: "rented",
    imageUrl: null,
    category: "Car",
    createdAt: "2024-04-01",
  },
  {
    id: "mv-008",
    name: "Honda Vario 125",
    type: "motorcycle",
    licensePlate: "DK 1122 QR",
    pricePerDay: 85000,
    status: "available",
    imageUrl: null,
    category: "Motorcycle",
    createdAt: "2024-04-10",
  },
  {
    id: "mv-009",
    name: "Toyota Agya",
    type: "car",
    licensePlate: "AB 1111 AA",
    pricePerDay: 280000,
    status: "available",
    imageUrl: null,
    category: "Small Car",
    seatCapacity: 4,
    createdAt: "2024-05-01",
  },
  {
    id: "mv-010",
    name: "Honda Jazz",
    type: "car",
    licensePlate: "AB 2222 BB",
    pricePerDay: 320000,
    status: "available",
    imageUrl: null,
    category: "Small Car",
    seatCapacity: 5,
    createdAt: "2024-05-01",
  },
  {
    id: "mv-011",
    name: "Toyota Kijang Innova",
    type: "car",
    licensePlate: "AB 3333 CC",
    pricePerDay: 450000,
    status: "available",
    imageUrl: null,
    category: "MPV",
    seatCapacity: 7,
    createdAt: "2024-05-01",
  },
  {
    id: "mv-012",
    name: "Toyota HiAce Mini Bus",
    type: "minibus",
    licensePlate: "AB 4444 DD",
    pricePerDay: 700000,
    status: "available",
    imageUrl: null,
    category: "Minibus",
    seatCapacity: 12,
    createdAt: "2024-05-01",
  },
  {
    id: "mv-013",
    name: "Isuzu Elf Medium Bus",
    type: "minibus",
    licensePlate: "AB 5555 EE",
    pricePerDay: 1000000,
    status: "available",
    imageUrl: null,
    category: "Bus",
    seatCapacity: 20,
    createdAt: "2024-05-01",
  },
  {
    id: "mv-014",
    name: "Mercedes-Benz Long Bus",
    type: "minibus",
    licensePlate: "AB 6666 FF",
    pricePerDay: 2500000,
    status: "available",
    imageUrl: null,
    category: "Bus",
    seatCapacity: 40,
    createdAt: "2024-05-01",
  },
];

export const sidebarNavItems: NavItemType[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Pricelist",
    href: "/dashboard/vehicles-pricelist",
    icon: "ClipboardList",
    hasSubmenu: false,
  },
  {
    label: "Tour Packages",
    href: "/dashboard/tour-packages",
    icon: "Map",
  },
  {
    label: "Testimonials & Gallery",
    href: "/dashboard/testimonials-gallery",
    icon: "FileText",
    hasSubmenu: true,
    children: [
      {
        label: "Galeri Wisatawan",
        href: "/dashboard/testimonials-gallery?tab=gallery",
        icon: "FileText",
      },
      {
        label: "Ulasan Google",
        href: "/dashboard/testimonials-gallery?tab=reviews",
        icon: "FileText",
      },
    ],
  },
  {
    label: "Promo & Pelanggan",
    href: "/dashboard/promo",
    icon: "Bell",
    hasSubmenu: true,
    children: [
      {
        label: "Kirim Broadcast",
        href: "/dashboard/promo?tab=compose",
        icon: "Bell",
      },
      {
        label: "Data Pelanggan",
        href: "/dashboard/promo?tab=customers",
        icon: "Bell",
      },
    ],
  },
  {
    label: "Contact",
    href: "/dashboard/contact",
    icon: "Mail",
  },
];

// Re-export from central lib/formatters – single source of truth
export { formatCurrency } from "@/lib/formatters";


// Dashboard Stats
export const dashboardStats: DashboardStat[] = [
  {
    label: "Total Web Click",
    value: "10.000",
    icon: "TrendingUp",
    iconBg: "bg-[#1B2A4A]",
    iconColor: "text-white",
  },
  {
    label: "Active Booking",
    value: "5",
    icon: "CalendarCheck",
    iconBg: "bg-[#22C55E]",
    iconColor: "text-white",
  },
  {
    label: "Available Units",
    value: "10",
    icon: "Car",
    iconBg: "bg-[#D4A843]",
    iconColor: "text-white",
  },
];

// Chart Data
export const weeklyChartData: ChartDataPoint[] = [
  { label: "Mon", revenue: 1200, bookings: 10 },
  { label: "Tue", revenue: 2800, bookings: 20 },
  { label: "Wed", revenue: 3200, bookings: 30 },
  { label: "Thu", revenue: 3800, bookings: 50 },
  { label: "Fri", revenue: 4800, bookings: 30 },
  { label: "Sat", revenue: 4600, bookings: 20 },
  { label: "Sun", revenue: 5200, bookings: 50 },
];

export const monthlyChartData: ChartDataPoint[] = [
  { label: "Jan", revenue: 8000, bookings: 10 },
  { label: "Feb", revenue: 12000, bookings: 40 },
  { label: "Mar", revenue: 15000, bookings: 70 },
  { label: "Apr", revenue: 18000, bookings: 50 },
  { label: "May", revenue: 22000, bookings: 30 },
  { label: "Jun", revenue: 25000, bookings: 20 },
  { label: "Jul", revenue: 28000, bookings: 40 },
  { label: "Aug", revenue: 32000, bookings: 60 },
  { label: "Sep", revenue: 30000, bookings: 10 },
  { label: "Oct", revenue: 35000, bookings: 20 },
  { label: "Nov", revenue: 38000, bookings: 10 },
  { label: "Dec", revenue: 42000, bookings: 50 },
];

// Recent Bookings
export const recentBookings: RecentBooking[] = [
  {
    id: 1,
    vehicleName: "Honda Scoopy",
    licensePlate: "DK 9012 CC",
    vehicleType: "motorcycle",
    duration: "3 days",
    date: "2026-03-15",
    initial: "H",
  },
  {
    id: 2,
    vehicleName: "Honda Scoopy",
    licensePlate: "DK 9012 CC",
    vehicleType: "motorcycle",
    duration: "3 days",
    date: "2026-03-15",
    initial: "H",
  },
  {
    id: 3,
    vehicleName: "Toyota Avanza",
    licensePlate: "AB 1234 CD",
    vehicleType: "car",
    duration: "5 days",
    date: "2026-03-14",
    initial: "T",
  },
  {
    id: 4,
    vehicleName: "Honda Beat 110",
    licensePlate: "AB 5678 EF",
    vehicleType: "motorcycle",
    duration: "2 days",
    date: "2026-03-13",
    initial: "H",
  },
];

// Booking History for Pricelist Page
export const mockBookingHistory: BookingHistory[] = [
  {
    id: "bh-001",
    vehicleName: "Honda Scoopy",
    licensePlate: "DK 9012 CC",
    type: "Motorcycle",
    bookingDate: "2026-03-15",
    time: "09:00",
    duration: "3 days",
    customer: "Sarah Johnson",
    phone: "+62 812-3456-7890",
    status: "BOOKED",
    notes: "Pickup at hotel",
  },
  {
    id: "bh-002",
    vehicleName: "Toyota Avanza",
    licensePlate: "AB 1234 CD",
    type: "Car",
    bookingDate: "2026-03-14",
    time: "10:30",
    duration: "5 days",
    customer: "Budi Santoso",
    phone: "+62 821-9876-5432",
    status: "BOOKED",
    notes: "Self drive, no driver",
  },
  {
    id: "bh-003",
    vehicleName: "Honda Beat 110",
    licensePlate: "AB 5678 EF",
    type: "Motorcycle",
    bookingDate: "2026-03-13",
    time: "14:00",
    duration: "2 days",
    customer: "John Doe",
    phone: "+62 853-1122-3344",
    status: "CANCELLED",
    notes: "Bring 2 helmets",
  },
];

// Tour Booking History
export const mockTourBookingHistory: TourBookingHistory[] = [
  {
    id: "tbh-001",
    packageName: "Bali Explorer",
    customerName: "John Doe",
    priceType: "per_person",
    vehicleType: "Toyota Hiace",
    pax: 4,
    totalPrice: 2000000,
    bookingDate: "2026-03-20",
    time: "08:00",
    phone: "+62 811-2233-4455",
  },
  {
    id: "tbh-002",
    packageName: "Ubud Culture Tour",
    customerName: "Jane Smith",
    priceType: "per_car",
    vehicleType: "Toyota Avanza",
    pax: 2,
    totalPrice: 450000,
    bookingDate: "2026-03-21",
    time: "09:00",
    phone: "+62 812-9988-7766",
  },
];

// Destinations
export const mockDestinations: Destination[] = [
  {
    id: "dest-001",
    title: "Pantai Losari Bali",
    titleEn: "Losari Beach Bali",
    description: "Nikmati keindahan pantai losari di bali yang menawarkan pemandangan matahari terbenam yang spektakuler.",
    descriptionEn: "Enjoy the beauty of Losari Beach in Bali offering spectacular sunset views.",
    imageUrl: "/images/destination-1.jpg",
  },
  {
    id: "dest-002",
    title: "Pantai Losari Bali",
    titleEn: "Losari Beach Bali",
    description: "Nikmati keindahan pantai losari di bali yang menawarkan pemandangan matahari terbenam yang spektakuler.",
    descriptionEn: "Enjoy the beauty of Losari Beach in Bali offering spectacular sunset views.",
    imageUrl: "/images/destination-2.jpg",
  },
  {
    id: "dest-003",
    title: "Pantai Losari Bali",
    titleEn: "Losari Beach Bali",
    description: "Nikmati keindahan pantai losari di bali yang menawarkan pemandangan matahari terbenam yang spektakuler.",
    descriptionEn: "Enjoy the beauty of Losari Beach in Bali offering spectacular sunset views.",
    imageUrl: "/images/destination-3.jpg",
  },
];

// Hero Content
export const mockHeroContent: HeroContent = {
  title: "Edit Holiday Destination!",
  titleEn: "Edit Holiday Destination!",
  subtitle: "Modifikasi dan atur konten yang tampil pada halaman depan untuk menarik lebih banyak pelanggan.",
  subtitleEn: "Modify and manage the content displayed on the front page to attract more customers.",
  featuredVehicle: "Honda Scoopy",
};

// Email Broadcasts
export const mockBroadcasts: EmailBroadcast[] = [
  {
    id: "em-001",
    subject: "Promo Akhir Tahun - Diskon 20%!",
    body: "Dapatkan diskon 20% untuk semua rental kendaraan selama periode 20-31 Desember 2026.",
    recipientCount: 150,
    sentAt: "2026-03-10T10:30:00",
    status: "sent",
  },
  {
    id: "em-002",
    subject: "Paket Tour Baru - Jogja Heritage",
    body: "Kami meluncurkan paket tur baru: Jogja Heritage & Candi Tour. Booking sekarang!",
    recipientCount: 120,
    sentAt: "2026-03-05T14:00:00",
    status: "sent",
  },
  {
    id: "em-003",
    subject: "Selamat Tahun Baru 2027!",
    body: "Terima kasih telah menjadi pelanggan setia kami. Semoga tahun baru membawa kebahagiaan!",
    recipientCount: 0,
    sentAt: "",
    status: "draft",
  },
];

// Customers
export const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "Budi Santoso",
    email: "budi@email.com",
    phone: "+62 812-3456-7890",
    totalBookings: 5,
    registeredAt: "2025-06-15",
  },
  {
    id: "cust-002",
    name: "Siti Rahayu",
    email: "siti.rahayu@email.com",
    phone: "+62 813-7890-1234",
    totalBookings: 3,
    registeredAt: "2025-08-22",
  },
  {
    id: "cust-003",
    name: "Ahmad Fauzi",
    email: "ahmad.f@email.com",
    phone: "+62 857-1234-5678",
    totalBookings: 8,
    registeredAt: "2025-04-10",
  },
  {
    id: "cust-004",
    name: "Dewi Lestari",
    email: "dewi.les@email.com",
    phone: "+62 878-5678-9012",
    totalBookings: 2,
    registeredAt: "2025-11-01",
  },
  {
    id: "cust-005",
    name: "Rizky Pratama",
    email: "rizky.p@email.com",
    phone: "+62 856-9012-3456",
    totalBookings: 6,
    registeredAt: "2025-03-28",
  },
];

export const mockPackages: TourPackage[] = [
  {
    id: "pkg-001",
    title: "Jogja Heritage & Candi Tour",
    titleEn: "Jogja Heritage & Temple Tour",
    description: "Nikmati perjalanan bersejarah menjelajahi keagungan budaya Yogyakarta dan Magelang, mulai dari keindahan Candi Borobudur hingga pesona Kraton Yogyakarta.",
    descriptionEn: "Enjoy a historical journey exploring the cultural grandeur of Yogyakarta and Magelang, from the beauty of Borobudur Temple to the charm of Kraton Yogyakarta.",
    imageUrl: "/images/destination-borobudur.png",
    estimatedPrice: 650000,
    duration: "Full Day",
    minPax: 2,
    maxPax: 15,
    startTime: "07:00 AM",
    endTime: "08:00 PM",
    includes: [
      "Kendaraan AC Premium",
      "Driver profesional & ramah",
      "BBM / Bahan Bakar",
      "Air mineral",
      "Penjemputan di Hotel/Stasiun"
    ],
    excludes: [
      "Tiket masuk wisata",
      "Biaya parkir & Tol",
      "Makan & Pengeluaran pribadi",
      "Tips driver (Seikhlasnya)",
      "Guide tambahan di destinasi wisata"
    ],
    vehicleOptions: [
      { id: "v1", name: "Avanza / Xenia", capacity: 6, pricePerDay: 650000 },
      { id: "v2", name: "Toyota Innova Reborn", capacity: 7, pricePerDay: 850000 },
      { id: "v3", name: "Toyota Hiace Commuter", capacity: 15, pricePerDay: 1300000 }
    ],
  },
  {
    id: "pkg-002",
    title: "Jogja Complete Package",
    titleEn: "Jogja Complete Package",
    description: "Rasakan pengalaman tak terlupakan dari indahnya pegunungan hingga pesona pantai selatan yang eksotis dalam satu paket perjalanan seru.",
    descriptionEn: "Experience an unforgettable journey from beautiful mountains to the exotic southern coastline in one exciting travel package.",
    imageUrl: "/images/hero-bg.png",
    estimatedPrice: 600000,
    duration: "Full Day",
    minPax: 2,
    maxPax: 15,
    startTime: "06:00 AM",
    endTime: "07:30 PM",
    includes: [
      "Kendaraan AC Premium",
      "Driver profesional & ramah",
      "BBM / Bahan Bakar",
      "Air mineral",
      "Penjemputan di area Jogja"
    ],
    excludes: [
      "Tiket masuk objek wisata",
      "Biaya parkir & Retribusi",
      "Makan pribadi",
      "Tips driver",
      "Sewa jeep (jika diperlukan di lokasi wisata)"
    ],
    vehicleOptions: [
      { id: "v1", name: "Avanza / Xenia", capacity: 6, pricePerDay: 600000 },
      { id: "v2", name: "Toyota Innova Reborn", capacity: 7, pricePerDay: 800000 },
      { id: "v3", name: "Isuzu Elf Long", capacity: 19, pricePerDay: 1400000 }
    ],
    category: "Private",
    priceType: "per_car",
    destinationTags: ["Uluwatu", "Jimbaran", "Padang Padang"],
    status: "active",
  },
  {
    id: "pkg-003",
    title: "City Tour Experience Jogja",
    titleEn: "City Tour Experience Jogja",
    description: "Jelajahi keasrian dan kearifan lokal kota Yogyakarta, nikmati jajanan khas dan pernak-pernik unik di setiap sudut kota.",
    descriptionEn: "Explore the beauty and local wisdom of Yogyakarta city, enjoy traditional snacks and unique souvenirs at every corner.",
    imageUrl: "/images/destinations.png",
    estimatedPrice: 500000,
    duration: "Half Day (10 Jam)",
    minPax: 2,
    maxPax: 6,
    startTime: "09:00 AM",
    endTime: "18:00",
    includes: [
      "Kendaraan AC Premium",
      "Driver / Guide",
      "BBM",
      "Free Parkir di rute kota"
    ],
    excludes: [
      "Tiket masuk museum/wisata",
      "Makan & Minum",
      "Tips"
    ],
    vehicleOptions: [
      { id: "v1", name: "Avanza / Xenia", capacity: 6, pricePerDay: 500000 },
      { id: "v2", name: "Honda Brio", capacity: 4, pricePerDay: 400000 }
    ],
    category: "Group",
    priceType: "per_person",
    destinationTags: ["Ubud", "Tegalalang", "Kintamani"],
    status: "draft",
  }
];

export const mockTourists: Tourist[] = [
  { id: "t-001", nationality: "Japan 🇯🇵", continent: "Asia", packageTaken: "Bali Explorer" },
  { id: "t-002", nationality: "Germany 🇩🇪", continent: "Europe", packageTaken: "Komodo Trip" },
  { id: "t-003", nationality: "USA 🇺🇸", continent: "Americas", packageTaken: "Raja Ampat Dive" },
  { id: "t-004", nationality: "South Korea 🇰🇷", continent: "Asia", packageTaken: "Jogja Heritage" },
  { id: "t-005", nationality: "France 🇫🇷", continent: "Europe", packageTaken: "Bali Explorer" },
  { id: "t-006", nationality: "Brazil 🇧🇷", continent: "Americas", packageTaken: "City Tour Jogja" },
];

export const mockGoogleReviews: GoogleReview[] = [
  {
    id: "r-001",
    name: "Sarah Johnson",
    country: "USA 🇺🇸",
    rating: 5,
    comment: "Amazing experience! DriveNusa made our trip unforgettable.",
  },
  {
    id: "r-002",
    name: "Hiroshi Tanaka",
    country: "Japan 🇯🇵",
    rating: 5,
    comment: "Excellent service and very professional staff.",
  },
  {
    id: "r-003",
    name: "Maria Garcia",
    country: "Spain 🇪🇸",
    rating: 4,
    comment: "Great tour packages with comfortable vehicles. Highly recommended!",
  },
  {
    id: "r-004",
    name: "Chen Wei",
    country: "China 🇨🇳",
    rating: 5,
    comment: "Best car rental experience in Yogyakarta. Will come back again!",
  },
];
