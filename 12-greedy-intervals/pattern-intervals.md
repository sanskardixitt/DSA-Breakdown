# Pattern — Intervals

A small, very well-defined family. Almost every interval problem is "sort, then sweep once" — and
**which key you sort by** determines everything.

---

## How do I know to use this?

- The input is a list of `[start, end]` pairs
- "**merge** overlapping intervals"
- "**insert** an interval"
- "can a person **attend all meetings**?"
- "**minimum meeting rooms**"
- "**maximum non-overlapping** intervals" / "minimum removals"
- "minimum arrows to burst balloons"
- "**employee free time**", "available slots"

---

## ⭐ The sort-key decision table — memorise this

| Goal | Sort by | Sweep logic |
|---|---|---|
| **Merge** overlapping | **start** ascending | extend the current interval, or push a new one |
| **Max non-overlapping** count | **end** ascending | greedily take each interval that starts after the last end |
| **Min removals** to remove overlaps | **end** ascending | `n − max_non_overlapping` |
| **Min rooms / max concurrent** | start asc + a **min-heap of ends** | (or sweep line) |
| **Insert** into a sorted list | already sorted | three phases: before / overlapping / after |

**Sort by START to combine things. Sort by END to select things.**

That one sentence resolves the most common confusion in this topic. Say it out loud before you code.

---

## Do two intervals overlap?

```python
def overlap(a, b):
    return a[0] < b[1] and b[0] < a[1]     # strict: touching endpoints don't count
    # return a[0] <= b[1] and b[0] <= a[1]  # inclusive: touching DOES count
```

> ⚠ **Check the problem's convention.** `[1,2]` and `[2,3]` — do they overlap? In Merge Intervals,
> yes (LeetCode merges them). In Meeting Rooms, no (you can attend both). Getting this backwards
> produces a solution that passes the examples and fails the hidden tests.

---

## Merge Intervals (LC 56) — sort by START

```python
def merge(intervals):
    intervals.sort(key=lambda x: x[0])              # ⭐ by start
    merged = []

    for interval in intervals:
        if merged and interval[0] <= merged[-1][1]:      # overlaps the last merged one
            merged[-1][1] = max(merged[-1][1], interval[1])   # extend it
        else:
            merged.append(interval)                       # disjoint → start a new one

    return merged
```
**O(n log n).**

> **Why `max(...)` and not just `interval[1]`?** Because the new interval might be entirely *contained*
> in the current one: merging `[1,10]` with `[2,3]` must keep the end at 10. Assigning directly is a
> very common bug that only shows up on nested intervals.

**Why sorting by start makes this work:** once sorted, any interval that overlaps the current group
must overlap its *last* element. You never need to look further back than `merged[-1]`.

---

## Insert Interval (LC 57) — the three-phase sweep

> The list is already sorted and non-overlapping. Insert a new interval and merge.

```python
def insert(intervals, new_interval):
    res = []
    i, n = 0, len(intervals)

    # ① everything entirely BEFORE the new interval
    while i < n and intervals[i][1] < new_interval[0]:
        res.append(intervals[i])
        i += 1

    # ② everything OVERLAPPING — absorb them into new_interval
    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval[0] = min(new_interval[0], intervals[i][0])
        new_interval[1] = max(new_interval[1], intervals[i][1])
        i += 1
    res.append(new_interval)

    # ③ everything entirely AFTER
    while i < n:
        res.append(intervals[i])
        i += 1

    return res
```
**O(n)** — no sort needed, the input is already ordered.

> **The three-phase structure (before / overlapping / after) is the clean way to write this.** Trying
> to handle it with a single loop and conditionals is where people tangle themselves up. Three simple
> loops beat one clever one.

---

## Non-overlapping Intervals (LC 435) — sort by END ⭐

> Minimum number of intervals to remove so the rest don't overlap.

**Reframe:** minimising removals = **maximising kept** = the classic activity-selection problem.

```python
def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[1])              # ⭐ by END
    kept = 0
    last_end = float('-inf')

    for start, end in intervals:
        if start >= last_end:                       # doesn't overlap what we kept
            kept += 1
            last_end = end

    return len(intervals) - kept
```

### Why sort by end, and not by start?

**The greedy claim:** always keep the interval that **finishes earliest**, because it leaves the
maximum room for everything after it.

