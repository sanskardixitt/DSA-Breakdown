# The Cheat Sheet — "Which Pattern Do I Use?"

Read this every single day for the first two weeks. It is the lookup table your brain is missing.

---

## Part 1 — The Constraint Oracle

**Look at `n` in the constraints before anything else.** It tells you the intended complexity, which
tells you the pattern. This is the single fastest signal in competitive programming.

| Constraint on `n` | Target complexity | What that implies |
|---|---|---|
| `n ≤ 10` | O(n!) or O(2ⁿ · n) | **Permutations / brute-force backtracking** |
| `n ≤ 20` | O(2ⁿ) | **Subsets, bitmask DP** |
| `n ≤ 100` | O(n⁴) / O(n³) | Floyd–Warshall, heavy nested DP |
| `n ≤ 1,000` | O(n²) | **2-D DP**, pairwise loops, LIS (n²) |
| `n ≤ 100,000` | O(n log n) | **Sorting, heap, binary search, divide & conquer** |
| `n ≤ 1,000,000` | O(n) or O(n log n) | **Hash map, two pointers, sliding window, prefix sum** |
| `n ≥ 10,000,000` | O(log n) or O(1) | **Binary search, math formula, bit tricks** |

> Practical rule: a modern judge does roughly **10⁸ simple operations per second**.
> If `n = 10⁵` and you're considering O(n²) = 10¹⁰ → that's ~100 seconds. Too slow. Move on.

---

## Part 2 — The Decision Tree

Start at the top. Take the first branch that matches.

```
Is the input a STRING or ARRAY?
│
├─ Is it SORTED (or can I sort it)?
│  ├─ Looking for a pair/triplet summing to a target? ──────► TWO POINTERS (opposite ends)
│  ├─ Looking for a specific value / boundary / insert pos? ► BINARY SEARCH
│  └─ Intervals / meetings / merge? ────────────────────────► SORT BY START, then sweep
│
├─ Asking about a CONTIGUOUS subarray/substring?
│  ├─ "longest/shortest/max/min ... satisfying a condition" ► SLIDING WINDOW (variable)
│  ├─ Fixed size k ("every window of size k") ─────────────► SLIDING WINDOW (fixed)
│  └─ "how many subarrays sum to k" / range sums ─────────► PREFIX SUM + HASH MAP
│
├─ Asking about a SUBSEQUENCE (non-contiguous)? ───────────► DP (LIS / LCS family)
│
├─ Need counts, frequencies, "seen before", dedupe? ───────► HASH MAP / HASH SET
│
├─ "Next greater / next smaller / span / histogram"? ──────► MONOTONIC STACK
│
├─ "Top K" / "K closest" / "Kth largest"? ─────────────────► HEAP (size K)
│
├─ "Median of a stream"? ──────────────────────────────────► TWO HEAPS
│
└─ Maximise/minimise a single answer value, and I can
   CHECK a candidate answer in O(n)? ─────────────────────► BINARY SEARCH ON THE ANSWER

Is the input a TREE?
├─ Per-node info that bubbles UP from children? ───────────► DFS with return value (postorder)
├─ Info that flows DOWN from parent (range, path)? ────────► DFS with parameters (preorder)
├─ "Level", "depth", "closest", "shortest"? ───────────────► BFS (queue)
└─ It's a BST? ───────────────────────────────────────────► INORDER = sorted; use the range invariant

Is the input a GRAPH / GRID / "connections" / "dependencies"?
├─ Shortest path, UNWEIGHTED? ────────────────────────────► BFS
├─ Shortest path, WEIGHTED non-negative? ─────────────────► DIJKSTRA (heap)
├─ "Can I finish all courses", "build order", cycle in DAG?► TOPOLOGICAL SORT (Kahn's)
├─ "Number of connected components", "are these joined"? ─► UNION-FIND (or DFS flood fill)
├─ "Islands", "regions", "flood fill", "surrounded"? ─────► GRID DFS/BFS
└─ All-pairs, n ≤ 400? ───────────────────────────────────► FLOYD–WARSHALL

Do I need to ENUMERATE all valid configurations?
("all subsets", "all permutations", "all ways to", "print every")  ► BACKTRACKING

Is it an OPTIMISATION with OVERLAPPING SUBPROBLEMS?
("min/max/count number of ways", and a greedy choice is provably wrong) ► DYNAMIC PROGRAMMING

Does a LOCAL best choice provably give the GLOBAL best?
("minimum number of X", intervals, jumps, scheduling) ─────► GREEDY

Are we dealing with XOR / powers of two / "without using + operator"? ► BIT MANIPULATION
```

---

## Part 3 — Trigger Phrase → Pattern (the fast lookup)

