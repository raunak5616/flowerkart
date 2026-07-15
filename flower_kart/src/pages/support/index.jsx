import { useState } from "react";
import { SectionIntro } from "../../components/ui/SectionIntro";
import { useToast } from "../../components/ui/ToastProvider.jsx";

export default function Support() {
  const { notify } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    notify({
      title: "Support request submitted",
      message: "We've captured your message and a support response flow can plug into this screen next.",
      type: "success",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-shell pb-20 pt-8">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <section className="surface-card rounded-[40px] bg-premium-gradient px-7 py-10 text-white md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-100/80">Help center</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Fast answers for orders, delivery, payments, and care.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-rose-50/85 md:text-base">
            Support works better when it feels as trustworthy as checkout. This page now introduces clearer help paths and a cleaner contact form.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            {[
              ["local_shipping", "Track an order", "See fulfillment progress, delivery updates, and delays without hunting through multiple screens."],
              ["payments", "Resolve payment issues", "Get help for failed attempts, duplicate charges, or payment verification concerns."],
              ["favorite", "Request bouquet changes", "Need a delivery note or gifting adjustment? Start the support flow here."],
            ].map(([icon, title, text]) => (
              <div key={title} className="surface-card rounded-[30px] p-6">
                <span className="material-symbols-outlined rounded-full bg-rose-50 p-3 text-rose-500">
                  {icon}
                </span>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          <div className="surface-card rounded-[32px] p-6 md:p-8">
            <SectionIntro
              eyebrow="Contact support"
              title="Tell us what went wrong"
              description="A more polished support form should guide the customer clearly and respond with confidence after submission."
            />

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Your name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-300"
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Your email"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-300"
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                rows="6"
                value={formData.message}
                placeholder="Describe the issue you're facing"
                className="w-full rounded-3xl border border-slate-200 px-4 py-4 text-sm outline-none transition focus:border-rose-300"
                onChange={handleChange}
                required
              />
              <button type="submit" className="cta-button w-full px-6 py-4 text-sm">
                Submit support request
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
