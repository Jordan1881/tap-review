"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions";

type AuthFormProps = {
  action: (
    prev: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
  submitLabel: string;
  children: React.ReactNode;
};

const initialState: ActionState = {};

export function AuthForm({ action, submitLabel, children }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}
      {state.success && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {state.success}
        </div>
      )}
      {children}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-primary px-4 py-3 text-base font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "רגע..." : submitLabel}
      </button>
    </form>
  );
}

export function FormField({
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  helpText,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        dir={type === "email" || type === "password" ? "ltr" : undefined}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      {helpText && (
        <p className="mt-1.5 text-sm text-slate-500">{helpText}</p>
      )}
    </div>
  );
}
