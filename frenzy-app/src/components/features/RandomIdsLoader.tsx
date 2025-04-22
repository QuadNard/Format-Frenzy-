"use client"

import { Loader } from "@/components/ui/loader";
import { useQuery} from "@tanstack/react-query";

type QuestionSets = {
    id: number;
    answer: string; 
    question: string;
}



type Props = {initialData: QuestionSets[] };



export default function RandomIdsLoader({ initialData }: Props) {
    const {
        data: questionSets,
        isLoading,
        error,
    } = useQuery<QuestionSets[]>({
        queryKey: ["randomIds"],
        queryFn: () => initialData,
        initialData,
    })

    if (isLoading) return <Loader />;
    if (error) return <div> Oops, something went wrong </div>;

    return (
        <ul className="w-full">
            {questionSets!.map((questions, idx) => (
                    <div key={idx} className="mb-6 p-4 border rounded">
                    <h2 className="font-semibold mb-2">Set {idx + 1}</h2>
                    <pre className="text-xs font-mono">{JSON.stringify(questions, null, 2)}</pre>
                </div>
            ))}
        </ul>
    )

}