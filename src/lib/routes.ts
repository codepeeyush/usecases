export const clarityCareBasePath = '/clarity-care'
export const summitTrailBasePath = '/summit-trail'

export const clarityCarePaths = {
  home: clarityCareBasePath,
  bookCall: `${clarityCareBasePath}/book-call`,
}

export const clarityCarePath = clarityCarePaths.home

export function buildClarityCareBookCallPath({
  service,
  format,
}: {
  service?: string
  format?: string
} = {}) {
  const params = new URLSearchParams()

  if (service) {
    params.set('service', service)
  }

  if (format) {
    params.set('format', format)
  }

  const query = params.toString()

  return query ? `${clarityCarePaths.bookCall}?${query}` : clarityCarePaths.bookCall
}

export const summitTrailPaths = {
  home: summitTrailBasePath,
  shop: `${summitTrailBasePath}/shop`,
  cart: `${summitTrailBasePath}/cart`,
  checkout: `${summitTrailBasePath}/checkout`,
  product: (id: string) => `${summitTrailBasePath}/shop/${id}`,
  category: (category: string) =>
    `${summitTrailBasePath}/shop?category=${encodeURIComponent(category)}`,
}
