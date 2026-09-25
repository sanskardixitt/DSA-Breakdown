# Pattern — Subsets & Combinations

The `start` index family. **Order doesn't matter**, so we never look backwards.

---

## The key structural idea

> **Subsets and combinations use a `start` index; permutations use a `used` array.**

Why: in a combination, `[1,2]` and `[2,1]` are the same thing. Passing `i + 1` as the next `start`
means each element can only be chosen *after* the ones before it — which enforces a canonical
increasing order and eliminates duplicates by construction.

Get this one distinction and half of backtracking is done.

---

## Subsets (LC 78)

> All `2ⁿ` subsets of a distinct-element array.

```python
def subsets(nums):
    res = []
    path = []

    def backtrack(start):
        res.append(path[:])              # ⭐ EVERY node is a valid subset — record on arrival
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1)             # i+1: never reconsider earlier elements
            path.pop()

    backtrack(0)
    return res
```

**Note where the recording happens:** at the *top* of the function, not in a base case. Every node of
the decision tree is itself a valid answer — that's what makes subsets different from combinations.

### The tree for `[1,2,3]`
```
                       []
         ┌──────────────┼──────────────┐
       [1]            [2]            [3]
     ┌───┴───┐          │
  [1,2]    [1,3]     [2,3]
     │
 [1,2,3]
```
8 nodes = 2³ subsets. ✅

### Alternative framing — the include/exclude tree
```python
def subsets(nums):
    res = []
    path = []
    def backtrack(i):
        if i == len(nums):
            res.append(path[:])
            return
        path.append(nums[i]); backtrack(i + 1); path.pop()   # include nums[i]
        backtrack(i + 1)                                      # exclude nums[i]
    backtrack(0)
    return res
```
Same output, different shape: a strict binary tree with answers only at the leaves. Worth knowing both
— the include/exclude framing is what generalises to knapsack DP.

### Bitmask version (no recursion)
```python
def subsets(nums):
    n = len(nums)
    return [[nums[i] for i in range(n) if mask >> i & 1]
            for mask in range(1 << n)]
```
Each of the `2ⁿ` masks is one subset — bit `i` set means "include `nums[i]`". Elegant, and the entry
point to bitmask DP. Only viable for `n ≤ 20`.

---

## Subsets II — with duplicates (LC 90)

```python
def subsets_with_dup(nums):
    nums.sort()                          # ⭐ ① sort so duplicates are adjacent
    res, path = [], []

    def backtrack(start):
        res.append(path[:])
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i-1]:    # ⭐ ② skip duplicates at this level
                continue
            path.append(nums[i])
            backtrack(i + 1)
            path.pop()

    backtrack(0)
    return res
```

### Why `i > start` and not `i > 0`

Consider `nums = [1, 1, 2]`:

- At the root (`start = 0`): `i = 0` picks the first `1` ✅. `i = 1` is a second `1` at the *same
  level* — it would generate an identical subtree. Skip it. Here `i > start` is true, so we skip. ✅
- Inside the branch that already took `nums[0]` (`start = 1`): `i = 1` picks the second `1`, giving
  `[1,1]`. That's a **legitimate** subset, not a duplicate. Here `i == start`, so we don't skip. ✅

**`i > start` distinguishes "a duplicate *sibling*" (skip) from "a duplicate *descendant*" (keep).**
Using `i > 0` would wrongly kill `[1,1]`.

---

## Combinations (LC 77)

> All `k`-sized combinations from `1..n`.

```python
def combine(n, k):
    res, path = [], []

    def backtrack(start):
        if len(path) == k:               # base case: complete
            res.append(path[:])
            return
        # pruning: we need (k - len(path)) more; only start values that leave enough room
        need = k - len(path)
        for i in range(start, n - need + 2):
            path.append(i)
            backtrack(i + 1)
            path.pop()

    backtrack(1)
    return res
```

> **The bound `n - need + 2`** is the pruning. If you need 3 more elements and only 2 remain, there's
> no point descending. Without it the code is still correct, just slower. Derive it: the last valid
> starting value is `n - need + 1`, and `range` is exclusive, hence `+2`.

