# Pattern — Binary Search Over an Index Space

Finding boundaries, not just values.

---

## The mental reframe

Stop thinking "find `target`". Start thinking:

> **"Paint each index red (predicate false) or green (predicate true). All reds come before all greens.
> Find the first green."**

Once you can write the predicate, the code is always the same five lines.

```python
lo, hi = 0, n - 1
while lo < hi:
    mid = (lo + hi) // 2
    if predicate(mid): hi = mid
    else:              lo = mid + 1
return lo
```

The entire skill is **defining `predicate` so the F...FT...T shape holds.**

---

## Example 1 — First and Last Position of an Element

> Find the start and end indices of `target` in a sorted array. O(log n).

Two boundary searches with two different predicates.

```python
def search_range(nums, target):
    def lower_bound(t):
        """first index with nums[i] >= t"""
        lo, hi = 0, len(nums)             # hi is EXCLUSIVE here
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] >= t: hi = mid
            else:              lo = mid + 1
        return lo

    start = lower_bound(target)
    if start == len(nums) or nums[start] != target:
        return [-1, -1]
    end = lower_bound(target + 1) - 1      # first index > target, minus one
    return [start, end]
```

> **The trick worth stealing:** `last_occurrence(t) = lower_bound(t+1) - 1`. Write `lower_bound` once
> and you get `upper_bound`, `count of t`, and both endpoints for free — no second, subtly different
> loop to get wrong.
>
> `count of t = lower_bound(t+1) - lower_bound(t)`.

Note the **exclusive `hi = len(nums)`** here. It's needed because the answer may be "past the end"
(target larger than everything). With an inclusive `hi = len-1`, that case is unreachable.

---

## Example 2 — Search a 2-D Matrix

> Each row is sorted, and the first element of each row is greater than the last of the previous row.

**Insight: it's one sorted array pretending to be a matrix.** Flatten the index.

```python
def search_matrix(matrix, target):
    if not matrix or not matrix[0]:
        return False
    R, C = len(matrix), len(matrix[0])

    lo, hi = 0, R * C - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        val = matrix[mid // C][mid % C]     # ← the index mapping
        if val == target:   return True
        elif val < target:  lo = mid + 1
        else:               hi = mid - 1
    return False
```
**O(log(R·C)).**

`row = idx // C`, `col = idx % C`. Memorise this mapping — it appears constantly.

> **Different problem, different technique:** LC 240 (*Search a 2D Matrix II*) only guarantees rows
> and columns are individually sorted — flattening is invalid. There, start at the **top-right**
> corner and walk: too big → move left, too small → move down. O(R + C). Recognising which of the two
> matrix problems you're in is the actual test.

---

## Example 3 — Find Peak Element

> `nums[i] != nums[i+1]`. Return the index of *any* element greater than both neighbours. O(log n).

There's no sorted order at all — yet binary search works, because there's still a monotone predicate.

```python
def find_peak_element(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < nums[mid + 1]:
            lo = mid + 1        # we're on an upslope → a peak exists to the right
        else:
            hi = mid            # downslope (or peak) → a peak exists at mid or to the left
    return lo
```

**Why it's correct:** if `nums[mid] < nums[mid+1]`, you're climbing. Keep climbing and you must
eventually hit a peak (the array boundary counts as `-∞`). So a peak is guaranteed in `[mid+1, hi]`.
Symmetrically for the other branch. The predicate "a peak exists to my right" is monotone.

> **This is the example to remember when someone says "binary search needs a sorted array."** It
> doesn't. It needs a monotone predicate.

---

## Example 4 — Find Minimum in Rotated Sorted Array

```python
def find_min(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1        # the pivot (min) is strictly to the right
        else:
            hi = mid            # min is at mid or to the left
    return nums[lo]
```

The predicate is `nums[mid] <= nums[hi]` ⇒ "the minimum is at or left of mid". Monotone. ✅

**Why compare to `hi` and not `lo`:**
On a *non-rotated* array `[1,2,3,4,5]`, `nums[mid]=3 > nums[lo]=1` would push `lo` right — wrong,
the answer is index 0. Comparing to `hi` handles rotated and non-rotated uniformly. This exact
mistake is the most common failure on LC 153.

---

## Example 5 — Median of Two Sorted Arrays 🔴

> O(log(min(m, n))) required.

Binary search on **how many elements to take from the smaller array**.

```python
def find_median_sorted_arrays(A, B):
    if len(A) > len(B):
        A, B = B, A                       # always binary search the smaller one
    m, n = len(A), len(B)
    half = (m + n + 1) // 2               # size of the left partition

    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2                # take i elements from A
        j = half - i                      # take j elements from B

        Aleft  = A[i-1] if i > 0 else float('-inf')
        Aright = A[i]   if i < m else float('inf')
        Bleft  = B[j-1] if j > 0 else float('-inf')
        Bright = B[j]   if j < n else float('inf')

        if Aleft <= Bright and Bleft <= Aright:          # correct partition found
            if (m + n) % 2:
                return max(Aleft, Bleft)                 # odd total
            return (max(Aleft, Bleft) + min(Aright, Bright)) / 2
        elif Aleft > Bright:
            hi = i - 1                                   # took too many from A
        else:
            lo = i + 1                                   # took too few from A
    return 0.0
```

**The idea:** a median splits both arrays into a combined left half and right half of (nearly) equal
size, where *everything left ≤ everything right*. Fix how many come from A; the count from B follows.
Then just check the two cross-boundary conditions.

> Genuinely hard. Attempt it, understand the partition idea, and move on — don't let it eat a day.
> The *transferable* lesson is "binary search on a partition point", which also solves
> **Kth element of two sorted arrays**.

---

## Practice: write the predicate first

For each, state the predicate before coding:

| Problem | Predicate `p(i)` |
|---|---|
| First Bad Version | `isBadVersion(i)` |
| Search Insert Position | `nums[i] >= target` |
| First occurrence of target | `nums[i] >= target` |
| Last occurrence of target | `nums[i] > target`, then −1 |
| Find Peak Element | "a peak exists at index ≥ i" |
| Find Min in Rotated | `nums[i] <= nums[-1]` |

If you can fill in that column, the code writes itself.
