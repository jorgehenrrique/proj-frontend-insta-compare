import type { HTMLAttributes, ReactNode } from 'react';

interface ScrollFadeListProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
  wrapClassName?: string;
}

export function ScrollFadeList({
  children,
  className = '',
  wrapClassName = '',
  ...props
}: ScrollFadeListProps) {
  return (
    <div className={`scroll-fade-wrap ${wrapClassName}`}>
      <ul className={`scroll-fade-edges scrollbar-list ${className}`} {...props}>
        {children}
      </ul>
    </div>
  );
}