**Exchange argument:** suppose an optimal solution keeps interval `a` first, and greedy keeps `g`
(which ends no later). Swapping `g` for `a` can't conflict with anything that followed `a` — `g`
finishes at least as early. So the swapped solution is still valid and the same size. ∎

**Sorting by start fails.** Consider `[[1,100], [2,3], [3,4]]`. By start, you'd take `[1,100]` first
and be stuck with 1 interval. By end, you take `[2,3]` then `[3,4]` — 2 intervals. The long interval
is a trap that only end-sorting avoids.

> **This is the single most important idea in the interval family.** "Take the earliest-finishing" is
> the answer to almost every "maximum non-overlapping" question.

---

## Minimum Number of Arrows (LC 452) — the same problem

> Balloons span `[start, end]`. An arrow at `x` bursts every balloon containing `x`.
> Minimum arrows?

Identical to activity selection: each arrow handles one group of mutually-overlapping balloons.

```python
def find_min_arrow_shots(points):
    points.sort(key=lambda x: x[1])                 # by end
    arrows = 0
    last_arrow = float('-inf')

    for start, end in points:
        if start > last_arrow:                      # this balloon isn't hit yet
            arrows += 1
            last_arrow = end                        # shoot at the earliest end
    return arrows
```

> Note `start > last_arrow` (strict) — a balloon whose start equals the arrow position **is** hit.
> LC 435 uses `start >= last_end` because touching intervals don't overlap there. The two problems are
> structurally identical and differ by exactly one comparison operator. That's how much the convention
> matters.

---

## Meeting Rooms (LC 252) — can I attend all?

```python
def can_attend_meetings(intervals):
    intervals.sort(key=lambda x: x[0])
    return all(intervals[i][0] >= intervals[i-1][1] for i in range(1, len(intervals)))
```
Sort by start, check every adjacent pair. Two lines.

---

## Meeting Rooms II (LC 253) — how many rooms? ⭐

Two clean solutions worth knowing both of.

### Solution A — min-heap of end times
```python
import heapq

def min_meeting_rooms(intervals):
    intervals.sort(key=lambda x: x[0])              # by start
    ends = []                                        # min-heap of end times

    for start, end in intervals:
        if ends and ends[0] <= start:
            heapq.heappop(ends)                     # the earliest-ending room is free
        heapq.heappush(ends, end)

    return len(ends)                                 # peak concurrency
```
**The insight:** only the *earliest-finishing* meeting could possibly free a room in time. The heap
root gives it in O(1); you never inspect the others.

### Solution B — sweep line
```python
def min_meeting_rooms(intervals):
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e, -1))
    events.sort()                                    # at equal times, -1 before +1

    cur = best = 0
    for _, d in events:
        cur += d
        best = max(best, cur)
    return best
```
Sweep line generalises further (Car Pooling, The Skyline Problem, My Calendar). The heap version is
more idiomatic for the room-allocation framing. Know both.

---

## Employee Free Time (LC 759) 🔴

> Given each employee's busy intervals, find the intervals when *everyone* is free.

**Reduce it to a solved problem:** flatten all intervals into one list, merge them (LC 56), and the
**gaps between merged intervals** are the free time.

```python
def employee_free_time(schedule):
    all_intervals = sorted((iv for emp in schedule for iv in emp), key=lambda x: x.start)

    merged = []
    for iv in all_intervals:
        if merged and iv.start <= merged[-1].end:
            merged[-1].end = max(merged[-1].end, iv.end)
        else:
            merged.append(Interval(iv.start, iv.end))

    return [Interval(merged[i].end, merged[i+1].start) for i in range(len(merged) - 1)]
```

> **"Flatten, merge, look at the gaps"** handles a whole class of "find the free/uncovered space"
> problems. The reduction is the insight; the code is just LC 56 again.

---

## Debug checklist

- [ ] Sorting by **start** (to combine) or by **end** (to select)? Say which and why.
- [ ] Does the problem count touching endpoints as overlapping? `<` or `<=`?
- [ ] In merge: using `max(...)` for the new end, to handle nested intervals?
- [ ] Empty input handled?
- [ ] Sweep line: is the tie-break at equal timestamps correct for this problem's convention?
- [ ] Are you mutating the input list? Say so, or copy it.
