# 16 — REVISION SHEET (poori DSA, ek page me)

> **Interview se pehle sirf ye padho. 20 minute.**

---

## 🎯 Master Decision Tree

```
PROBLEM PADHO -> n kitna hai? -> kya maanga hai?
│
├── ARRAY / STRING
│   ├── sorted hai / sort kar sakte ho?
│   │   ├── pair / triplet with sum ........... TWO POINTERS (opposite ends)
│   │   ├── ek value / boundary dhoondhni ..... BINARY SEARCH
│   │   └── intervals / meetings .............. SORT + SWEEP
│   │
│   ├── CONTIGUOUS subarray/substring?
│   │   ├── "longest/shortest such that" ...... SLIDING WINDOW (variable)
│   │   ├── fixed size k ...................... SLIDING WINDOW (fixed)
│   │   └── "sum = k" + negatives ............. PREFIX SUM + HASHMAP
│   │
│   ├── SUBSEQUENCE (non-contiguous) .......... DP (LIS / LCS)
│   ├── count / freq / "seen before" .......... HASHMAP / SET
│   ├── "next greater / smaller" .............. MONOTONIC STACK
│   ├── "top k / kth" ......................... HEAP (size k)
│   └── "ALL possible ___" + n<=20 ............ BACKTRACKING
│
├── LINKED LIST
│   ├── head badal sakta hai .................. DUMMY NODE
│   ├── middle / cycle / kth from end ......... FAST & SLOW
│   └── reverse ............................... TEEN POINTER
│
├── TREE
│   ├── level by level / shortest ............. BFS + level size
│   ├── path / depth / bottom-up .............. DFS postorder
│   ├── BST + sorted chahiye .................. INORDER
│   └── "path kahin se kahin bhi" ............. DFS + global var + 2 returns
│
├── GRAPH
│   ├── shortest, same weight ................. BFS
│   ├── shortest, alag weight ................. DIJKSTRA
│   ├── prerequisites / order ................. TOPO SORT (Kahn's)
│   ├── components / "connected?" ............. UNION-FIND ya DFS
│   ├── "sabhi X se nearest Y" ................ MULTI-SOURCE BFS
│   └── grid ................................. DFS/BFS + DIRS array
│
└── OPTIMIZE (max/min/count ways) + choices affect future
    ├── overlapping subproblems ............... DP
    ├── local best = global best .............. GREEDY
    └── "min possible max" / huge range ....... BINARY SEARCH ON ANSWER
```

---

## ⚡ Constraint → Pattern (5 second lookup)

| n | Target | Pattern |
|---|---|---|
| ≤ 10 | O(n!) | Permutations |
| ≤ 20 | O(2ⁿ) | Subsets / bitmask |
| ≤ 100 | O(n³) | Interval DP, Floyd-Warshall |
| ≤ 1,000 | O(n²) | 2D DP |
| ≤ 10⁵ | O(n log n) | Sort, heap, binary search |
| ≤ 10⁶ | O(n) | Hashmap, two pointer, window |
| ≥ 10⁹ | O(log n) | **Binary search on answer** |

---

## 🔑 Ek-line yaaddasht (har pattern ka nichod)

```
HASHMAP          "Kya main kuch DOBARA dhoondh raha hoon?"
PREFIX SUM       "Range ka sum baar-baar chahiye?"  prefix[j+1]-prefix[i]
TWO POINTER      "Sorted + pair"  ->  sum bada? r--, chhota? l++
SLIDING WINDOW   LONGEST: while(INVALID), record BAAHAR
                 SHORTEST: while(VALID),  record ANDAR
BINARY SEARCH    lo<=hi + mid±1 = exact | lo<hi + hi=mid = boundary
BS ON ANSWER     canDo(x) monotonic hai? -> answer pe search karo
MONOTONIC STACK  "jo mere kaam ke nahi, unhe abhi pop karo"  (index push karo)
LINKED LIST      head badal sakta hai -> DUMMY. reverse -> prev/cur/next
TREE             "bachche kya batayein taaki main parent ko bata sakoon?"
BFS              const size = q.length  <- level ka raaz. q[head++] use karo
HEAP             Kth LARGEST -> MIN heap size k  (ULTA yaad rakho)
BACKTRACK        choose -> explore -> UN-choose.  res.push([...path])
UNION-FIND       find + path compression, union + rank. false = cycle
TOPO SORT        indeg 0 queue me. order.length !== n -> cycle
DP               recursion likho -> memo lagao -> table -> space optimize
                 function ke PARAMETERS hi dp ke DIMENSIONS hain
GREEDY           counter-example dhoondho. nahi mila? -> greedy chalega
INTERVALS        MERGE -> sort by START | MAX FIT -> sort by END
BITS             x^x=0 (jodi gayab) | n&(n-1) = rightmost bit hatao
```

