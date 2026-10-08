# 13 — Greedy & Intervals

> **Ek line ka funda:** *Greedy = "abhi jo best lag raha hai wahi le lo, peeche mat dekho."
> Kaam karta hai sirf tab jab local best se global best banta ho.
> Intervals = "sort karo, fir ek pass me sweep."*

---

## Part 1 — GREEDY

### Greedy kab kaam karta hai (aur kab nahi)

```
✅ Greedy chalega jab:
   "exchange argument" hold kare — koi bhi optimal solution ko
   greedy choice se replace karne pe wo bura nahi hota

❌ Greedy fail karega jab:
   ek choice future ki choices ko limit kar de
```

### Classic counter-example (ye yaad rakho)

```
Coin Change: coins = [1, 3, 4],  amount = 6

GREEDY: sabse bada coin lo
        4 -> bacha 2 -> 1 -> 1        = 3 coins  ❌

DP    : 3 + 3                          = 2 coins  ✅

Isliye Coin Change GREEDY nahi, DP hai.
(Indian currency [1,2,5,10,...] pe greedy chalta hai — coin system pe depend karta hai!)
```

> **Interview me:** greedy socho, fir **counter-example dhoondhne ki koshish karo**.
> Nahi mila → greedy try karo. Mil gaya → DP.
> Ye process bolna hi tumhe strong candidate banata hai.

---

### Greedy ke 3 classic problems

#### 1. Jump Game (LC 55) — "kahan tak pahunch sakta hoon"

```
nums = [2, 3, 1, 1, 4]

i=0: reach = max(0, 0+2) = 2
i=1: reach = max(2, 1+3) = 4
i=2: reach = max(4, 2+1) = 4
...
reach >= last index -> TRUE ✅

     0    1    2    3    4
    [2]  [3]  [1]  [1]  [4]
     |---->|
          |-------------->|     reach = 4, pahunch gaye
```

```js
function canJump(nums) {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;              // yahan tak pahunch hi nahi sakte
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}
```
> **Insight:** exact path track karne ki zaroorat hi nahi.
> Sirf **"sabse door kahan tak pahunch sakte hain"** — ek variable.

#### 2. Jump Game II (LC 45) — minimum jumps, "implicit BFS"

```js
function jump(nums) {
  let jumps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === curEnd) {                       // current jump ka range khatam
      jumps++;
      curEnd = farthest;                      // agla range
    }
  }
  return jumps;
}
```
```
Ye actually BFS hi hai! Har "jump" ek LEVEL hai:

Level 0: [0]
Level 1: [1, 2]        <- ek jump me jahan-jahan pahunch sakte ho
Level 2: [3, 4]

curEnd = current level ka last index
```

#### 3. Gas Station (LC 134)

```js
function canCompleteCircuit(gas, cost) {
  const total = gas.reduce((a, b, i) => a + b - cost[i], 0);
  if (total < 0) return -1;                   // total hi kam hai -> impossible

  let tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    tank += gas[i] - cost[i];
    if (tank < 0) { start = i + 1; tank = 0; }   // 🔑 yahan tak ka koi bhi start fail hoga
  }
  return start;
}
```
> **Do insights:**
> 1. Total gas ≥ total cost → answer **pakka** exist karta hai
> 2. Agar `i` pe tank negative hua → `start..i` me se **koi bhi** start valid nahi.
>    Isliye seedha `i+1` pe jump. Ye O(n²) ko O(n) banata hai.

---

## Part 2 — INTERVALS (ye sabse predictable pattern hai)

### Trigger words
- "meetings", "rooms", "schedule"
- "merge intervals", "overlapping"
- "minimum removals to make non-overlapping"
- Koi bhi `[start, end]` pairs ka array

### 🔑 Golden rule: PEHLE SORT KARO. Sawaal sirf ye hai — **start se ya end se?**

```
+---------------------------------------------------------------+
| Sort by START  ->  MERGE karna hai, ya overlap DHOONDHNA hai   |
| Sort by END    ->  MAXIMUM kitne fit kar sakte hain (scheduling)|
+---------------------------------------------------------------+
```

---

### Merge Intervals (LC 56) — sort by START

```
Input:  [[1,3], [2,6], [8,10], [15,18]]
Sorted: [[1,3], [2,6], [8,10], [15,18]]

[1,3]                    result: [[1,3]]
[2,6]   2 <= 3 OVERLAP!  merge -> [1, max(3,6)] = [1,6]
[8,10]  8 > 6  no overlap        result: [[1,6],[8,10]]
[15,18] 15 > 10 no overlap       result: [[1,6],[8,10],[15,18]]

Timeline:
 1---3
   2------6         -> 1----------6
              8--10                    8--10
                          15---18                15---18
```

```js
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);                // START se sort
  const res = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = res[res.length - 1];
    if (intervals[i][0] <= last[1]) {                   // OVERLAP
      last[1] = Math.max(last[1], intervals[i][1]);     // ⚠️ max lo, seedha assign mat karo
    } else res.push(intervals[i]);
  }
  return res;
}
```
> **`Math.max` kyun?** `[[1,10],[2,3]]` case — agar seedha `last[1] = 3` kar diya
> to `[1,10]` chhota ho jaayega. Ye classic bug hai.

---

