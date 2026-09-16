# Pattern — Monotonic Stack ⭐

A stack whose contents are always sorted (increasing or decreasing). It answers
"**what's the next/previous element bigger/smaller than me?**" for every position in **O(n) total**.

---

## How do I know to use this?

The trigger phrases:

- "**next greater element**" / "**next smaller element**"
- "**previous greater**" / "**previous smaller**"
- "how many **days until a warmer** temperature"
- "**stock span**" (consecutive days with price ≤ today)
- "**largest rectangle** in a histogram", "**maximal rectangle**"
- "**trapping rain water**"
- "sum of **subarray minimums** / maximums"
- "remove k digits to make the smallest number"
- "**previous smaller** and **next smaller** boundaries for every element"

**The deeper signal:** you need, *for every element*, the nearest element on one side satisfying a
comparison. Brute force is O(n²) — scan outward from each index. Monotonic stack makes it O(n).

---

## The core insight (understand this and the code is trivial)

While scanning left to right, keep a stack of elements **still waiting for their answer**.

When a new element arrives, it **resolves** every waiting element it dominates — so pop them, record
their answers, and discard them permanently.

> **Why an element gets discarded forever:** if `arr[j] <= arr[i]` and `j < i`, then for anything
> further right, `arr[i]` is both **larger** *and* **closer**. `arr[j]` can never be anyone's "nearest
> greater element" again. It's dead. Pop it.

This is the exact same "prove an element is exhausted" argument as Container With Most Water and the
sliding-window-maximum deque. Three patterns, one idea. Notice it once and all three get easier.

**Why O(n):** each index is pushed exactly once and popped at most once. Total operations ≤ 2n, even
though the code has a nested `while`.

---

## The four variants (memorise the table, not four templates)

| I want | Scan direction | Pop while | Stack ends up |
|---|---|---|---|
| **Next greater** | left → right | `stack top < current` | decreasing |
| **Next smaller** | left → right | `stack top > current` | increasing |
| **Previous greater** | left → right | `stack top <= current` | decreasing |
| **Previous smaller** | left → right | `stack top >= current` | increasing |

For "next X", the answer is recorded **when you pop**.
For "previous X", the answer is `stack[-1]` **before you push**.

> **The memory hook:** to find something *greater*, you pop things that are *smaller*. The stack is
> always sorted the opposite way from what you're searching for.

---

## Template — Next Greater Element

```python
def next_greater(nums):
    n = len(nums)
    res = [-1] * n
    stack = []                       # indices; nums[stack] is DECREASING

    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            j = stack.pop()
            res[j] = x               # x is the next greater for j
        stack.append(i)

    return res                       # anything left in the stack keeps -1
```

**Store indices, not values.** You almost always need the distance (`i - j`) or need to index back into
the array. Storing values throws that away.

---

## Template — Previous Smaller Element

```python
def previous_smaller(nums):
    n = len(nums)
    res = [-1] * n
    stack = []                       # indices; nums[stack] is INCREASING

    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] >= x:
            stack.pop()
        res[i] = stack[-1] if stack else -1     # ← read BEFORE pushing
        stack.append(i)

    return res
```

---

## Example 1 — Daily Temperatures

> For each day, how many days until a warmer temperature? `0` if never.

```python
def daily_temperatures(temps):
    res = [0] * len(temps)
    stack = []                       # indices of days still waiting

    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            res[j] = i - j           # ← the distance is why we store indices
        stack.append(i)

    return res
```

### Trace on `[73, 74, 75, 71, 69, 72, 76, 73]`

| i | t | pops (index → answer) | stack after |
|---|---|---|---|
| 0 | 73 | — | `[0]` |
| 1 | 74 | 0 → 1 | `[1]` |
| 2 | 75 | 1 → 1 | `[2]` |
| 3 | 71 | — | `[2,3]` |
| 4 | 69 | — | `[2,3,4]` |
| 5 | 72 | 4 → 1, 3 → 2 | `[2,5]` |
| 6 | 76 | 5 → 1, 2 → 4 | `[6]` |
| 7 | 73 | — | `[6,7]` |

Result: `[1,1,4,2,1,1,0,0]` ✅

Look at step 5: **two** elements resolved at once. That's the pattern working — one arrival can
discharge a whole run of waiting elements.

---

## Example 2 — Next Greater Element II (circular array)

> The array wraps around.

**The trick for circular arrays:** iterate `2n` times, using `i % n`. Push only during the first pass.

```python
def next_greater_circular(nums):
    n = len(nums)
    res = [-1] * n
    stack = []

    for i in range(2 * n):
        x = nums[i % n]
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x
        if i < n:                    # only push real (first-pass) indices
            stack.append(i)

    return res
```

> **"Double the array to simulate circularity"** is broadly reusable — it also works for circular
> subarray sums (LC 918) and circular queue problems.

---

## Example 3 — Largest Rectangle in Histogram 🔴 ⭐

The single most instructive monotonic stack problem. If you truly get this one, you get the pattern.

