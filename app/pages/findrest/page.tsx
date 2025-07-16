'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const foodStyles = [
    { emoji: '🍳', label: 'Home Style', value: 'home_style' },
    { emoji: '🌟', label: 'Fine Dining', value: 'fine_dining' },
    { emoji: '🌮', label: 'Street Food', value: 'street_food' },
    { emoji: '🍖', label: 'Comfort Food', value: 'comfort_food' },
    { emoji: '🥗', label: 'Healthy', value: 'healthy' },
];

const tastePreferences = [
    { label: 'Spicy', value: 'spicy', icon: '🌶️' },
    { label: 'Sweet', value: 'sweet', icon: '🍯' },
    { label: 'Savory', value: 'savory', icon: '🧂' },
    { label: 'Tangy', value: 'tangy', icon: '🍋' },
    { label: 'Rich', value: 'rich', icon: '🍫' },
];

const cuisines = [
    { label: 'Indian', value: 'indian', flag: '🇮🇳' },
    { label: 'Italian', value: 'italian', flag: '🇮🇹' },
    { label: 'Chinese', value: 'chinese', flag: '🇨🇳' },
    { label: 'Mexican', value: 'mexican', flag: '🇲🇽' },
    { label: 'Japanese', value: 'japanese', flag: '🇯🇵' },
    { label: 'Thai', value: 'thai', flag: '🇹🇭' },
    { label: 'Korean', value: 'korean', flag: '🇰🇷' },
    { label: 'Mediterranean', value: 'mediterranean', flag: '🌊' },
];

const dietaryPreferences = [
    { label: 'Vegetarian', value: 'vegetarian', icon: '🥗' },
    { label: 'Vegan', value: 'vegan', icon: '🌱' },
    { label: 'Gluten-Free', value: 'gluten-free', icon: '🌾' },
    { label: 'Halal', value: 'halal', icon: '🕌' },
    { label: 'Keto', value: 'keto', icon: '🥑' },
];

const mealTypes = [
    { label: 'Breakfast', value: 'breakfast', icon: '☕' },
    { label: 'Lunch', value: 'lunch', icon: '🍱' },
    { label: 'Dinner', value: 'dinner', icon: '🍽️' },
    { label: 'Snacks', value: 'snacks', icon: '🥨' },
    { label: 'Dessert', value: 'dessert', icon: '🍰' },
    { label: 'Coffee', value: 'coffee', icon: '☕' },
];



