---
title: "Spec-driven development og kodeagenter"
date: 2026-05-14
draft: false
summary: "Hvad er spec-driven development, og hvordan kan specs og logs arbejde sammen med AI-kodeagenter til udvikling af applikationer?"
tags:
  - ai
  - agents
  - software-design
  - reflection
---

Jeg har brugt en del tid på at arbejde med AI-assisteret udvikling, først med Claude til at bygge RAG-chatten, derefter rubric-graderen. Og undervejs er der et mønster der gentager sig: det vigtigste input til en kodeagent er ikke den prompt man vælger. Det er konteksten der følger med.

Det har fået mig til at tænke over, hvad spec-driven development egentlig er, og hvorfor det bliver endnu mere relevant, når man arbejder med kodeagenter.

## Hvad er en spec?

En spec (specification) er en beskrivelse af hvad et system skal gøre, adskilt fra hvordan det gør det.

Det kan være mange ting:
- Et OpenAPI-dokument der beskriver hvilke endpoints et API har og hvad de returnerer
- Et JSON-schema der definerer formen på et svar
- En rubric der fortæller hvilke kriterier en rapport vurderes på
- En liste af acceptansekriterier: "når brugeren indsender en tom rapport, skal systemet returnere 400 eller noget"

Fælles for dem alle: de er maskinlæsbare og præcise. De er ikke en chatbesked, de er en kontrakt.

## Hvad er spec-driven development?

Spec-driven development er den praksis, at man skriver eller definerer specifikationen *før* (eller sideløbende med) implementeringen, og lader implementeringen måles op imod specen, ikke omvendt.

Det modsatte er at kode sig frem og bagefter dokumentere hvad man endte med. Det giver måske en API-reference, men ikke en spec. En spec siger hvad der *skal* ske. Dokumentation siger hvad der *skete*.

I praksis betyder spec-driven development:
1. Du definerer kontrakten — hvad systemet skal acceptere som input og producere som output
2. Du implementerer mod den kontrakt
3. Du tester om implementeringen overholder kontrakten

## Agenter har brug for specs — ikke beskrivelser

Når jeg giver Claude Code en løs opgave som "byg et endpoint der vurderer rapporter", starter det en gætteleg. Agenten laver antagelser om format, fejlhåndtering, struktur. Nogle antagelser er gode. Andre er ikke.

Når jeg i stedet giver agenten en spec: fx det JSON-schema som rubric-graderen skal returnere, eller CORS-kravene workeren skal overholde, ændrer det karakteren af arbejdet fuldstændigt. Agenten behøver nu ikke længere gætte sig frem til hvad der skal være i tomheden mellem punkt A -> B, det har jeg guidet og fortalt den hvad skal være.

Specen fungerer som et ankerpunkt. Agenten ved hvornår den er færdig: når outputtet matcher specen.

Det er ikke anderledes end at arbejde med et andet menneske, eksempel: Hvis du siger "lav noget med brugere", får du noget der virker, men måske ikke det du ville ha'. Hvis du siger "implementer dette interface", ved kollegaen hvornår opgaven er løst.

## Logs som bevis

Det næste stykke er logs.

En spec fortæller hvad der *skal* ske. Logs fortæller hvad der *faktisk* skete.

I rubric-graderens Cloudflare Worker er der ikke meget logning. Det fungerer, men det betyder at vi kun opdager problemer når brugeren støder på dem. Hvis en rapport returnerer et uventet format, ved vi det ikke, medmindre brugeren sender en klage.

Forestil dig i stedet et system hvor:
- Workeren logger hvert kald: input-størrelse, model, responstid, om JSON-parse lykkedes
- Loggen skrives til et sted agenten kan læse
- Agenten kan sammenligne logs mod specen og rapportere drift

Måske i fremtiden vil dette blive basis praksis, måske er det allerede, det vidnes jeg ikke om.

## Specs + logs + agenter — en mulig loop

Her er den kombination, jeg tror bliver vigtig i de kommende år, for at man kan få en god spec-driven-development phase:

```
Spec (kontrakt)
    ↓
Agent genererer implementering
    ↓
Kode kører i produktion
    ↓
Logs samles op
    ↓
Agent læser logs mod spec
    ↓
Drift opdages → agent foreslår fix
    ↓
(gentag)
```

## Hvad det kræver i praksis

For at dette virker skal tre ting være på plads:

**Maskinlæsbare specs.** En beskrivelse i et .md er formentligt ikke nok. JSON-schemas, OpenAPI, formelle acceptansekriterier — noget agenten kan parse og sammenligne med skal nok bruges og gås okay langt i dybden med.

**Strukturerede logs.** Fritekst-logs er svære at analysere automatisk. Hvis du logger `ERROR: something went wrong`, ved agenten ikke meget. Hvis du logger `{"event": "parse_error", "model": "claude-sonnet-4-5", "input_length": 8432, "raw_response_excerpt": "..."}`, er der noget at arbejde med. (Error Log genereret med Claude)

**Klare grænser for hvad agenten må ændre.** Agenten kan foreslå fixes. Den bør ikke deploye dem uden review, i hvert fald ikke i starten og måske aldrig. Det er nok smart altid at have et menneskeled indenom inden det bliver deployet.

## Refleksion

Rubric-graderen var mit første rigtige eksempel på at bruge en spec (rubricen og JSON-schemaet) til at styre hvad en LLM producerer. Det virkede langt bedre end at bede modellen "vurder rapporten og kom med feedback" — fordi modellen vidste præcis hvad der skulle leveres.

Det samme princip skalerer op. Jo større systemet er, jo vigtigere er det at have specs agenten kan holde sig til, og logs agenten kan bruge til at opdage hvornår noget gik galt.

Jeg er ikke i tvivl om at spec-driven development og kodeagenter er en kombination der vil forme, hvordan software bygges i de næste år. Det handler ikke om at agenten erstatter udvikleren. Det handler om at give agenten det samme grundlag en god udvikler har hvor de kan hjælpes ad.
