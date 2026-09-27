# Dynamic Programming — Problem Set

> **The rule for this topic:** for every problem, write `dp[i] = ...` in **English** as a comment
> before writing any code. Then solve it top-down with `@cache`, *then* convert to bottom-up.
> Doing all three is what makes DP stick.

---

## 1-D DP (Day 23)

### 1. Climbing Stairs 🟢
[LeetCode 70](https://leetcode.com/problems/climbing-stairs/)
- **Nudge:** "how did I get to step i?" From `i-1` or `i-2`. That's the recurrence.
- Write all three versions: recursion, `@cache`, O(1) space.

### 2. Min Cost Climbing Stairs 🟢
[LeetCode 746](https://leetcode.com/problems/min-cost-climbing-stairs/)
- **Nudge:** `dp[i]` = min cost to *reach* stair `i`. Add a virtual position past the end.

### 3. House Robber 🟡
[LeetCode 198](https://leetcode.com/problems/house-robber/)
- **Nudge:** at house `i` — rob it (`nums[i] + dp[i-2]`) or skip it (`dp[i-1]`).
- ⭐ The archetypal "take it or leave it" DP. Six other problems are this recurrence in disguise.

### 4. House Robber II 🟡
[LeetCode 213](https://leetcode.com/problems/house-robber-ii/)
- **Nudge:** break the circle — run the linear version twice, excluding the first house then the last.

---

## String DP (Day 24)

### 5. Longest Palindromic Substring 🟡
[LeetCode 5](https://leetcode.com/problems/longest-palindromic-substring/)
- **Nudge:** expand around centres. There are `2n-1` centres (odd and even).

### 6. Palindromic Substrings 🟡
[LeetCode 647](https://leetcode.com/problems/palindromic-substrings/)
- **Nudge:** same expansion, count every successful step instead of tracking a max.

### 7. Decode Ways 🟡
[LeetCode 91](https://leetcode.com/problems/decode-ways/)
- **Nudge:** the last character stands alone, or joins the one before it.
- **Traps:** `'0'` can't stand alone; two-digit codes must be in `[10, 26]`.

### 8. Word Break 🟡
[LeetCode 139](https://leetcode.com/problems/word-break/)
- **Nudge:** `dp[i]` = "is the prefix of length i segmentable?" For each `i`, try every split `j`.
- ⭐ The standard partition-DP skeleton.

---

## Knapsack (Day 25)

### 9. Coin Change 🟡
[LeetCode 322](https://leetcode.com/problems/coin-change/)
- **Nudge:** try each coin as the *last* coin used.
- **Be ready to explain** why greedy fails: coins `[1,3,4]`, amount `6`.

### 10. Coin Change II 🟡
[LeetCode 518](https://leetcode.com/problems/coin-change-ii/)
- **Nudge:** coins in the **outer** loop → counts combinations, not permutations.
- ⭐ Then read Combination Sum IV (#20 below) and articulate the difference. Best DP pairing there is.

### 11. Partition Equal Subset Sum 🟡
[LeetCode 416](https://leetcode.com/problems/partition-equal-subset-sum/)
- **Nudge:** 0/1 knapsack with target `total // 2`. **Iterate capacity backwards.**
- **Do this experiment:** run it with the loop forwards and see exactly what goes wrong.

### 12. Target Sum 🟡
[LeetCode 494](https://leetcode.com/problems/target-sum/)
- **Nudge:** write the `@cache` version on `(index, running_sum)` first. Then derive the
  `(total + target) / 2` subset reduction.

---

## LIS & 2-D grid (Day 26)

### 13. Longest Increasing Subsequence 🟡
[LeetCode 300](https://leetcode.com/problems/longest-increasing-subsequence/)
- **Do both:** the O(n²) DP and the O(n log n) `bisect` version.
- **Nudge:** `dp[i]` = LIS *ending at* i, so the answer is `max(dp)`.
- ⭐ Know what `tails` actually holds, and be able to say why it's not the LIS itself.

### 14. Unique Paths 🟡
[LeetCode 62](https://leetcode.com/problems/unique-paths/)
- **Nudge:** `dp[r][c] = dp[r-1][c] + dp[r][c-1]`. Then compress to a single row.

### 15. Longest Common Subsequence 🟡
[LeetCode 1143](https://leetcode.com/problems/longest-common-subsequence/)
- **Nudge:** match → diagonal + 1; mismatch → max(up, left).
- **Build the table by hand** for `"abcde"` / `"ace"` before coding. Genuinely worth the 15 minutes.

### 16. Maximum Product Subarray 🟡
[LeetCode 152](https://leetcode.com/problems/maximum-product-subarray/)
- **Nudge:** track the **minimum** too — a negative times a negative flips it to a maximum.

---

## Extension

### 17. Maximum Subarray (Kadane) 🟡
[LeetCode 53](https://leetcode.com/problems/maximum-subarray/)
- **Nudge:** `cur = max(x, cur + x)` — either extend the running subarray or restart at `x`.
- The simplest and most-asked "ending at i" DP.

### 18. Jump Game 🟡 / Jump Game II 🟡
[LeetCode 55](https://leetcode.com/problems/jump-game/) ·
[LeetCode 45](https://leetcode.com/problems/jump-game-ii/)
- **Nudge:** both are solvable with DP, but greedy is O(n) and simpler. Do the DP first, then the
  greedy, and articulate why the greedy is provably correct.

### 19. Edit Distance 🟡
[LeetCode 72](https://leetcode.com/problems/edit-distance/)
- **Nudge:** three moves — up = delete, left = insert, diagonal = replace.
- **Trap:** the base row/column are `i` and `j`, not 0.
- ⭐ The most-asked 2-D string DP.

### 20. Combination Sum IV 🟡
[LeetCode 377](https://leetcode.com/problems/combination-sum-iv/)
- **Nudge:** amount in the **outer** loop → counts permutations. Compare line-by-line with #10.

### 21. Longest Palindromic Subsequence 🟡
[LeetCode 516](https://leetcode.com/problems/longest-palindromic-subsequence/)
- **Nudge:** `LCS(s, reversed(s))`. Or interval DP with `i` iterated **downwards**.

### 22. Perfect Squares 🟡
[LeetCode 279](https://leetcode.com/problems/perfect-squares/)
- **Nudge:** unbounded knapsack where the items are `1, 4, 9, 16, ...`.

### 23. Minimum Path Sum 🟡
[LeetCode 64](https://leetcode.com/problems/minimum-path-sum/)

### 24. Maximal Square 🟡
[LeetCode 221](https://leetcode.com/problems/maximal-square/)
- **Nudge:** `dp[r][c]` = side length of the largest square with its bottom-right corner here.
  `1 + min(above, left, diagonal)`. Draw a 3×3 case to see why it's the min of three.

### 25. Best Time to Buy and Sell Stock with Cooldown 🟡
[LeetCode 309](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)
- **Nudge:** a **state machine** — `held`, `sold`, `rest`. Write the transitions between them.
- ⭐ The gateway to all the "stock with k transactions" problems. Once you think in states, the whole
  family opens up.

### 26. Longest Increasing Path in a Matrix 🔴
[LeetCode 329](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/)
- **Nudge:** DFS + memo. No `visited` set needed — why not?

### 27. Burst Balloons 🔴
[LeetCode 312](https://leetcode.com/problems/burst-balloons/)
- **Nudge:** think about which balloon is burst **last** in a range, not first. That reframe is the
  entire problem.
- Interval DP. Hard, but the "consider the last operation" idea is worth meeting.

### 28. Russian Doll Envelopes 🔴
[LeetCode 354](https://leetcode.com/problems/russian-doll-envelopes/)
- **Nudge:** sort by width ascending, height **descending**, then LIS on the heights. Explain the
  descending tiebreak before you code it.

---

## Self-check

1. What are the two preconditions for DP?
2. What are the four questions that define any DP?
3. Give the counterexample showing Coin Change isn't greedy.
4. Why does 0/1 knapsack iterate capacity backwards, and unbounded forwards?
5. In counting problems, what does loop order (items outer vs amount outer) change?
6. When is the answer `max(dp)` rather than `dp[n-1]`?
7. Explain what `tails` holds in the O(n log n) LIS, and why it isn't the LIS.
8. When would you define the DP state backwards from the goal instead of forwards?
