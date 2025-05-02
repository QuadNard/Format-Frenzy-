
import { useMutation } from '@tanstack/react-query'
import { CheckAnswerRequest, ScoreResponse } from '@/types'

export function useCheckAnswer() {
  return useMutation<ScoreResponse, Error, CheckAnswerRequest>({
    mutationFn: async ({ question_id, user_code, correct_code }) => {
      const res = await fetch('/api/check-answer', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ question_id, user_code, correct_code }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Error ${res.status}`)
      }
      return (await res.json()) as ScoreResponse
    }    
  })
}
