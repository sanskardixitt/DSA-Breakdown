# 11 — Graphs

> **Ek line ka funda:** *Graph koi nayi cheez nahi hai. Grid bhi graph hai,
> tree bhi graph hai, prerequisites bhi graph hain.
> Sirf 4 algorithms yaad rakho: **DFS, BFS, Topo Sort, Union-Find.** Aur Dijkstra bonus.*

---

## Sabse pehle: kaunsa algorithm? — decision tree

```
Graph problem hai. Ab kya?
│
├─ "SHORTEST path", saare edges ka weight SAME (ya 1)?  ──► BFS
│
├─ "SHORTEST path", edges ka weight ALAG-ALAG?          ──► DIJKSTRA
│                                            (negative weight ho? ──► Bellman-Ford)
│
├─ "kya reach kar sakte hain", "connected components"?  ──► DFS (ya BFS, koi bhi)
│
├─ "prerequisites", "order batao", "cycle in DIRECTED"? ──► TOPOLOGICAL SORT
│
├─ "kitne groups", "same group me hain kya", "merge"?   ──► UNION-FIND
│
├─ "minimum cost to connect ALL"?                       ──► MST (Kruskal / Prim)
│
└─ "sab paths gino / dhoondho"?                         ──► DFS + BACKTRACKING
```

---

## Representation — pehle ye set karo

```js
// Edge list se adjacency list banao — ye har graph problem ki pehli line hai
function buildGraph(n, edges, directed = false) {
  const g = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    g[u].push(v);
    if (!directed) g[v].push(u);       // undirected me dono taraf
  }
  return g;
}
```

```
Edges: [[0,1],[0,2],[1,2],[2,3]]   (undirected)

Adjacency list:            Picture:
  0: [1, 2]                    0
  1: [0, 2]                   / \
  2: [0, 1, 3]               1---2
  3: [2]                          \
                                   3
```

---

## Part 1 — GRID = graph (sabse zyada aane wala type)

Grid problems me har cell ek node hai, aur padosi cells edges.

```
+---+---+---+
| 1 | 1 | 0 |      Directions (4-way):
+---+---+---+        up    (-1,  0)
| 1 | 0 | 0 |        down  ( 1,  0)
+---+---+---+        left  ( 0, -1)
| 0 | 0 | 1 |        right ( 0,  1)
+---+---+---+
```

### Directions array — ye idiom yaad rakho
```js
const DIRS = [[-1,0],[1,0],[0,-1],[0,1]];              // 4-way
const DIRS8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];  // 8-way
```

### Number of Islands (LC 200) — grid DFS ka template

```js
function numIslands(grid) {
  const R = grid.length, C = grid[0].length;
  let count = 0;

  function sink(r, c) {
    if (r < 0 || r >= R || c < 0 || c >= C || grid[r][c] !== '1') return;
    grid[r][c] = '0';                       // 🔑 visited mark (in-place, O(1) space)
    for (const [dr, dc] of DIRS) sink(r + dr, c + dc);
  }

  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (grid[r][c] === '1') { count++; sink(r, c); }    // naya island mila

  return count;
}
```

> **"Sink the island" trick:** visited array banane ki jagah grid me hi `'0'` kar do.
> Agar interviewer bole "input modify mat karo", to `visited` Set use karo:
> `visited.add(r * C + c)` — 2D coordinate ko 1D number me convert karna bhi ek trick hai.

### ⚠️ Grid DFS ka stack overflow

`1000 x 1000` grid pe recursion depth 10^6 → **JS me stack overflow**.
Bade grids pe **iterative BFS** use karo:

```js
function bfsIsland(grid, sr, sc) {
  const q = [[sr, sc]]; let head = 0;
  grid[sr][sc] = '0';
  while (head < q.length) {
    const [r, c] = q[head++];
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc] === '1') {
        grid[nr][nc] = '0';        // 🔑 push karte waqt mark karo, pop pe nahi!
        q.push([nr, nc]);
      }
    }
  }
}
```

> **BFS ka #1 bug:** pop karte waqt visited mark karna.
> Tab ek node queue me kai baar aa jaata hai → **TLE** ya galat answer.
> **Hamesha push ke time mark karo.**

---

## Part 2 — BFS = shortest path (unweighted)

### Kyun BFS shortest deta hai

```
Level 0:        S                  distance 0
              / | \
Level 1:     a  b  c               distance 1
            /|  |  |\
Level 2:   d e  f  g h             distance 2

BFS layer-by-layer chalta hai. Jab target pehli baar mila,
to wo SABSE KAM layer pe hi mila hai. Isliye = shortest.
```

