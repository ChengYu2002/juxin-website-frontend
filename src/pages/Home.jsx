// src/pages/Home.jsx
import Hero from '../components/Hero'
import PartnersMarquee from '../components/PartnersMarquee'
import HomeRecommendations from '../components/HomeRecommendations'
import usePageTitle from '../hooks/usePageTitle'

export default function Home() {
  // 设置页面标题
  usePageTitle('Juxin - Trolley & Utility Cart Manufacturer')
  return (
    <>
      <Hero/>
      <PartnersMarquee/>
      <HomeRecommendations/>

    </>
  )
}
