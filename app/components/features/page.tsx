'use client';

import { motion } from 'framer-motion';

export default function Features() {
    const features = [
        {
            title: "Emoji Reactions",
            description: "Express your food experience with fun emoji reactions. Rate restaurants with 😋, 🌶️, 🍰, and more to help others find their perfect match.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            )
        },
        {
            title: "Cuisine Filters",
            description: "Easily filter restaurants by cuisine type. From Indian to Italian, Chinese to Mexican, find exactly what you're craving.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
            )
        },
        {
            title: "AI-Powered Recommendations",
            description: "Our AI learns from your emoji reactions and cuisine preferences to suggest restaurants that match your taste perfectly.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
            )
        },
        {
            title: "Real-Time Updates",
            description: "Get instant updates about restaurant availability, wait times, and special offers. Never miss out on the best dining experiences.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            )
        }
    ];

    return (
        <section id="features" className="py-12 md:py-20 bg-black relative overflow-hidden scroll-mt-20">
            {/* Background gradient effect */}
            <div className="absolute inset-0  opacity-50"></div>
            
            <div className="container mx-auto px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 md:mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4  bg-clip-text">
                        Features You'll Love
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Discover why Zoto is your perfect restaurant companion
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 transform transition-transform duration-300 group-hover:scale-110">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl mt-4 font-semibold mb-3 text-white group-hover:text-orange-500 transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 text-sm md:text-base">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}