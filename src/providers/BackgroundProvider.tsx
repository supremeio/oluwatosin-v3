'use client';

import React, { createContext, useContext, useState } from 'react';

export type HoverState = 'default' | 'developer';

interface BackgroundContextType {
    hoverState: HoverState;
    setHoverState: (state: HoverState) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
    const [hoverState, setHoverState] = useState<HoverState>('default');

    return (
        <BackgroundContext.Provider value={{ hoverState, setHoverState }}>
            {children}
        </BackgroundContext.Provider>
    );
}

export function useBackground() {
    const context = useContext(BackgroundContext);
    if (context === undefined) {
        throw new Error('useBackground must be used within a BackgroundProvider');
    }
    return context;
}
