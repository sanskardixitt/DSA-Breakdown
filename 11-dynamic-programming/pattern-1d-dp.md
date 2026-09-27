# Pattern — 1-D Dynamic Programming

`dp[i]` depends on a small, fixed number of earlier entries. The entry point to all of DP.

---

## How do I know to use this?

- A linear sequence of decisions (steps, houses, days, characters)
- "**how many ways** to reach position n"
- "**minimum cost** to reach the end"
- "**maximum** value with an adjacency restriction" (can't take two in a row)
- The answer at `i` depends on `i-1`, `i-2`, ... a **bounded** number of predecessors

---

## The template

```python
dp = [0] * (n + 1)
dp[0] = <base>
# dp[i] = <write the English meaning here BEFORE coding>

for i in range(1, n + 1):
    dp[i] = <combination of dp[i-1], dp[i-2], ...>

return dp[n]
```

---

## Example 1 — Climbing Stairs (LC 70)

> How many distinct ways to climb `n` stairs, taking 1 or 2 steps at a time?

**`dp[i]` = the number of ways to reach step `i`.**

**The transition:** to be standing on step `i`, my last move was either from `i-1` (a 1-step) or from
`i-2` (a 2-step). Those are disjoint and exhaustive, so:
```
dp[i] = dp[i-1] + dp[i-2]
```
That's Fibonacci. **Base cases:** `dp[0] = 1` (one way to be at the start — do nothing), `dp[1] = 1`.

```python
def climb_stairs(n):
    if n <= 2: return n
    a, b = 1, 2                          # ways to reach step 1, step 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b
```
**O(n) time, O(1) space.**

> **The reasoning move to internalise: "how did I get here?"** Enumerate the possible last moves.
> Each one contributes the count from wherever it came from. That's how you derive counting DP
> recurrences generally.

---

## Example 2 — Min Cost Climbing Stairs (LC 746)

> `cost[i]` to step off stair `i`. Start at index 0 or 1. Reach past the last stair, minimally.

**`dp[i]` = the minimum cost to *reach* stair `i`** (not including stepping off it).

```
dp[i] = min(dp[i-1] + cost[i-1],      # came from i-1
            dp[i-2] + cost[i-2])      # came from i-2
```

```python
def min_cost_climbing_stairs(cost):
    n = len(cost)
    a, b = 0, 0                          # dp[0], dp[1] — both free to start from
    for i in range(2, n + 1):
        a, b = b, min(b + cost[i-1], a + cost[i-2])
    return b                             # dp[n] = cost to reach past the end
```

> **Note the `n + 1` states.** The "top" is a virtual position past the last stair. Introducing a
> virtual terminal state is a recurring trick — it removes the special-casing at the boundary.

---

## Example 3 — House Robber (LC 198) ⭐

> Can't rob two adjacent houses. Maximise the total.

**`dp[i]` = the maximum money robbable from houses `0..i`.**

**The decision at house `i`:** rob it or skip it.
- **Rob it:** you couldn't have robbed `i-1`, so you get `nums[i] + dp[i-2]`.
- **Skip it:** you keep whatever `dp[i-1]` was.

```
dp[i] = max(dp[i-1], nums[i] + dp[i-2])
```

```python
def rob(nums):
    prev2, prev1 = 0, 0                  # dp[i-2], dp[i-1]
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1
```
**O(n) time, O(1) space.** Six lines.

### Trace on `[2, 7, 9, 3, 1]`

| x | prev2 | prev1 | computation |
|---|---|---|---|
| — | 0 | 0 | |
| 2 | 0 | 2 | max(0, 0+2) |
| 7 | 2 | 7 | max(2, 0+7) |
| 9 | 7 | 11 | max(7, 2+9) |
| 3 | 11 | 11 | max(11, 7+3) |
| 1 | 11 | **12** | max(11, 11+1) |

Answer **12** = houses 2 + 9 + 1. ✅

> **The "take it or leave it" decision shape is the single most common DP form.** House Robber,
> knapsack, Best Time to Buy and Sell Stock, Delete and Earn, and Maximum Alternating Subsequence Sum
> are all this recurrence with different decorations.

---

## Example 4 — House Robber II (LC 213) — circular

> The houses form a circle, so the first and last are adjacent.

**The reduction:** you can't rob both house 0 and house n−1. So the answer is the better of two
*linear* problems:
- Rob houses `0 .. n-2` (exclude the last)
- Rob houses `1 .. n-1` (exclude the first)

```python
def rob_circular(nums):
    if len(nums) == 1:
        return nums[0]

    def rob_linear(arr):
        prev2, prev1 = 0, 0
        for x in arr:
            prev2, prev1 = prev1, max(prev1, prev2 + x)
        return prev1

    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))
```

> **"Break the circle by fixing a decision, then solve the linear version twice"** is a broadly useful
> move. Same idea handles circular arrays in Maximum Circular Subarray Sum and Next Greater Element II.

---

## Example 5 — Delete and Earn (LC 740)

> Taking `nums[i]` earns `nums[i]` but deletes every `nums[i]-1` and `nums[i]+1`.

**The reframe:** bucket by *value*. Let `points[v] = v * count(v)`. Now "can't take `v` and `v±1`" is
exactly House Robber over the value axis.

```python
def delete_and_earn(nums):
    points = defaultdict(int)
    for x in nums:
        points[x] += x

    prev2, prev1 = 0, 0
    for v in range(max(nums) + 1):
        prev2, prev1 = prev1, max(prev1, prev2 + points[v])
    return prev1
```

> **This is a top-tier "recognise the disguise" problem.** Nothing in the statement mentions houses or
> adjacency in an array. The insight is that *the index axis isn't always the array index* — sometimes
> it's the value axis, or time, or capacity. When a problem seems un-DP-able, ask: **"what's the right
> axis to lay this out on?"**

---

## Example 6 — Decode Ways (LC 91)

> How many ways to decode a digit string, where `A=1 ... Z=26`?

**`dp[i]` = the number of ways to decode the first `i` characters.**

**The decision:** the last character is either its own letter, or part of a two-digit letter.

```python
def num_decodings(s):
    if not s or s[0] == '0':
        return 0
    n = len(s)
    prev2, prev1 = 1, 1                  # dp[0]=1 (empty), dp[1]=1

    for i in range(2, n + 1):
        cur = 0
        if s[i-1] != '0':                          # single digit 1-9
            cur += prev1
        if '10' <= s[i-2:i] <= '26':               # valid two-digit
            cur += prev2
        if cur == 0:
            return 0                               # dead end — no valid decoding
        prev2, prev1 = prev1, cur

    return prev1
```

The whole difficulty is the zeros: `'0'` can never stand alone, and `'30'` is unparseable. The two
guards handle both.

---

## Example 7 — Word Break (LC 139)

> Can `s` be segmented into dictionary words?

**`dp[i]` = "can the first `i` characters be segmented?"** (a boolean)

```python
def word_break(s, word_dict):
    words = set(word_dict)               # O(1) lookup
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True                         # the empty string is trivially segmentable

    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break                    # one valid split is enough
    return dp[n]
```
**O(n² · L).**

> **The two-loop shape — "for each end `i`, try every split point `j`" — is the standard
> partition-DP skeleton.** `dp[j]` answers "is the prefix valid?", and `s[j:i]` is the last piece.
> Same skeleton solves Palindrome Partitioning II and Concatenated Words.
>
> Optimisation: bound the inner loop by the longest dictionary word instead of scanning all `j`.

---

## Example 8 — Maximum Product Subarray (LC 152)

> Contiguous subarray with the largest product. Negatives allowed.

**The twist:** a large *negative* product becomes a large *positive* one when multiplied by another
negative. So tracking only the maximum is insufficient — **you must track the minimum too.**

```python
def max_product(nums):
    best = cur_max = cur_min = nums[0]

    for x in nums[1:]:
        candidates = (x, cur_max * x, cur_min * x)
        cur_max = max(candidates)
        cur_min = min(candidates)        # ⚠ compute from the OLD cur_max — see below
        best = max(best, cur_max)

    return best
```
> ⚠ In Python the tuple `candidates` is built before either assignment, so this is safe. In a language
> without that, you'd need `tmp = cur_max` before overwriting. The bug of using the *new* `cur_max`
> when computing `cur_min` is extremely common.

`x` alone is in the candidate list because sometimes the best move is to **restart** the subarray at
`x` (e.g. after a zero).

> **The generalisable lesson: when a transition can *flip sign* or otherwise invert the ordering,
> carry both extremes.** Same idea appears in Maximum Alternating Subsequence Sum and in stock
> problems with multiple states.

---

## Debug checklist

- [ ] Did I write the meaning of `dp[i]` in English, as a comment?
- [ ] Are the base cases right? (`dp[0]` is wrong more often than the recurrence.)
- [ ] Is the answer `dp[n]`, `dp[n-1]`, or `max(dp)`? These differ, and confusing them is common.
- [ ] Array size — `n` or `n + 1`? (Prefer `n + 1` with a virtual position 0.)
- [ ] When space-optimising, am I reading a value I've already overwritten?
- [ ] Does my code actually implement the sentence I wrote in step 1?
