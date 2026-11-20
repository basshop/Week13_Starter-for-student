import { useQueryClient } from "@tanstack/react-query";
import { useBooks, type Book, type GutendexResponse } from "../hooks/useBooks.ts";
import { useBookStore } from "../stores/useBookStore.ts";
import BookCard from "../components/BookCard.tsx";

function BookBookmarkPage() {
  // Get Bookmarks and current books data
  const bookmarks = useBookStore((s) => s.bookmarks);
  const { data, isPending, isError, error, refetch, isFetching } = useBooks();
  const queryClient = useQueryClient();

  // ดึงหนังสือจากหน้าปัจจุบันและ cache หน้าอื่นๆ ที่ผู้ใช้เคยเปิดไว้
  const bookMap = new Map<number, Book>();
  const queries = queryClient.getQueriesData<GutendexResponse>({ queryKey: ["books"] });
  for (const [, pageData] of queries) {
    pageData?.results?.forEach((b) => bookMap.set(b.id, b));
  }
  data?.results?.forEach((b) => bookMap.set(b.id, b));
  const bookQueries = queryClient.getQueriesData<Book>({ queryKey: ["book"] });
  for (const [, bData] of bookQueries) {
    if (bData?.id) bookMap.set(bData.id, bData);
  }

  // ใช้ bookmarks กรองหนังสือจากข้อมูลที่ได้
  const bookmarked = bookmarks
    .map((id) => bookMap.get(id))
    .filter((book): book is Book => Boolean(book));

  // Check api is pending
  if (isPending && bookmarked.length === 0 && bookmarks.length > 0) {
    return (
      <div className="p-6">
        <div className="skeleton mx-auto mb-6 h-10 w-72"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-96 w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error from TanStack Query
  if (isError && bookmarked.length === 0 && bookmarks.length > 0) {
    return (
      <div role="alert" className="alert alert-error m-6">
        <span>{error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล"}</span>
        <button
          className="btn btn-sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching && <span className="loading loading-spinner loading-xs"></span>}
          Retry
        </button>
      </div>
    );
  }

  // Return bookmarks
  return (
    <div className="p-6">
      <h1 className="mb-6 text-center text-4xl font-bold">
        Bookmarks ({bookmarked.length})
      </h1>

      {bookmarked.length === 0 ? (
        <p className="text-center opacity-60">ยังไม่มีหนังสือที่บุ๊กมาร์กไว้</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bookmarked.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookBookmarkPage;
