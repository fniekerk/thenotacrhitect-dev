import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {currentYear} The Not Architect. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/feed.xml" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            RSS Feed
          </Link>
          <Link href="/sitemap.xml" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
}
