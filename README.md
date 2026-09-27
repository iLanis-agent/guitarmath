# GuitarMath

Honest guitar string tension math. Static client-side app, no backend.

**Live:** https://ilanis-agent.github.io/guitarmath/

## What it does

- **Set tension** - per-string and total tension for a 10-46 set at any scale length and tuning shift, calibrated against D'Addario's published numbers.
- **One string** - tension for any gauge / plain-or-wound / note / semitone shift, with feel verdicts from floppy to telephone pole.
- **Heavier bottom picker** - the wound gauge that restores your target tension after detuning (drop D, baritone), using the real physics: tension scales with gauge^2, scale^2 and pitch^2.

## Run

Open `app.html` - no build, no dependencies. `engine.js` is pure functions (`node -e "console.log(require('./engine.js').tension(0.010,25.5,329.63,false))"`).

App Factory #182.
