import { getRandomIds } from "@/lib/queries/getRandomIds";
import { Toaster } from "sonner"
import QuizWizard from "@/components/layout/quiz-wizard";





export default async function Home() {

  // Fetch all 10 question sets on the server
const initialData = await getRandomIds();                     

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Toaster />
      <QuizWizard />
    </div>
  );
}

