# Dynamic Programming — Notes

DP has a reputation for being magic. It isn't. Here's the demystified version:

> **DP = recursion + remembering answers you've already computed.**

That's the whole thing. If you can write a recursive brute force, you can write the DP — add a cache
and you're done. Everything else (tabulation, space optimisation) is refinement.

---

## The two preconditions

A problem is DP if and only if both hold:

1. **Optimal substructure** — the optimal answer is built from optimal answers to subproblems.
2. **Overlapping subproblems** — the same subproblem is solved many times in the naive recursion.

> Without #2 it's just divide and conquer (merge sort has #1 but not #2 — the halves never overlap).
> Without #1, greedy and DP both fail and you need full enumeration.

---

## The three-step method (follow this literally)

### Step 1 — Write the brute-force recursion

Don't think about DP yet. Just answer: *"what choice do I make at this step, and what's left over?"*

```python
# Climbing Stairs: I can take 1 or 2 steps. How many ways to reach step n?
def climb(n):
    if n < 0: return 0
    if n == 0: return 1        # one way to be "done"
    return climb(n - 1) + climb(n - 2)
```
O(2ⁿ). Correct, unusably slow.

### Step 2 — Add memoisation (top-down DP)

```python
from functools import cache

@cache
def climb(n):
    if n < 0: return 0
    if n == 0: return 1
    return climb(n - 1) + climb(n - 2)
```
O(n). **You just wrote a DP solution.** One decorator.

### Step 3 — Convert to tabulation (bottom-up), if you want

```python
def climb(n):
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        dp[i] = dp[i-1] + (dp[i-2] if i >= 2 else 0)
    return dp[n]
```
Then space-optimise, since only the last two values are ever used:
```python
def climb(n):
    a, b = 1, 1                # dp[i-2], dp[i-1]
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```
O(n) time, **O(1) space**.

> **In an interview: do steps 1 and 2, state that step 3 is possible, then do it if there's time.**
> Getting a correct memoised solution is worth far more than a half-finished tabulation.
> **When practising: always do all three.** Step 3 is where the understanding gets tested.

---

## Top-down vs bottom-up

| | Top-down (memo) | Bottom-up (tabulation) |
|---|---|---|
| Written as | recursion + cache | loops filling an array |
| Easier to derive | **✅ much** | needs the order figured out first |
| Computes | only the states you need | all states |
| Space optimisation | hard | **easy** |
| Stack overflow risk | ⚠ yes | no |
| Best for | sparse state spaces, complex transitions | dense states, when you want O(1) space |

**Recommendation: derive top-down, then convert if you need the space.** Deriving bottom-up directly
means figuring out the evaluation order before you understand the recurrence, which is backwards.

---

## The four questions to define any DP

Answer these, in this order, **on paper**, before writing code:

1. **What is a *state*?** What arguments does the recursive function need? → this becomes your dp index
2. **What does `dp[state]` *mean*?** Write it as an English sentence. This is the step people skip
   and it's the one that matters most.
3. **What is the *transition*?** How does `dp[state]` build from smaller states?
4. **What are the *base cases*?** And what's the answer — `dp[n]`? `max(dp)`? `dp[n][m]`?

> **Write the meaning of `dp[i]` as a comment, in words, before writing any code.**
> `# dp[i] = the maximum money robbable from houses 0..i`
> If you can't write that sentence, you don't have the recurrence yet and coding will not help.
> Nine out of ten DP bugs are actually an unclear definition of the state.

---

## Recognition triggers

| Statement says... | Likely DP |
|---|---|
| "**maximum** / **minimum** ___ " over a sequence of choices | ✅ |
| "**how many ways** to ___" (with large n) | ✅ counting DP |
| "**can you** reach / make / partition ___" | ✅ boolean DP |
| "**longest** / **shortest** **subsequence**" | ✅ (subsequence ⇒ DP; substring ⇒ maybe window) |
| "minimum cost to ___" | ✅ or greedy |
| Choices at each step affect later options | ✅ |
| "with **at most** k operations/transactions" | ✅ (k becomes a state dimension) |
| Constraint `n ≤ 1000` and it smells quadratic | ✅ 2-D DP |
| Constraint `n ≤ 20` and "how many ways" | ✅ bitmask DP |

**Anti-triggers (not DP):**
- A provably correct greedy choice exists → greedy, and it's simpler.
- "list all solutions" → backtracking; you can't compress an enumeration.
- Contiguous subarray + all positive → sliding window.

