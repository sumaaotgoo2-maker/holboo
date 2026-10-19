import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://holboo-ten.vercel.app';
  return [
    { url: base, lastModified: new Date() },
    { url: base + '/post', lastModified: new Date() },
  ];
}
