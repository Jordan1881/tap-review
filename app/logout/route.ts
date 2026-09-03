import { destroySession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function POST() {
  await destroySession();
  redirect("/");
}

export async function GET() {
  await destroySession();
  redirect("/");
}
