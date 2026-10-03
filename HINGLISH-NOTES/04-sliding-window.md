# 04 — Sliding Window

> **Ek line ka funda:** *Har baar naya window banane ki jagah, purane window ko
> thoda aage khisko do. Jo add hua wo jodo, jo nikla wo ghatao. O(n²) → O(n).*

---

## Trigger words (ye dikhe = window)

- "**contiguous** subarray / substring" ← ye sabse bada signal
- "longest / shortest ... **such that** ___"
- "**at most K** distinct / zeros / replacements"
- "**without repeating** characters"
- "size k ki har window"
- "**containing all** characters of T"

> ⚠️ **"subarray/substring" = contiguous = window.**
> **"subsequence" = non-contiguous = DP.** Ek shabd ka farak, pura pattern badal jaata hai.

---

## Do type: Fixed aur Variable

```
FIXED (size k pata hai)                VARIABLE (size hi answer hai)

 [--k--]                                [-----]        grow
   [--k--]      slide                   [-------]      grow
     [--k--]                              [-----]      shrink (invalid ho gaya)
                                            [------]   grow

 har baar: +new, -old                   right badhao, left tabhi jab zaroorat ho
```

---

## Type 1 — Fixed Window

```js
function maxSumWindow(arr, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i];      // pehla window banao
  let best = sum;
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];                   // naya jodo, purana ghatao
    best = Math.max(best, sum);
  }
  return best;
}
```

```
arr = [2, 1, 5, 1, 3, 2],  k = 3

[2 1 5] 1 3 2      sum = 8
 2[1 5 1]3 2       sum = 8 + 1 - 2 = 7
 2 1[5 1 3]2       sum = 7 + 3 - 1 = 9   <- best
 2 1 5[1 3 2]      sum = 9 + 2 - 5 = 6
```

Har element **ek baar add, ek baar remove**. Isliye O(n), na ki O(n·k).

---

## Type 2 — Variable Window (ye asli game hai)

**Iski do sub-shakalein hain, aur inme sirf EK LINE ki jagah ka farak hai.**
Yahi 90% confusion ka source hai.

### Shakal A — LONGEST valid window

```js
let left = 0, best = 0;
for (let right = 0; right < n; right++) {
  add(arr[right]);

  while (INVALID) {                          // jab tak galat hai, shrink karo
    remove(arr[left]); left++;
  }

  best = Math.max(best, right - left + 1);   // <-- while ke BAAHAR (yahan window valid hai)
}
```

### Shakal B — SHORTEST valid window

```js
let left = 0, best = Infinity;
for (let right = 0; right < n; right++) {
  add(arr[right]);

  while (VALID) {                            // jab tak sahi hai, aur chhota karo
    best = Math.min(best, right - left + 1); // <-- while ke ANDAR
    remove(arr[left]); left++;
  }
}
return best === Infinity ? 0 : best;
```

### Yaad rakhne ka tareeka

```
+---------------------------------------------------------------+
|  LONGEST  -> while (INVALID)  -> record BAAHAR                 |
|              "window kharab hai, THEEK karne ke liye shrink"   |
|                                                                |
|  SHORTEST -> while (VALID)    -> record ANDAR                  |
|              "window sahi hai, CHHOTA karne ke liye shrink"    |
+---------------------------------------------------------------+

Khud se poocho:
"Main shrink REPAIR karne ke liye kar raha hoon, ya MINIMIZE karne ke liye?"
```

---

## Example 1 — Longest Substring Without Repeating (LC 3) — Shakal A

```
s = "abcabcbb"

a          set{a}        len 1
ab         set{a,b}      len 2
abc        set{a,b,c}    len 3   <- best
abca  ->  a duplicate hai! shrink karo: pehla a hatao
 bca       set{b,c,a}    len 3
```

