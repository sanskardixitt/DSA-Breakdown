# 02 — How To Actually Solve A Problem

The reason you "know the concepts but freeze" is almost always that you have **no process**. You read
the problem, stare, and hope the answer appears. It doesn't. So you panic and start typing.

This file gives you a process. Follow it literally for the first two weeks, even when it feels slow.

---

## The 6-step method: **R-E-B-O-C-T**

**R**estate → **E**xamples → **B**rute force → **O**ptimise → **C**ode → **T**est

| Step | Time budget (35-min problem) | Output |
|---|---|---|
| 1. Restate | 2 min | One sentence, in your own words |
| 2. Examples | 3 min | A worked example + 2 edge cases |
| 3. Brute force | 3 min | Approach + complexity, **spoken out loud** |
| 4. Optimise | 7 min | Target complexity + chosen pattern |
| 5. Code | 15 min | The actual solution |
| 6. Test | 5 min | Dry-run on your example, then edge cases |

Notice: **you don't touch the keyboard until minute 15.** That's correct. Beginners write code at minute
2 and then spend 30 minutes debugging a wrong approach.

---

## Step 1 — Restate the problem

Write one sentence in plain language. If you can't, you haven't understood it.

> **Bad:** "Two Sum — find two numbers."
> **Good:** "Given an unsorted array and a target, return the *indices* of the two elements that add to
> the target. Exactly one solution exists. I can't use the same element twice."

Things to explicitly nail down:
- What exactly is returned? A value? An index? A count? A boolean? A list?
- Is the input sorted? Can it contain duplicates? Negatives? Zero?
- Are there guarantees ("exactly one solution", "all values distinct")? **Guarantees are hints.**

---

## Step 2 — Work an example by hand

Take the given example. **Solve it on paper, slowly, as a human would.** Then ask:

> "What did I just do? Can I describe that as an algorithm?"

This sounds trivial. It is the single most underrated technique in problem solving. Your brain already
knows how to solve small instances; the job is to notice *what it did*.

Then make **your own** small examples:
- The smallest non-trivial input (n=1, n=2)
- One with duplicates
- One that's already sorted / already the answer
- One that's empty or null

---

## Step 3 — Say the brute force out loud

**Always.** Even when it's embarrassingly obvious.

> "Brute force: check every pair. Two nested loops. O(n²) time, O(1) space."

Two reasons this matters:
1. In an interview, a working brute force is worth far more than a half-finished optimal solution.
2. **The optimisation almost always comes from staring at the brute force** and asking:
   *"What am I recomputing?"*

---

## Step 4 — Optimise (the actual skill)

Now run these questions in order. Stop at the first that gives you traction.

### 4a. What is the brute force recomputing?

| If it recomputes... | Reach for... |
|---|---|
| The same subproblem repeatedly | **Memoisation / DP** |
| A sum over a shifting range | **Sliding window / prefix sum** |
| "Have I seen this before?" | **Hash map / set** |
| A min/max over a moving range | **Heap / monotonic deque** |

### 4b. Would sorting help?

Sorting costs O(n log n) — which is nearly free when the brute force is O(n²). Sorting unlocks:
- Two pointers from opposite ends
- Binary search
- Greedy choices (intervals, scheduling)
- Duplicate grouping (identical items become adjacent)

**Caveat:** if the problem asks for *original indices*, sorting destroys them. Sort `(value, index)` pairs.

### 4c. Can I trade space for time?

The universal move: **remember what you've seen in a hash map.** This is how Two Sum goes from O(n²) to
O(n) — instead of searching for the complement, you look it up.

### 4d. Can I go in the other direction?

Right-to-left, or backwards from the answer. Frequently fixes:
- "Product of array except self" (prefix from left, suffix from right)
- Many DP problems (defining `dp[i]` as "starting at i" instead of "ending at i")

### 4e. What does the constraint say?

Check [CHEATSHEET.md](../CHEATSHEET.md) Part 1. `n ≤ 20` screams bitmask. `n ≤ 10⁵` forbids O(n²).
The constraints are the problem-setter telling you the intended solution.

---

## Step 5 — Code

Now, and only now, type.

- **Name things well.** `left`, `right`, `window_start`, `count`, `seen`. Not `i`, `j`, `a`, `tmp`.
- **Write the invariant as a comment first.** e.g. `# window [l, r] contains at most k distinct chars`
  Then write code that maintains it. This is how you avoid off-by-one hell.
- **Handle the empty/null case first.** Get it out of the way in line 1.
- If you get lost, go back to your invariant. Code that violates its own invariant is the bug.

---

## Step 6 — Test

Do NOT hit Run. Dry-run it manually first.

1. Trace the given example, line by line, tracking every variable in a table on paper.
2. Then the edge cases: empty, single element, all identical, all distinct, already sorted, reversed.
3. Then check: **off-by-one**. Is it `<` or `<=`? `n` or `n-1`? This is where 70% of bugs live.

---

## The stuck protocol

Genuinely stuck? Run these, in order, spending 2 minutes each.

1. **Solve n=1, n=2, n=3 by hand and write the answers in a table.** Look for the relationship
   between row `i` and row `i-1`. This alone solves most DP problems.
2. **Draw it.** Array with indices. Tree. Graph. Timeline. Stop thinking in the abstract.
3. **Change the question.** "What if the array were sorted?" "What if I only had to return true/false
   instead of the actual answer?" "What if k were always 1?" Solve the easier version, then generalise.
4. **Name the shape.** Is this a *search*, a *count*, an *optimisation*, or an *enumeration*?
   - Search → binary search / BFS / DFS
   - Count → DP or combinatorics
   - Optimisation → DP or greedy
   - Enumeration → backtracking
5. **Go through the decision tree** in [CHEATSHEET.md](../CHEATSHEET.md) Part 2 branch by branch.
   Don't skip branches because they "feel wrong".

---

## Bug-hunting checklist

When your code is wrong and you can't see why:

- [ ] Off-by-one — `<` vs `<=`, `n` vs `n-1`, `range(n)` vs `range(n+1)`
- [ ] Empty input / single element
- [ ] Did I forget to *move* a pointer, causing an infinite loop?
- [ ] Did I mutate a list while iterating over it?
- [ ] In Python: is my default argument mutable? (`def f(x, acc=[])` ← classic bug)
- [ ] Did I append a **reference** instead of a **copy**? (`res.append(path)` vs `res.append(path[:])`)
  — this is *the* backtracking bug
- [ ] Integer division: `//` vs `/`
- [ ] Did I initialise `max` to `0` when the answer can be negative? Use `float('-inf')`
- [ ] Recursion base case: does it actually terminate for every path?
- [ ] Did I handle the case where the answer *is* the whole array / *is* the root / *is* empty?

---

## What to write after every problem

In `solutions/`, one file per problem, with this block at the bottom:

```
## Reflection
- Pattern:        [e.g. sliding window, variable size]
- Trigger I missed: [what in the statement should have told me? "longest substring with ..."]
- Where I got stuck: [one line]
- Time: 22 min · Needed hint: yes/no
```

**This block is the whole point.** In three weeks, reading 60 of these back is what converts
"I solved that once" into "I recognise this instantly."
