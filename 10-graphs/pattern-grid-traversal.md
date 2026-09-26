# Pattern — Grid DFS / BFS (Flood Fill & Multi-Source)

Grids are graphs. Cell `(r, c)` connects to its 4 (sometimes 8) neighbours.

---

## How do I know to use this?

- "**islands**", "**regions**", "**provinces**", "**connected** cells"
- "**flood fill**", "paint", "**surrounded**", "enclosed"
- "**area** / **perimeter** of a region"
- "**shortest path** in a maze/grid"
- "**rotting oranges**", "spread of X over time" → **multi-source BFS**
- "distance to the **nearest** X for every cell" → **multi-source BFS**
- "can water flow from ___ to ___" → **reverse DFS from the destinations**

---

## Setup — write this every time

```python
R, C = len(grid), len(grid[0])
DIRS = [(0,1), (1,0), (0,-1), (-1,0)]

def in_bounds(r, c):
    return 0 <= r < R and 0 <= c < C
```

---

## Flood fill (DFS) — Number of Islands

```python
def num_islands(grid):
    if not grid: return 0
    R, C = len(grid), len(grid[0])
    count = 0

    def sink(r, c):
        if not (0 <= r < R and 0 <= c < C) or grid[r][c] != '1':
            return
        grid[r][c] = '0'                # ⭐ mark visited — PERMANENTLY (no undo)
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            sink(r + dr, c + dc)

    for r in range(R):
        for c in range(C):
            if grid[r][c] == '1':
                count += 1              # found a new island
                sink(r, c)              # erase all of it

    return count
```
**O(R·C) time.** Space O(R·C) worst case for the recursion stack.

**The two-part structure that all flood-fill problems share:**
1. An **outer scan** over every cell — finds the *start* of each region.
2. An **inner flood** that consumes the entire region so it's never counted twice.

> **"Sinking" the island (writing `'0'`) is an in-place `visited` set.** It avoids O(R·C) extra
> memory. ⚠ It mutates the input — say so in an interview, and use a separate `visited` set if
> mutation isn't allowed.
>
> **Contrast with Word Search:** there you *undo* the mark, because a cell can be reused by a
> different path. Here you never undo, because each cell belongs to exactly one island.

### The counting variant — Max Area of Island
```python
def area(r, c):
    if not (0 <= r < R and 0 <= c < C) or grid[r][c] != 1:
        return 0
    grid[r][c] = 0
    return 1 + sum(area(r+dr, c+dc) for dr, dc in DIRS)
```
Same skeleton; the flood **returns a value** that aggregates up the recursion instead of returning
nothing. That single change turns "count regions" into "measure regions".

---

## Multi-source BFS ⭐

The pattern people most often miss. **Seed the queue with *all* sources at once**, and every cell
automatically gets its distance to the *nearest* one — in a single O(R·C) pass.

### Rotting Oranges

```python
from collections import deque

def oranges_rotting(grid):
    R, C = len(grid), len(grid[0])
    q = deque()
    fresh = 0

    for r in range(R):
        for c in range(C):
            if grid[r][c] == 2: q.append((r, c))     # ⭐ ALL rotten oranges are sources
            elif grid[r][c] == 1: fresh += 1

    minutes = 0
    while q and fresh:
        for _ in range(len(q)):                       # one level = one minute
            r, c = q.popleft()
            for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc))
        minutes += 1

    return -1 if fresh else minutes
```

**Why multi-source is correct:** BFS explores in distance order from *whatever is in the queue*. With
`k` sources all at distance 0, level 1 is "everything adjacent to any source", level 2 is
"distance 2 from the nearest source", and so on. You get `k` simultaneous BFS frontiers for the cost
of one.

> **Running k separate BFS passes would be O(k · R · C). Multi-source is O(R · C).** That difference
> is the whole reason to recognise the pattern.

Note `while q and fresh` — stopping when nothing fresh remains avoids counting a phantom extra minute.

### 01 Matrix (distance to nearest 0)
```python
def update_matrix(mat):
    R, C = len(mat), len(mat[0])
    dist = [[-1] * C for _ in range(R)]
    q = deque()

    for r in range(R):
        for c in range(C):
            if mat[r][c] == 0:
                dist[r][c] = 0
                q.append((r, c))         # every 0 is a source

    while q:
        r, c = q.popleft()
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                q.append((nr, nc))

    return dist
```
Here `dist[nr][nc] == -1` doubles as the `visited` check — one array, two jobs.

