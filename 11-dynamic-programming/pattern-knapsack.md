# Pattern — The Knapsack Family

The most transferable DP family. Master these two variants and a dozen problems collapse into one.

---

## How do I know to use this?

- "select items to **maximise value** within a **capacity/budget**"
- "**can you make** exactly amount X from these values?"
- "**fewest coins** to make an amount"
- "**how many ways** to make an amount"
- "**partition** into two subsets with equal sum"
- "assign `+`/`−` signs to reach a target"
- Generally: **a set of items, a budget, and a choice of take-or-skip per item**

---

## The two variants — this distinction is everything

| | **0/1 knapsack** | **Unbounded knapsack** |
|---|---|---|
| Each item used | at most **once** | **unlimited** times |
| Recursion advances | `i + 1` | `i` (stay on the same item) |
| 1-D loop direction | **backwards** over capacity | **forwards** over capacity |
| Examples | Partition Equal Subset, Target Sum, Last Stone Weight II | Coin Change, Coin Change II, Rod Cutting |

> ⭐ **The loop-direction rule is the single subtlest thing in DP.** Read the explanation below twice.
> It's also the thing interviewers probe when they want to know if you understand DP or memorised it.

---

## Why the loop direction differs

Consider the 1-D space-optimised form, where `dp[c]` is being updated in place.

### 0/1 — iterate capacity **backwards**
```python
for item in items:
    for c in range(capacity, item - 1, -1):     # ⭐ HIGH → LOW
        dp[c] = max(dp[c], dp[c - item] + value)
```
When you read `dp[c - item]`, that index is **lower** than `c`. Going backwards means it hasn't been
touched yet *in this item's pass* — so it still holds the value from **before** this item existed.
The item therefore gets used at most once. ✅

### Unbounded — iterate capacity **forwards**
```python
for item in items:
    for c in range(item, capacity + 1):         # ⭐ LOW → HIGH
        dp[c] = max(dp[c], dp[c - item] + value)
```
Going forwards, `dp[c - item]` **was already updated in this pass** — so it may already include this
item. Reading it again lets the item be reused. ✅ Exactly what we want.

**One-sentence version:** *backwards = read the past (before this item); forwards = read the present
(including this item).*

If you get an answer that's too large in a 0/1 problem, this is almost certainly why.

---

## Example 1 — Coin Change (LC 322), unbounded, minimising

> Fewest coins to make `amount`. `-1` if impossible.

**`dp[a]` = the minimum number of coins to make amount `a`.**

```python
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0                                   # zero coins to make 0

    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1
```
**O(amount · len(coins)) time, O(amount) space.**

**The decision:** for amount `a`, try every coin as the *last* coin used. Whatever remains (`a - c`)
is a smaller subproblem already solved.

> **Why greedy fails here:** coins `[1, 3, 4]`, amount `6`. Greedy picks 4, then 1, then 1 = **3
> coins**. Optimal is 3 + 3 = **2 coins**. Taking the biggest coin first locks you out of the better
> answer. This counterexample is the cleanest way to answer "why isn't this greedy?" — memorise it.

---

## Example 2 — Coin Change II (LC 518), unbounded, counting

> **How many combinations** make up `amount`? Order doesn't matter.

```python
def change(amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1                                   # one way to make 0: take nothing

    for c in coins:                             # ⭐ COINS in the OUTER loop
        for a in range(c, amount + 1):
            dp[a] += dp[a - c]

    return dp[amount]
```

### ⭐ The loop-order rule for counting problems

| Loop order | Counts | Problem |
|---|---|---|
| **coins outer**, amount inner | **combinations** (order-independent) | Coin Change II |
| **amount outer**, coins inner | **permutations** (order matters) | Combination Sum IV (LC 377) |

**Why:** with coins outer, coin `c` is fully processed before coin `c'` is even considered — so
`[1,2]` is built but `[2,1]` never is; the coins are always used in a fixed order. With amount outer,
every coin is tried at every amount, so orderings multiply.

> This trips up almost everyone. When a counting-DP answer is too large, check the loop order first.
> LC 518 and LC 377 differ *only* in these two lines, which is why they're the perfect pair to study
> back to back.

---

## Example 3 — Partition Equal Subset Sum (LC 416), 0/1, boolean

> Can the array be split into two subsets with equal sums?

**The reduction:** the target is `total // 2`. So the question is "does some subset sum to exactly
`total/2`?" — subset-sum, which is 0/1 knapsack with boolean values.

