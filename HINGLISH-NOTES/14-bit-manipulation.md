# 14 — Bit Manipulation

> **Ek line ka funda:** *Number ko switches ki line samjho — har bit ON ya OFF.
> XOR sabse jaadui operator hai: **"same cheez do baar = gayab"**.*

---

## Basics — 5 operators

```
  a = 5  =  0101
  b = 3  =  0011

  a & b  (AND)  = 0001 = 1     dono 1 ho tab 1
  a | b  (OR)   = 0111 = 7     koi ek 1 ho to 1
  a ^ b  (XOR)  = 0110 = 6     ALAG ho to 1   <- ye asli hero hai
  ~a     (NOT)  = 1010 = -6    sab ulta
  a << 1        = 1010 = 10    left shift  = × 2
  a >> 1        = 0010 = 2     right shift = ÷ 2 (floor)
```

---

## XOR ke 4 jaadui rules (ye ratt lo)

```
1.  x ^ 0 = x            0 se XOR = kuch nahi badla
2.  x ^ x = 0            KHUD SE XOR = 0  <-- ye sabse kaam ka
3.  x ^ y = y ^ x        order maayne nahi rakhta
4. (x^y)^z = x^(y^z)     grouping maayne nahi rakhti

Rule 2 + 3 ka combo = "jodi wale gayab, akela bacha"
```

### Single Number (LC 136) — poore array me ek hi akela

```
nums = [4, 1, 2, 1, 2]

4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1^1) ^ (2^2)      <- reorder kar sakte hain (rule 3)
= 4 ^ 0 ^ 0
= 4  ✅

O(n) time, O(1) space. HashMap ki zaroorat hi nahi!
```

```js
const singleNumber = (nums) => nums.reduce((a, b) => a ^ b, 0);
```

### Missing Number (LC 268) — same trick

```js
function missingNumber(nums) {
  let x = nums.length;
  for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i];
  return x;
}
```
```
[0,1,3], n=3

Sab indices (0,1,2,3) XOR sab values (0,1,3)
= (0^0) ^ (1^1) ^ (3^3) ^ 2 = 2  ✅
```

### Swap without temp
```js
a ^= b; b ^= a; a ^= b;      // cute hai, par production me MAT likhna
[a, b] = [b, a];             // ✅ ye likho — readable
```

---

## Bit operations ki cheat sheet

```js
// i-th bit CHECK karo (0-indexed, right se)
(n >> i) & 1                 // ya:  n & (1 << i)

// i-th bit SET karo (0 -> 1)
n | (1 << i)

// i-th bit CLEAR karo (1 -> 0)
n & ~(1 << i)

// i-th bit TOGGLE karo
n ^ (1 << i)

// SABSE RIGHT ka set bit nikaalo (isolate)
n & (-n)                     // 12 (1100) -> 4 (0100)

// SABSE RIGHT ka set bit HATAO  🔥
n & (n - 1)                  // 12 (1100) -> 8 (1000)

// Power of 2 hai kya?
n > 0 && (n & (n - 1)) === 0

// Even / Odd
(n & 1) === 0                // even
```

### `n & (n-1)` ka jaadu — diagram se

```
n     = 12 = 1100
n - 1 = 11 = 1011
              ^^^^  sabse right ka 1 aur uske baad sab flip ho gaye
n & (n-1)  =  1000 = 8

Matlab: ek operation me SABSE RIGHT ka set bit gayab.
```

### Count set bits — Brian Kernighan's algorithm

```js
function hammingWeight(n) {
  let count = 0;
  while (n) { n &= n - 1; count++; }      // har step me EK set bit hatao
  return count;
}
```
```
Naive: 32 iterations (har bit check karo)
Ye:    sirf utne iterations jitne SET BITS hain 🔥

n = 8 (1000) -> sirf 1 iteration, na ki 32
```

---

## Counting Bits (LC 338) — DP + bits ka combo

"0 se n tak har number ke set bits count karo."

```js
function countBits(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);
  //                                   ^^^^^^^^^   ^^^^^^^
  //                            aadha number ka count + last bit
  return dp;
}
```
```
i = 5 = 101
i >> 1 = 2 = 10    (dp[2] = 1)
i & 1  = 1         (last bit)
dp[5]  = 1 + 1 = 2  ✅

Ya doosra tareeka:  dp[i] = dp[i & (i-1)] + 1
```

---

## BITMASK — subsets ko number me store karna 🔥

### Kab: `n ≤ 20` aur "sab subsets" chahiye

