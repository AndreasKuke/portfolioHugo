---
title: "AI-vurdering af praktikrapporter med LLM API"
date: 2026-04-24
draft: false
summary: "Bygget en mini-app der sender en praktikrapport til Claude via en Cloudflare Worker og returnerer struktureret feedback baseret på en rubric."
tags:
  - ai
  - llm
  - cloudflare
  - api
  - project-log
---

Dagens skoleopgave handlede om LLM API-integration: byg en applikation hvor en sprogmodel indgår som en funktionel komponent i et rigtigt dataflow – ikke bare i et chatvindue.

Opgaven var at lave en AI-drevet vurdering af praktikrapporter ud fra en rubric udledt af studieordningens kravmateriale.

## Arkitektur

Samme setup som RAG-chatten: en statisk Hugo-side (GitHub Pages) + en Cloudflare Worker der holder API-nøglen og håndterer alt backend-logik.

```
Browser → POST { rapport } → Cloudflare Worker → Anthropic API
                          ← JSON vurdering    ←
```

Workeren holder rubricen, bygger system- og userprompts, kalder Claude, og returnerer en struktureret JSON-vurdering. Brugeren ser aldrig API-nøglen.

## Rubricen

6 kriterier udledt fra tre kilder: studieordningens læringsmål, krav til rapport og EK's Dare-Share-Care-koncept:

| Kriterium | Vægt |
|-----------|-----:|
| Beskrivelse af praktikvirksomhed | 10% |
| Opfyldelse af læringsmål | 25% |
| Opgaver og teoretisk refleksion | 25% |
| Personlige udviklingsmål | 15% |
| Dare, Share, Care | 15% |
| Udbytte for virksomhed og studerende | 10% |

Hvert kriterium har tre niveauer (lav/middel/høj) med konkrete beskrivelser, så modellen ikke gætter sig til en vurdering.

## Promptdesign

**Systemprompt** sætter rollen som "erfaren vejleder der giver formativ feedback – ikke endelig karakter" og specificerer regler: hold dig til rubricen, find ikke på citater, skeln mellem "ikke nævnt" og "dårligt gjort".

**Userprompt** indeholder rubricen som JSON i `<rubric>`-tags og rapportteksten i `<rapport>`-tags. XML-tags hjælper modellen med at skelne instruktion fra data og reducerer risikoen for prompt injection.

Modellen får et præcist JSON-schema og instrueres i at svare **kun** med JSON – ingen markdown-fences, ingen forklarende tekst udenfor.

## Begrænsninger

- Vurderingen er **vejledende** – ikke en erstatning for vejlederens bedømmelse eller den mundtlige eksamen.
- Modellen ser kun tekst. Bilag (screenshots, diagrammer, feedback-mails) tæller ikke med, selvom de er vedhæftet den rigtige rapport.
- Samme rapport kan give lidt forskellig score i to kald. Brug det som et udgangspunkt, ikke en facit.
