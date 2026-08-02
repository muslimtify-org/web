---
title: API reference
sidebar_position: 3
---

# API reference

Import public prayer time items from `libmuslim::prayertimes`:

```rust
use libmuslim::prayertimes::{
    calculate, CalculationMethod, Coordinates, Date, Error, MethodParams, PrayerTime,
    PrayerTimes, UtcOffset,
};
```

## Calculation

### `calculate`

```rust
pub fn calculate(
    date: Date,
    coordinates: Coordinates,
    utc_offset: UtcOffset,
    params: &MethodParams,
) -> Result<PrayerTimes, Error>
```

Calculates seven local prayer times. The function validates `params`, calls the
vendored C implementation, and returns an error if an input or calculated value
is invalid.

The UTC offset must apply to the requested date. No time zone database or
daylight saving rule is applied.

## Input types

### `Date`

A validated proleptic Gregorian date.

```rust
let date = Date::new(2026, 7, 30)?;
assert_eq!(date.year(), 2026);
assert_eq!(date.month(), 7);
assert_eq!(date.day(), 30);
```

| Method | Result |
| --- | --- |
| `Date::new(year, month, day)` | Validates the calendar date |
| `year()` | Returns the year |
| `month()` | Returns a month from 1 through 12 |
| `day()` | Returns the day of the month |
| `days_since_unix_epoch()` | Returns signed days since 1970-01-01 |
| `from_days_since_unix_epoch(days)` | Converts signed epoch days into a date |

Invalid dates return `Error::InvalidDate`. Epoch day values that cannot fit in
`Date` return `Error::DateOutOfRange`.

### `Coordinates`

```rust
let coordinates = Coordinates::new(-6.2, 106.8)?;
assert_eq!(coordinates.latitude(), -6.2);
assert_eq!(coordinates.longitude(), 106.8);
```

Latitude must be finite and between `-90.0` and `90.0`. Longitude must be
finite and between `-180.0` and `180.0`. Invalid values return
`Error::InvalidCoordinates`.

### `UtcOffset`

```rust
let offset = UtcOffset::from_hours(7.0)?;
assert_eq!(offset.hours(), 7.0);
```

The offset must be finite and between `-24.0` and `24.0` hours. Fractional
offsets are supported. Invalid values return `Error::InvalidUtcOffset`.

## Calculation methods

### `CalculationMethod`

`CalculationMethod` selects a built-in preset or custom parameters.

| Variant | String key | Authority or region |
| --- | --- | --- |
| `Mwl` | `mwl` | Muslim World League |
| `Makkah` | `makkah` | Umm al-Qura University, Makkah |
| `Isna` | `isna` | Islamic Society of North America |
| `Egypt` | `egypt` | Egyptian General Authority of Survey |
| `Karachi` | `karachi` | University of Islamic Sciences, Karachi |
| `Turkey` | `turkey` | Türkiye Presidency of Religious Affairs |
| `Singapore` | `singapore` | Majlis Ugama Islam Singapura |
| `Jakim` | `jakim` | Department of Islamic Development Malaysia |
| `Kemenag` | `kemenag` | Ministry of Religious Affairs of Indonesia |
| `France` | `france` | Union of Islamic Organisations of France |
| `Russia` | `russia` | Spiritual Administration of Muslims of Russia |
| `Dubai` | `dubai` | Dubai method |
| `Qatar` | `qatar` | Qatar method |
| `Kuwait` | `kuwait` | Kuwait method |
| `Jordan` | `jordan` | Jordan method |
| `Gulf` | `gulf` | Gulf region method |
| `Tunisia` | `tunisia` | Tunisia method |
| `Algeria` | `algeria` | Algeria method |
| `Morocco` | `morocco` | Morocco method |
| `Portugal` | `portugal` | Portugal method |
| `Moonsighting` | `moonsighting` | Moonsighting Committee |
| `Custom` | `custom` | Caller supplied parameters |

Use `as_str()` to obtain the canonical lowercase key. The enum also implements
`FromStr`:

```rust
use std::str::FromStr;

let method = CalculationMethod::from_str("kemenag")?;
assert_eq!(method, CalculationMethod::Kemenag);
assert_eq!(method.as_str(), "kemenag");
```

An unknown key returns `Error::UnknownCalculationMethod`.

### `AsrSchool`

