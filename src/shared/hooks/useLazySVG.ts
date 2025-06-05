import { useState, useEffect } from "react";

export type SVGComponent = React.FC<React.SVGProps<SVGSVGElement>>;

export function useLazySVG(relativePath: string): SVGComponent | null {
  const [Icon, setIcon] = useState<SVGComponent | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fullPath = `/src/${relativePath}`;
    import(/* @vite-ignore */ `${fullPath}`)
      .then((module) => {
        const Component =
          module.default?.default ||
          module.default?.ReactComponent ||
          module.default;

        if (isMounted) {
          setIcon(() => Component);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIcon(() => () => null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [relativePath]);

  return Icon;
}
