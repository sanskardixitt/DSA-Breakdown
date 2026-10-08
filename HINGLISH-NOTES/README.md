# 🔥 DSA Hinglish Notes — Pattern Pehchano, Ratto Mat

> **Asli problem ye nahi hai ki tumhe concepts nahi aate. Asli problem ye hai ki
> problem padhne ke baad 60 second me dimaag me sahi pattern nahi aata.**

Ye folder us gap ko bharne ke liye hai. Har file ek pattern hai, aur har pattern me:

- **Kab lagana hai** (trigger words — problem statement me ye shabd dikhe to ye pattern)
- **Diagram** (dikhega to yaad rahega, definition se nahi)
- **Template** (JavaScript me, kyunki tum JS likhte ho)
- **Dry run** (ek example pe line-by-line)
- **Galtiyan** (jahan 90% log fasste hain)
- **Interview trick** (jo industry me actually kaam aata hai)

---

## 📖 Padhne ka order

| # | File | Kya milega |
|---|---|---|
| 00 | [00-START-HERE.md](00-START-HERE.md) | Mindset + 60-second recognition drill + revision system |
| 01 | [01-complexity-oracle.md](01-complexity-oracle.md) | Constraint dekh ke pattern guess karna (sabse bada hack) |
| 02 | [02-arrays-hashing.md](02-arrays-hashing.md) | HashMap, prefix sum, frequency counting |
| 03 | [03-two-pointers.md](03-two-pointers.md) | Opposite ends, fast-slow, dutch flag |
| 04 | [04-sliding-window.md](04-sliding-window.md) | Fixed + variable window |
| 05 | [05-binary-search.md](05-binary-search.md) | Array pe + **answer pe** (ye asli game hai) |
| 06 | [06-monotonic-stack.md](06-monotonic-stack.md) | Next greater / smaller, histogram |
| 07 | [07-linked-list.md](07-linked-list.md) | Dummy node, reversal, cycle |
| 08 | [08-trees.md](08-trees.md) | DFS/BFS, BST, "return upar bhejo" soch |
| 09 | [09-heaps.md](09-heaps.md) | Top-K, two heaps, merge k lists |
| 10 | [10-backtracking.md](10-backtracking.md) | Subsets, permutations, choose-explore-unchoose |
| 11 | [11-graphs.md](11-graphs.md) | Grid, topo sort, union-find, dijkstra |
| 12 | [12-dynamic-programming.md](12-dynamic-programming.md) | DP ka DNA — 5 sub-patterns |
| 13 | [13-greedy-intervals.md](13-greedy-intervals.md) | Sort karke sweep |
| 14 | [14-bit-manipulation.md](14-bit-manipulation.md) | XOR tricks, bitmask |
| 15 | [15-INTERVIEW-TRICKS.md](15-INTERVIEW-TRICKS.md) | Industry practice — bolna kaise hai, edge cases, code quality |
| 16 | [16-REVISION-SHEET.md](16-REVISION-SHEET.md) | Ek page — poori DSA ka nichod |

---

## Diagrams (editable Excalidraw)

| File | Kya hai |
|---|---|
| [pattern-decision-map](diagrams/pattern-decision-map.excalidraw) | **Master map** - poori DSA ka decision tree + constraint oracle. Ye print karke deewar pe laga do. |
| [pointer-family](diagrams/pointer-family.excalidraw) | Opposite-ends vs Fast-slow vs Monotonic stack |
| [sliding-window-longest-vs-shortest](diagrams/sliding-window-longest-vs-shortest.excalidraw) | Window ke do shapes ka side-by-side farak |
| [dp-thinking-ladder](diagrams/dp-thinking-ladder.excalidraw) | DP ki 5 seedhiyan + 5 sub-patterns |

Kholne ka tareeka [diagrams/README.md](diagrams/README.md) me hai
(short version: VS Code me "Excalidraw" extension, ya excalidraw.com par File - Open).

---

## Note: code JavaScript me hai

Repo ke baaki notes (`00-foundations/` se `13-bit-manipulation/`) Python me hain.
Ye Hinglish notes **JavaScript** me hain, kyunki tumhara actual code
([Dsa problem solved/](../Dsa%20problem%20solved/)) JS me hai.

Isliye yahan JS-specific traps bhi cover kiye hain jo Python notes me nahi milenge:

- `shift()` O(n) hai — BFS me TLE ka #1 kaaran
- `sort()` bina comparator numbers ko string ki tarah sort karta hai
- JS me built-in heap **nahi** hai — interview me kya bolna hai
- Bitwise operators 32-bit signed hain
- `new Array(3).fill(new Array(3))` = teeno same reference

Dono set ek hi patterns padhate hain. **English/Python** chahiye to root folder,
**Hinglish/JS** chahiye to ye folder.

---

## ⚡ Rule number 1

**Template kabhi copy-paste mat karna. Haath se type karna.**
Interview me tumhare paas copy-paste nahi hoga. Muscle memory hi bachayegi.

## ⚡ Rule number 2

**Code likhne se pehle complexity bolo.** Agar nahi bol paa rahe, matlab plan hi nahi hai.
Aur plan ke bina code = 40 minute barbaad.

## ⚡ Rule number 3

**Brute force pehle, hamesha.** Ek line me bolo: "main har pair check karunga, O(n²)".
Fir poocho: "main kya cheez baar-baar dobara calculate kar raha hoon?"
**Us sawaal ka jawab hi optimization hai.** Har baar. Bina exception ke.
