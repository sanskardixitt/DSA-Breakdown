# 07 — Linked List

> **Ek line ka funda:** *Linked list me algorithm easy hota hai, pointer manage karna mushkil.
> Isliye do cheezein ratt lo: **dummy node** aur **teen-pointer reversal**.
> Inse 80% linked list problems khatam.*

---

## Setup

```js
class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}
```

---

## Trick 1 — DUMMY NODE (fake head)

### Problem kya hai
Head ko delete/change karna alag case ban jaata hai. Har jagah `if (head === null)` likhna padta hai.

### Solution
Ek **nakli node** lagao head se pehle. Ab head bhi ek normal node ban gaya.

```
Bina dummy:                     Dummy ke saath:

  head                            dummy -> head
   |                                |       |
  [1]->[2]->[3]                    [X]->[1]->[2]->[3]
   ^                                ^
 special case 💀                 sab same treatment ✅

Return: dummy.next   (na ki head — head badal bhi sakta hai)
```

```js
function removeElements(head, val) {
  const dummy = new ListNode(0, head);
  let cur = dummy;
  while (cur.next) {
    if (cur.next.val === val) cur.next = cur.next.next;   // skip
    else cur = cur.next;                                  // aage badho
  }
  return dummy.next;                    // head nahi, dummy.next
}
```

> **Rule:** Agar head badal sakta hai (delete/insert/merge/reorder) → **dummy node lagao**.
> Ye sochne ki zaroorat hi nahi. Reflex bana lo.

---

## Trick 2 — REVERSAL (teen pointer)

Ye sabse zyada poocha jaane wala linked list operation hai. **Aankh band karke aana chahiye.**

```
prev   cur    next
null   [1] -> [2] -> [3] -> null

Step 1: next = cur.next     (aage ka raasta bachao)
Step 2: cur.next = prev     (teer ulta karo)
Step 3: prev = cur          (dono aage khisko)
Step 4: cur = next

        prev   cur
null <- [1]    [2] -> [3] -> null

               prev   cur
null <- [1] <- [2]    [3] -> null

                      prev   cur=null
null <- [1] <- [2] <- [3]

return prev   <-- naya head
```

```js
function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;    // 1. bachao
    cur.next = prev;          // 2. palto
    prev = cur;               // 3. khisko
    cur = next;               // 4. khisko
  }
  return prev;                // ⚠️ prev return karo, cur nahi (cur null hai)
}
```

**Recursive version** (agar poochein):
```js
function reverseList(head) {
  if (!head || !head.next) return head;
  const newHead = reverseList(head.next);
  head.next.next = head;      // peeche wale ka teer mere taraf
  head.next = null;           // mera teer null
  return newHead;
}
```

---

## Trick 3 — FAST & SLOW (middle + cycle)

```
Middle nikalna:

  s,f
  [1]->[2]->[3]->[4]->[5]

       s         f
  [1]->[2]->[3]->[4]->[5]

            s              f=null
  [1]->[2]->[3]->[4]->[5]
             ^ MIDDLE
```

```js
function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  return slow;
}
```

> **Even length me do middle hote hain.** `while (fast && fast.next)` → **doosra** middle deta hai.
> Pehla middle chahiye to `while (fast.next && fast.next.next)`.
> Problem statement dhyaan se padho — ye chhota sa farak test fail kara deta hai.

---

## Trick 4 — Nth from end (gap technique)

```
n = 2 ("aakhir se 2nd")

Pehle fast ko n kadam aage bhejo:
   s         f
  [1]->[2]->[3]->[4]->[5]

Ab dono saath chalao jab tak f end pe na pahuche:
             s              f
  [1]->[2]->[3]->[4]->[5]->null
                  ^
        slow.next = jo hatana hai
```

```js
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);        // dummy: head bhi delete ho sakta hai
  let slow = dummy, fast = dummy;
  for (let i = 0; i < n; i++) fast = fast.next;   // gap banao
  while (fast.next) { slow = slow.next; fast = fast.next; }
  slow.next = slow.next.next;                 // delete
  return dummy.next;
}
```

> **Gap technique ka general funda:** "aakhir se k-th" chahiye → **do pointer, k ka gap.**
> Ek pass me kaam. Length count karke doosra pass lagana beginner move hai.

---

## Trick 5 — Merge two sorted lists (dummy ka best use)

```js
function mergeTwoLists(a, b) {
  const dummy = new ListNode();
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a || b;         // jo bacha hai wo jod do — ek line me
  return dummy.next;
}
```

> `tail.next = a || b` — ye JS idiom yaad rakho, do `if` bach jaate hain.

---

## Combo problem — Reorder List (LC 143)

Ye ek problem me **teeno tricks** aate hain. Isliye interview me favourite hai.

```
[1]->[2]->[3]->[4]->[5]
              |
              v
[1]->[5]->[2]->[4]->[3]

Recipe:
  Step 1: MIDDLE dhoondho          (fast-slow)
  Step 2: SECOND HALF reverse karo (teen pointer)
  Step 3: dono halves ALTERNATE merge karo
```

```js
function reorderList(head) {
  if (!head || !head.next) return;

  // 1. middle
  let slow = head, fast = head;
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }

  // 2. second half reverse
  let second = slow.next;
  slow.next = null;                    // ⚠️ do halves ko todo, warna cycle ban jaayega
  let prev = null;
  while (second) { const nx = second.next; second.next = prev; prev = second; second = nx; }

  // 3. alternate merge
  let first = head; second = prev;
  while (second) {
    const n1 = first.next, n2 = second.next;
    first.next = second;
    second.next = n1;
    first = n1; second = n2;
  }
}
```

> `slow.next = null` bhoolna = **infinite loop**. Ye #1 bug hai is problem me.

---

## Common galtiyan

| Galti | Kya hota hai | Fix |
|---|---|---|
| `cur.next` bina null check | TypeError crash | `while (cur && cur.next)` |
| Reverse me `next` save na karna | List gum ho jaati hai | Pehle `next` bachao |
| Reverse me `cur` return karna | `null` return hota hai | `prev` return karo |
| Split ke baad `slow.next = null` bhoolna | Infinite loop | Todna zaroori |
| Head badalne pe dummy na lagana | Har jagah special case | Dummy reflex bana lo |

---

## Debug karne ka tareeka (interview me kaam aata hai)

Paper pe **3-4 node ka chhota example** banao aur har step pe arrow draw karo.
Linked list ki har bug arrow galat lagane se aati hai. Dimaag me trace mat karo — likho.

```
Test cases jo hamesha check karo:
  []           khaali list
  [1]          ek node
  [1,2]        do node (even length ke bugs yahan pakde jaate hain)
  cycle wali   (agar relevant ho)
```

---

## Problems

| # | Problem | Trick |
|---|---|---|
| 206 | Reverse Linked List | Teen pointer (must) |
| 21 | Merge Two Sorted Lists | Dummy |
| 141/142 | Cycle Detect / Start | Fast-slow |
| 876 | Middle of List | Fast-slow |
| 19 | Remove Nth From End | Gap + dummy |
| 234 | Palindrome Linked List | Middle + reverse |
| 143 | Reorder List | Teeno combo |
| 92 | Reverse Between m..n | Dummy + reversal |
| 25 | Reverse in K Groups | Reversal (hard) |
| 138 | Copy List Random Pointer | HashMap |
| 23 | Merge K Sorted Lists | Heap |

---
Agla: [08-trees.md](08-trees.md)
