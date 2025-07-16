'use client';

import { motion } from 'framer-motion';

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Set Your Location",
            description: "Allow Zoto to access your location or enter your preferred area to find the best restaurants nearby.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            )
        },
        {
            number: "02",
            title: "Choose Your Preferences",
            description: "Select your favorite cuisines, dietary restrictions, and price range to personalize your recommendations.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                </svg>
            )
        },
        {
            number: "03",
            title: "Get AI Recommendations",
            description: "Our AI analyzes thousands of restaurants and reviews to suggest the perfect spots that match your taste.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
            )
        },
        {
            number: "04",
            title: "Enjoy Your Meal",
            description: "Visit your chosen restaurant and enjoy a perfect dining experience tailored to your preferences.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            )
        }
    ];

    return (
        <section id="how-it-works" className="py-12 md:py-20 bg-black relative overflow-hidden scroll-mt-20">
            <div className="container mx-auto px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 md:mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-red-500 bg-clip-text">
                       Easy Steps 
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Four simple steps to find your perfect dining spot
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative"
                        >
                            <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
                                        {step.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-orange-500 font-bold text-lg">{step.number}</span>
                                            <h3 className="text-xl font-semibold text-white">
                                                {step.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-400 text-sm md:text-base">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute left-1/2 top-full w-0.5 h-8 bg-gradient-to-b from-orange-500/50 to-transparent"></div>
                            )}
                        </motion.div>
                    ))}
                </div>

                
            </div>
        </section>
    );
}