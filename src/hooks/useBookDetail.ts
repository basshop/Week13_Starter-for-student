import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Book, GutendexResponse } from "./useBooks.ts";

export const useBookDetail = (id: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery<Book>({
    queryKey: ["book", id], // แยก cache ตาม book id
    queryFn: async () => {
      try {
        const res = await fetch(`https://gutendex.com/books/${id}/`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("API error, reading from cache...", err);
      }

      // ถ้าดึงไม่ได้ ให้หาจาก cache ของ useBooks ด้วย id ที่ตรงกัน
      const queries = queryClient.getQueriesData<GutendexResponse>({
        queryKey: ["books"],
      });
      for (const [, pageData] of queries) {
        const cached = pageData?.results.find((b) => String(b.id) === String(id));
        if (cached) return cached;
      }

      const booksData = queryClient.getQueryData<GutendexResponse>(["books"]);
      const cached = booksData?.results.find((b) => String(b.id) === String(id));
      if (cached) return cached;

      throw new Error("ไม่สามารถดึงข้อมูลเล่มนี้ได้");
    },
    initialData: () => {
      // ดึง initialData จาก cache เพื่อ render UI ทันที
      const queries = queryClient.getQueriesData<GutendexResponse>({
        queryKey: ["books"],
      });
      for (const [, pageData] of queries) {
        const cached = pageData?.results.find((b) => String(b.id) === String(id));
        if (cached) return cached;
      }

      const booksData = queryClient.getQueryData<GutendexResponse>(["books"]);
      return booksData?.results.find((b) => String(b.id) === String(id));
    },
    enabled: !!id, // รัน queryFn เมื่อ id ไม่ใช่ null/undefined
    staleTime: 1000 * 60 * 10, // กำหนด stale time เฉพาะ query นี้ (10 นาที)
  });
};

