# 12 — Dynamic Programming (DP ka darr khatam)

> **Ek line ka funda:** *DP = Recursion + "jo already calculate kar liya, dobara mat karo".
> Bas. Isse zyada kuch nahi hai.*

---

## Sabse pehle: DP ka darr kyun lagta hai

Kyunki log **table** se shuru karte hain. Ye galat order hai.

```
❌ Galat tareeka:  "dp[i][j] kya hoga?" se shuru karna

✅ Sahi tareeka:
    Step 1: BRUTE FORCE recursion likho (bina soche, seedha)
    Step 2: dekho ki same arguments se baar-baar call ho raha hai
    Step 3: MEMO laga do (ek Map)            <-- yahin 90% kaam khatam
    Step 4: (optional) bottom-up table me convert karo
    Step 5: (optional) space optimize karo
```

**Interview me Step 3 tak pahunchna hi kaafi hai.** Step 4-5 bonus hai.

---

## DP ki pehchaan — trigger words

- "**kitne tareeke** hain" (number of ways)
- "**minimum / maximum** cost / path / length"
- "kya possible hai" (can we partition, can we reach)
- "**subsequence**" (contiguous nahi — ye window nahi hai)
- Choices hain aur choices **future ko affect** karti hain
- Greedy try kiya par counter-example mil gaya

### DP hai ya nahi — 2 conditions

```
1. OPTIMAL SUBSTRUCTURE  : bade problem ka answer chhote problems se banta hai
2. OVERLAPPING SUBPROBLEMS: wahi chhota problem BAAR-BAAR aa raha hai
                            (agar overlap nahi hai -> ye divide & conquer hai, DP nahi)
```

---

## Fibonacci se poora DP samjho

### Step 1 — Brute force recursion
```js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
```

```
                 fib(5)
              /          \
        fib(4)            fib(3)
       /      \          /      \
   fib(3)   fib(2)    fib(2)  fib(1)
   /    \    /   \     /   \
fib(2) f(1) f(1) f(0) f(1) f(0)
 /  \
f(1) f(0)

fib(3) DO baar, fib(2) TEEN baar calculate hua! 💀
Time: O(2^n)
```

### Step 2 — Memoization (top-down)
```js
function fib(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);         // 🔑 pehle se hai? wahi do
  const val = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, val);                            // 🔑 store karo
  return val;
}
```
```
Ab har fib(k) SIRF EK BAAR calculate hoga.
Time: O(n)   Space: O(n)
Sirf 2 lines add ki. Exponential -> Linear. 🔥
```

### Step 3 — Tabulation (bottom-up)
```js
function fib(n) {
  const dp = new Array(n + 1);
  dp[0] = 0; dp[1] = 1;
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}
```

### Step 4 — Space optimize
```js
function fib(n) {
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];    // sirf pichhle 2 chahiye
  return n <= 1 ? n : b;
}
```
```
Space: O(n) -> O(1) ✅

Rule: "dp[i] sirf dp[i-1] aur dp[i-2] pe depend karta hai"
       -> pura array chahiye hi nahi, do variable kaafi
```

---

## Memo vs Tabulation — kaunsa kab

| | Memoization (top-down) | Tabulation (bottom-up) |
|---|---|---|
| Likhne me | **Aasan** — recursion pe memo chipka do | Order sochna padta hai |
| Kaunse states compute hote hain | **Sirf zaroori wale** | Sab |
| Stack overflow | Ho sakta hai (deep recursion) | Nahi |
| Space optimize karna | Mushkil | **Aasan** |
| Interview me | **Isse shuru karo** | Optimize karte waqt |

> **Strategy:** Memo se solve karo (jaldi ho jaayega), fir bolo
> *"isko bottom-up me convert karke space O(n) se O(1) kar sakte hain"* — aur kar do.

---

## DP ke 5 SUB-PATTERNS (yahi 90% problems hain)

---

### Pattern 1 — LINEAR / 1-D DP ("har step pe choice")

**Shakal:** `dp[i]` = index i tak ka best answer

#### Climbing Stairs (LC 70)
```
dp[i] = i-th step tak pahunchne ke tareeke
      = dp[i-1] + dp[i-2]        (1 step ya 2 step se aa sakte hain)
```

#### House Robber (LC 198) — "lo ya na lo"
```
Ghar lut sakte ho par ADJACENT nahi.

dp[i] = max( dp[i-1],           <- ye ghar CHHODO
             dp[i-2] + nums[i]) <- ye ghar LOOTO (to i-1 nahi loot sakte)
             ^^^^^^^^^^^^^^^^^^

nums = [2, 7, 9, 3, 1]

dp[0] = 2
dp[1] = max(2, 7) = 7
dp[2] = max(7, 2+9) = 11
dp[3] = max(11, 7+3) = 11
dp[4] = max(11, 11+1) = 12  ✅
```
```js
function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const n of nums) {
    const cur = Math.max(prev1, prev2 + n);
    prev2 = prev1; prev1 = cur;
  }
  return prev1;
}
```
> **"Lo ya na lo" shape** — ye DP ka sabse common shape hai.
> House Robber, Delete and Earn, Best Time to Buy/Sell — sab yahi.

