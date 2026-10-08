# Your Solutions

One file per problem. **This directory is the most valuable thing in the repo** — not because of the
code, but because of the reflection blocks.

---

## Naming

```
solutions/
├── 0001-two-sum.py
├── 0003-longest-substring-without-repeating.py
├── 0015-3sum.py
└── ...
```

Zero-padded LeetCode number + kebab-case name. Sorting is then automatic.

---

## The file template

Copy this every time.

```python
"""
LeetCode 3 — Longest Substring Without Repeating Characters
https://leetcode.com/problems/longest-substring-without-repeating-characters/
Difficulty: Medium
Pattern: Sliding window (variable size, Shape A)
Date: 2026-08-15

--- PROBLEM (in my own words) ---
Given a string, find the length of the longest substring with no repeated characters.

--- BRUTE FORCE ---
Check every substring, test each for duplicates. O(n^3) time, O(n) space.

--- OPTIMAL APPROACH ---
Sliding window with a set of the characters currently inside it. Expand `right`; while the incoming
character is already in the set, shrink from `left`. Record the length after every expansion.
O(n) time, O(min(n, charset)) space.
"""


def length_of_longest_substring(s: str) -> int:
    seen = set()
    left = 0
    best = 0

    for right, ch in enumerate(s):
        while ch in seen:
            seen.remove(s[left])
            left += 1
        seen.add(ch)
        best = max(best, right - left + 1)

    return best


# --- TESTS ---
if __name__ == "__main__":
    assert length_of_longest_substring("abcabcbb") == 3
    assert length_of_longest_substring("bbbbb") == 1
    assert length_of_longest_substring("pwwkew") == 3
    assert length_of_longest_substring("") == 0
    assert length_of_longest_substring("a") == 1
    print("all passed")


# =====================================================================
# REFLECTION
# =====================================================================
# Pattern:            Sliding window, variable size, "longest" shape
# Trigger I should
#   have caught:      "longest substring such that <condition>"
# Where I got stuck:  Initially tried to jump `left` past the duplicate but forgot the
#                     `>= left` guard, so `left` moved backwards on repeated characters.
# Time taken:         18 min
# Needed a hint:      No
# Re-solve on:        day+3 = 2026-08-18   |   day+10 = 2026-08-25
```

---

## Why the reflection block is the point

The code is not what you're building here. **The reflection is.**

In three weeks you'll have 60 of these. Reading the "Trigger I should have caught" line across all of
them — in one sitting — is the single highest-return hour of the entire month. It's how the pattern
lookup table gets built in your head.

Specifically:

- **"Pattern"** — forces you to name the technique, which is what recall needs.
- **"Trigger I should have caught"** — this is *the* line. It builds the phrase → pattern mapping
  that makes you fast.
- **"Where I got stuck"** — the same bug will show up again. Written down, you'll catch it next time.
- **"Re-solve on"** — makes the spaced repetition concrete instead of aspirational.

Do not skip it because you're tired at the end of a session. Skipping it turns 30 days of work into
30 days of forgetting.

---

## Running your tests

```powershell
python solutions/0003-longest-substring-without-repeating.py
```

Always include:
- The examples from the problem statement
- The empty input
- A single element
- The largest/smallest legal values
- One case you had to think about

Writing your own tests catches more than LeetCode's "Run" button and builds the habit of adversarial
thinking about your own code.

---

## A weekly habit

Every Sunday, run through the week's reflection blocks and copy the "trigger" lines into a single
scratch list. If two problems share a trigger, you've found a pattern. If a trigger surprised you,
that's your next review target.
