import { useState, useEffect } from "react";

export type ViewportType = "mobile" | "tablet" | "desktop";

export function useViewport() {
    const [viewport, setViewport] = useState<ViewportType>(() => {
        if (typeof window === "undefined") return "desktop";
        const width = window.innerWidth;
        if (width < 768) return "mobile";
        if (width <= 1024) return "tablet";
        return "desktop";
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setViewport("mobile");
            } else if (width <= 1024) {
                setViewport("tablet");
            } else {
                setViewport("desktop");
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return viewport;
}
