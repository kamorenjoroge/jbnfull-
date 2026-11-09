"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2, Save, RotateCcw, Loader2, Zap, ArrowRight } from "lucide-react";
import { siteSchema, type SiteFormValues } from "@/lib/schemas";
import { saveSiteInfo } from "@/app/admin/settings/actions";

type Props = {
  site: SiteFormValues;
  categories: { slug: string; name: string }[];
};

const input =
  "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

function Card({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 className="font-heading text-lg font-bold uppercase text-ink">{title}</h2>
      <p className="mb-5 mt-0.5 text-sm text-muted">{description}</p>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-muted">{hint}</span>
      )}
    </label>
  );
}

export default function SettingsForm({ site, categories }: Props) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SiteFormValues>({ resolver: zodResolver(siteSchema), defaultValues: site });

  const { fields, append, remove } = useFieldArray({ control, name: "hours" });
  const promo = useWatch({ control, name: "promo" });

  async function onSubmit(values: SiteFormValues) {
    const res = await saveSiteInfo(values);
    if (!res.ok) return toast.error(res.error);
    toast.success("Settings saved. The shop is updated.");
    reset(values); // the saved values become the new starting point
  }

  const border = (hasError: boolean) => (hasError ? "border-red-500" : "");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Business details */}
        <Card title="Business details" description="Shown in the footer and on the About page.">
          <Field label="Business name" error={errors.name?.message}>
            <input {...register("name")} className={`${input} ${border(!!errors.name)}`} />
          </Field>
          <Field label="Tagline" error={errors.tagline?.message}>
            <input {...register("tagline")} className={`${input} ${border(!!errors.tagline)}`} />
          </Field>
          <Field label="About the shop" error={errors.about?.message}>
            <textarea rows={3} {...register("about")} className={`${input} h-auto py-2.5 ${border(!!errors.about)}`} />
          </Field>
        </Card>

        {/* Contact */}
        <Card title="Contact" description="Used by the Call and WhatsApp buttons across the shop.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" error={errors.phone?.message} hint="As customers should see it">
              <input {...register("phone")} placeholder="+254 712 345 678" className={`${input} ${border(!!errors.phone)}`} />
            </Field>
            <Field label="WhatsApp number" error={errors.whatsapp?.message} hint="Digits only, starting with 254">
              <input {...register("whatsapp")} inputMode="numeric" placeholder="254712345678" className={`${input} ${border(!!errors.whatsapp)}`} />
            </Field>
          </div>
          <Field label="Email" error={errors.email?.message}>
            <input type="email" {...register("email")} className={`${input} ${border(!!errors.email)}`} />
          </Field>
          <Field label="Address" error={errors.address?.message}>
            <input {...register("address")} className={`${input} ${border(!!errors.address)}`} />
          </Field>
          <Field label="Google Maps link" error={errors.mapsUrl?.message} hint="In Google Maps: Share → Copy link">
            <input {...register("mapsUrl")} className={`${input} ${border(!!errors.mapsUrl)}`} />
          </Field>
        </Card>

        {/* Opening hours */}
        <Card title="Opening hours" description="Shown in the footer, Contact page and Visit Us section.">
          {fields.map((field, i) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <input
                  {...register(`hours.${i}.days`)}
                  placeholder="Mon – Fri"
                  aria-label="Days"
                  className={`${input} ${border(!!errors.hours?.[i]?.days)}`}
                />
              </div>
              <div className="flex-1">
                <input
                  {...register(`hours.${i}.time`)}
                  placeholder="8:00am – 6:00pm or Closed"
                  aria-label="Time"
                  className={`${input} ${border(!!errors.hours?.[i]?.time)}`}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                disabled={fields.length === 1}
                aria-label="Remove row"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ days: "", time: "" })}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-line px-4 text-sm font-semibold text-ink hover:border-brand hover:bg-brand-light"
          >
            <Plus className="h-4 w-4" /> Add row
          </button>
          <p className="text-xs text-muted">Type &ldquo;Closed&rdquo; as the time to show it in red.</p>
        </Card>

        {/* Social media */}
        <Card title="Social media" description="Leave empty if the shop isn't on that platform.">
          <Field label="Facebook" error={errors.social?.facebook?.message}>
            <input {...register("social.facebook")} placeholder="https://facebook.com/…" className={`${input} ${border(!!errors.social?.facebook)}`} />
          </Field>
          <Field label="Instagram" error={errors.social?.instagram?.message}>
            <input {...register("social.instagram")} placeholder="https://instagram.com/…" className={`${input} ${border(!!errors.social?.instagram)}`} />
          </Field>
          <Field label="TikTok" error={errors.social?.tiktok?.message}>
            <input {...register("social.tiktok")} placeholder="https://tiktok.com/@…" className={`${input} ${border(!!errors.social?.tiktok)}`} />
          </Field>
        </Card>

        {/* Promo banner */}
        <div className="xl:col-span-2">
          <Card title="Promo banner" description="The black offer banner on the Home page.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <Field label="Title" error={errors.promo?.title?.message}>
                  <input {...register("promo.title")} className={`${input} ${border(!!errors.promo?.title)}`} />
                </Field>
                <Field label="Text" error={errors.promo?.text?.message}>
                  <textarea rows={2} {...register("promo.text")} className={`${input} h-auto py-2.5 ${border(!!errors.promo?.text)}`} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Button text" error={errors.promo?.cta?.message}>
                    <input {...register("promo.cta")} className={`${input} ${border(!!errors.promo?.cta)}`} />
                  </Field>
                  <Field label="Button opens" error={errors.promo?.categorySlug?.message}>
                    <select {...register("promo.categorySlug")} className={`${input} ${border(!!errors.promo?.categorySlug)}`}>
                      <option value="">Choose a category</option>
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Live preview */}
              <div>
                <p className="mb-1.5 text-sm font-semibold text-ink">Preview</p>
                <div className="overflow-hidden rounded-2xl bg-ink text-white">
                  <div className="hazard-stripe h-1.5" />
                  <div className="p-5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold uppercase text-ink">
                      <Zap className="h-3 w-3" /> Limited Offer
                    </span>
                    <p className="mt-2 font-heading text-2xl font-bold uppercase leading-tight text-brand">
                      {promo?.title || "Promo title"}
                    </p>
                    <p className="mt-1 text-sm text-white/80">{promo?.text || "Promo text"}</p>
                    <span className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-ink">
                      {promo?.cta || "Button"} <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="hazard-stripe h-1.5" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-between gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <p className={`text-sm ${isDirty ? "font-semibold text-amber-700" : "text-muted"}`}>
          {isDirty ? "You have unsaved changes" : "All changes saved"}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty || isSubmitting}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-ink hover:bg-surface disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" /> <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-40"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}