```js
function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {        // INVALID: duplicate
      seen.delete(s[left]); left++;
    }
    seen.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

---

## Example 2 — Minimum Size Subarray Sum >= target (LC 209) — Shakal B

```js
function minSubArrayLen(target, nums) {
  let left = 0, sum = 0, best = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {                        // VALID
      best = Math.min(best, right - left + 1);     // andar record
      sum -= nums[left]; left++;
    }
  }
  return best === Infinity ? 0 : best;
}
```

---

## Example 3 — Longest Repeating Char Replacement (LC 424) — sabse chalak trick

"At most k characters badal sakte ho, longest same-char substring nikalo."

```
Window valid hai jab:   (window length) - (sabse zyada frequency wala char) <= k
                         ^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                         total             jinko badalne ki zaroorat NAHI

Matlab: badalne wale characters = length - maxFreq
```

```js
function characterReplacement(s, k) {
  const count = new Map();
  let left = 0, maxFreq = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    count.set(s[right], (count.get(s[right]) || 0) + 1);
    maxFreq = Math.max(maxFreq, count.get(s[right]));

    while (right - left + 1 - maxFreq > k) {       // INVALID
      count.set(s[left], count.get(s[left]) - 1);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

> **Sawaal: maxFreq ko shrink pe kam kyun nahi karte?**
> Chalak jawab: humein sirf **best** chahiye. maxFreq purana ho bhi gaya to window
> tabhi badhega jab naya maxFreq actually bada ho. Answer galat nahi hota.
> Ye interview me bolne wali insight hai.

---

## Example 4 — "At most K distinct" ka universal template

```js
function longestKDistinct(s, k) {
  const count = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    count.set(s[right], (count.get(s[right]) || 0) + 1);

    while (count.size > k) {                      // INVALID: k se zyada distinct
      const c = s[left];
      count.set(c, count.get(c) - 1);
      if (count.get(c) === 0) count.delete(c);    // 0 hone pe DELETE, warna size galat
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

### Mega trick — "EXACTLY k" ko kaise solve karein

Directly exactly-k ke liye window nahi banta. **Subtraction trick:**

```
exactly(k)  =  atMost(k) - atMost(k-1)
```

LC 992 (Subarrays with K Different Integers) isi se solve hota hai.
Ye trick counting problems me baar-baar aata hai. **Yaad rakh lo.**

---

## Common galtiyan

| Galti | Fix |
|---|---|
| Length `right - left` likhna | `right - left + 1` (dono inclusive) |
| Shortest me record `while` ke baahar | Andar likho, warna minimum miss ho jaayega |
| Count 0 hone pe `delete` na karna | `map.size` galat aayega |
| Negative numbers pe window lagana | Window tabhi chalti hai jab sum **monotonic** ho. Negatives ho to **prefix sum + hashmap** |
| `while` ki jagah `if` | Kabhi-kabhi ek se zyada baar shrink karna padta hai |

> **Sabse bada gotcha:**
> "Sum >= target, sab positive" → window chalegi
> "Sum == k, negatives allowed" → window fail, prefix+map lagao

---

## Decision flow

```
"contiguous subarray/substring" dikha?
        |
        +-- size k fixed diya hai?  -----------> FIXED WINDOW
        |
        +-- "longest ... such that"  ----------> VARIABLE, Shakal A
        |
        +-- "shortest/minimum ... such that" --> VARIABLE, Shakal B
        |
        +-- "exactly k"  ----------------------> atMost(k) - atMost(k-1)
        |
        +-- negatives + exact sum  ------------> PREFIX SUM + HASHMAP (window nahi)
```

---

## Problems

| # | Problem | Shakal |
|---|---|---|
| 643 | Max Average Subarray I | Fixed |
| 3 | Longest Substring w/o Repeat | A (must do) |
| 209 | Min Size Subarray Sum | B |
| 424 | Longest Repeating Replacement | A (must do) |
| 1004 | Max Consecutive Ones III | A |
| 567 | Permutation in String | Fixed + freq match |
| 76 | Minimum Window Substring | B (hardest, must do) |
| 239 | Sliding Window Maximum | Fixed + monotonic deque |
| 992 | Subarrays with K Distinct | atMost trick |

---
Agla: [05-binary-search.md](05-binary-search.md)
