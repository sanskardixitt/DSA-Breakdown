# Graphs — Notes

A graph is just **things and connections**. Trees are graphs with no cycles. Grids are graphs where
each cell connects to its neighbours. Once you notice that, half of "graph problems" turn out to be
problems you already know.

---

## Representations

### Adjacency list (default — use this)
```python
from collections import defaultdict

graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)        # omit for a DIRECTED graph
```
Space O(V + E). Iterating a node's neighbours is O(degree).

### Adjacency matrix
```python
adj = [[0] * n for _ in range(n)]
adj[u][v] = 1
```
Space O(V²). Edge lookup is O(1). Only worth it for **dense** graphs or Floyd–Warshall.

### Implicit graphs (the ones people fail to recognise)

Many problems are graphs without ever saying "graph":

| Problem type | Nodes | Edges |
|---|---|---|
| **Grid** | cells | the 4 (or 8) neighbours |
| **Word ladder** | words | words differing by one letter |
| **Course schedule** | courses | prerequisites |
| **State puzzles** (Open the Lock) | states | one legal move |
| **`i → nums[i]`** | indices | the mapping |
| **Currency exchange** | currencies | exchange rates |

> **The reframe that unlocks a lot of hard problems:** *"What are my nodes, and what are my edges?"*
> If you can answer that, BFS/DFS applies — even when the graph is never materialised in memory.

---

## The two traversals

### DFS — go deep first
```python
def dfs(node, visited, graph):
    if node in visited:
        return
    visited.add(node)
    for nei in graph[node]:
        dfs(nei, visited, graph)
```
Iterative:
```python
stack = [start]
visited = {start}
while stack:
    node = stack.pop()
    for nei in graph[node]:
        if nei not in visited:
            visited.add(nei)
            stack.append(nei)
```

### BFS — go wide first, layer by layer
```python
from collections import deque

def bfs(start, graph):
    visited = {start}
    q = deque([start])
    dist = {start: 0}

    while q:
        node = q.popleft()
        for nei in graph[node]:
            if nei not in visited:
                visited.add(nei)              # ⭐ mark on ENQUEUE, not on dequeue
                dist[nei] = dist[node] + 1
                q.append(nei)
    return dist
```

> ⚠ **Mark visited when you enqueue, not when you dequeue.** Otherwise a node can be added to the
> queue many times before it's processed, and BFS degrades badly (or produces wrong distances).
> This is the most common BFS bug.

Both are **O(V + E)**.

---

## BFS vs DFS — choosing

| Use BFS when | Use DFS when |
|---|---|
| Shortest path in an **unweighted** graph | Detecting cycles |
| "Minimum number of steps/moves" | Topological sort (the recursive version) |
| Level-by-level processing | Connected components / flood fill |
| "Closest" / "nearest" | Path enumeration, backtracking |
| The target is likely near the start | You need to explore an entire branch |

> **The one non-negotiable:** **BFS gives shortest paths in unweighted graphs. DFS does not.**
> If a problem says "minimum number of moves" and all moves cost the same — BFS. Always.

---

## Recognition triggers

| Statement says... | Approach |
|---|---|
| "islands", "regions", "flood fill", "surrounded" | Grid DFS/BFS |
| "shortest path", "fewest steps" (**unweighted**) | BFS |
| "shortest path" with **weights** | Dijkstra |
| "shortest path" with **negative** weights | Bellman–Ford |
| "prerequisite", "dependency", "build order", "can finish" | Topological sort |
| "cycle in a **directed** graph" | Topo sort, or DFS with 3-colouring |
| "cycle in an **undirected** graph" | Union-Find, or DFS tracking the parent |
| "connected components", "provinces", "groups" | Union-Find or DFS |
| "is the graph a valid tree" | V−1 edges **and** connected |
| "bipartite", "two groups", "can we 2-colour" | BFS/DFS colouring |
| "clone a graph" | DFS/BFS + `dict: old → new` |
| "minimum spanning tree", "connect all at min cost" | Kruskal (Union-Find) or Prim (heap) |
| "all pairs shortest path", V ≤ 400 | Floyd–Warshall |

