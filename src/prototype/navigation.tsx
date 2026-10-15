"use client";

import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";
import { type ScreenId, screenStack } from "./screen-links";

export type { ScreenId } from "./screen-links";

/** The kiosk screen stack, mirrored to a shareable URL by PrototypeUrlSync. */
interface NavigationValue {
    screen: ScreenId;
    /** Hold transient screens open when someone follows a feedback link. */
    isDirectEntry: boolean;
    historyMode: "pushState" | "replaceState";
    restore: (screen: ScreenId) => void;
    /** True when there is somewhere to go back to. */
    canGoBack: boolean;
    go: (screen: ScreenId) => void;
    /** Replaces rather than pushes — for steps that should not be returned to. */
    replace: (screen: ScreenId) => void;
    goBack: () => void;
    reset: () => void;
}

const NavigationContext = createContext<NavigationValue | null>(null);

export const NavigationProvider = ({
    children,
    initial = "attract",
    directEntry = false,
}: {
    children: ReactNode;
    initial?: ScreenId;
    directEntry?: boolean;
}) => {
    const [{ stack, isDirectEntry, historyMode }, setNavigation] = useState<{
        stack: ScreenId[];
        isDirectEntry: boolean;
        historyMode: "pushState" | "replaceState";
    }>(() => ({ stack: screenStack(initial), isDirectEntry: directEntry, historyMode: "replaceState" }));

    const go = useCallback(
        (screen: ScreenId) => setNavigation((prev) => ({ stack: [...prev.stack, screen], isDirectEntry: false, historyMode: "pushState" })),
        [],
    );
    const replace = useCallback(
        (screen: ScreenId) => setNavigation((prev) => ({ stack: [...prev.stack.slice(0, -1), screen], isDirectEntry: false, historyMode: "replaceState" })),
        [],
    );
    const goBack = useCallback(
        () =>
            setNavigation((prev) => ({ stack: prev.stack.length > 1 ? prev.stack.slice(0, -1) : prev.stack, isDirectEntry: false, historyMode: "pushState" })),
        [],
    );
    const reset = useCallback(() => setNavigation({ stack: ["attract"], isDirectEntry: false, historyMode: "replaceState" }), []);
    const restore = useCallback((screen: ScreenId) => setNavigation({ stack: screenStack(screen), isDirectEntry: true, historyMode: "replaceState" }), []);

    const value = useMemo<NavigationValue>(
        () => ({ screen: stack[stack.length - 1], canGoBack: stack.length > 1, isDirectEntry, historyMode, restore, go, replace, goBack, reset }),
        [stack, isDirectEntry, historyMode, restore, go, replace, goBack, reset],
    );

    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = () => {
    const value = useContext(NavigationContext);
    if (!value) throw new Error("useNavigation must be used inside a NavigationProvider");
    return value;
};
