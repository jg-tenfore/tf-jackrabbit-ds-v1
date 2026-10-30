"use client";

import { type ReactNode, createContext, useContext } from "react";
import type { CourseBrand } from "@/data/courses";

/**
 * The course the kiosk is installed at.
 *
 * `null` is the unbranded kiosk — TenFore's own marks and stock photography —
 * and is what every screen renders with no provider above it. That keeps the
 * whole existing library unchanged: branding is something a screen *accepts*,
 * not something it requires.
 */
const CourseBrandContext = createContext<CourseBrand | null>(null);

export const CourseBrandProvider = ({ brand, children }: { brand: CourseBrand | null; children: ReactNode }) => (
    <CourseBrandContext.Provider value={brand}>{children}</CourseBrandContext.Provider>
);

export const useCourseBrand = () => useContext(CourseBrandContext);
