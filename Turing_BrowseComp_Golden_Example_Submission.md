# Turing Take-Home Assessment — paste-ready form

**Model tested:** Claude Sonnet 5 Medium Reasoning  
**Result:** 0 / 3 correct (all three fresh conversations failed). Meets the rule that at least 2 of 3 attempts must be incorrect or materially flawed.

---

## Submitted Evaluation Prompt

A person who moved to a place has the largest economy among the country's states in 1880 and also joined a society that was founded in 1874, in 1891. In 1925, a portrait of the person was deposited in a library that opened in 1910 opposite a royal botanic garden. Tell me the marriage date of this person.

---

## What is the correct answer for the prompt?

**9/5/1877**

(5 September 1877. Fred Turner married Jane Isabella George at All Saints Church, Brisbane.)

This is a single checkable date. Turner’s Wikipedia page has no marriage information. The day, month, year, spouse, and church are in the Australian Dictionary of Biography.

---

## Golden Trajectory

**Step 1 (Source 4)**  
Treat “a place [that] has the largest economy among the country’s states” as New South Wales, Australia (largest GSP among the six states). The person moved to New South Wales in 1880.

**Step 2 (Source 3)**  
Identify the society founded in 1874 that someone in New South Wales would join in 1891: the Linnean Society of New South Wales (founded 1874, incorporated 1884).

**Step 3 (Sources 5, 6)**  
Identify the library that opened in 1910 opposite a royal botanic garden: the Mitchell Library (State Library of New South Wales) on Macquarie Street, Sydney, opened in March 1910, opposite the Royal Botanic Garden Sydney.

**Step 4 (Sources 2, 7)**  
Find which person (a) moved to Sydney in April 1880, (b) became a member of the Linnean Society of New South Wales in 1891, and (c) deposited a portrait with an unpublished autobiography in the Mitchell Library in 1925. This uniquely identifies Fred Turner (1852–1939), not the more famous garden director Joseph Henry Maiden. Encyclopedia of Australian Science records: “Autobiography, with portrait 1925” in the Mitchell and Dixson Libraries Manuscripts Collection.

**Step 5 (Source 1)**  
Turner’s Wikipedia page confirms the career outline (Brisbane gardens, New South Wales Department of Agriculture) but does **not** give a marriage date.

**Step 6 (Sources 2, 8)**  
The Australian Dictionary of Biography states that Turner married Welsh-born Jane Isabella George, daughter of a gardener, at All Saints Church, Brisbane, on 5 September 1877.

**Step 7 (Source 2)**  
Extract the marriage date as 5 September 1877, reported as **9/5/1877**.

---

## Supporting source(s)

1. https://en.wikipedia.org/wiki/Fred_Turner_(botanist)  
2. https://adb.anu.edu.au/biography/turner-fred-8886  
3. https://en.wikipedia.org/wiki/Linnean_Society_of_New_South_Wales  
4. https://en.wikipedia.org/wiki/List_of_Australian_states_and_territories_by_gross_state_product  
5. https://www.sl.nsw.gov.au/about-library/history-library  
6. https://en.wikipedia.org/wiki/State_Library_of_New_South_Wales  
7. https://www.eoas.info/archives/BSAR01286.htm  
8. https://www.anbg.gov.au/biography/turner-fred.html  

Maiden contrast (why the model’s usual guess is wrong):  
https://adb.anu.edu.au/biography/maiden-joseph-henry-7463  
Maiden moved to Sydney in 1880 and died in 1925, but he married Eliza Jane Hammond on **30 November 1883**, not in 1888, and he is not the depositor of the 1925 Mitchell Library autobiography-with-portrait.

---

## Why this prompt is hard (and not a trick)

Each constraint has a large search space (New York, California, and New South Wales all compete as “largest-economy state”; many societies were founded in 1874; several libraries opened in 1910 near a garden). Only the intersection is Turner.

The prompt is not ambiguous: Turner married once. The usual failure is a genuine reasoning gap, not a wording trick. The model locks onto Joseph Henry Maiden (Director of the Royal Botanic Garden opposite the Mitchell Library, arrived 1880, died 1925) and then invents a marriage date. Maiden fails the 1891 society-join constraint and the 1925 portrait-deposit constraint.

---

## Three fresh conversations — Claude Sonnet 5 Medium Reasoning

Same prompt, new conversation each time, knowledge/reasoning only (no browse tool).

| Attempt | Person named | Date given | Verdict |
|---|---|---|---|
| 1 | Joseph Henry Maiden | 8 December 1888 | Incorrect person and incorrect date |
| 2 | Joseph Henry Maiden | 17 September 1888 | Incorrect person and incorrect date |
| 3 | Joseph Henry Maiden | 1 September 1888 | Incorrect person and incorrect date |

**Score: 0 / 3.** All three runs made the same material error: they identified the famous garden director instead of the staff botanist who actually matches the 1891 membership and the 1925 portrait deposit, then guessed an 1888 marriage that is not Maiden’s real date (30 November 1883) and not Turner’s date (5 September 1877).
