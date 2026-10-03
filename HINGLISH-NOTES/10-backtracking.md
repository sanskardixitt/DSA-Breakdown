# 10 — Backtracking

> **Ek line ka funda:** *"Sab possibilities try karo, par galat raaste pe jaate hi
> WAAPAS aa jao." Choose → Explore → Un-choose. Bas yahi teen line hai.*

---

## Trigger words

- "**ALL** possible ___" (all subsets, all permutations, all paths, all combinations)
- "generate karo", "print all"
- "**n ≤ 20**" constraint (2^20 ~ 10^6 — acceptable)
- Sudoku, N-Queens, word search — puzzle wali problems

> **Sabse bada signal:** *"ALL"* shabd + chhota n.
> Agar "count how many" poocha hai (all list nahi chahiye) → **DP socho, backtracking nahi**.

---

## Universal template (ye ek cheez ratt lo)

```js
function backtrack(path, choices) {
  if (GOAL_REACHED) {
    result.push([...path]);        // ⚠️ COPY banao! [...path] — warna reference bug
    return;
  }

  for (const choice of choices) {
    if (!isValid(choice)) continue;   // pruning — galat raasta hai hi mat jao

    path.push(choice);                // 1. CHOOSE
    backtrack(path, nextChoices);     // 2. EXPLORE
    path.pop();                       // 3. UN-CHOOSE  <-- ye line hi "backtrack" hai
  }
}
```

### `[...path]` kyun zaroori hai

```
Bina copy ke:
  result = [path, path, path]     <- teeno SAME array ka reference
  path.pop() hone pe SAB badal jaate hain
  Final answer:  [[], [], []]   💀

Copy ke saath:
  result = [[1], [1,2], [1,2,3]]  ✅
```
**Ye #1 backtracking bug hai.** Har baar `[...path]` ya `path.slice()` likho.

---

## Pattern A — SUBSETS (LC 78) — "lo ya na lo"

```
nums = [1, 2, 3]

Decision tree — har element pe DO choice:

                        []
              take 1 /      \ skip 1
                  [1]          []
           t2 /     \ s2    t2/    \ s2
          [1,2]     [1]    [2]      []
          /   \     /  \   /  \     /  \
     [1,2,3][1,2][1,3][1][2,3][2] [3]  []

8 leaves = 2^3 subsets ✅
```

```js
function subsets(nums) {
  const res = [], path = [];
  function bt(start) {
    res.push([...path]);                    // har node ek subset hai (leaf hi nahi)
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);                   // CHOOSE
      bt(i + 1);                            // EXPLORE (i+1: aage ke elements hi)
      path.pop();                           // UN-CHOOSE
    }
  }
  bt(0);
  return res;
}
```

> **`start` parameter ka role:** duplicates ko rokta hai.
> `[1,2]` aur `[2,1]` same subset hain — `start` se hum sirf aage badhte hain,
> peeche nahi jaate. Isliye har combination **ek hi baar** banti hai.

---

## Pattern B — COMBINATIONS (LC 39 Combination Sum)

```
candidates = [2,3,6,7], target = 7

                    target=7
        /2        |3         \6      \7
      5          4           1        0 ✅[7]
    /2  |3  \6 /3 |6
   3    2   -1 1  -2
  /2 |3      ✗ ✗   ✗
  1  0 ✅
     [2,2,3]
  /2
  -1 ✗

Answers: [2,2,3], [7]
```

```js
function combinationSum(candidates, target) {
  const res = [], path = [];
  candidates.sort((a, b) => a - b);          // sort -> break jaldi lag jaayega

  function bt(start, remain) {
    if (remain === 0) { res.push([...path]); return; }

    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remain) break;     // 🔑 PRUNE — sorted hai, aage sab bade
      path.push(candidates[i]);
      bt(i, remain - candidates[i]);         // i (i+1 nahi) — same element dobara le sakte hain
      path.pop();
    }
  }
  bt(0, target);
  return res;
}
```

### 🔑 `i` vs `i + 1` — ye ek digit sab kuch badalta hai

```
bt(i,     ...)  ->  same element DOBARA le sakte ho     (Combination Sum I)
bt(i + 1, ...)  ->  har element sirf EK baar            (Subsets, Combination Sum II)
bt(0,     ...)  ->  har baar sab available              (Permutations)
```

### Duplicates wale input (Combination Sum II, LC 40)

```js
candidates.sort((a, b) => a - b);
// loop ke andar:
if (i > start && candidates[i] === candidates[i - 1]) continue;   // 🔑 SAME LEVEL pe skip
```

```
[1, 1, 2], target = 3

Same LEVEL pe do 1 -> dusra 1 skip karo (warna [1,2] do baar aayega)
Alag LEVEL pe (i.e. parent-child) 1 -> allowed ([1,1,...] valid hai)

isliye condition  i > start  hai, na ki  i > 0
```

---

## Pattern C — PERMUTATIONS (LC 46) — order maayne rakhta hai

```
nums = [1,2,3]

Yahan `start` nahi chalega — har baar SAB available hain (jo use nahi hue).
Isliye `used[]` array chahiye.

                []
        1/      2|      3\
      [1]       [2]      [3]
     2/ \3     1/ \3    1/ \2
  [1,2] [1,3] ...
    |3    |2
 [1,2,3] [1,3,2]

3! = 6 permutations
```

