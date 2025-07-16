import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
        return NextResponse.json({ 
            status: 'error',
            message: 'API key not found in environment variables'
        });
    }

    // Test the API key with a simple request using the new Places API
    const testUrl = 'https://places.googleapis.com/v1/places:searchText';
    
    try {
        console.log('Testing Places API...');

        const response = await fetch(testUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.rating,places.priceLevel,places.types'
            },
            body: JSON.stringify({
                textQuery: 'restaurant in New York',
                maxResultCount: 1
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            const errorDetails = data.error || {};
            const errorMessage = errorDetails.message || 'Unknown error';
            const isServiceDisabled = errorDetails.status === 'PERMISSION_DENIED' && 
                                    errorDetails.details?.some((d: any) => d.reason === 'SERVICE_DISABLED');

            return NextResponse.json({
                status: 'error',
                message: isServiceDisabled 
                    ? 'Places API is not enabled for your project'
                    : 'API test failed',
                details: {
                    error: errorMessage,
                    responseStatus: response.status,
                    responseStatusText: response.statusText,
                    ...(isServiceDisabled && {
                        activationLink: 'https://console.developers.google.com/apis/api/places.googleapis.com/overview',
                        instructions: [
                            '1. Click the activation link above',
                            '2. Click "Enable" for the Places API (New)',
                            '3. Wait a few minutes for changes to propagate',
                            '4. Try the request again'
                        ]
                    })
                }
            });
        }
        
        return NextResponse.json({
            status: 'success',
            message: 'Places API is working correctly',
            details: {
                apiKeyPresent: true,
                apiKeyPrefix: apiKey.substring(0, 10) + '...',
                testResult: {
                    foundPlaces: data.places?.length || 0,
                    firstPlace: data.places?.[0]?.displayName?.text || 'No places found'
                }
            }
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Error testing API',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
} 