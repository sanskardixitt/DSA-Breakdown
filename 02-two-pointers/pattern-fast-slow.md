# Pattern — Fast & Slow Pointers (Floyd's Tortoise and Hare)

Two pointers moving the same direction at **different speeds**. The gap between them encodes
information you'd otherwise need O(n) extra space to store.

---

## How do I know to use this?

- "**cycle**" in a linked list or in a functional mapping (`i → nums[i]`)
- "**middle**" of a linked list, in one pass
- "**nth node from the end**", in one pass
- "**find the duplicate number**" with O(1) space and a read-only array
- "**happy number**" / any "repeatedly apply f(x), does it loop?" question
- Any linked-list question saying **"O(1) space"** or **"one pass"**

---

## Use 1 — Find the middle

`fast` moves 2 steps per 1 step of `slow`. When `fast` hits the end, `slow` is at the middle.

```python
def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```

**Even-length gotcha:** for `1→2→3→4`, this returns `3` (the *second* middle).
To land on the **first** middle (`2`) — which is what you want for "split into two halves" or
"reorder list" — start `fast` one ahead:

```python
slow, fast = head, head.next     # ← the off-by-one lever
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
# slow is now the END of the first half
```

Know both. Which you need depends on the problem, and picking wrong is a silent bug.

---

## Use 2 — Nth node from the end (gap pointers)

Advance `fast` by `n`, then move both together. When `fast` hits the end, `slow` is `n` from the end.

```python
def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)          # dummy handles "remove the head" cleanly
    slow = fast = dummy

    for _ in range(n):
        fast = fast.next

    while fast.next:                   # stop when fast is on the LAST node
        slow = slow.next
        fast = fast.next

    slow.next = slow.next.next         # slow is now just BEFORE the target
    return dummy.next
```

> Two levers here: (a) `dummy` so removing the head isn't a special case, (b) `while fast.next`
> rather than `while fast`, so `slow` lands on the *predecessor* of the target. Get either wrong and
> you're off by one.

---

## Use 3 — Cycle detection

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
```

**Why they must meet if a cycle exists:** once both pointers are inside the loop, `fast` gains exactly
1 position on `slow` per iteration. The gap shrinks by 1 each step, so it reaches 0 in at most
(loop length) steps. They can't "jump over" each other — a gap of 1 becomes a gap of 0.

---

## Use 4 — Finding the cycle *entrance* (the beautiful one)

This is the part people memorise without understanding. Here's the proof; it takes 60 seconds and
then you never forget the algorithm.

```
        F              C - a
head ───────► entry ─────────► meeting
                ▲                 │
                └────── a ────────┘
```

- `F` = distance from head to the cycle entrance
- `C` = cycle length
- `a` = distance from the entrance to the meeting point (going forward)

When they meet:
- `slow` travelled `F + a`
- `fast` travelled `F + a + nC` (it went around the loop `n` more times)
- `fast` travelled exactly twice `slow`'s distance:

```
2(F + a) = F + a + nC
      F + a = nC
          F = nC - a
```

**Read that last line.** It says: the distance from the **head to the entrance** (`F`) equals the
distance from the **meeting point onward to the entrance** (`nC - a`, i.e. finish this loop `n` times).

So: put one pointer back at `head`, leave the other at the meeting point, move both **one step at a
time** — they meet exactly at the entrance.

```python
def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:                 # phase 1: they met
            slow2 = head                 # phase 2: walk both at speed 1
            while slow2 is not slow:
                slow = slow.next
                slow2 = slow2.next
            return slow                  # the entrance
    return None
```
**O(n) time, O(1) space.**

---

## Use 5 — Find the Duplicate Number (the surprising application)

> `nums` has `n+1` integers, each in `[1, n]`. Exactly one value repeats. Find it.
> **Don't modify the array. O(1) space.**

Those constraints rule out sorting (modifies) and hash sets (O(n) space). So what's left?

**The reframe:** treat the array as a linked list, where node `i` points to node `nums[i]`.

- Every index in `[0, n]` has an outgoing edge (values are in `[1, n]`, all valid indices).
- Since the sequence is finite and every node has a successor, following it **must** eventually cycle.
- Two different indices map to the same value ⟹ the duplicate is a node with **two incoming edges**
  ⟹ it is exactly the **cycle entrance**.

So this is literally LeetCode 142 wearing a costume.

```python
def find_duplicate(nums):
    slow = fast = 0
    while True:                          # phase 1: find the meeting point
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break

    slow2 = 0                            # phase 2: find the entrance
    while slow2 != slow:
        slow = nums[slow]
        slow2 = nums[slow2]
    return slow
```

> **The transferable lesson:** "apply a function repeatedly" is *always* a linked list in disguise.
> Same trick solves Happy Number (LC 202) and cycle-finding in any `x → f(x)` sequence.

---

## Use 6 — Read/Write pointers (in-place editing)

Not "fast/slow" by speed, but by *condition*. Same family.

```python
# Remove duplicates from a SORTED array, in place
def remove_duplicates(nums):
    if not nums: return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[write - 1]:
            nums[write] = nums[read]
            write += 1
    return write

# Move all zeros to the end, preserving order
def move_zeroes(nums):
    write = 0
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write], nums[read] = nums[read], nums[write]
            write += 1
```

**Invariant to state before coding:** *"`nums[0:write]` is the finished output so far."*
Every line you write should preserve it.

---

## Traps

- `while fast and fast.next` — you need **both** checks. Dropping `fast.next` gives `AttributeError`
  on even-length lists.
- Comparing nodes with `==` instead of `is`. Works in most cases, but `is` states the intent
  (identity, not value) and avoids surprises with custom `__eq__`.
- In cycle-entrance phase 2, moving fast at speed 2. It must be **speed 1 for both**.
- Off-by-one in the "middle" variant. Decide up front: first middle or second middle?
- Forgetting the `dummy` node when the head itself may be removed.
