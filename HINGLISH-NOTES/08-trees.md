# 08 — Trees (Binary Tree + BST)

> **Ek line ka funda:** *Tree = recursion ka natural ghar.
> Har node pe sirf ek sawaal poocho: "mere bachche mujhe KYA batayein,
> taaki main apne parent ko kuch bata sakoon?"*

---

## Setup

```js
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val; this.left = left; this.right = right;
  }
}
```

---

## Part 1 — Recursion ka mental model (sabse important section)

Tree recursion likhne ka **3-step formula**. Har baar yahi.

```
+----------------------------------------------------------+
|  1. BASE CASE   : node null hai to kya return karoon?     |
|  2. BACHCHON SE : left aur right se kya maangoon?         |
|  3. MERA KAAM   : unke jawab se apna jawab kaise banaoon? |
+----------------------------------------------------------+
```

### Example — Max Depth

```
1. null pe depth = 0
2. left se uski depth, right se uski depth
3. mera answer = 1 + max(dono)
```

```js
function maxDepth(root) {
  if (!root) return 0;                                    // 1
  const l = maxDepth(root.left), r = maxDepth(root.right); // 2
  return 1 + Math.max(l, r);                              // 3
}
```

**Har tree problem isi saanche me fit hoti hai.** Bas 1-2-3 ke jawab badalte hain:

| Problem | Base | Bachchon se | Mera kaam |
|---|---|---|---|
| Max depth | 0 | dono ki depth | `1 + max` |
| Node count | 0 | dono ka count | `1 + l + r` |
| Sum | 0 | dono ka sum | `val + l + r` |
| Same tree? | dono null = true | dono subtree same? | `val equal && l && r` |
| Balanced? | height 0 | dono ki height | `abs(l-r) <= 1` |
| Invert | null | invert dono | swap kar do |

---

## Part 2 — DFS Traversals (teen order)

```
        1
       / \
      2   3
     / \
    4   5

PREORDER   (root, left, right)  =  1 2 4 5 3    <- "root pehle" -> copy/serialize
INORDER    (left, root, right)  =  4 2 5 1 3    <- BST me SORTED aata hai ⭐
POSTORDER  (left, right, root)  =  4 5 2 3 1    <- "bachche pehle" -> delete, bottom-up calc
```

```js
// bas ek line ki jagah badalti hai
function dfs(node, out) {
  if (!node) return;
  // out.push(node.val);        <- PREORDER yahan
  dfs(node.left, out);
  // out.push(node.val);        <- INORDER yahan
  dfs(node.right, out);
  // out.push(node.val);        <- POSTORDER yahan
}
```

### Kaunsa kab use karein

| Chahiye | Traversal | Kyun |
|---|---|---|
| Tree copy / serialize | **Preorder** | Root pehle chahiye rebuild ke liye |
| BST ke elements sorted | **Inorder** | BST ki property |
| Height, sum, "bachchon ka data chahiye" | **Postorder** | Bottom-up |
| Level by level | **BFS** | Queue |

> **Sabse kaam ki line:** *BST ka inorder = sorted array.*
> "BST me kth smallest", "validate BST", "two sum in BST" — sab isi se.

---

## Part 3 — BFS / Level Order (queue)

### Trigger words
- "**level** by level"
- "**shortest** path / minimum steps"
- "right side view", "zigzag", "average of levels"

```
        3
       / \
      9   20
         /  \
        15   7

Level 0: [3]
Level 1: [9, 20]
Level 2: [15, 7]
```

### Template — "level size" trick

```js
function levelOrder(root) {
  if (!root) return [];
  const res = [], q = [root];
  let head = 0;                              // ⚠️ shift() O(n) hai — pointer use karo

  while (head < q.length) {
    const size = q.length - head;            // 🔑 IS level me kitne node hain
    const level = [];
    for (let i = 0; i < size; i++) {         // sirf itne hi process karo
      const node = q[head++];
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(level);
  }
  return res;
}
```

> **`const size = q.length` — ye ek line hi BFS ka poora raaz hai.**
> Isse tumhe pata chalta hai ki current level kahan khatam hota hai,
> jabki tum usi queue me next level bhi daal rahe ho.

**Variants (sirf inner loop badlo):**
- **Right side view** → `if (i === size - 1) res.push(node.val)`
- **Zigzag** → alternate levels pe `level.reverse()`
- **Average of level** → `level` ka sum / size

### JS performance note

```js
q.shift()      // O(n) — 10^5 nodes pe TLE 💀
q[head++]      // O(1) — hamesha yahi use karo ✅
```

---

## Part 4 — BST (Binary Search Tree)

### Property
```
        8
       / \
      3   10
     / \    \
    1   6    14

Har node pe:   left subtree ke SAB < node  <  right subtree ke SAB
```

### Search — O(h), h = height

```js
function searchBST(root, val) {
  while (root) {
    if (root.val === val) return root;
    root = val < root.val ? root.left : root.right;   // aadha tree cut ✅
  }
  return null;
}
```

### ⚠️ Validate BST — sabse common bug

**Galat approach:** sirf `node.left.val < node.val` check karna.

