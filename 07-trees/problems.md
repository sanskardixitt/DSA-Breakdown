# Trees — Problem Set

---

## Core DFS (Day 13)

Do all five in one session. They're easy individually; the point is the **reflex** of writing a
recursive tree function without hesitating.

### 1. Invert Binary Tree 🟢
[LeetCode 226](https://leetcode.com/problems/invert-binary-tree/)
- **Nudge:** swap the children, recurse. Three lines.

### 2. Maximum Depth of Binary Tree 🟢
[LeetCode 104](https://leetcode.com/problems/maximum-depth-of-binary-tree/)
- **Nudge:** `1 + max(left, right)`. Then write the BFS version too.

### 3. Diameter of Binary Tree 🟢
[LeetCode 543](https://leetcode.com/problems/diameter-of-binary-tree/)
- **Nudge:** the helper returns *height*; a `nonlocal` variable records the *answer*.
- ⭐ The first "return one thing, record another" problem. Make sure you can articulate why the
  returned value is `1 + max(L, R)` but the recorded value is `L + R`.

### 4. Balanced Binary Tree 🟢
[LeetCode 110](https://leetcode.com/problems/balanced-binary-tree/)
- **Nudge:** the naive version is O(n²). Return `-1` as an "unbalanced" sentinel to get O(n).

### 5. Same Tree 🟢
[LeetCode 100](https://leetcode.com/problems/same-tree/)
- **Nudge:** the three-line base case (both null / one null / values differ).

### 6. Subtree of Another Tree 🟢
[LeetCode 572](https://leetcode.com/problems/subtree-of-another-tree/)
- **Nudge:** at every node of the big tree, run `isSameTree`. O(m·n) and that's acceptable here.

---

## BFS & BST (Day 14)

### 7. Binary Tree Level Order Traversal 🟡
[LeetCode 102](https://leetcode.com/problems/binary-tree-level-order-traversal/)
- **Nudge:** `level_size = len(q)` before the inner loop. That one line is the pattern.
- ⭐ Memorise this template — six more problems are variations of it.

### 8. Binary Tree Right Side View 🟡
[LeetCode 199](https://leetcode.com/problems/binary-tree-right-side-view/)
- **Nudge:** take the last node of each level (`i == n - 1`).

### 9. Lowest Common Ancestor of a BST 🟢
[LeetCode 235](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)
- **Nudge:** walk down; the LCA is the first node where `p` and `q` split. Iterative, O(1) space.

### 10. Validate Binary Search Tree 🟡
[LeetCode 98](https://leetcode.com/problems/validate-binary-search-tree/)
- **Nudge:** pass `(lo, hi)` bounds *down*. Comparing only parent to child is wrong — construct the
  counterexample yourself before coding.
- ⭐ The flagship top-down/preorder problem.

---

## Harder DFS (Day 15)

### 11. Kth Smallest Element in a BST 🟡
[LeetCode 230](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)
- **Nudge:** iterative inorder + a counter, returning early at `k`.
- **Be ready for the follow-up:** frequent modifications → augment nodes with subtree sizes.

### 12. Construct Binary Tree from Preorder and Inorder Traversal 🟡
[LeetCode 105](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
- **Nudge:** `preorder[0]` is the root; find it in `inorder` to split left from right.
- **Trap:** build left before right (shared preorder cursor). Use an index map or it's O(n²).

### 13. Binary Tree Maximum Path Sum 🔴
[LeetCode 124](https://leetcode.com/problems/binary-tree-maximum-path-sum/)
- **Nudge:** `max(gain, 0)` — never take a negative branch. Record `node.val + L + R`, return
  `node.val + max(L, R)`.
- ⭐⭐ The hardest common tree problem. Budget 40 minutes.

### 14. Serialize and Deserialize Binary Tree 🔴
[LeetCode 297](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)
- **Nudge:** preorder with `#` for nulls. Deserialise with an *iterator* over the tokens.
- **Understand why** null markers are required — preorder alone is ambiguous.

### 15. Lowest Common Ancestor of a Binary Tree 🟡
[LeetCode 236](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)
- **Nudge:** if both subtrees return something, you're the LCA. Otherwise pass up whatever you found.
- Compare with #9 and articulate why the BST version is completely different.

---

## Extension

### 16. Symmetric Tree 🟢
[LeetCode 101](https://leetcode.com/problems/symmetric-tree/)
- **Nudge:** compare `a.left` with `b.right` and `a.right` with `b.left`.

### 17. Path Sum 🟢 / Path Sum II 🟡
[LeetCode 112](https://leetcode.com/problems/path-sum/) ·
[LeetCode 113](https://leetcode.com/problems/path-sum-ii/)
- **Trap:** the base case is a **leaf** check, not a null check.
- In II: append `path[:]` (a copy) and remember to `pop()` on the way out.

### 18. Path Sum III 🟡
[LeetCode 437](https://leetcode.com/problems/path-sum-iii/)
- **Nudge:** paths can start anywhere. Prefix sum + hash map — the *same technique* as LC 560, applied
  along a root-to-node path. Add on the way down, remove on the way back up.
- ⭐ Excellent cross-pattern problem. Very satisfying once you see it.

### 19. Count Good Nodes in Binary Tree 🟡
[LeetCode 1448](https://leetcode.com/problems/count-good-nodes-in-binary-tree/)
- **Nudge:** carry `max_so_far` *down* the path. Classic top-down.

### 20. Binary Tree Zigzag Level Order 🟡
[LeetCode 103](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/)
- **Nudge:** reverse the collected level list, not the traversal.

### 21. Minimum Depth of Binary Tree 🟢
[LeetCode 111](https://leetcode.com/problems/minimum-depth-of-binary-tree/)
- **Nudge:** BFS with early exit. Explain why it beats DFS here.
- **Trap (DFS version):** a node with one child is not a leaf — you can't just take `min(L, R)`.

### 22. Convert Sorted Array to Binary Search Tree 🟢
[LeetCode 108](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/)
- **Nudge:** the middle element is the root. Recurse on the halves.

### 23. Flatten Binary Tree to Linked List 🟡
[LeetCode 114](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/)
- **Nudge:** reverse-preorder (right → left → node), keeping a `prev` pointer. Elegant once seen.

### 24. Implement Trie (Prefix Tree) 🟡
[LeetCode 208](https://leetcode.com/problems/implement-trie-prefix-tree/)
- Not a binary tree, but it belongs here. `children: dict` + `is_end: bool` per node.
- **Trigger for tries:** "prefix", "autocomplete", "dictionary of words", "word search in a grid with
  many words". Needed for LC 212 (Word Search II).

---

## Self-check

1. When do you use preorder vs postorder vs inorder vs BFS? One sentence each.
2. In Diameter, why is the return value `1 + max(L, R)` but the recorded answer `L + R`?
3. Write the BFS level-order template from memory. What does `level_size = len(q)` do?
4. Why is comparing only parent-to-child insufficient for validating a BST?
5. Why is BFS strictly better than DFS for Minimum Depth?
6. What's the space complexity of DFS vs BFS on (a) a balanced tree, (b) a skewed tree?
