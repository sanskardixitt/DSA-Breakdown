# 01 — Complexity Oracle: Constraint dekh ke pattern guess karo

> Ye sabse bada shortcut hai jo competitive programmers use karte hain
> aur beginners ko pata hi nahi hota.

---

## 1. Constraint = Answer ka hint

Problem me `n` ki limit di hoti hai. **Wahi bata deti hai ki solution kis complexity ka expected hai.**
Aur complexity pata chal gayi to pattern apne aap short-list ho jaata hai.

Judge roughly **10⁸ operations per second** kar leta hai. Bas isi se ulta hisaab lagao:

| Constraint | Target | Matlab kaunsa pattern |
|---|---|---|
| `n ≤ 10` | O(n!) | **Permutations** — sab arrangements banane hain |
| `n ≤ 20` | O(2ⁿ) | **Subsets / Bitmask DP** — har element lo ya na lo |
| `n ≤ 100` | O(n³) / O(n⁴) | Floyd-Warshall, interval DP, heavy 2D DP |
| `n ≤ 1,000` | O(n²) | **2D DP**, LIS O(n²), sab pairs |
| `n ≤ 10⁵` | O(n log n) | **Sort, heap, binary search**, divide-conquer |
| `n ≤ 10⁶` | O(n) | **HashMap, two pointer, sliding window, prefix sum** |
| `n ≥ 10⁹` | O(log n) / O(1) | **Binary search on answer, maths formula, bit trick** |

```
   n = 10^5   aur   tum O(n^2) soch rahe ho
        |
        v
   10^10 operations  =  ~100 seconds  =  TLE 💀
        |
        v
   Matlab O(n log n) chahiye -> sort? heap? binary search?
```

### 🔑 Ye trick yaad rakho

> **`n ≤ 20` dikha? → almost hamesha bitmask ya backtracking hai.**
> **`n ≥ 10⁹` dikha aur answer ek number hai? → binary search on answer hai.**
> **`n = 10⁵` aur "subarray/substring" likha hai? → sliding window ya prefix sum hai.**

---

## 2. Complexity padhna — 10 second me

Loop dekho, nesting count karo:

```js
for (let i = 0; i < n; i++) { ... }              // O(n)

for (let i = 0; i < n; i++)
  for (let j = 0; j < n; j++) { ... }            // O(n²)

for (let i = 0; i < n; i++)
  for (let j = i; j < n; j++) { ... }            // O(n²) bhi! (n²/2, constant hata do)

while (lo < hi) { mid = ...; lo/hi = mid; }      // O(log n) — har baar aadha
```

**Trap:** ye O(n²) hai, O(n) nahi —
```js
for (let i = 0; i < n; i++) {
  if (arr.includes(x)) { ... }   // includes() khud O(n) hai! 💀
}
```

### JS me chhupi hui complexity (ye interview me pakde jaate hain)

| Operation | Complexity | Note |
|---|---|---|
| `arr.push()` / `pop()` | O(1) | ✅ safe |
| `arr.shift()` / `unshift()` | **O(n)** | ⚠️ saare elements shift hote hain! Queue ke liye mat use karo |
| `arr.includes()` / `indexOf()` | **O(n)** | ⚠️ loop ke andar = O(n²) |
| `arr.slice()` / `concat()` | **O(n)** | ⚠️ naya array banta hai |
| `set.has()` / `map.get()` | O(1) | ✅ isiliye HashMap use karte hain |
| `arr.sort()` | O(n log n) | number ke liye `sort((a,b)=>a-b)` **zaroori** hai |
| String `+=` loop me | **O(n²)** | array me push karke `.join('')` karo |

> **Sabse common JS interview blunder:** BFS me `queue.shift()` use karna.
> `n = 10⁵` pe ye O(n²) ban jaata hai. Solution: pointer rakho —
> `let head = 0; ... const node = queue[head++];`

---

## 3. Space complexity — recursion ka chhupa cost

```
Recursion ki depth = stack space
```

```js
function dfs(node) { ... dfs(node.left); ... }
// Balanced tree  -> depth log n -> O(log n) space
// Skewed tree    -> depth n     -> O(n) space  ⚠️
```

Interview me bolo: *"Space O(h) hai jahan h tree ki height hai — worst case O(n) skewed tree me."*
Ye ek line seniority dikhati hai.

---

## 4. Amortized ka matlab (poocha jaata hai)

Monotonic stack me har element **ek baar push, ek baar pop** hota hai.
Andar `while` loop dikhta hai to lagta hai O(n²), par actually **O(n)** hai.

```
Total work = total pushes + total pops = n + n = 2n = O(n)
```

Isko **amortized analysis** kehte hain. Ye line interview me bolna:
> *"Inner while loop hai par har element sirf ek baar pop hota hai, toh amortized O(n) hai."*

---

## 5. Quick reference — kis structure ka kya cost

```
                 Access   Search   Insert   Delete
Array             O(1)     O(n)     O(n)     O(n)
Sorted Array      O(1)   O(log n)   O(n)     O(n)
HashMap/Set        —       O(1)     O(1)     O(1)     <- 90% optimizations yahan se
Stack/Queue        —        —       O(1)     O(1)
Heap             O(1)top    O(n)   O(log n) O(log n)
BST (balanced)     —     O(log n) O(log n) O(log n)
Linked List       O(n)     O(n)     O(1)*    O(1)*    (*node pata ho to)
```

**Yaad rakhne wali line:**
> *Time bachana hai? Space kharch karo. Yahi HashMap ka poora funda hai.*

---

Agla: [02-arrays-hashing.md](02-arrays-hashing.md)
