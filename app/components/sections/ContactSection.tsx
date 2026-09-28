"use client";

import React, { useState, FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, ChevronDown, Loader2, Send } from "lucide-react";
import { PROFILE_DATA } from "@/app/data/profile";
import { ContactFormData } from "@/app/types";
import { useReveal } from "@/app/lib/motion";
import SectionHeading from "@/app/components/ui/SectionHeading";
import GlassCard from "@/app/components/ui/GlassCard";

interface ContactSectionProps {
  githubUrl?: string;
}

type FormStatus = "IDLE" | "SEALING" | "CONFIRMED";

const SUBJECT_OPTIONS = [
  "Project proposal & collaboration",
  "Freelance development contract",
  "Full-stack engineering role",
  "Open-source contribution",
  "General inquiry",
];

export default function ContactSection({
  githubUrl = PROFILE_DATA.githubUrl,
}: ContactSectionProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: SUBJECT_OPTIONS[0],
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = useState<FormStatus>("IDLE");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const sanitizeInput = (text: string): string => {
    return text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) errors.name = "Your name is required.";
    if (!trimmedEmail) {
      errors.email = "An email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please provide a valid email address.";
    }
    if (!trimmedMessage) {
      errors.message = "A message cannot be empty.";
    } else if (trimmedMessage.length > 10000) {
      errors.message = "Message exceeds the 10,000 character limit.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || formStatus === "SEALING") return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormStatus("SEALING");

    sanitizeInput(formData.name);
    sanitizeInput(formData.email);
    sanitizeInput(formData.subject);
    sanitizeInput(formData.message);

    setTimeout(() => {
      setFormStatus("CONFIRMED");
      setIsSubmitting(false);
    }, 1200);
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: SUBJECT_OPTIONS[0],
      message: "",
    });
    setFormErrors({});
    setFormStatus("IDLE");
    setIsSubmitting(false);
  };

  const inputClass =
    "w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-ink-faint/60 outline-none transition-all duration-300 focus:border-accent/50 focus:bg-white/[0.05]";

  const labelClass =
    "mb-2 block font-mono text-[10px] tracking-caption text-ink-faint uppercase";

  return (
    <>
      {/* Identity / links column */}
      <section
        id="contact"
        aria-label="Contact"
        className="relative w-full px-6 py-28 sm:px-10 sm:py-36"
      >
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading
            index="05"
            kicker="CONTACT"
            title="Let's build something."
            description="Currently open for freelance contracts and collaborations — reach out for projects, roles, or just to say hello."
          />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Left: direct channels */}
            <div className="flex flex-col gap-5 lg:col-span-5">
              <a
                data-reveal
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass group relative overflow-hidden rounded-2xl p-7 transition-colors duration-300 hover:border-accent/40"
              >
                <div className="mb-14 flex items-center justify-between">
                  <span className="glass-chip rounded-full px-3 py-1 font-mono text-[9px] tracking-widest text-success">
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success align-middle" />
                    OPEN FOR CONTRACTS
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-white/[0.07] pt-5">
                  <span className="font-display text-2xl font-semibold tracking-tight text-white transition-colors group-hover:text-accent">
                    @ArloDel
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-ink-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" strokeWidth={1.5} />
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  Repositories & open-source work
                </p>
              </a>

              <GlassCard data-reveal data-reveal-delay="100" className="p-7">
                <div className="flex flex-col gap-5 text-sm">
                  {[
                    ["ACADEMIC", "Information Systems, UPN “Veteran” Jawa Timur"],
                    ["BASED IN", "Surabaya, East Java, Indonesia — UTC+7"],
                    ["REPLIES", "Within 24 hours"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-1 font-mono text-[9px] tracking-caption text-ink-faint">
                        {label}
                      </div>
                      <div className="text-ink-muted">{value}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right: form */}
            <GlassCard className="p-7 sm:p-8 lg:col-span-7" data-reveal data-reveal-delay="140">
              {formStatus === "CONFIRMED" ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                    <CheckCircle2 className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                    Message sent.
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
                    {`Thanks ${formData.name} — your message has been received. A reply will be sent to ${formData.email} shortly.`}
                  </p>
                  <div className="glass-soft mt-6 w-full max-w-md rounded-xl p-4 text-left">
                    <div className="mb-1 font-mono text-[9px] tracking-caption text-ink-faint">
                      YOUR MESSAGE
                    </div>
                    <p className="text-xs leading-relaxed text-ink-muted line-clamp-3">
                      &ldquo;{formData.message}&rdquo;
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="glass-chip mt-8 rounded-full px-6 py-2.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink hover:border-accent/40"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="relative">
                  <div className="mb-7">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-white">
                      Send a message
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">
                      Fill in the fields below — every message is answered personally.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label htmlFor="input-name" className={labelClass}>
                        Name
                      </label>
                      <input
                        id="input-name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className={inputClass}
                      />
                      {formErrors.name && (
                        <p className="mt-1.5 font-mono text-[10px] text-red-400">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="input-email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="input-email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className={inputClass}
                      />
                      {formErrors.email && (
                        <p className="mt-1.5 font-mono text-[10px] text-red-400">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mt-5">
                    <label htmlFor="input-subject" className={labelClass}>
                      Objective
                    </label>
                    <div className="relative">
                      <select
                        id="input-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={`${inputClass} appearance-none pr-10`}
                      >
                        {SUBJECT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="input-message" className={labelClass}>
                        Message
                      </label>
                      <span className="mb-2 font-mono text-[10px] text-ink-faint tabular-nums">
                        {formData.message.length} / 10,000
                      </span>
                    </div>
                    <textarea
                      id="input-message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write about your project, timeline or inquiry…"
                      className={`${inputClass} resize-none`}
                    />
                    {formErrors.message && (
                      <p className="mt-1.5 font-mono text-[10px] text-red-400">
                        {formErrors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      id="button-submit"
                      type="submit"
                      disabled={isSubmitting}
                      className="group flex items-center justify-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-canvas transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {formStatus === "SEALING" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                          Dispatching…
                        </>
                      ) : (
                        <>
                          Dispatch
                          <Send
                            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                            strokeWidth={1.75}
                          />
                        </>
                      )}
                    </button>

                    <p className="text-center font-mono text-[10px] tracking-caption text-ink-faint sm:text-right">
                      PERSONAL REPLY — WITHIN 24H
                    </p>
                  </div>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </section>
    </>
  );
}
