"use server";

import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type DbReply = {
  id: string;
  question_id: string;
  text: string;
  created_at: string;
};

export type DbQuestion = {
  id: string;
  text: string;
  upvotes: number;
  created_at: string;
  replies: DbReply[];
};

export async function getQuestions(): Promise<DbQuestion[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("questions")
    .select("id, text, upvotes, created_at, replies(id, text, created_at)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as DbQuestion[];
}

export async function createQuestion(text: string): Promise<DbQuestion> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("questions")
    .insert({ text })
    .select("id, text, upvotes, created_at")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/discussions");
  return { ...(data as unknown as DbQuestion), replies: [] };
}

export async function createReply(
  questionId: string,
  text: string,
): Promise<DbReply> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("replies")
    .insert({ question_id: questionId, text })
    .select("id, question_id, text, created_at")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/discussions");
  return data as unknown as DbReply;
}

export async function adjustUpvote(
  questionId: string,
  delta: 1 | -1,
): Promise<void> {
  const supabase = createSupabaseClient();
  const { error } = await supabase.rpc("increment_upvotes", {
    question_id: questionId,
    delta,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/discussions");
}
