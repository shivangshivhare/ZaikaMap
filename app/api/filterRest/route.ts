import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Types for our request and response
interface UserPreferences {
    mood: string;
    tastes: string[];
    cuisines: string[];
    dietary: string[];
    mealType: string;
    budget: string;
    location: {
        lat: number;
        lng: number;
    };
    foodPreference?: string;
}

interface Restaurant {
    name: string;
    description: string;
    cuisine: string;
    price_range: string;
    rating: number;
    location: string;
    highlights: string[];
    dietary_options: string[];
    coordinates?: {
        lat: number;
        lng: number;
    };
}

// Helper function to geocode location
async function getCoordinates(location: string, apiKey: string) {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
        );
        const data = await response.json();
        
        if (data.status === 'OK' && data.results[0]) {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

// Helper function to reverse geocode coordinates to address
async function getAddressFromCoordinates(lat: number, lng: number, apiKey: string) {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );
        const data = await response.json();
        if (data.status === 'OK' && data.results[0]) {
            return data.results[0].formatted_address;
        }
        return null;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
    }
}

// POST endpoint
export async function POST(request: Request) {
    console.log('API: Received request');
    
    try {
        const body = await request.json();
        const preferences: UserPreferences = body;
        const customPrompt: string | undefined = body.customPrompt;
        console.log('API: Received preferences:', preferences);
        if (!customPrompt && (!preferences.location || !preferences.cuisines)) {
            console.error('API: Missing required fields');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            console.error('API: Google AI API key not configured');
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Use custom prompt if provided, else use structured prompt
        let prompt: string;
        if (customPrompt && customPrompt.trim().length > 0) {
            prompt = `${customPrompt}\n\nFormat the response as a JSON array of restaurant objects with these exact fields:\n{\n  \"name\": string,\n  \"description\": string,\n  \"cuisine\": string,\n  \"price_range\": string,\n  \"rating\": number,\n  \"location\": string,\n  \"highlights\": string[],\n  \"dietary_options\": string[]\n}\n\nMake sure the response is valid JSON without any additional text or markdown formatting.`;
        } else {
            prompt = `Given the following preferences, suggest 5 restaurants that would be a good match:
        - Mood: ${preferences.mood}
        - Cuisines: ${preferences.cuisines.join(', ')}
        - Tastes: ${preferences.tastes.join(', ')}
        - Dietary Restrictions: ${preferences.dietary.join(', ')}
        - Meal Type: ${preferences.mealType}
        - Budget: ${preferences.budget}
        - Location: ${preferences.location.lat}, ${preferences.location.lng}

        For each restaurant, provide:
        1. Name
        2. Brief description
        3. Cuisine type
        4. Price range (use $ for inexpensive, $$ for medium, $$$ for expensive)
        5. Rating (out of 5)
        6. Location (use the provided coordinates as a reference point)
        7. Key highlights (array of 3-4 features)
        8. Available dietary options (array)

        Format the response as a JSON array of restaurant objects with these exact fields:
        {
            "name": string,
            "description": string,
            "cuisine": string,
            "price_range": string,
            "rating": number,
            "location": string,
            "highlights": string[],
            "dietary_options": string[]
        }

        Make sure the response is valid JSON without any additional text or markdown formatting.`;
        }

        console.log('API: Generating restaurant recommendations...');
        const result = await model.generateContent(prompt);
        const geminiResponse = await result.response;
        const text = geminiResponse.text();
        
        console.log('Raw Gemini response:', text);
        
        // Clean up the response text by removing markdown code block formatting and any additional text
        const cleanedText = text.replace(/```json\n?|\n?```/g, '')
            .replace(/\*\*Note:[\s\S]*$/, '') // Remove any notes at the end
            .trim();
        
        console.log('Cleaned response:', cleanedText);
        
        try {
            // Parse the JSON response
            const restaurants = JSON.parse(cleanedText);

            // Get coordinates for each restaurant's location
            const restaurantsWithLocation = await Promise.all(
                restaurants.map(async (restaurant: Restaurant) => {
                    const coordinates = await getCoordinates(restaurant.location, apiKey);
                    let address = null;
                    if (coordinates) {
                        address = await getAddressFromCoordinates(coordinates.lat, coordinates.lng, apiKey);
                    }
                    return {
                        ...restaurant,
                        coordinates: coordinates || (preferences.location ? {
                            lat: preferences.location.lat + (Math.random() - 0.5) * 0.01,
                            lng: preferences.location.lng + (Math.random() - 0.5) * 0.01
                        } : undefined),
                        address: address || restaurant.location // fallback to original location string
                    };
                })
            );

            console.log('API: Successfully generated', restaurantsWithLocation.length, 'recommendations');
            return NextResponse.json({
                restaurants: restaurantsWithLocation,
                preferences: preferences
            });
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Failed to parse text:', cleanedText);
            return NextResponse.json({ 
                error: 'Failed to parse restaurant recommendations',
                details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
            }, { status: 500 });
        }

    } catch (error) {
        console.error('API: Error processing request:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
