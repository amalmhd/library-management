import Link from "next/link";
import React from "react";
import BookCover from "./BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import dayjs from "dayjs";

const BookCard = ({
  title,
  id,
  genre,
  coverColor,
  coverUrl,
  isLoanedBook = false,
  dueDate,
}: Book & Partial<Omit<BorrowedBook, keyof Book>>) => {
  const getDaysLeft = () => {
    if (!dueDate) return 0;

    const today = dayjs();
    const due = dayjs(dueDate);
    const diffDays = due.diff(today, "day");

    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <li className={cn(isLoanedBook && "sm:w-52 w-full")}>
      <Link
        href={`/books/${id}`}
        className={cn(isLoanedBook && "w-full flex flex-col items-center")}
      >
        <BookCover coverColor={coverColor} coverUrl={coverUrl} />
        <div className={cn("mt-4", !isLoanedBook && "xs:max-w-40 max-w-28")}>
          <p className="book-title">{title}</p>
          <p className="book-genre">{genre}</p>
        </div>
        {isLoanedBook && (
          <div className="mt-3 w-full">
            <div className="book-loaned">
              <Image
                src="/icons/calendar.svg"
                alt="calendar-icon"
                height={18}
                width={18}
                className="object-contain"
              />
              <p className="text-light-100">{`${getDaysLeft()} days left to return`}</p>
            </div>
            <Button className="book-btn bg-dark">Download receipt</Button>
          </div>
        )}
      </Link>
    </li>
  );
};

export default BookCard;
