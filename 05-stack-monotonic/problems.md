# Stack & Monotonic Stack — Problem Set

---

## Core stack (Day 9)

### 1. Valid Parentheses 🟢
[LeetCode 20](https://leetcode.com/problems/valid-parentheses/)
- **Trap:** both the "pop from empty" check *and* the final "stack must be empty" check.

### 2. Min Stack 🟡
[LeetCode 155](https://leetcode.com/problems/min-stack/)
- **Nudge:** store `(value, min_at_time_of_push)` pairs. Popping restores the old min for free.

### 3. Evaluate Reverse Polish Notation 🟡
[LeetCode 150](https://leetcode.com/problems/evaluate-reverse-polish-notation/)
- **Trap 1:** pop the *second* operand first.
- **Trap 2:** division truncates toward zero → `int(a / b)`, not `a // b`.

### 4. Generate Parentheses 🟡
[LeetCode 22](https://leetcode.com/problems/generate-parentheses/)
- Actually backtracking, placed here because of the bracket-validity invariant.
- **Nudge:** you may add `(` while `open < n`, and `)` while `close < open`. Those two conditions are
  the entire problem.

### 5. Daily Temperatures 🟡
[LeetCode 739](https://leetcode.com/problems/daily-temperatures/)
- **Nudge:** stack of *indices* of days awaiting a warmer day. Answer = `i - j`.
- ⭐ The cleanest introduction to monotonic stacks. Trace it by hand before coding.

---

## Monotonic stack (Day 10)

### 6. Next Greater Element I 🟢
[LeetCode 496](https://leetcode.com/problems/next-greater-element-i/)
- **Nudge:** compute next-greater for `nums2` into a dict, then look up each element of `nums1`.

### 7. Next Greater Element II 🟡
[LeetCode 503](https://leetcode.com/problems/next-greater-element-ii/)
- **Nudge:** circular → loop `2n` times with `i % n`, pushing only when `i < n`.

### 8. Car Fleet 🟡
[LeetCode 853](https://leetcode.com/problems/car-fleet/)
- **Nudge:** sort by position **descending**, compute each car's arrival time, then use a stack:
  if a car's arrival time is ≤ the one ahead, it merges into that fleet (gets absorbed).
- The reframe from "positions and speeds" to "arrival times" is the whole problem.

### 9. Largest Rectangle in Histogram 🔴
[LeetCode 84](https://leetcode.com/problems/largest-rectangle-in-histogram/)
- **Nudge:** for every bar, find the previous smaller and next smaller bar. Width between them,
  height = the bar. Take the max.
- Use the `+ [0]` sentinel to drain the stack.
- ⭐⭐ Budget 45 minutes. This one problem teaches the whole pattern.

### 10. Maximal Rectangle 🔴
[LeetCode 85](https://leetcode.com/problems/maximal-rectangle/)
- **Nudge:** build a histogram per row (consecutive 1s above each column), then call #9 on each row.
- Only worth attempting after #9 is solid — then it's a 6-line wrapper.

---

## Extension

### 11. Trapping Rain Water 🔴
[LeetCode 42](https://leetcode.com/problems/trapping-rain-water/)
- **Nudge:** the stack version fills water *horizontally*, layer by layer.
- Solve it three ways (two arrays / two pointers / stack) and be able to say which you'd present first.

### 12. Remove K Digits 🟡
[LeetCode 402](https://leetcode.com/problems/remove-k-digits/)
- **Nudge:** keep the stack increasing; pop a larger digit when a smaller one arrives.
- **Edge cases:** leftover `k`, leading zeros, empty result. All three are tested.

### 13. Sum of Subarray Minimums 🟡
[LeetCode 907](https://leetcode.com/problems/sum-of-subarray-minimums/)
- **Nudge:** for each element, count how many subarrays it is the minimum of:
  `(i - prev_smaller) * (next_smaller - i)`. Then sum `value × count`.
- **Trap:** to avoid double-counting equal elements, use strict `<` on one side and `<=` on the other.
- ⭐ The best example of the "contribution technique" — count each element's contribution instead of
  enumerating subarrays.

### 14. Decode String 🟡
[LeetCode 394](https://leetcode.com/problems/decode-string/)
- **Nudge:** on `[` push `(current_string, count)` and reset; on `]` pop and merge.

### 15. Asteroid Collision 🟡
[LeetCode 735](https://leetcode.com/problems/asteroid-collision/)
- **Nudge:** a collision happens only when the stack top moves right (`> 0`) and the incoming moves
  left (`< 0`). Careful with the "both destroyed" case and the loop control.

### 16. Basic Calculator II 🟡
[LeetCode 227](https://leetcode.com/problems/basic-calculator-ii/)
- **Nudge:** push numbers; on `*` or `/` immediately pop-compute-push; keep `+`/`-` as signed values
  and sum at the end.

### 17. Online Stock Span 🟡
[LeetCode 901](https://leetcode.com/problems/online-stock-span/)
- **Nudge:** "previous greater element" as a stream. Store `(price, span)` and accumulate spans on pop.

---

## Self-check

1. Why is a monotonic stack O(n) despite the nested `while` loop?
2. In "next greater", is the stack increasing or decreasing? Justify it in one sentence.
3. Why store indices instead of values?
4. In Largest Rectangle, why is `width = i - stack[-1] - 1`? Draw it.
5. What does the sentinel `+ [0]` do, and what breaks without it?
6. Name the three problems in this repo that all use the "discard a dominated element" argument.
