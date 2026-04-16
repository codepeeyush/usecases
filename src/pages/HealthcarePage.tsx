import AboutSection from '@/components/healthcare/AboutSection'
import BenefitsList from '@/components/healthcare/BenefitsList'
import CareJourneySection from '@/components/healthcare/CareJourneySection'
import HeroSection from '@/components/healthcare/HeroSection'
import ContactSection from '@/components/healthcare/ContactSection'
import FAQSection from '@/components/healthcare/FAQSection'
import HealthcareShell from '@/components/healthcare/HealthcareShell'
import ServicesSection from '@/components/healthcare/ServicesSection'
import StatsBar from '@/components/healthcare/StatsBar'
import TeamSection from '@/components/healthcare/TeamSection'
import Testimonials from '@/components/healthcare/Testimonials'
import WhyChooseUs from '@/components/healthcare/WhyChooseUs'
import { useHashScroll } from '@/hooks/useHashScroll'

export default function HealthcarePage() {
  useHashScroll()

  return (
    <HealthcareShell>
        <HeroSection />
        <StatsBar />
        <AboutSection />
        <WhyChooseUs />
        <ServicesSection />
        <CareJourneySection />
        <BenefitsList />
        <Testimonials />
        <TeamSection />
        <FAQSection />
        <ContactSection />
    </HealthcareShell>
  )
}
