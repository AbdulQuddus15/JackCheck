# JackCheck shared execution context

## Single source of truth

Project root: `C:\Users\abdul\OneDrive\Documents\JackCheck`
Project file: `JackCheck.esproj`
Approved brief: `devpost/design-brief.md`

Use Git for checkpoints once the project opens safely. Do not publish `.mcp.json`, `.kimi-code/mcp.json`, bearer tokens, caches, logs, or backup folders.

## Responsibilities across the three workspaces

### Kimi Work
- Own research, workflow decisions, design review, submission narrative, demo script, and checklists.
- Review copied source, logs, screenshots, LEAF results, and preview evidence.
- Do not claim Lens Studio actions or test results without evidence from Kimi CLI or the user.

### Kimi CLI — main session only
- Own every Lens Studio MCP-dependent read and mutation.
- Own compilation, VirtualScene readback, input wiring, LEAF host setup, runtime logs, and automated scenarios.
- Do not delegate MCP-dependent work to subagents; their Lens Studio bindings previously failed.
- Keep Lens Studio open and check `/mcp` before MCP operations: `lens-studio` must be connected with tools available.
- After each gate, update `devpost/build-report.md` with exact actions, evidence, failures, and the next step.

### Lens Studio / operator
- Own application installation, account sign-in, package-permission prompts, Interactive Preview visual checks, and screen recording.
- Keep the existing project and working files; do not reset the project to solve dependency errors.

## Current state

Saved source and scene structure exist, including the pallet-jack asset, five markers, prompt/summary/tag anchors, inspection logic, UI scripts, and five LEAF scenario files. These artifacts are not proof of a working Lens.

Not yet proven:
- Compatible LEAF registration and TypeScript compilation
- `JackCheckMain` and marker-input serialization
- LEAF host setup in the live scene
- Clean runtime launch
- Any LEAF scenario result
- Manual preview placement, readability, both endings, and Reset

All unexecuted checks remain **untested**, not passed or failed.

## Dependency decision — correct version policy

Lens Studio 5.23.2 currently provides the known-working sign-in environment. The local `Packages/Leaf.lspkg` is LEAF 4.0.0 built with Lens Studio 5.25 and is not registered. Catalog LEAF 2.0.2 did not expose the required modules.

Use this order:
1. Find a LEAF package explicitly compatible with Lens Studio 5.23.2 that contains `DefaultLeafInteractor`, `InteractableUtils`, and `Utils/common/Utils`.
2. If found, preserve 5.23.2, clean only the stale LEAF plugin collision folders using the prepared rename script, and install that compatible package.
3. If no compatible package exists, test Lens Studio 5.25+ sign-in before opening or migrating the project. If sign-in works, clean the stale collision and install the existing LEAF 4.0.0 archive.
4. If 5.25+ sign-in fails, keep the project untouched and report the exact sign-in and package evidence; do not loop between reinstallations.

Lens Studio 5.25+ is therefore conditional on the selected LEAF package, not an unconditional requirement.

## Execution gates

A. Dependency compatibility, package registration, module resolution, and successful TypeScript compilation.
B. VirtualScene readback, existing input wiring, LEAF hosts, compilation, launch, and runtime logs.
C. Five existing LEAF scenarios mapped individually to the five done criteria.
D. Interactive Preview placement, readability, progression, both endings, warning tag, and Reset.
E. Public repository, honest proof report, and sub-3-minute preview recording showing the Lens in the first 10 seconds.

Do not advance past a failed gate. Use exact compiler/runtime/test output for one minimal evidence-based fix before retrying.

## Warehouse value and scope

JackCheck's value is a consistent, spatially guided pre-shift inspection that keeps instructions beside the equipment and reduces look-away time from paper or phone checklists. The operator makes every judgment. JackCheck does not diagnose, certify equipment safe, physically lock out equipment, or replace employer procedures.

Resilience comes from local deterministic state, no backend dependency, duplicate-input locking, explicit Reset, serialized scene references, automated scenarios, and preview evidence—not from adding more services.

Do not add recognition, AI diagnosis, camera analysis, voice, backend, accounts, analytics, persistent anchors, navigation, inventory, compliance claims, or unsupported real-device claims before the core flow is proven.

## Next CLI handoff

```text
Read devpost/design-brief.md and the shared execution context. Continue in the main session only. First re-evaluate Gate A using the corrected version policy: prefer a LEAF build compatible with the known-working Lens Studio 5.23.2 sign-in environment; consider 5.25+ only if the selected LEAF package requires it and sign-in can be verified. Do not regenerate project files. Report the exact compatible package source or the precise evidence that an upgrade is necessary before changing the environment.
```
