import { NextResponse } from 'next/server'
import {
  CheckAnswerRequest,
  ScoreResponse
} from '@/types'

const BASE = process.env.NEXT_PUBLIC_MICROSERVICE_URL!

export async function POST(request: Request) {
  try {
    // 1) Parse & validate
    const payload = (await request.json()) as Partial<CheckAnswerRequest>
    if (
      typeof payload.question_id !== 'string' ||
      typeof payload.user_code   !== 'string' ||
      typeof payload.correct_code !== 'string'  // ✅ change to correct_code
    ) {
      return NextResponse.json(
        { error: 'Expected { question_id, user_code, correct_code }' },
        { status: 400 }
      )
    }

    // 2) Forward to microservice
    const msRes = await fetch(`${BASE}/check-answer`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    // 3) Proxy any errors
    if (!msRes.ok) {
      const text = await msRes.text()
      return NextResponse.json(
        { error: text || `Microservice error ${msRes.status}` },
        { status: msRes.status }
      )
    }

    // 4) Return the score response
    const data = (await msRes.json()) as ScoreResponse
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[/api/check-answer] error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
