import React from 'react';
import type { CardData } from '../types';

interface CardProps {
  cardData: CardData;
  isFlipped: boolean;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ cardData, isFlipped, onClick }) => {
  const { animalName, genericDescription, genericTraits, representative, personalizedDescription, imageUrl } = cardData;

  return (
    <div 
      className="group w-full h-full [perspective:1200px] cursor-pointer transition-transform duration-300 ease-out hover:scale-105 focus-within:scale-105" 
      onClick={onClick} 
      role="button" 
      aria-pressed={isFlipped} 
      tabIndex={0} 
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full bg-gray-800 border-2 border-gray-700 rounded-xl p-6 flex flex-col items-center [backface-visibility:hidden] shadow-2xl shadow-black/50 transition-shadow duration-300 group-hover:shadow-yellow-400/20 group-focus-within:shadow-yellow-400/20">
            <div className="w-full h-56 md:h-64 rounded-lg overflow-hidden border-2 border-gray-600/50 shadow-inner">
                <img src={imageUrl} alt={animalName} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-yellow-400 mt-4 text-center">{animalName}</h2>
            <p className="text-gray-300 my-3 text-sm text-center flex-grow">{genericDescription}</p>
            <div className="w-full flex justify-center gap-2">
                {genericTraits.map((trait, index) => (
                    <span key={index} className="bg-gray-700 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full">
                        {trait}
                    </span>
                ))}
            </div>
            <div className="text-center text-xs text-gray-500 mt-4">Click to reveal</div>
        </div>
        
        {/* Back of the card */}
        <div className="absolute w-full h-full bg-gray-700 border-2 border-yellow-600 rounded-xl p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-2xl shadow-black/50 transition-shadow duration-300 group-hover:shadow-yellow-400/20 group-focus-within:shadow-yellow-400/20">
          <h3 className="text-xl font-semibold text-white">This persona is embodied by:</h3>
          <p className="text-4xl font-bold text-yellow-300 my-4">{representative}</p>
          <div className="w-1/2 h-px bg-yellow-400/50 my-2"></div>
          <blockquote className="text-gray-200 mt-4 italic text-base">
            "{personalizedDescription}"
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Card;