### Multi-source BFS 🔥 (bahut powerful, kam log jaante hain)

"Rotting Oranges" (LC 994), "Walls and Gates", "01 Matrix" — sab isi se.

**Idea:** ek source se nahi, **saare sources ek saath** queue me daal do.

```
Initial queue me SAARE rotten oranges:

[R] [F] [F]              minute 0: queue = [(0,0), (0,2)]
[F] [F] [F]
[F] [F] [R]

Ek hi BFS me sab taraf se rot phailega -> answer = kitne minutes lage
```

```js
function orangesRotting(grid) {
  const R = grid.length, C = grid[0].length;
  const q = []; let fresh = 0, head = 0;

  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === 2) q.push([r, c]);      // 🔑 SAARE sources
      else if (grid[r][c] === 1) fresh++;
    }

  let minutes = 0;
  while (head < q.length && fresh > 0) {
    const size = q.length - head;                // level = 1 minute
    for (let i = 0; i < size; i++) {
      const [r, c] = q[head++];
      for (const [dr, dc] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 1) {
          grid[nr][nc] = 2; fresh--; q.push([nr, nc]);
        }
      }
    }
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}
```

> **Pehchano:** *"sabhi X se nearest Y ki distance"* → **multi-source BFS**, na ki har X se alag BFS.
> Har X se alag BFS = O(n·m·nodes). Multi-source = **ek hi pass, O(nodes)**.

---

## Part 3 — TOPOLOGICAL SORT (dependencies)

### Trigger words
- "prerequisites", "course schedule"
- "build order", "task dependency"
- "cycle in **directed** graph"
- "kis order me karein"

### Kahn's Algorithm (BFS wala — ye yaad rakho, aasan hai)

```
Courses: 0->1, 0->2, 1->3, 2->3

indegree = kitne teer MUJH PAR aa rahe hain

     0(0)
    /    \
  1(1)   2(1)
    \    /
     3(2)

Step 1: indegree 0 wale queue me     -> [0]
Step 2: 0 nikaalo, uske padosiyon ki indegree--  -> 1(0), 2(0) -> queue [1,2]
Step 3: 1 nikaalo -> 3(1).  2 nikaalo -> 3(0) -> queue [3]
Step 4: 3 nikaalo

Order: 0, 1, 2, 3  ✅

Agar saare nodes process nahi hue -> CYCLE hai 💀
```

```js
function findOrder(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, () => []);
  const indeg = new Array(numCourses).fill(0);

  for (const [course, pre] of prerequisites) {
    g[pre].push(course);        // pre -> course
    indeg[course]++;
  }

  const q = []; let head = 0;
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);

  const order = [];
  while (head < q.length) {
    const u = q[head++];
    order.push(u);
    for (const v of g[u]) if (--indeg[v] === 0) q.push(v);
  }

  return order.length === numCourses ? order : [];   // 🔑 cycle check
}
```

> **`order.length === numCourses` — ye ek line hi cycle detection hai.**
> Kyunki cycle me har node ki indegree kabhi 0 nahi hogi. Elegant hai.

---

## Part 4 — UNION-FIND (Disjoint Set Union)

### Trigger words
- "kitne connected components"
- "kya ye dono connected hain"
- "edges add karte jao, batao kab connect hua"
- "redundant connection", "accounts merge"
- **Kruskal's MST**

### Idea: har group ka ek "leader" (root)

```
Shuru me sabka apna group:
  parent = [0, 1, 2, 3, 4]
            0  1  2  3  4      (sab alag)

union(0,1):    0     2  3  4
               |
               1

union(2,3):    0     2     4
               |     |
               1     3

find(1) -> chalke upar jao -> 0
find(3) -> 2
alag hain -> connected nahi
```

### Template (path compression + union by rank)

```js
class DSU {
  constructor(n) {
    this.p = Array.from({ length: n }, (_, i) => i);   // apna parent khud
    this.rank = new Array(n).fill(0);
    this.count = n;                                    // components
  }
  find(x) {
    if (this.p[x] !== x) this.p[x] = this.find(this.p[x]);   // 🔑 PATH COMPRESSION
    return this.p[x];
  }
  union(a, b) {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;                 // pehle se same group (= cycle!)
    if (this.rank[ra] < this.rank[rb]) this.p[ra] = rb;      // 🔑 UNION BY RANK
    else if (this.rank[ra] > this.rank[rb]) this.p[rb] = ra;
    else { this.p[rb] = ra; this.rank[ra]++; }
    this.count--;
    return true;
  }
}
```

