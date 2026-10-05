# 05 — Binary Search (aur uska badshah: Binary Search on Answer)

> **Ek line ka funda:** *Binary search sirf "sorted array me number dhoondhna" nahi hai.
> Uska asli matlab hai: **har guess pe aadha search space kaat do**.
> Aur search space koi bhi ho sakta hai — array, ya answer ki range.*

---

## Part 1 — Basic Binary Search (galti-proof template)

### Sabse pehle: overflow aur infinite loop se bacho

```js
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {                              // <= kyunki lo==hi bhi valid candidate hai
    const mid = lo + Math.floor((hi - lo) / 2);   // (lo+hi)/2 nahi — overflow safe habit
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;          // +1 / -1 ZAROORI, warna infinite loop
    else hi = mid - 1;
  }
  return -1;
}
```

```
target = 7
       lo            mid              hi
      [1,  3,  5,  7,  9, 11, 13]
                   ^
              7 mil gaya -> return

Har step pe search space AADHA:  7 -> 3 -> 1 -> 0
log2(7) ~ 3 steps. Isliye O(log n).
```

### 3 galtiyan jo sab karte hain

| Galti | Kya hoga | Fix |
|---|---|---|
| `lo = mid` (bina +1) | Infinite loop | `lo = mid + 1` |
| `while (lo < hi)` jab `lo<=hi` chahiye | Last element miss | Exact search me `<=` |
| `mid = (lo+hi)/2` bina floor | JS me decimal index | `Math.floor` |

---

## Part 2 — Lower Bound / Upper Bound (ye zyada kaam aata hai)

Exact match dhoondhna kam hi kaam aata hai. **"Pehla element jo condition satisfy kare"** —
ye asli requirement hoti hai.

```
arr = [1, 3, 3, 3, 5, 7]

lowerBound(3) = 1   <- pehla index jahan arr[i] >= 3
upperBound(3) = 4   <- pehla index jahan arr[i] >  3

count of 3 = upperBound - lowerBound = 4 - 1 = 3
```

```js
// pehla index jahan arr[i] >= target
function lowerBound(arr, target) {
  let lo = 0, hi = arr.length;                  // hi = length (mid+1 se aage jaa sakte hain)
  while (lo < hi) {                             // < (== pe ruk jao)
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;                              // mid abhi bhi candidate hai -> mid-1 mat karo
  }
  return lo;
}
```

> **Yaad rakhne ka tareeka:**
> Exact search → `lo <= hi`, dono taraf `±1`
> Boundary search → `lo < hi`, ek taraf `mid`, ek taraf `mid + 1`

---

## Part 3 — BINARY SEARCH ON ANSWER (ye seekh liya to level up)

### Pehchano kaise

```
Trigger phrases:
- "MINIMUM possible maximum ___"     <- ye phrase dekhte hi ye pattern
- "MAXIMUM possible minimum ___"
- "minimum time/speed/capacity such that ___ possible ho jaaye"
- "kya hum X me kaam kar sakte hain?" -- aur X badhane se aasan ho jaata hai
- constraints me n chhota par ANSWER ki range HUGE (10^9)
```

### Asli idea

Array pe search nahi kar rahe. **Answer ki range pe search kar rahe hain.**

```
Answer ki range:  [1 ................................ 10^9]

Har candidate answer X pe ek CHECK function chalao: canDo(X) -> true/false

Aur ye check MONOTONIC hota hai:

X:        1    2    3    4    5    6    7    8    9
canDo:    F    F    F    F    T    T    T    T    T
                              ^
                          YE dhoondhna hai (pehla true)

Ek baar monotonic ban gaya -> binary search laga do!
```

### Universal template (isko ratt lo)

```js
function binarySearchOnAnswer(lo, hi, canDo) {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (canDo(mid)) hi = mid;      // mid chalta hai -> aur chhota try karo (mid bhi candidate)
    else lo = mid + 1;             // mid nahi chalta -> aur bada chahiye
  }
  return lo;                       // pehla true
}
```

**3 steps me sochna:**
```
1. Answer kya hai?          -> ek NUMBER (speed, capacity, time, length)
2. Uski range kya hai?      -> lo = minimum sensible, hi = maximum sensible
3. canDo(X) kaise likhein?  -> ek O(n) loop jo "haan/na" bataye
```

