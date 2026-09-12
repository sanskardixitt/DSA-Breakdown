# Sliding Window — Problem Set

---

## Core (Days 5–6)

### 1. Best Time to Buy and Sell Stock 🟢
[LeetCode 121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
- **Nudge:** track the minimum price seen so far; profit today = `price - min_so_far`.
- Technically a one-pass scan rather than a true window, but it's the same "maintain state as you
  sweep" muscle. Good warm-up.

### 2. Longest Substring Without Repeating Characters 🟡
[LeetCode 3](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
- **Pattern:** Shape A (longest)
- **Nudge:** what makes a window invalid? A duplicate. So shrink until the duplicate is gone.
- **Do both:** the shrink-one-at-a-time version and the last-index jump version. Understand why the
  jump version needs the `>= left` guard.
- ⭐ Re-solve Day 6 and Day 15.

### 3. Longest Repeating Character Replacement 🟡
[LeetCode 424](https://leetcode.com/problems/longest-repeating-character-replacement/)
- **Nudge:** a window is valid when `length - max_freq <= k`. That single inequality *is* the problem.
- **Be ready to explain** why not decrementing `max_freq` on shrink is still correct.

### 4. Permutation in String 🟡
[LeetCode 567](https://leetcode.com/problems/permutation-in-string/)
- **Pattern:** fixed window (size = `len(s1)`)
- **Nudge:** "contains a permutation" = "some window has identical character frequencies".

### 5. Max Consecutive Ones III 🟡
[LeetCode 1004](https://leetcode.com/problems/max-consecutive-ones-iii/)
- **Nudge:** rewrite "flip at most k zeros" as "window containing at most k zeros". The rewrite is
  the whole insight.

### 6. Minimum Window Substring 🔴
[LeetCode 76](https://leetcode.com/problems/minimum-window-substring/)
- **Pattern:** Shape B + `have`/`need` matched counters
- **Nudge:** don't recheck the whole Counter each step. Track how many *distinct* required characters
  are currently fully satisfied.
- **Trap:** increment `have` on `window[c] == need[c]` (exactly), not `>=`.
- ⭐⭐ The boss fight. Budget 45 min. Re-solve on Day 15 and Day 29.

---

## Extension

### 7. Minimum Size Subarray Sum 🟡
[LeetCode 209](https://leetcode.com/problems/minimum-size-subarray-sum/)
- **Nudge:** Shape B. Record the length *inside* the shrink loop.
- **Ask:** why does this need all-positive numbers? What would you use with negatives?

### 8. Find All Anagrams in a String 🟡
[LeetCode 438](https://leetcode.com/problems/find-all-anagrams-in-a-string/)
- **Nudge:** identical to Permutation in String, but collect every start index.

### 9. Longest Substring with At Most K Distinct Characters 🟡
[LeetCode 340](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/) *(premium)*
- **Nudge:** `defaultdict(int)` + shrink while `len(count) > k`. Delete zero-count keys or `len()` lies.

### 10. Fruit Into Baskets 🟡
[LeetCode 904](https://leetcode.com/problems/fruit-into-baskets/)
- **Nudge:** this is LC 340 with `k = 2`, dressed up as a story. Recognising that *is* the exercise.

### 11. Sliding Window Maximum 🔴
[LeetCode 239](https://leetcode.com/problems/sliding-window-maximum/)
- **Pattern:** fixed window + monotonic deque
- **Nudge:** if a later element is ≥ an earlier one still in the window, the earlier one is dead
  forever. Store indices, not values, so you can check expiry.
- Do this after Day 10 (monotonic stack), when the "discard the dominated element" idea is familiar.

### 12. Subarrays with K Different Integers 🔴
[LeetCode 992](https://leetcode.com/problems/subarrays-with-k-different-integers/)
- **Nudge:** `exactly(K) = atMost(K) - atMost(K-1)`. Write `atMost` once, call it twice.
- ⭐ The cleanest example of the counting-window template (`res += right - left + 1`).

### 13. Longest Subarray of 1's After Deleting One Element 🟡
[LeetCode 1493](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/)
- **Nudge:** LC 1004 with `k = 1`, minus one for the mandatory deletion. Watch the `-1`.

### 14. Number of Substrings Containing All Three Characters 🟡
[LeetCode 1358](https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/)
- **Nudge:** for each `right`, once the window is valid, *every* start from 0 to `left` also works →
  `res += left + 1`. A nice variant on the counting formula.

---

## Self-check

1. State the difference between the "longest" and "shortest" templates in one sentence.
2. Why does sliding window fail on an array containing negative numbers, for a sum constraint?
3. In Longest Repeating Character Replacement, why is a stale `max_freq` harmless?
4. How do you convert "exactly K distinct" into something a sliding window can do?
5. Write `res += right - left + 1` and explain in words what it counts.
6. In Minimum Window Substring, why `==` rather than `>=` when incrementing `have`?
