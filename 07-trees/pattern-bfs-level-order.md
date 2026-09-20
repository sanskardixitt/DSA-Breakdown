# Pattern — Tree BFS (Level Order)

---

## How do I know to use this?

Reach for BFS the moment you see:

- "**level**" / "**level order**" / "**by depth**"
- "**zigzag**" / "spiral"
- "**right side view**" / "left side view"
- "**minimum depth**" ← BFS is genuinely better here (early exit)
- "**closest** node to the root satisfying X"
- "**largest value in each row**", "average of levels"
- "connect nodes at the same level"
- Anything about **shortest** distance in an unweighted structure

> **The rule of thumb:** if the problem cares about **how far from the root** something is, use BFS.
> If it cares about **what's in a subtree**, use DFS.

---

## The template ⭐ memorise this

```python
from collections import deque

def level_order(root):
    if not root:
        return []

    res = []
    q = deque([root])

    while q:
        level_size = len(q)          # ⭐ SNAPSHOT the size — this is the whole trick
        level = []

        for _ in range(level_size):  # process exactly one level
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)

        res.append(level)

    return res
```

### The one line that matters: `level_size = len(q)`

Without it, you can't tell where one level ends and the next begins — you're appending children to the
same queue you're consuming from. Snapshotting the size *before* the inner loop freezes the current
level's boundary.

**Every level-based variant is this template with a different inner body.** Learn it once.

---

## Variants — change only the inner loop

### Right Side View
```python
def right_side_view(root):
    if not root: return []
    res, q = [], deque([root])
    while q:
        n = len(q)
        for i in range(n):
            node = q.popleft()
            if i == n - 1:                 # ← the last node of this level
                res.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
    return res
```
> Left side view = `if i == 0`. That's the entire difference.

### Zigzag Level Order
```python
def zigzag_level_order(root):
    if not root: return []
    res, q, left_to_right = [], deque([root]), True
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level if left_to_right else level[::-1])
        left_to_right = not left_to_right
    return res
```
> **Reverse the collected list, don't reverse the traversal.** Trying to enqueue children in
> alternating order is a classic overcomplication that produces subtly wrong output.

### Average / Max of Each Level
```python
res.append(sum(level) / len(level))    # LC 637
res.append(max(level))                 # LC 515
```

### Minimum Depth (BFS wins here)
```python
def min_depth(root):
    if not root: return 0
    q, depth = deque([root]), 1
    while q:
        for _ in range(len(q)):
            node = q.popleft()
            if not node.left and not node.right:
                return depth                       # ⭐ first leaf found → done
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        depth += 1
```
> **Why BFS beats DFS here:** DFS must explore the *entire* tree to be sure it found the minimum.
> BFS stops at the first leaf it meets. On a tree with one short branch and one enormous one, that's
> the difference between O(1) and O(n).
>
> **The general principle:** BFS finds the *nearest* thing first. That's why it's the unweighted
> shortest-path algorithm.

---

## Bottom-Up Level Order
Just reverse at the end: `return res[::-1]`. Don't try to build it bottom-up directly.

---

## Vertical Order Traversal (BFS with coordinates)

> Group nodes by horizontal column, top to bottom, left to right.

```python
from collections import defaultdict, deque

def vertical_order(root):
    if not root: return []
    cols = defaultdict(list)
    q = deque([(root, 0)])           # (node, column index)

    while q:
        node, c = q.popleft()
        cols[c].append(node.val)
        if node.left:  q.append((node.left,  c - 1))
        if node.right: q.append((node.right, c + 1))

    return [cols[c] for c in sorted(cols)]
```
> **The technique to steal: carry extra state in the queue tuple.** Column index, depth, path, parent
> — anything. `q.append((node, extra))` generalises BFS to a huge range of problems, including all
> the grid BFS problems in [../10-graphs/](../10-graphs/).

---

## Multi-source BFS (preview)

You can seed the queue with **many** starting nodes at once. Every node then gets its distance to the
*nearest* source, in one pass.

```python
q = deque(all_starting_nodes)        # all at distance 0
```

This is how **Rotting Oranges** and **01 Matrix** work. It's covered properly in
[../10-graphs/pattern-grid-traversal.md](../10-graphs/pattern-grid-traversal.md), but the idea is
worth planting now: *BFS doesn't need a single source.*

---

## BFS vs DFS — the decision table

| | BFS | DFS |
|---|---|---|
| Data structure | Queue (`deque`) | Stack / recursion |
| Finds | Nearest first | Deepest first |
| Space | O(w) — max level width | O(h) — tree height |
| Best for | Levels, shortest path, minimum depth | Subtree aggregates, path enumeration, height |
| Worst-case space (complete tree) | O(n/2) = O(n) | O(log n) |
| Worst-case space (skewed tree) | O(1) | O(n) |

**Note the inversion in the last two rows.** For a wide balanced tree DFS uses less memory; for a
skewed tree BFS uses less. Mentioning that trade-off in an interview is a genuinely strong signal.

---

## Traps

```python
# ❌ Using a list as a queue
q = [root]
node = q.pop(0)          # O(n) → whole BFS becomes O(n²). Use deque.

# ❌ Forgetting the level-size snapshot
while q:
    node = q.popleft()   # can't tell where levels end

# ❌ Not checking for a null root before starting

# ❌ Appending null children
q.append(node.left)      # then you must handle None inside the loop — just guard it instead
```