#### Coin Change (LC 322) — "unbounded, minimum"
```js
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;                                     // 0 banane ke liye 0 coins
  for (let a = 1; a <= amount; a++)
    for (const c of coins)
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```
```
coins = [1,2,5], amount = 11

dp[0]=0  dp[1]=1  dp[2]=1  dp[3]=2  dp[4]=2  dp[5]=1
dp[6]=2  dp[7]=2  dp[8]=3  dp[9]=3  dp[10]=2 dp[11]=3 ✅  (5+5+1)
```

---

### Pattern 2 — KNAPSACK ("lo ya na lo, with capacity")

**Shakal:** `dp[i][cap]` = pehle i items, capacity cap ke saath best

```
                      +-----------------------------+
Har item pe do choice:| 1. NA LO  -> dp[i-1][cap]    |
                      | 2. LO     -> dp[i-1][cap-w] + value  (agar w <= cap)|
                      +-----------------------------+
dp[i][cap] = max(dono)
```

#### 0/1 Knapsack (har item ek baar)
```js
function knapsack(weights, values, W) {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++)
    for (let w = W; w >= weights[i]; w--)          // 🔑 ULTA loop!
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
  return dp[W];
}
```

#### 🔑 Ulta loop kyun? (ye interview me poocha jaata hai)

```
0/1 knapsack (har item EK baar)     -> capacity loop ULTA (W se 0)
Unbounded  (item BAAR-BAAR)         -> capacity loop SEEDHA (0 se W)

Kyun? Seedha loop me dp[w - weight] IS ITERATION me hi update ho chuka hota hai
      -> matlab same item DOBARA use ho gaya -> unbounded ban gaya!
      Ulta loop me dp[w - weight] abhi bhi PICHHLI row ka hai -> ek hi baar.
```

#### Partition Equal Subset Sum (LC 416) — knapsack ka bhes badla roop
```js
function canPartition(nums) {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum % 2) return false;                        // odd sum -> impossible
  const target = sum / 2;

  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const n of nums)
    for (let t = target; t >= n; t--)               // ulta (0/1)
      dp[t] = dp[t] || dp[t - n];
  return dp[target];
}
```
> **Pehchaan:** *"do equal parts me baato"* → *"kya sum/2 bana sakte hain?"* → **subset sum** → knapsack.

---

### Pattern 3 — GRID DP (2-D path)

```
dp[r][c] = is cell tak ka best

Unique Paths:      dp[r][c] = dp[r-1][c] + dp[r][c-1]
Min Path Sum:      dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])

    +---+---+---+
    | 1 | 1 | 1 |     Unique paths (only right/down):
    +---+---+---+
    | 1 | 2 | 3 |     dp[1][1] = dp[0][1] + dp[1][0] = 1+1 = 2
    +---+---+---+
    | 1 | 3 | 6 |     answer = 6
    +---+---+---+
```

```js
function minPathSum(grid) {
  const R = grid.length, C = grid[0].length;
  const dp = new Array(C).fill(Infinity);
  dp[0] = 0;
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      dp[c] = grid[r][c] + (c === 0 ? dp[c] : Math.min(dp[c], dp[c - 1]));
      //                              upar         upar      baayen
  return dp[C - 1];
}
```
> **Space trick:** 2D grid DP me aksar sirf **pichhli row** chahiye hoti hai →
> `O(R·C)` space `O(C)` ban jaata hai. Ye rolling array kehlata hai.

---

### Pattern 4 — STRING DP (do strings)

**Shakal:** `dp[i][j]` = s1 ke pehle i chars, s2 ke pehle j chars ka answer

#### Longest Common Subsequence (LC 1143) — poore string DP ka base

```
       ""  a   c   e
   ""  0   0   0   0
   a   0   1   1   1
   b   0   1   1   1
   c   0   1   2   2
   d   0   1   2   2
   e   0   1   2   3  <- answer

Rule:  chars MATCH karte hain?  ->  dp[i][j] = dp[i-1][j-1] + 1     (diagonal +1)
       nahi karte?              ->  dp[i][j] = max(dp[i-1][j], dp[i][j-1])
                                                   ^upar        ^baayen
```

```js
function longestCommonSubsequence(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length];
}
```

> **LCS ka table shape yaad rakho.** Edit Distance, Longest Palindromic Subsequence,
> Distinct Subsequences — sab isi shape pe chhoti si tabdeeli hain.
> **`+1` diagonal on match** = string DP ka DNA.

