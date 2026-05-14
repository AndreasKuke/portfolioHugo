---
title: "Interaktiv stand-booking og kortsystem til E.G Julemarked"
date: 2026-05-14
draft: false
summary: "Et interaktivt digitalt kortsystem hvor udstillere kan se ledige standpladser, prioritere ønskede placeringer og indsende ønsker digitalt — med AI-assisteret standfordeling."
tags:
  - danish
  - ai
  - agents
  - frontend
  - software-design
  - reflection
  - database
  - e.g
---

## Problem

Det er svært for udstillere at få overblik over standplaceringer og vælge den bedste placering til deres behov. Processen er sandsynligvis manuel og kræver dialog frem og tilbage mellem arrangør og udstillere — det kan skabe misforståelser, dobbeltbookinger og ineffektiv planlægning.

## Bruger

- **Primær bruger:** Udstillere/stadeholdere til julemarkedet
- **Sekundær bruger:** Arrangørerne bag E.G Julemarked

## Nuværende proces

Udstillere ansøger sandsynligvis om standplads via formular eller mail og beskriver ønsker til placering manuelt. Arrangørerne fordeler derefter stande manuelt ud fra erfaring og tilgængelighed.

## Foreslået løsning

Vi bygger et interaktivt digitalt kort over julemarkedet, hvor udstillere kan:

- Se ledige standpladser
- Klikke på stande direkte på kortet
- Prioritere ønskede placeringer (fx 1., 2. og 3. valg)
- Se information om størrelse, strøm, placering osv.
- Indsende ønsker digitalt gennem systemet

Arrangørerne får et admin-overblik over alle ønsker og kan lettere planlægge markedet.

## AI-funktion

AI kan bruges til:

- Automatisk anbefaling af standplaceringer baseret på tidligere valg eller standtype
- Optimering af standfordeling for at undgå tomme områder eller forkerte grupperinger (fx alle madstande samlet ét sted)
- Chatbot/hjælpefunktion til spørgsmål om booking
- Analyse af populære områder på markedet

## MVP

Den mindste version vi kan demonstrere:

- Et simpelt digitalt kort over julemarkedet
- Klikbare stande
- Mulighed for at vælge og prioritere 3 ønskede standplaceringer
- Data gemmes i database
- Simpelt admin-overblik over ønsker

## Afgrænsning

Hvad vi ikke bygger i første version:

- Fuld betalingsløsning
- Automatisk kontraktgenerering
- Avanceret AI-optimering
- Live-opdateringer i realtid mellem alle brugere
- Mobilapp

## Åbne spørgsmål

Svar vi mangler fra kunden:

- Har de allerede et digitalt kort over standplaceringer?
- Hvor mange stande er der typisk?
- Skal flere udstillere kunne reservere samme stand som prioritet?
- Skal systemet integreres med deres nuværende hjemmeside?
- Skal kunder kunne logge ind?
- Hvilke oplysninger ønsker arrangørerne om hver stand?

## Antagelser

Hvad vi antager indtil videre:

- Arrangørerne bruger i dag en manuel proces
- Udstillere ønsker større indflydelse på placering
- Der findes faste standplaceringer hvert år
- Et visuelt kort vil gøre processen lettere
- Systemet skal være webbaseret

## Næste opgaver

1. Admin-side til acceptering af placering — ved acceptering sendes en mail automatisk til den søgende udstiller via AI
2. Designe database til stande, brugere og prioriteringer
3. Formular som kunder kan udfylde og ansøge om stand
4. AI-anbefaling af standplacering — fx undgå at alle madstande havner i samme lokation