**Path compression ka effect:**
```
find(4) se pehle:  0 <- 1 <- 2 <- 3 <- 4     (chain, O(n))

find(4) ke baad:        0
                      / | \ \
                     1  2  3  4              (sab direct root pe, O(1))
```

Complexity: dono optimizations ke saath **almost O(1)** per operation
(technically inverse Ackermann α(n) < 5 — practically constant).

> **`union()` ka `false` return = cycle mila.** Redundant Connection (LC 684) ek line me solve.

---

## Part 5 — DIJKSTRA (weighted shortest path)

### Kab: edges ke **alag-alag weights** hain, aur **koi negative nahi**

```
Idea: BFS hi hai, par queue ki jagah MIN-HEAP.
      Hamesha "abhi tak jo sabse sasta node hai" wahan se aage badho.

    (4)
 A ----- B
 |     / |
(1)  (2) (5)
 |  /    |
 C ----- D
    (8)

A se sab tak: A=0, C=1, B=3 (A->C->B), D=8 (A->C->B->D)
```

```js
function dijkstra(n, edges, src) {
  const g = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) { g[u].push([v, w]); g[v].push([u, w]); }

  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  const pq = new MinHeap((a, b) => a[0] - b[0]);   // [distance, node]
  pq.push([0, src]);

  while (pq.size) {
    const [d, u] = pq.pop();
    if (d > dist[u]) continue;              // 🔑 purana stale entry, skip
    for (const [v, w] of g[u]) {
      if (d + w < dist[v]) {                // relaxation
        dist[v] = d + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}
```

> **`if (d > dist[u]) continue;`** — heap se node ki purani (badi) entry bhi nikal sakti hai.
> Ye line usko skip karti hai. Bhoolne pe TLE. **Lazy deletion** kehte hain isko.

**Negative weights?** Dijkstra fail karta hai → **Bellman-Ford** (O(V·E)).

---

## Cycle detection — directed vs undirected (ye poocha jaata hai)

```
UNDIRECTED graph me cycle:
  - DFS me visited node mila jo parent nahi hai -> cycle
  - Ya Union-Find: union() false return kare -> cycle

DIRECTED graph me cycle:
  - Kahn's topo sort: saare nodes process nahi hue -> cycle
  - Ya DFS with 3 colors:
      WHITE (0) = abhi visit nahi kiya
      GRAY  (1) = abhi RECURSION STACK me hai   <-- GRAY mila to CYCLE!
      BLACK (2) = pura ho gaya
```

> **Sirf `visited` set se directed cycle detect NAHI hoti.**
> Recursion stack track karna zaroori hai. Ye classic interview gotcha hai.

---

## Common galtiyan

| Galti | Fix |
|---|---|
| BFS me pop pe visited mark | **Push pe** mark karo |
| `q.shift()` use karna | `q[head++]` |
| Undirected me ek hi taraf edge daalna | Dono taraf |
| Directed cycle ke liye sirf `visited` | Recursion stack / 3-color |
| Dijkstra me stale entry skip na karna | `if (d > dist[u]) continue` |
| Bada grid pe recursive DFS | Iterative BFS (stack overflow) |
| Union-Find me path compression skip | O(n) per op ho jaayega |

---

## Complexity table

| Algorithm | Time | Space |
|---|---|---|
| DFS / BFS | O(V + E) | O(V) |
| Topological Sort | O(V + E) | O(V) |
| Union-Find | ~O(1) per op | O(V) |
| Dijkstra | O(E log V) | O(V) |
| Bellman-Ford | O(V·E) | O(V) |
| Floyd-Warshall | O(V³) | O(V²) |

---

## Problems

| # | Problem | Pattern |
|---|---|---|
| 200 | Number of Islands | Grid DFS (start here) |
| 695 | Max Area of Island | Grid DFS + return value |
| 133 | Clone Graph | DFS + HashMap |
| 994 | Rotting Oranges | **Multi-source BFS** |
| 542 | 01 Matrix | Multi-source BFS |
| 207/210 | Course Schedule I/II | **Topo sort** |
| 547 | Number of Provinces | Union-Find / DFS |
| 684 | Redundant Connection | Union-Find |
| 721 | Accounts Merge | Union-Find + map |
| 127 | Word Ladder | BFS on words |
| 743 | Network Delay Time | **Dijkstra** |
| 787 | Cheapest Flights K Stops | Bellman-Ford |
| 269 | Alien Dictionary | Topo sort (hard) |

---
Agla: [12-dynamic-programming.md](12-dynamic-programming.md)
