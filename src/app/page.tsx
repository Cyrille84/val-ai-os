import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("val-token")?.value;
  if (token && (await verifyToken(token))) {
    redirect("/dashboard");
  }
  redirect("/login");
}
