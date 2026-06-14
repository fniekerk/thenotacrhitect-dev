import { Fragment, jsx, jsxs } from "react/jsx-runtime";

interface Props {
  code: string;
}

// Evaluates velite's pre-compiled MDX string (runs at build time on the server,
// never in the browser — so this does not violate the Content-Security-Policy).
export function MDXContent({ code }: Props) {
  const fn = new Function(code);
  // The compiled code reads jsx/jsxs/Fragment from arguments[0]
  const { default: Component } = fn({ Fragment, jsx, jsxs }) as {
    default: (props?: Record<string, unknown>) => React.ReactNode;
  };
  return <>{Component()}</>;
}
