# Pattern — Binary Search On The Answer ⭐

The highest-leverage pattern in this entire folder. It converts "find the optimal X" into
"check whether X works" — and checking is almost always easy.

---

## How do I know to use this?

Fire this pattern when you see:

- "**minimum** ___ such that ___ is possible"
- "**maximum** ___ such that ___ is possible"
- "**minimise the maximum**" / "**maximise the minimum**" ← the loudest signal there is
- "smallest **speed** / **capacity** / **size** / **time** / **distance** to achieve X"
- "split the array into k parts, minimising the largest part"
- The answer is a **number in a known range**, and the array is small-ish but the value range is huge

**The decisive test:** ask yourself —

> *"If someone handed me a candidate answer `x`, could I check in O(n) whether it works?"*

If yes, and if "works" is monotone in `x`, binary search it.

---

## The template

```python
def solve(...):
    def can_do(x) -> bool:
        """Is x a feasible answer? Must be MONOTONE in x."""
        ...

    lo, hi = <smallest possible answer>, <largest possible answer>
    while lo < hi:
        mid = (lo + hi) // 2
        if can_do(mid):
            hi = mid            # mid works → maybe something smaller does too
        else:
            lo = mid + 1        # mid fails → need bigger
    return lo
```

**Total complexity = O(cost of `can_do` × log(range)).** Since `log(10⁹) ≈ 30`, an O(n) checker gives
you O(30n) — effectively linear.

### Three things to nail down every time

1. **What exactly is the answer?** A speed? A capacity? A length? Name it. This is where people go
   wrong: they binary search an *index* when the answer is a *value*.
2. **What are `lo` and `hi`?** The tightest provable bounds. Getting these wrong is a correctness bug,
   not just a slowness issue.
3. **Is `can_do` monotone, and in which direction?**
   - "minimise" → `F F F T T T`, find the first T → `hi = mid` on success.
   - "maximise" → `T T T F F F`, find the last T → flip the branches and use `mid = (lo+hi+1)//2`.

---

## Example 1 — Koko Eating Bananas 🟡

> Piles of bananas, `h` hours. Koko eats `k` bananas/hour, finishing at most one pile per hour
> (leftover time in an hour is wasted). Find the **minimum** `k` to finish within `h` hours.

**Step 1 — what's the answer?** An eating speed `k`.

**Step 2 — bounds?** `lo = 1` (must eat something). `hi = max(piles)` (eating faster than the biggest
pile gains nothing — you still take 1 hour per pile).

**Step 3 — the checker.** At speed `k`, pile `p` takes `ceil(p / k)` hours.

```python
import math

def min_eating_speed(piles, h):
    def hours_needed(k):
        return sum(math.ceil(p / k) for p in piles)
        # or, avoiding floats:  sum((p + k - 1) // k for p in piles)

    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if hours_needed(mid) <= h:
            hi = mid            # mid is fast enough → try slower
        else:
            lo = mid + 1        # too slow → must go faster
    return lo
```
**O(n log(max(piles))).**

**Monotonicity check:** faster speed ⟹ fewer or equal hours. So `hours_needed(k) <= h` is
`F F F T T T` in `k`. ✅ Valid.

> **Use `(p + k - 1) // k` instead of `math.ceil(p / k)`.** Float division on large integers can lose
> precision. Integer ceiling division is exact and is the idiom interviewers expect.

---

## Example 2 — Capacity To Ship Packages Within D Days 🟡

> Ship weights in order, within `days` days. Find the **minimum ship capacity**.

**Bounds:**
- `lo = max(weights)` — the ship must at minimum carry the heaviest single package.
- `hi = sum(weights)` — one day, everything at once.

Getting `lo = max(weights)` right (not `lo = 1`) is the interesting part: with a smaller capacity the
problem is *infeasible*, not just slow.

```python
def ship_within_days(weights, days):
    def days_needed(cap):
        d, load = 1, 0
        for w in weights:
            if load + w > cap:
                d += 1          # start a new day
                load = 0
            load += w
        return d

    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if days_needed(mid) <= days:
            hi = mid
        else:
            lo = mid + 1
    return lo
```

