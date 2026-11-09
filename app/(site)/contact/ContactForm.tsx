"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  phone: z
    .string()
    .transform((v) => v.replace(/\s/g, ""))
    .refine((v) => /^(?:\+?254|0)[17]\d{8}$/.test(v), "Enter a valid phone, e.g. 0712 345 678"),
  email: z.union([z.literal(""), z.email("Enter a valid email")]),
  message: z.string().trim().min(10, "Tell us a bit more (at least 10 characters)"),
});

type FormInput = z.input<typeof schema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", message: "" },
  });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 800)); // pretend to send (Phase 2: save to Supabase)
    toast.success("Message sent! We'll get back to you shortly.");
    reset();
  }

  const input =
    "h-12 w-full rounded-xl border bg-white px-4 text-[15px] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";
  const border = (hasError: boolean) => (hasError ? "border-red-500" : "border-line");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink">
            Name
          </label>
          <input id="name" {...register("name")} placeholder="Your name" className={`${input} ${border(!!errors.name)}`} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-ink">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            {...register("phone")}
            placeholder="0712 345 678"
            className={`${input} ${border(!!errors.phone)}`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
          Email <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          placeholder="you@example.com"
          className={`${input} ${border(!!errors.email)}`}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-ink">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          placeholder="Which tool are you looking for?"
          className={`${input} h-auto py-3 ${border(!!errors.message)}`}
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isSubmitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}