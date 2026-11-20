import { keepPreviousData, useQuery } from "@tanstack/react-query";

export interface Author {
  name: string;
  birth_year?: number;
  death_year?: number;
}

export interface Book {
  id: number;
  title: string;
  authors: Author[];
  translators?: Author[];
  subjects?: string[];
  bookshelves?: string[];
  languages?: string[];
  copyright?: boolean;
  media_type?: string;
  formats: Record<string, string>;
  download_count: number;
}

export interface GutendexResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

export const useBooks = (page: number = 1) => {
  return useQuery<GutendexResponse>({
    queryKey: ["books", page], // ใส่ page ใน key เพื่อ cache แยกต่อหน้า
    queryFn: async () => {
      const res = await fetch(`https://gutendex.com/books/?page=${page}`);
      if (!res.ok) throw new Error("Cannot get books data");
      return res.json();
    },
    placeholderData: keepPreviousData, // ค้างข้อมูลเดิมไว้ขณะโหลดหน้าใหม่
  });
};

export { useBookDetail } from "./useBookDetail.ts";

