interface TocItem {
  title: string;
  url: string;
  items?: TocItem[];
}

interface TOCProps {
  items: TocItem[];
}

function TocEntry({ item }: { item: TocItem }) {
  return (
    <li>
      <a
        href={item.url}
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 text-sm transition-colors"
      >
        {item.title}
      </a>
      {item.items && item.items.length > 0 && (
        <ul className="ml-4 mt-1 space-y-1">
          {item.items.map((child) => (
            <TocEntry key={child.url} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TOC({ items }: TOCProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mb-8 p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900"
    >
      <p className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Table of Contents
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <TocEntry key={item.url} item={item} />
        ))}
      </ul>
    </nav>
  );
}
