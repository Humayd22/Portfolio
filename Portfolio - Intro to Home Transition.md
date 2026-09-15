# Portfolio — Intro to Home Transition Spec
# For Claude Code · Aug 2026

Related: [[Portfolio - Intro Sequence]] · [[Portfolio - Theme Tokens]] · [[Atlas]]

---

## What it is
The handoff from the intro sequence to the home page. The intro line clears, and the home page assembles itself: the hero name fades in and the bento cards stagger in underneath. The concept: the intro ends on "Structure," and the structured grid then builds itself in front of the visitor. The reveal is the idea made visible.

## The sequence

1. Intro line clears: fades out over 0.5s, ease-out, and lifts up 8 to 10px as it goes so it feels like it clears the way rather than just vanishing.
2. Hero name fades in: opacity 0 to 1 with a subtle scale from 98% to 100%, 0.6s, ease-out. Starts just as the intro line begins clearing (slight overlap, not a hard sequential gap).
3. Bento cards stagger in underneath: each card fades in and rises 14px, ~70ms stagger between cards, 0.5s per card, ease-out. Order: top-left to bottom-right (reading order) so it feels like the grid assembles naturally.
4. Total transition ~0.7 to 0.9s. Snappy, not cinematic. The intro already spent the visitor's patience.

## Motion rules
- Opacity and transform only (GPU-friendly). No layout animation, no width/height tweening.
- Overlap the steps slightly rather than running them strictly one after another, so it reads as one fluid reveal, not three separate moves.
- Easing: ease-out (or a gentle custom cubic like cubic-bezier(0.22, 0.61, 0.36, 1)) on everything.
- No layout shift: the home layout is fully laid out before the animation runs; only opacity and transform change.

## Do not
- No curtain or wipe reveal. The intro background and the home background are both near-black, so black lifting off black is invisible.
- No zoom-through or morph transition. The intro's last word ("Design") and the home hero (the name) are different text, so a morph looks forced, and zoom reads as gimmicky against this minimal aesthetic.
- Do not slow it down for drama. Keep it under ~0.9s.

## Accessibility
- `prefers-reduced-motion`: skip the whole transition. Show the fully assembled home immediately, no fade, no stagger.

## For Claude Code
Trigger this as the intro sequence resolves (see [[Portfolio - Intro Sequence]]). Use Framer Motion: fade/lift the intro line out, fade/scale the hero in, and stagger the bento cards with a container variant (staggerChildren ~0.07s, child = opacity + 14px y). Overlap the intro-out and home-in so it is one continuous reveal. Respect reduced-motion. Colours and type from the theme tokens and General Sans, no hardcoded values.
