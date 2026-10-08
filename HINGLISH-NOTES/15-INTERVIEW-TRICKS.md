# 15 — Interview Tricks (Industry ka asli sach)

> Ye file algorithms ke baare me nahi hai. Ye **us cheez** ke baare me hai jo
> LeetCode nahi sikhata, par selection isi se hoti hai.

---

## Part 1 — Sach jo koi nahi batata

```
+------------------------------------------------------------------+
| Interviewer ye NAHI dekh raha:                                    |
|   - Kya tumne optimal solution nikaala                            |
|   - Kya code compile hota hai                                     |
|   - Kya tumne 500 problems kiye hain                              |
|                                                                    |
| Interviewer YE dekh raha hai:                                     |
|   - Kya tum stuck hone pe SOCHTE ho ya freeze ho jaate ho         |
|   - Kya tumhare saath 8 ghante kaam kiya jaa sakta hai            |
|   - Kya tum apni soch BOL sakte ho                                |
|   - Kya tum hint LE sakte ho bina defensive hue                   |
+------------------------------------------------------------------+
```

**Suboptimal solution + acchi communication** > **optimal solution + chup rehna.**
Ye har senior interviewer bolega. Log maante nahi.

---

## Part 2 — 45 minute ka blueprint (minute by minute)

```
0-5 min    CLARIFY
           "Input ka size range kya hai?"
           "Duplicates ho sakte hain?"
           "Sorted hai?"
           "Empty input pe kya return karoon?"
           "Negative numbers?"
           1-2 example khud banao aur confirm karo

5-10 min   BRUTE FORCE
           "Sabse simple tareeka ye hai: ___. Uski complexity O(n²) hai."
           ⚠️ Isko code MAT karo. Sirf bolo.

10-15 min  OPTIMIZE
           "Yahan main ___ baar-baar compute kar raha hoon.
            Agar isko ___ me store kar loon to O(n) ho jaayega."
           Approach confirm karo: "Ye theek lag raha hai? Code karoon?"

15-35 min  CODE
           Bolte hue likho. Silence 30 second se zyada nahi.
           Helper functions banao. Variable names theek rakho.

35-42 min  TEST
           Chhota example lo, LINE BY LINE trace karo.
           Edge cases: [], [1], duplicates, all-same, negatives

42-45 min  DISCUSS
           "Time O(n), space O(n). Agar memory constraint ho to ___ kar sakte hain."
```

> **Sabse badi galti:** minute 5 pe hi code karne lag jaana.
> Aur minute 35 pe pata chale ki approach hi galat thi.
> **10 minute planning = 30 minute bachte hain.**

---

## Part 3 — Clarifying questions ki list (ratt lo)

```
INPUT ke baare me:
  □ n ka range?  (isse complexity target milta hai!)
  □ Values ka range? Negative? Zero? Float?
  □ Sorted hai?
  □ Duplicates allowed?
  □ Input modify kar sakta hoon (in-place)?
  □ Empty / null aa sakta hai?

OUTPUT ke baare me:
  □ Kya return karna hai — value, index, ya array?
  □ Multiple answers ho to koi bhi chalega ya specific?
  □ Answer exist nahi karta to kya? (-1? null? empty array?)
  □ Order maayne rakhta hai?

CONSTRAINTS:
  □ Memory ki koi limit hai?
  □ Input stream me aayega ya pura available hai?
  □ Function baar-baar call hoga? (to preprocessing worth hai)
```

> **`n` ka range poochna sabse valuable sawaal hai.**
> Wo direct pattern bata deta hai ([01-complexity-oracle.md](01-complexity-oracle.md) dekho).

---

## Part 4 — Stuck ho gaye to — 6 recovery moves

Ye ratt lo. Blank ho jaane pe inme se koi ek bolo:

```
1. "Chalo ek chhota example manually solve karta hoon"
   -> Aksar pattern khud dikh jaata hai

2. "Brute force kya hai? Usme main kya repeat kar raha hoon?"
   -> Repeat = optimization ka target. HAMESHA.

3. "Agar input SORTED hota to kya karta?"
   -> Two pointer / binary search unlock ho jaata hai

4. "Kya main kuch PRE-COMPUTE kar sakta hoon?"
   -> Prefix sum, hashmap, frequency array

5. "Ye kis pattern jaisa lag raha hai jo maine pehle dekha ho?"
   -> Loud bolo — interviewer nudge dega

6. "Main thoda stuck hoon. Kya main aapke saath soch share kar sakta hoon?"
   -> Ye WEAKNESS nahi hai. Real job me bhi yahi karte hain.
```

**Kabhi mat karo:** chup baith jaana, ya "mujhe nahi aata" bol dena.
Interviewer help karna chahta hai — usko mauka do.

---

## Part 5 — Code quality jo interviewer notice karta hai

### ✅ Achha code

```js
function findPairWithSum(nums, target) {
  const seenValues = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seenValues.has(complement)) {
      return [seenValues.get(complement), i];
    }
    seenValues.set(nums[i], i);
  }

  return [];
}
```

### ❌ Bura code

```js
function f(a, t) {
  let m = {};
  for (let i = 0; i < a.length; i++) {
    if (m[t - a[i]] !== undefined) return [m[t - a[i]], i];
    m[a[i]] = i;
  }
  return [];
}
```

Dono same algorithm hain. **Pehla hire hota hai.**

