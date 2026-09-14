# The 30-Day Plan

**Pace:** 2–3 hours/day · **Target:** ~100 problems · **Language:** Python

Each day: *Read* the linked files → *type out* the template from memory → *solve* the problems → *log* in `PROGRESS.md`.

Legend: 🟢 Easy · 🟡 Medium · 🔴 Hard · ↻ = re-solve from a previous day (spaced repetition)

---

## Week 1 — The Linear Toolkit
> Goal: stop brute-forcing arrays. By Day 7 you should reflexively reach for a hash map, two pointers,
> a window, or binary search instead of a nested loop.

### Day 1 — Foundations
**Read:** [00-foundations/01-complexity-analysis.md](00-foundations/01-complexity-analysis.md) ·
[02-how-to-solve-a-problem.md](00-foundations/02-how-to-solve-a-problem.md) ·
[03-python-toolkit.md](00-foundations/03-python-toolkit.md)

**Do:** No LeetCode today. Instead:
- Write out the complexity table from memory.
- For 5 random problems you've seen before, write *only* the brute force + its complexity. No solving.
- Skim [CHEATSHEET.md](CHEATSHEET.md) — you'll return to it every day.

*Today is the day that makes the other 29 work. Don't skip it because it has no problems.*

---

### Day 2 — Arrays & Hashing I
**Read:** [01-arrays-hashing/notes.md](01-arrays-hashing/notes.md) ·
[pattern-hashmap-counting.md](01-arrays-hashing/pattern-hashmap-counting.md)

**Solve:** 🟢 Contains Duplicate · 🟢 Valid Anagram · 🟢 Two Sum · 🟡 Group Anagrams

---

### Day 3 — Arrays & Hashing II (Prefix Sum)
**Read:** [01-arrays-hashing/pattern-prefix-sum.md](01-arrays-hashing/pattern-prefix-sum.md)

**Solve:** 🟡 Top K Frequent Elements · 🟡 Product of Array Except Self · 🟡 Subarray Sum Equals K ·
🟡 Longest Consecutive Sequence

---

### Day 4 — Two Pointers
**Read:** [02-two-pointers/notes.md](02-two-pointers/notes.md) ·
[pattern-opposite-ends.md](02-two-pointers/pattern-opposite-ends.md)

**Solve:** 🟢 Valid Palindrome · 🟡 Two Sum II (sorted) · 🟡 3Sum · 🟡 Container With Most Water
· ↻ Two Sum

---

### Day 5 — Sliding Window I (fixed + variable)
**Read:** [03-sliding-window/notes.md](03-sliding-window/notes.md) ·
[pattern-fixed-window.md](03-sliding-window/pattern-fixed-window.md) ·
[pattern-variable-window.md](03-sliding-window/pattern-variable-window.md)

**Solve:** 🟢 Best Time to Buy and Sell Stock · 🟡 Longest Substring Without Repeating Characters ·
🟡 Longest Repeating Character Replacement

---

### Day 6 — Sliding Window II
**Read:** re-read [pattern-variable-window.md](03-sliding-window/pattern-variable-window.md)

**Solve:** 🟡 Permutation in String · 🟡 Max Consecutive Ones III · 🔴 Minimum Window Substring
· ↻ Longest Substring Without Repeating Characters

*Minimum Window Substring is the boss fight of sliding window. Give it the full 30-min rule.*

---

### Day 7 — Binary Search + Week 1 Review
**Read:** [04-binary-search/notes.md](04-binary-search/notes.md) ·
[pattern-search-space.md](04-binary-search/pattern-search-space.md)

**Solve:** 🟢 Binary Search · 🟡 Search a 2D Matrix · 🟡 Find Minimum in Rotated Sorted Array ·
🟡 Search in Rotated Sorted Array

**Review (30 min):** Re-read all Week 1 pattern files. For each, write the trigger phrase from memory.

---

## Week 2 — Structures with Shape
> Goal: get comfortable with pointers and recursion. Trees are where recursion finally clicks.

### Day 8 — Binary Search on the Answer
**Read:** [04-binary-search/pattern-binary-search-on-answer.md](04-binary-search/pattern-binary-search-on-answer.md)

**Solve:** 🟡 Koko Eating Bananas · 🟡 Capacity To Ship Packages Within D Days · 🔴 Median of Two Sorted Arrays *(attempt only, 45 min cap)*

---

### Day 9 — Stack
**Read:** [05-stack-monotonic/notes.md](05-stack-monotonic/notes.md)

