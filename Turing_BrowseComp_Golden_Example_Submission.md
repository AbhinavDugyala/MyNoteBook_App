# Turing Take-Home Assessment — Web Research Specialists (BrowseComp)

**Model tested:** Claude Sonnet 5 Medium Reasoning  
**Construction method:** Inverted BrowseComp question (start from a seed, layer large-search-space constraints, ask for a short verifiable date). Format follows the Domain Experts Golden Example.

---

## Submitted Evaluation Prompt

A person who moved to a place has the largest economy among the country's states in 1880 and also joined a society that was founded in 1874, in 1891. In 1925, a portrait of the person was deposited in a library that opened in 1910 opposite a royal botanic garden. Tell me the marriage date of this person.

---

## Correct Answer

**9/5/1877**

(5 September 1877 — Fred Turner married Jane Isabella George at All Saints Church, Brisbane.)

This is a single, checkable date. The botanist’s Wikipedia page has no marriage information. The day, month, year, spouse, and church are in the Australian Dictionary of Biography and must be extracted after the person is identified.

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

---

## Golden Trajectory

**Step 1 (Source 4)**  
Treat “a place [that] has the largest economy among the country’s states” as New South Wales, Australia (largest GSP among the six states). The person therefore moved to New South Wales in 1880.

**Step 2 (Source 3)**  
Identify the scientific society founded in 1874 that someone in New South Wales would join in 1891: the Linnean Society of New South Wales (founded 1874, incorporated 1884).

**Step 3 (Sources 5, 6)**  
Identify the library that opened in 1910 opposite / adjacent to a royal botanic garden: the Mitchell Library (State Library of New South Wales) on Macquarie Street, Sydney, opened 8–9 March 1910, next to the Royal Botanic Garden Sydney.

**Step 4 (Sources 2, 7)**  
Find which person (a) moved to Sydney in 1880, (b) became a member of the Linnean Society of New South Wales in 1891, and (c) deposited a portrait with an unpublished autobiography in the Mitchell Library in 1925. This uniquely identifies Fred Turner (1852–1939). Encyclopedia of Australian Science records: “Autobiography, with portrait 1925” in the Mitchell and Dixson Libraries Manuscripts Collection.

**Step 5 (Source 1)**  
Turner’s Wikipedia page confirms the career outline (Brisbane gardens, New South Wales Department of Agriculture, consulting botanist to Western Australia) but does **not** give a marriage date.

**Step 6 (Sources 2, 8)**  
The Australian Dictionary of Biography (reprinted by the Australian National Botanic Gardens) states that Turner married Welsh-born Jane Isabella George, daughter of a gardener, at All Saints Church, Brisbane, on 5 September 1877.

**Step 7 (Source 2)**  
Extract the marriage date as 5 September 1877, reported as **9/5/1877**.

---

## Why this prompt is hard (and not a trick)

Each constraint has a large search space on its own (New York, California, Maharashtra, and New South Wales all compete as “largest-economy state”; many learned societies were founded in 1874; several libraries opened in 1910 near a garden). Only the intersection identifies one person. The target fact is a full calendar date that does not appear on Wikipedia, so a model that stops after identifying Turner will fail. Common failure modes include naming a better-known Sydney botanist (Joseph Maiden, Charles Moore, Ferdinand von Mueller), confusing the Linnean Society of London (1788) with the New South Wales society, answering Turner’s birth date (17 April 1852) or death date (17 October 1939), or identifying the wrong 1925 library/garden figure.

The question is not ambiguous: Turner married once, one person satisfies all constraints, and the answer is a date.

---

## Three fresh-conversation runs (Claude Sonnet 5 Medium Reasoning)

*Results filled after the three independent attempts below.*
