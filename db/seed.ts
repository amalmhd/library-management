import ImageKit from "imagekit";
import dummyBooks from "../dummyBooks.json";
import { books } from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});
const uploadtoimagekit = async (
  imageUrl: string,
  fileName: string,
  folder: string
) => {
  try {
    const response = await imagekit.upload({
      file: imageUrl,
      fileName,
      folder,
    });
    return response.filePath;
  } catch (error) {
    console.error("error uploading image to imageKit", error);
  }
};

const seed = async () => {
  console.log("seeding data...");
  try {
    for (const book of dummyBooks) {
      const coverUrl = (await uploadtoimagekit(
        book.coverUrl,
        `${book.title}.jpg`,
        "/books/covers"
      )) as string;

      const videoUrl = (await uploadtoimagekit(
        book.videoUrl,
        `${book.title}.mp4`,
        "/books/videos"
      )) as string;

      await db.insert(books).values({ ...book, coverUrl, videoUrl });
    }
    console.log("data seeded successfully");
  } catch (error) {
    console.error("error seeding data", error);
  }
};

seed();