---

## Combination Sum (LC 39) — reuse allowed

> Distinct candidates, each usable **unlimited** times. Find all combinations summing to `target`.

```python
def combination_sum(candidates, target):
    candidates.sort()                    # enables the `break` prune
    res, path = [], []

    def backtrack(start, remaining):
        if remaining == 0:
            res.append(path[:])
            return

        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break                    # ⭐ sorted → every later one is bigger too
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i])   # ⭐ `i`, not i+1 → reuse allowed
            path.pop()

    backtrack(0, target)
    return res
```

**The single character that defines this problem:** `backtrack(i, ...)` instead of `backtrack(i+1, ...)`.
Passing `i` lets the same element be chosen again. Passing `i+1` forbids it.

| Recursion call | Meaning |
|---|---|
| `backtrack(i + 1)` | each element used **at most once** |
| `backtrack(i)` | each element used **unlimited** times |
| `backtrack(start)` (unchanged) | ⚠ infinite loop — never do this |

---

## Combination Sum II (LC 40) — each element once, with duplicates

Combines both rules: `i + 1` (no reuse) **and** the duplicate skip.

```python
def combination_sum2(candidates, target):
    candidates.sort()
    res, path = [], []

    def backtrack(start, remaining):
        if remaining == 0:
            res.append(path[:])
            return

        for i in range(start, len(candidates)):
            if i > start and candidates[i] == candidates[i-1]:
                continue                 # duplicate sibling
            if candidates[i] > remaining:
                break                    # bound prune
            path.append(candidates[i])
            backtrack(i + 1, remaining - candidates[i])   # no reuse
            path.pop()

    backtrack(0, target)
    return res
```

---

## The family, side by side

| Problem | Elements | Duplicates in input | Recursive call | Duplicate skip |
|---|---|---|---|---|
| Subsets (78) | distinct | no | `i + 1` | — |
| Subsets II (90) | distinct | **yes** | `i + 1` | ✅ |
| Combinations (77) | distinct | no | `i + 1` | — |
| Combination Sum (39) | distinct, **reusable** | no | **`i`** | — |
| Combination Sum II (40) | each once | **yes** | `i + 1` | ✅ |
| Combination Sum III (216) | 1–9, each once | no | `i + 1` | — |

**Memorise this table.** Six problems, two independent switches (`i` vs `i+1`, skip vs no-skip).
Once you see it as a 2×2 grid, they stop being six separate things to remember.

---

## Palindrome Partitioning (LC 131) — the same idea on strings

> Partition `s` so every piece is a palindrome. Return all partitions.

The "choice" is *where to cut*, and `start` becomes a string index.

```python
def partition(s):
    res, path = [], []

    def is_pal(l, r):
        while l < r:
            if s[l] != s[r]: return False
            l += 1; r -= 1
        return True

    def backtrack(start):
        if start == len(s):              # consumed the whole string
            res.append(path[:])
            return
        for end in range(start, len(s)):
            if is_pal(start, end):       # only cut here if the piece is a palindrome
                path.append(s[start:end+1])
                backtrack(end + 1)
                path.pop()

    backtrack(0)
    return res
```

> **The reframe worth taking away:** "partition a string" = "choose a set of cut positions" = a
> combination problem where `start` is a string index rather than an array index. Same template,
> different domain.
>
> Same shape solves: Restore IP Addresses, Word Break II, Split Array into Fibonacci Sequence.

---

## Debug checklist

- [ ] Am I appending `path[:]` and not `path`?
- [ ] Is there a matching `path.pop()` for every `path.append()`?
- [ ] `i + 1` (use once) or `i` (reuse)? Never the unchanged `start`.
- [ ] Did I **sort** before applying the duplicate skip?
- [ ] Is the skip `i > start` (not `i > 0`)?
- [ ] Is `break` correct here, or does it need to be `continue`? (`break` only on sorted input.)
- [ ] Does the base case `return` after recording?
