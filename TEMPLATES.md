# All Templates, In One Place

For revision. Spend 10 minutes here every week — **typing them out from memory**, not reading them.
Templates decay fast if unused.

---

## Two Pointers

```python
# Opposite ends (sorted input)
l, r = 0, len(arr) - 1
while l < r:
    s = arr[l] + arr[r]
    if s == target: return [l, r]
    elif s < target: l += 1
    else: r -= 1

# Read/write (in-place filtering)
write = 0
for read in range(len(nums)):
    if keep(nums[read]):
        nums[write] = nums[read]
        write += 1
return write

# Fast & slow — middle of a list
slow = fast = head
while fast and fast.next:
    slow, fast = slow.next, fast.next.next
return slow                       # second middle; start fast=head.next for the first

# Fast & slow — cycle entrance (Floyd)
slow = fast = head
while fast and fast.next:
    slow, fast = slow.next, fast.next.next
    if slow is fast:
        slow2 = head
        while slow2 is not slow:
            slow, slow2 = slow.next, slow2.next
        return slow
return None
```

---

## Sliding Window

```python
# LONGEST valid window
left = 0; best = 0
for right in range(n):
    add(arr[right])
    while INVALID:
        remove(arr[left]); left += 1
    best = max(best, right - left + 1)

# SHORTEST valid window
left = 0; best = float('inf')
for right in range(n):
    add(arr[right])
    while VALID:
        best = min(best, right - left + 1)
        remove(arr[left]); left += 1

# COUNT windows (at most K)
left = 0; total = 0
for right in range(n):
    add(arr[right])
    while INVALID:
        remove(arr[left]); left += 1
    total += right - left + 1

# FIXED size k
for right in range(len(arr)):
    add(arr[right])
    if right >= k - 1:
        record()
        remove(arr[right - k + 1])
```

---

## Prefix Sum

```python
# Range queries
P = [0] + list(accumulate(nums))
range_sum = P[j+1] - P[i]

# Count subarrays with sum == k
count = defaultdict(int); count[0] = 1
running = res = 0
for x in nums:
    running += x
    res += count[running - k]
    count[running] += 1

# Longest subarray with sum == k
first = {0: -1}; running = best = 0
for i, x in enumerate(nums):
    running += x
    if running - k in first: best = max(best, i - first[running - k])
    if running not in first: first[running] = i
```

---

## Binary Search

```python
# Exact match
lo, hi = 0, len(nums) - 1
while lo <= hi:
    mid = (lo + hi) // 2
    if nums[mid] == target: return mid
    elif nums[mid] < target: lo = mid + 1
    else: hi = mid - 1
return -1

# First TRUE (minimise) — the workhorse
lo, hi = 0, n - 1
while lo < hi:
    mid = (lo + hi) // 2
    if predicate(mid): hi = mid
    else: lo = mid + 1
return lo

# Last TRUE (maximise) — note the +1 in mid
lo, hi = 0, n - 1
while lo < hi:
    mid = (lo + hi + 1) // 2
    if predicate(mid): lo = mid
    else: hi = mid - 1
return lo

# Binary search on the answer
lo, hi = min_possible, max_possible
while lo < hi:
    mid = (lo + hi) // 2
    if can_do(mid): hi = mid
    else: lo = mid + 1
return lo
```
> Pairing rule: `hi = mid` ⟷ `mid = (lo+hi)//2` · `lo = mid` ⟷ `mid = (lo+hi+1)//2`

---

## Monotonic Stack

```python
# Next greater element
res = [-1] * n
stack = []                              # indices, values DECREASING
for i, x in enumerate(nums):
    while stack and nums[stack[-1]] < x:
        res[stack.pop()] = x
    stack.append(i)

# Previous smaller element
res = [-1] * n
stack = []                              # indices, values INCREASING
for i, x in enumerate(nums):
    while stack and nums[stack[-1]] >= x:
        stack.pop()
    res[i] = stack[-1] if stack else -1
    stack.append(i)

# Largest rectangle in histogram
stack = []; best = 0
for i, h in enumerate(heights + [0]):   # sentinel drains the stack
    while stack and heights[stack[-1]] >= h:
        height = heights[stack.pop()]
        left = stack[-1] if stack else -1
        best = max(best, height * (i - left - 1))
    stack.append(i)
```

---

## Linked Lists

