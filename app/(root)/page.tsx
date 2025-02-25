import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { sampleBooks } from "@/constants";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

const Home = async () => {
  const user = await db.select().from(users);

  console.log(JSON.stringify(user, null, 2));

  return (
    <>
      <BookOverview {...sampleBooks[0]} />
      <BookList
        title="Latest books"
        books={sampleBooks}
        containerClassName="mt-20"
      />
    </>
  );
};

export default Home;
