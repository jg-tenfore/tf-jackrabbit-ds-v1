"use client";

import { useCallback, useSyncExternalStore } from "react";

const screens = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
};

/**
 * Checks whether a particular Tailwind CSS viewport size applies.
 *
 * Implemented with `useSyncExternalStore` rather than `useState` + `useEffect`.
 * A media query *is* an external store, and the effect version had to call
 * `setState` in the effect body to correct the value after mount — which is a
 * cascading render, and is what React's own lint rule flags. This subscribes to
 * the query and reads it directly, so the first render already has the right
 * answer and there is nothing to correct.
 *
 * @param size The size to check, which must either be included in Tailwind CSS's
 * list of default screen sizes, or added to the Tailwind CSS config file.
 *
 * @returns A boolean indicating whether the viewport size applies.
 */
export const useBreakpoint = (size: "sm" | "md" | "lg" | "xl" | "2xl") => {
    const query = `(min-width: ${screens[size]})`;

    const subscribe = useCallback(
        (onChange: () => void) => {
            const breakpoint = window.matchMedia(query);
            breakpoint.addEventListener("change", onChange);
            return () => breakpoint.removeEventListener("change", onChange);
        },
        [query],
    );

    const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

    // Server render has no viewport; match the previous behaviour of assuming
    // the breakpoint applies rather than flashing the narrow layout.
    const getServerSnapshot = useCallback(() => true, []);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
