import { GoogleGenAI, Type } from "@google/genai";
import type { CardData, RawCardData } from '../types';
import { animalImageMap } from '../assets/asset-map';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const peopleAndAnimals = [
    'Kingsley: Dog',
    'Opeyemi (male): Elephant',
    'Mayowa (male): Arctic Wolf (thrives on teamwork, forms a strong collaborative pack, has incredible endurance, is confident, tackles challenges with a solution-based mindset, is intelligent, adaptable, strategic, and uses foresight to plan and execute in a fast-paced digital world)',
    'Omole (male): Dove (gentle, promotes peace and harmony, adaptable like a pigeon, thrives in diverse environments, and values teamwork)',
    'Gbemisola: Dolphin (intelligent, playful, strong communication abilities, friendly, team-oriented, engages and collaborates with users, making interactions enjoyable and productive)',
    'Deborah: Eagle (efficient, full of wisdom, courageous, and fearless in taking on new tasks)',
    'Ekundayo: Red Fox (embodies wisdom and intelligence, able to achieve even the most difficult assignments)',
    'Daniel: Octopus (intelligent, adaptable, and has strong problem-solving skills)',
    'Oyewole (male): Cat',
    'Seye (male): Sea Turtle',
    'Kelechi: Owl'
];

export const generateAnimalData = async (): Promise<Omit<CardData, 'id'>[]> => {
    try {
        const prompt = `Based on this list of people, their chosen spirit animals, and their self-described personality traits (gender is provided where known): ${peopleAndAnimals.join('; ')}. 
        Generate a JSON array. For each person, create an object with the following keys: 'animalName', 'representative', 'genericDescription', 'genericTraits', and 'personalizedDescription'.

        - 'animalName': The name of the animal (e.g., "Dog", "Red Fox").
        - 'representative': The name of the person.
        - 'genericDescription': A concise and engaging description of the animal's typical natural behaviors and key characteristics. This should be about the animal in general, not the person.
        - 'genericTraits': An array of exactly three evocative, one-or-two-word traits summarizing the animal's general nature (e.g., "Loyal", "Majestic").
        - 'personalizedDescription': A rich, personalized narrative, 2-3 sentences long, that explains why the person identifies with this animal, deeply integrating their self-described traits in a compelling and inspiring professional tone. Use gender-appropriate pronouns where gender is specified.

        The entire output must be a single, valid JSON array.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            animalName: { type: Type.STRING },
                            representative: { type: Type.STRING },
                            genericDescription: { type: Type.STRING },
                            genericTraits: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "An array of exactly three general animal traits."
                            },
                            personalizedDescription: { type: Type.STRING },
                        },
                        required: ["animalName", "representative", "genericDescription", "genericTraits", "personalizedDescription"],
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const data: RawCardData[] = JSON.parse(jsonText);

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("API did not return a valid array of animal data.");
        }
        
        // Enrich the data with local image URLs
        return data.map(item => {
            const key = Object.keys(animalImageMap).find(k => item.animalName.includes(k));
            const imageUrl = key ? animalImageMap[key] : 'assets/placeholder.jpg'; // Fallback image
            return {
                ...item,
                imageUrl
            };
        });

    } catch (error) {
        console.error("Error generating animal data with Gemini:", error);
        throw new Error("Failed to fetch data from the Gemini API. Please check your API key and network connection.");
    }
};