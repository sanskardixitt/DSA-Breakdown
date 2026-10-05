# 06 — Stack & Monotonic Stack

> **Ek line ka funda:** *Stack = "abhi decide nahi kar sakta, baad me karunga".
> Monotonic stack = "jo mera kaam kabhi nahi aayenge, unhe abhi nikaal do".*

---

## Part 1 — Simple Stack

### Trigger words
- "matching brackets / valid parentheses"
- "undo", "backtrack", "previous"
- "nested structure" (decode string, nested lists)
- "evaluate expression" (RPN)

### Valid Parentheses (LC 20)

```
s = "{[()]}"

{  push {      stack: {
[  push [      stack: { [
(  push (      stack: { [ (
)  pop -> (    match ✅
]  pop -> [    match ✅
}  pop -> {    match ✅
stack khaali -> valid ✅
```

```js
function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const st = [];
  for (const c of s) {
    if (c in pairs) {
      if (st.pop() !== pairs[c]) return false;   // pop() khaali stack pe undefined deta hai — safe
    } else st.push(c);
  }
  return st.length === 0;                        // last check bhoolna mat
}
```

> **Trick:** closing bracket ko key banao, opening ko value. Ek hi lookup me kaam.

---

## Part 2 — MONOTONIC STACK (ye asli cheez hai)

### Trigger words — ye dikhe to 100% monotonic stack

- "**next greater** element"
- "**next smaller** element"
- "**previous greater / smaller**"
- "kitne din baad garam din aayega" (Daily Temperatures)
- "largest rectangle in histogram"
- "stock span"
- "trapping rain water"
- "remove k digits to make smallest number"

### Asli idea — diagram se samjho

Stack me elements **hamesha ek order me** rakhte hain (increasing ya decreasing).
Jab naya element aata hai aur order todta hai → **jo tut rahe hain unka answer mil gaya**.

```
Next Greater Element:  arr = [2, 1, 2, 4, 3]

i=0, x=2   stack khaali        push 0        stack(idx): [0]        vals: [2]
i=1, x=1   1 > 2? nahi         push 1        stack: [0,1]           vals: [2,1]
i=2, x=2   2 > arr[1]=1? HAAN  -> pop 1, ans[1] = 2 ✅
           2 > arr[0]=2? nahi  push 2        stack: [0,2]           vals: [2,2]
i=3, x=4   4 > arr[2]=2? HAAN  -> pop 2, ans[2] = 4 ✅
           4 > arr[0]=2? HAAN  -> pop 0, ans[0] = 4 ✅
                                 push 3      stack: [3]             vals: [4]
i=4, x=3   3 > 4? nahi         push 4        stack: [3,4]

Bache hue (3,4) ka koi next greater nahi -> ans = -1

ans = [4, 2, 4, -1, -1]
```

### Universal template

```js
function nextGreater(arr) {
  const n = arr.length;
  const ans = new Array(n).fill(-1);
  const st = [];                                  // indices rakho, values nahi

  for (let i = 0; i < n; i++) {
    while (st.length && arr[st[st.length - 1]] < arr[i]) {
      ans[st.pop()] = arr[i];                     // popped ka answer = current
    }
    st.push(i);
  }
  return ans;
}
```

### Chaaron variants — sirf 2 cheezein badalti hain

```
+---------------------+-------------------+-----------------+
|  Kya chahiye        |  Loop direction   |  While ki shart |
+---------------------+-------------------+-----------------+
|  NEXT greater       |  left -> right    |  st.top <  cur  |
|  NEXT smaller       |  left -> right    |  st.top >  cur  |
|  PREVIOUS greater   |  right -> left    |  st.top <  cur  |
|  PREVIOUS smaller   |  right -> left    |  st.top >  cur  |
+---------------------+-------------------+-----------------+

Yaad rakho:  NEXT = aage se aage chalo | PREV = peeche se chalo
             GREATER = chhote pop karo | SMALLER = bade pop karo
```

> **Index push karo, value nahi.** Index se value bhi mil jaati hai
> (`arr[idx]`) aur distance bhi (`i - idx`). Value push karoge to distance khatam.

---

## Example 1 — Daily Temperatures (LC 739)

"Kitne din baad zyada garam din aayega?"

```js
function dailyTemperatures(T) {
  const ans = new Array(T.length).fill(0);
  const st = [];
  for (let i = 0; i < T.length; i++) {
    while (st.length && T[st[st.length - 1]] < T[i]) {
      const j = st.pop();
      ans[j] = i - j;                    // <-- distance, isliye index push kiya tha
    }
    st.push(i);
  }
  return ans;
}
```

---

## Example 2 — Largest Rectangle in Histogram (LC 84) — the boss fight

