import Header from '@/components/healthcare/Header'
import HeroSection from '@/components/healthcare/HeroSection'
import StatsBar from '@/components/healthcare/StatsBar'
import AboutSection from '@/components/healthcare/AboutSection'
import WhyChooseUs from '@/components/healthcare/WhyChooseUs'
import ServicesSection from '@/components/healthcare/ServicesSection'
import BenefitsList from '@/components/healthcare/BenefitsList'
import Testimonials from '@/components/healthcare/Testimonials'
import TeamSection from '@/components/healthcare/TeamSection'
import FAQSection from '@/components/healthcare/FAQSection'
import ContactSection from '@/components/healthcare/ContactSection'
import Footer from '@/components/healthcare/Footer'

export default function HealthcarePage() {
  return (
    <div className="healthcare bg-background text-foreground min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsBar />
        <AboutSection />
        <WhyChooseUs />
        <ServicesSection />
        <BenefitsList />
        <Testimonials />
        <TeamSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
