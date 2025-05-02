import { db } from "@/db";
import { sql } from "drizzle-orm";


export interface DBQuestionSet {
  id: number;
  question: string;
  answer: string;
}

export async function getRandomIds(): Promise<DBQuestionSet[]> {
const raw = await db.execute(
    sql`
        WITH random_set_id AS (
        SELECT floor(random() * 3 + 1)::int AS id
        )
        SELECT set_item->'questions' AS questions
        FROM snippets,
            random_set_id,
            LATERAL jsonb_array_elements(metadata) AS set_item
        WHERE (set_item->>'id')::int = random_set_id.id;
    `
    );
  // Assert the shape so TypeScript knows about `questions`
  type RawRow = { questions: DBQuestionSet[] };
  const rows = raw.rows as RawRow[];

  // Flatten and return
  return rows.flatMap(r => r.questions);
}



