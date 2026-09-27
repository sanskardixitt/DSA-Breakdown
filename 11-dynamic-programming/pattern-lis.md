# Pattern — Longest Increasing Subsequence (LIS)

A DP shape where `dp[i]` means "the best answer **ending exactly at** `i`" — and the final answer is
`max(dp)`, not `dp[n-1]`.

---

## How do I know to use this?

- "**longest increasing / decreasing subsequence**"
- "**maximum number of items** you can chain" (each fits into the next)
- "**Russian doll envelopes**", "box stacking", "chain of pairs"
- "minimum number of ___ to remove to make it sorted" (= `n − LIS`)
- "maximum height/length by stacking with a constraint"
- Any "pick a subsequence satisfying a pairwise ordering condition, maximise its length"

---

## The O(n²) DP — understand this one first

**`dp[i]` = the length of the longest increasing subsequence that *ends at index i*.**

That "ends at" is the crucial part. It's what makes the recurrence local: to extend a subsequence with
`nums[i]`, you only need to know the best subsequence ending at some earlier, smaller element.

```python
def length_of_lis(nums):
    n = len(nums)
    dp = [1] * n                          # every element alone is a subsequence of length 1

    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:         # can we extend the subsequence ending at j?
                dp[i] = max(dp[i], dp[j] + 1)

    return max(dp)                        # ⭐ MAX over all, not dp[n-1]
```
**O(n²) time, O(n) space.**

### Trace on `[10, 9, 2, 5, 3, 7, 101, 18]`

| i | nums[i] | dp[i] | reasoning |
|---|---|---|---|
| 0 | 10 | 1 | nothing before it |
| 1 | 9 | 1 | 10 > 9, can't extend |
| 2 | 2 | 1 | |
| 3 | 5 | 2 | extends 2 |
| 4 | 3 | 2 | extends 2 |
| 5 | 7 | 3 | extends 2,5 or 2,3 |
| 6 | 101 | 4 | extends 2,5,7 |
| 7 | 18 | 4 | extends 2,5,7 |

`max(dp) = 4`. ✅

> **`max(dp)` vs `dp[n-1]` is the thing to notice.** In House Robber, `dp[i]` means "best over the
> whole prefix" so the answer is the last cell. Here `dp[i]` means "best *ending at* i", so the answer
> is the max. **Whenever your state is "ending exactly at i", the answer is `max(dp)`.**
> This distinction resolves a lot of "my DP is right but the answer is wrong" confusion.

---

## The O(n log n) version — patience sorting ⭐

```python
import bisect

def length_of_lis(nums):
    tails = []          # tails[k] = the SMALLEST possible tail of an increasing subseq of length k+1
    for x in nums:
        i = bisect.bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)               # x extends the longest subsequence found so far
        else:
            tails[i] = x                  # x becomes a better (smaller) tail for length i+1
    return len(tails)
```
**O(n log n) time, O(n) space.** Nine lines.

### What `tails` actually is (and what it is NOT)

> ⚠ **`tails` is not the LIS.** It's a bookkeeping array where `tails[k]` is the *smallest possible
> tail value* among all increasing subsequences of length `k+1`.

Its **length** is the LIS length, but its **contents** may not be a real subsequence of the input.

**Why keeping the smallest tail is right:** a smaller tail is never worse. Any future element that
could extend a subsequence ending in a larger tail could also extend one ending in a smaller tail.
So greedily minimising each tail keeps every option open. It's a greedy strategy proven optimal by an
exchange argument.

`tails` is always sorted (each length's minimal tail is larger than the previous length's), which is
what makes binary search valid.

### Trace on `[10, 9, 2, 5, 3, 7, 101, 18]`

| x | action | tails |
|---|---|---|
| 10 | append | `[10]` |
| 9 | replace index 0 | `[9]` |
| 2 | replace index 0 | `[2]` |
| 5 | append | `[2,5]` |
| 3 | replace index 1 | `[2,3]` |
| 7 | append | `[2,3,7]` |
| 101 | append | `[2,3,7,101]` |
| 18 | replace index 3 | `[2,3,7,18]` |

`len(tails) = 4`. ✅ (And note `[2,3,7,18]` *is* a valid LIS here — but that's a coincidence, not a
guarantee.)

### `bisect_left` vs `bisect_right`

| Want | Use |
|---|---|
| **Strictly** increasing (no duplicates allowed) | `bisect_left` |
| **Non-decreasing** (duplicates allowed) | `bisect_right` |

