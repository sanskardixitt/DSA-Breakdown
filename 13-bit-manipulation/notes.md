# Bit Manipulation — Notes

A small topic with a high recognition payoff: the problems are easy *once you know the trick*, and
nearly impossible if you don't. So this is mostly a list of tricks worth memorising.

---

## The operators

| Op | Name | Example | Result |
|---|---|---|---|
| `&` | AND | `0b1100 & 0b1010` | `0b1000` |
| `\|` | OR | `0b1100 \| 0b1010` | `0b1110` |
| `^` | XOR | `0b1100 ^ 0b1010` | `0b0110` |
| `~` | NOT | `~5` | `-6` (two's complement) |
| `<<` | left shift | `1 << 3` | `8` (× 2³) |
| `>>` | right shift | `16 >> 2` | `4` (÷ 2²) |

---

## XOR — the star of this topic

**The three properties that solve almost every XOR problem:**

```
x ^ x = 0          ← a value cancels itself
x ^ 0 = x          ← 0 is the identity
XOR is commutative and associative  ← order doesn't matter
```

**Together they mean:** XOR everything, and anything appearing an **even** number of times vanishes.

```python
# Single Number: every element appears twice except one
def single_number(nums):
    res = 0
    for x in nums:
        res ^= x
    return res            # the pairs cancel; the loner survives
```
**O(n) time, O(1) space.** One line of logic, no hash set.

### Missing Number
```python
def missing_number(nums):
    res = len(nums)
    for i, x in enumerate(nums):
        res ^= i ^ x      # each present index cancels its value; the missing one survives
    return res
```
> Also solvable with the sum formula `n(n+1)/2 - sum(nums)` — but XOR can't overflow, which matters
> in languages with fixed-width ints. Mention both.

### Single Number III (two loners)
```python
def single_number_iii(nums):
    xor_all = 0
    for x in nums:
        xor_all ^= x                    # = a ^ b, where a and b are the two loners

    diff_bit = xor_all & -xor_all       # ⭐ isolate the lowest set bit — a and b differ there

    a = b = 0
    for x in nums:
        if x & diff_bit: a ^= x         # partition into two groups by that bit
        else:            b ^= x
    return [a, b]
```
> **The technique — "find a bit where the two answers differ, then split the problem in two"** — is
> the clever step here. Every duplicate pair lands in the same group (identical numbers have identical
> bits), so each group reduces to Single Number.

---

## The essential tricks (memorise these)

```python
x & 1                    # is x odd?
x >> 1                   # x // 2
x << 1                   # x * 2

x & (x - 1)              # ⭐ clear the LOWEST set bit
x & -x                   # ⭐ isolate the LOWEST set bit
x | (x + 1)              # set the lowest zero bit

x & (1 << i)             # is bit i set?
x | (1 << i)             # set bit i
x & ~(1 << i)            # clear bit i
x ^ (1 << i)             # toggle bit i

x & (x - 1) == 0         # ⭐ is x a power of two? (for x > 0)

bin(x).count('1')        # popcount, Python
x.bit_count()            # Python 3.10+
x.bit_length()           # number of bits needed
```

### `x & (x - 1)` — why it clears the lowest set bit

```
x     = 0b101100
x - 1 = 0b101011        ← the lowest 1 becomes 0, everything below flips to 1
x & (x-1) = 0b101000    ← the lowest 1 is gone
```

**This gives Brian Kernighan's popcount**, which loops once per *set* bit instead of once per bit:
```python
def count_bits(x):
    count = 0
    while x:
        x &= x - 1       # remove one set bit per iteration
        count += 1
    return count
```

### `x & -x` — why it isolates the lowest set bit

In two's complement, `-x == ~x + 1`. Flipping all bits and adding one leaves everything below the
lowest set bit as 0, the lowest set bit as 1, and everything above inverted. ANDing with `x` keeps
only that one bit.

Used in Single Number III, and it's the core of the **Fenwick tree / Binary Indexed Tree**.

---

## Recognition triggers

| Statement says... | Trick |
|---|---|
| "every element appears **twice** except one" | XOR everything |
| "**missing** number in `0..n`" | XOR, or the sum formula |
| "count the **1 bits**" / "Hamming weight" | `x & (x-1)` loop |
| "is it a **power of two**" | `x > 0 and x & (x-1) == 0` |
| "**without using `+` or `-`**" | XOR (sum) + AND<<1 (carry) |
| "**reverse** the bits" | shift out of one, shift into the other |
| "**subsets** of a set, n ≤ 20" | bitmask enumeration `range(1 << n)` |
| "all **XOR** / **AND** / **OR** of subarrays" | bit-by-bit contribution counting |
| "swap two variables without a temp" | `a ^= b; b ^= a; a ^= b` |

---

## Counting Bits (LC 338) — the DP

> For every `i` in `0..n`, count its set bits. O(n) total.

```python
def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)     # bits of (i//2), plus the last bit
    return dp
```
Alternatively `dp[i] = dp[i & (i-1)] + 1` — "one more bit than i with its lowest bit removed."

> **The insight:** `i >> 1` is a *strictly smaller* number, so its answer is already computed. Bit
> problems often have this structure — DP where the subproblem is "the same number with one bit
> removed."

---

## Sum of Two Integers (LC 371) — addition without `+`

```
XOR  = addition WITHOUT carries
AND << 1 = the carries
```

```python
def get_sum(a, b):
    MASK = 0xFFFFFFFF
    MAX_INT = 0x7FFFFFFF

    while b & MASK:                       # while there are still carries
        a, b = (a ^ b) & MASK, ((a & b) << 1) & MASK

    a &= MASK
    return a if a <= MAX_INT else ~(a ^ MASK)     # convert back to a negative Python int
```

> ⚠ **Python's arbitrary-precision integers make this awkward.** There's no natural 32-bit overflow,
> so a negative result never emerges on its own — you have to mask to 32 bits and manually reinterpret
> the sign at the end. In C++/Java the loop alone suffices.
>
> This is worth knowing as a curiosity, but don't spend an hour on it. The *idea* (XOR = sum without
> carry, AND<<1 = carry) is the transferable part.

