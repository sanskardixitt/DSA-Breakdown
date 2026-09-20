# Pattern — Binary Search Trees

---

## The invariant (state it precisely, it matters)

> For **every** node: all values in the **entire left subtree** are `< node.val`, and all values in the
> **entire right subtree** are `> node.val`.

Note "entire subtree", not "immediate children". This is the #1 misunderstanding, and it's exactly the
trap in Validate BST:

```
      5
     / \
    1   6            ← locally fine at every node...
       / \
      3   7          ← but 3 < 5 and it's in the RIGHT subtree. INVALID.
```

A check that only compares parent to child accepts this tree. It shouldn't.

---

## The two superpowers

### 1. Search is O(h)
At each node you discard half the tree. `h = log n` when balanced.

### 2. Inorder traversal yields sorted order
This is the most exploitable fact about BSTs.

> **Whenever a problem mentions a BST and "kth", "sorted", "minimum difference", "range", "validate",
> or "convert to a list" — think inorder.**

---

## Core operations

### Search
```python
def search_bst(root, val):
    cur = root
    while cur:
        if val == cur.val: return cur
        cur = cur.left if val < cur.val else cur.right
    return None
```
Iterative, O(h) time, **O(1) space**. Prefer this to the recursive form for BSTs — the iteration is
natural because there's no branching to combine.

### Insert
```python
def insert_into_bst(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert_into_bst(root.left, val)
    else:
        root.right = insert_into_bst(root.right, val)
    return root
```
> **The `node.child = recurse(node.child)` idiom** is how you do structural modification cleanly —
> the child rebuilds itself and reattaches. Same shape used in delete, trim, and insert.

### Delete (the fiddly one — three cases)
```python
def delete_node(root, key):
    if not root:
        return None

    if key < root.val:
        root.left = delete_node(root.left, key)
    elif key > root.val:
        root.right = delete_node(root.right, key)
    else:
        # found it — three cases
        if not root.left:  return root.right    # 0 or 1 child
        if not root.right: return root.left     # 1 child

        # 2 children: replace with the INORDER SUCCESSOR (smallest in the right subtree)
        succ = root.right
        while succ.left:
            succ = succ.left
        root.val = succ.val
        root.right = delete_node(root.right, succ.val)   # delete the successor

    return root
```
> **Why the inorder successor?** It's the smallest value greater than the node — so it's larger than
> everything in the left subtree and smaller than everything else in the right subtree. Slotting it in
> preserves the BST invariant. (The inorder *predecessor* — largest in the left subtree — works
> equally well.)

---

## Validate BST — the range technique ⭐

The right way: pass down the **valid range** each node must fall inside.

```python
def is_valid_bst(root):
    def valid(node, lo, hi):
        if not node:
            return True
        if not (lo < node.val < hi):
            return False
        return valid(node.left,  lo, node.val) and \
               valid(node.right, node.val, hi)

    return valid(root, float('-inf'), float('inf'))
```

**Watch how the bounds narrow:**
- Going left, the *upper* bound becomes the parent's value.
- Going right, the *lower* bound becomes the parent's value.
- Neither bound is ever widened — so an ancestor's constraint reaches all the way down. That's what
  catches the `3` in the broken tree above.

> **This is the flagship top-down (preorder) pattern.** Information flows *down* as parameters, not up
> as return values. Compare with the postorder problems in
> [pattern-dfs-traversal.md](pattern-dfs-traversal.md) and notice the difference in shape.

**Alternative:** inorder traversal, check the sequence is strictly increasing.
```python
def is_valid_bst(root):
    prev = float('-inf')
    stack, cur = [], root
    while cur or stack:
        while cur:
            stack.append(cur); cur = cur.left
        cur = stack.pop()
        if cur.val <= prev: return False
        prev = cur.val
        cur = cur.right
    return True
```
Both are O(n). Know both; the range version generalises better to variants.

---

## Kth Smallest Element in a BST

Inorder + a counter. Stop as soon as you hit `k`.

```python
def kth_smallest(root, k):
    stack, cur = [], root
    while cur or stack:
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        k -= 1
        if k == 0:
            return cur.val          # early exit — don't traverse the rest
        cur = cur.right
```
O(h + k) — better than a full O(n) traversal.

