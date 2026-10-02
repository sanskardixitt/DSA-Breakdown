# 03 — Two Pointers

> **Ek line ka funda:** *Do index rakho, dono ko soch-samajh ke chalao.
> O(n²) ka kaam O(n) me ho jaata hai — kyunki har step pe aadha search space kat jaata hai.*

---

## Teen shakalein (pehchano kaunsi hai)

```
1. OPPOSITE ENDS          2. FAST & SLOW            3. SAME DIRECTION
   (sorted array)            (cycle, middle)           (in-place write)

   L -->      <-- R          S->  F->->                 read ---->
  [1 2 3 4 5 6 7 8]        [1 2 3 4 5]              [a b b c d]
                                                      ^
                                                     write
```

---

## Shakal 1 — Opposite Ends (SORTED array ka best friend)

### Kab: array **sorted** hai + pair/triplet dhoondhna hai

```
Trigger: "sorted array", "pair with sum", "container", "palindrome", "reverse"
```

### Diagram: Two Sum on sorted array

```
target = 10
       L                          R
      [1,  3,  4,  6,  8,  9,  12]
       1 + 12 = 13  > 10  -> bada hai -> R-- (chhota number chahiye)

       L                     R
      [1,  3,  4,  6,  8,  9,  12]
       1 + 9 = 10  == 10   -> MIL GAYA ✅
```

**Kyun kaam karta hai:** sorted hai, isliye
- sum **zyada** hai → sirf `R--` se kam ho sakta hai (L++ se aur badhega)
- sum **kam** hai → sirf `L++` se badh sakta hai

Har step pe **ek possibility permanently cut** hoti hai. Isliye O(n).

```js
function twoSumSorted(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l < r) {
    const sum = arr[l] + arr[r];
    if (sum === target) return [l, r];
    if (sum < target) l++;    // chhota hai -> left badhao
    else r--;                 // bada hai   -> right ghatao
  }
  return [];
}
```

### 3Sum = "ek fix karo, baaki 2Sum" (LC 15)

```
Sort karo. Fir:
  i pe ek number FIX karo
  bache hue part me two-pointer chalao target = -nums[i]

  i    L                R
 [-4, -1, -1,  0,  1,  2]
  ^    fix karke andar do pointer
```

```js
function threeSum(nums) {
  nums.sort((a, b) => a - b);            // ⚠️ comparator zaroori
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;                        // 🔑 sorted hai, aage sab positive -> sum kabhi 0 nahi
    if (i > 0 && nums[i] === nums[i - 1]) continue; // 🔑 duplicate fix skip
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;   // 🔑 duplicate skip
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      }
    }
  }
  return res;
}
```
> **Duplicates handle karna hi is problem ka asli exam hai.** Teen jagah skip lagta hai.
> Yaad rakhne ka tareeka: *fix pe skip, match milne ke baad dono taraf skip.*

### Container With Most Water (LC 11) — chhota wala kyun move karein?

```
       |                       |
       |     |                 |
   |   |     |     |           |
   |   |     |     |     |     |
   L                           R

Area = min(h[L], h[R]) * (R - L)

Width to har move pe ghategi hi. Toh height badhni chahiye.
Chhoti wall hi bottleneck hai -> use hi hatao.
Badi wall hatane se: width bhi kam, height bhi kam -> pakka nuksaan.
```
```js
function maxArea(h) {
  let l = 0, r = h.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(h[l], h[r]) * (r - l));
    if (h[l] < h[r]) l++; else r--;      // chhoti wall hatao
  }
  return best;
}
```

---

## Shakal 2 — Fast & Slow (Tortoise-Hare)

### Kab: linked list me cycle, middle, ya "kth from end"

```
slow ek kadam, fast do kadam

  s
  f
[1]->[2]->[3]->[4]->[5]->null

       s         f
[1]->[2]->[3]->[4]->[5]->null

            s              f=null
[1]->[2]->[3]->[4]->[5]->null
             ^
           MIDDLE ✅   (fast end pe pahucha to slow beech me)
```

