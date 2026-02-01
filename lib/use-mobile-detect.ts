/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

export function useMobileDetect() {
    const [isMobile, setIsMobile] = useState(false);
    const [isLowPerformance, setIsLowPerformance] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const mobileKeywords = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/;
            const mobile = mobileKeywords.test(userAgent);
            setIsMobile(mobile);

            const memory = (navigator as any).deviceMemory;
            const isLowMemory = memory && memory < 4;

            const cores = navigator.hardwareConcurrency;
            const isLowCores = cores && cores < 4;

            const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
            const isSlowConnection = connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g');

            setIsLowPerformance(mobile || isLowMemory || isLowCores || isSlowConnection);
        };

        checkDevice();

        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (connection) {
            connection.addEventListener('change', checkDevice);
            return () => connection.removeEventListener('change', checkDevice);
        }
    }, []);

    return { isMobile, isLowPerformance };
}
