import { useEffect, useState } from "react";

type PageTransitionProps = {
  children: React.ReactNode;
  className?: string;
  /** milliseconds */
  duration?: number;
  /** px, positive moves up */
  offsetY?: number;
};

export function PageTransition({
  children,
  className,
  duration = 200,
  offsetY = 8,
}: PageTransitionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      style={{
        transitionDuration: `${duration}ms`,
      }}
      className={[
        "transition-all ease-out",
        visible ? "opacity-100 translate-y-0" : `opacity-0 translate-y-[${offsetY}px]`,
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}