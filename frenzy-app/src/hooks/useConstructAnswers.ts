import { useQuizStore } from '@/store/test-quiz-store';
import {
  ConstructAnswerItem,
  ConstructAnswersResponse,
  QuestionSet
} from '@/types';
import { useMutation } from '@tanstack/react-query';

const BASE = process.env.NEXT_PUBLIC_MICROSERVICE_URL!;

// 1) Define a type alias for the “raw map” response
type RawMap = Record<string, string>;

// 2) Tell TS the mutation can return _either_ the wrapped shape _or_ the raw map
type MutationData = ConstructAnswersResponse | RawMap;

export function useConstructAnswers() {
  const setFetched     = useQuizStore((s) => s.setFetched);
  const setConstructed = useQuizStore((s) => s.setConstructed);
  const setAsts        = useQuizStore((s) => s.setAsts);

  return useMutation<MutationData, Error, QuestionSet[]>({
    mutationFn: async (questions) => {
      const payload: ConstructAnswerItem[] = questions.map((q) => ({
        question_id:  q.question_id,
        correct_code: q.correct_code,
      }));

      const res = await fetch(`${BASE}/construct-answers`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Construct failed: ${text || res.status}`);
      }

      return (await res.json()) as MutationData;
    },

    onMutate: () => {
      setFetched(true);
    },

    onSuccess: (data) => {
      // 3) Narrow the union:
      //    - If it has an "answers" array, use that.
      //    - Otherwise TS knows it's RawMap, so Object.entries is safe.
      let list: ConstructAnswerItem[];
      if ('answers' in data && Array.isArray(data.answers)) {
        list = data.answers;
      } else {
        list = Object.entries(data).map(
          ([question_id, correct_code]) => ({ question_id, correct_code })
        );
      }

      // 4) Build the AST map and update store
      const astMap: Record<string, string> = {};
      list.forEach(({ question_id, correct_code }) => {
        astMap[question_id] = correct_code;
      });

      setAsts(astMap);
      setConstructed(true);
    },

    onError: (err) => {
      console.error('Failed to construct answers:', err);
    },
  });
}
