"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Hot Desk",
    price: "1,500",
    period: "/month",
    desc: "Flexible open seating",
    features: [
      "Any available desk",
      "Business hours access",
      "2 meeting room hrs/mo",
      "Coffee & beverages",
      "High-speed WiFi",
    ],
  },
  {
    name: "Dedicated",
    price: "3,000",
    period: "/month",
    desc: "Your permanent seat",
    highlight: true,
    features: [
      "Reserved desk + locker",
      "24/7 building access",
      "8 meeting room hrs/mo",
      "Mail & courier handling",
      "2 guest passes/month",
    ],
  },
  {
    name: "Private Office",
    price: "Custom",
    period: "",
    desc: "Enclosed space for teams",
    features: [
      "Fully private office",
      "24/7 access",
      "Unlimited meeting rooms",
      "Custom branding",
      "Dedicated support",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring" as const, bounce: 0.2, duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Transparent, simple pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            All prices in PKR. Contact us for team discounts and annual plans.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                type: "spring" as const,
                bounce: 0.22,
                duration: 0.85,
                delay: i * 0.12,
              }}
              className={`relative rounded-2xl p-8 flex flex-col border transition-all duration-300
                ${plan.highlight
                  ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/30 scale-105"
                  : "bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-primary text-xs font-semibold shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-heading font-bold text-xl mb-1">{plan.name}</h3>
                <p className={`text-sm ${plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {plan.desc}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="font-heading text-4xl font-extrabold">
                    {plan.price === "Custom" ? "Custom" : `Rs ${plan.price}`}
                  </span>
                  {plan.period && (
                    <span className={`text-sm mb-1 ${plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                      ${plan.highlight ? "bg-white/20" : "bg-primary/10"}`}>
                      <Check className={`w-2.5 h-2.5 ${plan.highlight ? "text-white" : "text-primary"}`} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#contact">
                <Button
                  className={`w-full rounded-xl cursor-pointer
                    ${plan.highlight
                      ? "bg-white text-primary hover:bg-white/90 font-semibold shadow-sm"
                      : ""
                    }`}
                  variant={plan.highlight ? "secondary" : "outline"}
                >
                  {plan.price === "Custom" ? "Get a Quote" : "Get Started"}
                </Button>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
