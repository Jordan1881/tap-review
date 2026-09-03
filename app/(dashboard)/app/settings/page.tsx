import { AuthForm, FormField } from "@/components/forms";
import { changePasswordAction } from "@/lib/actions";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">הגדרות חשבון</h1>
      <p className="mb-8 text-slate-600">עדכנו את סיסמת הכניסה ללוח הבקרה</p>
      <AuthForm action={changePasswordAction} submitLabel="עדכון סיסמה">
        <FormField
          label="סיסמה נוכחית"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
        />
        <FormField
          label="סיסמה חדשה"
          name="newPassword"
          type="password"
          helpText="לפחות 8 תווים"
          autoComplete="new-password"
        />
      </AuthForm>
    </div>
  );
}
