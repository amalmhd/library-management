import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((res) => res[0]);

  const isAdmin = user?.role === "ADMIN";

  if (!isAdmin) redirect("/");

  return (
    <main className="flex min-h-screen w-full">
      <Sidebar session={session} />
      <div className="admin-container">
        <Header session={session} />
        <div>{children}</div>
      </div>
    </main>
  );
};

export default layout;