**Solve:** 🟢 Valid Parentheses · 🟡 Min Stack · 🟡 Evaluate Reverse Polish Notation · 🟡 Generate Parentheses

---

### Day 10 — Monotonic Stack
**Read:** [05-stack-monotonic/pattern-monotonic-stack.md](05-stack-monotonic/pattern-monotonic-stack.md)

**Solve:** 🟡 Daily Temperatures · 🟡 Next Greater Element II · 🟡 Car Fleet · 🔴 Largest Rectangle in Histogram

*Largest Rectangle is the single highest-leverage hard problem in this repo. It teaches the entire
monotonic stack idea. Budget 45 minutes.*

---

### Day 11 — Linked List I
**Read:** [06-linked-list/notes.md](06-linked-list/notes.md) ·
[pattern-dummy-and-reversal.md](06-linked-list/pattern-dummy-and-reversal.md)

**Solve:** 🟢 Reverse Linked List · 🟢 Merge Two Sorted Lists · 🟡 Reorder List · 🟡 Remove Nth Node From End

---

### Day 12 — Linked List II (fast/slow pointers)
**Read:** [02-two-pointers/pattern-fast-slow.md](02-two-pointers/pattern-fast-slow.md)

**Solve:** 🟢 Linked List Cycle · 🟡 Find the Duplicate Number · 🟡 LRU Cache · 🟡 Copy List with Random Pointer
· ↻ Reverse Linked List

---

### Day 13 — Trees I (DFS)
**Read:** [07-trees/notes.md](07-trees/notes.md) ·
[pattern-dfs-traversal.md](07-trees/pattern-dfs-traversal.md)

**Solve:** 🟢 Invert Binary Tree · 🟢 Maximum Depth of Binary Tree · 🟢 Diameter of Binary Tree ·
🟢 Balanced Binary Tree · 🟢 Same Tree

---

### Day 14 — Trees II (BFS + BST) + Week 2 Review
**Read:** [07-trees/pattern-bfs-level-order.md](07-trees/pattern-bfs-level-order.md) ·
[pattern-bst.md](07-trees/pattern-bst.md)

**Solve:** 🟡 Binary Tree Level Order Traversal · 🟡 Right Side View · 🟢 Lowest Common Ancestor of a BST ·
🟡 Validate Binary Search Tree

**Review (30 min):** Write out, from memory, the 4 traversal templates and the BFS template.

---

## Week 3 — Recursion, Search & Graphs
> Goal: stop fearing recursion. Backtracking and graphs are the same idea wearing different hats.

### Day 15 — Trees III (harder DFS)
**Read:** re-read [07-trees/pattern-dfs-traversal.md](07-trees/pattern-dfs-traversal.md), the
"return value vs. global" section.

**Solve:** 🟡 Kth Smallest Element in a BST · 🟡 Construct Binary Tree from Preorder and Inorder ·
🔴 Binary Tree Maximum Path Sum · 🔴 Serialize and Deserialize Binary Tree

---

### Day 16 — Heaps / Priority Queue
**Read:** [08-heaps-priority-queue/notes.md](08-heaps-priority-queue/notes.md) ·
[pattern-top-k.md](08-heaps-priority-queue/pattern-top-k.md)

**Solve:** 🟢 Kth Largest Element in a Stream · 🟡 K Closest Points to Origin ·
🟡 Kth Largest Element in an Array · 🟡 Task Scheduler

---

### Day 17 — Heaps II (two-heap trick)
**Read:** [08-heaps-priority-queue/pattern-two-heaps.md](08-heaps-priority-queue/pattern-two-heaps.md)

**Solve:** 🔴 Find Median from Data Stream · 🟡 Merge K Sorted Lists · ↻ Top K Frequent Elements

---

### Day 18 — Backtracking I
**Read:** [09-backtracking/notes.md](09-backtracking/notes.md) ·
[pattern-subsets-and-combinations.md](09-backtracking/pattern-subsets-and-combinations.md)

**Solve:** 🟡 Subsets · 🟡 Combination Sum · 🟡 Subsets II · 🟡 Combination Sum II

---

### Day 19 — Backtracking II
**Read:** [09-backtracking/pattern-permutations.md](09-backtracking/pattern-permutations.md)

**Solve:** 🟡 Permutations · 🟡 Word Search · 🟡 Palindrome Partitioning · 🔴 N-Queens

---

### Day 20 — Graphs I (grid DFS/BFS)
**Read:** [10-graphs/notes.md](10-graphs/notes.md) ·
[pattern-grid-traversal.md](10-graphs/pattern-grid-traversal.md)

