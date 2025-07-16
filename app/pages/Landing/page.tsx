"use client"


import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/app/components/header/page';
import Hero from '@/app/components/Hero/page';
import Features from '../../components/features/page';
import HowItWorks from '../../components/howitworks/page';
import Testimonials from '../../components/testimonials/page';
import Footer from '../../components/footer/page';
import Demo from '@/app/components/demo/page';
export default function LandingPage() {
    return (
        // <div className="min-h-screen bg-black text-white">
        <>
        <div className='min-h-screen bg-black text-white'>
        <Header/>

        <main className="relative">
            <div className="relative z-10">
                <Hero/>
            </div>

            <div className='container mx-auto px-6 py-4'>
                <Features/>
            </div>
            <div className='container mx-auto px-6 py-4 mt-20'>
                <Demo/>
            </div>
            <div className='container mx-auto px-6 py-4 mt-20'>
                <HowItWorks/>
            </div>
            

            <div className='mt-20'>
                <Testimonials/>
            </div>
        </main>
        <Footer/>
        </div>
        </>
    );
}