export default function FindRest() {
    const [selectedStyle, setSelectedStyle] = useState('');
    const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
    const [selectedMealType, setSelectedMealType] = useState('');
    const [selectedCoffee, setSelectedCoffee] = useState('');
    const [budget, setBudget] = useState('medium');
    const [showModal, setShowModal] = useState(false);
    const [foodPreference, setFoodPreference] = useState('');
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);

    const [descriptions, setDescriptions] = useState({
        style: '',
        cuisine: '',
        taste: '',
        dietary: '',
        meal: '',
        budget: '',
        coffee: ''
    });

    const handleDescriptionChange = (category: string, value: string) => {
        setDescriptions(prev => ({
            ...prev,
            [category]: value
        }));
    };

    const handleTasteToggle = (taste: string) => {
        setSelectedTastes(prev => 
            prev.includes(taste) 
                ? prev.filter(t => t !== taste)
                : [...prev, taste]
        );
    };

    const handleCuisineToggle = (cuisine: string) => {
        setSelectedCuisines(prev => 
            prev.includes(cuisine) 
                ? prev.filter(c => c !== cuisine)
                : [...prev, cuisine]
        );
    };

    const handleDietaryToggle = (diet: string) => {
        setSelectedDietary(prev => 
            prev.includes(diet) 
                ? prev.filter(d => d !== diet)
                : [...prev, diet]
        );
    };

    const handleFindRestaurants = async () => {
        try {
            setIsLoading(true);
            setError(null);
            console.log('Starting restaurant search...');

            if (!selectedCuisines.length) {
                throw new Error('Please select at least one cuisine');
            }

            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    (error) => {
                        console.error('Geolocation error:', error);
                        reject(new Error('Please enable location access to find restaurants'));
                    },
                    { timeout: 5000 }
                );
            });

            const requestBody = {
                style: selectedStyle,
                tastes: selectedTastes,
                cuisines: selectedCuisines,
                dietary: selectedDietary,
                mealType: selectedMealType,
                budget: budget,
                descriptions: descriptions,
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                foodPreference: foodPreference
            };

            const response = await fetch('/api/filterRest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch restaurants');
            }

            if (!data.restaurants || data.restaurants.length === 0) {
                throw new Error('No restaurants found matching your preferences');
            }

            setRestaurants(data.restaurants);
            setShowResults(true);
        } catch (err) {
            console.error('Error finding restaurants:', err);
            setError(err instanceof Error ? err.message : 'Failed to find restaurants');
            setRestaurants([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExactWriteSubmit = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setShowModal(false);
            
            if (!foodPreference.trim()) {
                throw new Error('Please describe what you want to eat.');
            }

            // Get user's location first
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    (error) => {
                        console.error('Geolocation error:', error);
                        reject(new Error('Please enable location access to find restaurants'));
                    },
                    { timeout: 5000 }
                );
            });

            const requestBody = {
                customPrompt: foodPreference,
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            };

            const response = await fetch('/api/writeandfind', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch restaurants');
            }

            if (!data.restaurants || data.restaurants.length === 0) {
                throw new Error('No restaurants found matching your request');
            }

            setRestaurants(data.restaurants);
            setShowResults(true);
            setShowModal(false);
        } catch (err) {
            console.error('Error finding restaurants:', err);
            setError(err instanceof Error ? err.message : 'Failed to find restaurants');
            setRestaurants([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToInput = () => {
        setShowResults(false);
        setRestaurants([]);
    };

    return (
        <div className="min-h-screen text-white">
            {/* Header */}
            <header className="border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/">
                        <h1 className="text-4xl font-bold text-orange-400">Zoto</h1>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    {!showResults ? (
                        // Input Form Section
                        <>
                            <h2 className="text-2xl font-semibold mb-8 text-center">
                                Tell us about your food preferences
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Food Style Selection */}
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-lg font-medium mb-4">What style of food are you looking for?</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {foodStyles.map((style) => (
                                            <motion.button
                                                key={style.value}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedStyle(style.value)}
                                                className={`p-3 rounded-lg border-2 transition-colors ${
                                                    selectedStyle === style.value
                                                        ? 'border-orange-400 bg-orange-400/10'
                                                        : 'border-gray-700 hover:border-orange-400/50'
                                                }`}
                                            >
                                                <div className="text-2xl mb-1">{style.emoji}</div>
                                                <div className="text-sm">{style.label}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={descriptions.style}
                                        onChange={(e) => handleDescriptionChange('style', e.target.value)}
                                        placeholder="Describe your ideal dining experience with proper city and country name..."
                                        className="mt-4 w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none  transition-colors resize-none"
                                        rows={2}
                                    />
                                </div>

                                {/* Coffee Preferences */}
                                {/* <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-lg font-medium mb-4">Coffee Preferences</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {coffeePreferences.map((coffee) => (
                                            <motion.button
                                                key={coffee.value}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedCoffee(coffee.value)}
                                                className={`p-3 rounded-lg border-2 transition-colors ${
                                                    selectedCoffee === coffee.value
                                                        ? 'border-orange-400 bg-orange-400/10'
                                                        : 'border-gray-700 hover:border-orange-400/50'
                                                }`}
                                            >
                                                <div className="text-2xl mb-1">{coffee.icon}</div>
                                                <div className="text-sm">{coffee.label}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={descriptions.coffee}
                                        onChange={(e) => handleDescriptionChange('coffee', e.target.value)}
                                        placeholder="Describe your coffee preferences..."
                                        className="mt-4 w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-colors resize-none"
                                        rows={2}
                                    />
                                </div> */}

                                {/* Cuisine Selection */}
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-lg font-medium mb-4">What cuisines do you prefer?</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {cuisines.map((cuisine) => (
                                            <motion.button
                                                key={cuisine.value}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleCuisineToggle(cuisine.value)}
                                                className={`p-3 rounded-lg border-2 transition-colors ${
                                                    selectedCuisines.includes(cuisine.value)
                                                        ? 'border-orange-400 bg-orange-400/10'
                                                        : 'border-gray-700 hover:border-orange-400/50'
                                                }`}
                                            >
                                                <div className="text-2xl mb-1">{cuisine.flag}</div>
                                                <div className="text-sm">{cuisine.label}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={descriptions.cuisine}
                                        onChange={(e) => handleDescriptionChange('cuisine', e.target.value)}
                                        placeholder="Describe your cuisine preferences in detail..."
                                        className="mt-4 w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-colors resize-none"
                                        rows={2}
                                    />
                                </div>

                                {/* Taste Preferences */}
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-lg font-medium mb-4">What flavors do you prefer?</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {tastePreferences.map((taste) => (
                                            <motion.button
                                                key={taste.value}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleTasteToggle(taste.value)}
                                                className={`p-3 rounded-lg border-2 transition-colors ${
                                                    selectedTastes.includes(taste.value)
                                                        ? 'border-orange-400 bg-orange-400/10'
                                                        : 'border-gray-700 hover:border-orange-400/50'
                                                }`}
                                            >
                                                <div className="text-2xl mb-1">{taste.icon}</div>
                                                <div className="text-sm">{taste.label}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={descriptions.taste}
                                        onChange={(e) => handleDescriptionChange('taste', e.target.value)}
                                        placeholder="Describe your taste preferences..."
                                        className="mt-4 w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-colors resize-none"
                                        rows={2}
                                    />
                                </div>

                                {/* Dietary Preferences */}
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-lg font-medium mb-4">Any dietary preferences?</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {dietaryPreferences.map((diet) => (
                                            <motion.button
                                                key={diet.value}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDietaryToggle(diet.value)}
                                                className={`p-3 rounded-lg border-2 transition-colors ${
                                                    selectedDietary.includes(diet.value)
                                                        ? 'border-orange-400 bg-orange-400/10'
                                                        : 'border-gray-700 hover:border-orange-400/50'
                                                }`}
                                            >
                                                <div className="text-2xl mb-1">{diet.icon}</div>
                                                <div className="text-sm">{diet.label}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={descriptions.dietary}
                                        onChange={(e) => handleDescriptionChange('dietary', e.target.value)}
                                        placeholder="Describe your dietary preferences..."
                                        className="mt-4 w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-colors resize-none"
                                        rows={2}
                                    />
                                </div>

                                {/* Meal Type */}
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-lg font-medium mb-4">What type of meal?</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {mealTypes.map((meal) => (
                                            <motion.button
                                                key={meal.value}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedMealType(meal.value)}
                                                className={`p-3 rounded-lg border-2 transition-colors ${
                                                    selectedMealType === meal.value
                                                        ? 'border-orange-400 bg-orange-400/10'
                                                        : 'border-gray-700 hover:border-orange-400/50'
                                                }`}
                                            >
                                                <div className="text-2xl mb-1">{meal.icon}</div>
                                                <div className="text-sm">{meal.label}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={descriptions.meal}
                                        onChange={(e) => handleDescriptionChange('meal', e.target.value)}
                                        placeholder="Describe your meal preferences..."
                                        className="mt-4 w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-colors resize-none"
                                        rows={2}
                                    />
                                </div>

                                {/* Budget Selection */}
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-lg font-medium mb-4">What's your budget?</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['low', 'medium', 'high'].map((option) => (
                                            <motion.button
                                                key={option}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setBudget(option)}
                                                className={`p-3 rounded-lg border-2 transition-colors ${
                                                    budget === option
                                                        ? 'border-orange-400 bg-orange-400/10'
                                                        : 'border-gray-700 hover:border-orange-400/50'
                                                }`}
                                            >
                                                <div className="text-sm capitalize">{option}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={descriptions.budget}
                                        onChange={(e) => handleDescriptionChange('budget', e.target.value)}
                                        placeholder="Describe your budget preferences..."
                                        className="mt-4 w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-colors resize-none"
                                        rows={2}
                                    />
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                                <div className="mt-8 w-full md:w-auto">
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowModal(true)}
                                        className="w-max md:w-96 py-4 border-2 border-gray-600 text-l text-white rounded-lg font-medium hover:bg-gray-900 cursor-pointer transition-colors"
                                    >
                                        Write down exactly what you want to eat
                                    </motion.button>
                                </div>

                                <div className="mt-8 w-full md:w-auto">
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleFindRestaurants}
                                        disabled={isLoading}
                                        className={`w-max md:w-72 py-4 border-2 border-gray-600 text-l text-white rounded-lg font-medium hover:bg-gray-900 cursor-pointer transition-colors ${
                                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isLoading ? 'Finding Restaurants...' : 'Find My Perfect Restaurant!'}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-4 text-red-500 text-center">
                                    {error}
                                </div>
                            )}
                        </>
                    ) : (
                        // Results Section
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">Your Perfect Matches</h2>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBackToInput}
                                    className="px-6 py-2 border-2 border-gray-600 text-white rounded-lg font-medium hover:bg-gray-900 cursor-pointer transition-colors"
                                >
                                    Modify Preferences
                                </motion.button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {restaurants.map((restaurant, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
                                    >
                                        <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                                        <p className="text-gray-400 mb-4">{restaurant.description}</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">Cuisine:</span>
                                                <span>{restaurant.cuisine}</span>
                                            </div>
                                           
                                            <div className="flex items-center gap-2">
                                                <span className="text-yellow-400">★</span>
                                                <span>{restaurant.rating}/5</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">Location:</span>
                                                <span>{restaurant.location}</span>
                                            </div>
                                            {restaurant.highlights && restaurant.highlights.length > 0 && (
                                                <div>
                                                    <span className="text-gray-400">Highlights:</span>
                                                    <ul className="list-disc list-inside mt-1">
                                                        {restaurant.highlights.map((highlight: string, i: number) => (
                                                            <li key={i} className="text-sm">{highlight}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {restaurant.dietary_options && restaurant.dietary_options.length > 0 && (
                                                <div>
                                                    <span className="text-gray-400">Dietary Options:</span>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {restaurant.dietary_options.map((option: string, i: number) => (
                                                            <span key={i} className="text-sm bg-gray-700 px-2 py-1 rounded">
                                                                {option}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.location)}`, '_blank')}
                                                className="w-full py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span>Get Directions</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                                                </svg>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Modal */}
                    <AnimatePresence>
                        {showModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                onClick={() => setShowModal(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-black focus:outline-none rounded-xl p-6 py-20 w-full max-w-2xl border border-gray-700"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold text-orange-400">Tell us exactly what you want to eat</h3>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <textarea
                                        value={foodPreference}
                                        onChange={(e) => setFoodPreference(e.target.value)}
                                        placeholder="Describe your perfect meal... with city and country name. For example: 'I'm craving something spicy with lots of cheese, maybe a fusion of Indian and Italian flavors...'"
                                        className="w-full focus:outline-none h-72 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                                    />
                                    <div className="flex justify-end gap-4 mt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowModal(false)}
                                            className="px-6 py-2 rounded-lg border border-gray-700 hover:border-orange-400 transition-colors"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleExactWriteSubmit}
                                            className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-500 transition-colors"
                                        >
                                            Submit
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}