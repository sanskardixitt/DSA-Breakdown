# Greedy & Intervals — Notes

---

## What greedy actually is

> Make the **locally optimal choice** at each step, and never reconsider.

Greedy is trivial to code and hard to justify. The difficulty is never implementation — it's
**proving the greedy choice is safe**.

### The two properties a greedy solution needs

1. **Greedy choice property** — a globally optimal solution can always be built starting from the
   locally optimal choice.
2. **Optimal substructure** — after making that choice, what remains is the same problem, smaller.

---

## Greedy vs DP — the decision

**The test:** *"Could taking the locally best option now ever lock me out of a better overall answer?"*

- **Yes** → DP. You must consider both branches.
- **No, and I can argue why** → greedy.

| Problem | Greedy works? | Why |
|---|---|---|
| Coin Change, coins `[1,5,10,25]` | ✅ | The US coin system is *canonical* — biggest-first is provably optimal |
| Coin Change, coins `[1,3,4]`, amount 6 | ❌ | Greedy: 4+1+1 = 3 coins. Optimal: 3+3 = 2 coins |
| Activity selection (max non-overlapping) | ✅ | Earliest-finishing leaves the most room — exchange argument |
| Jump Game (can I reach the end?) | ✅ | Only reachability matters, not the route |
| 0/1 knapsack | ❌ | A high-value item may crowd out two better ones |
| Fractional knapsack | ✅ | You can split items, so best value-per-weight always wins |

> **`[1,3,4]` with amount 6 is the counterexample to memorise.** It's the fastest way to answer
> "why isn't this greedy?" in an interview, and it makes the point instantly.

---

## How to prove a greedy choice (the exchange argument)

The standard technique, and it's worth being able to sketch:

1. Assume an optimal solution `OPT` that **differs** from your greedy choice.
2. Show you can **swap** greedy's choice into `OPT` without making it worse.
3. Therefore a solution containing greedy's choice is also optimal. ∎

**Applied to activity selection:** greedy picks the earliest-finishing activity `g`. Suppose `OPT`
starts with a different activity `a`. Since `g` finishes no later than `a`, replacing `a` with `g`
in `OPT` can't conflict with anything that followed `a`. So `OPT` with `g` swapped in is still valid
and the same size. ∎

You won't write proofs in an interview, but **saying "here's the exchange argument"** in two sentences
is a strong signal, and it stops you from confidently coding a wrong greedy.

---

## Recognition triggers

| Statement says... | Likely greedy |
|---|---|
| "**minimum number of** ___ to ___" | ✅ |
| "**maximum number of** non-overlapping ___" | ✅ (sort by end) |
| "**can you reach** ___" | ✅ |
| "**merge** overlapping ___" | ✅ (sort by start) |
| "**minimum** ___ **rooms/platforms/resources**" | ✅ (sweep line or heap) |
| "assign / distribute optimally" | ✅ often |
| "**minimum jumps/steps**" | ✅ (or BFS) |
| "gas station circuit" | ✅ |

**Anti-triggers:** if the choice at step `i` restricts *which* options remain (not just how many), it's
probably DP.

---

## The greedy toolkit — the move is almost always "sort first"

| Sort by | Enables |
|---|---|
| **End time** ascending | Maximum non-overlapping intervals (activity selection) |
| **Start time** ascending | Merging overlapping intervals |
| **Value/weight** ratio | Fractional knapsack |
| Size ascending/descending | Bin packing heuristics, two-pointer matching |
| A custom comparator | "Largest Number", "Reorganize by frequency" |

**Choosing the sort key IS the algorithm.** Once sorted correctly, the rest is a single linear sweep.
When a greedy solution is wrong, the sort key is usually why.

---

## Classic greedy problems

### Maximum Subarray — Kadane's (LC 53)
```python
def max_sub_array(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)          # extend the running subarray, or restart at x
        best = max(best, cur)
    return best
```
**The greedy choice:** if the running sum has gone negative, it can only hurt whatever follows —
drop it and start fresh. That's the entire insight.

### Jump Game (LC 55)
```python
def can_jump(nums):
    reach = 0
    for i, x in enumerate(nums):
        if i > reach:
            return False               # can't even get to i
        reach = max(reach, i + x)
    return True
```
**Track the furthest reachable index.** Because only *reachability* matters — not which route you take
— you never have to consider alternatives. That's what makes the greedy safe here.

### Jump Game II (LC 45) — minimum jumps
```python
def jump(nums):
    jumps = 0
    cur_end = 0          # the boundary of the current jump's range
    farthest = 0

    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == cur_end:                # exhausted the current range → must jump
            jumps += 1
            cur_end = farthest
    return jumps
```
**This is BFS in disguise** — `cur_end` marks a level boundary, exactly like `level_size = len(q)` in
tree BFS. Each "jump" is one BFS level. Noticing that makes the code make sense.

### Gas Station (LC 134)
```python
def can_complete_circuit(gas, cost):
    if sum(gas) < sum(cost):
        return -1                      # not enough fuel overall — impossible

    start = tank = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:                   # can't reach i+1 from `start`
            start = i + 1              # ⭐ so restart from i+1
            tank = 0
    return start
```
**Why restarting at `i+1` is safe:** if you run out between `start` and `i`, then no station *between*
them works either — each of those would begin with less fuel than `start` did. So you can skip the
whole range in one move. That argument is what makes this O(n) instead of O(n²), and it's the kind of
reasoning interviewers are looking for.

### Partition Labels (LC 763)
```python
def partition_labels(s):
    last = {c: i for i, c in enumerate(s)}     # last occurrence of each char
    res, start, end = [], 0, 0
    for i, c in enumerate(s):
        end = max(end, last[c])                # the partition must extend at least this far
        if i == end:                           # everything in [start, i] stays inside
            res.append(i - start + 1)
            start = i + 1
    return res
```
The same "extend the boundary, cut when you reach it" sweep as Jump Game II.

### Largest Number (LC 179) — custom comparator
```python
from functools import cmp_to_key

def largest_number(nums):
    strs = list(map(str, nums))
    strs.sort(key=cmp_to_key(lambda a, b: (1 if a + b < b + a else -1)))
    res = "".join(strs)
    return "0" if res[0] == "0" else res
```
**The comparator:** `a` comes before `b` iff `a+b > b+a` as strings. `"9"` before `"34"` because
`"934" > "349"`. Not obvious, and worth remembering as the canonical "the comparator is the algorithm"
example.

---

## Sweep line (a greedy cousin)

For "how many things overlap at once" questions, convert intervals into **events** and sweep.

```python
def min_rooms(intervals):
    events = []
    for start, end in intervals:
        events.append((start, 1))      # a meeting begins
        events.append((end, -1))       # a meeting ends
    events.sort()                      # ⚠ at equal times, -1 sorts before +1 → a room frees first

    cur = best = 0
    for _, delta in events:
        cur += delta
        best = max(best, cur)
    return best
```

> **The tie-break at equal timestamps is the trap.** If a meeting ends at 10 and another starts at 10,
> do they overlap? Usually not — so the end event must be processed first. Sorting `(time, delta)`
> puts `-1` before `+1` naturally, which gives the right behaviour. If the problem says they *do*
> conflict, sort the other way. **Read the statement.**

Sweep line also solves: Car Pooling, My Calendar, Meeting Rooms II, Employee Free Time,
The Skyline Problem.

---

## Next

[pattern-intervals.md](pattern-intervals.md) — the interval family in depth.
Then [problems.md](problems.md).
