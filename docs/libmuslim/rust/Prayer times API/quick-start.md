---
title: Quick start
sidebar_position: 2
---

# Quick start

This example calculates prayer times for Jakarta with the Kemenag method and
prints every result as `HH:MM`.

## Install

Add the package with Cargo:

```bash
cargo add libmuslim-rs
```

The dependency key is `libmuslim-rs`, but Rust code imports the library as
`libmuslim`.

## Calculate prayer times

Create `src/main.rs`:

```rust title="src/main.rs"
use libmuslim::prayertimes::{
    CalculationMethod, Coordinates, Date, Error, MethodParams, UtcOffset, calculate,
};

fn main() -> Result<(), Error> {
    let date = Date::new(2026, 7, 30)?;
    let coordinates = Coordinates::new(-6.2, 106.8)?;
    let offset = UtcOffset::from_hours(7.0)?;
    let params = MethodParams::for_method(CalculationMethod::Kemenag)?;

    let times = calculate(date, coordinates, offset, &params)?;

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

Run it with:

```bash
cargo run
```

## Adjust a built-in method

`MethodParams::for_method` returns an owned value. You can change its public
fields before calculating. This example adds three precautionary minutes:

```rust
let mut params = MethodParams::for_method(CalculationMethod::Kemenag)?;
params.ihtiyat_minutes = 3;

let times = calculate(date, coordinates, offset, &params)?;
```

Call `params.validate()` when you want to check edited parameters before a
calculation. `calculate` also validates them automatically.

## Use a custom method

Create custom parameters with `MethodParams::new`, then fill the required
fields:

```rust
use libmuslim::prayertimes::{AsrSchool, MethodParams, MidnightMode};

let mut params = MethodParams::new("Custom example");
params.fajr_angle = 18.0;
params.isha_angle = 17.0;
params.asr_school = AsrSchool::Standard;
params.midnight_mode = MidnightMode::Standard;
params.ihtiyat_minutes = 1;
params.validate()?;
```

An Isha angle of `0.0` uses `isha_interval_minutes` instead. A Maghrib interval
of `0` places Maghrib at sunset.

## UTC offset responsibility

`UtcOffset` is a numeric offset, not a time zone name. Supply the offset that
applies to the calculation date. For a location that observes daylight saving
time, resolve the seasonal offset in your application first.

See the [API reference](./api-reference) for validation ranges, formatting
behavior, and all available calculation methods.
