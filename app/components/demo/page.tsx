'use client'
import { useEffect } from 'react';

export default function Demo() {
    useEffect(() => {
        // Load Loom SDK
        const script = document.createElement('script');
        script.src = 'https://cdn.loom.com/sdk/embed.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div id='demo' className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Demo Search !</h2>
                <div className="max-w-3xl mx-auto flex justify-center items-center">
                    <div className="relative" style={{ width: '250%', height: '600px' }}>
                        <iframe
                            src="https://www.loom.com/embed/e5adfafc60cf44d0a6d2dbdfe76afd7a?sid=dbe95585-c28b-4ae8-8e00-059fd6893053"
                            frameBorder="0"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}