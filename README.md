# DSA in 30 Days — Foundation Build

A structured, notes-first repo for going from "I know the concepts but I freeze on problems" to
"I recognise the pattern in the first 60 seconds."

---

## The core belief of this repo

> You are not bad at DSA. You are bad at **pattern retrieval under pressure**.

Most people who "know the concepts" can explain a hash map, explain BFS, explain DP. They still fail
problems. The gap is not knowledge — it's the *lookup step*: reading a problem statement and mapping it
to a technique in under a minute.

So this repo is built around **recognition triggers**, not around definitions. Every pattern file has a
section literally called "How do I know to use this?" with the exact phrases in a problem statement that
should fire the pattern.

---

## How to use this repo (read this properly, it matters)

### The daily loop (2–3 hours)

| Block | Time | What you do |
|---|---|---|
| **1. Read** | 25 min | Read the day's `notes.md` and `pattern-*.md`. Do NOT skim. |
| **2. Template** | 10 min | Type the template out from memory into a scratch file. Not copy-paste. **Type it.** |
| **3. Solve** | 75–90 min | Do the day's problems from `problems.md`, in order. |
| **4. Log** | 15 min | Write your solution + a 3-line reflection into `solutions/`. Update `PROGRESS.md`. |

### The 30-minute rule (the most important rule here)

When stuck on a problem:

- **0–10 min** — Think alone. No hints. Write down brute force, then ask "what am I recomputing?"
- **10–20 min** — Re-read the pattern file for the day. Look at the "recognition triggers". Still no code.
- **20–30 min** — Read *only the hint*, not the solution. LeetCode hints, or the "Nudge" line in `problems.md`.
- **30 min+** — Read the editorial. **Then close it, wait 10 minutes, and write the solution from scratch.**

The last step is non-negotiable. Reading a solution teaches you nothing. Reproducing it from an empty
file 10 minutes later is what actually builds recall.

### The re-solve schedule (spaced repetition)

Every problem you needed a hint on gets marked `⚠` in `PROGRESS.md`.

- **Day + 3** — re-solve it. From scratch. Timed.
- **Day + 10** — re-solve it again.

If you solve it clean twice, mark it `✅` and never touch it again. This single habit is worth more
than 50 extra new problems.

---

## Repo map

```
.
├── README.md                  ← you are here
├── PLAN.md                    ← the 30-day day-by-day schedule
├── PROGRESS.md                ← your tracker; update it daily
├── CHEATSHEET.md              ← "which pattern do I use?" decision tree + complexity table
├── TEMPLATES.md               ← every code template in one place, for revision
│
├── 00-foundations/            ← complexity, problem-solving method, Python toolkit
├── 01-arrays-hashing/
├── 02-two-pointers/
├── 03-sliding-window/
├── 04-binary-search/
├── 05-stack-monotonic/
├── 06-linked-list/
├── 07-trees/
├── 08-heaps-priority-queue/
├── 09-backtracking/
├── 10-graphs/
├── 11-dynamic-programming/
├── 12-greedy-intervals/
├── 13-bit-manipulation/
│
└── solutions/                 ← YOUR code goes here, one file per problem
```

Each topic folder has the same three kinds of file:

- **`notes.md`** — the mental model. What the structure actually *is*, its costs, the traps.
- **`pattern-*.md`** — one specific reusable technique. Trigger phrases → template → worked example → variants.
- **`problems.md`** — the curated LeetCode list, ordered easy→hard, each with a one-line nudge.

---

## Rules that make this work

1. **Never copy-paste a template.** Type it. Muscle memory is the point.
2. **Always state complexity out loud before you code.** If you can't, you don't have a plan yet.
3. **Brute force first, always.** Say it in one sentence. Then optimise. Jumping straight to clever is
   how people get stuck at minute 0.
4. **One problem = one file in `solutions/`.** With the reflection block. No exceptions.
5. **Don't chase problem count.** 4 problems deeply understood beats 12 skimmed.
6. **If you miss a day, do not "catch up" by doubling.** Just shift the plan by one day. Cramming
   defeats spaced repetition.

---

## What "good" looks like at the end of 30 days

You should be able to read a fresh medium problem and, within 90 seconds, say:

> "Sorted array, asking for a pair summing to a target → two pointers from opposite ends, O(n), O(1) space."

That's it. That's the whole goal. Speed of *recognition*, not speed of typing.

---

Start with [PLAN.md](PLAN.md), then [00-foundations/01-complexity-analysis.md](00-foundations/01-complexity-analysis.md).
