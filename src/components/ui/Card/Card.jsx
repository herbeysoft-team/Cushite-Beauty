import { cn } from "../../../lib/cn";

function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardBody({ className, children, ...props }) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("border-t border-[var(--border)] p-5", className)} {...props}>
      {children}
    </div>
  );
}

Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
export { CardBody, CardFooter };
