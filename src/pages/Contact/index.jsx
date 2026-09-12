import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, MapPin, Phone } from "lucide-react";

import { Text } from "../../components/ui/Typography";
import PageHeader from "../../components/layout/PageHeader";
import Input from "../../components/forms/Input";
import TextArea from "../../components/forms/TextArea";
import Button from "../../components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)"),
});

const CONTACT_DETAILS = [
  { icon: Mail, label: "Email", value: "hello@cushitebeauty.com" },
  { icon: Phone, label: "Phone", value: "+44 131 000 0000" },
  { icon: MapPin, label: "Based in", value: "Edinburgh, United Kingdom" },
];

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // TODO: wire to a real email service (e.g. a Netlify Function +
      // Resend/SendGrid) once one's set up — for now this just
      // confirms receipt to the visitor.
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Message sent — we'll get back to you soon!");
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <PageHeader
        title="Get In Touch"
        subtitle="Questions about an order, a product, or anything else? We'd love to hear from you."
      />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          {/* Contact details */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {CONTACT_DETAILS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <Icon size={18} className="text-[var(--primary)]" />
                </div>
                <div>
                  <Text style={{ fontFamily: "`Bricolage Grotesque`, sans-serif" }} size="sm" tone="muted">{label}</Text>
                  <Text style={{ fontFamily: "`Bricolage Grotesque`, sans-serif" }} className="font-medium">{value}</Text>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <Input label="Your Name" placeholder="Jane Doe" error={errors.name?.message} {...register("name")} />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <TextArea
              label="Message"
              placeholder="How can we help?"
              error={errors.message?.message}
              {...register("message")}
            />
            <Button type="submit" variant="primary" size="lg" loading={submitting} className="mt-2">
              Send Message
            </Button>
          </motion.form>
        </div>
      </section>
    </main>
  );
}

export default Contact;
