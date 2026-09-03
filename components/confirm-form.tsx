"use client";

type ConfirmFormProps = {
  action: () => Promise<void>;
  label: string;
  confirmMessage: string;
  className?: string;
};

export function ConfirmForm({
  action,
  label,
  confirmMessage,
  className,
}: ConfirmFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
