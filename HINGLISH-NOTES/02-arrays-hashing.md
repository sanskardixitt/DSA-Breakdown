# 02 — Arrays & Hashing

> **Ek line ka funda:** *"Kya main koi cheez dobara dhoondh raha hoon?"*
> Agar haan → HashMap. Bas. Ye 30% problems solve kar deta hai.

---

## Trigger words — ye dikhe to HashMap socho

- "duplicate hai kya", "unique", "kitni baar aaya"
- "do elements ka sum target ke barabar"
- "anagram", "same characters"
- "seen before", "pehle dekha tha kya"
- "group karo by kuch"

---

## Pattern A — HashMap = "pehle dekha tha kya?"

### Diagram: Two Sum ka asli funda

Log sochte hain "do numbers dhoondho jinka sum target ho". Galat soch.
**Sahi soch:** har number pe poocho — *"mera partner (target - num) pehle aa chuka hai?"*

```
arr = [2, 7, 11, 15],  target = 9

i=0, num=2   partner = 9-2 = 7    map me 7 hai? NAHI  ->  map me daalo {2:0}
i=1, num=7   partner = 9-7 = 2    map me 2 hai? HAAN! ->  answer [0, 1] ✅
                                       ^
                                       |
                            +----------+----------+
                            |  map = { 2 -> 0 }   |
                            +---------------------+
```

Ek hi pass. O(n). Kyunki **"dhoondhna" ka kaam map ne O(1) me kar diya**.

```js
function twoSum(nums, target) {
  const seen = new Map();              // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);              // ⚠️ check ke BAAD daalo (warna khud se pair ban jaayega)
  }
  return [];
}
```

> **Trick:** `seen.set()` hamesha check ke **baad**. Warna `target = 6, nums=[3,...]`
> me 3 apne aap se pair bana lega. Ye classic bug hai.

---

## Pattern B — Frequency counting

```js
const freq = new Map();
for (const ch of s) freq.set(ch, (freq.get(ch) || 0) + 1);
//                              ^^^^^^^^^^^^^^^^^^^^ ye " || 0 " idiom yaad kar lo
```

**Anagram check** — do tareeke:
```js
// Tareeka 1: sort karke compare — O(n log n), likhne me 1 line
const isAnagram = (s, t) => [...s].sort().join('') === [...t].sort().join('');

// Tareeka 2: freq count — O(n), interview me YE bolo
function isAnagram(s, t) {
  if (s.length !== t.length) return false;      // ⚠️ ye guard sabse pehle
  const count = new Map();
  for (const c of s) count.set(c, (count.get(c) || 0) + 1);
  for (const c of t) {
    if (!count.get(c)) return false;            // 0 ya undefined dono falsy — smart
    count.set(c, count.get(c) - 1);
  }
  return true;
}
```

**Group Anagrams ka trick:** har word ka *signature* banao (sorted letters), usko key banao.
```js
function groupAnagrams(strs) {
  const groups = new Map();
  for (const w of strs) {
    const key = [...w].sort().join('');          // signature
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}
```
> **Generalize karo:** "group by X" wali har problem = *X ka signature banao, wahi map key hai*.

---

## Pattern C — Prefix Sum (range sums ka baap)

### Kab: "subarray ka sum" dikhe aur baar-baar sum poocha jaa raha ho

```
arr    =  [ 2,  4,  1,  7,  3 ]
prefix = [0, 2,  6,  7, 14, 17]     prefix[i] = pehle i elements ka sum
          ^
       dummy 0  <-- ye 0 ZAROORI hai, warna i=0 pe formula toot jaayega

sum(i..j)  =  prefix[j+1] - prefix[i]

sum(1..3) = arr[1]+arr[2]+arr[3] = 4+1+7 = 12
          = prefix[4] - prefix[1] = 14 - 2 = 12   ✅
```

```js
const prefix = [0];
for (const x of arr) prefix.push(prefix[prefix.length - 1] + x);
```

### 🔥 Prefix Sum + HashMap = "kitne subarrays ka sum k hai" (LC 560)

Ye combo bahut aata hai. Funda:

