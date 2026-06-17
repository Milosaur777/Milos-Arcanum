"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

interface ArtworkItem {
  id: number;
  title: string;
  year: string;
  category: string;
  etiquette: string;
  image: string;
  materials: string;
  thoughts: string;
}

const artworks: ArtworkItem[] = [
  {
    id: 1,
    title: "Fallen Vanguard",
    year: "2023",
    category: "Sketches",
    etiquette: "Sketch",
    image: "/images/sketches/androgenous_angel.avif",
    materials: "Digital drawing, Procreate",
    thoughts: "A guardian carved from marble and shadow — neither man nor woman, but something older. The cracked halo felt right for a warrior who fell for the right reason.",
  },
  {
    id: 2,
    title: "Ophanim's Radiance",
    year: "2023",
    category: "Sketches",
    etiquette: "Sketch",
    image: "/images/sketches/biblicallyaccurrateangel.avif",
    materials: "Pencil sketch, A4 bristol board",
    thoughts: "Inspired by Ezekiel's vision — wheels within wheels, lined with eyes. Not terror for the sake of it, but the awe of witnessing something never meant to be seen.",
  },
  {
    id: 3,
    title: "Cyberpunk Ninja",
    year: "2023",
    category: "Sketches",
    etiquette: "Sketch",
    image: "/images/sketches/cyberpunkz_12_11_23.avif",
    materials: "Alcohol markers, fine liner, A4 marker paper",
    thoughts: "Neon, chrome, and a blade in the dark. The mask hides more than a face — it hides intent. Late-night cyberpunk energy poured onto marker paper.",
  },
  {
    id: 4,
    title: "The Little Night",
    year: "2023",
    category: "Sketches",
    etiquette: "Sketch",
    image: "/images/sketches/cutevampire_stylized.avif",
    materials: "Digital painting, Clip Studio Paint",
    thoughts: "A softer shadow. Wanted to prove I could do cute without losing the darkness. The bat motifs and oversized sweater? That's just my aesthetic leaking through.",
  },
  {
    id: 5,
    title: "Starlet Gaze",
    year: "2023",
    category: "Sketches",
    etiquette: "Sketch",
    image: "/images/sketches/moviestar.avif",
    materials: "Graphite pencil, kneaded eraser, Strathmore paper",
    thoughts: "Golden-age Hollywood glamour dipped in melancholy. The eyes carry a story the smile won't tell — fame's lonely edge captured in graphite.",
  },
  {
    id: 6,
    title: "Hex Lasher",
    year: "2023",
    category: "Sketches",
    etiquette: "Sketch",
    image: "/images/sketches/witchfighter.avif",
    materials: "Ink wash, brush pen, cold-press watercolor paper",
    thoughts: "Martial mystic. The staff is both weapon and conduit — every strike casts a spell, every spell lands like a strike. Wanted the motion to feel like speed and sorcery combined.",
  },
];

const categories = ["All", "Sketches"];

const etiquetteColors: Record<string, string> = {
  "Sketch": "bg-parchment-crimson text-white",
};

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredArtworks = activeCategory === "All" 
    ? artworks 
    : artworks.filter(art => art.category === activeCategory);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
      aria-label="Gallery section - Artwork collection"
    >

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-storm-void px-4 py-2 border border-parchment-gold/30 mb-6">
            <span className="text-sm font-semibold text-storm-moon">Collection</span>
          </div>
          <h2 className="font-exocet text-4xl md:text-5xl text-storm-moon mb-4 subtitle-pulse">
            The Reliquary
          </h2>
          <div className="relative w-48 md:w-64 h-6 mx-auto mb-4">
            <img
              src="/images/line-separator.avif"
              alt="Decorative divider"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="font-cormorant text-lg text-storm-moon/70 max-w-xl mx-auto">
            Late-night marks on paper and screen.
          </p>
        </motion.div>

        {/* Category Filters - Styled as wax seals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-5 py-2 rounded-full font-cinzel text-sm tracking-wider transition-all duration-300 ${
                activeCategory === category
                  ? "bg-parchment-crimson text-white shadow-lg shadow-parchment-crimson/20 scale-105"
                  : "bg-storm-mist/20 text-storm-moon/70 hover:bg-storm-mist/40 hover:text-storm-moon"
              }`}
              aria-label={`Filter by ${category}`}
            >
              {/* Wax seal texture */}
              <span className="absolute inset-0 rounded-full opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)`
              }} />
              {category}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {filteredArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="break-inside-avoid"
            >
              <ArtworkCard artwork={artwork} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ArtworkCard({ artwork }: { artwork: ArtworkItem }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="relative group">
      {/* Gothic Frame around image */}
      <div className="relative p-3 bg-gradient-to-b from-storm-mist/30 to-storm-void/60 rounded-lg border border-storm-cloud/20 transition-all duration-500 group-hover:border-parchment-gold/40 group-hover:shadow-2xl group-hover:shadow-parchment-gold/10">
        {/* Inner matting */}
        <div className="relative p-2 bg-parchment-cream/5 rounded">
          {/* Ornate frame corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-parchment-gold/40 rounded-tl" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-parchment-gold/40 rounded-tr" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-parchment-gold/40 rounded-bl" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-parchment-gold/40 rounded-br" />

          {/* Artwork Image */}
          <div className="relative w-full bg-storm-mist/20 rounded overflow-hidden">
            {!imgLoaded && (
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-storm-mist/30 via-storm-cloud/20 to-storm-void/40 animate-pulse" />
            )}
            <Image
              src={artwork.image}
              alt={artwork.title}
              width={800}
              height={600}
              className={`w-full h-auto transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImgLoaded(true)}
            />

            {/* Etiquette badge */}
            <div className="absolute top-3 right-3 z-10">
              <div className={`px-2.5 py-1 rounded-full font-cinzel text-[10px] tracking-wider shadow-lg ${etiquetteColors[artwork.etiquette]}`}>
                <span className="flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="currentColor">
                    <circle cx="6" cy="6" r="5" />
                    <circle cx="6" cy="6" r="2" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                  {artwork.etiquette}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description section beneath the frame */}
      <div className="mt-4 px-1 space-y-2">
        {/* Title + Year */}
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-cinzel text-base md:text-lg text-storm-moon tracking-wide leading-tight">
            {artwork.title}
          </h3>
          <span className="font-cormorant text-xs text-storm-moon/40 whitespace-nowrap italic">
            {artwork.year}
          </span>
        </div>

        {/* Materials */}
        <p className="font-cormorant text-sm text-parchment-gold/70 italic leading-snug">
          <span className="text-parchment-gold/50 text-[10px] uppercase tracking-wider font-cinzel not-italic mr-1.5">Media</span>
          {artwork.materials}
        </p>

        {/* Divider */}
        <div className="w-8 h-px bg-gradient-to-r from-parchment-gold/40 to-transparent" />

        {/* Thoughts */}
        <p className="font-cormorant text-sm text-storm-moon/60 leading-relaxed">
          {artwork.thoughts}
        </p>
      </div>
    </div>
  );
}
