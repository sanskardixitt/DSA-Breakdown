# Two Pointers — Notes

Two indices moving through a structure under a rule. It's the cheapest way to kill a nested loop:
**O(n²) → O(n), with O(1) space.**

---

## Why it works (the part that makes it click)

A nested loop examines all n² pairs. Two pointers examines only ~n of them — and is still correct
**because each pointer move eliminates a whole set of pairs at once.**

Take Two Sum on a **sorted** array with `left = 0`, `right = n-1`:

```
[1, 3, 5, 8, 11],  target = 14
 L           R      sum = 12 < 14
```
`12 < 14`, so we need a bigger sum. Look at what that tells us: **every pair using `L=0` is at most
`arr[0] + arr[4] = 12`**, because `arr[4]` is the largest available partner. So *no pair involving
index 0 can ever reach 14*. We can discard all four of them in one move: `L += 1`.

That's the whole magic. **Each move eliminates an entire row or column of the pair matrix.** n moves,
n² pairs eliminated.

> **The precondition is monotonicity.** Two pointers is valid only when moving a pointer changes the
> quantity you're tracking in a *predictable direction*. On a sorted array, moving `L` right always
> increases the sum. Break that guarantee (unsorted input) and the technique is simply wrong.

---

## The three shapes

### 1. Opposite ends (converging)
```
[ · · · · · · · · ]
  L →         ← R
```
Start at both ends, move inward. **Requires sorted input** (or a symmetric property like palindromes).
→ [pattern-opposite-ends.md](pattern-opposite-ends.md)

**Use for:** pair sums, palindromes, container with most water, trapping rain water, reversing in place.

---

### 2. Same direction (fast & slow / read & write)
```
[ · · · · · · · · ]
  slow    fast →
```
Both move left-to-right, at different rates or under different conditions.

**Use for:** in-place removal/dedup, cycle detection, "find the middle", nth-from-end.
→ [pattern-fast-slow.md](pattern-fast-slow.md)

The **read/write** variant is the workhorse for in-place array editing:
```python
# Remove all occurrences of `val`, in place, return new length
write = 0
for read in range(len(nums)):
    if nums[read] != val:
        nums[write] = nums[read]
        write += 1
return write
```
> Mental model: `read` is the scanner, `write` marks the boundary of the "kept" prefix.
> **Invariant:** `nums[0:write]` always holds exactly the kept elements, in order.

---

### 3. Two arrays (merge-style)
```
A: [ · · · · ]     B: [ · · · · ]
     i →                j →
```
One pointer per array, advance whichever is behind.

**Use for:** merging sorted arrays/lists, intersection of two arrays, "is s a subsequence of t".

```python
def is_subsequence(s, t):
    i = 0
    for c in t:
        if i < len(s) and s[i] == c:
            i += 1
    return i == len(s)
```

---

## Recognition triggers

| Statement says... | Two-pointer shape |
|---|---|
| "sorted array" + "find a pair/triplet" | Opposite ends |
| "palindrome" | Opposite ends |
| "in place" / "O(1) extra space" | Read/write same direction |
| "remove duplicates from sorted array" | Read/write |
| "cycle in a linked list" | Fast/slow (Floyd) |
| "middle of the linked list" | Fast/slow (fast moves 2×) |
| "nth node from the end" | Two pointers, gap of n |
| "merge two sorted..." | Two arrays |
| "container", "area between two lines" | Opposite ends, greedy shrink |
| "is s a subsequence of t" | Two arrays |

---

## Sliding window is two pointers

A sliding window *is* a same-direction two-pointer where the pointers bound a range you care about.
The difference is bookkeeping: a window maintains **state about the elements between the pointers**
(a sum, a counter, a set). Plain two pointers usually doesn't.

That's why [03-sliding-window/](../03-sliding-window/) is a separate folder — the state management is
the actual skill there.

---

## Traps

```python
# ❌ INFINITE LOOP — forgot to move a pointer on one branch
while l < r:
    if arr[l] + arr[r] == t: return [l, r]
    elif arr[l] + arr[r] < t: l += 1
    # missing: else: r -= 1

# ❌ Two pointers on an UNSORTED array for a pair sum. Just wrong. Use a hash map.

# ❌ `while l <= r` when the two pointers must be distinct elements
#    (a pair needs l < r; l == r would use the same element twice)

# ⚠ Duplicate skipping in 3Sum — easy to get the direction wrong:
while l < r and nums[l] == nums[l-1]: l += 1      # ✅ after a successful move
```

**Off-by-one discipline:** before coding, write down the loop condition and *why*.
- Need two distinct elements → `while l < r`
- Palindrome check → `while l < r` (middle char needs no partner)
- Scanning to the end → `while l <= r`

---

## Files here

- [pattern-opposite-ends.md](pattern-opposite-ends.md)
- [pattern-fast-slow.md](pattern-fast-slow.md)
- [problems.md](problems.md)
