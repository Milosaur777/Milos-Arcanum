"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/arcanum/Navigation";

export default function AboutPage() {
  return (
    <div className="relative overflow-x-hidden">
      <Navigation />
      <main className="relative flex flex-col">
        <section
          className="relative py-24 md:py-32 min-h-screen overflow-hidden"
          aria-label="About section"
        >
          <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-storm-void px-4 py-2 border border-parchment-gold/30 mb-6">
                <span className="text-sm font-semibold text-storm-moon">About</span>
              </div>
              <h1 className="font-exocet text-4xl md:text-5xl text-storm-moon mb-4 subtitle-pulse">
                The Scriptorium
              </h1>
              <div className="relative w-48 md:w-64 h-6 mx-auto mb-4">
                <img
                  src="/images/line-separator.avif"
                  alt="Decorative divider"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="font-cormorant text-lg text-storm-moon/70 max-w-xl mx-auto">
                The artist behind the Arcanum.
              </p>
            </motion.div>

            {/* Parchment with integrated design */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Parchment background image */}
              <div className="relative w-full">
                <img
                  src="/images/parchment-new-mobile.avif"
                  alt="Parchment scroll"
                  className="w-full h-auto"
                />

                {/* Text overlay positioned on the parchment */}
                <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[70%] md:w-[60%] text-center">
                  <p className="font-blackletter text-[20px] md:text-[32px] leading-snug text-[#8b0000]">
                    I am a digital artist and worldbuilder passionate about art, games and the stories that linger in forgotten places.
                  </p>
                  <p className="font-blackletter text-[20px] md:text-[32px] leading-snug text-[#8b0000] mt-6">
                    Through light, shadow, I strive to evoke emotion and mystery, inviting you to step into realms where imagination and darkness entwine.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
