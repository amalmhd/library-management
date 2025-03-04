import { auth, signOut } from "@/auth";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { db } from "@/db/drizzle";
import { books, borrowRecords } from "@/db/schema";
import { eq } from "drizzle-orm";
import React from "react";

const page = async () => {
  const session = await auth();

  const borrowedBooksData = await db
    .select()
    .from(borrowRecords)
    .orderBy(borrowRecords.borrowDate)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, session?.user?.id as string));

  const borrowedBooks: Book[] = borrowedBooksData.map((item) => ({
    id: item.books.id,
    title: item.books.title,
    author: item.books.author,
    genre: item.books.genre,
    rating: item.books.rating,
    totalCopies: item.books.totalCopies,
    availableCopies: item.books.availableCopies,
    description: item.books.description,
    coverColor: item.books.coverColor,
    coverUrl: item.books.coverUrl,
    videoUrl: item.books.videoUrl,
    summary: item.books.summary,
    isLoanedBook: true,
    borrowDate: item.borrow_records.borrowDate,
    dueDate: item.borrow_records.dueDate,
    returnDate: item.borrow_records.returnDate,
    status: item.borrow_records.status,
  }));

  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
      >
        <Button className="mb-10">Sign out</Button>
      </form>
      <BookList
        title="Borrowed books"
        books={borrowedBooks}
        containerClassName="w-[80vw]"
      />
    </>
  );
};

export default page;
