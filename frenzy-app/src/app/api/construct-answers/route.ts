import { NextResponse } from 'next/server'
import {
  ConstructAnswerItem,
  ConstructAnswersResponse
} from '@/types'

const BASE = process.env.NEXT_PUBLIC_MICROSERVICE_URL!

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ConstructAnswerItem[]
    if (!Array.isArray(payload)) {
      return NextResponse.json(
        { error: 'Expected ConstructAnswerItem[]' },
        { status: 400 }
      )
    }

    const msRes = await fetch(`${BASE}/construct-answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!msRes.ok) {
      const text = await msRes.text()
      return NextResponse.json(
        { error: text || `Microservice error ${msRes.status}` },
        { status: msRes.status }
      )
    }

    const data = (await msRes.json()) as ConstructAnswersResponse
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[/api/construct-answers] error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
