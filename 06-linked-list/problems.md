# Linked Lists — Problem Set

> **Rule for this topic: draw the list on paper before writing any code.** Boxes and arrows, 4 nodes,
> pointer names labelled. Every single problem. It halves your bug rate.

---

## Core (Day 11)

### 1. Reverse Linked List 🟢
[LeetCode 206](https://leetcode.com/problems/reverse-linked-list/)
- **Nudge:** `prev`, `cur`, `nxt`. Save-flip-advance-advance.
- Write both iterative and recursive. Say the space complexity of each.
- ⭐ Retype this from memory every day for a week. It's the base of five other problems.

### 2. Merge Two Sorted Lists 🟢
[LeetCode 21](https://leetcode.com/problems/merge-two-sorted-lists/)
- **Nudge:** dummy + `tail`. Finish with `tail.next = l1 or l2`.

### 3. Reorder List 🟡
[LeetCode 143](https://leetcode.com/problems/reorder-list/)
- **Nudge:** find middle → reverse second half → interleave.
- **Trap:** `slow.next = None` before reversing, or you build a cycle.

### 4. Remove Nth Node From End of List 🟡
[LeetCode 19](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)
- **Nudge:** dummy + gap of `n`. Loop `while fast.next` so `slow` lands on the *predecessor*.

---

## Fast & slow (Day 12)

### 5. Linked List Cycle 🟢
[LeetCode 141](https://leetcode.com/problems/linked-list-cycle/)

### 6. Linked List Cycle II 🟡
[LeetCode 142](https://leetcode.com/problems/linked-list-cycle-ii/)
- Derive `F = nC − a` on paper first. See
  [../02-two-pointers/pattern-fast-slow.md](../02-two-pointers/pattern-fast-slow.md).

### 7. Find the Duplicate Number 🟡
[LeetCode 287](https://leetcode.com/problems/find-the-duplicate-number/)
- **Nudge:** `i → nums[i]` is a linked list. The duplicate is the cycle entrance.

### 8. LRU Cache 🟡
[LeetCode 146](https://leetcode.com/problems/lru-cache/)
- **Nudge:** doubly linked list (recency order) + hash map (`key → node`). Two dummy sentinels
  (`head`/`tail`) remove every null check.
- **The insight:** the hash map gives O(1) *find*; the DLL gives O(1) *move-to-front* and *evict-tail*.
  Neither alone is enough. This is *the* classic "compose two structures" problem.
- ⭐ Very frequently asked. Write helper methods `_remove(node)` and `_insert_front(node)`.

### 9. Copy List with Random Pointer 🟡
[LeetCode 138](https://leetcode.com/problems/copy-list-with-random-pointer/)
- **Nudge:** two passes with a `dict: old_node → new_node`. First pass creates the nodes, second wires
  `next` and `random`.
- **Follow-up:** the O(1)-space version interleaves copies into the original list, then splits.

---

## Extension

### 10. Palindrome Linked List 🟢
[LeetCode 234](https://leetcode.com/problems/palindrome-linked-list/)
- **Nudge:** O(n) space is trivial (copy to a list). Do the O(1)-space version: middle + reverse +
  compare.

### 11. Add Two Numbers 🟡
[LeetCode 2](https://leetcode.com/problems/add-two-numbers/)
- **Nudge:** dummy + carry. Loop `while l1 or l2 or carry` — that last condition catches the final
  carry-out.

### 12. Remove Duplicates from Sorted List II 🟡
[LeetCode 82](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/)
- **Nudge:** remove *all* copies of a duplicated value, not just the extras. Dummy is essential here.

### 13. Reverse Linked List II 🟡
[LeetCode 92](https://leetcode.com/problems/reverse-linked-list-ii/)
- **Nudge:** name the four boundary nodes on paper before coding.

### 14. Odd Even Linked List 🟡
[LeetCode 328](https://leetcode.com/problems/odd-even-linked-list/)
- **Nudge:** two chains built simultaneously, joined at the end.

### 15. Merge K Sorted Lists 🔴
[LeetCode 23](https://leetcode.com/problems/merge-k-sorted-lists/)
- **Two solutions to know:**
  - Min-heap of the k current heads → O(N log k)
  - Repeated pairwise merging (divide & conquer) → O(N log k), no heap needed
- **Heap trap:** `ListNode` isn't comparable. Push `(val, unique_counter, node)`.

### 16. Sort List 🟡
[LeetCode 148](https://leetcode.com/problems/sort-list/)
- **Nudge:** merge sort. Split at the middle (fast/slow), recurse, merge with #2.
- The one place merge sort on lists genuinely beats arrays: O(1) extra space for the merge.

### 17. Swap Nodes in Pairs 🟡
[LeetCode 24](https://leetcode.com/problems/swap-nodes-in-pairs/)
- **Nudge:** `reverse_k_group` with `k = 2`. Or write it directly with a dummy.

### 18. Reverse Nodes in k-Group 🔴
[LeetCode 25](https://leetcode.com/problems/reverse-nodes-in-k-group/)
- **Nudge:** check that `k` nodes remain *before* reversing. Seed `prev = group_next` so the tail
  links itself.
- Attempt after #13 is comfortable.

---

## Self-check

1. When do you need a dummy node? Give three distinct situations.
2. Write the four-line reversal from memory. What breaks if you swap lines ① and ②?
3. In Reorder List, what happens if you skip `slow.next = None`?
4. Why does LRU Cache need *both* a hash map and a doubly linked list?
5. What's the difference between `while cur` and `while cur.next`, and when does each apply?
6. Which two "find the middle" templates exist, and which does Reorder List need?