> **Split Array Largest Sum (LC 410) is literally the same code.** So is *Divide Chocolate*, so is
> *Minimum Number of Days to Make m Bouquets*. Once you see the shape, a whole family collapses into
> one template.

---

## Example 3 — Minimum Number of Days to Make m Bouquets 🟡

> `bloomDay[i]` = day flower `i` blooms. A bouquet needs `k` **adjacent** bloomed flowers.
> Find the earliest day you can make `m` bouquets.

**Answer:** a day number. `lo = min(bloomDay)`, `hi = max(bloomDay)`.

```python
def min_days(bloomDay, m, k):
    if m * k > len(bloomDay):
        return -1                       # not enough flowers, ever

    def bouquets_by(day):
        count = run = 0
        for b in bloomDay:
            if b <= day:
                run += 1
                if run == k:
                    count += 1
                    run = 0             # consume this bouquet
            else:
                run = 0                 # streak broken
        return count

    lo, hi = min(bloomDay), max(bloomDay)
    while lo < hi:
        mid = (lo + hi) // 2
        if bouquets_by(mid) >= m:
            hi = mid
        else:
            lo = mid + 1
    return lo
```

Monotone: waiting longer never *reduces* the number of bouquets. ✅

---

## Example 4 — "Maximise the minimum" (branch flip)

> **Magnetic Force Between Two Balls (LC 1552):** place `m` balls in given positions to
> **maximise the minimum** gap between any two.

Now the predicate is `T T T F F F` (small gaps are achievable, large ones aren't) and we want the
**last** true. Flip the branches — and remember to bias `mid` right.

```python
def max_distance(position, m):
    position.sort()

    def can_place(gap):
        count, last = 1, position[0]
        for p in position[1:]:
            if p - last >= gap:
                count += 1
                last = p
        return count >= m

    lo, hi = 1, position[-1] - position[0]
    while lo < hi:
        mid = (lo + hi + 1) // 2        # ⚠ RIGHT-biased, because lo = mid below
        if can_place(mid):
            lo = mid                    # gap works → try bigger
        else:
            hi = mid - 1
    return lo
```

> **The pairing rule, again:** `lo = mid` **requires** `mid = (lo + hi + 1) // 2`.
> With the left-biased `mid`, `lo = mid` hangs forever when `hi == lo + 1`. Write the two lines
> together as a unit and you'll never hit it.

---

## Recognising it in the wild

| Problem | The "answer" being searched | `can_do(x)` |
|---|---|---|
| Koko Eating Bananas | eating speed | hours at speed x ≤ h |
| Ship Packages in D Days | ship capacity | days at capacity x ≤ D |
| Split Array Largest Sum | the largest allowed subarray sum | pieces needed ≤ k |
| Minimum Days to Make Bouquets | a day number | bouquets by day x ≥ m |
| Magnetic Force Between Balls | minimum gap | can place m balls with gap ≥ x |
| Kth Smallest in a Sorted Matrix | a value | count of elements ≤ x is ≥ k |
| Minimize Max Distance to Gas Station | a distance | stations needed ≤ k |
| Sqrt(x) | the root | `x*x <= n` |

Notice the pattern in the last column: **the checker is always a simple greedy sweep.** That's the
tell. If a problem feels like "I'd need DP for this optimisation, but a greedy check would be easy" —
you're looking at binary search on the answer.

---

## Debug checklist

- [ ] Am I searching **values** or **indices**? (Usually values.)
- [ ] Are `lo` and `hi` provably tight and correct? Is `lo` genuinely feasible-or-below?
- [ ] Is `can_do` actually **monotone**? Test x = lo, x = hi by hand.
- [ ] Minimise → `hi = mid` with `mid = (lo+hi)//2`. Maximise → `lo = mid` with `mid = (lo+hi+1)//2`.
- [ ] Does the loop terminate at `n = 2` (`hi == lo + 1`)? Trace it.
- [ ] Is there an infeasible case needing an early `return -1`?
