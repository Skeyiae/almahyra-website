import { MetadataRoute } from 'next'
import { getProperties } from './lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://almahyra-property.com'
  
  // Mengambil semua data properti untuk generate link otomatis
  const properties = await getProperties()
  
  const propertyEntries = properties.map((prop) => ({
    url: `${baseUrl}/${prop.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...propertyEntries,
  ]
}