**Cycle detection ka intuition:** race track pe tez runner slow ko **lap** kar dega.
Agar cycle hai to milna pakka hai. Agar nahi hai to fast pehle `null` pe pahunch jaayega.

```js
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {          // ⚠️ dono check — warna fast.next.next crash
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

### Cycle ka START dhoondhna (Floyd's — LC 142 / 287)

```
Meeting ke baad: ek pointer HEAD pe le jao, dusra meeting point pe.
Dono ek-ek kadam chalao. Jahan milenge = cycle ka start.
```
```js
let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next; fast = fast.next.next;
  if (slow === fast) {
    let p = head;
    while (p !== slow) { p = p.next; slow = slow.next; }
    return p;                        // cycle start
  }
}
```
> Ye maths se prove hota hai (distance a = c). Interview me proof nahi maangte,
> par **"Floyd's cycle detection"** naam bolna impressive lagta hai.

---

## Shakal 3 — Same Direction (read/write pointer)

### Kab: "in-place" me elements hatao/move karo, **O(1) space**

```
Remove duplicates from sorted array:

        read ---->
    [1, 1, 2, 2, 3]
     ^
   write

write = "agli valid jagah kahan likhni hai"
read  = "abhi kya dekh raha hoon"
```

```js
function removeDuplicates(nums) {
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[read - 1]) nums[write++] = nums[read];
  }
  return write;                    // nayi length
}
```

**Move Zeroes** — same idea:
```js
function moveZeroes(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++)
    if (nums[read] !== 0) [nums[write], nums[read]] = [nums[read], nums[write]], write++;
}
```

---

## Bonus — Dutch National Flag (3-way partition, LC 75 Sort Colors)

Teen pointer, ek pass, O(1) space. **Ye pattern quicksort me bhi use hota hai.**

```
[0 0 0 | 1 1 1 | ? ? ? ? | 2 2 2]
        ^       ^        ^
       low     mid      high

mid pe 0 -> swap(low, mid), low++, mid++
mid pe 1 -> mid++
mid pe 2 -> swap(mid, high), high--     ⚠️ mid++ MAT karo (naya element aaya hai, use check karo)
```
```js
function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) { [nums[low], nums[mid]] = [nums[mid], nums[low]]; low++; mid++; }
    else if (nums[mid] === 1) mid++;
    else { [nums[mid], nums[high]] = [nums[high], nums[mid]]; high--; }   // mid nahi badha
  }
}
```

---

## ⚠️ Common galtiyan

| Galti | Fix |
|---|---|
| `while (l <= r)` two-pointer me | Pair chahiye to `l < r` (ek hi element se pair nahi banta) |
| Unsorted pe opposite-ends lagana | **Pehle sort karo** ya HashMap use karo |
| Duplicates skip bhoolna 3Sum me | Teen jagah skip lagana padta hai |
| `fast.next.next` bina null check | `while (fast && fast.next)` |
| Dutch flag me 2 swap ke baad `mid++` | Naya element unknown hai — check karna zaroori |

---

## Problems

| # | Problem | Shakal |
|---|---|---|
| 125 | Valid Palindrome | Opposite ends |
| 167 | Two Sum II (sorted) | Opposite ends |
| 15 | 3Sum | Fix + two pointer ⭐ |
| 11 | Container With Most Water | Greedy move |
| 42 | Trapping Rain Water | Opposite ends + max tracking ⭐⭐ |
| 26/283 | Remove Dup / Move Zeroes | Read-write |
| 75 | Sort Colors | Dutch flag |
| 141/142 | Linked List Cycle | Fast-slow |
| 287 | Find Duplicate Number | Fast-slow on array! ⭐ |

---
Agla: [04-sliding-window.md](04-sliding-window.md)