---

## The grid template (used constantly)

```python
DIRS = [(0,1), (1,0), (0,-1), (-1,0)]        # right, down, left, up
# 8-directional: add the four diagonals

R, C = len(grid), len(grid[0])

def neighbors(r, c):
    for dr, dc in DIRS:
        nr, nc = r + dr, c + dc
        if 0 <= nr < R and 0 <= nc < C:      # ⭐ ALWAYS bounds-check first
            yield nr, nc
```

Write `DIRS` as a constant. Writing four explicit recursive calls invites typos, and typos in grid
code are miserable to find.

---

## Cycle detection

### Undirected — DFS tracking the parent
```python
def has_cycle_undirected(n, graph):
    visited = set()
    def dfs(node, parent):
        visited.add(node)
        for nei in graph[node]:
            if nei == parent:
                continue                   # the edge we came in on — not a cycle
            if nei in visited:
                return True                # a visited node that isn't our parent → cycle
            if dfs(nei, node):
                return True
        return False

    for i in range(n):
        if i not in visited and dfs(i, -1):
            return True
    return False
```
> ⚠ The `parent` check is essential — in an undirected graph, every edge looks like a 2-cycle
> otherwise. (Careful with parallel edges: then you need edge IDs, not just the parent node.)

### Directed — 3-colour DFS
```python
def has_cycle_directed(n, graph):
    WHITE, GRAY, BLACK = 0, 1, 2           # unvisited / in the current path / done
    color = [WHITE] * n

    def dfs(u):
        color[u] = GRAY
        for v in graph[u]:
            if color[v] == GRAY:
                return True                # a back edge into the current path → cycle
            if color[v] == WHITE and dfs(v):
                return True
        color[u] = BLACK
        return False

    return any(color[i] == WHITE and dfs(i) for i in range(n))
```
> **GRAY means "on the current recursion stack".** A plain `visited` set is *not* enough for directed
> graphs — reaching an already-finished (BLACK) node is fine, reaching a GRAY one is a cycle.
> Confusing these two is the classic directed-cycle bug.

---

## Bipartite check (2-colouring)

```python
def is_bipartite(graph):
    color = {}
    for start in range(len(graph)):
        if start in color:
            continue
        color[start] = 0
        q = deque([start])
        while q:
            u = q.popleft()
            for v in graph[u]:
                if v not in color:
                    color[v] = 1 - color[u]
                    q.append(v)
                elif color[v] == color[u]:
                    return False           # same colour on both ends of an edge
    return True
```
> The outer loop over all starts is required — the graph may be **disconnected**. Forgetting that is
> a frequent source of wrong answers across all graph problems.

---

## Algorithm reference

| Algorithm | Time | Use for |
|---|---|---|
| BFS / DFS | O(V + E) | Traversal, connectivity, unweighted shortest path |
| Topological sort (Kahn) | O(V + E) | Ordering with dependencies, DAG cycle detection |
| Union-Find | ~O(α(n)) ≈ O(1) per op | Dynamic connectivity, undirected cycles, Kruskal |
| Dijkstra (heap) | O(E log V) | Shortest path, **non-negative** weights |
| Bellman–Ford | O(V·E) | Negative weights, negative-cycle detection |
| Floyd–Warshall | O(V³) | All-pairs, small V |
| Kruskal (MST) | O(E log E) | Minimum spanning tree, sparse graphs |
| Prim (MST) | O(E log V) | Minimum spanning tree, dense graphs |

---

## Files here

- [pattern-grid-traversal.md](pattern-grid-traversal.md)
- [pattern-topological-sort.md](pattern-topological-sort.md)
- [pattern-union-find.md](pattern-union-find.md)
- [pattern-dijkstra.md](pattern-dijkstra.md)
- [problems.md](problems.md)
