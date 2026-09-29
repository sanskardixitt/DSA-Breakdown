# Greedy & Intervals — Problem Set

---

## Core (Day 27)

### 1. Maximum Subarray 🟡
[LeetCode 53](https://leetcode.com/problems/maximum-subarray/)
- **Nudge:** Kadane's — `cur = max(x, cur + x)`. A negative running sum can only hurt what follows.
- **Follow-up:** return the actual subarray indices, not just the sum.

### 2. Jump Game 🟡
[LeetCode 55](https://leetcode.com/problems/jump-game/)
- **Nudge:** track the furthest reachable index. Fail as soon as `i > reach`.
- **Why is greedy safe here?** Because only reachability matters, not the route. Say it out loud.

### 3. Jump Game II 🟡
[LeetCode 45](https://leetcode.com/problems/jump-game-ii/)
- **Nudge:** `cur_end` is a level boundary — this is BFS in disguise.

### 4. Insert Interval 🟡
[LeetCode 57](https://leetcode.com/problems/insert-interval/)
- **Nudge:** three phases — before, overlapping, after. Three simple loops, not one clever one.

### 5. Non-overlapping Intervals 🟡
[LeetCode 435](https://leetcode.com/problems/non-overlapping-intervals/)
- **Nudge:** sort by **END**. Minimum removals = total − maximum kept.
- **Construct the counterexample** showing why sorting by start fails. Do this before coding.
- ⭐ The central idea of the whole interval family.

---

## Extension — intervals

### 6. Merge Intervals 🟡
[LeetCode 56](https://leetcode.com/problems/merge-intervals/)
- **Nudge:** sort by **START**, extend or append.
- **Trap:** `max(...)` for the new end, or nested intervals break it.

### 7. Meeting Rooms 🟢
[LeetCode 252](https://leetcode.com/problems/meeting-rooms/) *(premium — also on NeetCode)*
- **Nudge:** sort by start, check adjacent pairs. Two lines.

### 8. Meeting Rooms II 🟡
[LeetCode 253](https://leetcode.com/problems/meeting-rooms-ii/) *(premium — also on NeetCode)*
- **Do both:** min-heap of end times, and the sweep line.
- ⭐ Very frequently asked. The heap version is the one to present first.

### 9. Minimum Number of Arrows to Burst Balloons 🟡
[LeetCode 452](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)
- **Nudge:** it's LC 435 with one comparison operator changed. Work out which, and why.

### 10. Car Pooling 🟡
[LeetCode 1094](https://leetcode.com/problems/car-pooling/)
- **Nudge:** sweep line, or a difference array over the location axis.

### 11. Employee Free Time 🔴
[LeetCode 759](https://leetcode.com/problems/employee-free-time/) *(premium)*
- **Nudge:** flatten everything, merge (LC 56), and the **gaps** are the answer.

### 12. My Calendar I 🟡
[LeetCode 729](https://leetcode.com/problems/my-calendar-i/)
- **Nudge:** keep bookings sorted; `bisect` to find the insertion point and check the neighbours.

---

## Extension — greedy

### 13. Gas Station 🟡
[LeetCode 134](https://leetcode.com/problems/gas-station/)
- **Nudge:** if the tank goes negative at `i`, no start between `start` and `i` works either.
  Restart at `i + 1`.
- **Be able to justify that skip** — it's the whole reason this is O(n).

### 14. Partition Labels 🟡
[LeetCode 763](https://leetcode.com/problems/partition-labels/)
- **Nudge:** precompute each character's last occurrence, extend the boundary, cut when you reach it.

### 15. Hand of Straights 🟡
[LeetCode 846](https://leetcode.com/problems/hand-of-straights/)
- **Nudge:** always start a group at the **smallest remaining** card — it has no other option.
  `Counter` + a min-heap (or a sorted key scan).

### 16. Merge Triplets to Form Target Triplet 🟡
[LeetCode 1899](https://leetcode.com/problems/merge-triplets-to-form-target-triplet/)
- **Nudge:** discard any triplet that exceeds the target in *any* position — it can never help.
  Then check the remaining maxima.

### 17. Valid Parenthesis String 🟡
[LeetCode 678](https://leetcode.com/problems/valid-parenthesis-string/)
- **Nudge:** track a **range** `[min_open, max_open]` of possible open-paren counts rather than a
  single value. Clamp `min_open` at 0.
- ⭐ A lovely "track an interval of possibilities instead of one value" trick.

### 18. Largest Number 🟡
[LeetCode 179](https://leetcode.com/problems/largest-number/)
- **Nudge:** custom comparator — `a` before `b` iff `a + b > b + a` as strings.
- **Trap:** an all-zeros input must return `"0"`, not `"000"`.

### 19. Task Scheduler 🟡
[LeetCode 621](https://leetcode.com/problems/task-scheduler/)
- Revisit from Day 16, now from the greedy angle. Derive the closed-form formula.

### 20. Boats to Save People 🟡
[LeetCode 881](https://leetcode.com/problems/boats-to-save-people/)
- **Nudge:** sort, then two pointers — pair the heaviest with the lightest if they fit together.

---

## Self-check

1. What two properties must hold for greedy to be correct?
2. Give the coin counterexample where greedy fails, with the numbers.
3. Sort by **start** or by **end** — which for merging, which for selecting? Why?
4. Sketch the exchange argument for activity selection.
5. In Gas Station, why can you skip every station between `start` and the failure point?
6. In a sweep line, why does the end event need to be processed before a start event at the same time?
7. When is Jump Game II better solved as BFS, and why are they the same algorithm?
