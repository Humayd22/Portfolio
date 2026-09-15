# Portfolio — Intro Sequence Spec
# For Claude Code · Aug 2026

Related: [[Portfolio - Theme Tokens]] · [[Atlas]]

---

## What it is
A short typographic intro that plays before the home page. Four words fade in one at a time and accumulate on a single line, hold, then the whole line fades out as the home hero fades in. Uses the portfolio theme tokens and General Sans.

## The sequence

Words fade in whole (not letter by letter), accumulating on one centered line:

```
Systems.
Systems. Strategy.
Systems. Strategy. Structure.
Systems. Strategy. Structure. Design.
```

- The three S-words build a rhythm; "Design" breaks it and lands as the payoff.
- Emphasis via contrast, not colour (monochrome): the first three words sit at `--text-secondary` (white/500), and "Design" resolves to `--text-primary` / `--emphasis` (white/1000) so it reads as the arrival word.

## Motion + timing
- Each word: opacity 0 to 1 over 0.45s, ease-out. Whole-word fade, no typing.
- Pause ~0.35s between words.
- Full four-word line holds ~1s.
- Entire line fades out over 0.6s, and the home hero fades in underneath at the same time.
- Total run time ~5 to 6 seconds.
- GPU-friendly: animate opacity only.

## Rules
- Background is `--bg` (near-black in dark, the theme's canvas in light). Text uses the theme text tokens, so the intro respects the active theme.
- Small "skip" control, top right, jumps straight to the home page.
- `prefers-reduced-motion`: skip the animation, show the home page immediately.
- Play once per session (store a flag in `sessionStorage`) so returning visitors within a session are not forced through it again.
- No layout shift: reserve the line's space so the accumulating words do not nudge anything.

## For Claude Code
Build a full-screen intro overlay that renders before the home route. Sequence the four words with the timings above using Framer Motion (staggered opacity). Resolve into the home hero with a crossfade. Respect reduced-motion and the once-per-session rule. Font: General Sans. Colours: theme tokens only, no hardcoded values.
