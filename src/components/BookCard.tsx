import { Link } from "react-router";
import type { Book } from "../hooks/useBooks.ts";
import BookmarkButton from "./BookmarkButton.tsx";
import { BookCover } from "./BookCover.tsx";

function BookCard({ book }: { book: Book }) {
  return (
    <div className="card bg-base-100 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      {/* คลิกที่รูปหรือชื่อเรื่องเพื่อไปหน้ารายละเอียด */}
      <Link to={`/books/${book.id}`}>
        <figure className="px-4 pt-4">
          <BookCover
            coverUrl={book.formats["image/jpeg"]}
            bookId={book.id}
            title={book.title}
            heightClass="h-64"
          />
        </figure>
      </Link>

      <div className="card-body gap-1 p-4">
        <Link to={`/books/${book.id}`}>
          <h2 className="card-title line-clamp-2 text-base">{book.title}</h2>
        </Link>
        <p className="text-sm opacity-70">
          ผู้แต่ง: {book.authors[0]?.name ?? "ไม่ทราบ"}
        </p>
        <p className="text-xs opacity-50">
          ดาวน์โหลด {book.download_count.toLocaleString()} ครั้ง
        </p>

        <div className="card-actions mt-auto items-center justify-between border-t border-base-300 pt-3">
          <BookmarkButton bookId={book.id} />
          <Link to={`/books/${book.id}`} className="link link-primary text-sm">
            รายละเอียด →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
