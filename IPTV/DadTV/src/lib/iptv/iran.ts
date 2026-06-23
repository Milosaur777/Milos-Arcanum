import type { Channel } from "./types"

const IRAN_KEYWORDS = [
  "IRIB",
  "Iran",
  "IRINN",
  "Varzesh",
  "Persiana",
  "iFilm",
  "Farsi",
  "Persian",
  "Fars",
  "Tehran",
  "Kerman",
  "Tabarestan",
  "Hamedan",
  "Mostanad",
  "Tamasha",
  "Salamat",
  "Omid",
  "Iraneman",
  "Khalij",
  "HodHod",
  "Bravo Farsi",
  "ITV Persian",
  "Omide Iran",
  "Marjaeyat",
  "Iran Press",
  "IraneFarda",
  "Iran Nama",
  "Iran National",
  "Iran Jewish",
]

export function isIranChannel(ch: Channel): boolean {
  const haystack = (ch.name + " " + ch.group).toLowerCase()
  return IRAN_KEYWORDS.some((kw) => haystack.includes(kw.toLowerCase()))
}
