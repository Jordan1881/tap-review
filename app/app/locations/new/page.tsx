import Link from "next/link";
import { createLocationAction } from "@/lib/actions";
import { LocationForm } from "@/components/location-form";

export default function NewLocationPage() {
  return (
    <div>
      <Link
        href="/app"
        className="mb-6 inline-block text-sm text-primary hover:underline"
      >
        ← חזרה למיקומים
      </Link>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">מיקום חדש</h1>
      <p className="mb-8 text-slate-600">
        הוסיפו עסק וקבלו קישור קצר וקוד QR לכרטיס NFC
      </p>
      <LocationForm action={createLocationAction} submitLabel="יצירת מיקום" />
    </div>
  );
}
