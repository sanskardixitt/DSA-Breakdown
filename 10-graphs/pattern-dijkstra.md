# Pattern — Dijkstra & Weighted Shortest Paths

---

## The one-line summary

> **Dijkstra is BFS with a priority queue instead of a plain queue.**

BFS explores in order of *number of edges*. Dijkstra explores in order of *total weight*. That single
substitution is the entire algorithm.

---

## How do I know to use this?

- "**shortest path**" / "**minimum cost**" / "**minimum time**" with **weighted** edges
- "**cheapest** route", "**fastest** route"
- "signal propagation time", "network delay"
- "**maximum probability** path" (multiply instead of add, use a max-heap)
- "**path with minimum effort**" (minimise the maximum edge — a modified relaxation)

**Anti-triggers:**
- All weights equal (or unweighted) → plain **BFS** is simpler and faster.
- **Negative** weights → Dijkstra is *incorrect*. Use Bellman–Ford.

---

## The template ⭐

```python
import heapq
from collections import defaultdict

def dijkstra(n, edges, src):
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))          # add the reverse edge too if undirected

    dist = {}                            # node -> final shortest distance
    pq = [(0, src)]                      # (distance_so_far, node)

    while pq:
        d, u = heapq.heappop(pq)
        if u in dist:
            continue                     # ⭐ already finalised — this is a stale entry
        dist[u] = d                      # first time we pop u ⇒ this IS the shortest distance

        for v, w in graph[u]:
            if v not in dist:
                heapq.heappush(pq, (d + w, v))

    return dist
```
**O(E log V).**

### The two lines that matter

1. **`if u in dist: continue`** — lazy deletion. We may push the same node several times with
   different tentative distances. The *first* pop has the smallest, so every later one is stale and
   gets skipped. This is far simpler than trying to decrease-key inside `heapq` (which doesn't support
   it).

2. **`dist[u] = d` right after popping** — this is the correctness claim, and it's worth being able
   to defend:

> **Why the first pop is final:** the heap always yields the smallest tentative distance. Suppose a
> shorter path to `u` existed. It would have to pass through some node `x` not yet finalised, so
> `dist_via_x(u) >= dist(x) >= d`. With **non-negative weights**, adding more edges can never reduce
> the total. So no shorter path can exist. ∎
>
> **This is exactly where negative weights break it.** A later edge with weight −10 *could* reduce the
> total, so "first pop is final" stops being true.

---

## Example — Network Delay Time (LC 743)

```python
def network_delay_time(times, n, k):
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))

    dist = {}
    pq = [(0, k)]

    while pq:
        d, u = heapq.heappop(pq)
        if u in dist:
            continue
        dist[u] = d
        for v, w in graph[u]:
            if v not in dist:
                heapq.heappush(pq, (d + w, v))

    return max(dist.values()) if len(dist) == n else -1
```

The answer is the **maximum** shortest distance — the last node to receive the signal. If some node is
unreachable, return −1.

---

## Variant — Path With Minimum Effort (LC 1631)

> Minimise the **maximum** single step along the path (not the sum).

The only change is the relaxation formula: `max` instead of `+`.

```python
def minimum_effort_path(heights):
    R, C = len(heights), len(heights[0])
    effort = [[float('inf')] * C for _ in range(R)]
    pq = [(0, 0, 0)]                              # (effort_so_far, r, c)

    while pq:
        e, r, c = heapq.heappop(pq)
        if (r, c) == (R-1, C-1):
            return e
        if e > effort[r][c]:
            continue
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C:
                ne = max(e, abs(heights[nr][nc] - heights[r][c]))   # ⭐ MAX, not sum
                if ne < effort[nr][nc]:
                    effort[nr][nc] = ne
                    heapq.heappush(pq, (ne, nr, nc))
    return 0
```

> **Dijkstra generalises to any relaxation that is monotone non-decreasing along a path.** Sum, max,
> and (with a max-heap) product of probabilities all qualify. If extending a path can never *improve*
> the metric, Dijkstra applies. That's the actual precondition — "non-negative weights" is just the
> special case for sums.

**Maximum Probability Path (LC 1514):** multiply probabilities, use a max-heap (negate). Same code.

---

## Bellman–Ford — when weights can be negative

```python
def bellman_ford(n, edges, src):
    dist = [float('inf')] * n
    dist[src] = 0

    for _ in range(n - 1):               # ⭐ a shortest path has at most n-1 edges
        changed = False
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                changed = True
        if not changed:
            break                        # early exit — nothing improved this round

    # one more pass: if anything still improves, a negative cycle is reachable
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return None                  # negative cycle
    return dist
```
**O(V · E).**

**Why `n - 1` rounds:** any shortest path visits at most `n` nodes, hence at most `n - 1` edges. Each
round guarantees all paths of one more edge are correct. A change on round `n` means some path keeps
getting cheaper forever — a negative cycle.

> **Cheapest Flights Within K Stops (LC 787)** is Bellman–Ford limited to `k + 1` rounds — the round
> count naturally caps the number of edges used. That's a very clean fit; recognising it saves you
> from a messy modified-Dijkstra attempt.
> ⚠ Use a **snapshot** of `dist` in each round there, or a single round can chain multiple flights.

---

## Floyd–Warshall — all pairs

```python
def floyd_warshall(n, edges):
    dist = [[float('inf')] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = w

    for k in range(n):                   # ⭐ k (the intermediate node) MUST be the outer loop
        for i in range(n):
            for j in range(n):
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    return dist
```
**O(V³)** — fine up to about V = 400.

**The meaning of the loops:** after iteration `k`, `dist[i][j]` is the shortest path using only nodes
`0..k` as intermediates. That's why `k` must be outermost — it's the DP dimension being built up.
Putting `k` inside is the classic error and produces subtly wrong results.

---

## Choosing an algorithm

| Situation | Algorithm | Complexity |
|---|---|---|
| Unweighted / all weights equal | **BFS** | O(V + E) |
| Non-negative weights, single source | **Dijkstra** | O(E log V) |
| Negative weights allowed | **Bellman–Ford** | O(V·E) |
| Need to detect a negative cycle | **Bellman–Ford** | O(V·E) |
| All pairs, small V | **Floyd–Warshall** | O(V³) |
| Weights are only 0 or 1 | **0-1 BFS** (deque) | O(V + E) |
| DAG only | Topological order + relax | O(V + E) |

### 0-1 BFS (a neat trick worth knowing)
When every edge costs 0 or 1, replace the heap with a **deque**: `appendleft` for weight-0 edges,
`append` for weight-1. The deque stays sorted automatically, giving O(V + E) instead of O(E log V).

---

## Traps

- Using Dijkstra with negative weights. It silently gives wrong answers — no crash, no warning.
- Forgetting `if u in dist: continue` → the same node is processed repeatedly, and results can be wrong.
- Pushing `ListNode`/tuple payloads without a tiebreaker → `TypeError` on equal distances.
- In Floyd–Warshall, putting `k` in an inner loop.
- Using Dijkstra when BFS would do — over-engineering an unweighted problem.
- Forgetting to add the reverse edge for undirected graphs.
