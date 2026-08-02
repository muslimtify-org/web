---
title: Overview
sidebar_position: 1
---

# libmuslim Rust API

`libmuslim-rs` provides safe, idiomatic Rust bindings for the prayer time
calculator in libmuslim. The calculation code is compiled from the vendored C
source, so applications do not need to install libmuslim separately.

The package and import names are different:

| Context | Name |
| --- | --- |
| Cargo package | `libmuslim-rs` |
| Rust library | `libmuslim` |
| Prayer time module | `libmuslim::prayertimes` |

## Supported API

The Rust binding currently covers `prayertimes.h`. It provides:

- 21 built-in calculation methods and custom parameters
- Validated Gregorian dates, coordinates, and UTC offsets
- Fajr, Sunrise, Dhuha, Dhuhr, Asr, Maghrib, and Isha times
- `HH:MM` and `HH:MM:SS` formatting
- Date conversion to and from Unix epoch days
- Typed errors for invalid input and FFI failures

Bindings for `hijri.h` and `timezone.h` are not available yet.

## Safe wrapper design

The public API validates values before they cross the FFI boundary. Raw C
types, pointers, and functions remain private. Application code works with
owned Rust values such as `Date`, `Coordinates`, `MethodParams`, and
`PrayerTimes`.

The library includes the C implementation and compiles it through Cargo. A
C11-compatible compiler must be available when building the crate.

## Time zones

Calculations require an explicit UTC offset for the requested date and
location. The Rust binding does not look up IANA time zone names and does not
apply daylight saving rules.

For example, Jakarta uses `UtcOffset::from_hours(7.0)`. An application that
supports locations with daylight saving time must resolve the correct offset
before calling `calculate`.

Continue to the [Quick start](./quick-start) for a complete example, or open the
[API reference](./api-reference) for all public types and functions.

## Links

- [Crate on crates.io](https://crates.io/crates/libmuslim-rs)
- [API documentation on docs.rs](https://docs.rs/libmuslim-rs)
- [Source repository](https://github.com/muslimtify-org/libmuslim-rs)
