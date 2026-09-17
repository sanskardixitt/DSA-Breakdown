# Linked Lists — Notes

Linked list problems are rarely *algorithmically* hard. They're **pointer-manipulation hard**. The
difficulty is entirely in not losing your references and not off-by-one-ing your loop bounds.

---

## The node

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
```

---

## Why linked lists exist (and when they lose)

| | Array | Linked list |
|---|---|---|
| Access `i`-th | **O(1)** | O(n) |
| Insert/delete at a known node | O(n) (shifting) | **O(1)** |
| Insert/delete at the front | O(n) | **O(1)** |
| Memory locality | **excellent** | poor (pointer chasing) |
| Extra memory | none | one pointer per node |

**The honest summary:** in real code, arrays win almost always because of cache locality. Linked lists
matter in interviews (pointer reasoning), in LRU caches (O(1) splice with a node reference), and inside
allocators/schedulers.

> Note the precondition on that O(1) insert/delete: you must **already have a reference** to the node.
> Finding it is still O(n). That's why the useful structure is usually *hash map → node*, which is
> exactly how LRU Cache works.

---

## The three techniques that solve 90% of these problems

### 1. The dummy (sentinel) head

```python
dummy = ListNode(0, head)
# ... build/modify from `dummy` ...
return dummy.next
```

**Use it whenever the head might change** — insertion at the front, deletion of the head, merging,
partitioning, removing duplicates. It eliminates every `if node is head:` special case.

If you take one thing from this file: **when in doubt, add a dummy.** It has never made a solution
worse and it removes the most common class of bug here.

### 2. Fast & slow pointers
Middle, cycle detection, nth-from-end. → [../02-two-pointers/pattern-fast-slow.md](../02-two-pointers/pattern-fast-slow.md)

### 3. Iterative reversal
The three-pointer dance. → [pattern-dummy-and-reversal.md](pattern-dummy-and-reversal.md)

---

## The universal traversal skeleton

```python
cur = head
while cur:
    # do something with cur
    cur = cur.next
```

With a lagging pointer (needed for deletion):
```python
prev, cur = None, head
while cur:
    nxt = cur.next
    # ... possibly rewire cur ...
    prev, cur = cur, nxt
```

> **The habit that prevents most bugs:** before you overwrite any `.next`, save it in a local
> variable. `nxt = cur.next` on the first line of the loop body, always.

---

## Recognition triggers

| Statement says... | Technique |
|---|---|
| "reverse the list" (or part of it) | Iterative three-pointer reversal |
| "middle of the list" | Fast/slow |
| "cycle" | Floyd's fast/slow |
| "nth from the end" | Gap pointers |
| "merge two sorted lists" | Dummy + two pointers |
| "remove / insert nodes" | Dummy head |
| "reorder", "palindrome list" | Find middle → reverse second half → merge/compare |
| "sort the list" in O(n log n), O(1) space | Merge sort on lists |
| "deep copy with random pointers" | Hash map `old node -> new node` |
| "LRU / LFU cache" | Doubly linked list + hash map |
| "flatten a multilevel list" | Recursion or explicit stack |
| "add two numbers" | Simultaneous traversal + carry |

---

## The composite pattern (worth memorising as a unit)

Several medium problems are the **same three steps**:

```
1. Find the middle          (fast/slow)
2. Reverse the second half  (three-pointer)
3. Merge / compare the two halves
```

This solves:
- **Reorder List** (LC 143) — interleave the halves
- **Palindrome Linked List** (LC 234) — compare the halves
- **Maximum Twin Sum** (LC 2130) — sum paired nodes

```python
def reorder_list(head):
    # 1 — find the end of the FIRST half
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    # 2 — reverse the second half, and cut the link
    second = slow.next
    slow.next = None                    # ⚠ essential, or you build a cycle
    prev = None
    while second:
        nxt = second.next
        second.next = prev
        prev, second = second, nxt

    # 3 — interleave
    first, second = head, prev
    while second:
        n1, n2 = first.next, second.next
        first.next = second
        second.next = n1
        first, second = n1, n2
```

> **`slow.next = None` is the line people forget.** Without it the first half still points into the
> reversed second half, and you get an infinite loop or a corrupted list.

---

## Recursion on linked lists

Elegant, but costs O(n) stack space — call it out when you use it.

```python
def reverse_recursive(head):
    if not head or not head.next:
        return head
    new_head = reverse_recursive(head.next)
    head.next.next = head        # the node ahead now points back at me
    head.next = None             # and I point at nothing (for now)
    return new_head
```

The two-line body is genuinely confusing at first. Draw it for a 3-node list once:
```
1 → 2 → 3          recurse to 3, new_head = 3
1 → 2 ← 3          head=2: head.next.next = head  (3 → 2)
1 → 2 ← 3          head=2: head.next = None       (2 ↛ 3)
1 ← 2 ← 3          head=1: same two lines
```

For a 10⁵-node list this hits Python's recursion limit. **Prefer iterative.**

---

## Traps

```python
# ❌ Losing the rest of the list
cur.next = prev          # the original cur.next is now unreachable
# ✅
nxt = cur.next
cur.next = prev
cur = nxt

# ❌ Not handling an empty list or a single node
# Almost every linked list problem tests head = None.

# ❌ Creating a cycle by forgetting to null-terminate after splitting

# ❌ `while cur.next` vs `while cur` — decide which node you need to STOP on:
#     - stop ON the last node       → while cur.next
#     - process EVERY node          → while cur

# ❌ Comparing nodes with == instead of `is` (identity is what you mean)
```

---

## Debugging technique

**Draw it.** Every time. Boxes and arrows, for a 4-node list, with the pointer names labelled at each
step. Nobody solves these reliably in their head, and the people who look like they do are drawing it
mentally in a way they've practised on paper first.

---

## Files here

- [pattern-dummy-and-reversal.md](pattern-dummy-and-reversal.md)
- [problems.md](problems.md)