---

## Reverse thinking — Pacific Atlantic Water Flow

> Water flows from a cell to a neighbour of **equal or lower** height. Which cells can reach *both*
> oceans?

**The naive approach:** from every cell, DFS to see if it reaches each ocean. O((R·C)²). Too slow.

**The reframe:** instead of asking "can this cell reach the ocean?", ask **"which cells can the ocean
reach, flowing backwards (uphill)?"** Start from the border and DFS *upward*.

```python
def pacific_atlantic(heights):
    R, C = len(heights), len(heights[0])
    pac, atl = set(), set()

    def dfs(r, c, seen, prev_height):
        if (r, c) in seen: return
        if not (0 <= r < R and 0 <= c < C): return
        if heights[r][c] < prev_height: return        # ⭐ can't flow UP-hill backwards
        seen.add((r, c))
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            dfs(r + dr, c + dc, seen, heights[r][c])

    for c in range(C):
        dfs(0, c, pac, heights[0][c])                 # top edge → Pacific
        dfs(R-1, c, atl, heights[R-1][c])             # bottom edge → Atlantic
    for r in range(R):
        dfs(r, 0, pac, heights[r][0])                 # left edge → Pacific
        dfs(r, C-1, atl, heights[r][C-1])             # right edge → Atlantic

    return [[r, c] for r in range(R) for c in range(C)
            if (r, c) in pac and (r, c) in atl]
```
**O(R·C).**

> **"Search from the destination instead of the source"** is a genuinely powerful general move.
> It also solves Surrounded Regions (mark border-connected `O`s as safe, flip the rest) and
> Walls and Gates (multi-source BFS from the gates).

---

## Surrounded Regions — the "mark the survivors" trick

> Flip every `O` region that doesn't touch the border into `X`.

Instead of testing each region for border-contact, **flood from the border and mark survivors**, then
flip everything else.

```python
def solve(board):
    if not board: return
    R, C = len(board), len(board[0])

    def mark_safe(r, c):
        if not (0 <= r < R and 0 <= c < C) or board[r][c] != 'O':
            return
        board[r][c] = 'S'                             # temporary marker
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            mark_safe(r + dr, c + dc)

    for r in range(R):
        mark_safe(r, 0); mark_safe(r, C-1)
    for c in range(C):
        mark_safe(0, c); mark_safe(R-1, c)

    for r in range(R):
        for c in range(C):
            board[r][c] = 'O' if board[r][c] == 'S' else 'X'
```

> **The general technique: instead of testing each candidate against a condition, flood from the
> condition and mark whatever it reaches.** Turns O(n · flood) into O(flood).

---

## BFS shortest path in a grid

```python
def shortest_path(grid, start, target):
    R, C = len(grid), len(grid[0])
    q = deque([(start[0], start[1], 0)])              # (r, c, distance)
    seen = {start}

    while q:
        r, c, d = q.popleft()
        if (r, c) == target:
            return d
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != 1 and (nr, nc) not in seen:
                seen.add((nr, nc))                     # ⭐ mark on ENQUEUE
                q.append((nr, nc, d + 1))
    return -1
```

> **When the state is more than a position** — e.g. "you may break up to `k` walls" (LC 1293) — put
> the extra dimension in the state and in `seen`: `(r, c, walls_broken)`. This "add a dimension to
> the state" move is how most hard BFS problems are solved. The graph is just bigger than the grid.

---

## DFS vs BFS on grids

| | DFS | BFS |
|---|---|---|
| Counting/measuring regions | ✅ simpler | works, more code |
| **Shortest path** | ❌ wrong | ✅ |
| "Time to spread" | ❌ | ✅ (levels = time) |
| Stack overflow risk on a big grid | ⚠ yes (recursion) | no |

For a 1000×1000 grid, recursive DFS **will** exceed Python's recursion limit. Either
`sys.setrecursionlimit(10**6)` or use an iterative stack.

---

## Traps

- Forgetting bounds checks — or doing them *after* indexing the grid.
- Marking visited on dequeue instead of enqueue (BFS).
- Not handling an empty grid or empty first row.
- Mutating the input without saying so.
- Using DFS for a shortest-path question.
- Forgetting that a grid may contain **multiple** disconnected regions — the outer scan matters.
