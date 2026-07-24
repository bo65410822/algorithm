# Algorithm Visualizer Project Rules

## Required Skills

- Use `$complete-algorithm-catalog` when the request is to implement the full scoped catalog, continue autonomously across algorithms, or finish all planned functionality.
- Use `$design-algorithm-visualizer` before adding the second or later algorithm, changing the step schema, extracting the playback engine, changing module boundaries, or selecting a framework.
- Use `$develop-algorithm-module` whenever adding or changing an algorithm, data structure, search, tree, graph, or JVM teaching module.
- Use `$design-learning-interaction` whenever changing visualization states, playback controls, explanations, quizzes, responsive layout, or presentation mode.
- Use `$verify-algorithm-visualizer` after every functional implementation and before reporting completion.

For a new algorithm, use the skills in this order:

1. `$design-algorithm-visualizer` when shared architecture is affected.
2. `$develop-algorithm-module` for domain implementation.
3. `$design-learning-interaction` for visualization and teaching flow.
4. `$verify-algorithm-visualizer` for delivery checks.

For the full catalog, let `$complete-algorithm-catalog` orchestrate this sequence repeatedly. A module is not complete until its individual gates and affected regressions pass. The product is not complete until all 14 modules and the catalog-level gates pass.

## Product Boundaries

- Keep the product focused on curated Java teaching modules driven by structured execution steps.
- Do not claim to parse arbitrary Java code or simulate a production JVM.
- Keep Java example code, generated steps, rendered state, and Chinese explanations semantically aligned.
- Preserve deterministic forward, backward, reset, replay, and custom-input behavior.
- Reuse shared playback and rendering behavior instead of copying it into each module.

## Current Baseline

- The current implementation is a no-build HTML/CSS/JavaScript demo.
- Bubble sort is the regression baseline and must remain usable while architecture is extracted.
- Introduce dependencies only when they solve demonstrated multi-module complexity.
