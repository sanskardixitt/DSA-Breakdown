# Binary Search — Notes

Everyone "knows" binary search. Almost nobody writes it without off-by-one bugs under pressure.
This file fixes that, then generalises it far beyond "find x in a sorted array."

---

## The real definition

> Binary search works on any **monotone predicate** over an ordered search space.

Not "sorted array". A *monotone predicate* is a yes/no test that, once it flips, never flips back:

```
index:      0  1  2  3  4  5  6  7
predicate:  F  F  F  F  T  T  T  T
                        ↑
              find this boundary
```

Binary search finds that boundary in O(log n). The array being sorted is just the most common way to
get such a predicate — it is not the requirement.

**This reframe is what unlocks the medium/hard problems.** Once you look for "the boundary of a
monotone yes/no test" instead of "a value in a sorted array", problems like Koko Eating Bananas and
Split Array Largest Sum become obvious.

---

## Template 1 — Exact match (the classic)

```python
def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1          # inclusive on both ends
    while lo <= hi:                    # ← <= because lo == hi is a valid 1-element range
        mid = lo + (hi - lo) // 2      # overflow-safe form (habit; Python doesn't overflow)
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1               # ← must be mid+1, not mid
        else:
            hi = mid - 1               # ← must be mid-1, not mid
    return -1
```

**The three rules that keep it correct:**
1. `hi = len - 1` (inclusive) pairs with `while lo <= hi`.
2. Both branches move past `mid` (`mid+1` / `mid-1`) — the range **must** shrink every iteration,
   or you get an infinite loop.
3. When the loop exits, `lo > hi`, and `lo` is the insertion point.

---

## Template 2 — Find the boundary (`lo < hi`) ⭐ use this one most

This is the version that handles "first true", "last false", "leftmost", "smallest valid" — which is
most real problems.

```python
def find_first_true(lo, hi, predicate):
    # invariant: the answer is always inside [lo, hi]
    while lo < hi:                     # ← strict <
        mid = (lo + hi) // 2           # floor → biased LEFT
        if predicate(mid):
            hi = mid                   # mid might be the answer → keep it
        else:
            lo = mid + 1               # mid is definitely not → discard it
    return lo                          # lo == hi == the boundary
```

**Why this is safer:** exactly one branch keeps `mid`, and it's the `hi = mid` branch, which pairs
correctly with the left-biased `mid`. There is no "return inside the loop", so no missed cases.

> ⚠ **The infinite-loop rule.** If you ever write `lo = mid` (instead of `mid + 1`), you must use
> `mid = (lo + hi + 1) // 2` — right-biased — or the loop hangs when `hi = lo + 1`.
>
> Pair them: `hi = mid` ⟷ `mid = (lo+hi)//2` · `lo = mid` ⟷ `mid = (lo+hi+1)//2`.
> Getting this wrong is the single most common binary-search bug.

---

## Template 3 — Just use `bisect`

```python
import bisect
bisect.bisect_left(a, x)     # first index i with a[i] >= x
bisect.bisect_right(a, x)    # first index i with a[i] >  x
```
Perfect for "insertion position", "count of elements < x", "does x exist" (`i < len(a) and a[i] == x`).

Use it when it fits. But write Template 2 by hand at least ten times — interviewers usually want to
see the loop.

---

## How to choose a template

| Question | Template |
|---|---|
| "Does `x` exist / at what index?" | 1 (or `bisect`) |
| "First/last index satisfying ___" | 2 |
| "Smallest/largest value that works" | 2 (binary search on the answer) |
| "Insertion position" | `bisect_left` |
| "Search in a rotated array" | 1, with a rotation-aware branch |
| "Peak element" / local maximum | 2, comparing `nums[mid]` to `nums[mid+1]` |

---

## Recognition triggers

- The array is **sorted** (explicitly, or after you sort it)
- The array is **rotated sorted**
- "**Find the minimum/maximum** X such that ___ is possible" ← binary search on the answer
- Constraints have a huge value range (10⁹) but a small array — you're searching *values*, not indices
- "in **O(log n)**" stated in the problem
- The answer is a **number in a known range**, and you can *check* a candidate in O(n)
- "**peak**", "**pivot**", "**rotation point**", "**first bad version**"

---

## Binary search on the answer (the big one)

The pattern that converts hard optimisation problems into easy ones.

> If you can write `can_do(x) -> bool` that is **monotone** in `x`, you can binary search for the
> smallest (or largest) `x` where it's true.

→ Full treatment in [pattern-binary-search-on-answer.md](pattern-binary-search-on-answer.md)

---

## The rotated-array family

A rotated sorted array like `[4,5,6,7,0,1,2]` isn't monotone — but **one of its two halves always is**.
That's enough.

```python
def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid

        if nums[lo] <= nums[mid]:              # LEFT half is sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1                   # target is in the sorted left half
            else:
                lo = mid + 1
        else:                                   # RIGHT half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1
```

**The method:** at each step, determine *which half is sorted* (compare `nums[lo]` to `nums[mid]`),
then check whether the target lies inside that sorted half's range. If yes, go there. If no, go to the
other half. Always ask "which half is sorted?" first — never try to reason about both at once.

Finding the minimum in a rotated array is the cleaner cousin:
```python
def find_min(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1        # min is strictly right of mid
        else:
            hi = mid            # min is at mid or left of it
    return nums[lo]
```
> Compare against `nums[hi]`, **not** `nums[lo]`. Comparing to `lo` fails on a non-rotated array.
> This is the classic trap in LC 153.

---

## Traps

```python
# ❌ Infinite loop — range doesn't shrink
while lo < hi:
    mid = (lo + hi) // 2
    if cond: lo = mid          # mid == lo when hi == lo+1 → hangs

# ❌ Wrong loop condition for the bounds style
lo, hi = 0, len(nums)          # exclusive hi
while lo <= hi:                # ← should be `<` for exclusive hi
    ...

# ❌ Searching indices when you should search VALUES
#    "minimum eating speed" — the answer is a speed (1..max_pile), not an index

# ❌ Forgetting duplicates break the rotated-array logic
#    With duplicates (LC 81), `nums[lo] == nums[mid]` is ambiguous → lo += 1, worst case O(n)
```

**The debugging routine:** when your binary search is wrong, hand-trace `n = 1`, `n = 2`, and
`n = 3`. Almost every bug shows up at `n = 2`, where `mid` collapses to `lo`.

---

## Files here

- [pattern-search-space.md](pattern-search-space.md) — boundary search, first/last occurrence, 2-D
- [pattern-binary-search-on-answer.md](pattern-binary-search-on-answer.md) — the optimisation pattern
- [problems.md](problems.md)
