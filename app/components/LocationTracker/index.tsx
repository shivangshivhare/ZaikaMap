'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Create a global store for location
let globalLocation: { lat: number; lng: number } | null = null;

export default function LocationTracker() {
    const router = useRouter();
    const [isTracking, setIsTracking] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationName, setLocationName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const getLocationName = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            if (data.display_name) {
                // Get the first part of the address (usually the street name)
                const addressParts = data.display_name.split(',');
                setLocationName(addressParts[0]);
            }
        } catch (err) {
            console.error('Error getting location name:', err);
        }
    };

    useEffect(() => {
        let watchId: number;
        let redirectTimeout: NodeJS.Timeout;

        const startTracking = async () => {
            try {
                setIsTracking(true);
                setError(null);

                // Set redirect timeout
                redirectTimeout = setTimeout(() => {
                    router.push('/pages/findrest');
                }, 10000);

                // Request location permission
                const permission = await navigator.permissions.query({ name: 'geolocation' });
                
                if (permission.state === 'denied') {
                    setError('Location access denied. Please enable location services to find restaurants near you.');
                    setIsTracking(false);
                    return;
                }

                // Get current position
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const newLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        setLocation(newLocation);
                        globalLocation = newLocation; // Store in global variable
                        getLocationName(newLocation.lat, newLocation.lng);
                    },
                    (error) => {
                        setError('Unable to get your location. Please check your location settings.');
                        setIsTracking(false);
                    },
                    { enableHighAccuracy: true }
                );

                // Start watching position
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const newLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        setLocation(newLocation);
                        globalLocation = newLocation; // Update global variable
                        getLocationName(newLocation.lat, newLocation.lng);
                    },
                    (error) => {
                        setError('Error tracking location. Please check your location settings.');
                        setIsTracking(false);
                    },
                    { enableHighAccuracy: true }
                );

                // Cleanup function
                return () => {
                    if (watchId) {
                        navigator.geolocation.clearWatch(watchId);
                    }
                    clearTimeout(redirectTimeout);
                };
            } catch (err) {
                setError('Error accessing location services.');
                setIsTracking(false);
            }
        };

        startTracking();

        // Cleanup on unmount
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
            if (redirectTimeout) {
                clearTimeout(redirectTimeout);
            }
        };
    }, [router]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence>
                {isTracking && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-700 max-w-sm"
                    >
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Finding Restaurants Near You</h3>
                                <p className="text-gray-300 text-sm">
                                    We're searching for the best restaurants in your area...
                                </p>
                                {location && (
                                    <div className="mt-2">
                                        {locationName && (
                                            <p className="text-orange-400 text-sm font-medium">
                                                {locationName}
                                            </p>
                                        )}
                                        <p className="text-gray-400 text-xs">
                                            Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                        </p>
                                    </div>
                                )}
                                <div className="mt-2 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                {error && (
                                    <p className="text-red-400 text-sm mt-2">{error}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 