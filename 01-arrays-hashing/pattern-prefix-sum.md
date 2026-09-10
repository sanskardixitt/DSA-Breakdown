# Pattern — Prefix Sum (+ Hash Map)

The technique that turns "sum of every subarray" from O(n²) into O(n).

---

## How do I know to use this?

- "**sum of a subarray**" / "**range sum**" / "**sum between index i and j**"
- "**how many subarrays sum to K**"
- "**subarray with sum divisible by K**"
- "**longest subarray with sum equal to K**" (note: with negatives — sliding window would **fail**)
- Queries: "answer many range-sum queries efficiently"
- Anything where you'd otherwise recompute a running total from scratch for each start index

> **The disambiguation you need:**
> - All numbers **non-negative** + asking for longest/shortest → **sliding window**
> - Numbers can be **negative**, or you need a **count** of subarrays → **prefix sum + hash map**
>
> Sliding window breaks with negatives because shrinking the window no longer reliably decreases the sum.

---

## The core idea

Define `P[i]` = sum of the first `i` elements (so `P[0] = 0`).

```
nums:      [ 3,  4,  7,  2,  -3,  1 ]
P:       [0, 3,  7, 14, 16,  13, 14 ]
index:    0  1   2   3   4    5   6
```

Then the sum of `nums[i..j]` (inclusive) is:

```
sum(i..j) = P[j+1] - P[i]
```

That's it. **Any range sum becomes one subtraction, in O(1), after O(n) preprocessing.**

```python
def build_prefix(nums):
    P = [0] * (len(nums) + 1)
    for i, x in enumerate(nums):
        P[i+1] = P[i] + x
    return P

# or: from itertools import accumulate;  P = [0] + list(accumulate(nums))
```

> **Always use the size `n+1` version with `P[0] = 0`.** The `n`-sized version forces an `if i == 0`
> special case into every formula and is where off-by-one bugs come from.

---

## The killer combination: prefix sum + hash map

### Problem: Subarray Sum Equals K
> Count the number of contiguous subarrays whose sum equals `k`. Numbers can be negative.

**Brute force:** every (i, j) pair → O(n²).

**The reframe.** We want to count pairs `(i, j)` with:
```
P[j] - P[i] = k        ⟺        P[i] = P[j] - k
```
So while sweeping `j`, the question becomes: **"how many earlier prefix sums equal `P[j] - k`?"**

That's a complement lookup — exactly the Two Sum trick, on prefix sums.

```python
from collections import defaultdict

def subarray_sum(nums, k):
    count = defaultdict(int)
    count[0] = 1          # ⚠ CRITICAL: the empty prefix. Handles subarrays starting at index 0.
    running = 0
    res = 0

    for x in nums:
        running += x
        res += count[running - k]   # how many earlier prefixes make a valid subarray ending here
        count[running] += 1         # register this prefix for future j's

    return res
```
**Time O(n), Space O(n).**

### Trace: `nums = [1, 2, 3]`, `k = 3`

| x | running | need = running−k | count[need] | res | count after |
|---|---|---|---|---|---|
| — | 0 | — | — | 0 | `{0:1}` |
| 1 | 1 | −2 | 0 | 0 | `{0:1, 1:1}` |
| 2 | 3 | 0 | **1** | 1 | `{0:1, 1:1, 3:1}` |
| 3 | 6 | 3 | **1** | 2 | `{0:1,1:1,3:1,6:1}` |

Answer **2** — the subarrays `[1,2]` and `[3]`. ✅

> **Why `count[0] = 1`?** Without it, a subarray that starts at index 0 (like `[1,2]`, whose prefix sum
> `3` equals `k` outright) has no earlier prefix to pair with. The `0` entry represents the empty prefix
> *before* the array. Forgetting this line is the #1 bug in this pattern.

---

## Variants (same skeleton, different key)

### Longest subarray summing to K
Store the **first** index at which each prefix sum occurred (earliest → longest span).