---

### Example 1 — Koko Eating Bananas (LC 875)

"Koko ko h ghante me saare kele khane hain. Minimum speed k kya ho?"

```
1. Answer     = speed k
2. Range      = lo=1 (kam se kam 1 kela/ghanta),  hi=max(piles) (isse tez ka fayda nahi)
3. canDo(k)   = is speed pe total ghante <= h?
```

```js
function minEatingSpeed(piles, h) {
  const canDo = (k) => {
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    return hours <= h;
  };
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (canDo(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
```

Complexity: `O(n log(max))`. Brute force `O(max · n)` tha — max 10^9, TLE pakka.

---

### Example 2 — Ship Packages in D Days (LC 1011)

```
1. Answer  = ship ki capacity
2. Range   = lo = max(weights)   <- sabse bhaari cheez to ek trip me jaani hi chahiye
             hi = sum(weights)   <- ek hi din me sab
3. canDo(c)= is capacity pe kitne din lagenge? <= D?
```

```js
function shipWithinDays(weights, days) {
  const canDo = (cap) => {
    let d = 1, load = 0;
    for (const w of weights) {
      if (load + w > cap) { d++; load = 0; }    // naya din
      load += w;
    }
    return d <= days;
  };
  let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (canDo(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
```

> **Note karo:** Koko aur Ship — **bilkul same code**, sirf `lo`, `hi`, aur `canDo` badle.
> Yahi "pattern" ka matlab hai. Ye family me 20+ LeetCode problems hain.

---

## Part 4 — Rotated Sorted Array (LC 33) — chalak wali

```
[4, 5, 6, 7, 0, 1, 2]        <- rotated

Key insight: mid ke DONO taraf me se KAM SE KAM EK HISSA sorted hoga.

       lo      mid       hi
      [4, 5, 6, 7, 0, 1, 2]
       |-----------|            arr[lo] <= arr[mid]  -> LEFT sorted hai
                   |------|     to right unsorted hai

Ab poocho: target left ke range me hai?
   haan -> hi = mid-1     nahi -> lo = mid+1
```

```js
function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;

    if (nums[lo] <= nums[mid]) {                        // left half sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                                            // right half sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
```

> Rule: **pehle pata karo kaunsa half sorted hai, fir check karo target usme hai ya nahi.**

---

## Part 5 — Peak dhoondhna bina sorted array ke (LC 162)

Ye counter-intuitive hai: **binary search ke liye sorted hona ZAROORI NAHI.**
Sirf **koi monotonic decision rule** chahiye.

```
[1, 2, 3, 1]

mid pe dekho: arr[mid] < arr[mid+1] ?
  haan -> upar chadh rahe ho -> peak DAAYE hai  -> lo = mid + 1
  nahi -> neeche utar rahe ho -> peak BAAYE (ya mid hi) -> hi = mid
```

```js
function findPeakElement(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
```

---

## Interview me bolne wali line

> *"Yahan main answer pe binary search karunga. Answer ki range 1 se 10^9 hai,
> aur `canDo(x)` monotonic hai — agar x pe possible hai to x+1 pe bhi possible hai.
> Toh complexity O(n log(range)) ho jaayegi, brute force O(range · n) ki jagah."*

Ye ek paragraph bolne se hi interviewer samajh jaata hai ki tumne pattern pehchana hai.

---

## Problems

| # | Problem | Type |
|---|---|---|
| 704 | Binary Search | Basic |
| 35 | Search Insert Position | Lower bound |
| 278 | First Bad Version | Boundary |
| 33 | Search in Rotated Array | Rotated |
| 153 | Min in Rotated Array | Rotated |
| 162 | Find Peak Element | Unsorted BS |
| 875 | Koko Eating Bananas | **On answer** (start here) |
| 1011 | Ship Within D Days | On answer |
| 410 | Split Array Largest Sum | On answer (hard) |
| 1482 | Min Days to Make Bouquets | On answer |
| 4 | Median of Two Sorted Arrays | Partition BS (very hard) |

---
Agla: [06-monotonic-stack.md](06-monotonic-stack.md)
