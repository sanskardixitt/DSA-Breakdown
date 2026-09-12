# Pattern — Fixed-Size Sliding Window

The window size `k` is given. The window never grows or shrinks — it slides one step at a time.

---

## How do I know to use this?

- "of size **k**" / "**k** consecutive elements"
- "maximum/minimum/average sum of any **k** consecutive"
- "find all **anagrams** of `p` in `s`" → window size = `len(p)`
- "does `s2` contain a **permutation** of `s1`" → window size = `len(s1)`
- "maximum in every window of size k" → fixed window + monotonic deque

---

## The template

```python
def fixed_window(arr, k):
    state = <init>
    best = <init>

    for right in range(len(arr)):
        add(arr[right])                     # ① always add

        if right >= k - 1:                  # ② window is now exactly size k
            best = update(best, state)
            remove(arr[right - k + 1])      # ③ drop the leftmost, ready to slide
    return best
```

**The one thing to get right:** `right - k + 1` is the index that leaves the window. Derive it once:
the window is `[right-k+1, right]`, inclusive, which has `k` elements. ✅

---

## Example 1 — Maximum sum of a subarray of size k

```python
def max_sum_k(nums, k):
    window_sum = 0
    best = float('-inf')

    for right in range(len(nums)):
        window_sum += nums[right]

        if right >= k - 1:
            best = max(best, window_sum)
            window_sum -= nums[right - k + 1]

    return best
```
**O(n) time, O(1) space.** Brute force would be O(n·k).

The whole saving: instead of re-summing `k` elements per position, you do **one addition and one
subtraction**. That's the essence of every sliding window.

---

## Example 2 — Permutation in String

> Return true if `s2` contains a permutation of `s1`.

**The reframe:** "contains a permutation of s1" = "some window of length `len(s1)` has the same
character frequencies as s1."

```python
from collections import Counter

def check_inclusion(s1, s2):
    if len(s1) > len(s2):
        return False

    need = Counter(s1)
    window = Counter(s2[:len(s1)])          # first window
    if window == need:
        return True

    for right in range(len(s1), len(s2)):
        window[s2[right]] += 1                     # add the incoming char
        left_char = s2[right - len(s1)]
        window[left_char] -= 1                     # remove the outgoing char
        if window[left_char] == 0:
            del window[left_char]                  # ⚠ keep Counter clean for == to work
        if window == need:
            return True

    return False
```

> **Why `del` matters:** `Counter({'a':1,'b':0}) != Counter({'a':1})`. Leaving zero entries breaks
> the equality check. Either delete them, or compare with a matched-count instead.

### The O(1)-comparison upgrade

Comparing two Counters is O(26). Fine, but the "matched count" technique is the one interviewers like,
and it generalises to the harder problems:

```python
def check_inclusion(s1, s2):
    if len(s1) > len(s2): return False

    need = [0] * 26
    win  = [0] * 26
    for c in s1: need[ord(c) - 97] += 1

    matches = sum(1 for i in range(26) if need[i] == win[i])   # starts at 26 - (distinct in s1)

    for right, ch in enumerate(s2):
        i = ord(ch) - 97
        win[i] += 1
        # update `matches` only for the index that changed — O(1)
        if win[i] == need[i]:   matches += 1
        elif win[i] == need[i] + 1: matches -= 1

        if right >= len(s1):
            j = ord(s2[right - len(s1)]) - 97
            win[j] -= 1
            if win[j] == need[j]:   matches += 1
            elif win[j] == need[j] - 1: matches -= 1

        if matches == 26:
            return True
    return False
```
**O(n) with O(1) work per step.**

> **The transferable idea:** don't recompute a global check each step. Track a **counter of how many
> sub-conditions are satisfied**, and update it only for the one thing that changed. This is exactly
> the `have`/`need` trick that makes Minimum Window Substring work.

---

## Example 3 — Sliding Window Maximum (fixed window + monotonic deque) 🔴

> Return the max of every window of size k. O(n) required.

A heap gives O(n log k). The O(n) solution uses a **monotonic deque** holding *indices*, with values in
decreasing order.

```python
from collections import deque

def max_sliding_window(nums, k):
    dq = deque()          # indices; nums[dq] is strictly decreasing
    res = []

    for right in range(len(nums)):
        # ① drop indices that have left the window
        if dq and dq[0] <= right - k:
            dq.popleft()

        # ② drop indices whose values can never be the max again
        while dq and nums[dq[-1]] <= nums[right]:
            dq.pop()

        dq.append(right)

        if right >= k - 1:
            res.append(nums[dq[0]])     # front = max of the current window

    return res
```

**The key insight (step ②):** if `nums[right] >= nums[j]` for some earlier `j` still in the window,
then `j` can **never** be a window maximum again — `right` is both larger *and* survives longer.
So `j` is permanently useless. Discard it.

**Why O(n):** every index is appended exactly once and popped at most once. Total ops ≤ 2n.

> This is the same "prove an element is exhausted and discard it" reasoning from Container With Most
> Water and from monotonic stacks. Three different-looking problems, one idea.

---

## Example 4 — Find All Anagrams in a String

Same machinery as Permutation in String, but collect *all* start indices instead of returning on the
first hit.

```python
def find_anagrams(s, p):
    if len(p) > len(s): return []
    need, win = Counter(p), Counter()
    res = []

    for right, ch in enumerate(s):
        win[ch] += 1
        if right >= len(p):
            left_ch = s[right - len(p)]
            win[left_ch] -= 1
            if win[left_ch] == 0:
                del win[left_ch]
        if win == need:
            res.append(right - len(p) + 1)
    return res
```

---

## Traps

- Off-by-one on the exiting index. It's `right - k + 1`. Derive it, don't guess.
- Recording the answer before the window has reached size `k`.
- Leaving zero-valued keys in a `Counter` you're comparing with `==`.
- Using a **max-heap** and forgetting to remove stale (out-of-window) entries — this is why the deque
  version exists.
- Assuming "fixed window" when the size is actually variable. Re-read the statement: is `k` the size,
  or a *constraint* on the contents? "At most k distinct" is variable, not fixed.
