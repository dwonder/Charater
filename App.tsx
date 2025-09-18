
import React, { useState, useEffect, useCallback } from 'react';
import { generateAnimalData } from './services/geminiService';
import type { CardData } from './types';
import { CardViewer } from './components/CardViewer';

const Header = () => (
  <header className="w-full py-4 px-8 text-center bg-gray-900/50 backdrop-blur-sm sticky top-0 z-20 border-b-4 border-yellow-400 shadow-lg">
    <h1 className="text-4xl font-bold text-red-600 tracking-wider uppercase relative inline-block italic" style={{ WebkitTextStroke: '1px #FFCC00', textShadow: '3px 3px 0 #000' }}>
      DHL IT Personas
    </h1>
    <p className="text-gray-300 mt-2">Discover the spirit animal of our IT professionals.</p>
  </header>
);

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        <svg className="animate-spin h-12 w-12 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-yellow-200 text-lg">Generating IT Personas with Gemini...</p>
    </div>
);

const App: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimalData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rawData = await generateAnimalData();
      const processedData: CardData[] = rawData.map((item, index) => ({
        ...item,
        id: `${item.animalName.replace(/\s+/g, '-')}-${index}`,
      }));
      setCards(processedData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnimalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = () => {
    setIsFlipped(prev => !prev);
  };

  const handleNext = useCallback(() => {
    if (isFlipped) {
      setIsFlipped(false);
      // Let the card flip back before changing content for a smoother animation
      setTimeout(() => {
          setCurrentIndex(prev => (prev + 1) % cards.length);
      }, 350); // Half of the flip duration
    } else {
        setCurrentIndex(prev => (prev + 1) % cards.length);
    }
  }, [isFlipped, cards.length]);

  const handlePrevious = useCallback(() => {
    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(() => {
          setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
      }, 350);
    } else {
        setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
    }
  }, [isFlipped, cards.length]);

  return (
    <main className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center selection:bg-yellow-400/30 overflow-hidden">
        <div 
            className="fixed inset-0 w-full h-full bg-cover bg-center opacity-10" 
            style={{backgroundImage: "url('assets/background-texture.png')"}}
        ></div>
        <Header />
        <div className="flex-grow w-full flex items-center justify-center p-4 md:p-8 z-10">
            {loading && <LoadingSpinner />}
            {error && (
                <div className="text-center bg-red-900/50 border border-red-700 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold text-red-300">An Error Occurred</h2>
                    <p className="text-red-400 mt-2">{error}</p>
                    <button 
                        onClick={fetchAnimalData}
                        className="mt-6 px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}
            {!loading && !error && cards.length > 0 && (
                <CardViewer
                    card={cards[currentIndex]}
                    isFlipped={isFlipped}
                    onCardClick={handleCardClick}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    currentIndex={currentIndex}
                    totalCards={cards.length}
                />
            )}
        </div>
    </main>
  );
};

export default App;