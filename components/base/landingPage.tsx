import React from 'react'
import Hero from './hero'
import Navbar from "./navbar"
import AboutSection from './aboutSection'
import WhyUsSection from './whyUsSection'
import TablesSection from './tableSection'
import TestimoniesSection from './testimoniesSection'
import FaqSection from './faqSection'
import Footer from './footer'
function landingPage() {
  return (
    <>
    <Navbar/>
      <Hero/>
      <TablesSection/>
      <AboutSection/>
      <WhyUsSection/>
      <TestimoniesSection/>
      <FaqSection/>
      <Footer/>
    </>
  )
}

export default landingPage