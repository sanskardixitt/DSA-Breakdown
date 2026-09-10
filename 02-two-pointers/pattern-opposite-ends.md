# Pattern — Two Pointers From Opposite Ends

---

## How do I know to use this?

- The array is **sorted** (or you're allowed to sort it) **and** you need a pair/triplet/quadruplet
- "**palindrome**"
- "**maximum area / container / water**" between two positions
- "**reverse**" something in place
- The brute force is "check every pair" and the input has an order you can exploit

**Anti-trigger:** input is unsorted *and* you must return original indices → use a hash map instead.

---

## The template

```python
l, r = 0, len(arr) - 1
while l < r:
    if <condition met>:
        # record answer
        l += 1
        r -= 1
    elif <need larger value>:
        l += 1              # moving left inward increases arr[l]
    else:
        r -= 1              # moving right inward decreases arr[r]
```

**The one thing to get right:** *which move makes the quantity go which way?* Write that as a comment
before you write the branches. Every bug in this pattern is a wrong branch direction.

---

## Example 1 — Two Sum II (sorted input)

```python
def two_sum_sorted(nums, target):
    l, r = 0, len(nums) - 1
    while l < r:
        s = nums[l] + nums[r]
        if s == target:
            return [l + 1, r + 1]     # 1-indexed per the problem
        if s < target:
            l += 1                    # need bigger → the only way is a bigger left
        else:
            r -= 1                    # need smaller → shrink the right
    return []
```
**O(n) time, O(1) space** — vs the hash map's O(n) time, O(n) space. Sorted input buys you the space.

---

## Example 2 — Valid Palindrome

```python
def is_palindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum(): l += 1     # skip junk from the left
        while l < r and not s[r].isalnum(): r -= 1     # skip junk from the right
        if s[l].lower() != s[r].lower():
            return False
        l += 1
        r -= 1
    return True
```
> Note the `l < r` guard **inside** the skip loops. Without it, an all-punctuation string runs off
> the end. This is the classic bug here.

---

## Example 3 — 3Sum (the important one)

> Find all unique triplets summing to 0.

**The reduction:** fix one element, and the rest is Two Sum on a sorted array.

```python
def three_sum(nums):
    nums.sort()                          # ① sorting is what makes two pointers legal
    res = []
    n = len(nums)

    for i in range(n - 2):
        if nums[i] > 0:                  # ② all remaining are ≥ 0 → sum can never be 0
            break
        if i > 0 and nums[i] == nums[i-1]:   # ③ skip duplicate anchors
            continue

        l, r = i + 1, n - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                l += 1
                r -= 1
                # ④ skip duplicates for the second element
                while l < r and nums[l] == nums[l-1]:
                    l += 1
    return res
```
**Time O(n²), Space O(1)** (excluding output and the sort).

### The four numbered lines are the entire problem

1. **Sort first.** Enables both two pointers *and* duplicate handling (equal values become adjacent).
2. **Early break.** Small, but shows you understand the invariant.
3. **Skip duplicate anchors.** `i > 0 and nums[i] == nums[i-1]` — note it compares to the *previous*,
   not the next. Comparing forward would skip the first of each duplicate group, which is wrong.
4. **Skip duplicate seconds** only *after* recording a hit.

> **The generalisation:** kSum reduces to (k−2) nested loops + a two-pointer inner layer.
> 4Sum = two nested loops + two pointers, O(n³). Same duplicate-skipping logic at every level.
> If you understand 3Sum's four lines, you can write 4Sum cold.

---

## Example 4 — Container With Most Water

> Heights `h[i]`. Pick two lines; area = `min(h[l], h[r]) × (r - l)`. Maximise.

```python
def max_area(h):
    l, r = 0, len(h) - 1
    best = 0
    while l < r:
        best = max(best, min(h[l], h[r]) * (r - l))
        if h[l] < h[r]:
            l += 1          # move the SHORTER one
        else:
            r -= 1
    return best
```
**O(n), O(1).**

### Why moving the shorter line is provably safe

Suppose `h[l] < h[r]`. The current area is `h[l] × (r - l)`.

Consider keeping `l` fixed and moving `r` inward to any `r'`. Then:
- Width strictly shrinks: `r' - l < r - l`
- Height can't exceed `h[l]` (it's the min, and `h[l]` is already the smaller one)

So **every** pair using `l` gives a smaller area than the one we just recorded. Index `l` is exhausted —
discard it. That's a whole row of the pair matrix removed in one step.

> This "prove which pointer is exhausted" argument is *the* skill for this pattern. When you meet a new
> opposite-ends problem, don't guess which pointer to move — **prove one of them can be discarded.**

---

## Example 5 — Trapping Rain Water (O(1) space)

> Water above bar `i` = `min(maxLeft[i], maxRight[i]) - h[i]`.

The O(n)-space version precomputes both arrays. The two-pointer version computes them on the fly.

```python
def trap(h):
    if not h: return 0
    l, r = 0, len(h) - 1
    left_max, right_max = h[l], h[r]
    water = 0

    while l < r:
        if left_max < right_max:
            # left_max is the binding constraint → water at l is decided
            l += 1
            left_max = max(left_max, h[l])
            water += left_max - h[l]
        else:
            r -= 1
            right_max = max(right_max, h[r])
            water += right_max - h[r]
    return water
```

**The insight:** you don't need the true `maxRight[l]`. You only need to know it's *at least*
`right_max`, and since `left_max < right_max`, the `min(...)` is definitely `left_max`. So the water
at `l` is fully determined right now. **Move whichever side is the smaller constraint.**

This is the same "prove a pointer is exhausted" reasoning as Container With Most Water. The two problems
are siblings; if one clicks, re-read the other immediately.

---

## Traps

- Forgetting `l < r` guards inside inner skip-loops → index error.
- Using `l <= r` when the pair must be distinct.
- Not sorting when the technique requires it — or sorting when the problem needs original indices.
- Duplicate skipping compared **forward** (`nums[i] == nums[i+1]`) instead of **backward**.
- Moving *both* pointers on a "less than" branch — you can skip the answer.
