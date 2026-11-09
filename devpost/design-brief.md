---
status: approved
---

# Design brief: JackCheck

## The one spatial moment
The operator is standing at a manual pallet jack before a shift. Five bright markers sit beside its wheels, fork tips, fork underside, hydraulic unit, and handle. Only the active check expands into a short prompt. The operator selects Pass or Issue and moves to the next component. If an issue is reported, a Do not use tag appears on the handle.

## Why it belongs on glasses
- Uses: draws in the world (each instruction sits beside the exact component being inspected), leaves your body free (eyes stay on the equipment, hands remain available)
- Why it's better than the phone or laptop version: a phone or paper checklist separates the instruction from the physical inspection point, forcing look-back-and-forth. Here the instruction lives next to the part being checked.

## Product or overlay
- Type: product — a self-contained guided inspection. The virtual equipment is part of the scene, not a response to something real.
- What the real version would sense: nothing in this version. A future real-world version would require deliberate user alignment or another setup method, outside this submission.
- Stand-in for the preview: none needed — the virtual pallet jack is part of the preview scene, so no recognition has to be faked.

## Where things live
- Where the user is looking during the main task: down at the equipment, starting near the handle, and walking around the jack as the checks move along it.
- Virtual pallet jack: on the floor at real scale, about 1 meter in front of the user at launch.
- Active prompt card: immediately beside its component, roughly 0.6–1.6 m away, slightly below eye level. Compact dark BackPlate with light text, 32 × 24 cm. For the fork-tip and fork-underside checks, the card drops low beside the part, near floor level — those components are at floor level, and a card floating at standing height would feel detached from the part.
- Five markers: small bright dots beside their components. Only one prompt is open at a time.
- Pass and Issue: large, forgiving side-by-side targets on the active prompt card.
- Progress: minimal, near the active prompt — e.g. "1 of 5" (default placement).
- Completion summary: beside the handle, not behind the user.
- Do not use tag: on the handle.

## Hands and input
- Open the active check: pinch its marker.
- Record the decision: pinch Pass or Issue on the prompt card.
- After an ending: pinch Reset demo to restore the initial state.
- Targets are big and highlight when aimed at.
- Voice: none. No custom gestures, two-hand interaction, grabbing, or dragging.

## When things show
- At launch: the pallet jack, the five small markers, the first prompt, and minimal progress (1 of 5).
- Inactive checks remain small dots.
- After a decision: the current prompt collapses and the next one opens.
- Ending: replaces the inspection prompts with one summary. An Issue ending also places the Do not use tag at the handle.
- Reset demo: removes all results, summary, and tag, and restores the first prompt.
- If something needs attention out of view: none — no persistent heads-up panel.

## Prompt texts
1. Wheels: "Check wheels for damage or flat spots."
2. Fork tips: "Check fork tips for cracks, bends, or wear."
3. Fork underside: "Check underneath the forks for cracks or damage."
4. Hydraulic unit: "Check the hydraulic unit for leaks or damage."
5. Handle and controls: "Check the handle and controls for damage and smooth operation."

## Done criteria
Each one can be checked in Lens Studio's preview.
1. Launching the preview shows a real-scale virtual pallet jack, five component markers, and the first inspection prompt.
2. Selecting Pass records the result, collapses the current prompt, and advances until all five components are reviewed.
3. Selecting Issue on the wheel check produces a Do not use tag at the handle and a summary naming the wheel issue.
4. Completing all five checks with Pass produces a completion summary without a Do not use tag.
5. Reset demo clears the results, summary, and tag and restores the first inspection prompt.

## Out of scope
- No real-object recognition, AI, camera analysis, voice, backend, accounts, persistent anchors, fleet dashboard, analytics, navigation, barcode scanning, inventory, automatic diagnosis, physical lockout, or compliance certification.
- JackCheck does not diagnose damage, certify equipment as safe, physically lock out equipment, or replace employer procedures. The operator supplies every inspection judgment.

## Risks and open questions
- Real-device comfort, hand tracking, and real-world alignment are "feel unproven" — the preview cannot answer them; they stay unproven until tested on SPECS.
- The prompt card sits near floor level for the fork-tip and fork-underside checks. Readable in the preview walk-around, but how comfortable that is on real glasses is unproven.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources

## Verification and recording boundary

- Current evidence is from Lens Studio's Interactive Preview only. No physical SPECS device test is claimed; real-world comfort, alignment, and hand tracking remain unproven.
- The five original LEAF scenarios pass individually. Clean `devpost/clean-*.png` captures use normal Preview touch input, not LEAF auto-runs.
- A separate normal-input Preview sequence also produced five Pass decisions, Reset, Wheels Issue with the handle tag, and final Reset in the Lens log.
- Automated video capture remains a host-tooling limitation: OpenCV could record the Preview region, but the long Editor-driven interaction sequence did not advance reliably; Windows Game Bar produced no output file. Record the normal Interactive Preview manually for the public submission rather than using the quarantined invalid sequence.
- Presentation lesson: focused AR UI benefits from one compact component-relative prompt, two clear decisions, and an unmistakable active marker. CLAD/LEAF verification keeps the visual iteration separate from the verified state machine.
