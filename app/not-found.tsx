import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-500 mb-8">Page not found.</p>
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
      >
        Back to home
      </Link>
    </div>
  );
}
