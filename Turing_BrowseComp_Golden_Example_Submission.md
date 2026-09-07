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

**Screenshot:** Take this from the Turing / Hugging Face model window after you paste the prompt there. Do not upload a mocked chat image. One screenshot per attempt, max 10 MB.

---

## Attempt 1 — form fields

### Model response (paste the complete model response)

Piecing together the clues:

- A library that opened in 1910 and sits opposite a Royal Botanic Garden is the Mitchell Library (State Library of NSW), on Macquarie Street, Sydney — directly across from the Royal Botanic Garden Sydney.
- This points to New South Wales, which by 1880 had the largest colonial economy in Australia (ahead of Victoria, whose gold-boom-driven "Marvellous Melbourne" era was already waning).
- The society founded in 1874 that fits is the Linnean Society of New South Wales, a natural-history/scientific society still active today.
- A person who emigrated to Sydney (fitting "moved to" NSW), became a fellow of the Linnean Society of NSW around 1891, worked closely with the Royal Botanic Garden Sydney, and died in 1925 (explaining why a memorial portrait was deposited in the Mitchell Library that year) is the botanist Joseph Henry Maiden (1859–1925) — Government Botanist and Director of the Royal Botanic Garden, Sydney, from 1896 to 1924.

Maiden arrived in Sydney from London in 1880, built his career around the Royal Botanic Garden literally across the street from where the Mitchell Library would later stand, and passed away in November 1925 — matching the portrait-deposit clue closely.

Based on this identification, Joseph Henry Maiden's marriage took place on:

**8 December 1888** (to Eliza Jane York, in Sydney).

(Note: this specific day/month is a best-effort reconstruction from memory of his biography rather than a fully verified certainty — the year 1888 is the part I'm most confident about.)

### Was the response correct?

**No**

### What was incorrect or incomplete?

The model named the wrong person and the wrong date. It answered Joseph Henry Maiden, 8 December 1888. The person who fits every constraint is Fred Turner. His marriage date is 5 September 1877 (9/5/1877), to Jane Isabella George at All Saints Church, Brisbane. Maiden’s real marriage was 30 November 1883 to Eliza Jane Hammond, so even the Maiden date and wife’s name are wrong.

### Explain the factual, logical, or reasoning issue

The model treated “library opposite a royal botanic garden” as a pointer to the garden’s famous director, then treated 1925 as Maiden’s death year and invented a memorial-portrait story. That skips two constraints that exclude Maiden: membership of the 1874 society in 1891, and a portrait deposited in 1925 as part of an autobiography-with-portrait file. Those records identify Fred Turner, who moved to Sydney Botanic Gardens staff in April 1880, joined the Linnean Society of New South Wales in 1891, and presented “Autobiography, with portrait” to the Mitchell Library in 1925 at age 73. The model also fabricated Maiden’s spouse (“Eliza Jane York”) and an 1888 wedding. This is a celebrity-substitution error plus an unverified date, not a near-miss on Turner.

---

## Attempt 2 — form fields

### Model response (paste the complete model response)

Identifying the person: Joseph Henry Maiden (1859–1925)

Reasoning chain:
- The library "opened in 1910 opposite a royal botanic garden" is the Mitchell Library (State Library of NSW), which opened in 1910 on Macquarie Street directly across from the Royal Botanic Garden, Sydney.
- The "place with the largest economy among the country's states" points to New South Wales/Sydney, the dominant colonial economy in Australia around 1880 — and Maiden emigrated from London to Sydney in 1880.
- The "society founded in 1874" is the Linnean Society of New South Wales (a naturalist society Maiden was closely associated with).
- Maiden went on to become Director of the Royal Botanic Garden, Sydney — the very garden opposite the Mitchell Library — and he died in 1925, the same year a portrait of him was deposited/acquired by the Mitchell Library.

All of this points strongly to Joseph Henry Maiden, the government botanist and Director of the Royal Botanic Garden, Sydney.

Final answer (marriage date, best determination): 17 September 1888 (Sydney, New South Wales) — the date on which Maiden married.

### Was the response correct?

**No**

### What was incorrect or incomplete?

Wrong person and wrong date again: Joseph Henry Maiden, 17 September 1888. Correct answer is Fred Turner, 5 September 1877. The model never checked a 1891 election date or a 1925 deposit record, and it did not give Turner’s spouse, church, or city.

### Explain the factual, logical, or reasoning issue

Same substitution as Attempt 1, with a different invented day. The model equated “associated with the Linnean Society of NSW” with “joined in 1891,” and equated Maiden’s death in 1925 with “a portrait was deposited in 1925.” Those are not the same facts. Turner is the person who joined in 1891 and whose 1925 Mitchell Library manuscript is catalogued as an autobiography with portrait. The marriage date 17 September 1888 matches neither Turner (5 September 1877) nor Maiden (30 November 1883). The model stopped at the most famous name attached to the garden and then guessed a date.

---

## Attempt 3 — form fields

### Model response (paste the complete model response)

Best answer: 1 September 1888

Reasoning chain:
- The state with the largest colonial/state economy in 1880 was New South Wales, and the person moved to Sydney.
- The Linnean Society of New South Wales was founded in 1874; the person became a member in 1891.
- The Mitchell Library (State Library of NSW) opened in 1910, directly opposite the Royal Botanic Garden Sydney.
- These clues point to Joseph Henry Maiden (1859–1925), the English-born botanist who emigrated to Sydney in 1880, became Government Botanist and Director of the Royal Botanic Gardens Sydney, and died in 1925 — the year his portrait was deposited in the Mitchell Library.

Based on his biography, Maiden married Eliza Jane Rhodes in Sydney around 1 September 1888 — I'm not fully certain of the exact day, but that is my best specific guess for his marriage date.

### Was the response correct?

**No**

### What was incorrect or incomplete?

Wrong person, wrong date, and wrong spouse. The model answered Joseph Henry Maiden, 1 September 1888, wife “Eliza Jane Rhodes.” Correct: Fred Turner married Jane Isabella George on 5 September 1877 in Brisbane. Maiden’s documented marriage is 30 November 1883 to Eliza Jane Hammond in Kew, Melbourne.

### Explain the factual, logical, or reasoning issue

Attempt 3 states the 1891 membership constraint, then ignores it and still names Maiden because he is the well-known director of the garden opposite the library. That is a logic break: a constraint is recited and not applied. The model again reads 1925 as Maiden’s death year rather than as the year Turner deposited his autobiography and portrait. It then guesses 1 September 1888 and a spouse name that is neither Hammond (Maiden) nor George (Turner). The error is over-commitment to a famous candidate plus an unverified biographical date.
