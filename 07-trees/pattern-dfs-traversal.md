# Pattern — Tree DFS

---

## The two directions of information flow

Every tree DFS problem is one of these. Identify which **before** you write code.

### ⬆ Bottom-up (postorder) — children tell the parent

```python
def dfs(node):
    if not node:
        return <identity value>
    L = dfs(node.left)
    R = dfs(node.right)
    return combine(L, R, node.val)
```

**Use when:** height, subtree sums, subtree counts, "is this subtree valid", diameter, LCA.

**The question it answers:** *"Given my children's answers, what's mine?"*

### ⬇ Top-down (preorder) — parent tells the children

```python
def dfs(node, info_from_above):
    if not node:
        return
    new_info = update(info_from_above, node.val)
    dfs(node.left, new_info)
    dfs(node.right, new_info)
```

**Use when:** path sums, valid-range checks (BST validation), depth tracking, root-to-leaf paths.

**The question it answers:** *"Given what I know from the root down to here, what do I pass on?"*

---

## Template gallery

### Maximum Depth (bottom-up, minimal)
```python
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
```

### Same Tree (simultaneous recursion on two trees)
```python
def is_same_tree(p, q):
    if not p and not q: return True
    if not p or not q:  return False        # exactly one is null
    return p.val == q.val and \
           is_same_tree(p.left, q.left) and \
           is_same_tree(p.right, q.right)
```
> The three-line base case (`both null` / `one null` / `values differ`) is the reusable shape for
> Symmetric Tree, Subtree of Another Tree, and Merge Two Binary Trees.

### Symmetric Tree — same idea, mirrored
```python
def is_symmetric(root):
    def mirror(a, b):
        if not a and not b: return True
        if not a or not b:  return False
        return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)
        #                                   ↑ left-to-right, right-to-left
    return mirror(root, root)
```

### Invert Binary Tree
```python
def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root
```

### Balanced Binary Tree (the `-1` sentinel trick)
```python
def is_balanced(root):
    def height(node):
        if not node:
            return 0
        L = height(node.left)
        if L == -1: return -1               # short-circuit: already unbalanced
        R = height(node.right)
        if R == -1: return -1
        if abs(L - R) > 1:
            return -1                       # ← -1 means "unbalanced"
        return 1 + max(L, R)
    return height(root) != -1
```
> **The trick:** a single traversal returns *both* the height and the validity, by reserving an
> impossible value (`-1`) as an error signal. The naive version calls `height()` inside `isBalanced()`
> and is O(n²). This one is O(n).
>
> **"Overload the return value with a sentinel"** is worth remembering — it's how you avoid a second
> traversal in a lot of problems.

---

## Path problems

### Path Sum (does a root-to-leaf path sum to target?)
```python
def has_path_sum(root, target):
    if not root:
        return False
    if not root.left and not root.right:        # ⚠ LEAF check, not null check
        return target == root.val
    rest = target - root.val
    return has_path_sum(root.left, rest) or has_path_sum(root.right, rest)
```
> **The leaf check is the bug magnet.** `if not root: return target == 0` is wrong — a node with one
> child would let a non-existent path count. A leaf is `not root.left and not root.right`.

### All root-to-leaf paths (DFS + backtracking)
```python
def binary_tree_paths(root):
    res, path = [], []

    def dfs(node):
        if not node:
            return
        path.append(str(node.val))              # ① choose
        if not node.left and not node.right:
            res.append("->".join(path))         # ② record at a leaf
        else:
            dfs(node.left)
            dfs(node.right)
        path.pop()                              # ③ un-choose (BACKTRACK)

    dfs(root)
    return res
```
> `path.pop()` is the backtracking step, and it's the whole reason this works. Miss it and the path
> accumulates garbage from sibling branches. This is the same skeleton as
> [../09-backtracking/](../09-backtracking/) — trees are where it's easiest to see.
>
> Also note `"->".join(path)` builds a **copy**. If you appended `path` itself, every result would
> alias the same (eventually empty) list.

---

## Binary Tree Maximum Path Sum 🔴