---

## 💻 5 templates jo aankh band karke aane chahiye

### 1. Binary Search (boundary)
```js
let lo = 0, hi = n;
while (lo < hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (canDo(mid)) hi = mid; else lo = mid + 1;
}
return lo;
```

### 2. Sliding Window (longest)
```js
let left = 0, best = 0;
for (let right = 0; right < n; right++) {
  add(arr[right]);
  while (INVALID) { remove(arr[left]); left++; }
  best = Math.max(best, right - left + 1);
}
```

### 3. BFS (level order)
```js
const q = [start]; let head = 0, level = 0;
const seen = new Set([start]);
while (head < q.length) {
  const size = q.length - head;
  for (let i = 0; i < size; i++) {
    const cur = q[head++];
    for (const nxt of neighbors(cur))
      if (!seen.has(nxt)) { seen.add(nxt); q.push(nxt); }
  }
  level++;
}
```

### 4. Backtracking
```js
function bt(start, path) {
  if (GOAL) { res.push([...path]); return; }
  for (let i = start; i < n; i++) {
    if (!valid(i)) continue;
    path.push(choices[i]);
    bt(i + 1, path);
    path.pop();
  }
}
```

### 5. DP (memo)
```js
const memo = new Map();
function solve(i, state) {
  if (BASE) return baseValue;
  const key = `${i},${state}`;
  if (memo.has(key)) return memo.get(key);
  const ans = Math.max(solve(i+1, state), solve(i+1, newState) + gain);
  memo.set(key, ans);
  return ans;
}
```

---

## 🐛 Top 15 bugs (ye check kar lo har baar)

```
□  1. sort() bina comparator                    -> sort((a,b)=>a-b)
□  2. BFS me shift()                            -> q[head++]
□  3. BFS me pop pe visited mark                -> PUSH pe mark karo
□  4. res.push(path) bina copy                  -> [...path]
□  5. path.pop() bhoolna                        -> har call ke baad
□  6. window length right-left                  -> right-left+1
□  7. prefix map me {0:1} bhoolna               -> new Map([[0,1]])
□  8. hashmap set() check se pehle              -> check pehle
□  9. lo = mid (bina +1)                        -> infinite loop
□ 10. linked list reverse me cur return         -> prev return
□ 11. slow.next = null bhoolna (split)          -> infinite loop
□ 12. merge intervals me max na lena            -> Math.max(last[1], cur[1])
□ 13. 0/1 knapsack me seedha loop               -> ULTA (W se 0)
□ 14. new Array(3).fill(new Array(3))           -> Array.from(...)
□ 15. if (map.get(k)) jab value 0 ho            -> map.has(k)
```

---

## 🗣️ Bolne wale 6 vaakya (ratt lo)

```
1. "n ka range kya hai? Duplicates ho sakte hain? Empty input pe kya return karoon?"

2. "Brute force ye hoga: ___, O(n²). Ab main sochta hoon isme kya repeat ho raha hai."

3. "Yahan main same cheez baar-baar compute kar raha hoon.
    Agar hashmap me store kar loon to O(n) me ho jaayega."

4. "Approach clear hai? Main code shuru karoon?"

5. "Chalo isko [1,2,3] pe dry run karte hain. i=0 pe..."

6. "Time O(n) hai kyunki ek pass. Space O(n) worst case jab sab distinct hon.
    Agar memory tight ho to sort + two-pointer se O(1) space kar sakte hain,
    par O(n log n) time lagega."
```

---

## ⏱️ Time budget (45 min)

```
0-5    clarify + examples
5-10   brute force BOLO (code mat karo)
10-15  optimize + approach confirm
15-35  code (bolte hue)
35-42  dry run + edge cases
42-45  complexity + trade-offs
```

---

## 🧠 Aakhri 3 line

```
1. Pattern pehchano, solution mat ratto.
2. Bolte raho — chup rehna sabse bada red flag hai.
3. Brute force -> "kya repeat ho raha hai?" -> optimize.
   Ye teen step har problem pe kaam karte hain. HAR problem pe.
```

---

**All the best. Ab jaake fod do. 🚀**