```
Agar  prefix[j] - prefix[i] = k
to    prefix[i] = prefix[j] - k

Matlab: har position j pe poocho —
"kya pehle koi aisa prefix tha jo (currentSum - k) ke barabar ho?"
                                  ^^^^^^^^^^^^^^^^ bilkul Two Sum wali soch!
```

```js
function subarraySum(nums, k) {
  const count = new Map([[0, 1]]);   // ⚠️ {0:1} = "khaali prefix" — isse bhoolna sabse common bug
  let sum = 0, res = 0;
  for (const n of nums) {
    sum += n;
    res += count.get(sum - k) || 0;               // pehle count karo
    count.set(sum, (count.get(sum) || 0) + 1);    // fir apna prefix daalo
  }
  return res;
}
```
> **`new Map([[0,1]])` kyun?** Agar subarray shuru se hi start hota hai (`sum === k`),
> to `sum - k = 0` chahiye map me. Isko bhoolne pe aadhe test case fail hote hain.

---

## Pattern D — Prefix + Suffix product (LC 238, division allowed nahi)

```
nums   = [1,  2,  3,  4]

left   = [1,  1,  2,  6]     left[i]  = i se pehle sab ka product
right  = [24, 12, 4,  1]     right[i] = i ke baad sab ka product

ans[i] = left[i] * right[i]
ans    = [24, 12, 8,  6]
```

```js
function productExceptSelf(nums) {
  const n = nums.length, res = new Array(n).fill(1);
  let pre = 1;
  for (let i = 0; i < n; i++) { res[i] = pre; pre *= nums[i]; }   // left pass
  let suf = 1;
  for (let i = n - 1; i >= 0; i--) { res[i] *= suf; suf *= nums[i]; }  // right pass
  return res;
}
```
> **Generalize:** "har index pe, baaki sab ka kuch" → **do pass: left se ek, right se ek.**
> Ye idea trapping-rain-water me bhi wahi hai.

---

## Pattern E — Set se O(n) sequence (LC 128 Longest Consecutive)

**Naive:** sort karo → O(n log n). **Trick:** Set + sirf sequence ke *start* se chalo.

```
nums = [100, 4, 200, 1, 3, 2]
set  = {100, 4, 200, 1, 3, 2}

har num pe poocho: kya (num-1) set me hai?
  100 -> 99 nahi hai   -> ye START hai -> aage chalo: 101? nahi. length 1
    4 ->  3 HAI        -> ye start nahi -> SKIP (fizul kaam nahi)
    1 ->  0 nahi hai   -> START -> 2✓ 3✓ 4✓ 5✗  -> length 4  ✅
```

```js
function longestConsecutive(nums) {
  const s = new Set(nums);
  let best = 0;
  for (const n of s) {
    if (s.has(n - 1)) continue;        // 🔑 sirf sequence ke start se chalo
    let len = 1;
    while (s.has(n + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}
```
> **"Andar while loop hai to O(n²) nahi?"** — Nahi. Har number sirf **ek** sequence
> ka hissa hai, isliye total inner steps ≤ n. **Amortized O(n).** Ye line interview me bolo.

---

## ⚠️ Common galtiyan

| Galti | Fix |
|---|---|
| `seen.set()` check se pehle | Hamesha check → phir set |
| Prefix map me `{0:1}` bhoolna | Shuru se start hone wale subarray fail |
| `arr.includes()` loop ke andar | O(n²) ban gaya — Set use karo |
| `new Map()` vs `{}` | Map me koi bhi key ho sakti hai + insertion order + `.size`. **Map prefer karo** |
| `sort()` bina comparator | JS strings me sort karta hai! `[10,9].sort()` → `[10,9]` 😱. `sort((a,b)=>a-b)` likho |

---

## Problems (isi order me)

| # | Problem | Kya seekhoge |
|---|---|---|
| 217 | Contains Duplicate | Set basics |
| 242 | Valid Anagram | Frequency map |
| 1 | Two Sum | "partner dekha kya" soch |
| 49 | Group Anagrams | Signature key |
| 347 | Top K Frequent | Freq + bucket sort |
| 238 | Product Except Self | Left-right pass |
| 560 | Subarray Sum = K | **Prefix + map (must do)** |
| 128 | Longest Consecutive | Set + start check |

---
Agla: [03-two-pointers.md](03-two-pointers.md)
