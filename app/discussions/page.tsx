import { getQuestions, type DbQuestion } from "./actions";
import DiscussionsClient from "./discussions-client";

export default async function DiscussionsPage() {
  let questions: DbQuestion[] = [];
  try {
    questions = await getQuestions();
  } catch {
    // Supabase not yet configured — page still renders with empty state
  }
  return <DiscussionsClient initialQuestions={questions} />;
}
