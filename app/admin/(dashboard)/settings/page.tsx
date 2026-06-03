import { getSettings } from "@/lib/admin/settings";
import { saveSettings } from "@/app/admin/_actions/settings";
import { PageHeader, Card, Field, Input, Select } from "@/components/admin/ui";
import SubmitButton from "@/components/admin/submit-button";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader title="Settings" subtitle="Store configuration" />

      <Card className="p-6 max-w-xl">
        <form action={saveSettings} className="space-y-5">
          <Field label="Store name">
            <Input name="store_name" defaultValue={settings.store_name} />
          </Field>
          <Field label="Currency" hint="display currency code">
            <Select name="currency" defaultValue={settings.currency}>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="JPY">JPY — Japanese Yen</option>
              <option value="GBP">GBP — Pound Sterling</option>
            </Select>
          </Field>
          <Field label="Support email">
            <Input name="support_email" type="email" defaultValue={settings.support_email} />
          </Field>
          <div className="pt-1">
            <SubmitButton pendingLabel="Saving…">Save settings</SubmitButton>
          </div>
        </form>
      </Card>
    </>
  );
}
