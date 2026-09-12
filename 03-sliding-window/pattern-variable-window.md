# Pattern — Variable-Size Sliding Window

The size is the answer, or the size is whatever keeps the window valid. This is the higher-value
variant — most medium sliding-window problems are this shape.

---

## How do I know to use this?

- "**longest** substring/subarray such that ___"
- "**shortest / minimum** subarray such that ___"
- "**at most K** distinct / zeros / replacements / operations"
- "**without repeating** characters"
- "**containing all** characters of T"
- "maximum consecutive ones after flipping at most K zeros"

---

## The two sub-shapes (know which one you're in)

### Shape A — "LONGEST valid window" (grow, shrink only when invalid)

```python
left = 0
best = 0
for right in range(n):
    add(arr[right])

    while INVALID:                      # shrink until valid again
        remove(arr[left]); left += 1

    best = max(best, right - left + 1)  # ← record OUTSIDE the while (window is valid here)
return best
```

### Shape B — "SHORTEST valid window" (grow until valid, then shrink while still valid)

```python
left = 0
best = float('inf')
for right in range(n):
    add(arr[right])

    while VALID:                        # shrink while still valid, to find the minimal one
        best = min(best, right - left + 1)   # ← record INSIDE the while
        remove(arr[left]); left += 1
return best if best != float('inf') else 0
```

> **The difference is a single line's position, and it is the #1 source of confusion.**
> - **Longest:** the `while` condition is *invalid*, and you record *after* it.
> - **Shortest:** the `while` condition is *valid*, and you record *inside* it.
>
> Ask yourself: "am I shrinking to *repair* the window, or shrinking to *minimise* it?"

---

## Example 1 — Longest Substring Without Repeating Characters (Shape A)

```python
def length_of_longest_substring(s):
    seen = set()
    left = 0
    best = 0

    for right, ch in enumerate(s):
        while ch in seen:                    # invalid: duplicate
            seen.remove(s[left])
            left += 1
        seen.add(ch)
        best = max(best, right - left + 1)

    return best
```

### Trace on `"abcabcbb"`

| right | ch | action | window | best |
|---|---|---|---|---|
| 0 | a | add | `a` | 1 |
| 1 | b | add | `ab` | 2 |
| 2 | c | add | `abc` | 3 |
| 3 | a | dup → drop `a` (left=1), add | `bca` | 3 |
| 4 | b | dup → drop `b` (left=2), add | `cab` | 3 |
| 5 | c | dup → drop `c` (left=3), add | `abc` | 3 |
| 6 | b | dup → drop `a`,`b` (left=5), add | `cb` | 3 |
| 7 | b | dup → drop `c`,`b` (left=7), add | `b` | 3 |

Answer **3**. ✅

### The "jump" optimisation

Instead of shrinking one at a time, store the **last index** of each character and jump `left` directly:

```python
def length_of_longest_substring(s):
    last = {}                     # char -> last index seen
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:      # ⚠ the `>= left` guard is essential
            left = last[ch] + 1                  # jump past the previous occurrence
        last[ch] = right
        best = max(best, right - left + 1)
    return best
```

> **Why `>= left`?** A character may exist in `last` from *before* the current window. Jumping to it
> would move `left` **backwards**, corrupting the window. This guard is the classic bug here.

---

## Example 2 — Longest Repeating Character Replacement (Shape A)

> You may replace at most `k` characters. Return the longest substring of one repeated letter.

**The reframe (this is the whole problem):** a window is valid if

```
window_length - count_of_most_frequent_char <= k
```
i.e. the number of characters you'd need to change is within budget.

```python
def character_replacement(s, k):
    count = defaultdict(int)
    left = 0
    max_freq = 0
    best = 0

    for right, ch in enumerate(s):
        count[ch] += 1
        max_freq = max(max_freq, count[ch])

        while (right - left + 1) - max_freq > k:      # too many replacements needed
            count[s[left]] -= 1
            left += 1

        best = max(best, right - left + 1)

    return best
```

### The `max_freq` subtlety everyone asks about

`max_freq` is never decreased when the window shrinks — so it can be *stale* (too high). Isn't that a bug?

**No.** Here's why: a stale `max_freq` only makes the validity test *more permissive*, so the window
might not shrink when it "should". But the recorded `best` can only grow when the window grows, and the
window only grows past its previous best when a **genuinely higher** `max_freq` is found. A window
based on a stale value never sets a new record. So the answer is still correct — and skipping the
recomputation keeps it O(n) instead of O(26n).

> You don't have to love this argument, but you should be able to *state* it. It's a common follow-up
> question. If it makes you uncomfortable, recomputing `max(count.values())` inside the loop is also
> accepted and only O(26n).

---

