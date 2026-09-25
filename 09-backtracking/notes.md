# Backtracking — Notes

Systematic brute force with early abandonment. It's how you **enumerate** every valid configuration
without enumerating the invalid ones.

---

## The mental model

You're walking a **decision tree**. At each node you choose an option, walk deeper, and when you come
back you **undo** the choice so the next option starts from a clean state.

```
                    []
         /          |          \
      [1]          [2]         [3]
     /   \          |
 [1,2]  [1,3]    [2,3]
   |
[1,2,3]
```

**The three-line rhythm — this is the whole pattern:**

```python
for choice in options:
    make(choice)          # ① choose
    backtrack(...)        # ② explore
    unmake(choice)        # ③ un-choose  ← THE line people forget
```

Line ③ is what "backtracking" means. Without it, state from one branch leaks into its siblings.

---

## The universal template ⭐

```python
def solve(input):
    res = []
    path = []

    def backtrack(start_or_state):
        # ① BASE CASE — is this a complete solution?
        if is_complete(path):
            res.append(path[:])       # ⚠ COPY. `path` is mutated after this line.
            return

        # ② PRUNE — is this branch already hopeless?
        if is_invalid(path):
            return

        # ③ TRY each option
        for choice in options(start_or_state):
            if not is_valid(choice, path):
                continue              # constraint check

            path.append(choice)                     # choose
            backtrack(next_state(start_or_state, choice))   # explore
            path.pop()                              # un-choose

    backtrack(initial_state)
    return res
```

**Every backtracking problem is this template.** What changes is only:
- what `options()` returns,
- what `is_valid()` checks,
- what the base case is.

Write the template first, fill in the three holes second.

---

## `path[:]` — the #1 bug in this entire topic

```python
res.append(path)      # ❌ appends a REFERENCE. path is mutated later.
                      #    You end up with N identical (usually empty) lists.
res.append(path[:])   # ✅ appends a SNAPSHOT
```

Also written `list(path)` or `path.copy()`. If your backtracking output is a pile of empty lists,
this is why. Every time.

---

## Recognition triggers

| Statement says... | It's backtracking |
|---|---|
| "**all** possible ___" | ✅ |
| "**every** combination / permutation / subset" | ✅ |
| "**generate** all ___" | ✅ |
| "**enumerate**", "**list all**", "**print all**" | ✅ |
| "how many ways" **and n is tiny** (≤ 20) | ✅ (bigger n → DP) |
| "**partition** the string into ___" | ✅ |
| "find **a** valid arrangement" (N-Queens, Sudoku) | ✅ |
| "word search in a grid" | ✅ (DFS + undo) |

**The loudest signal is the constraint.** `n ≤ 10` or `n ≤ 20` in a problem that asks for
enumeration is the problem-setter telling you exponential is intended.

**Anti-trigger:** "how many ways" with `n = 10⁵` → that's DP counting, not enumeration. You can't
list 2^100000 things.

---

## Complexity (be able to state these)

| Problem shape | Time | Why |
|---|---|---|
| Subsets | O(n · 2ⁿ) | 2ⁿ subsets, O(n) to copy each |
| Permutations | O(n · n!) | n! permutations, O(n) to copy each |
| Combinations C(n,k) | O(k · C(n,k)) | |
| N-Queens | O(n!) | with pruning, far less in practice |
| Word Search | O(m · n · 4^L) | L = word length |

**Space** is O(depth) for the recursion stack plus O(n) for `path` — the output usually dominates.

---

## Pruning is the actual skill

Raw enumeration is easy. What separates a passing solution from a TLE is **cutting branches early**.

Three kinds of pruning, in rough order of value:

1. **Constraint pruning** — the partial solution already violates a rule. Return immediately.
   *N-Queens: don't place a queen on an attacked square; don't wait to check at depth n.*

2. **Bound pruning** — even the best completion of this branch can't beat the current answer.
   *Combination Sum: if `remaining < 0`, stop. If the array is sorted and `candidates[i] > remaining`,
   `break` instead of `continue` — every later candidate is bigger too.*

3. **Duplicate pruning** — this branch produces something a sibling already produced.
   *Sort first, then `if i > start and nums[i] == nums[i-1]: continue`.*

> **The `break` vs `continue` distinction matters.** On a sorted array, once a candidate is too large,
> so is every candidate after it — `break` prunes the whole remaining loop, `continue` prunes only one
> branch. This turns TLEs into accepted solutions.

---

## The duplicate-handling rule ⭐

The single most confusing part of this topic. Here's the rule that resolves it:

**Step 1: sort the input.** Always. This makes duplicates adjacent.

**Step 2: pick the right skip condition for your problem shape.**

```python
# For SUBSETS / COMBINATIONS (loop starts at `start`)
for i in range(start, len(nums)):
    if i > start and nums[i] == nums[i-1]:
        continue                        # skip duplicate at the SAME tree level
    ...

# For PERMUTATIONS (loop starts at 0, with a `used` array)
for i in range(len(nums)):
    if used[i]:
        continue
    if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
        continue                        # only use a duplicate if its twin was used first
    ...
```

**What `i > start` means:** "I'm not the first choice at this level." The first occurrence of a
duplicate value at a level is allowed; later ones would generate identical subtrees.

**What `not used[i-1]` means:** among equal values, enforce a canonical order — always consume the
earlier index first. That way `[1a, 1b]` is generated but `[1b, 1a]` never is.

Draw the decision tree for `[1, 1, 2]` once, marking which branches get cut. Fifteen minutes of that
is worth more than reading the rule ten times.

---

## Backtracking vs DFS vs DP

| | Backtracking | Plain DFS | DP |
|---|---|---|---|
| Goal | Enumerate all solutions | Visit all nodes | Optimise / count |
| Undoes state | **Yes** | Usually not | N/A |
| Revisits states | Yes (different paths) | No (`visited` set) | No (memoised) |
| Typical complexity | Exponential | O(V+E) | Polynomial |

> **The relationship worth knowing:** backtracking + memoisation = DP. When a backtracking solution
> revisits the *same subproblem* (not just the same node) many times, caching the result turns
> exponential into polynomial. That's exactly how Word Break and Coin Change get solved.
>
> Conversely: if the problem wants *every solution listed*, memoisation can't help — you have to
> generate them all, and exponential is the true cost.

---

## Files here

- [pattern-subsets-and-combinations.md](pattern-subsets-and-combinations.md)
- [pattern-permutations.md](pattern-permutations.md)
- [problems.md](problems.md)