```js
function permute(nums) {
  const res = [], path = [], used = new Array(nums.length).fill(false);

  function bt() {
    if (path.length === nums.length) { res.push([...path]); return; }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;              // pehle se use ho chuka
      used[i] = true;  path.push(nums[i]);       // CHOOSE
      bt();                                      // EXPLORE
      path.pop();      used[i] = false;          // UN-CHOOSE (dono undo karo!)
    }
  }
  bt();
  return res;
}
```

> **Un-choose me DONO cheez undo karni hai** — `path.pop()` aur `used[i] = false`.
> Ek bhoolna = silent wrong answer.

---

## Subsets vs Combinations vs Permutations — ek table me

```
+----------------+----------+---------------+-------------------------+
|                | Order?   | Kitne?        | Loop kaise              |
+----------------+----------+---------------+-------------------------+
| SUBSETS        | nahi     | 2^n           | for(i=start..) bt(i+1)  |
| COMBINATIONS   | nahi     | C(n,k)        | for(i=start..) bt(i+1)  |
| PERMUTATIONS   | HAAN     | n!            | for(i=0..) used[] check |
+----------------+----------+---------------+-------------------------+

Farak: subsets/combinations me `start`, permutations me `used[]`
```

---

## Pattern D — Grid backtracking (Word Search, LC 79)

```js
function exist(board, word) {
  const R = board.length, C = board[0].length;

  function bt(r, c, k) {
    if (k === word.length) return true;                 // pura word mil gaya
    if (r < 0 || r >= R || c < 0 || c >= C) return false;
    if (board[r][c] !== word[k]) return false;

    const tmp = board[r][c];
    board[r][c] = '#';                                  // 🔑 CHOOSE (mark visited in-place)

    const found = bt(r+1,c,k+1) || bt(r-1,c,k+1) || bt(r,c+1,k+1) || bt(r,c-1,k+1);

    board[r][c] = tmp;                                  // 🔑 UN-CHOOSE (restore!)
    return found;
  }

  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (bt(r, c, 0)) return true;
  return false;
}
```
> **In-place marking trick:** alag `visited` array banane ki jagah cell ko `'#'` kar do,
> aur wapas aate hue restore. **O(1) extra space.** Ye industrial trick hai.

---

## Pruning — asli speed yahan se aati hai

Backtracking exponential hai. **Pruning hi usko chalne layak banati hai.**

```
Pruning ke 4 tareeke:

1. SORT + BREAK       sorted hai, current > remaining -> break (aage sab bade)
2. EARLY RETURN       answer mil gaya -> return true, aage mat jao
3. CONSTRAINT CHECK   invalid state banate hi return (N-Queens me column/diagonal)
4. DEDUP SKIP         i > start && arr[i] === arr[i-1] -> continue
```

**N-Queens ka pruning** — O(1) me check:
```js
const cols = new Set(), diag1 = new Set(), diag2 = new Set();
// row+col hamesha same for "/" diagonal
// row-col hamesha same for "\" diagonal
if (cols.has(c) || diag1.has(r + c) || diag2.has(r - c)) continue;
```
> Har baar poora board scan karne ki jagah 3 sets. **O(n) → O(1) per check.**

---

## Complexity kaise bataye

```
Time  = (kitne nodes tree me) × (har node pe kaam)

Subsets       : O(2^n × n)      2^n subsets, har ek copy karne me n
Permutations  : O(n! × n)
Combination   : O(2^n × n)      worst case
N-Queens      : O(n!)           pruning se practically bahut kam

Space = O(n) recursion depth + O(n) path     (output ko count nahi karte)
```

> Interview me bolo: *"Output hi exponential hai, toh isse behtar ho hi nahi sakta.
> Par pruning se practical runtime bahut kam ho jaata hai."*

---

## Common galtiyan

| Galti | Fix |
|---|---|
| `res.push(path)` bina copy | `res.push([...path])` |
| `path.pop()` bhoolna | Har `bt()` call ke baad |
| Permutation me `used[i] = false` bhoolna | Dono undo karo |
| `bt(i)` vs `bt(i+1)` confuse | Reuse allowed? → `i`, warna `i+1` |
| Dedup me `i > 0` likhna | `i > start` chahiye |
| Grid me restore bhoolna | `board[r][c] = tmp` |

---

## Problems

| # | Problem | Pattern |
|---|---|---|
| 78 | Subsets | Base (start here) |
| 90 | Subsets II | Dedup skip |
| 39 | Combination Sum | `bt(i)` reuse |
| 40 | Combination Sum II | `bt(i+1)` + dedup |
| 46 | Permutations | `used[]` |
| 47 | Permutations II | `used[]` + dedup |
| 22 | Generate Parentheses | Constraint pruning |
| 17 | Letter Combinations | Multi-choice |
| 79 | Word Search | Grid + restore |
| 131 | Palindrome Partitioning | Partition + check |
| 51 | N-Queens | Heavy pruning |
| 37 | Sudoku Solver | Boss level |

---
Agla: [11-graphs.md](11-graphs.md)