## Example 3 — Minimum Window Substring 🔴 (Shape B)

> Smallest substring of `s` containing all characters of `t`, **including multiplicity**.

This is the boss fight. It combines Shape B with the `have`/`need` matched-counter technique.

```python
from collections import Counter

def min_window(s, t):
    if not s or not t or len(t) > len(s):
        return ""

    need = Counter(t)
    required = len(need)            # number of DISTINCT chars we must satisfy
    have = 0                        # how many distinct chars are currently satisfied

    window = defaultdict(int)
    left = 0
    best_len = float('inf')
    best_start = 0

    for right, ch in enumerate(s):
        window[ch] += 1
        if ch in need and window[ch] == need[ch]:     # ⚠ `==`, not `>=`
            have += 1

        while have == required:                        # valid → try to shrink
            if right - left + 1 < best_len:
                best_len = right - left + 1
                best_start = left

            lch = s[left]
            window[lch] -= 1
            if lch in need and window[lch] < need[lch]:  # this char just became unsatisfied
                have -= 1
            left += 1

    return "" if best_len == float('inf') else s[best_start:best_start + best_len]
```
**O(|s| + |t|) time, O(|s| + |t|) space.**

### The three things that make it work

1. **`have` / `required` counters.** Checking "does the window contain all of t?" naively is O(26)
   per step. Instead, track how many *distinct* characters are fully satisfied. Update it only when a
   count crosses its threshold.
2. **`window[ch] == need[ch]`, not `>=`.** With `>=`, `have` increments repeatedly for the same
   character and the count becomes meaningless. It must fire exactly once, at the crossing.
   The mirror on removal is `window[lch] < need[lch]` — also exactly at the crossing.
3. **Record inside the while.** You're shrinking while *still valid*, capturing the minimum each time.

### Trace on `s = "ADOBECODEBANC"`, `t = "ABC"`

| right | window | have | action |
|---|---|---|---|
| 5 (`E`) | `ADOBEC`… wait, at right=5 char is `C` | 3 | valid → record `"ADOBEC"` (len 6), shrink |
| 6..9 | shrinks past `A`, `have`→2, keeps growing | | |
| 10 (`A`) | `ODEBANC`? not yet | | |
| 12 (`C`) | valid again | 3 | record `"BANC"` (len 4) ✅ |

Final answer `"BANC"`.

> **If Minimum Window Substring clicks, sliding window is done.** Everything else in this topic is a
> simplification of it. Budget the full 45 minutes and derive it rather than memorising it.

---

## Example 4 — Minimum Size Subarray Sum (Shape B, simple)

```python
def min_sub_array_len(target, nums):
    left = 0
    total = 0
    best = float('inf')

    for right, x in enumerate(nums):
        total += x
        while total >= target:                    # valid → shrink to minimal
            best = min(best, right - left + 1)
            total -= nums[left]
            left += 1

    return 0 if best == float('inf') else best
```
> Only correct because all `nums` are **positive** — that's what makes shrinking monotonically
> decrease the sum. Check that constraint every time.

---

## Example 5 — Max Consecutive Ones III (Shape A)

> Flip at most `k` zeros; return the longest run of 1s.

```python
def longest_ones(nums, k):
    left = 0
    zeros = 0
    best = 0
    for right, x in enumerate(nums):
        if x == 0:
            zeros += 1
        while zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        best = max(best, right - left + 1)
    return best
```

> **Reframe to notice:** "flip at most k zeros" ⟺ "longest window containing at most k zeros."
> Turning an *operation budget* into a *window constraint* is a very reusable move. Same idea:
> "at most k replacements", "at most k deletions", "at most k swaps".

---

## Master template summary

```python
# --- LONGEST valid window ---
left = 0; best = 0
for right in range(n):
    add(arr[right])
    while INVALID:
        remove(arr[left]); left += 1
    best = max(best, right - left + 1)

# --- SHORTEST valid window ---
left = 0; best = inf
for right in range(n):
    add(arr[right])
    while VALID:
        best = min(best, right - left + 1)
        remove(arr[left]); left += 1

# --- COUNT of valid windows (at most K) ---
left = 0; total = 0
for right in range(n):
    add(arr[right])
    while INVALID:
        remove(arr[left]); left += 1
    total += right - left + 1      # every window ending at `right` starting in [left, right]
```

---

## Traps

- Recording the answer in the wrong place (outside vs inside the `while`).
- `if` instead of `while` for contraction.
- `>=` instead of `==` when incrementing a matched counter.
- Forgetting `del count[c]` when `len(count)` is your distinct-count.
- Letting `left` move backwards in the jump optimisation (missing the `>= left` guard).
- Applying the pattern to an array with negatives on a sum constraint.
