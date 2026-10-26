export const siteConfig = {
  name: "HomaceBuild and Realators",
  tagline: "WE ENGINEER YOUR DREAMS",
  description: "Specialized residential and commercial real estate solutions across Bahria Town, DHA, and the Islamabad/Rawalpindi region.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  
  // Primary operational locations
  primaryMarkets: [
    "Bahria Town Islamabad / Rawalpindi",
    "DHA Islamabad / Rawalpindi",
    "Islamabad Sectors",
  ],

  // Contact placeholders (populated via environment variables)
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+92 300 6100619",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923006100619", // Central verified WhatsApp number
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@homacebuild.com",
    city: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Islamabad",
    country: "Pakistan",
  },

  // Official Social Media & Channel Links
  social: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923006100619",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/homacebuild",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/homacebuild",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://www.tiktok.com/@homacebuild",
  },

  // Documented property categories
  categories: [
    { value: "residential_plot", label: "Residential Plot", group: "Residential" },
    { value: "house", label: "House / Villa", group: "Residential" },
    { value: "apartment", label: "Apartment / Flat", group: "Residential" },
    { value: "commercial_plot", label: "Commercial Plot", group: "Commercial" },
    { value: "shop", label: "Commercial Shop", group: "Commercial" },
    { value: "office", label: "Corporate Office", group: "Commercial" },
    { value: "plaza", label: "Commercial Plaza", group: "Commercial" },
  ],

  // Status indicators for plot and construction development
  plotFileStatuses: [
    { value: "not_applicable", label: "Standard Listing" },
    { value: "possession", label: "Possession Ready" },
    { value: "balloted", label: "Balloted Plot" },
    { value: "allocated", label: "Allocated File" },
    { value: "file", label: "Property File" },
  ],
} as const;
