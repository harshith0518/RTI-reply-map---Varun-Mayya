# Submission summary

## RTI Reply Map

One RTI request can produce several registration numbers and replies from different branches. A citizen must then work out which reply answers which original question, while keeping track of transfers, pages, and missing records. RTI Reply Map turns that scattered journey into one evidence-linked, question-by-question view.

The no-login prototype follows Maya's fictional fellowship-information request. Her three questions split into three parallel reply branches. For each question, the site shows a plain-language coverage label, the exact supporting passage, source PDF, page or annexure, and registration branch. Maya can inspect the evidence, confirm or change the suggested label, add a private browser-only note, and download a clearly marked reviewed summary.

The system is designed to support judgement, not replace it. Labels are deterministic proposals; ambiguous or incomplete evidence is surfaced for human review. The demonstration uses only synthetic, visibly watermarked records. It is not connected to a government portal, submits nothing, and does not decide RTI compliance or recommend an appeal.

The architecture is deliberately lightweight and deployable for free: a static React interface, typed synthetic fixtures, deterministic mapping rules, local browser storage, and no account, database, paid API, or live AI dependency. Maya is the main story; Nisha and Asha are automated robustness fixtures covering serial transfers, parallel splits, missing replies, appeal orders, and supplemental replies.
