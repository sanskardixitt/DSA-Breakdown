# Heaps / Priority Queue — Problem Set

---

## Core (Day 16)

### 1. Kth Largest Element in a Stream 🟢
[LeetCode 703](https://leetcode.com/problems/kth-largest-element-in-a-stream/)
- **Nudge:** min-heap capped at size k. `h[0]` is the answer.
- **Why a heap here and not sorting?** Answer that before coding — it's the point of the problem.

### 2. K Closest Points to Origin 🟡
[LeetCode 973](https://leetcode.com/problems/k-closest-points-to-origin/)
- **Nudge:** K *smallest* → max-heap of size K. Skip the `sqrt`.

### 3. Kth Largest Element in an Array 🟡
[LeetCode 215](https://leetcode.com/problems/kth-largest-element-in-an-array/)
- **Do both:** the O(n log k) heap and O(n)-average quickselect.
- Be able to state when each is preferable.

### 4. Task Scheduler 🟡
[LeetCode 621](https://leetcode.com/problems/task-scheduler/)
- **Nudge:** greedily run the most-frequent available task. Max-heap + a cooldown queue.
- **Also derive the math formula** — it's a good "can you see the structure" exercise.

### 5. Top K Frequent Elements 🟡
[LeetCode 347](https://leetcode.com/problems/top-k-frequent-elements/)
- Revisit from Day 3, now with the heap framing. Compare against bucket sort.

---

## Two heaps (Day 17)

### 6. Find Median from Data Stream 🔴
[LeetCode 295](https://leetcode.com/problems/find-median-from-data-stream/)
- **Nudge:** max-heap for the low half, min-heap for the high half. Push → fix order → fix balance.
- Write those three steps as three separate blocks. Don't try to merge them.
- ⭐ Very commonly asked. Know it cold.

### 7. Merge K Sorted Lists 🔴
[LeetCode 23](https://leetcode.com/problems/merge-k-sorted-lists/)
- **Nudge:** heap of the k current heads. Push `(val, counter, node)` — the counter is mandatory.
- **Also write** the divide-and-conquer pairwise merge version.

---

## Extension

### 8. Last Stone Weight 🟢
[LeetCode 1046](https://leetcode.com/problems/last-stone-weight/)
- **Nudge:** max-heap, repeatedly pop two and push the difference. The gentlest heap problem there is.

### 9. Meeting Rooms II 🟡
[LeetCode 253](https://leetcode.com/problems/meeting-rooms-ii/) *(premium — also on NeetCode)*
- **Nudge:** sort by start, min-heap of end times. The heap size *is* the answer.
- ⭐ The archetype for "process events in order, heap tracks what's active".

### 10. Reorganize String 🟡
[LeetCode 767](https://leetcode.com/problems/reorganize-string/)
- **Nudge:** always place the most frequent *available* character. Hold the previous one aside for one
  round so it can't repeat. Same "heap + cooldown" shape as Task Scheduler.

### 11. Design Twitter 🟡
[LeetCode 355](https://leetcode.com/problems/design-twitter/)
- **Nudge:** each user keeps a list of `(timestamp, tweet)`. For the feed, merge the k most recent
  from every followee with a heap. Essentially Merge K Sorted Lists in disguise.

### 12. Sliding Window Median 🔴
[LeetCode 480](https://leetcode.com/problems/sliding-window-median/)
- **Nudge:** two heaps + **lazy deletion** (a `to_remove` counter, pruned at the roots).
- Attempt only after LC 295 is comfortable.

### 13. IPO 🔴
[LeetCode 502](https://leetcode.com/problems/ipo/)
- **Nudge:** one structure ordered by *eligibility* (capital), one by *value* (profit). Migrate as
  your capital grows, then greedily take the best.

### 14. Find K Pairs with Smallest Sums 🟡
[LeetCode 373](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)
- **Nudge:** don't push all `n×m` pairs. Seed the heap with `(nums1[i], nums2[0])` for each `i`, and
  when you pop `(i, j)` push `(i, j+1)`. The frontier stays small.
- ⭐ Good introduction to "expand the frontier lazily", which is how you handle huge implicit search
  spaces.

### 15. Single-Threaded CPU 🟡
[LeetCode 1834](https://leetcode.com/problems/single-threaded-cpu/)
- **Nudge:** sort tasks by enqueue time; a min-heap holds the *available* ones ordered by processing
  time. Advance the clock when the heap is empty.

---

## Self-check

1. Why is `heapify` O(n) rather than O(n log n)?
2. To keep the K **largest** elements, do you use a min-heap or a max-heap? Explain in one sentence.
3. What's the tuple-comparison trap, and how do you avoid it?
4. When is a heap strictly better than quickselect, and when is quickselect better?
5. State the two invariants of the two-heap median structure.
6. How do you delete an arbitrary element from a heap?
7. Why does the heap size answer Meeting Rooms II directly?
