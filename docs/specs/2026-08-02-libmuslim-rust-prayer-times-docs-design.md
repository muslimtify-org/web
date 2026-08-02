---
title: libmuslim Rust prayer times documentation
date: 2026-08-02
status: approved
---

# libmuslim Rust Prayer Times Documentation

## Problem
The Muslimtify documentation site contains complete prayer times documentation for the C API, but it does not document the Rust binding. Rust users need accurate guidance for installing the `libmuslim-rs` Cargo package and using the `libmuslim::prayertimes` API.

## Goals
- Add a Rust documentation section beside the existing C section.
- Explain the Cargo package name, Rust library name, and prayer times module path.
- Provide a complete quick start using the current safe Rust API.
- Document the public prayer times types, functions, constants, validation, formatting, and errors.
- Clearly state that Hijri and timezone Rust bindings are not yet available.
- Match the existing Docusaurus structure and documentation style.
- Use no em dashes and no semicolons in the new documentation text.

## Non-goals
- Document the C API again.
- Add or change Rust binding functionality.
- Document private FFI declarations as public API.
- Add Hijri or timezone Rust binding documentation beyond noting that they are unavailable.
- Modify maintainer-only website files outside `docs/**`.

## Constraints
- Only files under `docs/**` may be edited.
- The Rust source is authoritative for names, signatures, ranges, and behavior.
- Dependency examples use the Cargo package name `libmuslim-rs`.
- Rust imports use `libmuslim::prayertimes`.
- New documentation prose and code comments contain no em dashes and no semicolons.
- Docusaurus internal links must resolve because broken links fail the build.

## Approach
Create `docs/libmuslim/Prayer times API/rust/` as a sibling of the existing `c/` directory. Add `_category_.json` with the label `Rust`, position it after `C`, and configure a generated index.

Add three pages. `overview.md` explains the relationship between upstream libmuslim, the `libmuslim-rs` package, the `libmuslim` import name, and the `prayertimes` module. It also summarizes safety, supported functionality, and current limitations.

`quick-start.md` provides installation instructions and a complete Jakarta prayer times calculation. It explains explicit UTC offsets, formatting, preset adjustment, and how to run an example.

`api-reference.md` documents the safe public constants, types, enums, constructors, validation behavior, formatting methods, conversions, `calculate`, and `prayertimes::Error`. It describes private FFI only as an implementation boundary, not as callable public API.

The three pages link to each other using relative Docusaurus links. External links point to crates.io, docs.rs, and the source repository where useful.

## Alternatives considered
A single Rust page would use fewer files, but it would be long and inconsistent with the C section.

A guide-only section that delegates the API reference to docs.rs would avoid duplication, but it would make the Rust section less complete than the C section and force readers to switch sites.

## Testing
- Search every new Rust documentation file for em dashes and semicolons, both searches must return no matches.
- Check code examples against the current Rust public API.
- Run relevant libmuslim-rs tests and its basic example when confirming documented behavior.
- Run `npm run typecheck` in muslimtify-web.
- Run `npm run build` in muslimtify-web to validate Markdown, MDX, sidebar metadata, and links.

## Open questions
N/A, the structure, scope, content, writing constraints, and verification requirements were approved during design review.
