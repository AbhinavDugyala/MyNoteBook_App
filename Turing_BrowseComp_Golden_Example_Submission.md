# Turing Take-Home Assessment — Web Research Specialists (BrowseComp)

**Model tested:** Claude Sonnet 5 Medium Reasoning  
**Construction method:** Inverted BrowseComp question. Start from a seed (an EMNLP 2020 paper), then keep only characteristics with large search spaces (author undergraduate institutions that do not appear on the paper). The intersection uniquely identifies one paper title. Format follows the Domain Experts Golden Example (prompt, short verifiable answer, numbered sources, stepped Golden Trajectory).

A person-style golden-example clone (Florence Rodway / Fred Turner marriage dates) was tested first and is **too easy** for a browsing model (3/3). This paper question is the version that tests a real retrieval gap.

---

## Submitted Evaluation Prompt

What is the title of the paper published in the EMNLP main conference between 2018 and 2021 whose first author did their undergraduate degree at the Indian Institute of Technology Roorkee, whose second author did their undergraduate degree at BITS Pilani, and whose last author did their undergraduate degree at the University of California, Irvine?

---

## Correct Answer

**MedFilter: Improving Extraction of Task-relevant Utterances through Integration of Discourse Structure and Ontological Knowledge**

(EMNLP 2020 main conference. Authors: Sopan Khosla, Shikhar Vashishth, Jill Fain Lehman, Carolyn Rose.)

This is a single checkable name (a paper title). The PDF lists only Carnegie Mellon affiliations. The three undergraduate institutions live on separate CVs and faculty pages, so the title cannot be read off any one source.

---

## Supporting source(s)

1. https://aclanthology.org/2020.emnlp-main.626/  
2. https://aclanthology.org/2020.emnlp-main.626.pdf  
3. https://sopankhosla.github.io/assets/pdf/CV_final_formal_full.pdf  
4. https://indianexpress.com/article/education/cbse-board-result-2023-from-2013-cbse-topper-to-becoming-an-ai-scientist-at-amazon-sopan-khosla-speaks-of-his-journey-lessons-from-the-top/  
5. https://research.google/people/shikhar-vashishth-2/  
6. https://en.wikipedia.org/wiki/Carolyn_Rosé  
7. https://expertfile.com/experts/carolynpenstein.rose/carolyn-penstein-ros-  
8. https://www.lti.cs.cmu.edu/people/alumni/alumni-thesis/rose-carolyn-thesis.pdf  

---

## Golden Trajectory

**Step 1 (Sources 3, 4)**  
Establish that Sopan Khosla completed a B.Tech in Computer Science and Engineering at IIT Roorkee (2013–2017). His CV lists one first-author EMNLP main-conference paper in 2018–2021.

**Step 2 (Source 5)**  
Establish that Shikhar Vashishth completed his undergraduate degree at BITS Pilani (Information Systems, graduated 2016).

**Step 3 (Sources 6, 7, 8)**  
Establish that Carolyn Penstein Rosé (anthology spelling: Carolyn Rose) completed a B.S. in Information and Computer Science at the University of California, Irvine (1992), then graduate degrees at Carnegie Mellon.

**Step 4 (Sources 1, 2)**  
On ACL Anthology, open the EMNLP 2020 paper whose author list is Sopan Khosla, Shikhar Vashishth, Jill Fain Lehman, Carolyn Rose. Confirm it is a main-conference paper (anthology ID `2020.emnlp-main.626`), not a workshop paper.

**Step 5 (Source 2)**  
Confirm the PDF affiliations are all Language Technologies Institute, Carnegie Mellon University. The three undergraduate schools do not appear on the paper, which is why a single search does not surface the title.

**Step 6 (Source 1)**  
Extract the title: **MedFilter: Improving Extraction of Task-relevant Utterances through Integration of Discourse Structure and Ontological Knowledge**.

---

## Why this prompt is hard (and not a trick)

Each constraint has a large search space (many EMNLP first authors from IIT Roorkee; many NLP authors from BITS Pilani; many last authors who once studied at UC Irvine). A brute-force solve means scanning EMNLP main papers from 2018–2021 and opening author CVs. The question is not ambiguous: Khosla has no other first-author EMNLP main paper in that window with this author order. Common failure modes include naming his CODI@EMNLP 2020 workshop paper (*Using Type Information to Improve Entity Coreference Resolution*), dropping the `MedFilter:` prefix, citing a later Khosla–Rosé paper, or guessing a better-known CMU medical-dialogue paper (for example *Generating SOAP Notes from Doctor-Patient Conversations*).

---

## Three fresh-conversation runs (Claude Sonnet 5 Medium Reasoning)

*Results filled after the three independent attempts below.*
