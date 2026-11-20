import { useState } from "react";
import { useBooks } from "../hooks/useBooks.ts";
import BookCard from "../components/BookCard.tsx";

function BookListPage() {
  const [page, setPage] = useState<number>(1);
  const { data, isPending, isError, error, refetch, isFetching } = useBooks(page);

  // Loading UI
  if (isPending) {
    return (
      <div className="p-6">
        <div className="skeleton h-10 w-72 mx-auto mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-md">
              <div className="skeleton h-72 w-full rounded-b-none"></div>
              <div className="card-body">
                <div className="skeleton h-5 w-full"></div>
                <div className="skeleton h-4 w-2/3"></div>
                <div className="skeleton h-6 w-24 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error UI
  if (isError || !data) {
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

  // Show book list result
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-between gap-4 mb-6 sm:flex-row">
        <h1 className="text-center sm:text-left text-4xl font-bold">
          Gutendex Books ({data.count.toLocaleString()})
        </h1>
        {isFetching && (
          <span className="flex items-center gap-2 text-sm text-base-content/70">
            <span className="loading loading-spinner loading-sm"></span> กำลังอัปเดตข้อมูล...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.results.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Pagination: สลับหน้าได้อย่างน้อย 10 หน้า พร้อมปุ่ม « และ » */}
      <div className="flex justify-center items-center my-8">
        <div className="join">
          <button
            className="join-item btn"
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            «
          </button>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`join-item btn ${page === p ? "btn-active btn-primary" : ""}`}
              onClick={() => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {p}
            </button>
          ))}
          <button
            className="join-item btn"
            onClick={() => {
              setPage((p) => Math.min(10, p + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={page >= 10 || !data.next}
            aria-label="Next page"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookListPage;
