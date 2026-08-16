---
title: Quick start
sidebar_position: 2
---

# Quick start

This example calculates the prayer times for Jakarta on 12 July 2026 using the KEMENAG (Indonesia) method and prints each time as `HH:MM`.

## Add the dependency

```bash
cargo add libmuslim-rs
```

Remember that the package is `libmuslim-rs` and the library you import is `libmuslim`. A C compiler must be available at build time, because the crate compiles the vendored libmuslim sources itself.

## The program

```rust title="src/main.rs"
use libmuslim::prayertimes::{CalculationMethod, Coordinates, Date, MethodParams, calculate};
use libmuslim::timezone::offset_at;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Validate the inputs. Each constructor rejects out-of-range values,
    //    so an impossible date or latitude fails here rather than silently
    //    producing a wrong time later.
    let date = Date::new(2026, 7, 12)?;
    let jakarta = Coordinates::new(-6.2088, 106.8456)?;
    let params = MethodParams::for_method(CalculationMethod::Kemenag)?;

    // 2. Resolve the UTC offset for a zone at an instant, daylight saving
    //    already applied. Skip this if you already know the offset.
    let offset = offset_at("Asia/Jakarta", 1_784_073_600)?;

    // 3. Calculate.
    let times = calculate(date, jakarta, offset, &params)?;

    println!("Fajr     {}", times.fajr.format_hm());
    println!("Sunrise  {}", times.sunrise.format_hm());
    println!("Dhuha    {}", times.dhuha.format_hm());
    println!("Dhuhr    {}", times.dhuhr.format_hm());
    println!("Asr      {}", times.asr.format_hm());
    println!("Maghrib  {}", times.maghrib.format_hm());
    println!("Isha     {}", times.isha.format_hm());
    Ok(())
}
```

## Run it

```bash
cargo run
```

```text title="Output"
Fajr     04:44
Sunrise  06:03
Dhuha    06:28
Dhuhr    12:01
Asr      15:23
Maghrib  17:54
Isha     19:08
```

:::note
Times depend on the calculation method, the location and the offset. Change any of them and the output changes.
:::

## Supplying the offset yourself

The `timezone` module is optional. If you already know the offset, construct it directly and drop the dependency on the host time zone database:

```rust
use libmuslim::prayertimes::UtcOffset;

let offset = UtcOffset::from_hours(7.0)?;
```

`from_hours` takes a possibly fractional number of hours, so zones such as UTC+5:45 are expressed as `5.75`. It rejects anything non-finite or outside the range -24 to 24.

## Resolving the offset for right now

`offset_at` takes an instant as Unix epoch seconds, so the current offset comes from the system clock:

```rust
use std::time::{SystemTime, UNIX_EPOCH};

use libmuslim::timezone::offset_at;

let now = i64::try_from(SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs())?;
let offset = offset_at("Asia/Jakarta", now)?;
```

Passing the instant explicitly rather than reading the clock internally is what makes the offset correct for a date other than today. Prayer times for a date six months away need that date's offset, not the current one, and in a zone that observes daylight saving those differ.

## Handling errors

Every fallible call returns a `Result` with a typed error, so you can match on the cause instead of parsing a message:

```rust
use libmuslim::prayertimes::{Coordinates, Error};

match Coordinates::new(91.0, 0.0) {
    Ok(coordinates) => println!("{coordinates:?}"),
    Err(Error::InvalidCoordinates { latitude, longitude }) => {
        eprintln!("out of range: {latitude}, {longitude}");
    }
    Err(other) => eprintln!("{other}"),
}
```

Both `prayertimes::Error` and `timezone::TimezoneError` implement `std::error::Error`, so `?` into `Box<dyn Error>` or any error type built with `thiserror` or `anyhow` works without a manual conversion.

Both enums are `#[non_exhaustive]`. A `match` on them needs a catch-all arm, which is what lets new variants be added without breaking your build.

See the [API reference](./api-reference) for the full list of types and functions.
