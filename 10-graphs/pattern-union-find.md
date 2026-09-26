# Pattern — Union-Find (Disjoint Set Union)

A structure that answers "**are these two things in the same group?**" and "**merge these two
groups**" in effectively O(1).

---

## How do I know to use this?

- "**connected components**", "**provinces**", "**groups**", "**friend circles**"
- "are `a` and `b` **connected**?"
- "**cycle** in an **undirected** graph"
- "**redundant connection**" — which edge creates a cycle
- "**valid tree**"
- "**accounts merge**", "**equations satisfiability**" — merging by shared attributes
- **Minimum spanning tree** (Kruskal's)
- Edges arrive **incrementally** and you must answer connectivity as you go

> **Union-Find vs DFS — the real distinction:**
> DFS works on a **static** graph you have in full. Union-Find shines when connections arrive **one
> at a time** and you must answer queries between arrivals. DFS would require re-running from scratch
> after every new edge; Union-Find just does one more `union`.

---

## The implementation ⭐ memorise this

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))     # each node starts as its own root
        self.rank = [1] * n              # tree size/height, for union by rank
        self.count = n                   # number of disjoint components

    def find(self, x):
        # path compression: point every node on the way directly at the root
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # halve the path
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                 # already connected → this edge makes a CYCLE
        # union by rank: attach the smaller tree under the larger
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.rank[ra] += self.rank[rb]
        self.count -= 1
        return True                      # merged successfully

    def connected(self, a, b):
        return self.find(a) == self.find(b)
```

**Total ~20 lines. Type it from memory until it's automatic** — it appears in enough problems to be
worth the muscle memory.

### The two optimisations, and why they matter

Without them, `find` is O(n) and the structure is useless.

1. **Path compression** — every `find` flattens the path it walked. Repeated lookups get cheaper.
   The line `self.parent[x] = self.parent[self.parent[x]]` is *path halving*: it points each node at
   its grandparent, achieving nearly the same effect as full compression with a single loop.

2. **Union by rank/size** — always attach the smaller tree under the larger, so trees stay shallow.

**Together they give O(α(n)) amortised**, where α is the inverse Ackermann function. For any `n` that
fits in the universe, α(n) < 5. Treat it as O(1).

> **The return value of `union` is doing double duty and it's the key to several problems:**
> `False` means "already in the same set", which means **this edge closes a cycle**. Redundant
> Connection, cycle detection, and Kruskal's all hinge on that single boolean.

---

## Example 1 — Number of Connected Components (LC 323)

```python
def count_components(n, edges):
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return uf.count
```
Four lines, because `count` is maintained inside `union`. This is why tracking it there is worth it.

---

## Example 2 — Redundant Connection (LC 684)

> A tree plus one extra edge. Find the edge that can be removed. Return the **last** such edge.

```python
def find_redundant_connection(edges):
    uf = UnionFind(len(edges) + 1)          # nodes are 1-indexed
    for u, v in edges:
        if not uf.union(u, v):              # already connected → this edge closes the cycle
            return [u, v]
```

Processing edges in order and returning the first failure naturally gives the *last* edge of the
cycle, which is what the problem asks for. Elegant — no explicit cycle-finding needed.

---

## Example 3 — Graph Valid Tree (LC 261)

> Is the graph a valid tree?

**A tree is exactly: connected + acyclic.** Two facts make this a 5-liner:
- A tree on `n` nodes has exactly `n - 1` edges.
- With `n - 1` edges, "acyclic" and "connected" are equivalent — proving either gives you the other.

```python
def valid_tree(n, edges):
    if len(edges) != n - 1:
        return False                        # wrong edge count → can't be a tree
    uf = UnionFind(n)
    for u, v in edges:
        if not uf.union(u, v):
            return False                    # cycle
    return True                             # n-1 edges and acyclic ⇒ connected
```

---

## Example 4 — Accounts Merge (LC 721)

> Merge accounts sharing any email address.

**The trick:** union isn't over accounts, it's over **emails**. Two emails in the same account get
unioned; transitivity does the rest automatically.

```python
def accounts_merge(accounts):
    uf = UnionFind(len(accounts))
    email_to_acct = {}                       # email -> the first account index that had it

    for i, acct in enumerate(accounts):
        for email in acct[1:]:
            if email in email_to_acct:
                uf.union(i, email_to_acct[email])    # shared email → same person
            else:
                email_to_acct[email] = i

    groups = defaultdict(list)
    for email, i in email_to_acct.items():
        groups[uf.find(i)].append(email)             # ⚠ group by ROOT, not by index

    return [[accounts[root][0]] + sorted(emails)
            for root, emails in groups.items()]
```

> **The reusable idea: union by a shared *attribute*, not by an explicit edge list.** The graph is
> implicit — "these two things share an email" *is* the edge. Same shape solves Similar String Groups,
> Sentence Similarity II, and most "group things that share something" problems.
>
> **Always group by `find(i)`, never by `i`.** Using the raw index misses merges that happened later.

---

## Example 5 — Kruskal's MST

```python
def minimum_spanning_tree(n, edges):
    """edges = [(weight, u, v)]"""
    edges.sort()                            # ① cheapest first
    uf = UnionFind(n)
    total = 0
    used = 0

    for w, u, v in edges:
        if uf.union(u, v):                  # ② take it only if it doesn't form a cycle
            total += w
            used += 1
            if used == n - 1:
                break                       # a spanning tree has exactly n-1 edges
    return total if used == n - 1 else -1   # -1 = graph is disconnected
```
**O(E log E)**, dominated by the sort.

**The greedy claim:** always take the cheapest edge that doesn't create a cycle. Provably optimal
(the *cut property*). Two lines of logic, one of the most famous algorithms in CS.

> **Min Cost to Connect All Points (LC 1584)** is Kruskal's on a complete graph of Manhattan
> distances. **Network Connectivity / Optimize Water Distribution** are the same with a virtual node.

---

## Weighted Union-Find (a step up)

For problems like **Evaluate Division** (LC 399) — "a/b = 2, b/c = 3, what is a/c?" — store a
*ratio to the parent* alongside each node, and multiply along the path during `find`.

```python
def find(self, x):
    if self.parent[x] != x:
        root = self.find(self.parent[x])
        self.weight[x] *= self.weight[self.parent[x]]   # accumulate along the path
        self.parent[x] = root
    return self.parent[x]
```

Worth knowing this exists. It generalises to any *composable* relation between elements (ratios,
offsets, parity), not just "same group / different group".

---

## Union-Find vs DFS/BFS — how to choose

| | Union-Find | DFS/BFS |
|---|---|---|
| Edges arrive incrementally | ✅ natural | ❌ must re-run |
| Static graph, one pass | works | ✅ simpler |
| Need the actual **path** | ❌ can't give you one | ✅ |
| Need only "same group?" | ✅ | works |
| Cycle in **undirected** | ✅ trivial | ✅ with a parent check |
| Cycle in **directed** | ❌ doesn't apply | ✅ 3-colour DFS |
| Kruskal's MST | ✅ required | ❌ |

> ⚠ **Union-Find does not work on directed graphs.** It models an *undirected* equivalence relation.
> If a problem is about directed cycles or dependencies, you want DFS or topological sort.

---

## Traps

- Omitting path compression or union by rank → O(n) per operation, TLE.
- Comparing `parent[a] == parent[b]` instead of `find(a) == find(b)`. Only roots are meaningful.
- Off-by-one on 1-indexed nodes — size the arrays `n + 1`.
- Grouping results by index rather than by `find(index)`.
- Reaching for Union-Find on a directed graph.