```
n = 3 elements  ->  2^3 = 8 subsets  ->  numbers 0 se 7

mask   binary   subset
  0     000     {}
  1     001     {a}
  2     010     {b}
  3     011     {a,b}
  4     100     {c}
  5     101     {a,c}
  6     110     {b,c}
  7     111     {a,b,c}

Har BIT = "ye element liya ya nahi"
```

### Subsets bina recursion ke

```js
function subsets(nums) {
  const n = nums.length, res = [];
  for (let mask = 0; mask < (1 << n); mask++) {      // 1<<n = 2^n
    const sub = [];
    for (let i = 0; i < n; i++)
      if (mask & (1 << i)) sub.push(nums[i]);        // i-th bit set hai? -> lo
    res.push(sub);
  }
  return res;
}
```
> Backtracking se chhota hai. Interview me bolo:
> *"n chhota hai (≤20), toh bitmask enumeration se bhi kar sakte hain — 2^n masks."*

### Bitmask ke useful idioms

```js
1 << n              // 2^n  (total subsets)
mask & (1 << i)     // i-th element subset me hai?
mask | (1 << i)     // i-th element add karo
mask & ~(1 << i)    // i-th element hatao
mask === (1 << n)-1 // saare elements le liye (full mask)

// mask ke SAARE submasks pe iterate karo (advanced, TSP-type DP me)
for (let sub = mask; sub > 0; sub = (sub - 1) & mask) { ... }
```

---

## ⚠️ JavaScript ke bitwise TRAPS (ye zaroori hai)

```js
// 1. Bitwise operators 32-bit SIGNED integers pe kaam karte hain
1 << 31              // -2147483648  (negative ho gaya! 💀)
1 << 32              // 1  (wrap around — 32 se zyada shift kaam nahi karta)

// 2. Bade numbers pe bitwise TOOT jaata hai
2 ** 40 | 0          // 0  (32-bit se bahar)

// 3. UNSIGNED right shift alag hai
-8 >> 1              // -4  (sign bit preserve)
-8 >>> 1             // 2147483644  (sign bit bhi shift)

// 4. Set bits count karte waqt negative se bacho
n >>> 1              // ✅ unsigned use karo
n >> 1               // ❌ negative pe infinite loop
```

> **Rule:** JS me bitwise sirf **32-bit range** ke andar use karo.
> Usse bade numbers ke liye `BigInt` (par uspe `<<` alag behave karta hai) ya arithmetic use karo.

---

## Bina + ke addition (LC 371) — classic puzzle

```js
function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;     // dono jagah 1 -> carry, ek left shift
    a = a ^ b;                      // XOR = carry ke bina sum
    b = carry;
  }
  return a;
}
```
```
a = 3 (011), b = 5 (101)

XOR   : 011 ^ 101 = 110  (sum without carry)
carry : (011 & 101) << 1 = 001 << 1 = 010

ab a=110, b=010
XOR   : 110 ^ 010 = 100
carry : (110 & 010) << 1 = 010 << 1 = 100

ab a=100, b=100
XOR   : 000
carry : 100 << 1 = 1000

ab a=000, b=1000
XOR   : 1000 = 8 ✅
carry : 0  -> loop khatam
```

---

## Kab bit manipulation socho

```
✅ Socho jab:
   - "O(1) extra space" maanga ho aur duplicates/missing wali problem ho
   - "har element do baar aata hai, ek nahi"
   - n <= 20 aur subsets chahiye
   - "without using + or -"
   - Power of 2 / 4 check
   - Flags / states ko compact store karna hai

❌ Mat socho jab:
   - Sirf "clever" dikhne ke liye. Readable code zyada important hai.
   - Numbers 2^31 se bade ho (JS me toot jaayega)
```

> **Industry reality:** production code me bit tricks kam hi likhte hain
> (readability > cleverness). Par **interview me** ye O(1) space wale solutions
> "is candidate ko fundamentals aate hain" ka signal dete hain.

---

## Problems

| # | Problem | Trick |
|---|---|---|
| 136 | Single Number | XOR pairing (start here) |
| 268 | Missing Number | XOR index+value |
| 191 | Number of 1 Bits | `n & (n-1)` |
| 338 | Counting Bits | DP + shift |
| 190 | Reverse Bits | Shift + build |
| 231 | Power of Two | `n & (n-1) === 0` |
| 371 | Sum of Two Integers | XOR + carry |
| 137 | Single Number II (3x) | Bit counting mod 3 |
| 260 | Single Number III (2 singles) | XOR + `n & -n` split |
| 78 | Subsets | Bitmask enumeration |
| 1863 | Sum of All Subset XORs | Bitmask |

---
Agla: [15-INTERVIEW-TRICKS.md](15-INTERVIEW-TRICKS.md)
