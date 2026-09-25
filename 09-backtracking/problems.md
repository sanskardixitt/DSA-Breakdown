# Backtracking — Problem Set

> **Before each problem: draw the decision tree for a tiny input.** `[1,2]` or `n = 2`. Five minutes
> of drawing prevents an hour of debugging. This is the topic where that pays off most.

---

## Core — subsets & combinations (Day 18)

### 1. Subsets 🟡
[LeetCode 78](https://leetcode.com/problems/subsets/)
- **Nudge:** record at **every** node, not just at leaves. Recurse with `i + 1`.
- Write it three ways: `start` index, include/exclude, bitmask.
- ⭐ The base template. Get this fully solid before moving on.

### 2. Combination Sum 🟡
[LeetCode 39](https://leetcode.com/problems/combination-sum/)
- **Nudge:** reuse allowed → recurse with `i`, not `i + 1`.
- Sort first so you can `break` when `candidates[i] > remaining`.

### 3. Subsets II 🟡
[LeetCode 90](https://leetcode.com/problems/subsets-ii/)
- **Nudge:** sort, then `if i > start and nums[i] == nums[i-1]: continue`.
- **Draw the tree for `[1,1,2]`** and mark which branches get cut. Do this before coding.

### 4. Combination Sum II 🟡
[LeetCode 40](https://leetcode.com/problems/combination-sum-ii/)
- **Nudge:** both rules at once — `i + 1` (no reuse) and the duplicate skip.

### 5. Combinations 🟡
[LeetCode 77](https://leetcode.com/problems/combinations/)
- **Nudge:** add the `n - need + 2` upper bound to the loop. Derive it yourself.

---

## Core — permutations & grids (Day 19)

### 6. Permutations 🟡
[LeetCode 46](https://leetcode.com/problems/permutations/)
- **Nudge:** loop from 0 with a `used` array. No `start` index.
- **Articulate** why combinations use `start` and permutations use `used`.

### 7. Word Search 🟡
[LeetCode 79](https://leetcode.com/problems/word-search/)
- **Nudge:** mark the cell `'#'`, recurse in four directions, then **restore it**.
- **Key distinction:** why is the mark undone here but permanent in Number of Islands?

### 8. Palindrome Partitioning 🟡
[LeetCode 131](https://leetcode.com/problems/palindrome-partitioning/)
- **Nudge:** the choice is *where to cut*. `start` is a string index.

### 9. N-Queens 🔴
[LeetCode 51](https://leetcode.com/problems/n-queens/)
- **Nudge:** one queen per row. Three sets: `cols`, `r - c`, `r + c`.
- **Prune before descending**, never place-then-validate.
- ⭐ The best problem for understanding that pruning *is* the algorithm.

---

## Extension

### 10. Permutations II 🟡
[LeetCode 47](https://leetcode.com/problems/permutations-ii/)
- **Nudge:** sort, then `if i > 0 and nums[i] == nums[i-1] and not used[i-1]: continue`.
- Explain `not used[i-1]` in your own words before you accept it.

### 11. Letter Combinations of a Phone Number 🟡
[LeetCode 17](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)
- **Nudge:** the template with no constraints at all. A good template-check.

### 12. Generate Parentheses 🟡
[LeetCode 22](https://leetcode.com/problems/generate-parentheses/)
- **Nudge:** `open < n` to open; `close < open` to close. Two conditions, whole problem.

### 13. Combination Sum III 🟡
[LeetCode 216](https://leetcode.com/problems/combination-sum-iii/)
- **Nudge:** combinations from 1–9 with both a count and a sum constraint. Prune on both.

### 14. Restore IP Addresses 🟡
[LeetCode 93](https://leetcode.com/problems/restore-ip-addresses/)
- **Nudge:** partition into exactly 4 segments, each `0–255`, no leading zeros (except `"0"` itself).
- Same shape as Palindrome Partitioning with a different validity test.

### 15. Subsets / Target Sum 🟡
[LeetCode 494](https://leetcode.com/problems/target-sum/)
- **Nudge:** first write pure backtracking (2ⁿ). Then add `@cache` on `(index, running_sum)` and watch
  it become polynomial.
- ⭐ **The bridge problem to DP.** Do it in both forms, back to back, in one sitting. This is where
  "backtracking + memo = DP" stops being a slogan.

### 16. Sudoku Solver 🔴
[LeetCode 37](https://leetcode.com/problems/sudoku-solver/)
- **Nudge:** precompute the row/col/box sets. Return `bool` to short-circuit at the first solution.

### 17. Word Search II 🔴
[LeetCode 212](https://leetcode.com/problems/word-search-ii/)
- **Nudge:** running Word Search per word is far too slow. Build a **trie** of all words and DFS the
  grid once, walking the trie in parallel.
- Requires the trie from [../07-trees/problems.md](../07-trees/problems.md) #24.
- Attempt on a review day. Hard but very instructive about combining structures.

### 18. Combination Sum IV 🟡
[LeetCode 377](https://leetcode.com/problems/combination-sum-iv/)
- ⚠ **A trap:** despite the name, order *matters* and it asks only for a **count** — so it's DP, not
  backtracking. Enumerating would be exponential.
- **Recognising that it's not backtracking is the entire lesson.** Read the constraints.

---

## Self-check

1. What are the three lines of the backtracking rhythm?
2. Why `path[:]` and not `path`?
3. When do you recurse with `i` vs `i + 1`? What does each mean?
4. Why do combinations use `start` but permutations use `used`?
5. Explain `i > start and nums[i] == nums[i-1]` — why `start` and not `0`?
6. Explain `not used[i-1]` in the permutation duplicate rule.
7. When is a grid "visited" mark undone, and when is it permanent?
8. Name the three kinds of pruning, with an example of each.
9. What turns exponential backtracking into polynomial DP, and when is that impossible?
