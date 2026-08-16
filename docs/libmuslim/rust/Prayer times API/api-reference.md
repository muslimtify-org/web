---
title: API reference
sidebar_position: 3
---

# API reference

Complete reference for the public interface of `libmuslim-rs`. The crate is published as `libmuslim-rs` and imported as `libmuslim`.

The generated rustdoc for the exact version you depend on is on [docs.rs](https://docs.rs/libmuslim-rs).

## `libmuslim::prayertimes`

Wraps `prayertimes.h`. Pure astronomy: it takes a date, a location and an explicit UTC offset, and returns times. It consults no time zone database and applies no daylight saving rule of its own.

### `calculate`

```rust
pub fn calculate(
    date: Date,
    coordinates: Coordinates,
    utc_offset: UtcOffset,
    params: &MethodParams,
) -> Result<PrayerTimes, Error>
```

Calculates all seven prayer-related times. `utc_offset` must be the offset applicable to `date`, which is not necessarily the offset applicable today.

Returns `Error::InvalidMethodParams` if `params` fails validation, and `Error::NonFiniteResult` if the underlying calculation produces a time that is not finite, which happens at extreme latitudes where a prayer has no solution on the given date.

### Types

#### `Date`

A validated proleptic Gregorian date.

```rust
Date::new(year: i32, month: u8, day: u8) -> Result<Self, Error>
```

Rejects a month outside 1 through 12 and a day outside the length of that month, leap years included, with `Error::InvalidDate`.

| Method | Returns | Notes |
| --- | --- | --- |
| `year()` | `i32` | |
| `month()` | `u8` | 1 through 12 |
| `day()` | `u8` | |
| `days_since_unix_epoch()` | `i64` | Signed day count from 1970-01-01 |
| `Date::from_days_since_unix_epoch(days: i64)` | `Result<Self, Error>` | Inverse of the above; `Error::DateOutOfRange` if the day count does not land on a representable date |

The day-count pair is the bridge to `timezone::offset_at`, which takes seconds rather than days: multiply by 86400 to get the instant at midnight UTC on that date.

#### `Coordinates`

```rust
Coordinates::new(latitude: f64, longitude: f64) -> Result<Self, Error>
```

Latitude must be within -90 to 90, longitude within -180 to 180, and both must be finite. Anything else is `Error::InvalidCoordinates`. Read them back with `latitude()` and `longitude()`.

#### `UtcOffset`

```rust
UtcOffset::from_hours(hours: f64) -> Result<Self, Error>
```

A possibly fractional offset in hours, so UTC+5:45 is `5.75`. Must be finite and within -24 to 24, otherwise `Error::InvalidUtcOffset`. Read it back with `hours()`.

#### `CalculationMethod`

An enum naming the built-in methods. `MethodParams::for_method` turns one into its parameters.

| Variant | String key | Authority |
| --- | --- | --- |
| `Mwl` | `mwl` | Muslim World League |
| `Makkah` | `makkah` | Umm al-Qura, Makkah |
| `Isna` | `isna` | Islamic Society of North America |
| `Egypt` | `egypt` | Egyptian General Authority of Survey |
| `Karachi` | `karachi` | University of Islamic Sciences, Karachi |
| `Turkey` | `turkey` | Türkiye Presidency of Religious Affairs |
| `Singapore` | `singapore` | Majlis Ugama Islam Singapura |
| `Jakim` | `jakim` | Department of Islamic Development Malaysia |
| `Kemenag` | `kemenag` | Ministry of Religious Affairs of Indonesia |
| `France` | `france` | Union of Islamic Organisations of France |
| `Russia` | `russia` | Spiritual Administration of Muslims of Russia |
| `Dubai` | `dubai` | Dubai |
| `Qatar` | `qatar` | Qatar |
| `Kuwait` | `kuwait` | Kuwait |
| `Jordan` | `jordan` | Jordan |
| `Gulf` | `gulf` | Gulf region |
| `Tunisia` | `tunisia` | Tunisia |
| `Algeria` | `algeria` | Algeria |
| `Morocco` | `morocco` | Morocco |
| `Portugal` | `portugal` | Comunidade Islamica de Lisboa |
| `Moonsighting` | `moonsighting` | Moonsighting Committee |
| `Custom` | `custom` | Caller-supplied parameters |

`as_str()` returns the canonical lowercase key. `FromStr` parses one back, folding ASCII case, so `"KEMENAG"` and `"kemenag"` both work. An unrecognized name is `Error::UnknownCalculationMethod`.

```rust
use std::str::FromStr;

use libmuslim::prayertimes::CalculationMethod;

let method = CalculationMethod::from_str("KEMENAG")?;
assert_eq!(method.as_str(), "kemenag");
```

:::note
The C `method_from_string()` returns `CALC_CUSTOM` both for a real `"custom"` and for anything it does not recognize. `FromStr` separates the two, so a typo is an error rather than a silent fall back to custom parameters.
:::

#### `AsrSchool`

The juristic shadow-length rule used for Asr: `Standard` (one shadow length) or `Hanafi` (two).

#### `MidnightMode`

`Standard` is the only value. It is a real field of the C `MethodParams` struct, but the C calculation does not currently read it and no midnight time is returned.

#### `MethodParams`

The parameters of a calculation. All fields are public, so a preset can be loaded and then adjusted.

| Field | Type | Meaning |
| --- | --- | --- |
| `name` | `String` | Human-readable name passed through to C |
| `fajr_angle` | `f64` | Solar depression angle for Fajr, in degrees |
| `isha_angle` | `f64` | Solar depression angle for Isha, in degrees |
| `isha_interval_minutes` | `i32` | Fixed interval after Maghrib; zero means use the angle |
| `maghrib_interval_minutes` | `i32` | Fixed interval after sunset |
| `asr_school` | `AsrSchool` | Juristic rule for Asr |
| `midnight_mode` | `MidnightMode` | Midnight convention |
| `ihtiyat_minutes` | `i32` | Precautionary adjustment added to calculated times |

```rust
MethodParams::for_method(method: CalculationMethod) -> Result<Self, Error>
MethodParams::new(name: impl Into<String>) -> Self
params.validate() -> Result<(), Error>
```

`for_method` returns an owned copy of a built-in preset. `new` starts from defaults for a fully custom method. `validate` is called for you by `calculate`, and is exposed so you can check parameters before you have a date and location to use them with.

Validation requires both angles to be finite and within 0 to 90 degrees, both intervals to be non-negative, and `name` to contain no interior NUL byte. Failures are `Error::InvalidMethodParams` naming the offending field.

##### Built-in presets

Angles are in degrees, intervals and ihtiyat in minutes. Every preset uses the standard Asr rule.

| Method | Fajr | Isha | Isha interval | Maghrib interval | Ihtiyat |
| --- | --- | --- | --- | --- | --- |
| `mwl` | 18 | 17 | 0 | 0 | 0 |
| `makkah` | 18.5 | 0 | 90 | 0 | 0 |
| `isna` | 15 | 15 | 0 | 0 | 0 |
| `egypt` | 19.5 | 17.5 | 0 | 0 | 0 |
| `karachi` | 18 | 18 | 0 | 0 | 0 |
| `turkey` | 18 | 17 | 0 | 0 | 0 |
| `singapore` | 20 | 18 | 0 | 0 | 0 |
| `jakim` | 20 | 18 | 0 | 0 | 0 |
| `kemenag` | 20 | 18 | 0 | 0 | 2 |
| `france` | 12 | 12 | 0 | 0 | 0 |
| `russia` | 16 | 15 | 0 | 0 | 0 |
| `dubai` | 18.2 | 18.2 | 0 | 0 | 0 |
| `qatar` | 18 | 0 | 90 | 0 | 0 |
| `kuwait` | 18 | 17.5 | 0 | 0 | 0 |
| `jordan` | 18 | 18 | 0 | 0 | 5 |
| `gulf` | 19.5 | 0 | 90 | 0 | 0 |
| `tunisia` | 18 | 18 | 0 | 0 | 0 |
| `algeria` | 18 | 17 | 0 | 0 | 0 |
| `morocco` | 19 | 17 | 0 | 0 | 0 |
| `portugal` | 18 | 0 | 77 | 3 | 0 |
| `moonsighting` | 18 | 18 | 0 | 3 | 0 |
| `custom` | 18 | 17 | 0 | 0 | 0 |

An Isha angle of 0 paired with a non-zero interval means that method defines Isha as a fixed number of minutes after Maghrib rather than by a solar angle.

#### `PrayerTimes`

The result of a calculation. Seven public `PrayerTime` fields: `fajr`, `sunrise`, `dhuha`, `dhuhr`, `asr`, `maghrib`, `isha`.

#### `PrayerTime`

A validated time of day, held as decimal hours.

| Method | Returns | Notes |
| --- | --- | --- |
| `decimal_hours()` | `f64` | The underlying value |
| `format_hm()` | `String` | `HH:MM`, using libmuslim's minute-ceiling convention |
| `format_hms()` | `String` | `HH:MM:SS`, rounded to the nearest second |
| `hour()` | `i32` | Component after rounding to the nearest second |
| `minute()` | `i32` | As above |
| `second()` | `i32` | As above |
| `PrayerTime::try_from_decimal_hours(f64)` | `Result<Self, Error>` | Rejects non-finite values |

:::caution
`format_hm()` and `minute()` can disagree by a minute. `format_hm()` reproduces the C `format_time_hm()`, which ceilings to the next whole minute so a printed time is never earlier than the calculated one. `minute()` rounds the complete time to the nearest second instead.

A time of 05:00:06 formats as `05:01` but reports `minute() == 0`. Use `format_hm()` for anything a person reads, and the components for arithmetic.
:::

### `Error`

`#[non_exhaustive]`, so a `match` needs a catch-all arm. Implements `Display` and `std::error::Error`.

| Variant | Cause |
| --- | --- |
| `InvalidDate { year, month, day }` | Not a real calendar date |
| `InvalidCoordinates { latitude, longitude }` | Non-finite or out of range |
| `InvalidUtcOffset { hours }` | Non-finite or outside -24 to 24 |
| `InvalidMethodParams { field, reason }` | A parameter failed validation |
| `UnknownCalculationMethod(String)` | Unrecognized method name |
| `StringContainsNul` | A string passed to C contains an interior NUL |
| `InvalidCString` | A string returned by C is not valid UTF-8 |
| `NullPointer(&'static str)` | A C function unexpectedly returned null |
| `NonFiniteResult(&'static str)` | A calculated time is not finite |
| `DateOutOfRange(i64)` | A day count cannot be represented as a `Date` |

### `constants`

`libmuslim::prayertimes::constants` re-exports the astronomical constants the C implementation uses, so a caller reproducing part of the calculation uses the same values rather than its own copies: `DEGREES_TO_RADIANS`, `RADIANS_TO_DEGREES`, `JULIAN_EPOCH`, `SUN_MEAN_ANOMALY_OFFSET`, `SUN_MEAN_ANOMALY_RATE`, `SUN_MEAN_LONGITUDE_OFFSET`, `SUN_MEAN_LONGITUDE_RATE`, `SUN_ECCENTRICITY_AMPLITUDE_1`, `SUN_ECCENTRICITY_AMPLITUDE_2`, `OBLIQUITY_COEFFICIENT`, `OBLIQUITY_RATE`, `REFRACTION_CORRECTION`, `DHUHA_ALTITUDE`.

Each is asserted equal to the C header's value by the crate's test suite, so the two cannot drift apart unnoticed.

---

## `libmuslim::timezone`

Wraps `timezone.h`. Optional: use it only when you do not already know the UTC offset to pass to `calculate`.

Both functions are safe to call concurrently. Neither takes a lock nor mutates process-global state.

### `offset_at`

```rust
pub fn offset_at(zone: &str, unix_timestamp: i64) -> Result<UtcOffset, TimezoneError>
```

Resolves the UTC offset for an IANA zone at an instant, expressed as Unix epoch seconds. Daylight saving and historical zone changes are applied by the host: for `"Europe/London"` this yields `0.0` in winter and `1.0` during British Summer Time.

Only IANA zone names are accepted. A name the host cannot resolve is `TimezoneError::UnknownZone`, so a typo such as `"Asia/Jakata"` fails rather than reading as UTC. Bare POSIX TZ strings such as `"XYZ8"` and absolute paths to zone files are rejected on every platform, even where the underlying C library would resolve them, so that the same input behaves the same way everywhere.

The offset is resolved from the operating system's zone database on POSIX and through the Windows time zone APIs on Windows. On Windows, zones outside the bundled IANA to Windows translation table cannot be resolved.

### `system_timezone`

```rust
pub fn system_timezone() -> Result<String, TimezoneError>
```

Returns the host's IANA zone name, such as `"Asia/Jakarta"`. Reads `/etc/localtime` on POSIX and calls `GetDynamicTimeZoneInformation` on Windows.

```rust
use libmuslim::timezone::{offset_at, system_timezone};

let zone = system_timezone()?;
let offset = offset_at(&zone, 1_784_073_600)?;
```

### `TimezoneError`

`#[non_exhaustive]`, so a `match` needs a catch-all arm. Implements `Display` and `std::error::Error`.

| Variant | Cause |
| --- | --- |
| `ZoneContainsNul` | The zone name contains an interior NUL byte |
| `TimestampOutOfRange(i64)` | The timestamp cannot be represented by the platform `time_t` |
| `UnknownZone(String)` | Not an IANA zone the host can resolve |
| `SystemTimezoneUnavailable` | The host zone could not be detected |
| `MalformedNativeOutput` | C returned a string without a NUL terminator |
| `InvalidUtf8` | C returned a zone name that is not valid UTF-8 |
| `InvalidOffset(f64)` | C returned a non-finite or out-of-range offset |

---

## Relationship to the C API

The binding exposes what the headers expose and adds no calculation features of its own. The differences are all about contracts the C API documents but cannot enforce.

| C | Rust |
| --- | --- |
| `calculate_prayer_times()` takes seven loose scalars | `calculate()` takes `Date`, `Coordinates` and `UtcOffset`, each validated on construction |
| `method_from_string()` returns `CALC_CUSTOM` for an unknown name | `FromStr` returns `Error::UnknownCalculationMethod` |
| `method_params_get()` returns a pointer into static storage | `MethodParams::for_method()` returns an owned, mutable copy |
| `format_time_hm()` writes into a caller-supplied buffer | `format_hm()` returns a `String` |
| A prayer with no solution yields a non-finite `double` | `Error::NonFiniteResult` |
| `HighLatMethod` is declared in the header | Not exposed, because `calculate_prayer_times()` never reads it and the high-latitude fallback is fixed to the angle-based rule |

The C reference for the same headers is in the [C API section](../../c/Prayer%20times%20API/api-reference).
