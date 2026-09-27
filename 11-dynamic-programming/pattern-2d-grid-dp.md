# Pattern — 2-D Grid DP

`dp[r][c]` = the answer for reaching (or starting from) cell `(r, c)`.

---

## How do I know to use this?

- A **grid**, with movement restricted to **one or two directions** (usually right and down)
- "how many **unique paths**"
- "**minimum path sum**"
- "**maximum** points collectible on a path"
- "**triangle** minimum path"
- "largest **square**/rectangle of 1s"

> **The critical distinction from graph problems:** if you can move in *all four* directions, it's a
> graph problem (BFS/Dijkstra) because there are cycles. DP requires the movement to be **acyclic** —
> that's what makes "everything above and to the left is already computed" true.
>
> Right-and-down only ⇒ DP. All four directions ⇒ BFS/Dijkstra. Check this first, every time.

---

## The template

```python
R, C = len(grid), len(grid[0])
dp = [[0] * C for _ in range(R)]

dp[0][0] = <base>
for r in range(R):
    for c in range(C):
        if r == 0 and c == 0: continue
        dp[r][c] = <combine dp[r-1][c] and dp[r][c-1] with grid[r][c]>

return dp[R-1][C-1]
```

---

## Example 1 — Unique Paths (LC 62)

> Move only right or down from the top-left to the bottom-right. How many paths?

**`dp[r][c]` = the number of paths from `(0,0)` to `(r,c)`.**

**The transition:** you arrived at `(r,c)` either from above or from the left. Disjoint, exhaustive:
```
dp[r][c] = dp[r-1][c] + dp[r][c-1]
```

```python
def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]     # first row and column are all 1 (only one way)
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r-1][c] + dp[r][c-1]
    return dp[m-1][n-1]
```

### Space optimisation to O(n)
```python
def unique_paths(m, n):
    row = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            row[c] += row[c-1]           # row[c] = old row[c] (above) + row[c-1] (left)
    return row[-1]
```
> **Read that carefully — it's the model for every 2-D → 1-D compression.** At the moment of the
> update, `row[c]` still holds the *previous* row's value (which is "above") and `row[c-1]` has
> already been updated to *this* row (which is "left"). One array, both neighbours.

### The math answer
It's `C(m+n-2, m-1)` — choose which of the `m+n-2` moves are "down". Worth mentioning; it's O(min(m,n))
and shows range. But **write the DP first** — that's what's being assessed.

---

## Example 2 — Unique Paths II (LC 63), with obstacles

```python
def unique_paths_with_obstacles(grid):
    R, C = len(grid), len(grid[0])
    if grid[0][0] == 1:
        return 0
    dp = [[0] * C for _ in range(R)]
    dp[0][0] = 1

    for r in range(R):
        for c in range(C):
            if grid[r][c] == 1:
                dp[r][c] = 0             # ⭐ an obstacle contributes zero paths
                continue
            if r > 0: dp[r][c] += dp[r-1][c]
            if c > 0: dp[r][c] += dp[r][c-1]

    return dp[R-1][C-1]
```

> **The technique: represent "impossible" with an identity element** — `0` for counting, `inf` for
> minimisation, `False` for reachability. Then the normal transition handles obstacles automatically
> with no special branches.

---

## Example 3 — Minimum Path Sum (LC 64)

```python
def min_path_sum(grid):
    R, C = len(grid), len(grid[0])
    dp = [[0] * C for _ in range(R)]
    dp[0][0] = grid[0][0]

    for c in range(1, C): dp[0][c] = dp[0][c-1] + grid[0][c]     # first row: only from the left
    for r in range(1, R): dp[r][0] = dp[r-1][0] + grid[r][0]     # first column: only from above

    for r in range(1, R):
        for c in range(1, C):
            dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])

    return dp[R-1][C-1]
```

Handling the first row and column separately is clearer than branching inside the main loop. Either
is fine, but pick one and be consistent.

---

## Example 4 — Triangle (LC 120)

> Minimum path sum from top to bottom; from index `i` you may move to `i` or `i+1` on the next row.

