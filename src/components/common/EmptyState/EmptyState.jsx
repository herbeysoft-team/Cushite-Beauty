import { PackageOpen } from "lucide-react";
import { Heading, Text } from "../../ui/Typography";
import Button from "../../ui/Button";

function EmptyState({
  icon: Icon = PackageOpen,
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)]/10">
        <Icon size={32} className="text-[var(--primary)]" />
      </div>
      <Heading level="h4">{title}</Heading>
      {description && (
        <Text tone="muted" className="max-w-sm">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
