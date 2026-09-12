import { Heading, Text } from "../../components/ui/Typography";
import PageHeader from "../../components/layout/PageHeader";

const SECTIONS = [
  {
    title: "Information We Collect",
    body: `When you create an account, place an order, or contact us, we collect information such as your name, email address, phone number, delivery address, and payment method (we never store full card details — those are handled directly by Stripe, our payment processor). We also automatically collect basic usage data like pages visited and items viewed, to help us improve the shopping experience.`,
  },
  {
    title: "How We Use Your Information",
    body: `We use your information to process and deliver orders, communicate with you about your account or purchases, respond to support requests, and improve our products and services. We do not sell your personal information to third parties.`,
  },
  {
    title: "Payment Information",
    body: `Card payments are processed securely by Stripe. We never see or store your full card number. Bank transfer and pay-on-delivery orders are recorded with the order reference you provide to help us match payments.`,
  },
  {
    title: "Cookies & Local Storage",
    body: `We use browser local storage to remember your cart and wishlist while you shop as a guest, and standard authentication cookies/tokens to keep you signed in. We don't use third-party advertising trackers.`,
  },
  {
    title: "Data Sharing",
    body: `We share order information with delivery partners solely to fulfil your order, and with Stripe solely to process payments. We don't share your data with advertisers or unrelated third parties.`,
  },
  {
    title: "Your Rights",
    body: `You can view and update your account details at any time from your Profile page. To request deletion of your account or data, contact us and we'll action this within a reasonable timeframe, subject to any records we're legally required to retain (e.g. for tax purposes).`,
  },
  {
    title: "Data Security",
    body: `We use industry-standard practices to protect your data, including encrypted connections (HTTPS) and secure third-party infrastructure (Firebase, Stripe, Cloudinary) for storage and payments.`,
  },
  {
    title: "Changes to This Policy",
    body: `We may update this policy from time to time. Continued use of Cushite Beauty after changes are posted means you accept the revised policy.`,
  },
];

function Privacy() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <PageHeader
        title="Privacy Policy"
        subtitle={`Last updated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
      />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <Text style={{ fontFamily: "`Bricolage Grotesque`, sans-serif" }} tone="muted" size="lg" className="mb-10">
          Cushite Beauty ("we", "us", "our") respects your privacy. This policy
          explains what information we collect, how we use it, and the
          choices you have.
        </Text>

        <div className="flex flex-col gap-8">
          {SECTIONS.map(({ title, body }) => (
            <div key={title}>
              <Heading level="h4" className="mb-2">
                {title}
              </Heading>
              <Text style={{ fontFamily: "`Bricolage Grotesque`, sans-serif" }} tone="muted">{body}</Text>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6">
          <Text style={{ fontFamily: "`Bricolage Grotesque`, sans-serif" }} tone="muted" size="sm">
            Questions about this policy? <a href="/contact" className="font-medium text-[var(--primary)]">Get in touch</a>.
          </Text>
        </div>
      </section>
    </main>
  );
}

export default Privacy;