**Work bottom-up** — it removes the boundary special cases entirely.

```python
def minimum_total(triangle):
    dp = triangle[-1][:]                          # start with the last row

    for r in range(len(triangle) - 2, -1, -1):    # second-to-last row upwards
        for c in range(len(triangle[r])):
            dp[c] = triangle[r][c] + min(dp[c], dp[c+1])

    return dp[0]
```
**O(n²) time, O(n) space.**

> **Going bottom-up here is the actual insight.** Top-down forces you to handle "the first and last
> elements of each row have only one predecessor". Bottom-up, every cell always has exactly two
> children. **When boundary cases are ugly, try reversing the direction of the DP** — it often makes
> them vanish.

---

## Example 5 — Maximal Square (LC 221)

> Largest square of 1s in a binary matrix.

**`dp[r][c]` = the side length of the largest square whose *bottom-right corner* is `(r,c)`.**

```python
def maximal_square(matrix):
    R, C = len(matrix), len(matrix[0])
    dp = [[0] * (C + 1) for _ in range(R + 1)]    # padded — no boundary checks needed
    best = 0

    for r in range(1, R + 1):
        for c in range(1, C + 1):
            if matrix[r-1][c-1] == '1':
                dp[r][c] = 1 + min(dp[r-1][c],      # above
                                   dp[r][c-1],      # left
                                   dp[r-1][c-1])    # diagonal
                best = max(best, dp[r][c])

    return best * best
```

### Why `min` of three?

A `k×k` square ending at `(r,c)` requires **all three** of these to exist:
- a `(k-1)×(k-1)` square ending above,
- one ending to the left,
- one ending diagonally.

The smallest of the three is the bottleneck. Draw a 3×3 case on paper — this is one of those
recurrences that looks arbitrary until you see it, then becomes obvious.

> **Note the padding trick:** sizing `dp` as `(R+1) × (C+1)` means `dp[r-1]` and `dp[c-1]` are always
> valid indices. Padding to eliminate boundary checks is a habit worth building — it applies to prefix
> sums, grid DP, and string DP alike.

---

## Example 6 — Dungeon Game (LC 174) 🔴 — the reverse-direction lesson

> A knight starts top-left, ends bottom-right, moving right/down. Cells add or subtract health.
> Find the **minimum starting health** such that health never drops to 0.

**Why forward DP fails:** "maximum health at `(r,c)`" is *not* enough information. A path arriving with
high health may have dipped below zero on the way, and a path with lower health may have been safe
throughout. The forward state doesn't capture what you need.

**The fix — go backwards.** `dp[r][c]` = the minimum health needed **when entering** `(r,c)` to survive
to the end.

```python
def calculate_minimum_hp(dungeon):
    R, C = len(dungeon), len(dungeon[0])
    dp = [[float('inf')] * (C + 1) for _ in range(R + 1)]
    dp[R][C-1] = dp[R-1][C] = 1                   # need at least 1 HP when exiting

    for r in range(R - 1, -1, -1):
        for c in range(C - 1, -1, -1):
            need = min(dp[r+1][c], dp[r][c+1]) - dungeon[r][c]
            dp[r][c] = max(1, need)               # ⭐ never below 1

    return dp[0][0]
```

> **The general lesson — and it's a big one:** if a forward DP state doesn't carry enough information
> to make the decision, try defining the state **backwards from the goal**. "What do I need *from
> here* to succeed?" is often a cleaner state than "what have I accumulated *so far*?"
>
> This same move rescues several hard DP problems. Keep it in your toolkit.

---

## Debug checklist

- [ ] Movement restricted (right/down)? If all four directions are allowed, this is **not** DP.
- [ ] First row and first column initialised correctly.
- [ ] Obstacles/invalid cells set to the identity (`0` / `inf` / `False`).
- [ ] `dp` padded, or bounds explicitly checked?
- [ ] Is the answer `dp[R-1][C-1]`, `dp[0][0]`, or a max over the whole table?
- [ ] Would a bottom-up or right-to-left direction remove the boundary cases?
