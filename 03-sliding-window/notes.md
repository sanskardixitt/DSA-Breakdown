# Sliding Window — Notes

The pattern that turns "check every subarray" (O(n²) or O(n³)) into a single O(n) pass.

---

## The core idea

A window is a contiguous range `[left, right]`. As `right` advances, you **incrementally update** the
window's state instead of recomputing it. When the window becomes invalid, you advance `left` to fix it.

```
[ a  b  c  d  e  f  g ]
     └────────┘
     L        R
```

**Why it's O(n) and not O(n²):** `left` and `right` each move forward at most `n` times, and neither
ever moves backward. Total pointer movement ≤ 2n. Even though the inner `while` loop looks nested,
across the *whole run* it executes at most n times. This "amortised over the whole loop" argument is
worth being able to state — interviewers ask.

---

## The single most important recognition rule

> **Sliding window applies when the input is CONTIGUOUS and the validity condition is MONOTONE.**

Monotone means: *if a window is invalid, extending it further can't make it valid; if it's valid,
shrinking it can't make it invalid.*

That's what makes "shrink from the left until valid again" correct. Break it and the pattern is wrong.

### When it does NOT apply

| Situation | Why it breaks | Use instead |
|---|---|---|
| Array has **negative numbers** and you're bounding a *sum* | Shrinking may not decrease the sum | Prefix sum + hash map |
| The problem asks about a **subsequence** (non-contiguous) | Window is contiguous by definition | DP |
| You need a **count of all** valid subarrays with an exact sum | Not a longest/shortest question | Prefix sum + hash map |

> **The negatives rule is the one people get burned by.** "Longest subarray summing to k" with all
> positive numbers → sliding window. With negatives → prefix sum. Same sentence, different technique.
> Always check the constraint line for negative values.

---

## The two shapes

### Fixed-size window
You're told the size `k`. The window never changes length — it just slides.
→ [pattern-fixed-window.md](pattern-fixed-window.md)

**Triggers:** "of size k", "every k consecutive", "average of k", "check if a permutation of s1 is in s2"
(the window size is `len(s1)`).

### Variable-size window
The size is what you're solving for.
→ [pattern-variable-window.md](pattern-variable-window.md)

**Triggers:** "longest ... such that", "shortest ... such that", "at most K distinct", "at most K
replacements", "containing all characters of".

---

## Recognition triggers (full list)

| Statement contains... | Window type |
|---|---|
| "subarray/substring of size k" | Fixed |
| "maximum sum of k consecutive" | Fixed |
| "permutation of s1 in s2" / "all anagrams of p in s" | Fixed (size = len of pattern) |
| "longest substring **without** repeating characters" | Variable, grow-shrink |
| "longest substring with **at most** K distinct" | Variable, grow-shrink |
| "longest subarray with at most K zeros / K flips" | Variable, grow-shrink |
| "**minimum** window containing..." | Variable, shrink-to-minimal |
| "**smallest** subarray with sum ≥ target" | Variable, shrink-to-minimal |
| "maximum consecutive ones after K flips" | Variable, grow-shrink |
| "**exactly** K distinct" | `atMost(K) - atMost(K-1)` ← see below |

---

## The "exactly K" trick

There is no clean sliding window for **exactly** K. But there is for **at most** K. So:

```
exactly(K) = atMost(K) - atMost(K - 1)
```

```python
def subarrays_with_k_distinct(nums, k):
    def at_most(k):
        count = defaultdict(int)
        left = res = 0
        for right, x in enumerate(nums):
            count[x] += 1
            while len(count) > k:
                count[nums[left]] -= 1
                if count[nums[left]] == 0:
                    del count[nums[left]]
                left += 1
            res += right - left + 1     # all windows ending at `right` are valid
        return res
    return at_most(k) - at_most(k - 1)
```

> **Also note `res += right - left + 1`** — the standard way to *count* valid subarrays with a window.
> Every window ending at `right` and starting anywhere in `[left, right]` is valid, and there are
> `right - left + 1` of them. This one line converts a "longest" template into a "count" template.

---

## The state you maintain

The whole difficulty of sliding window is choosing **what to track**. Options:

| Condition | Window state |
|---|---|
| Sum constraint | a running `int` |
| "no repeating characters" | a `set`, or `dict: char -> last index` |
| "at most K distinct" | `defaultdict(int)` + `len(count)` |
| "at most K zeros/flips" | a `zero_count` int |
| "contains all of pattern" | `Counter` of the need + a `have`/`need` matched counter |
| "at most K replacements to make all same" | `count` dict + `max_freq` |

Adding an element must be O(1), and removing must be O(1). If it isn't, sliding window doesn't help.

---

## The universal skeleton

```python
left = 0
state = <init>
best = <init>

for right in range(len(arr)):
    # ① EXPAND: add arr[right] to state
    add(arr[right])

    # ② CONTRACT: while the window is invalid, shrink from the left
    while not valid(state):
        remove(arr[left])
        left += 1

    # ③ RECORD: the window [left, right] is now valid
    best = max(best, right - left + 1)

return best
```

**Everything is a variation of these three blocks.** Memorise the skeleton; then per problem you only
decide: what's `state`, what's `valid()`, and where does `record` go.

> ⚠ For **minimum** window problems, the record step moves *inside* the while loop — because there
> you shrink *while still valid* and want to capture the smallest. See
> [pattern-variable-window.md](pattern-variable-window.md).

---

## Traps

```python
# ❌ Forgetting to advance left inside the while → infinite loop
while not valid(state):
    remove(arr[left])
    # left += 1   ← missing

# ❌ Removing from the count dict but leaving zero-count keys
count[c] -= 1
# if len(count) is your "distinct" measure, you MUST delete zero entries:
if count[c] == 0: del count[c]

# ❌ Using `if` instead of `while` for contraction
# One removal may not be enough to restore validity.

# ❌ Window length computed as `right - left` (missing the +1)
# [left, right] inclusive has right - left + 1 elements.

# ❌ Using sliding window with negative numbers on a sum constraint
```
