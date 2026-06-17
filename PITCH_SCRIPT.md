# NutriDesh — 180-Second Pitch Script

---

## SLIDE 1 — Title (0:00 – 0:08)

> NutriDesh. A Bangla-first AI nutrition companion built for Bangladesh.

---

## SLIDE 2 — Problem Stats (0:08 – 0:30)

> Bangladesh carries a double burden of malnutrition. Twenty-four percent of children are stunted. Eleven percent of adults are diabetic. Thirty-five percent of women are now overweight — up from eleven percent two decades ago.
>
> And yet — for a hundred and seventy million people who live on dal-bhat, ilish, and khichuri — there is not a single nutrition app that speaks Bangla or recognizes a single deshi dish. Every app on the market is English, Western, and useless here.
>
> This is a 170-million-user gap nobody has built for.

---

## SLIDE 3 — Meet NutriDesh (0:30 – 1:00)

> NutriDesh closes that gap. Three principles.
>
> One — it understands deshi food. AI vision tuned for hilsa, khichuri, dal, pui shak, shutki — not pasta and quinoa.
>
> Two — it speaks Bangla. Every screen, every alert, every AI response — in Bangla first, with text-to-speech for low-literacy and elderly users.
>
> Three — it knows your life. Bazaar prices. Ramadan timings. Diabetic recipes. Pregnancy by gestational week. WHO stunting checks for children.
>
> Not a Western app translated. A Bangladeshi app, designed first.

---

## SLIDE 4 — AI Food Scanner (1:00 – 1:20)

> Here is how it works. A user points their phone at any deshi plate — raw, cooked, or mixed.
>
> The image goes to Gemini Flash multimodal vision, which identifies each component in Bangla and English, estimates portion size, and returns a structured nutrition card pulled from our curated Bangladeshi food database.
>
> Three seconds, end to end.

---

## SLIDE 5 — Bangla AI Chat (1:20 – 1:40)

> The user logs the meal and can ask the AI assistant anything — in Bangla. *"ডায়াবেটিসে ইলিশ খাওয়া যাবে?"*
>
> The assistant knows the user's profile, medical conditions, and every meal logged today. The response is contextual, not generic — grounded in BIRDEM, FAO, and WHO guidelines.

---

## SLIDE 6 — Daily Dashboard (1:40 – 1:55)

> All of it rolls up to a daily dashboard. Calories, macros, key micronutrients against Bangladeshi RDA values, deficiency alerts, and a sodium warning if salt creeps past clinical thresholds.

---

## SLIDE 7 — Special Modes (1:55 – 2:00)

> Plus six specialized modes — diabetes, pregnancy, child growth, Ramadan, Shastho Shebika portal, and bazaar budget meals.

---

## SLIDE 8 — Tech Stack / AI Approach (2:00 – 2:30)

> Now the AI thinking.
>
> One model, three jobs. Gemini Flash powers food vision, Bangla conversation, and budget meal recommendations. We force structured JSON output via `responseSchema` so the model cannot hallucinate free text.
>
> Context injection on every chat call. User profile, conditions, calorie target, today's nutrients, last ten messages — all passed as system instructions. That is why the assistant gives diabetic-aware answers, not generic LLM advice.
>
> RAG-style enrichment. Gemini identifies the food; our local Bangladeshi food database supplies trusted FAO and BIRDEM nutrition values. AI for perception, structured data for facts.
>
> Caching plus rate limit. Server-side cache with thirty-day TTL, pre-seeded for fifty common dishes. Free tier handles fifteen hundred requests per day.
>
> Total infrastructure cost — zero taka, zero dollars.

---

## SLIDE 9 — NutriDesh vs Every Other App (skip or 5-second mention)

> Every other nutrition app fails on Bangla, fails on deshi food, fails on bazaar reality. NutriDesh is the inverse.

(If tight on time, skip this slide entirely — slides 3 + 8 already cover differentiation.)

---

## SLIDE 10 — Five Users (2:30 – 2:42)

> Five users get NutriDesh.
>
> Household managers planning family meals on tight budgets. Diabetic patients tracking glycemic load. Pregnant mothers needing folate by gestational week. Parents tracking child stunting. Shastho Shebikas managing entire villages.

---

## SLIDE 11 — Already Shipped (2:42 – 2:55)

> And this isn't a deck — the product is live. Web app on `nutridesh.expo.app` — judges can open it right now, no install. Android APK shipped through Expo Application Services. Backend on Render. OTA update channel configured.
>
> Next steps: a fine-tuned EfficientNet classifier on a five-thousand-image Bengali food corpus for offline scan. Supabase cloud sync. icddr,b and BIRDEM clinical validation. Play Store launch.

---

## SLIDE 12 — Close (2:55 – 3:00)

> Nutrition intelligence for every Bangladeshi household. In their language. With their food. At their budget.
>
> **নিউট্রিদেশ. পুষ্টি, সবার জন্য.**

(Smile. Hold one second. End.)
