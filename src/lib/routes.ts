export const clarityCarePath = '/clarity-care'
export const summitTrailBasePath = '/summit-trail'

export const summitTrailPaths = {
  home: summitTrailBasePath,
  shop: `${summitTrailBasePath}/shop`,
  cart: `${summitTrailBasePath}/cart`,
  checkout: `${summitTrailBasePath}/checkout`,
  product: (id: string) => `${summitTrailBasePath}/shop/${id}`,
  category: (category: string) =>
    `${summitTrailBasePath}/shop?category=${encodeURIComponent(category)}`,
}
