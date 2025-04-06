import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Character } from '@/type/character';

export async function POST(request: Request) {
  try {
    // Read character.json file
    const filePath = path.join(process.cwd(), 'src/data/character.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const characters: Character[] = JSON.parse(fileContent);

    // Return all data
    return NextResponse.json({
      query: 'all',
      message: ['Successfully retrieved all character data'],
      results: characters
    });
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json(
      { 
        query: 'all',
        message: ['Error reading data'],
        results: [] 
      },
      { status: 500 }
    );
  }
} 