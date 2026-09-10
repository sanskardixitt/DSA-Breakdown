# Two Pointers — Problem Set

---

## Core (Day 4)

### 1. Valid Palindrome 🟢
[LeetCode 125](https://leetcode.com/problems/valid-palindrome/)
- **Nudge:** skip non-alphanumeric from both ends. Keep an `l < r` guard *inside* the skip loops.
- **Follow-up:** solve it without building a cleaned copy of the string (O(1) space).

### 2. Two Sum II — Input Array Is Sorted 🟡
[LeetCode 167](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)
- **Nudge:** sum too small → the only way up is `l += 1`. Too big → `r -= 1`.
- **Compare:** why is this O(1) space while LC 1 needs O(n)? Sorted input is the whole difference.

### 3. 3Sum 🟡
[LeetCode 15](https://leetcode.com/problems/3sum/)
- **Nudge:** sort, fix `i`, then it's Two Sum II on `nums[i+1:]`.
- **The hard part is duplicates**, not the algorithm. Handle them at both levels.
- ⭐ Re-solve this on Day 10 and Day 20. It's the most-asked two-pointer problem.

### 4. Container With Most Water 🟡
[LeetCode 11](https://leetcode.com/problems/container-with-most-water/)
- **Nudge:** always move the **shorter** line. Before coding, prove to yourself why the taller one
  can't be discarded.

---

## Extension

### 5. 3Sum Closest 🟡
[LeetCode 16](https://leetcode.com/problems/3sum-closest/)
- **Nudge:** same skeleton as 3Sum, but track `abs(sum - target)` instead of exact matches.

### 6. 4Sum 🟡
[LeetCode 18](https://leetcode.com/problems/4sum/)
- **Nudge:** two nested anchors + two pointers. O(n³). Duplicate skipping at all four levels.
- Do this only after 3Sum is comfortable — it's the same lesson twice.

### 7. Trapping Rain Water 🔴
[LeetCode 42](https://leetcode.com/problems/trapping-rain-water/)
- **Nudge:** water at `i` = `min(maxLeft, maxRight) - h[i]`. First write the O(n)-space version with
  two precomputed arrays. Then convert to two pointers.
- ⭐ Solve it **both** ways. The O(n)-space version is what you'd actually say first in an interview.

### 8. Remove Duplicates from Sorted Array 🟢
[LeetCode 26](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
- **Nudge:** read/write pointers. State the invariant before you code.

### 9. Move Zeroes 🟢
[LeetCode 283](https://leetcode.com/problems/move-zeroes/)
- **Nudge:** swap, don't overwrite — that gets the zeros to the back for free.

### 10. Sort Colors 🟡
[LeetCode 75](https://leetcode.com/problems/sort-colors/)
- **Nudge:** three pointers (`low`, `mid`, `high`). After swapping with `high`, don't advance `mid`.

### 11. Squares of a Sorted Array 🟢
[LeetCode 977](https://leetcode.com/problems/squares-of-a-sorted-array/)
- **Nudge:** the largest square is at one of the two ends. Fill the output **backwards**.

### 12. Is Subsequence 🟢
[LeetCode 392](https://leetcode.com/problems/is-subsequence/)
- **Nudge:** two-array pointers, advance `i` only on a match.
- **Follow-up worth thinking about:** what if you had 10⁹ queries against the same `t`?
  (→ precompute, for each position, the next occurrence of each character.)

---

## Fast & Slow (Day 12 — after linked lists)

### 13. Linked List Cycle 🟢
[LeetCode 141](https://leetcode.com/problems/linked-list-cycle/)

### 14. Linked List Cycle II 🟡
[LeetCode 142](https://leetcode.com/problems/linked-list-cycle-ii/)
- **Nudge:** after they meet, reset one pointer to `head` and move both at speed 1.
- Derive `F = nC - a` on paper before coding. Memorising this without the proof never sticks.

### 15. Middle of the Linked List 🟢
[LeetCode 876](https://leetcode.com/problems/middle-of-the-linked-list/)

### 16. Find the Duplicate Number 🟡
[LeetCode 287](https://leetcode.com/problems/find-the-duplicate-number/)
- **Nudge:** you can't sort and you can't use a set. What structure do the constraints
  (`n+1` values in `[1, n]`) secretly describe?
- ⭐ The best "reframe the problem" exercise in the whole set.

### 17. Happy Number 🟢
[LeetCode 202](https://leetcode.com/problems/happy-number/)
- **Nudge:** "repeatedly apply f" = a linked list. Either use a set, or Floyd for O(1) space.

---

## Self-check

1. Why does two pointers require the array to be sorted for pair-sum problems?
2. In Container With Most Water, prove that moving the taller line can never improve the answer.
3. Write Floyd's cycle-entrance derivation from memory (`2(F+a) = F+a+nC` ⟹ `F = nC−a`).
4. What's the difference between the two "find the middle" templates, and when does it matter?
5. Give the read/write invariant for Move Zeroes in one sentence.
