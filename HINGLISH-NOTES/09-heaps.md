# 09 — Heaps / Priority Queue

> **Ek line ka funda:** *Heap = "mujhe hamesha sabse chhota (ya bada) chahiye,
> par PURA sort nahi karna". Sorting O(n log n), heap se top-k O(n log k).*

---

## Trigger words

- "**Kth** largest / smallest"
- "**Top K** frequent / closest"
- "**median** of a stream"
- "**merge K** sorted lists/arrays"
- "har baar sabse mehnga/sasta task uthao" (task scheduler)
- "streaming data" — pura data ek saath nahi hai

---

## ⚠️ JavaScript me heap built-in NAHI hai

Python me `heapq`, Java me `PriorityQueue`, C++ me `priority_queue`.
**JS me kuch nahi.** Isliye interview me tumhare paas 2 options:

**Option A (aksar allowed):** Interviewer se poocho —
> *"JS me built-in heap nahi hai. Main maan loon ki ek MinHeap class available hai
> with push/pop/peek O(log n), ya aapko implement karke dikhaoon?"*

90% baar wo bolenge "assume kar lo". **Ye poochna hi seniority dikhata hai.**

**Option B:** Ready-made MinHeap yaad rakho (neeche di hai — 25 lines).

---

## MinHeap implementation (ratt lo, 25 lines)

```js
class MinHeap {
  constructor(cmp = (a, b) => a - b) { this.a = []; this.cmp = cmp; }
  get size() { return this.a.length; }
  peek() { return this.a[0]; }

  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {                                  // bubble UP
      const p = (i - 1) >> 1;
      if (this.cmp(this.a[i], this.a[p]) >= 0) break;
      [this.a[i], this.a[p]] = [this.a[p], this.a[i]];
      i = p;
    }
  }

  pop() {
    const top = this.a[0], last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {                                 // bubble DOWN
        const l = 2 * i + 1, r = l + 1;
        let s = i;
        if (l < this.a.length && this.cmp(this.a[l], this.a[s]) < 0) s = l;
        if (r < this.a.length && this.cmp(this.a[r], this.a[s]) < 0) s = r;
        if (s === i) break;
        [this.a[i], this.a[s]] = [this.a[s], this.a[i]];
        i = s;
      }
    }
    return top;
  }
}

// MaxHeap = comparator ulta
const maxHeap = new MinHeap((a, b) => b - a);
```

### Heap ka structure — array me tree

```
          1
        /   \
       3     5
      / \   /
     4   8 6

array:  [1, 3, 5, 4, 8, 6]
index:   0  1  2  3  4  5

parent(i) = (i-1) >> 1        // (i-1)/2 floor
left(i)   = 2i + 1
right(i)  = 2i + 2

Property: parent hamesha children se chhota (MinHeap me)
          ⚠️ Fully sorted NAHI hai — sirf parent-child relation
```

---

## Pattern A — Top K (size-K heap ka ULTA trick)

### 🔑 Sabse important insight

> **Kth LARGEST chahiye → MIN heap use karo (size K).**
> **Kth SMALLEST chahiye → MAX heap use karo (size K).**

**Ulta kyun?** Kyunki heap ka top = "jo sabse pehle nikalna hai".

```
Kth largest chahiye, K=3,  nums = [3, 2, 1, 5, 6, 4]

MinHeap size 3 rakho. Top hamesha in 3 me sabse CHHOTA.
Naya element top se bada aaya? -> top nikaal do, naya daalo.

3      heap [3]
2      heap [2,3]
1      heap [1,2,3]           size 3 ho gaya
5      5 > top(1)? haan -> pop 1, push 5 -> [2,3,5]
6      6 > top(2)? haan -> pop 2, push 6 -> [3,5,6]
4      4 > top(3)? haan -> pop 3, push 4 -> [4,5,6]

Answer = heap.peek() = 4  ✅  (3rd largest)
```

```js
function findKthLargest(nums, k) {
  const h = new MinHeap();
  for (const n of nums) {
    h.push(n);
    if (h.size > k) h.pop();        // sabse chhota nikaal do
  }
  return h.peek();
}
```

**Complexity:** `O(n log k)` — sort karke nikaalne (`O(n log n)`) se behtar jab k chhota ho.
Aur **space O(k)** — streaming data pe ye hi ek option hai.

> **Interview me ye bolo:** *"Sort O(n log n) hai. Size-k heap se O(n log k) ho jaayega,
> aur agar data stream me aa raha hai to pura array memory me rakhna hi nahi padega."*

---

## Pattern B — Top K Frequent (LC 347) — teen tareeke

```js
// Tareeka 1: heap — O(n log k)
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);

  const h = new MinHeap((a, b) => a[1] - b[1]);   // [num, count], count se compare
  for (const entry of freq) {
    h.push(entry);
    if (h.size > k) h.pop();
  }
  return [...Array(h.size)].map(() => h.pop()[0]);
}
```

