# Graphs — Problem Set

---

## Grid traversal (Day 20)

### 1. Number of Islands 🟡
[LeetCode 200](https://leetcode.com/problems/number-of-islands/)
- **Nudge:** outer scan finds region starts; inner flood consumes each region.
- ⭐ The base grid template. Write both DFS and BFS versions.

### 2. Max Area of Island 🟡
[LeetCode 695](https://leetcode.com/problems/max-area-of-island/)
- **Nudge:** the flood *returns a count* instead of returning nothing.

### 3. Clone Graph 🟡
[LeetCode 133](https://leetcode.com/problems/clone-graph/)
- **Nudge:** `dict: old_node → new_node`. The dict doubles as your `visited` set.

### 4. Rotting Oranges 🟡
[LeetCode 994](https://leetcode.com/problems/rotting-oranges/)
- **Nudge:** **multi-source BFS** — seed the queue with *every* rotten orange. Levels = minutes.
- ⭐ The problem that teaches multi-source. If you tried per-source BFS, re-read the pattern file.

---

## Topological sort (Day 21)

### 5. Course Schedule 🟡
[LeetCode 207](https://leetcode.com/problems/course-schedule/)
- **Nudge:** it's a cycle-detection question wearing a scheduling costume.
- **Trap:** `[a, b]` means "b before a". Write the direction down before coding.

### 6. Course Schedule II 🟡
[LeetCode 210](https://leetcode.com/problems/course-schedule-ii/)
- **Nudge:** identical to #5, but return the order. `len(order) < n` ⇒ return `[]`.

### 7. Pacific Atlantic Water Flow 🟡
[LeetCode 417](https://leetcode.com/problems/pacific-atlantic-water-flow/)
- **Nudge:** don't ask "can this cell reach the ocean?" Ask "which cells can the ocean reach flowing
  backwards?" Start from the borders.
- ⭐ The best "reverse the direction of the search" exercise here.

### 8. Surrounded Regions 🟡
[LeetCode 130](https://leetcode.com/problems/surrounded-regions/)
- **Nudge:** flood from the border to mark survivors, then flip everything else.

---

## Union-Find & shortest paths (Day 22)

### 9. Number of Connected Components in an Undirected Graph 🟡
[LeetCode 323](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) *(premium — also on NeetCode)*
- **Nudge:** write the full `UnionFind` class here, with path compression and union by rank. You'll
  reuse it four more times.

### 10. Redundant Connection 🟡
[LeetCode 684](https://leetcode.com/problems/redundant-connection/)
- **Nudge:** the first `union` that returns `False` is the answer.

### 11. Graph Valid Tree 🟡
[LeetCode 261](https://leetcode.com/problems/graph-valid-tree/) *(premium — also on NeetCode)*
- **Nudge:** `n - 1` edges **and** no cycle ⇒ connected. Both checks, not just one.

### 12. Network Delay Time 🟡
[LeetCode 743](https://leetcode.com/problems/network-delay-time/)
- **Nudge:** Dijkstra. The answer is the **max** of the shortest distances.

---

## Extension

### 13. Word Ladder 🔴
[LeetCode 127](https://leetcode.com/problems/word-ladder/)
- **Nudge:** nodes are words, edges connect words differing by one letter. **BFS** gives the shortest
  transformation.
- **The key optimisation:** don't compare every pair of words (O(n²·L)). Build a map of wildcard
  patterns: `h*t → [hot, hat, hit]`. Then neighbours are O(L) to find.
- ⭐ The flagship "implicit graph" problem.

### 14. Course Schedule IV 🟡
[LeetCode 1462](https://leetcode.com/problems/course-schedule-iv/)
- **Nudge:** transitive reachability. Floyd–Warshall on booleans, or DFS from each node.

### 15. Alien Dictionary 🔴
[LeetCode 269](https://leetcode.com/problems/alien-dictionary/) *(premium — also on NeetCode)*
- **Nudge:** compare adjacent words, take the **first** differing character as one edge, then topo sort.
- **Three traps:** `break` after the first difference; the invalid-prefix case; include every character
  as a node.

### 16. Accounts Merge 🟡
[LeetCode 721](https://leetcode.com/problems/accounts-merge/)
- **Nudge:** union by shared **email**, not by account. Group results by `find(i)`.

### 17. Min Cost to Connect All Points 🟡
[LeetCode 1584](https://leetcode.com/problems/min-cost-to-connect-all-points/)
- **Nudge:** MST on a complete graph of Manhattan distances. Kruskal (Union-Find) or Prim (heap).

### 18. Cheapest Flights Within K Stops 🟡
[LeetCode 787](https://leetcode.com/problems/cheapest-flights-within-k-stops/)
- **Nudge:** Bellman–Ford with exactly `k + 1` rounds — the round count caps the edges used.
- **Trap:** snapshot `dist` each round, or one round chains multiple flights.

### 19. Walls and Gates 🟡
[LeetCode 286](https://leetcode.com/problems/walls-and-gates/) *(premium — also on NeetCode)*
- **Nudge:** multi-source BFS from every gate. Same shape as Rotting Oranges.

### 20. 01 Matrix 🟡
[LeetCode 542](https://leetcode.com/problems/01-matrix/)
- **Nudge:** multi-source BFS from every zero.

### 21. Is Graph Bipartite? 🟡
[LeetCode 785](https://leetcode.com/problems/is-graph-bipartite/)
- **Nudge:** 2-colour with BFS. **Loop over every start** — the graph may be disconnected.

### 22. Shortest Path in a Grid with Obstacles Elimination 🔴
[LeetCode 1293](https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/)
- **Nudge:** the state is `(r, c, obstacles_removed)`, not just `(r, c)`. Add the dimension to `seen`.
- ⭐ The best example of "add a dimension to the BFS state".

### 23. Evaluate Division 🟡
[LeetCode 399](https://leetcode.com/problems/evaluate-division/)
- **Nudge:** a weighted graph where the edge `a→b` has weight `a/b`. DFS multiplying along the path
  (or weighted Union-Find).

### 24. Path With Minimum Effort 🟡
[LeetCode 1631](https://leetcode.com/problems/path-with-minimum-effort/)
- **Nudge:** Dijkstra with `max` relaxation instead of `+`.

---

## Self-check

1. When must you use BFS rather than DFS, with no exceptions?
2. Why mark nodes visited on **enqueue** rather than on dequeue?
3. Why is a plain `visited` set insufficient for cycle detection in a **directed** graph?
4. Explain multi-source BFS and why it's O(V+E) rather than O(k·(V+E)).
5. Write `UnionFind` from memory. What do path compression and union by rank each buy you?
6. What does `union()` returning `False` tell you?
7. Why does Dijkstra break with negative weights? Give the one-sentence argument.
8. Give three examples of implicit graphs — problems that never use the word "graph".
