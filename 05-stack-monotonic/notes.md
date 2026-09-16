# Stack & Monotonic Stack — Notes

---

## What a stack actually gives you

LIFO. In Python it's just a `list` with `append()` / `pop()`, both O(1).

But the *reason* stacks appear in interviews isn't LIFO for its own sake. It's this:

> **A stack lets you defer a decision about an element until you have the information to make it.**

You push something you can't resolve yet. Later, when the resolving element arrives, you pop and
finish the job. That's parenthesis matching, that's the monotonic stack, that's expression evaluation,
that's iterative DFS.

---

## Recognition triggers

| Statement says... | Use |
|---|---|
| "valid parentheses", "balanced brackets" | Stack with a matching map |
| "undo", "backspace", "previous state" | Stack |
| "evaluate expression", "RPN", "calculator" | Stack (operands and/or operators) |
| "nested" structure (decode string, nested lists) | Stack |
| "**next greater**" / "**next smaller**" element | **Monotonic stack** |
| "**previous** greater/smaller element" | Monotonic stack (scan the other direction) |
| "**warmer** temperature", "days until" | Monotonic stack |
| "largest rectangle", "maximal rectangle", "trapping water" | Monotonic stack |
| "stock span", "sum of subarray minimums" | Monotonic stack |
| "min stack" / "get min in O(1)" | Two stacks, or store pairs |
| DFS without recursion | Explicit stack |

---

## Pattern 1 — Matching / balancing

```python
def is_valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for c in s:
        if c in pairs:                              # a closer
            if not stack or stack.pop() != pairs[c]:
                return False
        else:                                       # an opener
            stack.append(c)
    return not stack                                # ⚠ leftover openers = invalid
```

**The two bugs people write:** forgetting the `not stack` check (pop from empty), and forgetting the
final `not stack` (`"((("` would pass).

---

## Pattern 2 — Carry auxiliary state alongside

**Min Stack** — `getMin()` in O(1):

```python
class MinStack:
    def __init__(self):
        self.stack = []       # (value, min_so_far)

    def push(self, val):
        cur_min = min(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, cur_min))

    def pop(self):    self.stack.pop()
    def top(self):    return self.stack[-1][0]
    def getMin(self): return self.stack[-1][1]
```

> **The idea:** each entry remembers the min of the stack *at the time it was pushed*. Popping
> automatically restores the previous min, for free. No recomputation ever.
>
> Generalises to Max Stack, and to any "O(1) query of an aggregate over the current stack" question.

---

## Pattern 3 — Expression evaluation

**Reverse Polish Notation** — operands go on the stack, operators pop two:

```python
def eval_rpn(tokens):
    stack = []
    ops = {
        '+': lambda a, b: a + b,
        '-': lambda a, b: a - b,
        '*': lambda a, b: a * b,
        '/': lambda a, b: int(a / b),   # ⚠ truncate toward ZERO, not Python's floor
    }
    for t in tokens:
        if t in ops:
            b = stack.pop()             # ⚠ second operand pops FIRST
            a = stack.pop()
            stack.append(ops[t](a, b))
        else:
            stack.append(int(t))
    return stack[0]
```

Two classic traps, both here:
- **Operand order.** `a - b` requires popping `b` before `a`. Reversing them silently breaks `-` and `/`.
- **Division.** `-7 // 2 == -4` in Python, but the problem wants `-3`. Use `int(a / b)`.

---

## Pattern 4 — Nested structures

**Decode String** — `"3[a2[c]]" → "accc"`:

```python
def decode_string(s):
    stack = []                  # (string_before, repeat_count)
    cur, num = "", 0
    for c in s:
        if c.isdigit():
            num = num * 10 + int(c)      # multi-digit numbers
        elif c == '[':
            stack.append((cur, num))     # save context, start fresh
            cur, num = "", 0
        elif c == ']':
            prev, k = stack.pop()        # restore context
            cur = prev + cur * k
        else:
            cur += c
    return cur
```

> **The general shape for nested parsing:** on `[`, *push the current context and reset*.
> On `]`, *pop and merge*. Same skeleton solves Basic Calculator, Nested List Weight Sum, and
> Flatten Nested List Iterator.

---

## Pattern 5 — Stack as explicit recursion

Any recursive DFS can become a loop with a stack. Useful when recursion depth would blow up.

```python
# Recursive
def inorder(node, out):
    if not node: return
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)

# Iterative — same traversal
def inorder_iter(root):
    stack, out, cur = [], [], root
    while cur or stack:
        while cur:                  # go as far left as possible
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        out.append(cur.val)         # visit
        cur = cur.right             # then go right
    return out
```

> ⚠ For DFS with an explicit stack, push children in **reverse** order if you want left-first
> processing — the stack reverses them again.

---

## Traps

```python
# ❌ Popping without checking emptiness
x = stack.pop()          # IndexError on []

# ❌ Forgetting the final emptiness check in matching problems

# ❌ Operand order in binary operations

# ❌ Using list.pop(0) — that's a queue op and it's O(n). Use deque.

# ❌ In iterative DFS, pushing children left-to-right when you want left-first visiting
```

---

## Next

The real payload of this topic: [pattern-monotonic-stack.md](pattern-monotonic-stack.md).
Then [problems.md](problems.md).
