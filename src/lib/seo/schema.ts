import { Property } from '@/types/database';
import { siteConfig } from '@/config/site';

/**
 * Validated Schema.org structured data generators.
 * Conforms strictly to Schema.org standards (LandPlot, SingleFamilyResidence, CommercialProperty, RealEstateAgent).
 * Note: While this markup provides semantic entities for search engines and generative models,
 * it does not guarantee SERP rich-cards or rankings.
 */

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/HomaceLogo.png`,
    areaServed: [
      {
        '@type': 'City',
        name: 'Islamabad',
      },
      {
        '@type': 'City',
        name: 'Rawalpindi',
      },
      {
        '@type': 'Place',
        name: 'Bahria Town Islamabad / Rawalpindi',
      },
      {
        '@type': 'Place',
        name: 'DHA Islamabad / Rawalpindi',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Islamabad',
      addressCountry: 'PK',
    },
    telephone: siteConfig.contact.phone !== 'To be provided' ? siteConfig.contact.phone : undefined,
    email: siteConfig.contact.email !== 'To be provided' ? siteConfig.contact.email : undefined,
  };
}

export function generatePropertySchema(property: Property, canonicalUrl: string) {
  const baseOffer = {
    '@type': 'Offer',
    priceCurrency: 'PKR',
    price: property.is_price_on_call ? undefined : property.price_pkr,
    availability:
      property.availability_status === 'available'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
    url: canonicalUrl,
    businessFunction:
      property.purpose === 'rent'
        ? 'https://schema.org/LeaseOut'
        : 'https://schema.org/Sell',
  };

  const commonData = {
    '@context': 'https://schema.org',
    name: property.title,
    description: property.description || undefined,
    url: canonicalUrl,
    image: property.images.length > 0 ? property.images : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      streetAddress: [property.area_location, property.sector_block].filter(Boolean).join(', '),
      addressCountry: 'PK',
    },
    offers: baseOffer,
  };

  // 1. Plots and Raw Land
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
      },
    };
  }

  // 2. Houses and Villas
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

  // 3. Apartments
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

  // 4. Commercial Properties (Shop, Office, Plaza)
  return {
    ...commonData,
    '@type': 'CommercialProperty',
    floorSize: {
      '@type': 'QuantitativeValue',
      value: Number(property.area_in_sqft),
      unitCode: 'FTK',
    },
  };
}
