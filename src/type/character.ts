export interface Character {
    id: string;
    name: string;
    occupation: string;
    phone: string;
    address: string;
    bio: string;
    education: string[];
    gangAffiliations: string[];
    experience: string[];
    attributes: {
      strength: number;
      intelligence: number;
      reflexes: number;
      tech: number;
      cool: number;
      luck: number;
      movement: number;
      body: number;
      empathy: number;
    };
    skills: {
      [key: string]: number;
    };
    cybernetics: {
      name: string;
      type: string;
      version: string;
    }[];
    stats: {
      [key: string]: number;
    };
    rating: number;
    controllability: number;
    hijack_difficulty: number;
    bounty: number;
    legal_immunity: boolean;
}

export type CharacterData = {
  characters: Character[];
};