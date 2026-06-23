"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { CreatorField } from "@/components/oc/CreatorField";
import { TagInput } from "@/components/oc/TagInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FieldVisibilityToggle } from "@/components/oc/FieldVisibilityToggle";
import { saveOC, fetchOCById, uploadOCImage, deleteOCImage } from "@/lib/supabase-queries";
import { PREMADE_CHARACTERS } from "@/lib/types";
import { generateRandomOC, randomTruthsAndLie, randomTags } from "@/lib/random-oc";
import type { OC, OCField, OpenFeedEntry } from "@/lib/types";
import {
  ArrowLeft, ArrowRight, Check, Save, Sparkles, Plus, X,
  Dices, ImageIcon, Upload, Trash2, ImagePlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CreatePageContent />
    </Suspense>
  );
}

const FIELD_DEFINITIONS: Array<{ step: number; id: string; label: string; type: "text" | "textarea" | "select"; options?: string[]; placeholder?: string }> = [
  { step: 1, id: "name", label: "Character Name", type: "text", placeholder: "e.g. Lyra Shadowweaver" },
  { step: 1, id: "age", label: "Age", type: "text", placeholder: "e.g. 127 years" },
  { step: 1, id: "species", label: "Species / Race", type: "text", placeholder: "e.g. Dragon, Elf, Android" },
  { step: 1, id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Non-binary", "Genderfluid", "Agender", "Shapeshifting", "None", "Other"] },
  { step: 1, id: "orientation", label: "Sexual Orientation", type: "select", options: ["Heterosexual", "Homosexual", "Bisexual", "Pansexual", "Asexual", "Demisexual", "Queer", "Fluid", "Other"] },
  { step: 1, id: "romantic", label: "Romantic Orientation", type: "select", options: ["Heteroromantic", "Homoromantic", "Biromantic", "Panromantic", "Aromantic", "Demiromantic", "Polyromantic", "Greyromantic", "Other"] },
  { step: 2, id: "height", label: "Height", type: "text", placeholder: "e.g. 6'2\" (188cm)" },
  { step: 2, id: "hair", label: "Hair", type: "text", placeholder: "e.g. Long silver, short black" },
  { step: 2, id: "eyes", label: "Eyes", type: "text", placeholder: "e.g. Emerald green, glowing amber" },
  { step: 2, id: "bodyType", label: "Body Type", type: "text", placeholder: "e.g. Athletic, slender, muscular" },
  { step: 2, id: "features", label: "Distinguishing Features", type: "textarea", placeholder: "Scars, tattoos, horns, wings, etc." },
  { step: 3, id: "personality", label: "Personality Traits", type: "textarea", placeholder: "e.g. Brooding, witty, fiercely loyal" },
  { step: 3, id: "strengths", label: "Strengths", type: "textarea", placeholder: "What is your character good at?" },
  { step: 3, id: "weaknesses", label: "Weaknesses", type: "textarea", placeholder: "What are their flaws?" },
  { step: 4, id: "backstory", label: "Backstory", type: "textarea", placeholder: "A brief history of your character..." },
  { step: 4, id: "occupation", label: "Occupation", type: "text", placeholder: "e.g. Royal guard, smuggler, healer" },
  { step: 4, id: "homeworld", label: "Homeworld / Origin", type: "text", placeholder: "e.g. Shadow Realm, Mars Colony" },
];

const STEPS = [
  { num: 1, label: "Basics" },
  { num: 2, label: "Appearance" },
  { num: 3, label: "Personality" },
  { num: 4, label: "Background" },
  { num: 5, label: "Tags" },
  { num: 6, label: "Two Truths & a Lie" },
  { num: 7, label: "Open Feed" },
  { num: 8, label: "Images" },
];

function createField(id: string, label: string, type: "text" | "textarea" | "select"): OCField {
  return { id, label, type, value: "", visible: true, skipped: false };
}

function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [step, setStep] = useState(0);
  const [showPreMade, setShowPreMade] = useState(true);
  const [fields, setFields] = useState<OCField[]>(FIELD_DEFINITIONS.map((f) => createField(f.id, f.label, f.type)));
  const [tags, setTags] = useState<string[]>([]);
  const [truths, setTruths] = useState<[string, string, string]>(["", "", ""]);
  const [openFeed, setOpenFeed] = useState<OpenFeedEntry[]>([]);
  const [feedInput, setFeedInput] = useState("");
  const [feedVisible, setFeedVisible] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editId) {
      fetchOCById(editId).then((existing) => {
        if (existing) {
          setFields(existing.fields);
          setTags(existing.tags);
          setTruths(existing.truthsAndLie);
          setOpenFeed(existing.openFeed);
          setImageUrl(existing.imageUrl || "");
          setImages(existing.images || []);
          setShowPreMade(false);
          setStep(1);
          setEditingId(editId);
        }
      });
    }
  }, [editId]);

  function getField(id: string) {
    return fields.find((f) => f.id === id) || createField(id, "", "text");
  }

  function updateField(id: string, value: string) {
    setFields(fields.map((f) => (f.id === id ? { ...f, value } : f)));
  }
  function toggleVisibility(id: string) {
    setFields(fields.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)));
  }
  function toggleSkip(id: string) {
    setFields(fields.map((f) => (f.id === id ? { ...f, skipped: !f.skipped } : f)));
  }

  function pickPreMade(pm: (typeof PREMADE_CHARACTERS)[0]) {
    setFields(
      fields.map((f) => {
        if (f.id === "name") return { ...f, value: pm.name, visible: true, skipped: false };
        return f;
      })
    );
    setTags(pm.tags);
    setShowPreMade(false);
    setStep(1);
  }

  // ─── Random ───

  function randomizeAll() {
    const random = generateRandomOC();
    setFields(
      fields.map((f) => {
        const val = random.fields[f.id];
        return val !== undefined ? { ...f, value: val, visible: true, skipped: false } : f;
      })
    );
    setTags(random.tags);
    setTruths(random.truthsAndLie);
    setShowPreMade(false);
    setStep(1);
    toast.success("Random OC generated!");
  }

  function randomizeStep() {
    const random = generateRandomOC();
    const stepDefs = FIELD_DEFINITIONS.filter((d) => d.step === step);
    setFields(
      fields.map((f) => {
        const def = stepDefs.find((d) => d.id === f.id);
        if (def) {
          const val = random.fields[f.id];
          return val !== undefined ? { ...f, value: val, visible: true, skipped: false } : f;
        }
        return f;
      })
    );
    toast.success("Randomized!");
  }

  function randomizeField(id: string) {
    const random = generateRandomOC();
    const val = random.fields[id];
    if (val !== undefined) {
      updateField(id, val);
    }
  }

  function randomizeTruths() {
    setTruths(randomTruthsAndLie());
    toast.success("New truths & lie generated!");
  }

  function randomizeTags() {
    setTags(randomTags(5));
    toast.success("Random tags generated!");
  }

  // ─── Feed ───

  function addFeedEntry() {
    if (!feedInput.trim()) return;
    const entry: OpenFeedEntry = {
      id: `feed_${Date.now()}`,
      content: feedInput.trim(),
      visible: feedVisible,
      createdAt: new Date(),
    };
    setOpenFeed([...openFeed, entry]);
    setFeedInput("");
  }

  function removeFeedEntry(id: string) {
    setOpenFeed(openFeed.filter((e) => e.id !== id));
  }

  function toggleFeedVisibility(id: string) {
    setOpenFeed(openFeed.map((e) => (e.id === id ? { ...e, visible: !e.visible } : e)));
  }

  // ─── Images ───

  async function handleProfileImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadOCImage(file, editingId || `temp_${Date.now()}`);
      setImageUrl(url);
      toast.success("Profile image uploaded!");
    } catch {
      toast.error("Failed to upload image");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const ocId = editingId || `temp_${Date.now()}`;
    try {
      const urls = await Promise.all(
        Array.from(files).map((file) => uploadOCImage(file, ocId))
      );
      setImages((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} image(s) uploaded!`);
    } catch {
      toast.error("Failed to upload images");
    }
    setUploading(false);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  async function removeImage(url: string) {
    try {
      await deleteOCImage(url);
      setImages((prev) => prev.filter((u) => u !== url));
      if (imageUrl === url) setImageUrl("");
      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image");
    }
  }

  function setImageAsProfile(url: string) {
    setImageUrl(url);
    toast.success("Set as profile image");
  }

  // ─── Steps ───

  function isStepComplete(stepNum: number): boolean {
    if (stepNum < 5) {
      const stepFields = FIELD_DEFINITIONS.filter((d) => d.step === stepNum);
      return stepFields.every((d) => {
        const f = getField(d.id);
        return f.skipped || (typeof f.value === "string" && f.value.trim() !== "");
      });
    }
    return true;
  }

  async function handleSave() {
    const tempId = editingId || `temp_${Date.now()}`;
    const oc: OC = {
      id: tempId,
      name: getField("name").value as string || "Unnamed OC",
      fields,
      tags,
      truthsAndLie: truths,
      openFeed,
      brand: 0,
      badges: [],
      visibleBadgeIds: [],
      isPreMade: false,
      imageUrl: imageUrl || undefined,
      images,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const saved = await saveOC(oc);
      if (!editingId && saved.id) setEditingId(saved.id);
      toast.success(editingId ? "OC updated!" : "OC created!");
      router.push("/");
    } catch (e) {
      console.error("Save failed:", e);
      const msg = typeof e === "object" && e !== null ? JSON.stringify(e) : String(e);
      toast.error("Failed to save OC: " + msg);
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <AnimatePresence mode="wait">
          {showPreMade ? (
            <motion.div key="premade" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-semibold tracking-tight">Create Your OC</h1>
                <p className="text-muted-foreground mt-2">Start from a template, randomize, or build from scratch</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                {PREMADE_CHARACTERS.map((pm) => (
                  <Card
                    key={pm.name}
                    className="p-5 cursor-pointer transition-all duration-200 hover:border-accent hover:bg-surface-elevated"
                    onClick={() => pickPreMade(pm)}
                  >
                    <h3 className="font-medium mb-1">{pm.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{pm.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {pm.tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={randomizeAll} className="glow-pink-sm">
                  <Dices className="h-5 w-5 mr-2" />
                  Random OC
                </Button>
                <Button variant="outline" size="lg" onClick={() => { setShowPreMade(false); setStep(1); }}>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Build from Scratch
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Step progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {editingId ? "Edit OC" : "Create OC"}
                  </h1>
                  <Button variant="outline" size="sm" onClick={randomizeStep}>
                    <Dices className="h-4 w-4 mr-1.5" />
                    Random
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  {STEPS.map((s, i) => (
                    <div key={s.num} className="flex items-center gap-1 flex-1">
                      <button
                        type="button"
                        onClick={() => setStep(s.num)}
                        className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-medium transition-all duration-200 ${
                          step === s.num
                            ? "bg-accent text-white"
                            : step > s.num || isStepComplete(s.num)
                            ? "bg-accent/20 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step > s.num || isStepComplete(s.num) ? <Check className="h-3.5 w-3.5" /> : s.num}
                      </button>
                      {i < STEPS.length - 1 && (
                        <div className={`h-px flex-1 ${step > s.num || isStepComplete(s.num) ? "bg-accent/50" : "bg-muted"}`} />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {STEPS.find((s) => s.num === step)?.label}
                </p>
              </div>

              {/* Step 1-4: Field groups with per-field random */}
              {step >= 1 && step <= 4 && (
                <div className="space-y-5">
                  {FIELD_DEFINITIONS.filter((d) => d.step === step).map((def) => {
                    const f = getField(def.id);
                    return (
                      <CreatorField
                        key={def.id}
                        id={def.id}
                        label={def.label}
                        type={def.type}
                        value={f.value as string}
                        visible={f.visible}
                        skipped={f.skipped}
                        options={def.options}
                        placeholder={def.placeholder}
                        onChange={(v) => updateField(def.id, v)}
                        onVisibilityChange={() => toggleVisibility(def.id)}
                        onSkip={() => toggleSkip(def.id)}
                        onRandom={() => randomizeField(def.id)}
                      />
                    );
                  })}
                </div>
              )}

              {/* Step 5: Tags */}
              {step === 5 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Tags</Label>
                      <Button variant="ghost" size="sm" onClick={randomizeTags}>
                        <Dices className="h-3.5 w-3.5 mr-1" /> Random
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Tags are used for matchmaking. Add keywords that describe your OC.
                    </p>
                    <TagInput tags={tags} onChange={setTags} placeholder="e.g. dragon, fantasy, warrior, elf" />
                  </div>
                  {tags.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {tags.length} tag{tags.length > 1 ? "s" : ""} added
                    </div>
                  )}
                </div>
              )}

              {/* Step 6: Two Truths and a Lie */}
              {step === 6 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Two Truths and a Lie</Label>
                      <Button variant="ghost" size="sm" onClick={randomizeTruths}>
                        <Dices className="h-3.5 w-3.5 mr-1" /> Suggest
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Make your profile more interesting! Other players will guess which is the lie.
                    </p>
                  </div>
                  {([0, 1, 2] as const).map((i) => (
                    <div key={i}>
                      <Label className="text-xs text-muted-foreground">
                        {i < 2 ? `Truth ${i + 1}` : "Lie"}
                      </Label>
                      <Input
                        value={truths[i]}
                        onChange={(e) => {
                          const next: [string, string, string] = [...truths] as any;
                          next[i] = e.target.value;
                          setTruths(next);
                        }}
                        placeholder={i < 2 ? "A true fact about your OC..." : "A convincing lie..."}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Step 7: Open Feed */}
              {step === 7 && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Open Feed</Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Write anything you want about your OC that didn't fit in the fields above.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={feedInput}
                      onChange={(e) => setFeedInput(e.target.value)}
                      placeholder="Write something about your OC..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeedEntry())}
                    />
                    <FieldVisibilityToggle visible={feedVisible} onChange={setFeedVisible} />
                    <Button type="button" size="icon" onClick={addFeedEntry} disabled={!feedInput.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {openFeed.map((entry) => (
                      <Card key={entry.id} className="flex items-start justify-between p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{entry.content}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-3 shrink-0">
                          <FieldVisibilityToggle visible={entry.visible} onChange={() => toggleFeedVisibility(entry.id)} />
                          <button
                            type="button"
                            onClick={() => removeFeedEntry(entry.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove entry"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </Card>
                    ))}
                    {openFeed.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No entries yet. Add something about your OC!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 8: Images */}
              {step === 8 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">Profile Image</Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      This is the first image others see of your character.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageUpload}
                    />

                    {imageUrl ? (
                      <div className="relative inline-block">
                        <img
                          src={imageUrl}
                          alt="Profile"
                          className="w-32 h-32 rounded-lg object-cover border border-border"
                        />
                        <button
                          onClick={() => { setImageUrl(""); }}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full h-24 border-dashed"
                      >
                        {uploading ? (
                          "Uploading..."
                        ) : (
                          <>
                            <ImagePlus className="h-5 w-5 mr-2" />
                            Upload Profile Image
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Gallery</Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Add more photos of your character. Click an image to set it as profile.
                    </p>

                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />

                    <div className="grid grid-cols-3 gap-3">
                      {images.map((url) => (
                        <div key={url} className="relative group aspect-square">
                          <img
                            src={url}
                            alt="Gallery"
                            className="w-full h-full rounded-lg object-cover border border-border cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setImageAsProfile(url)}
                          />
                          <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => setImageAsProfile(url)}
                              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                              title="Set as profile"
                            >
                              <ImageIcon className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => removeImage(url)}
                              className="p-1.5 rounded-full bg-red-500/50 hover:bg-red-500/70 text-white transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={uploading}
                        className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Upload className="h-5 w-5" />
                        <span className="text-xs">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step <= 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Previous
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" render={<Link href="/" />}>Cancel</Button>

                  {step < 8 ? (
                    <Button onClick={() => setStep(step + 1)}>
                      Next <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  ) : (
                    <Button onClick={handleSave} className="glow-pink-sm">
                      <Save className="h-4 w-4 mr-1.5" />
                      {editingId ? "Update" : "Save"} OC
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
