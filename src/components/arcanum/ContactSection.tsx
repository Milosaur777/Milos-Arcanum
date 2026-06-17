"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";


export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!res.ok) throw new Error("Failed");

      setIsSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch {
      setIsError(true);
      setTimeout(() => setIsError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
      aria-label="Contact section - The Royal Decree"
    >

      <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-storm-void px-4 py-2 border border-parchment-gold/30 mb-6">
            <span className="text-sm font-semibold text-storm-moon">Reach Out</span>
          </div>
          <h2 className="font-exocet text-4xl md:text-5xl text-storm-moon mb-4 subtitle-pulse">
            The Royal Decree
          </h2>
          <div className="relative w-48 md:w-64 h-6 mx-auto mb-4">
            <img
              src="/images/line-separator.avif"
              alt="Decorative divider"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="font-cormorant text-lg text-storm-moon/70 max-w-xl mx-auto">
            Send a raven to the Keeper of the Arcanum. Commissions, collaborations, and inquiries welcome.
          </p>
        </motion.div>

        {/* Contact Parchment */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          {/* Parchment background image */}
          <div className="relative w-full">
            <img
              src="/images/parchment-new-mobile.avif"
              alt="Contact parchment"
              className="w-full h-auto"
            />
            
            {/* Form overlay positioned on the parchment */}
            <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[70%] md:w-[60%]">
              <div className="text-center mb-6">
                <h3 className="font-cinzel text-lg md:text-xl text-parchment-ink tracking-widest mb-2">
                  NOTICE OF COMMISSION
                </h3>
                <p className="font-cormorant text-xs text-parchment-ink italic">
                  Order of the Arcanum - Anno Domini 2026
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name field */}
                <div className="relative">
                  <label className="font-cinzel text-[10px] text-parchment-ink tracking-widest uppercase mb-1 block">
                    Name of the Seeker
                  </label>
                  <div className="relative border-b-2 border-parchment-ink/20 focus-within:border-parchment-gold transition-colors">
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent py-2 font-cormorant text-base text-parchment-ink placeholder:text-parchment-ink/30 focus:outline-none"
                      placeholder="Enter thy name..."
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="relative">
                  <label className="font-cinzel text-[10px] text-parchment-ink tracking-widest uppercase mb-1 block">
                    Raven&apos;s Address (Email)
                  </label>
                  <div className="relative border-b-2 border-parchment-ink/20 focus-within:border-parchment-gold transition-colors">
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent py-2 font-cormorant text-base text-parchment-ink placeholder:text-parchment-ink/30 focus:outline-none"
                      placeholder="Enter thy correspondence address..."
                    />
                  </div>
                </div>

                {/* Message field */}
                <div className="relative">
                  <label className="font-cinzel text-[10px] text-parchment-ink tracking-widest uppercase mb-1 block">
                    The Message
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full bg-transparent py-2 font-cormorant text-base text-parchment-ink placeholder:text-parchment-ink/30 focus:outline-none resize-none"
                      placeholder="Inscribe thy inquiry here..."
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Submit button below the scroll */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="relative group px-8 py-3 bg-parchment-crimson rounded-full border border-parchment-gold/80 shadow-[0_0_12px_rgba(194,172,123,0.35)] hover:shadow-[0_0_20px_rgba(194,172,123,0.5)] transition-all duration-300 hover:scale-105 hover:border-parchment-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="font-cinzel text-xs text-white tracking-widest uppercase">
              {isLoading ? "Sending..." : isSubmitted ? "Sent by Raven" : isError ? "Failed. Try again." : "Seal & Send"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
