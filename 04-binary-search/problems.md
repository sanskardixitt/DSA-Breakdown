# Binary Search — Problem Set

---

## Core (Day 7)

### 1. Binary Search 🟢
[LeetCode 704](https://leetcode.com/problems/binary-search/)
- Write it **three times**: Template 1 (`lo <= hi`), Template 2 (`lo < hi`), and with `bisect`.
- Then hand-trace all three on `n = 1` and `n = 2`.

### 2. Search Insert Position 🟢
[LeetCode 35](https://leetcode.com/problems/search-insert-position/)
- **Nudge:** predicate is `nums[i] >= target`. This is `bisect_left`, by hand.

### 3. Search a 2D Matrix 🟡
[LeetCode 74](https://leetcode.com/problems/search-a-2d-matrix/)
- **Nudge:** treat it as one flat sorted array. `row = idx // C`, `col = idx % C`.

### 4. Find Minimum in Rotated Sorted Array 🟡
[LeetCode 153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)
- **Trap:** compare `nums[mid]` to `nums[hi]`, **not** `nums[lo]`. Test on a non-rotated array to see
  why.

### 5. Search in Rotated Sorted Array 🟡
[LeetCode 33](https://leetcode.com/problems/search-in-rotated-sorted-array/)
- **Nudge:** first determine which half is sorted, *then* ask whether the target lies in its range.
- Don't try to reason about both halves simultaneously — that's how this gets confusing.

---

## Binary search on the answer (Day 8) ⭐

### 6. Koko Eating Bananas 🟡
[LeetCode 875](https://leetcode.com/problems/koko-eating-bananas/)
- **Nudge:** the answer is a *speed*, not an index. `lo = 1`, `hi = max(piles)`.
- Use `(p + k - 1) // k` for ceiling division.

### 7. Capacity To Ship Packages Within D Days 🟡
[LeetCode 1011](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)
- **Nudge:** `lo = max(weights)` — why not 1? Answer that before coding.

### 8. Split Array Largest Sum 🔴
[LeetCode 410](https://leetcode.com/problems/split-array-largest-sum/)
- **Nudge:** identical structure to #7. If you solved that, you can write this in five minutes.
  Recognising that is the point of the exercise.

### 9. Minimum Number of Days to Make m Bouquets 🟡
[LeetCode 1482](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/)
- **Nudge:** binary search the *day*. The checker is a simple adjacency-run sweep.

### 10. Magnetic Force Between Two Balls 🟡
[LeetCode 1552](https://leetcode.com/problems/magnetic-force-between-two-balls/)
- **Nudge:** "maximise the minimum" → the branch flip. Remember `mid = (lo+hi+1)//2` pairs with
  `lo = mid`.

---

## Extension

### 11. Find First and Last Position of Element in Sorted Array 🟡
[LeetCode 34](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
- **Nudge:** write `lower_bound` once. Then `last = lower_bound(target+1) - 1`.

### 12. Find Peak Element 🟡
[LeetCode 162](https://leetcode.com/problems/find-peak-element/)
- **Nudge:** unsorted, and binary search still works. Compare `nums[mid]` to `nums[mid+1]`.
- ⭐ Best single problem for internalising "monotone predicate, not sorted array".

### 13. Time Based Key-Value Store 🟡
[LeetCode 981](https://leetcode.com/problems/time-based-key-value-store/)
- **Nudge:** `dict: key -> list of (timestamp, value)`, appended in increasing time.
  Then `bisect_right` on the timestamps and step back one.

### 14. Search a 2D Matrix II 🟡
[LeetCode 240](https://leetcode.com/problems/search-a-2d-matrix-ii/)
- **Nudge:** you can **not** flatten this one. Start at the top-right corner: too big → left,
  too small → down. O(R + C).
- Compare with #3 and articulate the difference in guarantees.

### 15. Kth Smallest Element in a Sorted Matrix 🟡
[LeetCode 378](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)
- **Nudge:** binary search on the **value** range `[matrix[0][0], matrix[-1][-1]]`. The checker counts
  how many elements are ≤ mid, using the staircase walk from #14.

### 16. Median of Two Sorted Arrays 🔴
[LeetCode 4](https://leetcode.com/problems/median-of-two-sorted-arrays/)
- **Nudge:** binary search the *partition point* of the smaller array.
- 45-minute cap. Understand the partition idea; don't grind to a finish.

### 17. Sqrt(x) 🟢
[LeetCode 69](https://leetcode.com/problems/sqrt-x/)
- **Nudge:** the simplest possible binary-search-on-answer. Good confidence builder.

---

## Self-check

1. Which `mid` formula pairs with `hi = mid`? Which with `lo = mid`? What breaks if you swap them?
2. State binary search's actual precondition in one sentence (hint: not "sorted array").
3. In Find Minimum in Rotated Sorted Array, why compare to `nums[hi]`?
4. For Koko Eating Bananas, what are `lo` and `hi`, and why?
5. What single question tells you a problem is "binary search on the answer"?
6. When can you flatten a 2-D matrix into a 1-D binary search, and when can't you?