| If the problem says... | Reach for... |
|---|---|
| "sorted array" | Binary search **or** two pointers |
| "contiguous subarray" / "substring" | Sliding window or prefix sum |
| "subsequence" | DP |
| "longest / shortest ... such that" | Sliding window (variable) |
| "at most K" / "at most one" | Sliding window with a counter |
| "sum equals k" (subarray count) | Prefix sum + hash map |
| "in-place, O(1) extra space" | Two pointers / index-as-hash / bit tricks |
| "duplicate exists" | Hash set, or fast/slow cycle detection |
| "anagram", "permutation of" | Frequency counter (`Counter` / 26-array) |
| "next greater", "next smaller", "warmer" | Monotonic stack |
| "top K", "K most/least frequent" | Heap of size K (or bucket sort) |
| "median of a stream" | Two heaps |
| "merge K sorted" | Min-heap |
| "all combinations / permutations / subsets" | Backtracking |
| "minimum number of steps/jumps" (unweighted) | BFS or greedy |
| "shortest path with weights" | Dijkstra |
| "prerequisite", "dependency", "build order" | Topological sort |
| "connected", "groups", "islands", "provinces" | Union-Find / DFS flood fill |
| "number of ways to" | DP (counting) |
| "min cost / max profit" over choices | DP or greedy |
| "can you partition into two equal halves" | Subset-sum DP |
| "maximum in every window of size k" | Monotonic deque |
| "cycle in a linked list" | Floyd's fast/slow |
| "find the missing/single number" | XOR or math sum |
| "the answer is a number in a range, and I can verify it" | Binary search on the answer |

---

## Part 4 — Complexity Reference

### Python built-in operations

| Operation | Complexity | Gotcha |
|---|---|---|
| `list[i]` | O(1) | |
| `list.append(x)` | O(1) amortised | |
| `list.pop()` | O(1) | |
| `list.pop(0)` | **O(n)** | ⚠ Use `collections.deque` instead |
| `list.insert(0, x)` | **O(n)** | ⚠ Same |
| `x in list` | **O(n)** | ⚠ The #1 accidental O(n²) |
| `x in set` / `x in dict` | O(1) avg | |
| `list.sort()` / `sorted()` | O(n log n) | Timsort; stable |
| `s1 + s2` (strings) | O(len) | ⚠ In a loop → O(n²). Use `''.join(parts)` |
| `deque.popleft()` / `appendleft()` | O(1) | |
| `heapq.heappush` / `heappop` | O(log n) | |
| `heapq.heapify(list)` | O(n) | Cheaper than n pushes |
| slicing `a[i:j]` | O(j−i) | ⚠ Copies. In a loop → O(n²) |
| `min()` / `max()` / `sum()` | O(n) | ⚠ Inside a loop → O(n²) |

### Data structure summary

| Structure | Access | Search | Insert | Delete | Use when |
|---|---|---|---|---|---|
| Array / list | O(1) | O(n) | O(n) | O(n) | Index access, iteration |
| Dynamic array append | — | — | O(1)* | O(1) end | Default container |
| Hash map / set | — | O(1) | O(1) | O(1) | Lookup, counting, dedupe |
| Linked list | O(n) | O(n) | O(1)† | O(1)† | O(1) splice with a node ref |
| Stack | — | — | O(1) | O(1) | LIFO, undo, matching, DFS |
| Queue (deque) | — | — | O(1) | O(1) | FIFO, BFS |
| Binary heap | O(1) peek | O(n) | O(log n) | O(log n) | Repeated min/max |
| Balanced BST | O(log n) | O(log n) | O(log n) | O(log n) | Ordered + dynamic |
| Trie | — | O(L) | O(L) | O(L) | Prefix queries |
| Union-Find | — | ~O(1) | ~O(1) | — | Dynamic connectivity |

\* amortised · † given a pointer to the node

### Sorting algorithms

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Merge sort | n log n | n log n | n log n | O(n) | ✅ |
| Quicksort | n log n | n log n | **n²** | O(log n) | ❌ |
| Heapsort | n log n | n log n | n log n | O(1) | ❌ |
| Timsort (Python) | **n** | n log n | n log n | O(n) | ✅ |
| Counting sort | n+k | n+k | n+k | O(k) | ✅ |
| Insertion sort | **n** | n² | n² | O(1) | ✅ |

### Graph algorithms

| Algorithm | Complexity | Use for |
|---|---|---|
| BFS / DFS | O(V + E) | Traversal, connectivity, unweighted shortest path |
| Topological sort (Kahn) | O(V + E) | Dependency ordering, DAG cycle detection |
| Dijkstra (binary heap) | O(E log V) | Shortest path, non-negative weights |
| Bellman–Ford | O(V · E) | Negative weights, negative-cycle detection |
| Floyd–Warshall | O(V³) | All-pairs shortest path, small V |
| Union-Find | ~O(α(n)) ≈ O(1) | Connectivity, cycle detection (undirected), Kruskal |

---

## Part 5 — The Five Questions to Ask When Stuck

When you've been stuck for 10 minutes, run these in order. One of them almost always breaks it open.

1. **"What's the brute force, and what is it recomputing?"**
   → If it recomputes overlapping work: DP or memoisation.
   → If it re-scans a shifting range: sliding window or prefix sum.

2. **"Would sorting help?"**
   → Unlocks two pointers, binary search, greedy, interval sweeps. Costs only O(n log n).

3. **"Can I trade space for time?"**
   → A hash map that remembers what you've seen turns most O(n²) scans into O(n).

4. **"Can I process this from the other end?"**
   → Right-to-left, or from the answer backwards. Fixes a surprising number of DP and greedy problems.

5. **"What's the smallest input where the answer isn't obvious?"**
   → Solve n=1, n=2, n=3 by hand. Write the answers out. The recurrence usually falls out of the table.
