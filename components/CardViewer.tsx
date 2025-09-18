
import React from 'react';
import type { CardData } from '../types';
import Card from './Card';

interface CardViewerProps {
    card: CardData;
    isFlipped: boolean;
    onCardClick: () => void;
    onNext: () => void;
    onPrevious: () => void;
    currentIndex: number;
    totalCards: number;
}

const NavButton: React.FC<{onClick: () => void; children: React.ReactNode; ariaLabel: string; className?: string}> = ({ onClick, children, ariaLabel, className = '' }) => (
    <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`absolute top-1/2 -translate-y-1/2 p-3 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700/80 rounded-full text-yellow-400 hover:bg-gray-700/70 hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 z-30 ${className}`}
    >
        {children}
    </button>
);

export const CardViewer: React.FC<CardViewerProps> = ({ card, isFlipped, onCardClick, onNext, onPrevious, currentIndex, totalCards }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
            <div className="w-full max-w-2xl aspect-[5/6] relative flex items-center justify-center">
                <NavButton onClick={onPrevious} ariaLabel="Previous card" className="left-0">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </NavButton>

                <div className="w-full max-w-md h-full">
                    <Card cardData={card} isFlipped={isFlipped} onClick={onCardClick} />
                </div>
                
                <NavButton onClick={onNext} ariaLabel="Next card" className="right-0">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </NavButton>
            </div>
            <div className="text-center text-gray-400 text-lg font-semibold tracking-wider p-2 bg-gray-900/40 rounded-lg">
                Card {currentIndex + 1} of {totalCards}
            </div>
        </div>
    );
};