```python
def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False                            # odd total → impossible
    target = total // 2

    dp = [False] * (target + 1)
    dp[0] = True                                # the empty subset sums to 0

    for x in nums:
        for c in range(target, x - 1, -1):      # ⭐ BACKWARDS — each number used once
            dp[c] = dp[c] or dp[c - x]
        if dp[target]:
            return True                         # early exit
    return dp[target]
```
**O(n · target).**

Try changing the inner loop to `range(x, target + 1)` and watch it wrongly accept `[1, 5]` for
target 2 (using the `1` twice). That's the loop-direction rule made concrete — actually run it once,
it makes the rule stick.

### The bitset version (fun, and genuinely fast)
```python
def can_partition(nums):
    total = sum(nums)
    if total % 2: return False
    bits = 1                                    # bit i set ⇒ sum i is achievable
    for x in nums:
        bits |= bits << x                       # every reachable sum, shifted by x
    return (bits >> (total // 2)) & 1
```
Python's big integers make this a legitimate ~64× speedup. Worth knowing as a party trick and as a
demonstration that "the DP table" and "a bitmask" are sometimes the same object.

---

## Example 4 — Target Sum (LC 494), 0/1, counting

> Assign `+` or `−` to each number to reach `target`. Count the ways.

### The algebraic reduction (the elegant solution)

Let `P` = the sum of the positives, `N` = the sum of the absolute values of the negatives.
```
P - N = target
P + N = total          (adding the two)
─────────────────
2P = target + total
P = (target + total) / 2
```
So: **count the subsets summing to `(target + total) / 2`** — a plain 0/1 counting knapsack.

```python
def find_target_sum_ways(nums, target):
    total = sum(nums)
    if (total + target) % 2 or abs(target) > total:
        return 0                                # not an integer, or out of range
    subset_target = (total + target) // 2

    dp = [0] * (subset_target + 1)
    dp[0] = 1
    for x in nums:
        for c in range(subset_target, x - 1, -1):    # backwards: 0/1
            dp[c] += dp[c - x]
    return dp[subset_target]
```

### The direct memoisation (write this one first)
```python
from functools import cache

def find_target_sum_ways(nums, target):
    @cache
    def dp(i, total):
        if i == len(nums):
            return 1 if total == target else 0
        return dp(i + 1, total + nums[i]) + dp(i + 1, total - nums[i])
    return dp(0, 0)
```
Six lines, obviously correct, and fast enough. **Do this in an interview, then mention the algebraic
reduction as an optimisation.** Reaching for the clever version first risks a sign error under time
pressure and shows less clearly that you understand the problem.

---

## Example 5 — Classic 0/1 knapsack (weights and values)

```python
def knapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)
    for w, v in zip(weights, values):
        for c in range(capacity, w - 1, -1):    # backwards
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[capacity]
```
Not a LeetCode problem directly, but it's the canonical form. If you can write this without thinking,
every problem above is a rearrangement of it.

---

## The recognition table

| Problem | Variant | dp meaning | Combine |
|---|---|---|---|
| Coin Change (322) | unbounded | min coins for amount | `min(..., dp[a-c]+1)` |
| Coin Change II (518) | unbounded | # combinations | `dp[a] += dp[a-c]` |
| Combination Sum IV (377) | unbounded, **ordered** | # permutations | `dp[a] += dp[a-c]`, loops swapped |
| Partition Equal Subset (416) | 0/1 | reachable? | `dp[c] or dp[c-x]` |
| Target Sum (494) | 0/1 | # of subsets | `dp[c] += dp[c-x]` |
| Last Stone Weight II (1049) | 0/1 | reachable sums | minimise `|total - 2·subset|` |
| Ones and Zeroes (474) | 0/1, **2-D capacity** | max items | two capacity dimensions |
| Perfect Squares (279) | unbounded | min count | items are `1,4,9,16,...` |

> **Ones and Zeroes** is worth noting: the capacity is two-dimensional (a budget of 0s *and* 1s). The
> template extends by adding a loop — both iterated backwards. Once you see that, "capacity" stops
> meaning "a single number" and becomes "whatever resources are being spent."

---

## Debug checklist

- [ ] 0/1 or unbounded? Backwards or forwards?
- [ ] Counting: is the loop order right for combinations vs permutations?
- [ ] `dp[0]` — is it `0` (min), `1` (count), or `True` (boolean)?
- [ ] Impossible states: `float('inf')` for min, `0` for count, `False` for boolean.
- [ ] Does the reduction hold? (Odd total, target out of range, negative amounts.)
- [ ] Is the answer `dp[target]` or `max(dp)`?