### Non-overlapping Intervals (LC 435) — sort by END

"Minimum kitne intervals hatane padenge taaki koi overlap na bache?"

```
❓ END se kyun sort karein?

Jo interval sabse JALDI KHATAM hota hai, wo sabse KAM jagah ghairta hai
-> uske baad sabse zyada intervals ke liye jagah bachti hai.

Ye classic "Activity Selection" greedy hai.

  |--A--|                     A: [1,4]
      |--B--|                 B: [3,6]
        |--C--|               C: [4,7]
  1  2  3  4  5  6  7

End se sort: A(4), B(6), C(7)
A lo (end=4) -> B ka start 3 < 4, overlap, HATAO
             -> C ka start 4 >= 4, OK, LO
Answer: 1 hataya
```

```js
function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);              // END se sort
  let count = 0, prevEnd = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= prevEnd) prevEnd = e;                    // no overlap -> rakho
    else count++;                                     // overlap -> hatao
  }
  return count;
}
```

---

### Meeting Rooms II (LC 253) — kitne rooms chahiye

**Do tareeke — dono jaanne chahiye.**

#### Tareeka 1: Min-heap of end times
```js
function minMeetingRooms(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const heap = new MinHeap();                  // ongoing meetings ke end times
  for (const [s, e] of intervals) {
    if (heap.size && heap.peek() <= s) heap.pop();   // ek room khaali ho gaya, reuse
    heap.push(e);
  }
  return heap.size;                            // max simultaneous = rooms
}
```

#### Tareeka 2: SWEEP LINE 🔥 (zyada elegant, aur generalize hota hai)
```js
function minMeetingRooms(intervals) {
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends   = intervals.map(i => i[1]).sort((a, b) => a - b);

  let rooms = 0, best = 0, j = 0;
  for (let i = 0; i < starts.length; i++) {
    while (j < ends.length && ends[j] <= starts[i]) { rooms--; j++; }  // khatam hue
    rooms++;                                                            // naya shuru
    best = Math.max(best, rooms);
  }
  return best;
}
```

```
Sweep line ka picture — timeline pe chalo, +1/-1 karte jao:

meetings: [0,30], [5,10], [15,20]

time:   0    5    10   15   20   30
events: +1   +1   -1   +1   -1   -1
count:   1    2    1    2    1    0
              ^         ^
            MAX = 2  -> 2 rooms chahiye ✅
```

> **Sweep line generalize hota hai:** "kisi bhi time pe maximum kitne overlap"
> — car pooling (LC 1094), my calendar, skyline — sab isi se.
> **+1 on start, -1 on end, running max.** Ye pattern gold hai.

---

### Insert Interval (LC 57) — teen phase

```js
function insert(intervals, newInterval) {
  const res = [];
  let i = 0, n = intervals.length;

  // 1. newInterval se PEHLE wale (koi overlap nahi)
  while (i < n && intervals[i][1] < newInterval[0]) res.push(intervals[i++]);

  // 2. OVERLAP wale sab merge karo
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  res.push(newInterval);

  // 3. BAAD wale
  while (i < n) res.push(intervals[i++]);
  return res;
}
```
```
[[1,3],[6,9]]  insert [2,5]

Phase 1: kuch nahi (1,3 overlap karta hai)
Phase 2: [1,3] merge -> newInterval = [1,5]
Phase 3: [6,9] daalo

result: [[1,5],[6,9]] ✅
```

---

## Overlap check ka universal formula (ratt lo)

```js
const overlap = (a, b) => a[0] < b[1] && b[0] < a[1];      // strict overlap
const touch   = (a, b) => a[0] <= b[1] && b[0] <= a[1];    // touching bhi count
```

```
a: |------|
b:      |------|      a.start < b.end  &&  b.start < a.end   ✅ overlap

a: |----|
b:       |----|       b.start >= a.end                        ❌ no overlap
```

> `<` vs `<=` — problem statement dekho: "[1,2] aur [2,3] overlap hain?"
> Meetings me nahi (ek khatam, dusri shuru). Intervals merge me haan.

---

## Common galtiyan

| Galti | Fix |
|---|---|
| Sort hi nahi karna | Intervals me **hamesha** pehla step |
| Galat key se sort | Merge → start, max-fit → end |
| Merge me `last[1] = cur[1]` | `Math.max(last[1], cur[1])` |
| `<` vs `<=` galat | Problem statement dhyaan se |
| Empty array check | `if (!intervals.length) return []` |
| Greedy blindly lagana | Counter-example dhoondho pehle |

---

## Problems

| # | Problem | Type |
|---|---|---|
| 56 | Merge Intervals | Sort by start (start here) |
| 57 | Insert Interval | Teen phase |
| 435 | Non-overlapping Intervals | Sort by end |
| 452 | Min Arrows to Burst Balloons | Sort by end |
| 252/253 | Meeting Rooms I / II | Sweep / heap |
| 1094 | Car Pooling | Sweep line |
| 55 | Jump Game | Greedy reach |
| 45 | Jump Game II | Greedy BFS |
| 134 | Gas Station | Greedy restart |
| 763 | Partition Labels | Greedy + last index |
| 1046 | Last Stone Weight | Greedy + heap |

---
Agla: [14-bit-manipulation.md](14-bit-manipulation.md)
