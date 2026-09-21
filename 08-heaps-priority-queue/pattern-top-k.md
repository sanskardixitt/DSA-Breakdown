# Pattern — Top K Elements

---

## How do I know to use this?

- "**K largest** / **K smallest** / **Kth** largest"
- "**K closest** points / **K closest** numbers to X"
- "**top K frequent** elements / words"
- "K most / least anything"
- The data is a **stream** (you can't sort what you haven't seen yet)

---

## The template

```python
import heapq

def top_k(nums, k):
    h = []                              # MIN-heap of size k → keeps the k LARGEST
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)            # evict the smallest
    return h
```

**Two rules, memorised as a pair:**
- K **largest** → **min**-heap of size K
- K **smallest** → **max**-heap of size K (negate values in Python)

The root is always "the weakest survivor" — the one you evict when a better candidate arrives.

---

## Example 1 — Kth Largest Element in an Array

### Approach A — heap, O(n log k)
```python
def find_kth_largest(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)
    return h[0]                          # the smallest of the k largest = the kth largest
```

### Approach B — quickselect, O(n) average ⭐
Partition like quicksort, but recurse into **only one side**.

```python
import random

def find_kth_largest(nums, k):
    target = len(nums) - k               # the kth largest is at this index once sorted ascending

    def select(lo, hi):
        pivot = nums[random.randint(lo, hi)]     # ⚠ random pivot avoids the O(n²) adversarial case
        # three-way partition (handles duplicates well)
        lt, i, gt = lo, lo, hi
        while i <= gt:
            if   nums[i] < pivot: nums[lt], nums[i] = nums[i], nums[lt]; lt += 1; i += 1
            elif nums[i] > pivot: nums[i], nums[gt] = nums[gt], nums[i]; gt -= 1
            else:                 i += 1
        # now nums[lt..gt] all equal pivot
        if target < lt:   return select(lo, lt - 1)
        if target > gt:   return select(gt + 1, hi)
        return nums[target]                       # landed inside the pivot block

    return select(0, len(nums) - 1)
```

**Why it's O(n) average:** each partition halves the search range on average, so the work is
`n + n/2 + n/4 + ... = 2n`. Compare with quicksort's O(n log n) — quicksort must recurse into *both*
halves, quickselect only one.

**Worst case is O(n²)** if the pivot is always terrible — hence the random pivot.

> **What to say in an interview:** "Heap is O(n log k) with O(k) space and works on a stream.
> Quickselect is O(n) average but mutates the array and doesn't stream. Which do you want?"
> That sentence is worth more than either implementation.

---

## Example 2 — K Closest Points to Origin

```python
def k_closest(points, k):
    h = []                                   # MAX-heap of size k → keeps the k SMALLEST distances
    for x, y in points:
        d = x*x + y*y                        # ⚠ no sqrt — it's monotone, so it can't change the order
        heapq.heappush(h, (-d, x, y))        # negate for a max-heap
        if len(h) > k:
            heapq.heappop(h)                 # evict the FARTHEST
    return [[x, y] for _, x, y in h]
```

Two things worth internalising:
- **Skip the `sqrt`.** It's monotonic, so comparisons are identical, and you avoid floats entirely.
  Same idea appears in geometry, distance, and "compare magnitudes" problems generally.
- **K smallest ⇒ max-heap.** You evict the *largest* of your current best K.

---

## Example 3 — Top K Frequent Elements

### Heap version, O(n log k)
```python
from collections import Counter

def top_k_frequent(nums, k):
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)
```

### Bucket sort version, O(n) ⭐
```python
def top_k_frequent(nums, k):
    count = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]   # index = frequency
    for num, f in count.items():
        buckets[f].append(num)

    res = []
    for f in range(len(buckets) - 1, 0, -1):
        for num in buckets[f]:
            res.append(num)
            if len(res) == k:
                return res
```

> **When bucket sort beats a heap:** the sort key is a bounded small integer. A frequency can't exceed
> `n`, so you can index by it directly and skip comparison sorting entirely. Same trick applies to
> Sort Colors, H-Index, and Relative Sort Array.

---

## Example 4 — Task Scheduler

> Tasks A–Z, each takes 1 unit. The same task needs `n` units of cooldown between runs.
> Minimum total time?

**Greedy:** always run the task with the **highest remaining count**. A max-heap gives you that.

```python
from collections import Counter, deque

def least_interval(tasks, n):
    heap = [-c for c in Counter(tasks).values()]
    heapq.heapify(heap)
    cooldown = deque()          # (count_remaining, time_when_available)
    time = 0

    while heap or cooldown:
        time += 1

        if cooldown and cooldown[0][1] == time:
            heapq.heappush(heap, cooldown.popleft()[0])    # comes off cooldown

        if heap:
            cnt = heapq.heappop(heap) + 1                  # run it (counts are negative)
            if cnt:
                cooldown.append((cnt, time + n + 1))
        # if heap is empty we just idle this tick

    return time
```

> **The general shape — "heap + cooldown queue" — is very reusable:** heap holds what's *ready*, a
> queue holds what's *waiting*, and each tick you move items from the queue back into the heap.
> Same structure solves Reorganize String, Rearrange String k Distance Apart, and rate-limiter designs.

**Math shortcut (worth knowing):** the answer is
`max(len(tasks), (max_freq - 1) * (n + 1) + count_of_tasks_with_max_freq)`.
Derive it by drawing the schedule as a grid of `max_freq - 1` full frames plus a final partial one.

---

## Example 5 — Merge K Sorted Lists

```python
import itertools

def merge_k_lists(lists):
    counter = itertools.count()
    h = []
    for node in lists:
        if node:
            heapq.heappush(h, (node.val, next(counter), node))   # ⚠ tiebreaker!

    dummy = ListNode()
    tail = dummy
    while h:
        _, _, node = heapq.heappop(h)
        tail.next = node
        tail = node
        if node.next:
            heapq.heappush(h, (node.next.val, next(counter), node.next))

    return dummy.next
```
**O(N log k)** where N is the total number of nodes.

> **The tiebreaker counter is mandatory.** Two nodes with equal `val` make Python compare the
> `ListNode` objects, which raises `TypeError`. This exact bug catches almost everyone the first time.

**Alternative without a heap:** repeated pairwise merging (divide and conquer) — also O(N log k), and
arguably simpler. Know both.

---

## Example 6 — Kth Largest Element in a Stream

```python
class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.h = nums[:]
        heapq.heapify(self.h)                 # O(n)
        while len(self.h) > k:
            heapq.heappop(self.h)

    def add(self, val):
        heapq.heappush(self.h, val)
        if len(self.h) > self.k:
            heapq.heappop(self.h)
        return self.h[0]
```

**This is where a heap is genuinely irreplaceable.** Quickselect and sorting both need the whole
dataset up front. A size-K heap handles an unbounded stream in O(k) memory. When a problem says
"stream", "online", or "as data arrives" — heap.

---

## Traps

- Building a heap of all n elements when a size-K heap suffices — O(n log n) instead of O(n log k).
- Getting the direction backwards: **K largest ⇒ MIN-heap.**
- Forgetting the tiebreaker in tuple pushes → `TypeError` on non-comparable payloads.
- Using `sorted(h)` or `max(h)` to peek. The root is `h[0]`, in O(1).
- Assuming the heap array is sorted. It isn't — only `h[0]` is guaranteed.
- Computing `sqrt` for distance comparisons. Unnecessary, and introduces float error.
