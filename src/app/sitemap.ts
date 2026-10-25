import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // Fetch published properties
  const { data: properties } = await supabase
    .from('properties')
    .select('slug, updated_at')
    .eq('publication_status', 'published');

  const propertyUrls: MetadataRoute.Sitemap = (properties || []).map((property) => ({
    url: `${siteConfig.url}/properties/${property.slug}`,
    lastModified: new Date(property.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/locations/bahria-town`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/locations/dha-islamabad`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  return [...staticUrls, ...propertyUrls];
}