```python
def longest_subarray_sum_k(nums, k):
    first = {0: -1}        # prefix sum -> earliest index
    running = 0
    best = 0
    for i, x in enumerate(nums):
        running += x
        if running - k in first:
            best = max(best, i - first[running - k])
        if running not in first:      # ⚠ only record the FIRST occurrence
            first[running] = i
    return best
```

> Counting → `defaultdict(int)`, increment always.
> Longest → `dict`, record **first** occurrence only.
> Shortest → record **latest** occurrence.

### Subarray sum divisible by K
`sum(i..j) % k == 0  ⟺  P[j] % k == P[i] % k`. So key the map on the **remainder**.

```python
def subarrays_div_by_k(nums, k):
    count = defaultdict(int)
    count[0] = 1
    running = 0
    res = 0
    for x in nums:
        running = (running + x) % k    # Python's % is already non-negative for positive k ✅
        res += count[running]
        count[running] += 1
    return res
```

### Contiguous Array (equal 0s and 1s)
Map `0 → -1`, `1 → +1`. Then "equal counts" becomes "sum == 0", i.e. two equal prefix sums.

```python
def find_max_length(nums):
    first = {0: -1}
    running = 0
    best = 0
    for i, x in enumerate(nums):
        running += 1 if x == 1 else -1
        if running in first:
            best = max(best, i - first[running])
        else:
            first[running] = i
    return best
```

> **The remap trick — "turn a balance condition into a sum condition" — is broadly reusable.**
> Same idea solves: equal number of a/b/c characters, balanced parentheses depth, "same number of
> vowels and consonants".

---

## 2-D prefix sum (matrix range sum)

`P[r][c]` = sum of the rectangle from `(0,0)` to `(r-1, c-1)`.

```python
def build_2d(mat):
    R, C = len(mat), len(mat[0])
    P = [[0]*(C+1) for _ in range(R+1)]
    for r in range(R):
        for c in range(C):
            P[r+1][c+1] = mat[r][c] + P[r][c+1] + P[r+1][c] - P[r][c]
    return P

def region_sum(P, r1, c1, r2, c2):        # inclusive corners
    return P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]
```

**Inclusion–exclusion:** add the two overlapping rectangles, then add back the doubly-subtracted corner.
Draw it once on paper and the ± signs stop being mysterious.

---

## Difference array (the inverse trick)

When you need many **range updates** and one final read — the mirror image of prefix sum.

```python
# "Add val to every index in [l, r]" — many times, then read the final array
diff = [0] * (n + 1)
for l, r, val in updates:
    diff[l]   += val
    diff[r+1] -= val
result = list(accumulate(diff[:n]))     # prefix sum of diff gives the final array
```
Turns O(q·n) into O(q + n). **Trigger: "range update, query at the end", "car pooling", "corporate
flight bookings", "meeting rooms as a timeline".**

---

## Template summary

```python
# 1-D prefix array (O(1) range queries)
P = [0] + list(accumulate(nums))
range_sum = P[j+1] - P[i]

# Count subarrays with sum == k
count = defaultdict(int); count[0] = 1
running = res = 0
for x in nums:
    running += x
    res += count[running - k]
    count[running] += 1

# Longest subarray with sum == k
first = {0: -1}; running = best = 0
for i, x in enumerate(nums):
    running += x
    if running - k in first: best = max(best, i - first[running-k])
    if running not in first: first[running] = i
```

---

## Traps

- **Forgetting `count[0] = 1` / `first[0] = -1`.** Breaks every subarray starting at index 0.
- For "longest", overwriting the stored index instead of keeping the first one.
- Using sliding window when negatives are present. It will pass small tests and fail hidden ones.
- Off-by-one from using an `n`-sized prefix array instead of `n+1`.
- In the divisible-by-k variant, forgetting to normalise negative remainders — a non-issue in Python,
  but a real bug in Java/C++ (`((x % k) + k) % k`).