> **The DP-vs-greedy test:** *"If I make the locally best choice now, could that ever lock me out of a
> better overall answer?"*
> - **Yes** → DP (you must consider both branches).
> - **No, provably** → greedy.
>
> Coin Change with coins `[1, 3, 4]` and target `6`: greedy takes 4+1+1 = 3 coins. Optimal is
> 3+3 = 2 coins. Greedy fails → DP. **Memorise this counterexample** — it's the cleanest way to
> explain why Coin Change isn't greedy.

---

## The pattern families

| Family | State | Classic problems | File |
|---|---|---|---|
| **1-D linear** | `dp[i]` = answer for prefix ending at i | Climbing Stairs, House Robber | [pattern-1d-dp.md](pattern-1d-dp.md) |
| **2-D grid** | `dp[r][c]` = answer to reach (r,c) | Unique Paths, Min Path Sum | [pattern-2d-grid-dp.md](pattern-2d-grid-dp.md) |
| **Two sequences** | `dp[i][j]` = answer for `a[:i]` and `b[:j]` | LCS, Edit Distance | [pattern-string-dp.md](pattern-string-dp.md) |
| **Knapsack** | `dp[i][capacity]` | Coin Change, Partition Subset | [pattern-knapsack.md](pattern-knapsack.md) |
| **LIS** | `dp[i]` = best ending exactly at i | LIS, Russian Dolls | [pattern-lis.md](pattern-lis.md) |
| **Interval** | `dp[i][j]` = answer for the range i..j | Burst Balloons, Matrix Chain | (advanced) |
| **Bitmask** | `dp[mask]` = answer for a subset | TSP, Partition to K Subsets | (advanced) |

---

## Common complexities

| Shape | Time | Space |
|---|---|---|
| 1-D, O(1) transition | O(n) | O(n) → O(1) |
| 1-D, O(n) transition (LIS) | O(n²) | O(n) |
| 2-D grid | O(m·n) | O(m·n) → O(n) |
| Two strings | O(m·n) | O(m·n) → O(n) |
| Knapsack | O(n·W) | O(n·W) → O(W) |
| Interval | O(n³) | O(n²) |
| Bitmask | O(2ⁿ·n) | O(2ⁿ) |

> **Knapsack's O(n·W) is *pseudo*-polynomial** — it's polynomial in the *value* W, not in the number
> of bits needed to write W. That's why the subset-sum problem is NP-complete despite this "efficient"
> algorithm. Worth being able to say if asked.

---

## The space-optimisation trick

If `dp[i]` only depends on `dp[i-1]` and `dp[i-2]`, you don't need the array.

```python
# From this:
dp = [0] * n
for i in range(2, n):
    dp[i] = max(dp[i-1], dp[i-2] + nums[i])
return dp[-1]

# To this:
prev2, prev1 = 0, 0
for x in nums:
    prev2, prev1 = prev1, max(prev1, prev2 + x)
return prev1
```

Same for 2-D → 1-D: if `dp[i][j]` depends only on row `i-1`, keep one row.

> ⚠ **The iteration direction matters when reusing a single row.** For 0/1 knapsack you must iterate
> capacity **backwards**, or you'd reuse an item within the same pass. For unbounded knapsack you
> iterate **forwards**, precisely *because* you want that reuse. This is covered in detail in
> [pattern-knapsack.md](pattern-knapsack.md) — it's the subtlest thing in DP and worth real attention.

---

## Debugging DP

1. **Print the table.** For small inputs, print `dp` and read it. The wrong value's position tells you
   which transition is broken.
2. **Compute the table by hand** for n = 3 or 4, then compare with your code's output, cell by cell.
3. **Check the base cases separately.** They're wrong more often than the recurrence.
4. **Verify against brute force.** Write the O(2ⁿ) recursion, run both on random small inputs, diff.
   This catches subtle recurrence errors that eyeballing never will.
5. **Re-read your `dp[i]` sentence.** If your code doesn't match the sentence, one of them is wrong.

---

## The mindset shift

The people who find DP hard are trying to think about the *whole* solution at once.

**Don't.** Think about **one decision**:
- "At house `i`, I either rob it or I don't."
- "At character `i`, these two either match or they don't."
- "For coin `c`, I either use it or I skip it."

Then assume the recursion handles everything after that decision. **Trust the recursion** — the same
discipline you learned on trees. That's the whole skill.