```python
# Reverse
prev, cur = None, head
while cur:
    nxt = cur.next
    cur.next = prev
    prev, cur = cur, nxt
return prev

# Dummy for building/merging
dummy = ListNode()
tail = dummy
# ... tail.next = node; tail = tail.next ...
return dummy.next

# Remove nth from end
dummy = ListNode(0, head)
slow = fast = dummy
for _ in range(n): fast = fast.next
while fast.next: slow, fast = slow.next, fast.next
slow.next = slow.next.next
return dummy.next
```

---

## Trees

```python
# DFS bottom-up (postorder)
def dfs(node):
    if not node: return IDENTITY
    L, R = dfs(node.left), dfs(node.right)
    return combine(L, R, node.val)

# DFS top-down (preorder, info flows down)
def dfs(node, info):
    if not node: return
    new_info = update(info, node.val)
    dfs(node.left, new_info)
    dfs(node.right, new_info)

# Return one thing, record another (diameter / max path sum)
best = float('-inf')
def dfs(node):
    nonlocal best
    if not node: return 0
    L = max(dfs(node.left), 0)
    R = max(dfs(node.right), 0)
    best = max(best, node.val + L + R)      # path THROUGH this node
    return node.val + max(L, R)             # path CONTINUING upward

# BFS level order
q = deque([root])
while q:
    level_size = len(q)                     # ⭐ snapshot
    for _ in range(level_size):
        node = q.popleft()
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)

# Iterative inorder (BST → sorted)
stack, cur = [], root
while cur or stack:
    while cur:
        stack.append(cur); cur = cur.left
    cur = stack.pop()
    visit(cur)
    cur = cur.right

# Validate BST (range flows down)
def valid(node, lo, hi):
    if not node: return True
    if not (lo < node.val < hi): return False
    return valid(node.left, lo, node.val) and valid(node.right, node.val, hi)
```

---

## Heaps

```python
import heapq

# Size-K heap (K largest → MIN-heap)
h = []
for x in nums:
    heapq.heappush(h, x)
    if len(h) > k: heapq.heappop(h)

# Max-heap: negate
heapq.heappush(h, -val); largest = -heapq.heappop(h)

# Tuples with a tiebreaker (avoids TypeError)
import itertools
counter = itertools.count()
heapq.heappush(h, (priority, next(counter), payload))

# Two heaps (running median)
# small = max-heap (negated) | large = min-heap
heapq.heappush(small, -num)
if large and -small[0] > large[0]:
    heapq.heappush(large, -heapq.heappop(small))
if len(small) > len(large) + 1:
    heapq.heappush(large, -heapq.heappop(small))
elif len(large) > len(small):
    heapq.heappush(small, -heapq.heappop(large))
```

---

## Backtracking

```python
# Universal skeleton
def backtrack(state):
    if is_complete(state):
        res.append(path[:])              # ⚠ COPY
        return
    for choice in options(state):
        if not valid(choice): continue
        path.append(choice)              # choose
        backtrack(next_state)            # explore
        path.pop()                       # un-choose

# Subsets
def backtrack(start):
    res.append(path[:])                  # every node is an answer
    for i in range(start, len(nums)):
        path.append(nums[i]); backtrack(i + 1); path.pop()

# Combinations with duplicates
nums.sort()
def backtrack(start):
    ...
    for i in range(start, len(nums)):
        if i > start and nums[i] == nums[i-1]: continue
        path.append(nums[i]); backtrack(i + 1); path.pop()

# Permutations
used = [False] * n
def backtrack():
    if len(path) == n: res.append(path[:]); return
    for i in range(n):
        if used[i]: continue
        if i > 0 and nums[i] == nums[i-1] and not used[i-1]: continue   # dup rule
        used[i] = True; path.append(nums[i])
        backtrack()
        path.pop(); used[i] = False
```
> `i + 1` = use once · `i` = reuse allowed

---

## Graphs

```python
# Adjacency list
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v); graph[v].append(u)      # drop the 2nd for directed

# BFS (shortest path, unweighted)
q = deque([start]); seen = {start}; dist = {start: 0}
while q:
    u = q.popleft()
    for v in graph[u]:
        if v not in seen:
            seen.add(v)                          # ⭐ mark on ENQUEUE
            dist[v] = dist[u] + 1
            q.append(v)

# Grid setup
DIRS = [(0,1), (1,0), (0,-1), (-1,0)]
R, C = len(grid), len(grid[0])

# Grid flood fill
def flood(r, c):
    if not (0 <= r < R and 0 <= c < C) or grid[r][c] != TARGET: return
    grid[r][c] = VISITED
    for dr, dc in DIRS: flood(r + dr, c + dc)

# Multi-source BFS
q = deque(all_sources)                           # ALL at distance 0

# Topological sort (Kahn)
indegree = [0] * n
for u, v in edges:
    graph[u].append(v); indegree[v] += 1
q = deque(i for i in range(n) if indegree[i] == 0)
order = []
while q:
    u = q.popleft(); order.append(u)
    for v in graph[u]:
        indegree[v] -= 1
        if indegree[v] == 0: q.append(v)
return order if len(order) == n else []          # short ⇒ cycle

# Dijkstra
dist = {}
pq = [(0, src)]
while pq:
    d, u = heapq.heappop(pq)
    if u in dist: continue                       # ⭐ stale entry
    dist[u] = d
    for v, w in graph[u]:
        if v not in dist: heapq.heappush(pq, (d + w, v))
```

