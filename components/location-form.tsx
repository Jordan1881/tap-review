"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions";

type LocationFormProps = {
  action: (
    prev: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
  submitLabel: string;
  defaultName?: string;
  defaultPlaceId?: string;
};

const initialState: ActionState = {};

export function LocationForm({
  action,
  submitLabel,
  defaultName = "",
  defaultPlaceId = "",
}: LocationFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
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

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
          שם העסק
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultName}
          placeholder="לדוגמה: קפה הרצל"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label htmlFor="placeId" className="mb-1.5 block text-sm font-medium text-slate-700">
          Google Place ID
        </label>
        <input
          id="placeId"
          name="placeId"
          type="text"
          required
          defaultValue={defaultPlaceId}
          placeholder="ChIJ..."
          dir="ltr"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <p className="mt-2 text-sm text-slate-500">
          מצאו את מזהה המקום בכלי של גוגל:{" "}
          <a
            href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Place ID Finder
          </a>
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-primary px-4 py-3 text-base font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "שומר..." : submitLabel}
      </button>
    </form>
  );
}