| Variant | Rule |
| --- | --- |
| `Standard` | One shadow length |
| `Hanafi` | Two shadow lengths |

### `MidnightMode`

`MidnightMode::Standard` is the only available variant. The C parameter struct
contains this value, but the current calculation does not read it and no
midnight time is returned.

### `MethodParams`

`MethodParams::for_method` loads an owned copy of a built-in preset.
`MethodParams::new` creates zeroed custom parameters with a supplied name.

| Field | Meaning | Validation |
| --- | --- | --- |
| `name` | Human readable name | Must not contain a null byte |
| `fajr_angle` | Fajr solar depression angle | Finite, from 0 through 90 |
| `isha_angle` | Isha solar depression angle | Finite, from 0 through 90 |
| `isha_interval_minutes` | Minutes after Maghrib when the angle is zero | Nonnegative |
| `maghrib_interval_minutes` | Minutes after sunset | Nonnegative |
| `asr_school` | Asr shadow rule | `Standard` or `Hanafi` |
| `midnight_mode` | Midnight convention | `Standard` |
| `ihtiyat_minutes` | Precautionary adjustment | Passed through as an integer |

Use `validate()` to check edited or custom values. `calculate` calls the same
validation automatically.

The high latitude strategy enum from the C header is not exposed. The current C
implementation applies its angle based fallback directly, so a Rust selector
would not change a calculation.

## Result types

### `PrayerTimes`

The result contains seven public `PrayerTime` fields:

```rust
pub struct PrayerTimes {
    pub fajr: PrayerTime,
    pub sunrise: PrayerTime,
    pub dhuha: PrayerTime,
    pub dhuhr: PrayerTime,
    pub asr: PrayerTime,
    pub maghrib: PrayerTime,
    pub isha: PrayerTime,
}
```

### `PrayerTime`

`PrayerTime` stores a finite decimal hour value. Create one directly with
`PrayerTime::try_from_decimal_hours` or receive one from `calculate`.

| Method | Behavior |
| --- | --- |
| `decimal_hours()` | Returns the original decimal hour value |
| `format_hm()` | Formats `HH:MM` with the library minute ceiling convention |
| `format_hms()` | Formats `HH:MM:SS`, rounded to the nearest second |
| `hour()` | Returns the hour component after second rounding |
| `minute()` | Returns the minute component after second rounding |
| `second()` | Returns the second component after second rounding |

`format_hm()` can differ from `minute()` because `format_hm()` rounds upward to
the next minute, while component accessors round the complete value to the
nearest second.

## Errors

All fallible operations return `libmuslim::prayertimes::Error`.

| Variant | Cause |
| --- | --- |
| `InvalidDate` | Invalid Gregorian date components |
| `InvalidCoordinates` | Nonfinite or out of range latitude or longitude |
| `InvalidUtcOffset` | Nonfinite or out of range UTC offset |
| `InvalidMethodParams` | Invalid calculation parameters |
| `UnknownCalculationMethod` | Unknown method string |
| `StringContainsNul` | A string passed to C contains a null byte |
| `InvalidCString` | A C string is not valid UTF-8 |
| `NullPointer` | A C function unexpectedly returns a null pointer |
| `NonFiniteResult` | A calculated prayer time is not finite |
| `DateOutOfRange` | Epoch days cannot be represented by `Date` |

`Error` implements `std::error::Error`, `Display`, and `Debug`.

## Constants

The `libmuslim::prayertimes::constants` module exposes the mathematical and
astronomical constants used by the algorithm:

| Constant |
| --- |
| `DEGREES_TO_RADIANS` |
| `RADIANS_TO_DEGREES` |
| `JULIAN_EPOCH` |
| `SUN_MEAN_ANOMALY_OFFSET` |
| `SUN_MEAN_ANOMALY_RATE` |
| `SUN_MEAN_LONGITUDE_OFFSET` |
| `SUN_MEAN_LONGITUDE_RATE` |
| `SUN_ECCENTRICITY_AMPLITUDE_1` |
| `SUN_ECCENTRICITY_AMPLITUDE_2` |
| `OBLIQUITY_COEFFICIENT` |
| `OBLIQUITY_RATE` |
| `REFRACTION_CORRECTION` |
| `DHUHA_ALTITUDE` |

See the [Quick start](./quick-start) for complete calculation examples, or use
[docs.rs](https://docs.rs/libmuslim-rs) for generated Rust API documentation.
