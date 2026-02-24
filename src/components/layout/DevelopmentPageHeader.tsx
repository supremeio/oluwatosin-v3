'use client';

import React from 'react';
import { useBackground } from '@/providers/BackgroundProvider';
import { ScrambleText } from '@/components/ui/ScrambleText';

export function DevelopmentPageHeader(): React.ReactElement {
    const { setHoverState } = useBackground();

    return (
        <header className="flex flex-col gap-[40px] items-start w-full">
            <div
                className="flex flex-col gap-[8px] items-start w-full group cursor-default"
                onMouseEnter={() => setHoverState('developer')}
                onMouseLeave={() => setHoverState('default')}
            >
                <div className="flex flex-col gap-[4px] items-start">
                    <h1 className="font-figtree font-semibold text-[20px] leading-[24px] text-text-primary">
                        <ScrambleText text="Code meets design" />
                    </h1>
                    <p className="font-geist font-normal text-[14px] leading-[20px] text-text-secondary max-w-[500px]">
                        An experimental playground where I build production-ready UI components, micro-interactions, and interface experiments. All open-source, copy-paste ready, built with modern tech.
                    </p>
                </div>
            </div>
        </header>
    );
}
