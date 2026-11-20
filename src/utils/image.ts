/**
 * แปลง URL รูปภาพจาก Gutenberg ให้ผ่าน Cloudflare Image Proxy (wsrv.nl)
 * เพื่อแก้ปัญหาที่ ISP ในประเทศไทยบล็อกการเข้าถึง gutenberg.org
 * และหลีกเลี่ยงปัญหา Hotlink Protection / 403 Forbidden
 */
export const getCoverImageUrl = (
  coverUrl?: string,
  bookId?: number,
): string | undefined => {
  const url =
    coverUrl ||
    (bookId
      ? `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.cover.medium.jpg`
      : undefined);

  if (!url) return undefined;

  // หากเป็น URL ของ gutenberg.org ให้แปลงผ่าน proxy
  if (url.includes("gutenberg.org")) {
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}`;
  }

  return url;
};

