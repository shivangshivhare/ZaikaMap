'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Testimonials() {
    const testimonials = [
        {
            name: "Priya Sharma",
            role: "Food Blogger",
            image: "/testimonials/user1.jpg",
            rating: "⭐⭐⭐⭐⭐",
            review: "Zoto's emoji reactions make rating restaurants so fun! Found my new favorite Indian restaurant thanks to the AI recommendations.",
            emoji: "😋"
        },
        {
            name: "Rahul Patel",
            role: "Food Enthusiast",
            image: "/testimonials/user2.jpg",
            rating: "⭐⭐⭐⭐⭐",
            review: "The cuisine filters are amazing! I can easily find authentic restaurants based on my mood. The spicy food recommendations are spot on!",
            emoji: "🌶️"
        },
        {
            name: "Ananya Singh",
            role: "Traveler",
            image: "/testimonials/user3.jpg",
            rating: "⭐⭐⭐⭐⭐",
            review: "As someone who travels frequently, Zoto helps me discover local gems wherever I go. The real-time updates are super helpful!",
            emoji: "🌟"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-black relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full filter blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 md:mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text">
                        What Our Users Say
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Join thousands of food lovers who found their perfect dining spots with Zoto
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all duration-300"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center text-2xl">
                                    {testimonial.emoji}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                                </div>
                            </div>
                            <div className="text-orange-500 mb-3">{testimonial.rating}</div>
                            <p className="text-gray-300 text-sm md:text-base">
                                "{testimonial.review}"
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center mt-12"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                        Join Our Community
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
} 