> **The follow-up they always ask:** *"What if the tree is modified often and you need kth frequently?"*
> Answer: augment each node with `size_of_subtree`. Then finding the kth is O(h) — at each node,
> compare `k` with `size(left) + 1` and descend. Knowing this answer is worth memorising.

---

## Lowest Common Ancestor in a BST 🟢

The BST version is dramatically simpler than the general-tree version.

```python
def lowest_common_ancestor(root, p, q):
    cur = root
    while cur:
        if p.val < cur.val and q.val < cur.val:
            cur = cur.left            # both in the left subtree
        elif p.val > cur.val and q.val > cur.val:
            cur = cur.right           # both in the right subtree
        else:
            return cur                # they split here (or one IS cur) → this is the LCA
    return None
```
**O(h) time, O(1) space.**

**The insight:** the LCA is the first node where `p` and `q` fall on *opposite sides* (or where one of
them *is* the node). No recursion, no comparisons of subtrees.

### For a general binary tree (not a BST)
```python
def lca(root, p, q):
    if not root or root is p or root is q:
        return root
    L = lca(root.left, p, q)
    R = lca(root.right, p, q)
    if L and R:
        return root          # p and q found in different subtrees → this is the LCA
    return L or R            # both on one side (or neither) → pass it up
```
> The two are worth comparing side by side. The BST version *navigates*; the general version
> *searches everywhere and reports upward*. Same problem, completely different technique — because
> the BST gives you a direction to go and a general tree doesn't.

---

## More BST problems and their tricks

### Convert Sorted Array to a Balanced BST
```python
def sorted_array_to_bst(nums):
    def build(lo, hi):
        if lo > hi:
            return None
        mid = (lo + hi) // 2
        node = TreeNode(nums[mid])
        node.left  = build(lo, mid - 1)
        node.right = build(mid + 1, hi)
        return node
    return build(0, len(nums) - 1)
```
> Picking the middle as the root is what guarantees balance. This is binary search, run in reverse to
> *construct* rather than search.

### Minimum Absolute Difference in a BST
Inorder, and compare each value to the previous one. The closest pair is always **adjacent in inorder
order** — you never need to compare non-adjacent values.

### Trim a BST to a range `[low, high]`
```python
def trim_bst(root, low, high):
    if not root:
        return None
    if root.val < low:
        return trim_bst(root.right, low, high)   # whole left subtree is too small — drop it
    if root.val > high:
        return trim_bst(root.left, low, high)
    root.left  = trim_bst(root.left,  low, high)
    root.right = trim_bst(root.right, low, high)
    return root
```
> Note the first two branches discard an **entire subtree** in O(1). That's the BST property paying off.

### BST Iterator (LC 173)
The iterative inorder traversal, paused between calls. Keep the stack as an instance variable and push
the left spine on each `next()`. Amortised O(1) per call, O(h) space.

---

## Balanced trees (know the concept, not the code)

An unbalanced BST degenerates into a linked list — O(n) operations. Self-balancing trees fix this:

| Tree | Guarantee | Where you meet it |
|---|---|---|
| **AVL** | Strictly balanced (heights differ ≤ 1) | Read-heavy workloads |
| **Red-Black** | Loosely balanced (≤ 2× optimal height) | Java `TreeMap`, C++ `std::map`, Linux scheduler |
| **B-Tree / B+Tree** | High branching factor | Databases, filesystems — minimises disk seeks |

You will not be asked to implement these. You **may** be asked "what happens if the BST is unbalanced?"
and "what would you use in production?" — answer: O(n) degeneration, and a red-black tree
(or in Python, just a sorted list with `bisect`, or a heap if you only need min/max).

---

## Traps

- Validating with parent-child comparisons instead of inherited ranges.
- Using `<=` where the problem requires strict inequality (duplicates in a BST are usually disallowed —
  check the statement).
- Forgetting that the BST property holds for entire **subtrees**, not just direct children.
- Using the general-tree LCA when the BST version is O(1) space and four lines shorter.
- Recursing on the whole tree when the BST property lets you prune half of it.
