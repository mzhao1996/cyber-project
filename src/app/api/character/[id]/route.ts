import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Character {
  id: number;
  name: string;
  occupation: string;
  attributes: {
    intelligence: number;
    reaction: number;
    technology: number;
    physical: number;
  };
  skills: {
    [key: string]: number;
  };
  cybernetics: {
    name: string;
    type: string;
    version: string;
  }[];
  controllability: number;
  hijack_difficulty: number;
  bounty: number;
  legal_immunity: boolean;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), 'src/data/Character.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const characterData: Character[] = JSON.parse(fileContent);
    
    const character = characterData.find((char: Character) => char.id === parseInt(params.id));
    
    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error('Error fetching character:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 