**Soch:** har bar ke liye poocho — *"ye bar apni poori height pe kitni door tak faila sakta hai?"*
Left aur right dono taraf tab tak jao jab tak koi **chhota** bar na aa jaaye.

```
heights = [2, 1, 5, 6, 2, 3]

         6
      5  #
      #  #
2     #  #     3
#  1  #  #  2  #
#  #  #  #  #  #
0  1  2  3  4  5

Bar 5 (height 5): left me 1 rok deta hai, right me 2 rok deta hai
                  width = index 2..3 = 2  -> area = 5*2 = 10
Bar 6 (height 6): width = 1 -> area 6
Bar 1 (height 1): pure array me fail sakta hai, width 6 -> area 6
Bar 2 (height 2) at idx 4: right me 3 bada hai, aage end -> width 2 -> area 4

MAX = 10 ✅
```

```js
function largestRectangleArea(heights) {
  const st = [];                 // increasing heights ke indices
  let best = 0;
  const h = [...heights, 0];     // trick: end me 0 lagao -> sab flush ho jaayega

  for (let i = 0; i < h.length; i++) {
    while (st.length && h[st[st.length - 1]] >= h[i]) {
      const height = h[st.pop()];
      const left = st.length ? st[st.length - 1] + 1 : 0;   // pichla chhota +1
      best = Math.max(best, height * (i - left));           // i = agla chhota
    }
    st.push(i);
  }
  return best;
}
```

> **Sentinel trick:** array ke end me `0` daal dena. Isse loop khatam hone pe
> stack apne aap khaali ho jaata hai — alag se cleanup loop nahi likhna padta.
> Ye trick yaad rakho, bahut jagah kaam aati hai.

---

## Example 3 — Trapping Rain Water (LC 42) — teen tareeke

```
       |
   |   | | |
 | | | | | | |
[0,1,0,2,1,0,1,3,2,1,2,1]

Har index pe paani = min(leftMax, rightMax) - height[i]
                     ^^^^^^^^^^^^^^^^^^^^^ dono taraf ki sabse unchi deewar
```

**Tareeka 1 (samajhne ke liye):** left/right max arrays banao. O(n) space.
**Tareeka 2 (best):** two pointer, O(1) space —
```js
function trap(h) {
  let l = 0, r = h.length - 1, lMax = 0, rMax = 0, water = 0;
  while (l < r) {
    if (h[l] < h[r]) {                    // chhoti side hi bottleneck hai
      lMax = Math.max(lMax, h[l]);
      water += lMax - h[l];
      l++;
    } else {
      rMax = Math.max(rMax, h[r]);
      water += rMax - h[r];
      r--;
    }
  }
  return water;
}
```
**Tareeka 3:** monotonic stack (layer by layer). Interview me tareeka 2 bolo.

---

## Bonus — Remove K Digits (LC 402), greedy + stack

"Number se k digits hatao, sabse chhota number banao."

```
"1432219", k=3

1   push          [1]
4   4>1? push     [1,4]
3   3<4 -> pop 4, k=2    [1,3]
2   2<3 -> pop 3, k=1    [1,2]
2   push                 [1,2,2]
1   1<2 -> pop 2, k=0    [1,2,1]
9   k khatam, push       [1,2,1,9]

answer = "1219" ✅
```
> **Greedy insight:** left se jitni jaldi ho sake bada digit hatao —
> kyunki left wale digits ki value zyada hoti hai.

---

## Common galtiyan

| Galti | Fix |
|---|---|
| Value push karna index ki jagah | Index push karo — distance bhi milta hai |
| `st.length` check bhoolna | `while (st.length && ...)` — pehle length |
| `st[st.length-1]` roz likhna | Helper: `const top = () => st[st.length-1]` |
| `<` vs `<=` galat lagana | Duplicates ka behaviour change hota hai — dry run karo |
| Loop ke baad bache elements bhoolna | Sentinel (`0` / `Infinity`) lagao ya cleanup loop |

---

## "Ye O(n) kaise hai?" — interview jawab

> *"Andar while loop dikh raha hai par har element sirf ek baar push aur ek baar pop hota hai.
> Total operations 2n hain, toh **amortized O(n)**."*

---

## Problems

| # | Problem | Type |
|---|---|---|
| 20 | Valid Parentheses | Simple stack |
| 155 | Min Stack | Stack + aux |
| 150 | Evaluate RPN | Stack |
| 739 | Daily Temperatures | Monotonic (start here) |
| 496/503 | Next Greater Element I/II | Monotonic |
| 901 | Stock Span | Monotonic |
| 402 | Remove K Digits | Greedy + stack |
| 84 | Largest Rectangle | Monotonic (boss) |
| 85 | Maximal Rectangle | 84 ka 2D version |
| 42 | Trapping Rain Water | Two pointer / stack |

---
Agla: [07-linked-list.md](07-linked-list.md)
