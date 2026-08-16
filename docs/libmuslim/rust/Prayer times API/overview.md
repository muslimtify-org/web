---
title: Overview
sidebar_position: 1
---

# libmuslim Rust binding

**libmuslim-rs** is the official Rust binding for libmuslim. It wraps the C headers in a safe, idiomatic API: invalid input is rejected by the type system or returned as a `Result`, and no `unsafe` is required of the caller.

The C sources are vendored into the crate and compiled by a build script, so there is no system libmuslim to install and nothing to link by hand. Adding the crate is the whole installation.

## Package name and import name

The crates.io package is `libmuslim-rs`, but the Rust library it produces is named `libmuslim`. Your `Cargo.toml` names the first and your `use` statements name the second.

```bash
cargo add libmuslim-rs
```

```rust
use libmuslim::prayertimes::calculate;
```

The minimum supported Rust version is **1.85**. A C compiler is required at build time, since the vendored C sources are compiled as part of the crate.

## Modules

| Module | Wraps | Purpose |
| --- | --- | --- |
| `libmuslim::prayertimes` | `prayertimes.h` | Pure astronomy. Turns a date, location and explicit UTC offset into prayer times. |
| `libmuslim::timezone` | `timezone.h` | Optional. Resolves the UTC offset for an IANA time zone at an instant, with daylight saving applied. |

`prayertimes` never consults a time zone database. It takes the offset you give it and does arithmetic. `timezone` exists only so you do not have to work that offset out yourself, and you can ignore the module entirely if you already know it.

## What the binding adds over the C API

The binding is deliberately thin. It exposes what the headers expose and nothing more, so there are no calculation features here that the C library does not have. What it does add is enforcement of the contracts the C API documents but cannot check.

Values are validated on construction rather than on use. `Date`, `Coordinates` and `UtcOffset` are constructed through fallible constructors, so an out-of-range latitude or a 31 February is rejected at the point you create it, not silently folded into a wrong answer several calls later.

Failures are values, not sentinels. Where the C API returns a sentinel that overlaps a legitimate result, the Rust API returns a `Result`. `CalculationMethod::from_str` distinguishes a genuine `Custom` from an unrecognized name, and `timezone::offset_at` distinguishes real UTC from a zone the host cannot resolve.

Results are checked before they reach you. A non-finite time coming back from C is reported as `Error::NonFiniteResult` rather than propagating a `NaN` into your formatting code.

## Thread safety

Both modules are safe to call concurrently from any number of threads. Neither takes a lock nor mutates process-global state.

This was not always true. Earlier versions resolved offsets through the C `parse_timezone_offset()`, which set the process `TZ` environment variable and so raced with any other thread in the program calling `getenv`, `localtime` or `tzset`. The C library now reads the zone's TZif file directly instead, and the binding no longer serializes calls.

## License

libmuslim-rs is released under the MIT License, the same as libmuslim itself.

Continue to the [Quick start](./quick-start) for a complete working program, or jump to the [API reference](./api-reference) for every type and function.

## Links

- [Crate on crates.io](https://crates.io/crates/libmuslim-rs)
- [API documentation on docs.rs](https://docs.rs/libmuslim-rs)
- [Source repository](https://github.com/muslimtify-org/libmuslim-rs)
