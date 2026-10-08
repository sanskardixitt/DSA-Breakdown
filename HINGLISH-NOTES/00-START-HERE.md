# 00 — START HERE: Soch kaise badalni hai

---

## 1. Sabse badi galtfehmi

Log sochte hain DSA = 500 problems solve karna.
**Galat.** DSA = **~15 patterns** ko itna internalize karna ki problem padhte hi haath apne aap chalne lage.

LeetCode pe 3000 problems hain. Unke peeche sirf 15 ideas hain. Baaki sab **wahi ideas, alag kapdo me**.

```
        3000 problems
              |
              v
   +----------------------+
   |   15 core patterns   |   <-- ye yaad karna hai
   +----------------------+
              |
              v
      har problem = 1 ya 2 patterns ka mixture
```

Tumhara kaam: **mapping seekhna**, na ki solutions ratna.

---

## 2. The 60-Second Drill (har problem pe karo)

Problem padhne ke baad, code chhune se **pehle**, ye 5 sawaal likho. Literally likho, dimaag me mat rakho.

```
┌─────────────────────────────────────────────────────────┐
│  Q1. Input kya hai?      array / string / tree / graph  │
│  Q2. n kitna bada hai?   -> complexity target milega    │
│  Q3. Sorted hai?         -> haan = two pointer/bin srch │
│  Q4. Kya maanga hai?     count / max / min / all-ways / │
│                             exists / kth                │
│  Q5. Brute force kya?    ek line me bolo + uski O()     │
└─────────────────────────────────────────────────────────┘
                          |
                          v
         "Main kya cheez REPEAT calculate kar raha hoon?"
                          |
                          v
              wahi repeat -> yahi optimize hoga
```

**Q4 ka jawab pattern batata hai:**

| Kya maanga hai | Kya sochna hai |
|---|---|
| "count how many ways" | DP ya combinatorics |
| "maximum / minimum value" | DP, greedy, ya binary search on answer |
| "**all** possible ..." | Backtracking (output hi exponential hai) |
| "does it exist / possible?" | HashSet, BFS/DFS, union-find |
| "kth largest / top k" | Heap ya quickselect |
| "shortest path" | BFS (unweighted) / Dijkstra (weighted) |
| "longest/shortest contiguous" | Sliding window |
| "next greater/smaller" | Monotonic stack |

---

## 3. Stuck ho gaye to? — 10-20-30 rule

```
0-10 min   : Akele socho. Koi hint nahi. Brute force likho paper pe.
10-20 min  : Pattern file kholo (sirf pattern, solution nahi). Triggers padho.
20-30 min  : Sirf HINT padho. Solution nahi.
30 min+    : Editorial padho.  ⚠ FIR USE BAND KARO.
             10 minute wait karo. Ab khaali file me from scratch likho.
```

Last step optional nahi hai. **Solution padhne se kuch nahi seekhte.**
10 min baad khaali file me dobara likhne se seekhte ho. Ye difference hi sab kuch hai.

---

## 4. Revision system (spaced repetition)

Jis problem me hint lagi -> `⚠` mark karo.

```
Day 0  : hint lagi          -> ⚠
Day +3 : dobara solve karo  -> clean? to ⚠ hi rehne do
Day +10: dobara solve karo  -> clean? to ✅  (ab kabhi mat chhuna)
```

**2 baar clean solve = pakka yaad.** Ye ek habit 50 extra problems se zyada value deti hai.

---

## 5. Industry reality check (jo koi nahi batata)

| Myth | Reality |
|---|---|
| "Perfect optimal solution chahiye" | Brute force bol ke, fir optimize karna **zyada** points deta hai |
| "Chup chaap code karo" | Silence = red flag. Bolte raho, interviewer hint dega |
| "Edge cases baad me" | Pehle bolo: "empty array? single element? duplicates? negative?" |
| "Variable name se kya farak" | `l, r, mid` chalega. `a, b, c, x1, x2` = sloppy signal |
| "Compile hona zaroori hai" | Interview me nahi. **Sochne ka tareeka** matter karta hai |

**Interview me bolne ka script:**

```
1. "Toh main samajh raha hoon: input X hai, output Y chahiye. Sahi?"     (clarify)
2. "Edge cases: empty, single, duplicates, negatives — inka kya?"        (edge)
3. "Brute force: har pair check karunga, O(n²). Chalta hai?"             (baseline)
4. "Yahan main same sum baar-baar compute kar raha hoon.
    Agar hashmap me store kar lu to O(n) ho jaayega."                    (insight)
5. [ab code likho, bolte hue]
6. "Chalo isko [1,2,3] pe dry run karte hain..."                         (verify)
```

Step 4 sabse important hai. **Wahi tumhari soch dikhata hai.**

---

## 6. Roz ka schedule (2 ghante)

| Block | Time | Kaam |
|---|---|---|
| Read | 20 min | Aaj ka pattern file padho. Skim nahi — samajh ke. |
| Type | 10 min | Template yaad se type karo scratch file me. Copy-paste **nahi**. |
| Solve | 75 min | 3-4 problems, easy se hard order me |
| Log | 15 min | Solution + 3 line reflection `solutions/` me. `PROGRESS.md` update. |

3-line reflection ka format:
```
Kya pattern tha       :
Kahan atka            :
Agli baar kya trigger : (jo dekh ke turant ye pattern yaad aa jaaye)
```

---

Ab jao: [01-complexity-oracle.md](01-complexity-oracle.md)
