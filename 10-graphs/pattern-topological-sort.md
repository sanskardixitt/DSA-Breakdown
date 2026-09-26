# Pattern — Topological Sort

Ordering nodes so every edge points forward. Only possible in a **DAG** (directed acyclic graph) —
which makes it a cycle detector too.

---

## How do I know to use this?

- "**prerequisite**", "**dependency**", "must be done before"
- "**build order**", "compile order", "task ordering"
- "**can you finish** all courses?" ← cycle detection in disguise
- "**course schedule**"
- "alien dictionary" / deduce an ordering from constraints
- "minimum time to complete all tasks with dependencies"
- Any DAG where you must process nodes in dependency order (including DAG shortest paths and DP on
  DAGs)

---

## Kahn's algorithm (BFS-based) ⭐ — use this one

```python
from collections import defaultdict, deque

def topo_sort(n, edges):
    """edges = [(u, v)] meaning u must come BEFORE v."""
    graph = defaultdict(list)
    indegree = [0] * n

    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1                       # count incoming edges

    q = deque(i for i in range(n) if indegree[i] == 0)    # ① no prerequisites → ready now
    order = []

    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            indegree[v] -= 1                   # ② u is done, so v has one fewer blocker
            if indegree[v] == 0:
                q.append(v)                    # ③ v is now unblocked

    return order if len(order) == n else []    # ⭐ short order ⇒ a cycle exists
```
**O(V + E).**

### The mental model

`indegree[v]` = "how many things must finish before `v` can start."

- Start with everything that has **zero** blockers.
- Finishing a node **removes one blocker** from each of its dependents.
- A dependent becomes ready the moment its count hits zero.

It's exactly how you'd schedule real work.

### The cycle check — the part that makes this a two-for-one

If `len(order) < n`, the leftover nodes form a **cycle**: each is waiting on another, forever, so
none ever reaches indegree 0.

> **This is why "Can you finish all courses?" is a topological sort problem.** The question isn't
> really about ordering — it's "is this graph acyclic?", and Kahn's answers that as a side effect.

### Trace: `n = 4`, edges `0→1, 0→2, 1→3, 2→3`

| step | indegrees | queue | order |
|---|---|---|---|
| init | `[0,1,1,2]` | `[0]` | `[]` |
| pop 0 | `[0,0,0,2]` | `[1,2]` | `[0]` |
| pop 1 | `[0,0,0,1]` | `[2]` | `[0,1]` |
| pop 2 | `[0,0,0,0]` | `[3]` | `[0,1,2]` |
| pop 3 | | `[]` | `[0,1,2,3]` ✅ |

---

## DFS-based topological sort

```python
def topo_sort_dfs(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * n
    order = []

    def dfs(u):
        color[u] = GRAY
        for v in graph[u]:
            if color[v] == GRAY:
                return False               # back edge → cycle
            if color[v] == WHITE and not dfs(v):
                return False
        color[u] = BLACK
        order.append(u)                    # ⭐ append AFTER all descendants (postorder)
        return True

    for i in range(n):
        if color[i] == WHITE and not dfs(i):
            return []
    return order[::-1]                     # ⭐ reverse postorder = topological order
```

**Why reverse postorder works:** a node is appended only after everything it depends on is already
appended. So the list is built dependents-first; reversing puts prerequisites first.

> **Which to use?** Kahn's is easier to get right, gives the cycle check for free, and needs no
> recursion (no stack-depth risk). Use Kahn's by default. Know the DFS version because
> Alien Dictionary and Strongly Connected Components variants build on it.

---

## Course Schedule (LC 207) — "can you finish?"

```python
def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    indegree = [0] * num_courses

    for course, prereq in prerequisites:      # ⚠ [a, b] means: to take a, first take b
        graph[prereq].append(course)          # so the edge is prereq → course
        indegree[course] += 1

    q = deque(i for i in range(num_courses) if indegree[i] == 0)
    done = 0

    while q:
        u = q.popleft()
        done += 1
        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)

    return done == num_courses
```

> **Read the edge direction carefully.** LeetCode gives `[a, b]` meaning "b before a". Building the
> edge backwards produces a plausible-looking solution that fails on asymmetric test cases. Write out
> which direction means what before coding — it takes ten seconds and saves a debugging session.

**Course Schedule II** is identical but returns `order` instead of a boolean.

---

## Alien Dictionary 🔴 (LC 269)

> Given words sorted in an unknown alphabet's order, deduce the character order.

**Step 1 — extract the constraints.** Comparing adjacent words, the **first differing character**
gives one ordering rule. Nothing after that position tells you anything.

```python
def alien_order(words):
    graph = defaultdict(set)
    indegree = {c: 0 for w in words for c in w}      # every character appears as a node

    for w1, w2 in zip(words, words[1:]):
        min_len = min(len(w1), len(w2))
        # ⚠ invalid input: "abc" before "ab" is impossible in any ordering
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""
        for a, b in zip(w1, w2):
            if a != b:
                if b not in graph[a]:
                    graph[a].add(b)
                    indegree[b] += 1
                break                                 # ⭐ ONLY the first difference counts
    # ... standard Kahn's from here ...
    q = deque(c for c in indegree if indegree[c] == 0)
    res = []
    while q:
        c = q.popleft()
        res.append(c)
        for nxt in graph[c]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                q.append(nxt)
    return "".join(res) if len(res) == len(indegree) else ""
```

Three separate traps in one problem:
1. `break` after the first differing character — later characters carry no information.
2. The prefix edge case (`"abc"` before `"ab"` is invalid input, not just an unordered pair).
3. Every character in every word is a node, even ones with no constraints at all.

> **The transferable idea: turn a list of pairwise constraints into a graph, then topologically sort
> it.** Same shape solves Sequence Reconstruction, Sort Items by Groups, and "reconstruct an ordering
> from partial information" problems generally.

---

## Longest path in a DAG (a bonus you get for free)

Longest path is NP-hard in general graphs — but in a **DAG** it's linear, by processing nodes in
topological order.

```python
def longest_path(n, edges):
    order = topo_sort(n, edges)
    dp = [0] * n
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)

    for u in order:                       # ⭐ every predecessor of u is already finalised
        for v in graph[u]:
            dp[v] = max(dp[v], dp[u] + 1)
    return max(dp)
```

> **Topological order = a valid DP evaluation order.** That's the deeper reason topo sort matters:
> it tells you the sequence in which subproblems can be safely computed. Every DP is secretly a topo
> sort of its dependency graph — DP on a 1-D array is just a topo sort where the order happens to be
> `0, 1, 2, ...`.

---

## Traps

- **Edge direction.** `[a, b]` = "b before a" in LeetCode's course problems. Check every time.
- Forgetting the `len(order) == n` cycle check.
- Using a plain `visited` set instead of 3-colouring for directed cycle detection.
- Missing isolated nodes (indegree 0, no edges) — they still belong in the output.
- Duplicate edges inflating indegree. Use a `set` for adjacency when duplicates are possible.
- Assuming the topological order is unique. It usually isn't — any valid order is accepted.
