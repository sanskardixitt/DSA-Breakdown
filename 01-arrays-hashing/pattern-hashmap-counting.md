# Pattern — Hash Map: Counting, Grouping & Complement Lookup

---

## How do I know to use this?

Fire this pattern when the problem statement contains any of:

- "**duplicate**" / "**appears twice**" / "**unique**"
- "**anagram**" / "**permutation of**" / "**rearrange to form**"
- "**frequency**" / "**most common**" / "**K most frequent**"
- "**two numbers that sum to**" (complement lookup)
- "**group**" / "**categorise**" the items by some property
- "**first non-repeating**" / "**first unique**"
- You're about to write a nested loop where the inner loop searches **earlier** elements

The unifying signal: **you need to know something about an element you've already passed, and you don't
want to walk back to find it.**

---

## The three sub-patterns

### A. Complement lookup — "does the partner exist?"

You're looking for a pair `(a, b)` where `b` is determined by `a` (`b = target - a`, `b = a * 2`, etc.).

```python
def two_sum(nums, target):
    seen = {}                          # value -> index
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:               # partner already passed
            return [seen[need], i]
        seen[x] = i                    # register self for future partners
    return []
```

**The key insight:** you don't search *forward* for the partner. You register yourself and let a
*later* element find *you*. That flips O(n²) into O(n).

> Order matters: check `need in seen` **before** `seen[x] = i`. Otherwise `target = 6, x = 3` matches
> itself.

---

### B. Frequency counting — "how many of each?"

```python
from collections import Counter

def is_anagram(s, t):
    return len(s) == len(t) and Counter(s) == Counter(t)
```

Or manually, when you want the 26-array version (O(1) space, faster constant):
```python
def is_anagram(s, t):
    if len(s) != len(t): return False
    freq = [0] * 26
    for a, b in zip(s, t):
        freq[ord(a) - ord('a')] += 1
        freq[ord(b) - ord('a')] -= 1
    return all(v == 0 for v in freq)
```

**The "add for one, subtract for the other, check all zero" trick** is worth remembering. It works for
any two-multiset-equality question and generalises to sliding windows.

---

### C. Grouping by a canonical key — "what do these share?"

```python
from collections import defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    for w in strs:
        key = tuple(sorted(w))         # canonical form
        groups[key].append(w)
    return list(groups.values())
```
*O(n · k log k)* where k = word length.

Faster key — a 26-tuple of counts, avoiding the sort:
```python
def group_anagrams(strs):
    groups = defaultdict(list)
    for w in strs:
        cnt = [0] * 26
        for c in w:
            cnt[ord(c) - ord('a')] += 1
        groups[tuple(cnt)].append(w)   # ⚠ must be a tuple — lists aren't hashable
    return list(groups.values())
```
*O(n · k)*

**The question to ask:** *"What's the fingerprint that all members of a group share, and nothing else does?"*

| Grouping question | Canonical key |
|---|---|
| Anagrams | `tuple(sorted(word))` or count tuple |
| Points on the same line through origin | reduced slope `(dy//g, dx//g)` |
| Strings with the same shift pattern | tuple of consecutive char differences |
| Numbers with the same digit sum | `sum(int(d) for d in str(n))` |
| Cells in the same 3×3 sudoku box | `(r // 3, c // 3)` |

---

## Worked example: Longest Consecutive Sequence

> Given an unsorted array, return the length of the longest run of consecutive integers. **O(n) required**
> (so you can't sort).

**Brute force:** for each x, walk x, x+1, x+2... checking membership. O(n²) worst case — because you
re-walk the same run from every one of its members.

**The insight:** only start walking from a number that is the **start of a run** — i.e. a number `x`
where `x - 1` is *not* in the set. That way each run is walked exactly once, so total work is O(n).

```python
def longest_consecutive(nums):
    s = set(nums)
    best = 0
    for x in s:
        if x - 1 in s:            # not a run start → skip, someone else handles it
            continue
        length = 1
        while x + length in s:    # walk the run
            length += 1
        best = max(best, length)
    return best
```
**Time O(n), Space O(n).**

> Why is this O(n) and not O(n²)? The inner `while` only runs for run-starts, and across all runs the
> total steps equal the total number of elements. Each element is visited by the while loop at most once.
>
> **This "only process from the canonical starting point" idea recurs everywhere.** It's the same
> reasoning that makes monotonic stacks and union-find amortised-linear.

---

## Worked example: Top K Frequent Elements

**Approach 1 — heap:** `Counter` then a size-K heap. O(n log k).
```python
def top_k_frequent(nums, k):
    return [x for x, _ in Counter(nums).most_common(k)]
```

**Approach 2 — bucket sort, O(n).** This is the one interviewers want.

**Insight:** a frequency can be at most `n`. So make `n+1` buckets indexed by frequency, drop each
number into its bucket, then sweep from the high end.

```python
def top_k_frequent(nums, k):
    count = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]   # buckets[f] = numbers with frequency f
    for num, freq in count.items():
        buckets[freq].append(num)

    res = []
    for freq in range(len(buckets) - 1, 0, -1):    # high frequency → low
        for num in buckets[freq]:
            res.append(num)
            if len(res) == k:
                return res
```
**Time O(n), Space O(n).**

> **Generalisable trick:** when the *values you'd sort by* are bounded by n, bucket sort beats
> comparison sort. Applies to: Top K Frequent, Sort Colors, H-Index, Relative Sort Array.

---

## Worked example: Product of Array Except Self

> Return an array where `out[i]` = product of all elements except `nums[i]`. **No division allowed**,
> O(n) time.

**Insight:** `out[i] = (product of everything left of i) × (product of everything right of i)`.
Compute both with two sweeps.

```python
def product_except_self(nums):
    n = len(nums)
    out = [1] * n

    prefix = 1
    for i in range(n):              # left → right
        out[i] = prefix             # product of everything before i
        prefix *= nums[i]

    suffix = 1
    for i in range(n - 1, -1, -1):  # right → left
        out[i] *= suffix            # multiply in everything after i
        suffix *= nums[i]

    return out
```
**Time O(n), Space O(1) extra** (output doesn't count).

Trace on `[1,2,3,4]`:
```
after left pass:   out = [1, 1, 2,  6]     (prefix products)
after right pass:  out = [24, 12, 8, 6]    (× suffix products)
```

> **Trigger for the two-sweep idea:** "the answer at position i depends on both sides of i." Also
> solves: Trapping Rain Water (O(n) space version), Candy, Best Time to Buy and Sell Stock III.

---

## Template summary

```python
# Seen-before
seen = set()
for x in arr:
    if x in seen: ...
    seen.add(x)

# Complement
seen = {}
for i, x in enumerate(arr):
    if target - x in seen: return [seen[target-x], i]
    seen[x] = i

# Count
count = Counter(arr)

# Group by derived key
groups = defaultdict(list)
for item in arr:
    groups[canonical_key(item)].append(item)

# Bucket by frequency (O(n) top-k)
buckets = [[] for _ in range(n+1)]
for val, f in Counter(arr).items():
    buckets[f].append(val)
```

---

## Traps

- Registering yourself in the map **before** checking → element matches itself.
- Using a `list` as a dict key → `TypeError: unhashable`. Use `tuple`.
- Forgetting that `Counter` equality ignores order (that's the point) but is O(k) to compare.
- Assuming dict iteration order is sorted. It's **insertion order** in Python 3.7+, not sorted.
