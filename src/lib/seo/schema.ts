import { Property } from '@/types/database';
import { siteConfig } from '@/config/site';

/**
 * Validated Schema.org structured data generators.
 * Conforms strictly to Schema.org standards (LandPlot, SingleFamilyResidence, Apartment, Place, RealEstateAgent, BreadcrumbList, FAQPage).
 *
 * NOTE ON SEARCH ENGINES & RICH RESULTS:
 * Schema.org markup provides explicit semantic context for search engine crawlers,
 * knowledge graphs, and generative answer engines (ChatGPT, Perplexity, Google AI Overviews).
 * It does NOT guarantee Google rich snippet displays or specific SERP rankings, which
 * remain subject to search engine discretion, site authority, and query intent.
 */

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.name,
    alternateName: ['Homace Real Estate', 'Homace Realators', 'HomaceBuild'],
    description: siteConfig.description,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/HomaceLogo.png`,
      caption: siteConfig.name,
    },
    image: `${siteConfig.url}/HomaceLogo.png`,
    telephone: siteConfig.contact.phone !== 'To be provided' ? siteConfig.contact.phone : undefined,
    email: siteConfig.contact.email !== 'To be provided' ? siteConfig.contact.email : undefined,
    priceRange: 'PKR',
    currenciesAccepted: 'PKR',
    paymentAccepted: 'Cash, Cheque, Bank Transfer, Pay Order',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Commercial Area, Bahria Town',
      addressLocality: 'Islamabad / Rawalpindi',
      addressRegion: 'Islamabad Capital Territory / Punjab',
      postalCode: '46220',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '33.5247',
      longitude: '73.0963',
    },
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: 'Bahria Town Rawalpindi',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Bahria Town Islamabad',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'DHA Islamabad',
      },
      {
        '@type': 'City',
        name: 'Islamabad',
      },
      {
        '@type': 'City',
        name: 'Rawalpindi',
      },
    ],
    knowsAbout: [
      'Residential Plot Sales & Transfers',
      'Commercial Real Estate Acquisition',
      'Bahria Town Transfer Procedures',
      'DHA Islamabad Transfer NDC Clearance',
      'Marla to Square Feet Calculations (225 sq ft standard)',
      'Property Valuation & Verification',
    ],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generatePropertySchema(property: Property, canonicalUrl: string) {
  const isRental = property.purpose === 'rent';
  const baseOffer = {
    '@type': 'Offer',
    priceCurrency: 'PKR',
    price: property.is_price_on_call ? undefined : property.price_pkr,
    priceSpecification: property.is_price_on_call
      ? undefined
      : {
          '@type': 'UnitPriceSpecification',
          price: property.price_pkr,
          priceCurrency: 'PKR',
          unitText: isRental ? 'MONTH' : undefined,
        },
    availability:
      property.availability_status === 'available'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
    url: canonicalUrl,
    businessFunction: isRental
      ? 'https://schema.org/LeaseOut'
      : 'https://schema.org/Sell',
    seller: {
      '@type': 'RealEstateAgent',
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.contact.phone !== 'To be provided' ? siteConfig.contact.phone : undefined,
    },
  };

  const commonData = {
    '@context': 'https://schema.org',
    name: property.title,
    description: property.description || undefined,
    url: canonicalUrl,
    image: property.images.length > 0 ? property.images : [`${siteConfig.url}/HomaceLogo.png`],
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      streetAddress: [property.sector_block, property.area_location].filter(Boolean).join(', '),
      addressCountry: 'PK',
    },
    offers: baseOffer,
  };

  // 1. Plots and Land (Residential & Commercial)
  if (
    property.category === 'residential_plot' ||
    property.category === 'commercial_plot'
  ) {
    return {
      ...commonData,
      '@type': 'LandPlot',
      landArea: {
        '@type': 'QuantitativeValue',
        value: Number(property.area_in_sqft),
        unitCode: 'FTK', // UN/CEFACT code for Square Foot
        description: `${property.area_value} ${property.area_unit} (${property.marla_sqft_standard} sq ft/Marla standard)`,
      },
    };
  }

  // 2. Houses and Luxury Villas
  if (property.category === 'house') {
    return {
      ...commonData,
      '@type': 'SingleFamilyResidence',
      numberOfBedrooms: property.bedrooms ?? undefined,
      numberOfBathroomsTotal: property.bathrooms ?? undefined,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: Number(property.area_in_sqft),
        unitCode: 'FTK',
      },
    };
  }

  // 3. Apartments and Flats
  if (property.category === 'apartment') {
    return {
      ...commonData,
      '@type': 'Apartment',
      numberOfBedrooms: property.bedrooms ?? undefined,
      numberOfBathroomsTotal: property.bathrooms ?? undefined,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: Number(property.area_in_sqft),
        unitCode: 'FTK',
      },
    };
  }

  // 4. Commercial Real Estate (Shop, Office, Plaza)
  // Schema.org does not have a native "CommercialProperty" type; valid standard type is "Place" with additionalType
  return {
    ...commonData,
    '@type': 'Place',
    additionalType: 'https://schema.org/CommercialBuilding',
    floorSize: {
      '@type': 'QuantitativeValue',
      value: Number(property.area_in_sqft),
      unitCode: 'FTK',
    },
  };
}
