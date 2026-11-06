"use client";

import { useState } from "react";
import posthog from "posthog-js";

import { crownforgeConfig } from "@/config/crownforge.config";
import Button from "../../ui/Button.jsx";
import StateCard from "../../ui/StateCard.jsx";

const fieldClass =
  "w-full appearance-none border-0 border-b border-ggg-border bg-transparent px-0 pb-3 pt-2 font-inter text-[15px] font-normal tracking-[0.005em] text-ggg-text outline-none transition-colors duration-200 placeholder:font-inter placeholder:font-normal placeholder:tracking-[0.005em] placeholder:text-ggg-muted focus:border-ggg-accent";

const labelClass = "mb-2 block font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-ggg-muted";

const NumberedField = ({ number, label, children }) => (
  <label className="flex flex-col">
    <span className={labelClass}>
      <span className="mr-2 text-ggg-accent">{number}</span>
      {label}
    </span>
    {children}
  </label>
);

export default function ContactForm({ email: emailProp, categories }) {
  const { contactPage, contactEmail } = crownforgeConfig;
  const email = (emailProp ?? contactEmail)?.trim();
  const categoryOptions = categories?.length ? categories : contactPage.categories;
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: categoryOptions[0] || "General",
    message: "",
  });

  if (!email) {
    return <StateCard>A public contact email has not been configured yet.</StateCard>;
  }

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`${contactPage.subjectPrefix}${form.name}`);
    const body = encodeURIComponent(
      `${contactPage.categoryPrefix} ${form.category}\n\n${form.message}\n\n${contactPage.replyPrefix} ${form.email}`,
    );
    posthog.capture("contact_form_submitted", {
      has_name: Boolean(form.name),
      has_message: Boolean(form.message),
      category: form.category,
    });
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <form className="flex max-w-[560px] flex-col gap-7 text-left" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-7 max-[520px]:grid-cols-1">
        <NumberedField number="01" label="Your name">
          <input
            className={fieldClass}
            placeholder={contactPage.namePlaceholder}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </NumberedField>
        <NumberedField number="02" label="Email address">
          <input
            className={fieldClass}
            type="email"
            placeholder={contactPage.emailPlaceholder}
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </NumberedField>
      </div>

      <NumberedField number="03" label="Category">
        <select
          className={fieldClass}
          value={form.category}
          onChange={(event) => updateField("category", event.target.value)}
        >
          {categoryOptions.map((category) => (
            <option key={category} value={category} className="bg-ggg-bg text-ggg-text">
              {category}
            </option>
          ))}
        </select>
      </NumberedField>

      <NumberedField number="04" label="Message">
        <textarea
          className={`${fieldClass} min-h-[88px] resize-none`}
          placeholder={contactPage.messagePlaceholder}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          required
        />
      </NumberedField>

      <div className="mt-2 flex flex-col-reverse items-stretch gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="font-mono text-[11px] leading-[1.65] tracking-[0.06em] text-ggg-muted">
          Prefer email?
          <br />
          <a
            href={`mailto:${email}`}
            className="border-b border-ggg-accent pb-px text-ggg-text transition-colors hover:text-ggg-accent"
            onClick={() => posthog.capture("contact_email_direct_clicked")}
          >
            {email}
          </a>
        </div>
        <Button type="submit" variant="pill" className="max-sm:w-full">
          {contactPage.submitLabel} <span aria-hidden>→</span>
        </Button>
      </div>
    </form>
  );
}