```
        5
       / \
      1   6
         / \
        4   7      <-- 4 galat hai! 5 ke right me hai par 5 se chhota
                       Par local check "4 < 6" pass ho jaata hai 💀
```

**Sahi approach:** har node ke saath **range** neeche bhejo.

```js
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val)      // left ka max = mera val
      && isValidBST(root.right, root.val, max);    // right ka min = mera val
}
```

```
                    (-inf, +inf)
                        5
              (-inf,5) / \ (5,+inf)
                    1     6
                        (5,6)/ \ (6,+inf)
                            4    7
                            ^
                    4 is (5,6) me nahi -> FALSE ✅
```

> **Generalize:** "parent se child ko context bhejna" = **top-down DFS with parameters.**
> Postorder = bottom-up, ye = top-down. Dono soch alag hai — pehchano kaunsi chahiye.

### Kth Smallest in BST — inorder + counter

```js
function kthSmallest(root, k) {
  const st = [];
  let cur = root;
  while (cur || st.length) {
    while (cur) { st.push(cur); cur = cur.left; }   // left tak jao
    cur = st.pop();
    if (--k === 0) return cur.val;                  // kth mil gaya, early exit
    cur = cur.right;
  }
}
```
> Iterative inorder likhna aana chahiye — "O(k) me early return karo" wali requirement
> recursion me handle karna gandaa lagta hai.

---

## Part 5 — Lowest Common Ancestor (LCA)

### BST me (aasan) — LC 235
```js
function lowestCommonAncestor(root, p, q) {
  while (root) {
    if (p.val < root.val && q.val < root.val) root = root.left;   // dono left me
    else if (p.val > root.val && q.val > root.val) root = root.right;
    else return root;                                    // yahan raaste alag hue = LCA
  }
}
```

### Normal binary tree me — LC 236
```js
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const l = lowestCommonAncestor(root.left, p, q);
  const r = lowestCommonAncestor(root.right, p, q);
  if (l && r) return root;      // dono taraf mila -> yahi LCA
  return l || r;                // ek hi taraf mila -> wahi upar bhejo
}
```
> **Elegant hai:** "dono taraf se kuch mila to main hi LCA hoon."

---

## Part 6 — "Do return values" pattern (advanced, high value)

Kabhi-kabhi node ko **do cheezein** upar bhejni padti hain:
ek jo **global answer** me contribute kare, ek jo **parent use kar sake**.

### Diameter of Binary Tree (LC 543)

```
Har node pe DO cheezein:
  1. Mere through jaane wala longest path = leftDepth + rightDepth   -> GLOBAL best
  2. Parent ko main kya doon = 1 + max(left, right)                  -> RETURN

Ye do alag cheezein hain! Isko na samajhna hi common galti hai.
```

```js
function diameterOfBinaryTree(root) {
  let best = 0;
  function depth(node) {
    if (!node) return 0;
    const l = depth(node.left), r = depth(node.right);
    best = Math.max(best, l + r);      // (1) mere through path -> global
    return 1 + Math.max(l, r);         // (2) parent ke liye
  }
  depth(root);
  return best;
}
```

### Max Path Sum (LC 124) — same shape, thoda aur
```js
function maxPathSum(root) {
  let best = -Infinity;
  function gain(node) {
    if (!node) return 0;
    const l = Math.max(gain(node.left), 0);    // negative gain lena hi mat
    const r = Math.max(gain(node.right), 0);
    best = Math.max(best, node.val + l + r);   // mere through path
    return node.val + Math.max(l, r);          // parent ko: ek hi branch
  }
  gain(root);
  return best;
}
```

> **Ye pattern pehchano:** *"path kahin se kahin bhi ho sakta hai"* → global variable + do return values.
> Diameter, max path sum, longest univalue path — sab isi shape ke hain.

---

## Common galtiyan

| Galti | Fix |
|---|---|
| `if (!root) return` bhoolna | Har recursion ki pehli line |
| BFS me `shift()` | `q[head++]` |
| BFS me `size` capture na karna | Levels mix ho jaayenge |
| Validate BST me local check | Range (min, max) pass karo |
| Diameter me path aur depth confuse | Do alag values hain |
| Skewed tree ka space bhoolna | O(h), worst case O(n) — bol do |

---

## Problems

| # | Problem | Pattern |
|---|---|---|
| 104 | Max Depth | Basic recursion |
| 226 | Invert Tree | Basic |
| 100/101 | Same / Symmetric Tree | Do tree saath |
| 110 | Balanced Tree | Postorder + early exit |
| 543 | Diameter | Do return values |
| 102 | Level Order | BFS |
| 199 | Right Side View | BFS variant |
| 98 | Validate BST | Range pass |
| 230 | Kth Smallest BST | Inorder |
| 235/236 | LCA (BST / Tree) | Both |
| 105 | Build from Pre+Inorder | Divide & conquer |
| 124 | Max Path Sum | Do return values (hard) |
| 297 | Serialize/Deserialize | Preorder + null markers |

---
Agla: [09-heaps.md](09-heaps.md)
