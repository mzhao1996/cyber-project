import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Character } from '@/type/character';

type Props = {
  params: {
    id: string;
  };
};

export async function GET(
  request: Request,
  { params }: Props
) {
  try {
    const filePath = path.join(process.cwd(), 'src/data/Character.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const characterData: Character[] = JSON.parse(fileContent);
    
    const character = characterData.find((char: Character) => char.id === params.id);
    
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