# Pattern — String DP (Two Sequences & Expansion)

---

## Family A — Two sequences: `dp[i][j]`

### How do I know?

- **Two** strings/arrays are given, and you're comparing or aligning them
- "**longest common** subsequence/substring"
- "**edit distance**", "minimum operations to convert A into B"
- "**is s3 an interleaving** of s1 and s2"
- "distinct **subsequences**"
- "regular expression / wildcard **matching**"

### The universal state

> **`dp[i][j]` = the answer considering the first `i` characters of `a` and the first `j` of `b`.**

The grid is `(m+1) × (n+1)`; row/column 0 means "empty prefix". Using the `+1` sizing removes every
boundary special case.

### The universal shape

```python
dp = [[0] * (n + 1) for _ in range(m + 1)]

for i in range(1, m + 1):
    for j in range(1, n + 1):
        if a[i-1] == b[j-1]:                  # ⚠ i-1, j-1 — dp is 1-indexed, strings are 0-indexed
            dp[i][j] = <something with dp[i-1][j-1]>
        else:
            dp[i][j] = <combination of dp[i-1][j] and dp[i][j-1]>
```

**Every two-sequence DP is this.** Only the base row/column and the two branch bodies change.

---

## Longest Common Subsequence (LC 1143) ⭐

```python
def longest_common_subsequence(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1           # match → extend the diagonal
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # skip one char from either string

    return dp[m][n]
```
**O(m·n) time and space** → O(min(m,n)) space with rolling rows.

### The table for `a = "abcde"`, `b = "ace"`

```
        ""  a   c   e
    ""   0  0   0   0
    a    0  1   1   1
    b    0  1   1   1
    c    0  1   2   2
    d    0  1   2   2
    e    0  1   2   3   ← answer
```

**Build this table by hand once.** Fifteen minutes with a pen teaches more than reading the code five
times. Notice how a match moves *diagonally* (both strings advance) and a mismatch moves *sideways*
(one string advances).

> **LCS is the parent of a whole family:**
> - **Longest Palindromic Subsequence** = `LCS(s, reversed(s))`
> - **Minimum deletions to make two strings equal** = `m + n - 2·LCS`
> - **Shortest Common Supersequence** length = `m + n - LCS`
> - **Longest Increasing Subsequence** on distinct values = `LCS(nums, sorted(nums))`
>
> Four problems for free once you know one. Memorise the identities, not four algorithms.

---

## Edit Distance (LC 72) ⭐

> Minimum insert/delete/replace operations to turn `a` into `b`.

```python
def min_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1): dp[i][0] = i           # delete all i chars
    for j in range(n + 1): dp[0][j] = j           # insert all j chars

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1]           # free — no operation needed
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],      # DELETE a[i-1]
                    dp[i][j-1],      # INSERT b[j-1]
                    dp[i-1][j-1],    # REPLACE a[i-1] with b[j-1]
                )
    return dp[m][n]
```

### The three moves, geometrically

```
    dp[i-1][j-1] ──replace──► dp[i][j]
         │                        ▲
      insert                   delete
         │                        │
         ▼                        │
    dp[i-1][j] ─────────────────►
```

- **Up** (`dp[i-1][j]`) — consumed a char of `a`, none of `b` → **delete**
- **Left** (`dp[i][j-1]`) — consumed a char of `b`, none of `a` → **insert**
- **Diagonal** (`dp[i-1][j-1]`) — consumed one of each → **match** (free) or **replace** (cost 1)

**Base cases matter here.** `dp[i][0] = i` (delete everything) and `dp[0][j] = j` (insert everything).
Leaving them at 0 is the most common bug in this problem.

---

## Distinct Subsequences (LC 115)

> How many distinct subsequences of `s` equal `t`?

```python
def num_distinct(s, t):
    m, n = len(s), len(t)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = 1                              # one way to form the empty target: delete all

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            dp[i][j] = dp[i-1][j]                 # always: skip s[i-1]
            if s[i-1] == t[j-1]:
                dp[i][j] += dp[i-1][j-1]          # additionally: use s[i-1] to match t[j-1]
    return dp[m][n]
```

Note the asymmetry: `dp[i][j] = dp[i-1][j]` runs unconditionally, and the match only *adds*. That
reflects "you may always choose not to use this character of `s`."

---

## Family B — Expansion / interval on one string

### Longest Palindromic Substring (LC 5)

**Expand around centres — O(n²) time, O(1) space.** Simpler and faster in practice than the DP table.

```python
def longest_palindrome(s):
    if not s: return ""
    start, length = 0, 1

    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return l + 1, r - l - 1                   # (start, length) after over-stepping by one

    for i in range(len(s)):
        for l, r in ((i, i), (i, i + 1)):         # ⭐ odd centre, then even centre
            st, ln = expand(l, r)
            if ln > length:
                start, length = st, ln

    return s[start:start + length]
```

**The two centre types are the whole trick.** A palindrome has either a single middle character
(`"aba"`, odd) or a middle *pair* (`"abba"`, even). `2n - 1` possible centres, each expanded in O(n).

> **Substring vs subsequence — the distinction to keep straight:**
> - **Substring** = contiguous → expand-around-centre, or sliding window
> - **Subsequence** = non-contiguous → DP table (`LCS(s, reversed(s))`)
>
> Misreading which one a problem wants is a very common and very expensive mistake. Read the
> statement twice.

### Palindromic Substrings (LC 647) — count them all
Same expansion, `count += 1` on every successful expansion step instead of tracking a max.

### Longest Palindromic **Subsequence** (LC 516) — interval DP
```python
def longest_palindrome_subseq(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):                # ⭐ i descending, j ascending
        dp[i][i] = 1
        for j in range(i + 1, n):
            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    return dp[0][n-1]
```
**The loop order is the tricky part.** `dp[i][j]` depends on `dp[i+1][...]` — a *larger* `i` — so `i`
must be iterated **downwards**. Getting this wrong reads uninitialised zeros and silently produces
wrong answers.

> **The general rule for interval DP: iterate by increasing interval length**, or arrange the loops so
> every dependency is already computed. When in doubt, write the memoised recursion instead — it gets
> the order right automatically.

---

## Regular Expression Matching (LC 10) 🔴

```python
def is_match(s, p):
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True

    for j in range(1, n + 1):                     # patterns like a*b*c* can match ""
        if p[j-1] == '*':
            dp[0][j] = dp[0][j-2]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j-1] == '*':
                dp[i][j] = dp[i][j-2]                            # ① use the x* ZERO times
                if p[j-2] == s[i-1] or p[j-2] == '.':
                    dp[i][j] |= dp[i-1][j]                       # ② use it one MORE time
            elif p[j-1] == '.' or p[j-1] == s[i-1]:
                dp[i][j] = dp[i-1][j-1]                          # plain match
    return dp[m][n]
```

The `*` case is the whole problem: `x*` either matches zero occurrences (skip two pattern chars) or,
if the preceding pattern char matches `s[i-1]`, consumes one character of `s` and stays on the same
pattern position. Attempt this only after LCS and Edit Distance are solid.

---

## Debug checklist

- [ ] `dp` is `(m+1) × (n+1)` and I'm indexing strings with `i-1`, `j-1`.
- [ ] Base row and column initialised (they're 0 in LCS, but `i`/`j` in Edit Distance).
- [ ] Match branch vs mismatch branch: which cells does each read?
- [ ] Substring or subsequence? Expansion or table?
- [ ] Interval DP: is the loop order such that all dependencies are already filled?
- [ ] Is the answer `dp[m][n]` or `max` over the table?
