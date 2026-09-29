# Bit Manipulation — Problem Set

---

## Core (Day 28)

### 1. Single Number 🟢
[LeetCode 136](https://leetcode.com/problems/single-number/)
- **Nudge:** XOR everything. Pairs cancel.
- Say out loud the three XOR properties that make this work.

### 2. Number of 1 Bits 🟢
[LeetCode 191](https://leetcode.com/problems/number-of-1-bits/)
- **Nudge:** `n &= n - 1` clears the lowest set bit. Loop once per set bit, not once per bit.

### 3. Counting Bits 🟢
[LeetCode 338](https://leetcode.com/problems/counting-bits/)
- **Nudge:** `dp[i] = dp[i >> 1] + (i & 1)`. A DP where the subproblem is "the same number, one bit
  smaller".

### 4. Reverse Bits 🟢
[LeetCode 190](https://leetcode.com/problems/reverse-bits/)
- **Nudge:** shift the result left, shift the input right, OR the extracted bit in. 32 iterations.

### 5. Missing Number 🟢
[LeetCode 268](https://leetcode.com/problems/missing-number/)
- **Nudge:** XOR the indices with the values. Or `n(n+1)/2 - sum(nums)`. Know both, and know why XOR
  is safer with fixed-width ints.

### 6. Sum of Two Integers 🟡
[LeetCode 371](https://leetcode.com/problems/sum-of-two-integers/)
- **Nudge:** XOR = sum without carry; `(a & b) << 1` = the carry. Loop until no carry remains.
- ⚠ In Python you must mask to 32 bits and reinterpret the sign. Timebox this to 30 minutes — the
  *idea* is the point, not fighting Python's big integers.

---

## Extension

### 7. Power of Two 🟢
[LeetCode 231](https://leetcode.com/problems/power-of-two/)
- **Nudge:** `n > 0 and n & (n - 1) == 0`. Watch the parentheses.

### 8. Single Number II 🟡
[LeetCode 137](https://leetcode.com/problems/single-number-ii/)
- **Nudge:** every element appears three times except one. XOR won't work — instead, count each bit
  position mod 3.
- Then look up the two-variable state-machine solution. It's elegant and worth seeing once.

### 9. Single Number III 🟡
[LeetCode 260](https://leetcode.com/problems/single-number-iii/)
- **Nudge:** XOR everything to get `a ^ b`. Isolate any differing bit with `x & -x`, then split the
  array into two groups and solve each as LC 136.
- ⭐ The best "divide the problem by a bit" exercise.

### 10. Reverse Integer 🟡
[LeetCode 7](https://leetcode.com/problems/reverse-integer/)
- Not really bit manipulation, but it lives in the same "watch for 32-bit overflow" family.
- **Trap:** Python's `//` floors toward −∞. Use `int(x / 10)` for C-style truncation.

### 11. Subsets (bitmask version) 🟡
[LeetCode 78](https://leetcode.com/problems/subsets/)
- **Nudge:** iterate `mask` over `range(1 << n)`; bit `i` set means include `nums[i]`.
- Compare with the backtracking version from Day 18.

### 12. Maximum XOR of Two Numbers in an Array 🟡
[LeetCode 421](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/)
- **Nudge:** build a **binary trie** of the numbers, then for each number greedily walk the opposite
  bit at every level to maximise the XOR.
- ⭐ A great combination of tries and bits. Attempt on a review day.

### 13. Bitwise AND of Numbers Range 🟡
[LeetCode 201](https://leetcode.com/problems/bitwise-and-of-numbers-range/)
- **Nudge:** the answer is the **common binary prefix** of `left` and `right`. Any bit that changes
  anywhere in the range gets zeroed.

### 14. Divide Two Integers 🟡
[LeetCode 29](https://leetcode.com/problems/divide-two-integers/)
- **Nudge:** repeated subtraction is too slow. Double the divisor with shifts (binary long division).

---

## Self-check

1. State the three XOR properties. What do they let you do?
2. What does `x & (x - 1)` do? What does `x & -x` do?
3. How do you check for a power of two? What edge case must you guard?
4. Why does `x & 1 == 0` not do what it looks like in Python?
5. How would you enumerate all subsets of a 15-element list with bitmasks?
6. What constraint on `n` tells you a problem wants bitmask DP?