```
Checklist:
  □ Naam matlab wale ho (complement, seenValues) — a, t, m nahi
  □ Early return karo, nesting kam rakho
  □ Magic numbers ko constant banao
  □ Complex condition ko variable me daalo:
        const isValid = left < right && arr[left] !== arr[right];
  □ Helper function banao agar 5+ line ka logic ho
  □ Consistent style (semicolon, spacing)
```

---

## Part 6 — Edge cases jo hamesha check karo

```
ARRAY:
  []                khaali
  [1]               ek element
  [1, 1, 1]         sab same
  [5, 4, 3, 2, 1]   reverse sorted
  [-1, -5]          negatives
  Very large n      overflow / TLE

STRING:
  ""                khaali
  "a"               ek char
  "aaa"             sab same
  Case sensitivity? Spaces? Special chars? Unicode?

TREE:
  null              khaali tree
  single node
  skewed (linked list jaisa)  <- yahan recursion depth issue
  complete / balanced

LINKED LIST:
  null
  ek node
  do node           <- even-length bugs yahan pakde jaate hain
  cycle

GRAPH:
  disconnected components     <- ye sabse zyada miss hota hai
  self-loop
  cycle
  single node
  empty graph
```

> **Trick:** code likhne se **pehle** ye bolo:
> *"Main edge cases pe pehle soch leta hoon: empty, single element, duplicates."*
> Baad me pakde jaane se pehle bolna 10x better hai.

---

## Part 7 — JavaScript-specific gotchas (tumhare liye important)

```js
// 1. sort() default STRING sort karta hai 💀
[10, 9, 1].sort()               // [1, 10, 9]   GALAT
[10, 9, 1].sort((a, b) => a-b)  // [1, 9, 10]   ✅

// 2. shift() O(n) hai — BFS me kabhi mat use karo
q.shift()          // ❌ O(n)
q[head++]          // ✅ O(1)

// 3. 2D array banane ka sahi tareeka
new Array(3).fill(new Array(3).fill(0))          // ❌ teeno SAME reference!
Array.from({length: 3}, () => new Array(3).fill(0))  // ✅

// 4. Object key hamesha string ban jaati hai
const m = {}; m[1] = 'a'; Object.keys(m)     // ['1'] — string!
const m = new Map(); m.set(1, 'a');          // ✅ Map me 1 number hi rehta hai

// 5. Integer division
5 / 2         // 2.5
Math.floor(5/2)   // 2  ✅
5 >> 1            // 2  ✅ (positive numbers ke liye, faster)

// 6. Number precision
0.1 + 0.2 === 0.3         // false 💀
Number.MAX_SAFE_INTEGER   // 2^53 - 1, isse aage precision jaati hai

// 7. Array copy shallow hota hai
const b = [...a];        // 1 level deep only
const b = a.map(r => [...r]);   // 2D ke liye

// 8. undefined vs 0 — dono falsy
if (map.get(k)) { }         // 0 pe bhi false! 💀
if (map.has(k)) { }         // ✅ sahi check
```

---

## Part 8 — Complexity kaise present karein

❌ *"O(n) hai"*

✅ *"Time complexity O(n) hai kyunki hum array pe ek hi pass kar rahe hain,
aur har element pe constant kaam. Space O(n) worst case me,
jab saare elements distinct hon aur hashmap me chale jaayein."*

**Formula:** `O(...) hai KYUNKI ___, aur worst case ye tab hota hai jab ___.`

### Trade-off bhi bolo
> *"Ye O(n) time O(n) space hai. Agar memory tight ho to sort karke
> two-pointer kar sakte hain — O(n log n) time par O(1) space.
> Depend karta hai ki kya constrained hai."*

Ye ek line se tum "coder" se "engineer" ban jaate ho.

---

## Part 9 — Behavioural ke liye 3 line

Coding round ke baad ye poocha jaata hai. **Ready rakho:**

```
1. "Ek mushkil bug jo tumne fix kiya?"
   -> Situation, kya try kiya, kaise root cause mila, kya seekha

2. "Team me disagreement hua ho?"
   -> Dono side samjhe, data se decide kiya, aage badhe

3. "Tumse koi galti hui ho?"
   -> Maana, fix kiya, process badla taaki dobara na ho
```

Format: **STAR** — Situation, Task, Action, Result. 2 minute se zyada nahi.

---

## Part 10 — Interview se ek din pehle

```
✅ KARO:
  □ [16-REVISION-SHEET.md](16-REVISION-SHEET.md) padho — 20 minute
  □ 5 templates HAATH SE type karo (BFS, binary search, DFS, backtrack, DP)
  □ 1-2 easy problem karo — confidence ke liye
  □ Setup test karo (camera, mic, coding platform)
  □ So jao. Neend > ek extra problem.

❌ MAT KARO:
  □ Nayi hard problem attempt karna (confidence tootegi)
  □ Raat bhar padhna
  □ Nayi topic shuru karna
```

---

## Part 11 — Aakhri baat

```
Interview me fail hona = us din, us problem pe, us interviewer ke saath
                         tumhara performance theek nahi tha.

Interview me fail hona ≠ tum bure engineer ho.

Best log bhi reject hote hain. Google ka average hire rate ~2% hai.
Numbers ka game hai. Khelte raho.
```

**Har interview ke baad likho:**
```
Kya poocha gaya   :
Kahan atka        :
Kya seekha        :
Agli baar kya alag:
```

Ye file 6 mahine me tumhari sabse valuable file ban jaayegi.

---
Aakhri: [16-REVISION-SHEET.md](16-REVISION-SHEET.md)
