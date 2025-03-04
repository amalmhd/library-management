"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";

const BorrowBooks = ({
  userId,
  bookId,
  borrowEligibility: { isEligible, message },
}: {
  userId: string;
  bookId: string;
  borrowEligibility: {
    isEligible: boolean;
    message: string;
  };
}) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);

  const handleBorrow = async () => {
    if (!isEligible) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
    setBorrowing(true);

    try {
      const result = await borrowBook({ userId, bookId });
      if (result.success) {
        toast({
          title: "Success",
          description: "Book borrowed successfully",
        });
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while borrowing the book",
        variant: "destructive",
      });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrow}
      disabled={borrowing}
    >
      <Image src="/icons/book.svg" alt="book-icon" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing ? "Borrowing..." : "Borrow book"}
      </p>
    </Button>
  );
};

export default BorrowBooks;
