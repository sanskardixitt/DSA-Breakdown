# 03 — The Python Toolkit for DSA

Python is great for interviews *if* you know its 20 useful idioms. Most people use 5 and write
unnecessary loops for the rest. This is the working set.

---

## Imports you'll use constantly

```python
from collections import defaultdict, Counter, deque, OrderedDict
import heapq
import math
from functools import lru_cache, cache
from itertools import permutations, combinations, product, accumulate
import bisect
import sys
```

---

## `collections.Counter` — frequency in one line

```python
from collections import Counter

Counter("aabbbc")           # Counter({'b': 3, 'a': 2, 'c': 1})
Counter([1,1,2,3,3,3])      # Counter({3: 3, 1: 2, 2: 1})

c = Counter("aabbbc")
c['b']                      # 3
c['z']                      # 0   ← no KeyError, returns 0
c.most_common(2)            # [('b', 3), ('a', 2)]
list(c.keys())              # distinct elements
len(c)                      # number of distinct elements

# Anagram check — the whole problem
Counter(s) == Counter(t)

# Counters support arithmetic
Counter("aab") - Counter("ab")   # Counter({'a': 1})
```

**Use for:** anagrams, "K most frequent", sliding-window character counts, majority element.

---

## `collections.defaultdict` — no more `if key not in d`

```python
from collections import defaultdict

graph = defaultdict(list)
graph[1].append(2)          # no KeyError; auto-creates []

count = defaultdict(int)
count['a'] += 1             # starts at 0

groups = defaultdict(set)
groups['x'].add(5)
```

**The canonical use — building an adjacency list:**
```python
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)      # omit this line for a directed graph
```

**Grouping by a computed key (Group Anagrams in 4 lines):**
```python
groups = defaultdict(list)
for word in words:
    key = tuple(sorted(word))       # or a 26-length count tuple
    groups[key].append(word)
return list(groups.values())
```

---

## `collections.deque` — the O(1) queue

```python
from collections import deque

q = deque([1, 2, 3])
q.append(4)         # right push   O(1)
q.appendleft(0)     # left push    O(1)
q.pop()             # right pop    O(1)
q.popleft()         # left pop     O(1)
q[0], q[-1]         # peek both ends O(1)
```

> ⚠ **Never use `list.pop(0)` for a queue.** It's O(n) and silently turns your O(V+E) BFS into O(V²).

**Use for:** BFS, monotonic deque (sliding window max), any FIFO.

---

## `heapq` — the priority queue (MIN-heap only)

```python
import heapq

h = []
heapq.heappush(h, 5)
heapq.heappush(h, 1)
h[0]                        # 1  — peek min, O(1)
heapq.heappop(h)            # 1  — pop min, O(log n)

nums = [5, 1, 8, 3]
heapq.heapify(nums)         # O(n), in place

heapq.heappushpop(h, x)     # push then pop — cheaper than doing both
heapq.heapreplace(h, x)     # pop then push
heapq.nlargest(3, nums)     # O(n log k)
heapq.nsmallest(3, nums)
```

**Python has no max-heap.** Two workarounds:

```python
# 1. Negate the values (numbers only)
heapq.heappush(h, -x)
largest = -heapq.heappop(h)

# 2. Push tuples: (priority, tiebreak, payload)
heapq.heappush(h, (-freq, word))     # max by freq
```

> ⚠ **Tuple comparison gotcha:** if the first elements tie, Python compares the second. If the second
> is an object without `__lt__` (e.g. a `TreeNode`), you get a `TypeError`. Insert a unique counter as a
> tiebreaker: `heapq.heappush(h, (dist, next(counter), node))`.

---

## `bisect` — binary search that's already written

```python
import bisect

a = [1, 3, 3, 5, 7]
bisect.bisect_left(a, 3)     # 1  ← first index where 3 could go (leftmost)
bisect.bisect_right(a, 3)    # 3  ← last index where 3 could go (rightmost)
bisect.insort(a, 4)          # insert keeping sorted order (O(n) due to shifting)
```

Mental model:
- `bisect_left(a, x)` = number of elements **strictly less than** x
- `bisect_right(a, x)` = number of elements **≤** x
- `bisect_right(a,x) - bisect_left(a,x)` = count of x

**Use for:** LIS in O(n log n), "count elements less than x", insert position problems.

---

## Sorting idioms

```python
arr.sort()                              # in place, O(n log n)
new = sorted(arr)                       # returns a copy
arr.sort(reverse=True)

# By a key
words.sort(key=len)
points.sort(key=lambda p: p[0]**2 + p[1]**2)

# Multiple keys: ascending by first, DESCENDING by second
people.sort(key=lambda p: (p[0], -p[1]))

# Descending by a non-numeric key — use two stable passes (Python sort is stable)
words.sort()                            # tiebreak: alphabetical
words.sort(key=lambda w: freq[w], reverse=True)

# Sort but keep original indices
for i, v in sorted(enumerate(arr), key=lambda t: t[1]):
    ...
```

