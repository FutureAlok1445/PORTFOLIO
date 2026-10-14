# Patch — current sprite specification

14 October 2026. Original art source: `scripts/living-sprites.mjs`; behavior: `src/components/after-hours/PatchCat.jsx`; desktop model: `src/scene/PatchModel.js`; renderer: `src/components/after-hours/WorkshopCanvas.jsx`. Sixteen strips contain 85 authored frame positions. This supersedes historical v2 twelve-state / 66-position descriptions.

## Format and provenance

All frames use a 48×48 logical RGBA grid. Direct authored pixel clusters are encoded with Sharp; no reference sprite or third-party pet artwork is used. The original charcoal/cream/amber/moss/coral palette and consistent ears/muzzle/collar remain. CSS fallback uses pixelated rendering; any pixel textures use nearest filtering. Desktop live Patch is voxel geometry rather than a camera-facing Sprite. The transparent atlas is 384×768, the contact sheet has an opaque review background, and poster is 48×48.

Manifest anchor is `[24,41]`. For row r and frame f, atlas rectangle is `(48f,48r,48,48)`; each state strip uses `(48f,0,48,48)`. Unused columns remain transparent. Counts are authored positions, not a claim of 85 globally unique images; hold frames and return/walk artwork may repeat.

| State | Atlas row | Frames | FPS | Strip | Loop |
|---|---:|---:|---:|---|---|
| idle | 0 | 4 | 2 | 192×48 | Yes |
| blink | 1 | 4 | 8 | 192×48 | No |
| look | 2 | 4 | 5 | 192×48 | No |
| tail | 3 | 6 | 7 | 288×48 | No |
| sleep | 4 | 4 | 2 | 192×48 | Yes |
| wake | 5 | 6 | 7 | 288×48 | No |
| stretch | 6 | 6 | 7 | 288×48 | No |
| walk | 7 | 8 | 10 | 384×48 | Yes |
| paw | 8 | 5 | 7 | 240×48 | No |
| pet | 9 | 6 | 7 | 288×48 | No |
| peek | 10 | 5 | 6 | 240×48 | No |
| return | 11 | 8 | 15 | 384×48 | Yes |
| ear | 12 | 4 | 6 | 192×48 | No |
| stand | 13 | 4 | 3 | 192×48 | Yes |
| jump | 14 | 6 | 9 | 288×48 | No |
| settle | 15 | 5 | 6 | 240×48 | No |

## Runtime

The desktop live cat is an original articulated voxel model with four paws, pointed ears, muzzle/whiskers, curving tail and contact shadow. The projected DOM button is the accessible target. Sixteen-state pixel artwork remains the mobile 2.5D/Quick semantic sprite button; its manifest anchor applies to the fallback, not the voxel skeleton. One character controller dispatches state to both representations rather than introducing another character.

Visitor pet/wake reactions take priority over idle cues. Wake/stretch, look, paw and pet are finite. Intentional walk travels 0.6 world units at the desk edge and returns with an actual gait over 2.6 seconds; chapter change cancels travel. Added ear, stand, jump and settle poses preserve the same palette. A jump is an intentional vertical world offset, not broken grounding. Loop flags describe artwork; a walking command is still finite and returns home.

Ambient pause suppresses idle cues while retaining deliberate reactions. Reduced motion, hidden/offscreen state and inactive placement suppress incidental animation. Pixel fallback updates use authored timing; the voxel gait changes real paw transforms. Eight sampled poses retain at least two grounded feet and exact zero bottom offset. Effects clean up event listeners and pending timers. No physics obstacle avoidance, cross-room autonomous wandering, audio/purr or real animal behavior is claimed.

Reproduce with `npm run assets:patch`. Current world reports verify pet/walk/cancellation and rendered state; the manifest is the authority for per-strip count/FPS/loop metadata. Historical sprite-quality and v2 reports support their original version only. See ../../WORLD-REPAIR-REPORT.md for current gait/route evidence, mobile clearance and limits.