> Bars of given heights, width 1 each. Find the largest rectangle.

**The reframe:** for each bar `i`, consider the largest rectangle whose height is *exactly* `h[i]`.
It extends left until a bar shorter than `h[i]`, and right until a bar shorter than `h[i]`. So:

```
width = (next_smaller_index) - (prev_smaller_index) - 1
area  = h[i] * width
```

Every maximal rectangle has *some* bar as its limiting height, so taking the max over all `i` is
guaranteed to find the answer.

Now: "previous smaller and next smaller for every element" is exactly the monotonic stack.

```python
def largest_rectangle_area(heights):
    stack = []            # indices; heights[stack] is INCREASING
    best = 0
    heights = heights + [0]        # ⚠ sentinel: forces every remaining bar to be resolved

    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] >= h:
            height = heights[stack.pop()]
            # after popping, the new stack top is the PREVIOUS SMALLER bar
            left = stack[-1] if stack else -1
            width = i - left - 1
            best = max(best, height * width)
        stack.append(i)

    return best
```
**O(n) time, O(n) space.**

### The two subtle lines

1. **The sentinel `+ [0]`.** Without it, bars still on the stack at the end never get processed
   (nothing shorter ever arrives). A height-0 bar at the end forces every one of them to pop.
   Alternative: a second loop after the main one to drain the stack. The sentinel is cleaner and less
   error-prone.

2. **`width = i - left - 1`.** After popping index `j`:
   - `i` is the **first bar to the right shorter than** `h[j]` (that's why we're popping).
   - `stack[-1]` is the **first bar to the left shorter than** `h[j]` — because everything between it
     and `j` was already popped, so it must be shorter.
   - The rectangle spans `(left, i)` exclusive → width `i - left - 1`.

   **Draw this on paper once.** It's the only genuinely subtle index arithmetic in the pattern.

### Trace on `[2, 1, 5, 6, 2, 3]`

| i | h | pops | area computed | best |
|---|---|---|---|---|
| 0 | 2 | — | | 0 |
| 1 | 1 | pop 0 (h=2), left=−1, w=1−(−1)−1=1 | 2 | 2 |
| 2 | 5 | — | | 2 |
| 3 | 6 | — | | 2 |
| 4 | 2 | pop 3 (h=6), left=2, w=4−2−1=1 | 6 | 6 |
| | | pop 2 (h=5), left=1, w=4−1−1=2 | 10 | **10** |
| 5 | 3 | — | | 10 |
| 6 | 0 (sentinel) | pop 5 (h=3), left=4, w=6−4−1=1 | 3 | 10 |
| | | pop 4 (h=2), left=1, w=6−1−1=4 | 8 | 10 |
| | | pop 1 (h=1), left=−1, w=6−(−1)−1=6 | 6 | 10 |

Answer **10** ✅

> **Maximal Rectangle (LC 85)** is this function called once per row, with the histogram being
> "consecutive 1s above each column". Solve LC 84 properly and LC 85 is a 6-line wrapper.

---

## Example 4 — Trapping Rain Water, stack version

```python
def trap(height):
    stack = []            # indices; decreasing heights
    water = 0

    for i, h in enumerate(height):
        while stack and height[stack[-1]] < h:
            bottom = stack.pop()          # the floor of a basin
            if not stack:
                break                     # no left wall → water spills out
            left = stack[-1]
            width = i - left - 1
            bounded = min(height[left], h) - height[bottom]
            water += width * bounded
        stack.append(i)

    return water
```

This fills water **horizontally, layer by layer**, whereas the two-pointer version fills it
**vertically, column by column**. Both are O(n). Knowing both — and being able to say which you'd
choose — is a strong signal in an interview.

---

## Example 5 — Remove K Digits (a greedy monotonic stack)

> Remove `k` digits from a number string to make the smallest possible result.

**Greedy insight:** scanning left to right, whenever a digit is followed by a smaller one, removing
the larger digit lowers the number. So keep the stack **increasing**.

```python
def remove_k_digits(num, k):
    stack = []
    for d in num:
        while k and stack and stack[-1] > d:
            stack.pop()
            k -= 1
        stack.append(d)

    stack = stack[:len(stack) - k] if k else stack     # budget left → chop from the end
    return "".join(stack).lstrip('0') or "0"
```

Three edge cases packed into the last two lines: leftover `k` (digits already increasing → remove from
the tail), leading zeros, and the empty result.

---

## Debug checklist

- [ ] Am I storing **indices** (usually right) or values?
- [ ] Is my pop condition `<` or `<=`? (Matters for duplicates — decide what to do with ties.)
- [ ] Do I need a **sentinel** to drain the stack at the end?
- [ ] For "previous X", am I reading `stack[-1]` **before** pushing?
- [ ] Is the stack increasing or decreasing? Say it out loud, then check the pop condition matches.
- [ ] Width formula: is it `i - stack[-1] - 1` or `i - j`? Depends on whether you need a *span* or a
      *distance*.
