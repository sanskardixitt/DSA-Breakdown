# Arrays & Hashing — Problem Set

Solve in this order. Don't skip the easies — they build the reflex.
Read the **Nudge** only after 10 minutes of genuine thinking.

---

## Core (Days 2–3)

### 1. Contains Duplicate 🟢
[LeetCode 217](https://leetcode.com/problems/contains-duplicate/)
- **Pattern:** hash set
- **Nudge:** one pass, one set. Or compare `len(set(nums))` to `len(nums)`.
- **Learn:** the set-vs-list `in` complexity difference. Say both out loud.

### 2. Valid Anagram 🟢
[LeetCode 242](https://leetcode.com/problems/valid-anagram/)
- **Pattern:** frequency count
- **Nudge:** `Counter(s) == Counter(t)`. Then write the 26-array version by hand.
- **Follow-up to answer:** what if the input is Unicode? (→ use a dict, not a 26-array.)

### 3. Two Sum 🟢
[LeetCode 1](https://leetcode.com/problems/two-sum/)
- **Pattern:** complement lookup
- **Nudge:** don't search forward for the partner. Register yourself and let a later element find you.
- **Trap:** check `need in seen` *before* inserting the current value.

### 4. Group Anagrams 🟡
[LeetCode 49](https://leetcode.com/problems/group-anagrams/)
- **Pattern:** grouping by canonical key
- **Nudge:** what fingerprint do all anagrams of a word share?
- **Do both:** `tuple(sorted(w))` (O(nk log k)) and the 26-count tuple (O(nk)).

### 5. Top K Frequent Elements 🟡
[LeetCode 347](https://leetcode.com/problems/top-k-frequent-elements/)
- **Pattern:** counting + bucket sort
- **Nudge:** a frequency can't exceed `n`. So you can *index* by frequency instead of sorting by it.
- **Say the complexities:** heap O(n log k) vs bucket O(n).

### 6. Product of Array Except Self 🟡
[LeetCode 238](https://leetcode.com/problems/product-of-array-except-self/)
- **Pattern:** prefix + suffix sweeps
- **Nudge:** `out[i] = (everything left) × (everything right)`. Two passes, reuse the output array.
- **Trap:** don't special-case zeros — the two-pass method handles them naturally.

### 7. Subarray Sum Equals K 🟡
[LeetCode 560](https://leetcode.com/problems/subarray-sum-equals-k/)
- **Pattern:** prefix sum + hash map
- **Nudge:** `P[j] - P[i] = k` ⟺ `P[i] = P[j] - k`. It's Two Sum on prefix sums.
- **Trap:** `count[0] = 1`. Do not forget it.
- ⭐ **Do this one twice.** It's the gateway to a dozen other problems.

### 8. Longest Consecutive Sequence 🟡
[LeetCode 128](https://leetcode.com/problems/longest-consecutive-sequence/)
- **Pattern:** hash set + "only start from a run start"
- **Nudge:** sorting is O(n log n) and the problem demands O(n). What makes a number the *beginning*
  of a consecutive run?
- **Insight to internalise:** the "only process from the canonical start" idea that makes this linear.

---

## Extension (do after Day 3, or on review days)

### 9. Valid Sudoku 🟡
[LeetCode 36](https://leetcode.com/problems/valid-sudoku/)
- **Nudge:** three `defaultdict(set)` — rows, cols, boxes. Box key is `(r//3, c//3)`.

### 10. Encode and Decode Strings 🟡
[LeetCode 271](https://leetcode.com/problems/encode-and-decode-strings/) *(premium — also on NeetCode)*
- **Nudge:** you can't use a delimiter, because any delimiter could appear in the data.
  Use a length prefix: `"4#abcd3#xyz"`.

### 11. Contiguous Array 🟡
[LeetCode 525](https://leetcode.com/problems/contiguous-array/)
- **Pattern:** prefix sum with a remap
- **Nudge:** map `0 → -1`. Now "equal counts of 0 and 1" means "sum is zero", i.e. two equal prefix sums.

### 12. Subarray Sums Divisible by K 🟡
[LeetCode 974](https://leetcode.com/problems/subarray-sums-divisible-by-k/)
- **Nudge:** key the hash map on `running % k`, not on `running`.

### 13. Sort Colors 🟡
[LeetCode 75](https://leetcode.com/problems/sort-colors/)
- **Pattern:** Dutch national flag / three pointers
- **Nudge:** `low`, `mid`, `high`. Swap 0s to the front, 2s to the back, leave 1s alone. One pass.
- **Trap:** when you swap with `high`, do **not** advance `mid` — you haven't examined the new value yet.

### 14. Find All Numbers Disappeared in an Array 🟢
[LeetCode 448](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/)
- **Pattern:** index-as-hash
- **Nudge:** values are in `[1, n]`. Use the sign of `nums[v-1]` as a "seen" flag. O(1) space.

### 15. First Missing Positive 🔴
[LeetCode 41](https://leetcode.com/problems/first-missing-positive/)
- **Pattern:** index-as-hash, cyclic sort
- **Nudge:** the answer is always in `[1, n+1]`. Place each value `v` at index `v-1` by swapping,
  then scan for the first mismatch.
- Attempt after Day 7. This is a genuinely hard one; the *idea* matters more than finishing it.

---

## Self-check before moving on

You should be able to answer these without looking:

1. Why is `x in set` O(1) but `x in list` O(n)?
2. In Subarray Sum Equals K, what does `count[0] = 1` represent, and what breaks without it?
3. Why does Longest Consecutive Sequence stay O(n) despite having a nested `while` loop?
4. Given `nums` with negatives, and asked for the *longest subarray summing to k* — sliding window or
   prefix sum? Why?
5. What is the canonical key for grouping anagrams, and what's the complexity of each option?
