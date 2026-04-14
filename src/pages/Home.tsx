import Hero from '@/components/home/Hero'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BrandStory from '@/components/home/BrandStory'
import Newsletter from '@/components/home/Newsletter'

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandStory />
      <Newsletter />
    </main>
  )
}
