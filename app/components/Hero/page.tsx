'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';  
import giphy from '../../../public/gifs/giphy.gif';


export default function Hero() {
    const [showSpinner, setShowSpinner] = useState(false);
    const router = useRouter();

    const headlines = [
        "Find Your Perfect Restaurant 🍽️",
        "Discover Hidden Gems Near You 🔍",
        "Rate with Emojis 😋",
        "Filter by Cuisine 🍜",
        "Get Personalized Recommendations 🎯",
        "Share Your Food Journey 📸",
        "Explore Local Favorites 🌟",
        "Find Spicy Delights 🌶️",
        "Discover Sweet Treats 🍰",
        "Try New Flavors 🆕"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % headlines.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Spinner handler
    const handleFindRestaurants = async () => {
        setShowSpinner(true);
        await new Promise(resolve => setTimeout(resolve, 900)); 
        router.push('/pages/findrest');
    };

    return (
        <>
            {showSpinner ? (
                <div className="flex justify-center items-center h-screen bg-black">
                    <Image src={giphy} alt="Loading" width={1100} height={1100} />
                </div>
            ) : (
                <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-black to-black-900 overflow-hidden">
                    {/* Animated Blobs - shifted down to avoid header */}
                    <div className="pointer-events-none absolute left-0 top-40 w-[400px] h-[400px] bg-orange-500 opacity-30 rounded-full filter blur-3xl animate-blob1 z-0"></div>
                    <div className="pointer-events-none absolute right-0 top-1/2 w-[300px] h-[300px] bg-red-500 opacity-20 rounded-full filter blur-2xl animate-blob2 z-0"></div>
                    <div className="pointer-events-none absolute left-1/2 bottom-10 w-[350px] h-[350px] bg-yellow-500 opacity-20 rounded-full filter blur-2xl animate-blob3 z-0"></div>
                    
                    {/* Content */}
                    <div className="text-center px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl mx-auto"
                        >
                            <div className="h-[120px] md:h-[160px] flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.h1
                                        key={currentIndex}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-4xl md:text-5xl font-bold absolute"
                                    >
                                        {headlines[currentIndex]}
                                    </motion.h1>
                                </AnimatePresence>
                            </div>
                            <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-light">
                                Your AI-powered restaurant companion
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleFindRestaurants}
                                    className="bg-red-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-600 transition-colors w-full md:w-auto cursor-pointer"
                                >
                                    Find Restaurants
                                </motion.button>
                                {/* <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="border border-orange-500 text-orange-500 px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-500/10 transition-colors w-full md:w-auto"
                                >
                                    How It Works
                                </motion.button> */}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}
        </>
    );
}