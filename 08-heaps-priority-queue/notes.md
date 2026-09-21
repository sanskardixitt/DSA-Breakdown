# Heaps / Priority Queue — Notes

---

## What a heap is

A **complete binary tree** stored in a flat array, where every parent satisfies a heap property:

- **Min-heap:** `parent <= children` → the minimum is always at the root.
- **Max-heap:** `parent >= children` → the maximum is at the root.

**The array trick** (this is why heaps are fast and memory-efficient — no pointers at all):
```
index i:      parent = (i - 1) // 2
              left   = 2*i + 1
              right  = 2*i + 2
```

```
        1                     array: [1, 3, 5, 7, 9, 6]
      /   \                          i: 0  1  2  3  4  5
     3     5
    / \   /
   7   9 6
```

> **Crucially: a heap is only *partially* ordered.** It guarantees the root is the min (or max). It
> says nothing about siblings, and iterating the array does **not** give sorted order. Confusing a
> heap with a BST is a common conceptual error — a BST gives full order at O(log n) insert; a heap
> gives only the extreme, but with a much smaller constant and O(1) peek.

---

## Complexity

| Operation | Time |
|---|---|
| Peek min/max | **O(1)** |
| Push | O(log n) |
| Pop min/max | O(log n) |
| Build from a list (`heapify`) | **O(n)** ← not O(n log n) |
| Search for an arbitrary value | O(n) |
| Delete an arbitrary value | O(n) to find + O(log n) |

> **Why `heapify` is O(n), not O(n log n):** the algorithm sifts down from the bottom up. Half the
> nodes are leaves (0 work), a quarter are one level up (1 step), and so on. The sum
> `n/2·0 + n/4·1 + n/8·2 + ...` converges to O(n). Most nodes are near the bottom and barely move.
>
> This is a favourite interview follow-up. Know it.

---

## Python's `heapq`

```python
import heapq

h = [5, 1, 8]
heapq.heapify(h)             # O(n), in place → h is now a valid min-heap
heapq.heappush(h, 3)         # O(log n)
smallest = heapq.heappop(h)  # O(log n)
peek = h[0]                  # O(1) — do NOT sort or scan
heapq.heappushpop(h, x)      # push then pop, cheaper than separate calls
heapq.heapreplace(h, x)      # pop then push
heapq.nlargest(k, iterable)  # O(n log k)
heapq.nsmallest(k, iterable)
```

### `heapq` is min-only. Two workarounds:

```python
# 1. Negate (numeric values)
heapq.heappush(h, -val)
largest = -heapq.heappop(h)

# 2. Tuples: (sort_key, tiebreaker, payload)
heapq.heappush(h, (-freq, word))
```

> ⚠ **The tuple-comparison trap.** If two tuples tie on the first element, Python compares the second.
> If that's a `TreeNode` or `ListNode`, you get `TypeError: '<' not supported`. Always insert a unique
> counter as a tiebreaker:
> ```python
> import itertools
> counter = itertools.count()
> heapq.heappush(h, (dist, next(counter), node))
> ```
> This bites people in Merge K Sorted Lists and in Dijkstra. Get in the habit now.

---

## Recognition triggers

| Statement says... | Use |
|---|---|
| "**K largest** / **K smallest**" | Heap of size K |
| "**Kth** largest/smallest" | Heap of size K (or quickselect) |
| "**K closest** points/numbers" | Max-heap of size K, keyed on distance |
| "**top K** frequent" | Counter + heap (or bucket sort for O(n)) |
| "**median** of a data stream" | **Two heaps** |
| "**merge K** sorted lists/arrays" | Min-heap of the K current heads |
| "**scheduling**", "next available", "meeting rooms" | Min-heap of end times |
| "repeatedly take the **largest/smallest** and modify it" | Heap |
| "**shortest path** with weights" | Dijkstra = BFS + heap |
| "**running** min/max as data streams in" | Heap |
| "**task scheduler**", "reorganize string" | Max-heap by frequency |

**The umbrella signal:** *you repeatedly need the extreme element of a changing collection.* Sorting
gives you that once. A heap gives it to you every time, cheaply, as the collection mutates.

---

## Heap vs sort vs quickselect — pick correctly

| Approach | Time | Space | When |
|---|---|---|---|
| Sort, take K | O(n log n) | O(n) | Simplest; fine when n is small or you need the full order |
| Heap of size K | **O(n log k)** | **O(k)** | k ≪ n, or **streaming** data |
| Quickselect | **O(n) average**, O(n²) worst | O(1) | One-shot kth element, in memory, and you want optimal |
| Bucket sort | **O(n)** | O(n) | Keys are bounded small integers (e.g. frequencies) |

> **The interview answer for "Kth largest in an array":** mention all three, then implement the heap
> (simple, robust) or quickselect (optimal average) depending on what they push for. Saying *"a heap
> is O(n log k) with O(k) space, which also works on a stream where quickselect doesn't"* is the
> distinction that shows understanding.

---

## The size-K heap trick ⭐

> **To keep the K *largest* elements, use a MIN-heap of size K.**

This feels backwards. Here's why it's right: the min-heap's root is the **smallest of your current
best K** — precisely the element to evict when something better arrives.

```python
def k_largest(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)      # drop the smallest of the K+1 → keeps the K largest
    return h                       # h[0] is the Kth largest
```
**O(n log k) time, O(k) space.**

Mirror rule: **to keep the K *smallest*, use a MAX-heap of size K** (negate the values).

> Memory hook: *"the heap's root is the one you're willing to throw away."*

---

## Heapsort (know it, rarely write it)

`heapify` then pop n times → O(n log n), O(1) extra space, **not stable**.

Beaten in practice by Timsort/quicksort due to cache behaviour, but it's the answer to
*"sort in O(n log n) worst case with O(1) space"* — mergesort needs O(n) space, and quicksort's worst
case is O(n²).

---

## Files here

- [pattern-top-k.md](pattern-top-k.md)
- [pattern-two-heaps.md](pattern-two-heaps.md)
- [problems.md](problems.md)
