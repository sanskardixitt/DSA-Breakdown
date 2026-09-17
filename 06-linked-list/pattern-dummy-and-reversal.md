# Pattern — Dummy Node & Iterative Reversal

The two mechanical skills that make linked list problems routine.

---

## Part 1 — The dummy node

### The problem it solves

Consider "remove all nodes with value X":

```python
# ❌ Without a dummy — the head is a special case, and it's easy to get wrong
def remove_elements(head, val):
    while head and head.val == val:       # ← the awkward pre-loop
        head = head.next
    cur = head
    while cur and cur.next:
        if cur.next.val == val:
            cur.next = cur.next.next
        else:
            cur = cur.next
    return head
```

```python
# ✅ With a dummy — one uniform loop
def remove_elements(head, val):
    dummy = ListNode(0, head)
    cur = dummy
    while cur.next:
        if cur.next.val == val:
            cur.next = cur.next.next      # skip it
        else:
            cur = cur.next
    return dummy.next
```

**Why it works:** the dummy guarantees every real node has a predecessor. "Delete the head" stops being
different from "delete a middle node".

### When to reach for it

- The head might be **removed**
- You're **building** a new list (the dummy is your anchor while `tail` walks forward)
- You're **merging** or **partitioning** lists
- Anywhere you'd otherwise write `if node is head:`

### Building with a dummy — Merge Two Sorted Lists

```python
def merge_two_lists(l1, l2):
    dummy = ListNode()
    tail = dummy

    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next

    tail.next = l1 or l2        # attach whatever remains — no loop needed
    return dummy.next
```

> `tail.next = l1 or l2` — Python's `or` returns the first truthy operand. At most one list is
> non-empty here, so this attaches the leftover in one line. Small, but it's the idiomatic form.

### Two dummies — Partition List

Split into "less than x" and "≥ x", then join. Two dummies, two tails.

```python
def partition(head, x):
    less_d, more_d = ListNode(), ListNode()
    less, more = less_d, more_d

    while head:
        if head.val < x:
            less.next = head
            less = less.next
        else:
            more.next = head
            more = more.next
        head = head.next

    more.next = None            # ⚠ terminate, or you keep a stale link into the `less` chain
    less.next = more_d.next     # join
    return less_d.next
```

> `more.next = None` is the classic bug. Without it, the last "more" node still points at whatever
> followed it originally — which is probably in the `less` chain. Instant cycle.
>
> **The "two dummies" technique** also solves Odd Even Linked List and Sort List's merge step.

---

## Part 2 — Iterative reversal (the three-pointer dance)

### The template — memorise this cold

```python
def reverse_list(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next        # ① save what's ahead
        cur.next = prev       # ② flip the arrow backwards
        prev = cur            # ③ prev advances
        cur = nxt             # ④ cur advances
    return prev               # prev ends on the old tail = the new head
```

**Four lines, in this exact order.** Reordering them loses the list. Type this out ten times over the
next few days until your hands know it.

### Trace on `1 → 2 → 3`

| step | prev | cur | nxt | list |
|---|---|---|---|---|
| start | `None` | 1 | — | `1→2→3` |
| after 1 | 1 | 2 | 2 | `1→None`, `2→3` |
| after 2 | 2 | 3 | 3 | `2→1→None`, `3` |
| after 3 | 3 | `None` | `None` | `3→2→1→None` |

Return `prev = 3`. ✅

### The compressed form (same thing)
```python
prev, cur = None, head
while cur:
    cur.next, prev, cur = prev, cur, cur.next
```
Correct, because Python evaluates the whole right-hand side before assigning. **Don't write this in an
interview** — it looks clever and invites a "walk me through that" you don't need. Use the four-line
version.

---

## Part 3 — Reversing a *sublist* (Reverse Linked List II)

> Reverse positions `left` to `right`, in one pass.

This is where the dummy and the reversal combine, and it's a common follow-up.

```python
def reverse_between(head, left, right):
    dummy = ListNode(0, head)

    # ① walk to the node just BEFORE the reversal region
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next

    # ② reverse (right - left + 1) nodes, starting at prev.next
    cur = prev.next
    node_before, tail_of_reversed = prev, cur   # remember the joints
    p = None
    for _ in range(right - left + 1):
        nxt = cur.next
        cur.next = p
        p, cur = cur, nxt

    # ③ reconnect: node_before → (reversed head) ... (reversed tail) → cur
    node_before.next = p
    tail_of_reversed.next = cur

    return dummy.next
```

**The method that makes this tractable:** before writing any code, name the four boundary nodes on
paper —

```
dummy → ... → [node_before] → [first_in_region] ... [last_in_region] → [node_after] → ...
```

Reversal makes `first_in_region` the new tail and `last_in_region` the new head. So the two rewires are:
- `node_before.next = last_in_region`
- `first_in_region.next = node_after`

Every sublist-reversal problem is that same picture.

---

## Part 4 — Reverse Nodes in k-Group 🔴

Same idea, in a loop, with a length check.

```python
def reverse_k_group(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy

    while True:
        # ① is there a full group of k left?
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next        # fewer than k remain → leave them as-is

        group_next = kth.next

        # ② reverse the group; seed `prev` with group_next so the tail links correctly
        prev, cur = group_next, group_prev.next
        while cur is not group_next:
            nxt = cur.next
            cur.next = prev
            prev, cur = cur, nxt

        # ③ rewire and advance
        tail = group_prev.next          # the old head became the group's tail
        group_prev.next = kth           # kth is the group's new head
        group_prev = tail
```

> **The trick:** seeding `prev = group_next` instead of `None`. The reversal then automatically links
> the group's new tail to the rest of the list — no separate reconnection step needed.

---

## Practice progression

Do these in order. Each adds exactly one idea to the previous.

1. **Reverse Linked List** (LC 206) — the template
2. **Merge Two Sorted Lists** (LC 21) — the dummy for building
3. **Remove Nth Node From End** (LC 19) — dummy + gap pointers
4. **Palindrome Linked List** (LC 234) — middle + reverse + compare
5. **Reorder List** (LC 143) — middle + reverse + interleave
6. **Reverse Linked List II** (LC 92) — sublist reversal
7. **Reverse Nodes in k-Group** (LC 25) — the boss

---

## Traps

- Overwriting `.next` before saving it.
- Forgetting to null-terminate after splitting a list → cycle.
- Returning `head` instead of `dummy.next` (or instead of `prev`, after a reversal).
- Off-by-one when walking to a position: to reach the node **before** position `left`,
  step `left - 1` times from the dummy.
- Not handling `head = None` or a single node.