```js
// Tareeka 2: BUCKET SORT — O(n) 🔥 (ye bolo, impress karega)
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);

  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, c] of freq) buckets[c].push(num);   // index = frequency

  const res = [];
  for (let c = buckets.length - 1; c >= 0 && res.length < k; c--) res.push(...buckets[c]);
  return res.slice(0, k);
}
```

```
nums = [1,1,1,2,2,3]
freq  = {1:3, 2:2, 3:1}

buckets:  idx 0: []
          idx 1: [3]      <- frequency 1 wale
          idx 2: [2]
          idx 3: [1]
          ...

Peeche se chalo -> [1, 2] for k=2  ✅  O(n) me!
```
> **Bucket sort ka funda:** frequency kabhi bhi `n` se zyada nahi ho sakti.
> Toh frequency ko hi **array index** bana do. Counting sort ka hi roop hai.

---

## Pattern C — TWO HEAPS (median of stream, LC 295)

### Idea: data ko do haalves me todo

```
            maxHeap                 minHeap
        (chhoti aadhi)           (badi aadhi)
        [ 1, 2, 3 ]              [ 4, 5, 6 ]
              ^                    ^
            top = 3              top = 4
              |                    |
              +--------+-----------+
                       |
             median yahin se milta hai

Odd total  -> bade heap ka top
Even total -> dono top ka average
```

**Rules:**
1. `maxHeap` me chhoti aadhi, `minHeap` me badi aadhi
2. `maxHeap.top <= minHeap.top` hamesha
3. Size difference max 1

```js
class MedianFinder {
  constructor() {
    this.lo = new MinHeap((a, b) => b - a);   // maxHeap (chhoti aadhi)
    this.hi = new MinHeap((a, b) => a - b);   // minHeap (badi aadhi)
  }
  addNum(num) {
    this.lo.push(num);                        // 1. hamesha lo me daalo
    this.hi.push(this.lo.pop());              // 2. lo ka sabse bada hi ko do (order maintain)
    if (this.hi.size > this.lo.size) this.lo.push(this.hi.pop());   // 3. balance
  }
  findMedian() {
    return this.lo.size > this.hi.size
      ? this.lo.peek()
      : (this.lo.peek() + this.hi.peek()) / 2;
  }
}
```

> **Teen line ka dance yaad rakho:** push to lo → move lo's top to hi → rebalance.
> Direct daalne se order toot jaata hai. Ye 3-step hi sahi tareeka hai.

---

## Pattern D — Merge K Sorted Lists (LC 23)

```
K lists hain. Har baar sabse chhota head uthao.
Heap me sirf K heads rakho (poora data nahi).

heap: [1, 1, 2]    <- teeno lists ke current heads
      pop 1 -> result, us list ka agla push karo
```

```js
function mergeKLists(lists) {
  const h = new MinHeap((a, b) => a.val - b.val);
  for (const l of lists) if (l) h.push(l);

  const dummy = new ListNode(); let tail = dummy;
  while (h.size) {
    const node = h.pop();
    tail.next = node; tail = node;
    if (node.next) h.push(node.next);      // us list ka agla
  }
  return dummy.next;
}
```
Complexity: `O(N log k)` jahan N = total nodes, k = lists.

---

## Common galtiyan

| Galti | Fix |
|---|---|
| Kth largest ke liye MaxHeap | **MinHeap** of size k |
| Poore array ko heapify karke k baar pop | O(n + k log n) — theek hai par O(n log k) simpler |
| Comparator galat direction | `(a,b) => a-b` = min, `(a,b) => b-a` = max |
| Heap ko sorted samajhna | Sirf top guaranteed hai, baaki nahi |
| Two heaps me rebalance bhoolna | Median galat aayega |
| JS me heap assume karna bina bole | **Poocho pehle** |

---

## Kab heap NAHI use karna

| Situation | Better |
|---|---|
| Pura sorted chahiye | Sort karo |
| k = n | Sort karo |
| Top-k frequency, n chhota | Bucket sort O(n) |
| Kth largest, ek hi baar, in-memory | Quickselect O(n) average |
| Har baar min chahiye + delete arbitrary | BST / sorted set |

---

## Problems

| # | Problem | Pattern |
|---|---|---|
| 215 | Kth Largest Element | Size-k heap (start here) |
| 347 | Top K Frequent | Heap / bucket sort |
| 973 | K Closest to Origin | Size-k max heap |
| 703 | Kth Largest in Stream | Size-k heap |
| 1046 | Last Stone Weight | Max heap |
| 621 | Task Scheduler | Max heap + greedy |
| 23 | Merge K Sorted Lists | K-way merge |
| 295 | Find Median from Stream | Two heaps (must do) |
| 355 | Design Twitter | Heap + design |

---
Agla: [10-backtracking.md](10-backtracking.md)
