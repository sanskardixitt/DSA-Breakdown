# Trees — Notes

Trees are where recursion finally clicks for most people. If you can write a tree DFS without thinking,
graphs, backtracking, and DP all become significantly easier.

---

## The node

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

---

## Vocabulary (worth being precise about)

- **Height of a node** — edges on the longest path down to a leaf. A leaf has height 0.
- **Depth of a node** — edges from the root down to it. The root has depth 0.
- **Height of the tree** = height of the root.
- **Balanced** — for every node, `|height(left) - height(right)| <= 1`.
- **Complete** — every level full except possibly the last, which is filled left to right.
- **Perfect** — every level completely full. `n = 2^(h+1) - 1`.
- **BST** — for every node: all values in the left subtree `<` node `<` all values in the right subtree.

> ⚠ LeetCode problems sometimes define height/depth in **nodes** rather than edges (Maximum Depth
> returns 1 for a single node). Read the examples, don't assume.

**Why height matters:** almost every tree operation is O(h). Balanced → O(log n). Degenerate (a
linked list) → O(n). That gap is the entire motivation for AVL/Red-Black trees.

---

## The single most important idea

> **A tree is a recursive structure, so write recursive solutions. Ask: "if I already had the answer
> for my left and right subtrees, could I compute my own answer?"**

That's it. That question solves most tree problems.

```python
def solve(node):
    if not node:
        return <base case>              # ① what does an empty tree mean here?

    left  = solve(node.left)            # ② trust the recursion
    right = solve(node.right)

    return <combine left, right, node.val>   # ③ combine
```

**Trust the recursion.** Do not try to trace the call stack in your head — you'll drown. Assume the
recursive calls return the right answer, and just write the combine step. This mental discipline is
the skill; everything else is detail.

---

## The four traversals

```
        1
       / \
      2   3
     / \
    4   5
```

| Traversal | Order | Result | Use for |
|---|---|---|---|
| **Preorder** | node, left, right | `1 2 4 5 3` | Copying/serialising a tree, top-down info flow |
| **Inorder** | left, node, right | `4 2 5 1 3` | **BST → sorted order** |
| **Postorder** | left, right, node | `4 5 2 3 1` | Bottom-up aggregation (height, deletion, sums) |
| **Level order** | BFS by depth | `1 2 3 4 5` | Levels, shortest path, "closest" |

**The naming rule:** the word describes *when the node itself is visited* relative to its children.
Pre = before, in = between, post = after.

> **Choosing between them is a real decision, not a formality:**
> - Need info from **children** (height, subtree sums, "is this subtree valid") → **postorder**
> - Need info from **parents** (path so far, valid value range) → **preorder** with parameters
> - Need **sorted order** from a BST → **inorder**
> - Need **level/depth/shortest** → **BFS**

---

## Recognition triggers

| Statement says... | Approach |
|---|---|
| "maximum depth / height" | Postorder DFS |
| "is it balanced" | Postorder DFS returning height, `-1` as an invalid sentinel |
| "diameter", "longest path" | Postorder returning height, global max updated in-place |
| "path sum from root to leaf" | Preorder DFS carrying the running sum |
| "all root-to-leaf paths" | Preorder DFS + backtracking |
| "level order", "zigzag", "right side view" | **BFS** |
| "minimum depth" | **BFS** (early exit at the first leaf) |
| "validate BST" | Preorder DFS carrying `(lo, hi)` bounds |
| "kth smallest in a BST" | **Inorder** traversal with a counter |
| "lowest common ancestor" | Postorder (general tree) or BST property |
| "serialize / deserialize" | Preorder with null markers |
| "construct from traversals" | Recursive split using an index map |
| "same tree", "subtree of another", "symmetric" | Simultaneous recursion on two nodes |

---

## Return value vs. global variable (the distinction that trips people)

Some problems need **two different things**:
- a value to *return up* to the parent, and
- a running *global answer*

**Diameter of a Binary Tree** is the canonical case:

```python
def diameter_of_binary_tree(root):
    best = 0

    def height(node):
        nonlocal best
        if not node:
            return 0
        L = height(node.left)
        R = height(node.right)
        best = max(best, L + R)        # ← the ANSWER: a path THROUGH this node
        return 1 + max(L, R)           # ← the RETURN: a path going UP through this node

    height(root)
    return best
```

**Why they differ:** a path *through* a node uses both subtrees (`L + R`). But a path that continues
*upward* to the parent can only use one side (`max(L, R)`), because a path can't fork.

> **This "return one thing, record another" shape is everywhere:**
> Binary Tree Maximum Path Sum, Longest Univalue Path, Longest ZigZag Path, House Robber III.
> When a problem asks for "the best path anywhere in the tree", expect it.

---

## Recursion depth

Python's default limit is 1000. A skewed tree with 10⁴ nodes will crash.

```python
import sys
sys.setrecursionlimit(10**6)
```

Mention this in an interview when the constraints allow deep trees — it's a small detail that reads as
real experience. The alternative is an iterative traversal with an explicit stack (see
[../05-stack-monotonic/notes.md](../05-stack-monotonic/notes.md)).

---

## Complexity

- Almost every full traversal is **O(n) time** — you visit each node once.
- **Space is O(h)** for the recursion stack: O(log n) balanced, O(n) skewed.
- BFS space is **O(w)** where `w` is the maximum level width — up to `n/2` for the bottom level of a
  complete tree, so O(n).

Being able to say "O(n) time, O(h) space, which is O(log n) if balanced" is the level of precision
interviewers want.

---

## Files here

- [pattern-dfs-traversal.md](pattern-dfs-traversal.md) — the DFS templates and when to use each
- [pattern-bfs-level-order.md](pattern-bfs-level-order.md) — level-by-level processing
- [pattern-bst.md](pattern-bst.md) — exploiting the BST property
- [problems.md](problems.md)