#### Edit Distance (LC 72) — teen operations
```js
dp[i][j] = a[i-1] === b[j-1]
  ? dp[i-1][j-1]                                        // free (same char)
  : 1 + Math.min(dp[i-1][j-1],   // REPLACE
                 dp[i-1][j],     // DELETE  (a se hatao)
                 dp[i][j-1]);    // INSERT  (a me daalo)
```
```
Teen padosi = teen operation. Isko diagram se yaad rakho:

     dp[i-1][j-1]  dp[i-1][j]
        (replace)   (delete)
              \        |
               \       |
     dp[i][j-1] ---- dp[i][j]
      (insert)
```

---

### Pattern 5 — LIS (Longest Increasing Subsequence)

#### O(n²) version — samajhne ke liye
```js
function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1);       // har element khud ek LIS hai
  let best = 1;
  for (let i = 1; i < nums.length; i++)
    for (let j = 0; j < i; j++)
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
        best = Math.max(best, dp[i]);
      }
  return best;
}
```

#### O(n log n) version 🔥 — patience sorting

```
tails[k] = length k+1 wale increasing subsequence ka SABSE CHHOTA possible last element

nums = [10, 9, 2, 5, 3, 7, 101, 18]

10  -> tails [10]
 9  -> 10 ko replace  tails [9]
 2  -> 9 ko replace   tails [2]
 5  -> append         tails [2, 5]
 3  -> 5 ko replace   tails [2, 3]        (length 2 ab 3 pe khatam ho sakti hai - behtar)
 7  -> append         tails [2, 3, 7]
101 -> append         tails [2, 3, 7, 101]
18  -> 101 replace    tails [2, 3, 7, 18]

Answer = tails.length = 4  ✅

⚠️ tails khud LIS NAHI hai — sirf uski LENGTH sahi hai. Ye common galatfehmi hai.
```

```js
function lengthOfLIS(nums) {
  const tails = [];
  for (const n of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {                          // lower bound binary search
      const mid = (lo + hi) >> 1;
      if (tails[mid] < n) lo = mid + 1; else hi = mid;
    }
    tails[lo] = n;                             // replace ya append (lo === length pe append)
  }
  return tails.length;
}
```

---

## DP problem attack karne ka checklist

```
+--------------------------------------------------------------+
| 1. STATE     : "mujhe kya-kya yaad rakhna padega decide       |
|                karne ke liye?"  -> yahi dp ke parameters hain |
|                                                               |
| 2. CHOICE    : "har state pe kya-kya kar sakta hoon?"         |
|                                                               |
| 3. RECURRENCE: "chhote answers se bada answer kaise banega?"  |
|                                                               |
| 4. BASE CASE : "sabse chhota case kya hai?"                   |
|                                                               |
| 5. ORDER     : "bottom-up me kaunsa pehle compute karna hai?" |
+--------------------------------------------------------------+
```

**State kaise dhoondhein:** brute-force recursion likho.
Uske **function parameters hi dp ke dimensions hain.** Literally.

```js
function solve(i, remaining) { ... }
//             ^  ^^^^^^^^^
//        dp[i][remaining]   <- state mil gaya
```

---

## Common galtiyan

| Galti | Fix |
|---|---|
| Table se shuru karna | **Pehle recursion**, fir memo, fir table |
| Base case galat | Chhote input (n=0, n=1) pe hand-check karo |
| 0/1 knapsack me seedha loop | Ulta loop (`W` se `0`) |
| Memo key incomplete | Saare changing params key me hone chahiye |
| `dp` array ka size `n` | Aksar `n+1` chahiye (0-index base ke liye) |
| Subsequence vs subarray confuse | Subsequence = DP, subarray = window |
| `Infinity` init bhoolna (min problems) | `fill(Infinity)`, `dp[0] = 0` |

---

## Problems (isi order me karo)

**Level 1 — 1D**
| # | Problem |
|---|---|
| 70 | Climbing Stairs (yahin se shuru) |
| 746 | Min Cost Climbing Stairs |
| 198/213 | House Robber I / II |
| 322 | Coin Change |
| 279 | Perfect Squares |
| 139 | Word Break |

**Level 2 — Knapsack**
| # | Problem |
|---|---|
| 416 | Partition Equal Subset Sum |
| 494 | Target Sum |
| 518 | Coin Change II (count ways) |

**Level 3 — Grid**
| # | Problem |
|---|---|
| 62/63 | Unique Paths I / II |
| 64 | Minimum Path Sum |
| 221 | Maximal Square |

**Level 4 — String**
| # | Problem |
|---|---|
| 1143 | LCS (base — must do) |
| 72 | Edit Distance |
| 5 | Longest Palindromic Substring |
| 647 | Palindromic Substrings |
| 10 | Regex Matching (hard) |

**Level 5 — LIS & advanced**
| # | Problem |
|---|---|
| 300 | LIS |
| 673 | Number of LIS |
| 152 | Max Product Subarray |
| 309/714 | Stock with Cooldown / Fee |

---
Agla: [13-greedy-intervals.md](13-greedy-intervals.md)
