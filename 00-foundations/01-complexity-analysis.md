# 01 — Complexity Analysis (Big-O, properly)

You probably "know" Big-O. The goal here is to make it a **tool you use while solving**, not a thing you
state after finishing.

---

## The one-sentence definition

> Big-O describes how the **number of operations grows** as the input grows — ignoring constants and
> lower-order terms.

We drop constants because we care about *shape*, not exact speed. O(2n) and O(500n) are both O(n),
because as `n → ∞` the *shape* is a straight line either way.

---

## Reading complexity off code

The mechanical rule: **count how many times the innermost line runs, in terms of n.**

```python
# O(1) — runs a fixed number of times regardless of n
def first(arr):
    return arr[0] if arr else None

# O(n) — one pass
def total(arr):
    s = 0
    for x in arr:      # n iterations
        s += x         # O(1) work
    return s

# O(n²) — nested over the same input
def has_pair(arr, target):
    for i in range(len(arr)):          # n
        for j in range(i+1, len(arr)):  # ~n/2 on average → still O(n²)
            if arr[i] + arr[j] == target:
                return True
    return False

# O(n log n) — sort dominates the linear pass
def dedupe_sorted(arr):
    arr.sort()                 # O(n log n)   ← dominant
    out = []
    for x in arr:              # O(n)
        if not out or out[-1] != x:
            out.append(x)
    return out                 # total: O(n log n)

# O(log n) — the search space halves each step
def bsearch(arr, t):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == t: return mid
        if arr[mid] < t: lo = mid + 1
        else: hi = mid - 1
    return -1

# O(2ⁿ) — two recursive calls per level, depth n
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)
```

### The "where does log n come from?" intuition

**log n appears whenever you repeatedly divide the problem in half.**

`n → n/2 → n/4 → ... → 1` takes log₂(n) steps. For n = 1,000,000 that's only **20 steps**.

That's why binary search is so absurdly good, and why "sort it first" is almost always affordable.

| n | log₂ n | n log₂ n | n² |
|---|---|---|---|
| 10 | 3 | 33 | 100 |
| 1,000 | 10 | 10,000 | 1,000,000 |
| 1,000,000 | 20 | 20,000,000 | 10¹² ❌ |

---

## The growth-rate ladder (memorise this order)

```
O(1) < O(log n) < O(√n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)
 ↑ instant                    ↑ the good zone         ↑ danger    ↑ only for tiny n
```

**The mental line to draw:** everything up to `O(n log n)` scales to a million. Everything from `O(n²)`
onward does not. When you see `n = 10⁵` in the constraints, your job is to get *below* the O(n²) line.

---

## Space complexity — the part people forget

Space = **extra** memory you allocate, not counting the input.

```python
def squares_bad(arr):
    return [x*x for x in arr]      # O(n) space — new list

def squares_good(arr):
    for i in range(len(arr)):
        arr[i] *= arr[i]           # O(1) space — in place
    return arr
```

**Recursion costs space.** Each call frame sits on the stack.

```python
def dfs(node):
    if not node: return 0
    return 1 + max(dfs(node.left), dfs(node.right))
# Space: O(h) where h = tree height.
# Balanced tree → O(log n). Degenerate "linked-list" tree → O(n).
```

> ⚠ **Python's default recursion limit is 1000.** A skewed tree/list with n = 10⁵ will
> `RecursionError`. Either convert to iterative, or `sys.setrecursionlimit(10**6)`.

---

## Amortised complexity (the thing that confuses people)

`list.append()` is **O(1) amortised**, not O(1) worst case.

Python's list keeps spare capacity. Most appends just write into a free slot: O(1). Occasionally the
array is full, so it allocates a bigger block and copies everything: O(n).

But the resizes double the capacity, so they get rarer and rarer. Across n appends, the total copy work
sums to ~2n. Divided over n appends → **O(1) each on average**.

Same logic applies to Union-Find with path compression, and to the dynamic array behind most
"vector"/"ArrayList" types.

---

## Common complexity traps in Python

```python
# ❌ TRAP 1: `in` on a list is O(n)
seen = []
for x in arr:
    if x in seen:      # O(n) → whole loop is O(n²)
        ...
    seen.append(x)

# ✅ FIX: use a set
seen = set()
for x in arr:
    if x in seen:      # O(1) → whole loop is O(n)
        ...
    seen.add(x)


# ❌ TRAP 2: string concatenation in a loop
s = ""
for c in chars:
    s += c             # each += copies the whole string → O(n²)

# ✅ FIX:
s = "".join(chars)     # O(n)


# ❌ TRAP 3: pop(0) on a list
while queue:
    x = queue.pop(0)   # O(n) shift → BFS becomes O(n²)

# ✅ FIX:
from collections import deque
queue = deque()
x = queue.popleft()    # O(1)


# ❌ TRAP 4: slicing inside a loop
for i in range(n):
    if arr[i:i+k] == pattern:   # O(k) copy each time

# ✅ FIX: compare in place, or use a rolling hash / window counter


# ❌ TRAP 5: max()/sum() inside a loop over the same data
for i in range(n):
    if arr[i] == max(arr):      # O(n) each iteration → O(n²)

# ✅ FIX: compute max(arr) once, before the loop
```

---

## Analysing recursion: the recursion tree

For a recursive function, ask two things:
1. **How many nodes are in the call tree?** (branching factor ^ depth)
2. **How much work per node?**

Multiply them.

```python
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)
```
Branching = 2, depth = n, work per node = O(1) → **O(2ⁿ)**.

```python
def merge_sort(a):
    if len(a) <= 1: return a
    mid = len(a)//2
    L, R = merge_sort(a[:mid]), merge_sort(a[mid:])
    return merge(L, R)          # O(n) work
```
Branching = 2, but each level's *total* input is n, and depth = log n → **O(n log n)**.

> **The key difference:** in `fib`, subproblem size shrinks by 1 (depth n). In `merge_sort`, it shrinks
> by *half* (depth log n). "Shrink by a constant amount" → exponential. "Shrink by a constant factor" →
> logarithmic. That distinction is worth internalising.

---

## Practice: state the complexity

Cover the answers and try these.

```python
# 1
for i in range(n):
    for j in range(n):
        for k in range(n):
            pass
# → O(n³)

# 2
i = n
while i > 0:
    i //= 2
# → O(log n)

# 3
for i in range(n):
    j = 1
    while j < n:
        j *= 2
# → O(n log n)

# 4
for i in range(n):
    for j in range(i, n):
        pass
# → O(n²)  (n + (n-1) + ... + 1 = n(n+1)/2)

# 5
def f(s):                 # s is a string of length n
    return s == s[::-1]
# → O(n) time, O(n) space (the reversed copy)

# 6
for i in range(n):
    arr.sort()
# → O(n² log n)   ← the classic "sort inside a loop" disaster
```

---

## Checklist — use this on every problem

Before you write a single line of code:

- [ ] What is `n`? Look at the constraints.
- [ ] What complexity is the constraint *asking* for? (see [CHEATSHEET.md](../CHEATSHEET.md) Part 1)
- [ ] What's my brute force, and what's its complexity?
- [ ] What's my target complexity?
- [ ] What's my space budget? Is O(1) space required?

If you can answer these five, you almost always know which pattern to use.
