# Arrays & Hashing — Notes

The foundation. ~40% of all interview problems are arrays + a hash map. If you get fluent here, a large
chunk of the difficulty of everything else disappears.

---

## Mental model: the hash map is "memory"

The single most important idea in this entire topic:

> **A hash map lets you remember what you've already seen, so you never have to look back through
> the array again.**

Every nested loop where the inner loop is *searching for something you've already passed* can be
replaced by a hash map lookup. That's O(n²) → O(n), and it's the most common optimisation in interviews.

```python
# ❌ O(n²) — inner loop searches backwards
for i in range(n):
    for j in range(i):
        if arr[j] == target - arr[i]:
            return [j, i]

# ✅ O(n) — the map IS the backward search
seen = {}                      # value -> index
for i, x in enumerate(arr):
    if target - x in seen:     # "have I already passed the complement?"
        return [seen[target-x], i]
    seen[x] = i
```

Whenever you catch yourself writing an inner loop over earlier elements, stop and ask:
**"What would I need to have remembered to skip this loop?"** Then put that in a dict.

---

## The four things hash maps are for

| Goal | Structure | Example |
|---|---|---|
| "Have I seen X?" | `set` | Contains Duplicate |
| "How many times does X appear?" | `Counter` / `defaultdict(int)` | Valid Anagram, Top K Frequent |
| "Where did X appear?" | `dict: value -> index` | Two Sum |
| "Which things share a property?" | `defaultdict(list)` keyed by that property | Group Anagrams |

The 4th one — **grouping by a derived key** — is the one people miss. The trick is always:
*"What canonical form do all members of a group share?"*

- Anagrams → sorted string, or a 26-tuple of counts
- Points on the same line → the slope
- Strings with the same shape → normalised difference pattern

---

## Arrays: what they actually are

A contiguous block of memory. That's why:
- `arr[i]` is O(1) — the address is just `base + i * size`.
- Inserting in the middle is O(n) — everything after has to shift.
- Iterating is *fast* in practice (cache locality), much faster than a linked list of the same length,
  even though both are "O(n)".

**Dynamic arrays** (Python `list`, Java `ArrayList`, C++ `vector`) add automatic resizing: when full,
allocate 2× and copy. This makes `append` **O(1) amortised** (see foundations).

---

## In-place array techniques

When the problem says **"O(1) extra space"** or **"modify in place"**, you have three moves:

### 1. Two pointers — read and write
```python
# Remove all zeros, in place
write = 0
for read in range(len(nums)):
    if nums[read] != 0:
        nums[write] = nums[read]
        write += 1
# everything from `write` onward is now junk
```

### 2. The array itself as a hash map
When values are guaranteed to be in `[1, n]` or `[0, n-1]`, the **index is the key**.

```python
# Find all numbers that appear twice, O(1) space
# Trick: use the SIGN of arr[|x|-1] as a "seen" flag
res = []
for x in nums:
    i = abs(x) - 1
    if nums[i] < 0:
        res.append(abs(x))     # already flagged → duplicate
    else:
        nums[i] = -nums[i]     # flag it
```

This "index as hash" trick shows up in: Find All Duplicates, First Missing Positive, Find All Numbers
Disappeared. **Recognition trigger: "values are in range [1, n]" + "O(1) space".**

### 3. Reversal
```python
def reverse(a, i, j):
    while i < j:
        a[i], a[j] = a[j], a[i]
        i += 1; j -= 1

# Rotate array right by k, in O(1) space
k %= len(nums)
reverse(nums, 0, len(nums)-1)
reverse(nums, 0, k-1)
reverse(nums, k, len(nums)-1)
```

---

## Sorting as a preprocessing step

Sorting costs O(n log n), which is basically free when your brute force is O(n²). It unlocks:

- **Duplicates become adjacent** → dedupe in one pass
- **Two pointers from opposite ends** become valid
- **Binary search** becomes possible
- **Greedy** choices become provable (intervals, scheduling)

> ⚠ If the answer requires *original indices*, sorting destroys them. Sort `(value, index)` pairs, or
> use a hash map instead.

---

## Common traps

```python
# ❌ Mutating a list while iterating over it
for x in arr:
    if x < 0: arr.remove(x)      # skips elements, silently wrong
# ✅
arr = [x for x in arr if x >= 0]

# ❌ Aliasing 2-D grids
grid = [[0]*3]*3
grid[0][0] = 1       # → [[1,0,0],[1,0,0],[1,0,0]]  all rows are the same object
# ✅
grid = [[0]*3 for _ in range(3)]

# ❌ Initialising max to 0 when values can be negative
best = 0
# ✅
best = float('-inf')

# ❌ `x in list` inside a loop → O(n²)
# ✅ use a set
```

---

## Patterns in this folder

- [pattern-hashmap-counting.md](pattern-hashmap-counting.md) — counting, grouping, complement lookup
- [pattern-prefix-sum.md](pattern-prefix-sum.md) — range sums, "subarrays that sum to k"

Then work through [problems.md](problems.md).