### Union-Find
```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [1] * n
        self.count = n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False                # already connected → cycle
        if self.rank[ra] < self.rank[rb]: ra, rb = rb, ra
        self.parent[rb] = ra
        self.rank[ra] += self.rank[rb]
        self.count -= 1
        return True
```

---

## Dynamic Programming

```python
# Top-down (derive this FIRST)
from functools import cache
@cache
def dp(state):
    if base_case: return base_value
    return combine(dp(smaller_state), ...)

# 1-D, O(1) space (House Robber shape)
prev2, prev1 = 0, 0
for x in nums:
    prev2, prev1 = prev1, max(prev1, prev2 + x)
return prev1

# 0/1 knapsack — capacity BACKWARDS
for item in items:
    for c in range(capacity, item.weight - 1, -1):
        dp[c] = max(dp[c], dp[c - item.weight] + item.value)

# Unbounded knapsack — capacity FORWARDS
for item in items:
    for c in range(item.weight, capacity + 1):
        dp[c] = max(dp[c], dp[c - item.weight] + item.value)

# Counting: combinations (items outer) vs permutations (amount outer)
for c in coins:                       # combinations
    for a in range(c, amount + 1): dp[a] += dp[a - c]

for a in range(1, target + 1):        # permutations
    for c in coins:
        if c <= a: dp[a] += dp[a - c]

# Two sequences
dp = [[0] * (n + 1) for _ in range(m + 1)]
for i in range(1, m + 1):
    for j in range(1, n + 1):
        if a[i-1] == b[j-1]: dp[i][j] = dp[i-1][j-1] + 1
        else:                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

# LIS, O(n log n)
tails = []
for x in nums:
    i = bisect.bisect_left(tails, x)
    if i == len(tails): tails.append(x)
    else: tails[i] = x
return len(tails)

# Kadane
best = cur = nums[0]
for x in nums[1:]:
    cur = max(x, cur + x)
    best = max(best, cur)

# Expand around centre (palindromes)
def expand(l, r):
    while l >= 0 and r < len(s) and s[l] == s[r]:
        l -= 1; r += 1
    return l + 1, r - l - 1
for i in range(len(s)):
    expand(i, i); expand(i, i + 1)
```

---

## Intervals

```python
# Merge overlapping — sort by START
intervals.sort(key=lambda x: x[0])
merged = []
for iv in intervals:
    if merged and iv[0] <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], iv[1])     # ⚠ max, for nested intervals
    else:
        merged.append(iv)

# Max non-overlapping — sort by END
intervals.sort(key=lambda x: x[1])
kept, last_end = 0, float('-inf')
for s, e in intervals:
    if s >= last_end:
        kept += 1; last_end = e

# Min rooms — min-heap of end times
intervals.sort(key=lambda x: x[0])
ends = []
for s, e in intervals:
    if ends and ends[0] <= s: heapq.heappop(ends)
    heapq.heappush(ends, e)
return len(ends)

# Sweep line
events = [(s, 1) for s, e in iv] + [(e, -1) for s, e in iv]
events.sort()
cur = best = 0
for _, d in events:
    cur += d; best = max(best, cur)
```

---

## Bits

```python
x & (x - 1)              # clear the lowest set bit
x & -x                   # isolate the lowest set bit
x > 0 and x & (x-1) == 0 # power of two
(x >> i) & 1             # read bit i
x | (1 << i)             # set bit i
x & ~(1 << i)            # clear bit i
x ^ (1 << i)             # toggle bit i

# XOR all → the element appearing an odd number of times
res = 0
for x in nums: res ^= x

# Enumerate all subsets of n items
for mask in range(1 << n):
    subset = [items[i] for i in range(n) if mask >> i & 1]
```
> ⚠ Parenthesise! `x & 1 == 0` parses as `x & (1 == 0)`.
