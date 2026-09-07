# Turing Take-Home Assessment — Web Research Specialists (BrowseComp)

**Model tested:** Claude Sonnet 5 Medium Reasoning  
**Construction method:** Inverted BrowseComp question (start from a seed, layer large-search-space constraints, ask for a short verifiable date). Format follows the Domain Experts Golden Example.

---

## Submitted Evaluation Prompt

A person who moved to a place has the largest economy among the country's states in 1906 and also joined a society that was founded in 1895, in 1908. In 1910, two works by the person were purchased by a gallery that was built on the south-east corner of a public domain. Tell me the marriage date of this person.

---

## Correct Answer

**8/12/1920**

(12 August 1920 — Florence Aline Rodway married Walter Moore at St Philip’s Church of England, Sydney.)

This is a single, checkable date. Wikipedia states only the year 1920; the day and month are in the Australian Dictionary of Biography and must be extracted after the person is identified.

---

## Supporting source(s)

1. https://en.wikipedia.org/wiki/Florence_Aline_Rodway  
2. https://adb.anu.edu.au/biography/rodway-florence-aline-8251  
3. https://en.wikipedia.org/wiki/Society_of_Artists_(Australia)  
4. https://en.wikipedia.org/wiki/List_of_Australian_states_and_territories_by_gross_state_product  
5. https://www.artgallery.nsw.gov.au/about-us/history/history-of-the-building/the-art-barn-1885/  
6. https://www.artgallery.nsw.gov.au/collection/works/4369/  
7. https://www.artgallery.nsw.gov.au/collection/works/6180/  
8. https://womenaustralia.anu.edu.au/biography/rodway-florence-aline-8251  

---

## Golden Trajectory

**Step 1 (Source 4)**  
Treat “a place [that] has the largest economy among the country’s states” as New South Wales, Australia (largest GSP among the six states). The person therefore moved to New South Wales in 1906.

**Step 2 (Source 3)**  
Identify the society founded in 1895 that a professional artist in New South Wales would join in 1908: the Society of Artists (Sydney), formed in 1895 as a breakaway from the Royal Art Society of New South Wales.

**Step 3 (Source 5)**  
Identify the gallery “built on the south-east corner of a public domain”: the Art Gallery of New South Wales. In 1884 the New South Wales Parliament fixed the permanent site on the south-east corner of The Domain.

**Step 4 (Sources 1, 6, 7)**  
Find which artist (a) settled in Sydney in 1906 after leaving London, (b) was a member of the Society of Artists from 1908, and (c) had two works purchased by that gallery in 1910. This uniquely identifies Florence Aline Rodway. The two 1910 purchases are the pastels *Toffee* and *A child*.

**Step 5 (Sources 2, 8)**  
Wikipedia records only that she married civil engineer Walter Moore in 1920. The Australian Dictionary of Biography (and the Women Australia reprint of the same entry) gives the full date and place: 12 August 1920 at St Philip’s Church of England, Sydney.

**Step 6 (Source 2)**  
Extract the marriage date as 12 August 1920, reported as **8/12/1920**.

---

## Why this prompt is hard (and not a trick)

Each constraint has a large search space on its own (US/Indian/Brazilian “largest-economy state”; many societies founded in 1895; many galleries on a “domain” or park). Only the intersection identifies one person. The target fact is a full calendar date that does not appear on the obvious Wikipedia page, so a model that stops after identifying Rodway and reading Wikipedia will answer “1920” and fail. Common failure modes include naming a better-known Sydney woman artist of the same decade (Thea Proctor, Margaret Preston, Grace Cossington Smith), giving Leonard Rodway’s marriage dates (19 May 1879 or 17 May 1923), or returning the year without the day.

The question is not ambiguous: one person satisfies all constraints, she married once, and the answer is a date.

---

## Three fresh-conversation runs (Claude Sonnet 5 Medium Reasoning)

*Results filled after the three independent attempts below.*