`bisect_left` finds the first element `>= x` and replaces it, so an equal element gets overwritten
rather than appended — enforcing strictness. One character, completely different semantics. Check
which the problem wants.

---

## Reconstructing the actual subsequence

If you need the elements, not just the length, use the O(n²) DP with a parent array:

```python
def lis_sequence(nums):
    n = len(nums)
    dp = [1] * n
    parent = [-1] * n

    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                parent[i] = j

    best = max(range(n), key=lambda i: dp[i])
    seq = []
    while best != -1:
        seq.append(nums[best])
        best = parent[best]
    return seq[::-1]
```

> **The parent-pointer technique generalises to every DP** where you need the actual solution and not
> just its value: record *which choice* produced each optimum, then walk the pointers backwards.
> Same idea reconstructs the edit script in Edit Distance and the item set in knapsack.

---

## Variants

### Number of Longest Increasing Subsequences (LC 673)
Track both length **and** count:
```python
length = [1] * n
count  = [1] * n
for i in range(n):
    for j in range(i):
        if nums[j] < nums[i]:
            if length[j] + 1 > length[i]:
                length[i] = length[j] + 1
                count[i]  = count[j]           # found a longer one → inherit its count
            elif length[j] + 1 == length[i]:
                count[i] += count[j]           # tie → accumulate counts
```
> **The "track value + count together" pattern** appears whenever a problem asks "how many optimal
> solutions are there?" Reset the count on a strict improvement, accumulate it on a tie. Getting that
> distinction right is the entire problem.

### Russian Doll Envelopes (LC 354) 🔴
> Envelope `(w, h)` fits inside `(W, H)` if `w < W` **and** `h < H`. Maximise nesting.

```python
def max_envelopes(envelopes):
    # sort by width ASC, and by height DESC within the same width
    envelopes.sort(key=lambda e: (e[0], -e[1]))
    return length_of_lis([h for _, h in envelopes])
```

**The `-e[1]` is the entire problem.** Sorting heights *descending* within equal widths guarantees
that two envelopes of the same width can never both be picked by the LIS — because their heights are
in decreasing order, so LIS can only take one. Without it you'd wrongly nest `(3,4)` inside `(3,5)`.

> **The general technique: sort on one dimension to reduce a 2-D problem to a 1-D LIS.** The tiebreak
> direction is where all the subtlety lives. Same trick appears in Maximum Height by Stacking Cuboids
> and Best Team With No Conflicts.

### Longest Increasing Path in a Matrix (LC 329) 🔴
DFS + memoisation on the grid — `memo[r][c]` = the longest increasing path starting at `(r,c)`.
No `visited` set is needed: the strictly-increasing condition makes cycles impossible, so the grid is
implicitly a DAG.

### Maximum Length of Pair Chain (LC 646)
Sort by the **second** element and greedily take non-overlapping pairs — the same greedy as
Non-overlapping Intervals. O(n log n), and *simpler* than LIS.

> Worth noting: not every "chain" problem needs LIS. When the ordering is one-dimensional and
> intervals don't nest, greedy wins. Check for the simpler solution before reaching for DP.

---

## Related "ending at i" problems

The `dp[i] = best ending at i` shape isn't unique to LIS:

| Problem | `dp[i]` means | Answer |
|---|---|---|
| LIS | longest increasing subseq ending at i | `max(dp)` |
| Maximum Subarray (Kadane) | max subarray sum ending at i | `max(dp)` |
| Maximum Product Subarray | max product ending at i | `max(dp)` |
| Longest Arithmetic Subsequence | longest AP ending at i (per difference) | `max` over all |
| Longest Common **Substring** | longest common suffix ending at (i,j) | `max` over the table |

**They all return `max(dp)`.** Spotting the "ending at i" shape tells you immediately where the answer
lives — and that's a surprisingly frequent source of otherwise-correct-but-failing solutions.

---

## Debug checklist

- [ ] Is `dp[i]` "ending at i" or "over the whole prefix"? Answer = `max(dp)` or `dp[n-1]` accordingly.
- [ ] Initialise `dp` to 1, not 0 (every element is its own subsequence of length 1).
- [ ] Strictly increasing or non-decreasing? `bisect_left` or `bisect_right`?
- [ ] For 2-D variants, is the sort tiebreak direction correct?
- [ ] Need the actual sequence? Add parent pointers.