---

## Bitmasks as sets ⭐

When `n ≤ 20`, a subset of `n` items fits in one integer. Bit `i` set means "item `i` is included."

```python
# Enumerate all subsets of an n-element list
for mask in range(1 << n):
    subset = [items[i] for i in range(n) if mask >> i & 1]

# Common operations
mask | (1 << i)              # add item i
mask & ~(1 << i)             # remove item i
mask & (1 << i)              # is item i in the set?
mask == (1 << n) - 1         # is the set full?
bin(mask).count('1')         # set size

# Enumerate all SUBMASKS of a mask (a genuinely useful trick)
sub = mask
while sub:
    # ... process sub ...
    sub = (sub - 1) & mask
```

**This is the foundation of bitmask DP** — `dp[mask]` = the answer for the subset represented by
`mask`. It's how Travelling Salesman, Partition to K Equal Sum Subsets, and Shortest Path Visiting
All Nodes are solved.

> **The `n ≤ 20` constraint is the giveaway.** `2²⁰ ≈ 10⁶` states is comfortable; `2²⁵` is not. When
> you see a tiny `n` alongside "subsets" or "visit all", think bitmask.

---

## Two's complement (the background you need)

Negative numbers are stored as `~x + 1`:
```
 5 = 0b0000...0101
-5 = 0b1111...1011      (flip all bits, add 1)
```

Consequences:
- The leading bit is the sign bit.
- `~x == -x - 1`
- `x >> 1` on a negative number is **arithmetic** (sign-extending), not logical.
- **Python ints are unbounded**, so `~5 == -6` and there's no overflow. For 32-bit problems you must
  mask explicitly with `0xFFFFFFFF`.

---

## Traps

- **Operator precedence.** `&`, `|`, `^` bind **looser** than `==` in Python. `x & 1 == 0` parses as
  `x & (1 == 0)`. **Always parenthesise:** `(x & 1) == 0`. This is the #1 bit-manipulation bug.
- Forgetting Python's unbounded integers when a problem assumes 32-bit wraparound.
- `x & (x-1) == 0` returns `True` for `x = 0`. Guard with `x > 0`.
- Using `>>` on negative numbers and expecting a logical shift.
- Off-by-one when a problem indexes bits from 1 instead of 0.
