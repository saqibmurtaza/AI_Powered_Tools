// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'Context Cards'
    },
    { status: 200 }
  );
}