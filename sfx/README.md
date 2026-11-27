# Real Sound Effects & Duelist BGM (`public/sfx/`)

Audio assets are stored as `.dat` binary MPEG payloads and decoded in-memory via the browser Web Audio API (`fetch()` -> `AudioContext.decodeAudioData()`), avoiding `HTMLAudioElement` (`new Audio`) and `.mp3` requests so download manager extensions (such as IDM) never hijack playback.

1. **`passionate-duelist.dat` / `arcv-unstable-thought.dat` / `zone-5ds-remix.dat` / `arcv-resistance.dat` / `gods-anger.dat`** - Looping background OST themes.
2. **`trump-card-intro.dat`** - Splash Draw Phase intro motif.
3. **`card-pull.dat`** - Card draw & pull sound effect.
4. **`card-reveal.dat`** - Ace summon reveal burst sound effect.
5. **`card-hover.dat`** - Subtle card flick/hover interaction sound effect.