**Interval problems — the standard first line:**
```python
intervals.sort(key=lambda x: x[0])       # by start
intervals.sort(key=lambda x: x[1])       # by end  ← for "max non-overlapping"
```

---

## Strings

```python
s.isalnum(), s.isdigit(), s.isalpha()
s.lower(), s.upper()
s.split(), s.split(',')
"".join(list_of_chars)          # ✅ the ONLY way to build a string in a loop
s[::-1]                         # reverse
s.strip()
ord('a'), chr(97)               # 97, 'a'
ord(c) - ord('a')               # 0..25 index for a lowercase letter
s.count('a')
s.replace('a', 'b')
s.startswith('ab'), s.endswith('yz')
```

**26-length frequency array (faster than Counter for tight loops):**
```python
freq = [0] * 26
for c in s:
    freq[ord(c) - ord('a')] += 1
```

Strings are **immutable**. To modify in place, convert to a list:
```python
chars = list(s)
chars[0] = 'X'
s = "".join(chars)
```

---

## List / iteration idioms

```python
arr = [0] * n                     # 1-D
grid = [[0] * cols for _ in range(rows)]   # ✅ 2-D
grid = [[0] * cols] * rows        # ❌ WRONG — all rows are the SAME list object!

for i, v in enumerate(arr): ...
for a, b in zip(arr1, arr2): ...
for i in range(n-1, -1, -1): ...          # backwards
for x in reversed(arr): ...

arr[::-1]                         # reversed copy
arr[i:j]                          # slice (O(j-i), copies)
arr[:]                            # shallow copy  ← use in backtracking!

any(x > 0 for x in arr)
all(x > 0 for x in arr)
sum(1 for x in arr if x > 0)      # count matching
max(arr, key=len)
```

**Unpacking / swapping:**
```python
a, b = b, a
first, *rest = arr
```

---

## Integers & math

```python
float('inf'), float('-inf')       # use these, not 0, for min/max initialisation
math.inf, -math.inf               # same thing

10 // 3      # 3   floor division
-10 // 3     # -4  ⚠ Python floors toward -inf, NOT toward zero
int(-10/3)   # -3  ← use this if you need C-style truncation

10 % 3       # 1
-10 % 3      # 2   ⚠ Python's % is always non-negative for positive divisor

divmod(10, 3)   # (3, 1)
abs(-5)
pow(2, 10)          # 1024
pow(2, 10, 1000)    # modular exponentiation, fast
math.gcd(12, 18)    # 6
math.isqrt(17)      # 4  (integer sqrt, exact)
math.ceil(7/2)      # 4
```

> Python ints are **arbitrary precision** — no overflow. That's usually a gift, but note it makes
> "Sum of Two Integers without +" style bit problems awkward (see `13-bit-manipulation/`).

---

## Memoisation — DP for free

```python
from functools import cache          # Python 3.9+
# from functools import lru_cache    # older: @lru_cache(None)

@cache
def dp(i, remaining):
    if remaining == 0: return 1
    if i >= len(nums): return 0
    return dp(i+1, remaining) + dp(i+1, remaining - nums[i])
```

> ⚠ Arguments must be **hashable**. Tuples work, lists don't. Convert: `tuple(arr)`.
> Clear between test cases with `dp.cache_clear()` if the cache captures outer state.

---

## `itertools` (occasionally handy)

```python
from itertools import permutations, combinations, product, accumulate

list(permutations([1,2,3]))         # all orderings
list(permutations([1,2,3], 2))      # length-2 orderings
list(combinations([1,2,3], 2))      # [(1,2),(1,3),(2,3)]
list(product([0,1], repeat=3))      # all 3-bit tuples
list(accumulate([1,2,3,4]))         # [1,3,6,10]  ← prefix sums!
```

Fine for verification and small-n brute force. In an interview, **write the backtracking yourself** —
that's what's being tested.

---

## Class templates you'll retype often

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

---

## Recursion limit

```python
import sys
sys.setrecursionlimit(10**6)
```
Add this whenever a DFS could go 10⁴+ deep (long linked lists, skewed trees, path-heavy graphs).

---

## Quick reference — what to reach for

| Need | Use |
|---|---|
| Count things | `Counter` |
| Group things | `defaultdict(list)` |
| Queue / BFS | `deque` |
| Repeated min or max | `heapq` |
| "Have I seen this?" | `set` |
| Search in sorted data | `bisect` |
| Memoise a recursion | `@cache` |
| Prefix sums | `accumulate` or a manual loop |
| Adjacency list | `defaultdict(list)` |
