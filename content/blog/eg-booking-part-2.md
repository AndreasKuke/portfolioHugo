---
title: "EG Booking System – Part 2: AI-Generated Email Notifications"
date: 2026-05-29
draft: false
summary: "The next step for the EG booking system — using AI to automatically send personalized confirmation emails when a stand is accepted."
tags:
  - project-log
  - ai
  - e.g
---

## The missing piece

Once a vendor submits a booking request, the organizer reviews it in the admin panel and either accepts or rejects it. Right now that's where it ends — the vendor hears nothing automatically. The next step is closing that loop with an AI-generated email.

## How it's planned to work

When an admin accepts a booking, the system triggers an AI call that writes a personalized confirmation email to the vendor. The AI has context about which stand was accepted, the vendor's name and company, and the event details — so the email reads naturally rather than like a template.

The flow looks like this:

1. Admin clicks **Accept** on a booking request
2. Backend fires a request to an AI model with the booking details
3. AI generates a friendly, personalized confirmation email
4. Admin gets to check the mail for errors or minor fixes
5. Email is sent to the vendor automatically

## Why AI instead of a template

A fixed template would work, but using AI means the emails can vary in tone, reference specific stand details, and feel less robotic — without anyone having to write them manually. For an event like a Christmas market where the organizer already has a lot to manage, this removes one more manual step.

## Status

This feature is half implemented at this time. It has a mockup version since there is no JWT-auth yet and no database set up. Therefore you are just automatically assumed to be an admin and can access the admin panel to see what stuff looks like.

---

*Part 1 covers the move from plain React to Next.js.*