**Solve:** 🟡 Number of Islands · 🟡 Max Area of Island · 🟡 Clone Graph · 🟡 Rotting Oranges

---

### Day 21 — Graphs II (topological sort) + Week 3 Review
**Read:** [10-graphs/pattern-topological-sort.md](10-graphs/pattern-topological-sort.md)

**Solve:** 🟡 Course Schedule · 🟡 Course Schedule II · 🟡 Pacific Atlantic Water Flow · 🟡 Surrounded Regions

**Review (30 min):** Write the backtracking skeleton and the BFS/DFS grid skeleton from memory.

---

## Week 4 — Dynamic Programming & Closing Gaps
> Goal: DP stops being magic. It's just recursion + a dictionary.

### Day 22 — Graphs III (Union-Find + shortest path)
**Read:** [10-graphs/pattern-union-find.md](10-graphs/pattern-union-find.md) ·
[pattern-dijkstra.md](10-graphs/pattern-dijkstra.md)

**Solve:** 🟡 Number of Connected Components · 🟡 Redundant Connection · 🟡 Network Delay Time

---

### Day 23 — DP I (1-D)
**Read:** [11-dynamic-programming/notes.md](11-dynamic-programming/notes.md) ·
[pattern-1d-dp.md](11-dynamic-programming/pattern-1d-dp.md)

**Solve:** 🟢 Climbing Stairs · 🟢 Min Cost Climbing Stairs · 🟡 House Robber · 🟡 House Robber II

---

### Day 24 — DP II (strings & expansion)
**Read:** [11-dynamic-programming/pattern-string-dp.md](11-dynamic-programming/pattern-string-dp.md)

**Solve:** 🟡 Longest Palindromic Substring · 🟡 Palindromic Substrings · 🟡 Decode Ways ·
🟡 Word Break

---

### Day 25 — DP III (knapsack family)
**Read:** [11-dynamic-programming/pattern-knapsack.md](11-dynamic-programming/pattern-knapsack.md)

**Solve:** 🟡 Coin Change · 🟡 Coin Change II · 🟡 Partition Equal Subset Sum · 🟡 Target Sum

---

### Day 26 — DP IV (LIS + 2-D grid)
**Read:** [11-dynamic-programming/pattern-lis.md](11-dynamic-programming/pattern-lis.md) ·
[pattern-2d-grid-dp.md](11-dynamic-programming/pattern-2d-grid-dp.md)

**Solve:** 🟡 Longest Increasing Subsequence · 🟡 Unique Paths · 🟡 Longest Common Subsequence ·
🟡 Maximum Product Subarray

---

### Day 27 — Greedy & Intervals
**Read:** [12-greedy-intervals/notes.md](12-greedy-intervals/notes.md) ·
[pattern-intervals.md](12-greedy-intervals/pattern-intervals.md)

**Solve:** 🟡 Maximum Subarray · 🟡 Jump Game · 🟡 Jump Game II · 🟡 Insert Interval ·
🟡 Non-overlapping Intervals

---

### Day 28 — Bit Manipulation + Math
**Read:** [13-bit-manipulation/notes.md](13-bit-manipulation/notes.md)

**Solve:** 🟢 Single Number · 🟢 Number of 1 Bits · 🟢 Counting Bits · 🟡 Reverse Bits ·
🟡 Sum of Two Integers · 🟢 Missing Number

---

### Day 29 — Full Review Day
**No new problems.**

1. Read [CHEATSHEET.md](CHEATSHEET.md) end to end.
2. Go through `PROGRESS.md`. Re-solve **every problem still marked ⚠**. Timed, from scratch.
3. For each of the 13 topics, write one sentence: *"I use this when the problem says ___."*
   If you can't, re-read that `notes.md`.

---

### Day 30 — Mock Interview Day
Set a timer. Pick 4 problems you have **never seen** (LeetCode "Random Medium").

- 35 minutes each, hard stop.
- Talk out loud: restate → brute force → complexity → optimise → code → test with an example.
- Write nothing down until you've said the approach out loud.

Then score yourself honestly on: *Did I identify the pattern within 5 minutes?* That number — not the
pass rate — is the metric that matters.

---

## After Day 30

You now have the foundation. The next phase is volume + variety:

1. **Blind 75 / NeetCode 150** — you've done ~70% of it already. Finish the rest.
2. **Weekly LeetCode contests.** Nothing exposes gaps faster than a live timer.
3. **Keep the ⚠ re-solve loop running.** It is the highest-return habit you'll build here.
4. **Revisit `TEMPLATES.md` weekly** for 10 minutes. Templates decay fast if unused.
