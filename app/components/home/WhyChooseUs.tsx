import { ShieldCheck, BadgePercent, Award, Wrench, Truck, Headset } from "lucide-react";

const reasons = [
  { Icon: ShieldCheck, title: "Genuine Products", text: "Original tools from trusted brands. No fakes, no shortcuts." },
  { Icon: BadgePercent, title: "Fair Prices", text: "Honest prices for fundis, contractors and homeowners." },
  { Icon: Award, title: "Warranty Support", text: "We stand behind what we sell and help with warranty claims." },
  { Icon: Wrench, title: "Expert Advice", text: "Not sure what you need? We'll help you pick the right tool." },
  { Icon: Truck, title: "Delivery Available", text: "Delivery within Nairobi, and we send orders upcountry." },
  { Icon: Headset, title: "Easy Ordering", text: "Order on WhatsApp or by phone. Quick replies, no hassle." },
];

export default function WhyChooseUs({ dark = false }: { dark?: boolean }) {
  return (
    <section className={dark ? "bg-ink text-white" : ""}>
      <div className="mx-auto max-w-7xl px-4 py-14">
        <p className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-brand" : "text-muted"}`}>
          Why JNB Tools
        </p>
        <h2 className={`mt-1 font-heading text-3xl font-bold uppercase ${dark ? "text-white" : "text-ink"}`}>
          Why Choose Us
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {reasons.map(({ Icon, title, text }) => (
            <div
              key={title}
              className={`rounded-2xl border p-4 transition sm:p-6 ${
                dark
                  ? "border-white/10 bg-white/5 hover:border-brand/50 hover:bg-white/10"
                  : "border-line bg-white hover:shadow-lg"
              }`}
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-ink sm:h-12 sm:w-12">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <h3 className={`mt-3 text-sm font-bold sm:mt-4 sm:text-lg ${dark ? "text-white" : "text-ink"}`}>
                {title}
              </h3>
              <p className={`mt-1 text-xs leading-relaxed sm:text-sm ${dark ? "text-white/70" : "text-muted"}`}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}