# Parked: procedural Renaissance hands

**Status:** parked, not deleted. Intact and still importable.
**Outcome:** the hands read as uncanny — a flat, slatted paddle rather than a
sculpture. Parked in favour of a different visual direction.

## What this was

An attempt to build two Creation-of-Adam-inspired hands entirely from
procedural geometry in Three.js — no GLB/GLTF, no Blender — reaching toward a
floating `</>`.

## How it worked

Everything is a **loft**: cross-section rings swept along an axis and stitched
into a surface. The reusable half of that machinery now lives in
`src/lib/procedural/loft.js` and is worth keeping regardless of direction:

- `superellipseOffset` — squircle sections (fingers and palms are closer to
  rounded rectangles than circles, and the flatter faces catch a key light as
  broad planes, which is where the sculptural facet reading comes from)
- `createRing` / `buildLoftGeometry` — ring generation and surface stitching,
  with outward-facing winding and optional fan caps
- `sampleProfile` — smooth radius interpolation by packing
  `(axial position, half-height, half-width)` into a Catmull-Rom curve
- `createSeededRandom`, `smoothBump` — deterministic irregularity, localised swells

Files here:

| File | Role |
| --- | --- |
| `handConfig.js` | All anatomy and pose numbers |
| `palm.js` | Forearm→wrist→palm as one continuous loft, plus thenar/concavity/knuckle modulation |
| `digit.js` | Articulated phalanx chains, baked into their pose and merged |
| `hand.js` | Assembles the parts into a single merged mesh (one draw call) |
| `placeholders.js` | Phase-1 proxy volumes |

## What worked

- **One continuous loft** for forearm→wrist→palm. Building those as separate
  parts is what makes procedural hands read as a peg pushed into a box; a single
  sweep makes the transition structural. This part looked genuinely good.
- **Baking the joint chain into merged geometry.** The pose is fixed art
  direction, so accumulating a `Matrix4` down the phalanges and merging beats
  nesting `Object3D`s — a whole hand costs one draw call, ~1.5k triangles.
- **The index fingertip.** Collapsing width faster than height leaves a fleshy
  pad in profile; that silhouette was convincing.
- **Anatomically-derived proportions.** Palm length should ≈ middle-finger
  length. Getting this wrong (palm 32% too long) was what first made it read as
  a paddle.

## Why it failed

- **Foreshortening trap.** With the back of the hand square to camera, finger
  curl points directly away from the viewer, so the fingers compress into
  stacked slats. Rotating to fix that hides the fingers below the palm instead.
  There is a narrow angular window where both read, and it fought the
  composition's need for hands entering horizontally from the frame edges.
- **Knuckle transition.** Where four digits meet the metacarpal mass is the
  hardest region. Interpenetrating parts (rather than a watertight manifold) is
  cheap and works everywhere else on the hand, but at the knuckles it produces
  shading creases and stray shards no amount of parameter tuning removed.
- **Uncanniness is asymmetric.** A hand that is 90% right reads as *wrong*, not
  as stylised. Abstract sculptural forms have no such penalty — which is the
  main argument for the pivot.

## If revived

Highest-leverage fixes, in order:

1. Model the metacarpal mass and the four proximal phalanges as a **single
   loft** with a branching section, rather than separate interpenetrating parts.
2. Give each knuckle an explicit bulge on the palm sweep instead of relying on
   `knuckleBulge` at the phalanx base.
3. Commit to one viewing angle and tune the pose *for that angle* rather than
   trying to hold up from all sides.

Alternatively, accept a GLB/GLTF hand — but note the original brief ruled that
out, and the procedural constraint was the point of the exercise.
