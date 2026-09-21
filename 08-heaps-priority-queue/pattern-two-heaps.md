# Pattern — Two Heaps

Splitting data into a "low half" and a "high half" so the boundary between them is O(1) to query.

---

## How do I know to use this?

- "**median** of a data stream" / "running median"
- "find the **middle** element" as data arrives
- Anything needing the **boundary between two halves** of a dynamic dataset
- "**sliding window median**"
- IPO / capital-and-profit scheduling problems ("two heaps with different orderings")

---

## The structure

```
        small (MAX-heap)          large (MIN-heap)
    [ lower half of values ]  [ upper half of values ]
              ↑                        ↑
        largest of the low       smallest of the high
              └──── the median lives here ────┘
```

**Two invariants to maintain:**
1. **Order:** every element in `small` ≤ every element in `large`.
2. **Balance:** `len(small) == len(large)` or `len(small) == len(large) + 1`.

With those two holding, the median is always O(1):
- Odd total → `small[0]` (the max-heap root)
- Even total → the average of both roots

---

## Find Median from Data Stream ⭐

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []      # MAX-heap (store negated values)
        self.large = []      # MIN-heap

    def addNum(self, num):
        # ① always push to `small` first
        heapq.heappush(self.small, -num)

        # ② fix the ORDER invariant: small's max must not exceed large's min
        if self.large and -self.small[0] > self.large[0]:
            heapq.heappush(self.large, -heapq.heappop(self.small))

        # ③ fix the BALANCE invariant
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        elif len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
```
**`addNum` is O(log n); `findMedian` is O(1).**

### The three-step discipline

Write these as three separate blocks, in this order, every time:

1. **Push** — always to the same heap (here, `small`). Don't branch on value; it complicates the logic.
2. **Fix order** — if `small`'s max exceeds `large`'s min, move one element across.
3. **Fix balance** — if either side is too big, move one element across.

Trying to be clever and merge these into a single branching insert is where this problem goes wrong.
Three dumb steps beat one smart one.

### Trace: adding 1, 2, 3

| add | after push | after order fix | after balance fix | median |
|---|---|---|---|---|
| 1 | small=[1] large=[] | — | — | 1 |
| 2 | small=[2,1] large=[] | — | small=[1] large=[2] | 1.5 |
| 3 | small=[3,1] large=[2] | 3>2 → small=[1] large=[2,3] | small=[2,1] large=[3] | 2 |

✅

---

## Why not just keep a sorted list?

| Approach | Insert | Median | Verdict |
|---|---|---|---|
| Sorted list + `bisect.insort` | **O(n)** (shifting) | O(1) | Fine for small n, poor at scale |
| Sort on every query | O(n log n) | — | Bad |
| **Two heaps** | **O(log n)** | **O(1)** | ✅ |

`bisect` finds the position in O(log n), but the *insertion* still shifts memory — O(n). This is a
common misconception worth stating clearly if it comes up.

---

## Variant — Sliding Window Median 🔴

Same structure, plus **lazy deletion** (because `heapq` can't remove an arbitrary element).

**The technique:** keep a `to_remove` counter dict. When an element expires from the window, record it
there instead of removing it. Before reading a heap root, discard any roots that appear in
`to_remove`. Track "effective" sizes separately from the raw heap lengths.

```python
# sketch
to_remove = defaultdict(int)

def prune(heap, sign):                     # sign = -1 for the negated max-heap
    while heap and to_remove[sign * heap[0]] > 0:
        to_remove[sign * heap[0]] -= 1
        heapq.heappop(heap)
```

> **Lazy deletion is a general technique**, not a hack specific to this problem. Any time you need
> "delete an arbitrary element from a heap", the answer is: mark it dead, skip it when it surfaces.
> The amortised cost stays O(log n) because each element is deleted at most once.

---

## Variant — IPO (LC 502)

> Pick at most `k` projects. Each has a capital requirement and a profit. Starting with `w` capital,
> maximise the final total.

Two heaps with **different keys**:
- A **min-heap by capital** — the pool of projects not yet affordable.
- A **max-heap by profit** — projects you can currently afford.

```python
def find_maximized_capital(k, w, profits, capital):
    by_capital = sorted(zip(capital, profits))      # or a min-heap
    available = []                                   # max-heap by profit
    i = 0

    for _ in range(k):
        while i < len(by_capital) and by_capital[i][0] <= w:
            heapq.heappush(available, -by_capital[i][1])   # now affordable
            i += 1
        if not available:
            break                                    # can't afford anything
        w -= heapq.heappop(available)                # (negated) add the best profit
    return w
```

> **The general shape:** one heap holds "not yet eligible" ordered by *when they become eligible*;
> the other holds "eligible now" ordered by *how good they are*. As your state improves, migrate items
> from the first to the second, then greedily take the best.
>
> Same structure solves: Meeting Rooms III, Process Tasks Using Servers, Single-Threaded CPU.

---

## Related — Meeting Rooms II (one heap, same spirit)

> Given intervals, find the minimum number of rooms needed.

```python
def min_meeting_rooms(intervals):
    intervals.sort(key=lambda x: x[0])       # by start time
    ends = []                                # min-heap of END times

    for start, end in intervals:
        if ends and ends[0] <= start:
            heapq.heappop(ends)              # a room freed up before this meeting starts
        heapq.heappush(ends, end)

    return len(ends)                         # peak concurrent meetings
```

**The insight:** the heap root is the *earliest-finishing* meeting currently running. That's the only
one that could possibly free up in time — no need to check the others. The heap size *is* the answer.

> This is the archetype for "**process events in order; a heap tracks what's currently active**."
> Once you see it, Car Pooling, Employee Free Time, and most scheduling problems look the same.

---

## Traps

- Forgetting to negate consistently for the max-heap. Negate on push *and* on read.
- Fixing balance before order (or skipping the order fix entirely) — the invariant breaks silently and
  gives wrong medians only on certain inputs.
- Allowing `len(large) > len(small)`. Pick one side to hold the extra element and stick to it; the
  `findMedian` logic depends on which you chose.
- Trying to `heap.remove(x)` — that's O(n) and destroys the heap invariant. Use lazy deletion.