The hardest common tree problem, and the purest example of "return one thing, record another".

> A path is any node sequence connected by edges, going in **any** direction (it doesn't need to touch
> the root). Return the maximum sum.

```python
def max_path_sum(root):
    best = float('-inf')

    def gain(node):
        """Max sum of a path that STARTS at `node` and goes strictly downward."""
        nonlocal best
        if not node:
            return 0

        L = max(gain(node.left),  0)      # ⚠ clamp at 0: a negative branch is worse than nothing
        R = max(gain(node.right), 0)

        best = max(best, node.val + L + R)   # a path PEAKING here uses both sides
        return node.val + max(L, R)          # a path CONTINUING up uses only one side

    gain(root)
    return best
```

**The three ideas:**
1. `max(..., 0)` — you're never forced to take a negative subtree. Dropping it is always at least as
   good. This one clamp handles all the negative-value test cases.
2. `best` considers `node.val + L + R` — a path that turns around at this node.
3. The **return** is `node.val + max(L, R)` — because a path continuing to the parent can't fork.

Draw a tree with negative values and trace it once. The `max(..., 0)` clamp is what makes it click.

---

## Constructing a tree from traversals

> Given preorder and inorder, rebuild the tree.

**The two facts:**
- `preorder[0]` is always the root.
- In `inorder`, everything **left** of the root belongs to the left subtree, everything right to the right.

```python
def build_tree(preorder, inorder):
    idx = {v: i for i, v in enumerate(inorder)}     # value -> index, O(1) lookup
    self_pre = 0

    def build(lo, hi):                              # inorder range [lo, hi]
        nonlocal self_pre
        if lo > hi:
            return None
        val = preorder[self_pre]
        self_pre += 1
        node = TreeNode(val)
        mid = idx[val]
        node.left  = build(lo, mid - 1)             # ⚠ LEFT first — preorder consumes left before right
        node.right = build(mid + 1, hi)
        return node

    return build(0, len(inorder) - 1)
```
**O(n)** thanks to the index map. The naive `inorder.index(val)` inside the recursion makes it O(n²).

> **Order matters.** `build(left)` must run before `build(right)` because they share the `self_pre`
> cursor and preorder lays out the left subtree first. Swap them and you build a mirrored, wrong tree.

---

## Serialize and Deserialize 🔴

```python
def serialize(root):
    out = []
    def dfs(node):
        if not node:
            out.append("#")            # explicit null marker
            return
        out.append(str(node.val))
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return ",".join(out)

def deserialize(data):
    vals = iter(data.split(","))       # an iterator gives us a moving cursor for free
    def build():
        v = next(vals)
        if v == "#":
            return None
        node = TreeNode(int(v))
        node.left = build()
        node.right = build()
        return node
    return build()
```
> **Why null markers are essential:** preorder alone is ambiguous (many trees share one preorder).
> Preorder *with* nulls is uniquely decodable. Same reason a length prefix is needed in
> Encode/Decode Strings.

---

## Iterative traversals (when recursion would overflow)

```python
def preorder_iter(root):
    if not root: return []
    stack, out = [root], []
    while stack:
        node = stack.pop()
        out.append(node.val)
        if node.right: stack.append(node.right)   # ⚠ right FIRST, so left pops first
        if node.left:  stack.append(node.left)
    return out

def inorder_iter(root):
    stack, out, cur = [], [], root
    while cur or stack:
        while cur:                    # dive left
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        out.append(cur.val)
        cur = cur.right
    return out
```
Inorder iterative is worth knowing cold — it's the basis of **Kth Smallest in a BST** and of the
**BST Iterator** class.

---

## Debug checklist

- [ ] Base case: what does `None` return? (0? `True`? `float('-inf')`?)
- [ ] Leaf check (`not left and not right`) vs null check (`not node`) — which does this problem need?
- [ ] Bottom-up or top-down? Am I combining children, or passing state down?
- [ ] Do I need a `nonlocal` global answer *in addition to* the return value?
- [ ] For path-collection problems: am I appending a **copy**, and did I `pop()` on the way out?
- [ ] Preorder-construction: left before right?
