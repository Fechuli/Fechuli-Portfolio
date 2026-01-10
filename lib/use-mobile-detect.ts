import { useState, useEffect } from "react";

export function useMobileDetect() {
    const [isMobile, setIsMobile] = useState(false);
    const [isLowPerformance, setIsLowPerformance] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            // Check for mobile user agent
            const userAgent = navigator.userAgent.toLowerCase();
            const mobileKeywords = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/;
            const mobile = mobileKeywords.test(userAgent);
            setIsMobile(mobile);

            // Check device memory (if available)
            const memory = (navigator as any).deviceMemory;
            const isLowMemory = memory && memory < 4;

            // Check hardware concurrency (CPU cores)
            const cores = navigator.hardwareConcurrency;
            const isLowCores = cores && cores < 4;

            // Check if connection is slow
            const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
            const isSlowConnection = connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g');

            setIsLowPerformance(mobile || isLowMemory || isLowCores || isSlowConnection);
        };

        checkDevice();

        // Listen for changes
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (connection) {
            connection.addEventListener('change', checkDevice);
            return () => connection.removeEventListener('change', checkDevice);
        }
    }, []);

    return { isMobile, isLowPerformance };
}
