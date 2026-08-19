---
title: API reference
sidebar_position: 3
---

# API reference

Complete reference for the public interface of `libmuslim_dart`. Every symbol below is exported from `package:libmuslim_dart/prayertimes.dart`.

Nothing else is public. The generated FFI bindings live under `lib/src/` and are deliberately not exported, see [the overview](./overview#the-ffi-layer-is-not-public).

## `PrayerTimes`

The prayer times for one civil day at one location. Instances are immutable and are produced by one of two factories.

### `PrayerTimes.forDate`

```dart
factory PrayerTimes.forDate(
  DateTime date, {
  required double latitude,
  required double longitude,
  required Duration utcOffset,
  CalculationParameters parameters =
      const CalculationParameters.of(CalculationMethod.mwl),
})
```

Calculates all seven times for the civil date of `date`.

Only `date`'s year, month and day are read. The C library takes a civil date rather than an instant, so whichever zone `date` carries is irrelevant, and `DateTime.utc(2026, 7, 12)` and a local `DateTime(2026, 7, 12)` give the same result.

`utcOffset` must be the offset applicable to that date, which is not necessarily the offset applicable today.

Throws `ArgumentError` for a latitude outside -90 to 90, a longitude outside -180 to 180, any non-finite coordinate, or an offset outside -18 to +18 hours. Throws [`PrayerTimesUnavailable`](#prayertimesunavailable) when the calculation yields a non-finite time.

### `PrayerTimes.today`

```dart
factory PrayerTimes.today({
  required double latitude,
  required double longitude,
  required Duration utcOffset,
  CalculationParameters parameters =
      const CalculationParameters.of(CalculationMethod.mwl),
})
```

Today's times. "Today" is the civil date at `utcOffset`, not on the device: a caller in London asking about Jakarta gets Jakarta's today. Same errors as `forDate`.

### Times

Five `DateTime` fields: `fajr`, `dhuhr`, `asr`, `maghrib`, `isha`.

`sunrise` and `dhuha` were removed in `prayertimes.h` `v0.2.0`. Neither is a prescribed prayer: sunrise is the end of the fajr window, and dhuha is a voluntary prayer carried only by Indonesian timetables.

Every one is **UTC**, and carries whole minutes only, so `second`, `millisecond` and `microsecond` are always zero.

:::note
Times round **up** to the whole minute. This reproduces the C `format_time_hm()`, whose ceiling convention means a displayed time is never earlier than the calculated one. The rounding is applied uniformly to every field, because that is what the C formatter does.
:::

A UTC instant is not a wall-clock time. To render one for a reader, add the offset of the place it describes:

```dart
final local = times.fajr.add(times.utcOffset);
```

Calling `.toLocal()` instead converts to the **device's** zone, which is only correct when the device happens to be in the location you asked about.

### Other fields

| Field | Type | Meaning |
| --- | --- | --- |
| `date` | `DateTime` | The civil date these times are for, as UTC midnight |
| `latitude` | `double` | As passed |
| `longitude` | `double` | As passed |
| `utcOffset` | `Duration` | As passed |

### Methods

```dart
DateTime timeOf(Prayer prayer)
Prayer? current([DateTime? at])
Prayer? next([DateTime? at])
Duration? timeUntilNext([DateTime? at])
```

`timeOf` returns the time of any member of `Prayer`.

`current` returns the prayer whose window `at` falls in, and `next` returns the first prayer after `at`. Since `v0.2.0` every member of `Prayer` is a prescribed prayer, so neither method skips anything.

Both are nullable, and null means "outside this day's range": `current` is null before Fajr, `next` is null after Isha. They do not wrap to the neighbouring day, because these are one day's times, and the answer past Isha belongs to the next day's object. Construct it yourself when you need a rolling view.

`at` defaults to `DateTime.now()` and is compared as an instant, so a `DateTime` in any zone works.

## `Prayer`

```dart
enum Prayer { fajr, dhuhr, asr, maghrib, isha }
```

`sunrise` and `dhuha` were members until `prayertimes.h` `v0.2.0` removed them. Every remaining member is a prescribed prayer, so there is no longer a distinction between a member of `Prayer` and a prayer.

## `CalculationMethod`

The 21 built-in methods. Pass one to [`CalculationParameters.of`](#calculationparametersof).

| Member | Key | Authority |
| --- | --- | --- |
| `mwl` | `mwl` | Muslim World League |
| `makkah` | `makkah` | Umm al-Qura, Makkah |
| `isna` | `isna` | Islamic Society of North America |
| `egypt` | `egypt` | Egyptian General Authority of Survey |
| `karachi` | `karachi` | University of Islamic Sciences, Karachi |
| `turkey` | `turkey` | Türkiye Presidency of Religious Affairs |
| `singapore` | `singapore` | Majlis Ugama Islam Singapura |
| `jakim` | `jakim` | Department of Islamic Development Malaysia |
| `kemenag` | `kemenag` | Ministry of Religious Affairs of Indonesia |
| `france` | `france` | Union of Islamic Organisations of France |
| `russia` | `russia` | Spiritual Administration of Muslims of Russia |
| `dubai` | `dubai` | Dubai |
| `qatar` | `qatar` | Qatar |
| `kuwait` | `kuwait` | Kuwait |
| `jordan` | `jordan` | Jordan |
| `gulf` | `gulf` | Gulf region |
| `tunisia` | `tunisia` | Tunisia |
| `algeria` | `algeria` | Algeria |
| `morocco` | `morocco` | Morocco |
| `portugal` | `portugal` | Comunidade Islamica de Lisboa |
| `moonsighting` | `moonsighting` | Moonsighting Committee |

| Member | Returns | Notes |
| --- | --- | --- |
| `displayName` | `String` | The full name, for example `KEMENAG, Indonesia` |
| `key` | `String` | The canonical lowercase key, for example `kemenag` |
| `name` | `String` | The Dart enum member name, from `dart:core` |

```dart
print(CalculationMethod.kemenag.displayName);   // KEMENAG, Indonesia
print(CalculationMethod.kemenag.key);           // kemenag
```

Both are read from the C method table on each access rather than duplicated in Dart, so the two cannot drift apart.

:::note
The C `CALC_CUSTOM` and `CALC_COUNT` have no member here. `COUNT` is a sentinel rather than a method, and a custom method is expressed by [`CalculationParameters.custom`](#calculationparameterscustom) rather than by an enum value. That also means there is no equivalent of the C `method_from_string()`, whose habit of returning `CALC_CUSTOM` for an unrecognized name turns a typo into silently wrong parameters.
:::

### Built-in presets

Angles in degrees, intervals and ihtiyat in minutes. Every preset uses the standard Asr rule.

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

An Isha angle of 0 paired with a non-zero interval means that method defines Isha as a fixed number of minutes after Maghrib rather than by a solar angle.

## `AsrSchool`

```dart
enum AsrSchool { standard, hanafi }
```

The juristic shadow-length rule for Asr: `standard` is one shadow length, `hanafi` is two. Hanafi always places Asr later.

## `CalculationParameters`

The parameter set a calculation runs with. Immutable, with two constructors.

### `CalculationParameters.of`

```dart
const CalculationParameters.of(
  CalculationMethod method, {
  AsrSchool? asrSchool,
  int? ihtiyat,
})
```

A published method, optionally with the two adjustments practitioners vary. Leaving both overrides null passes the C library's own table entry through untouched and allocates nothing.

Being `const`, it is usable as a default argument, which is how `PrayerTimes.forDate` defaults to `CalculationMethod.mwl`. A `const` constructor cannot throw, so a negative `ihtiyat` is rejected where the value is consumed, at the `PrayerTimes` call, rather than at construction. It is still an `ArgumentError`.

### `CalculationParameters.custom`

```dart
CalculationParameters.custom({
  required double fajrAngle,
  double? ishaAngle,
  int? ishaInterval,
  int maghribInterval = 0,
  AsrSchool asrSchool = AsrSchool.standard,
  int ihtiyat = 0,
})
```

A method built from scratch. It is not `const`, and it validates eagerly, throwing `ArgumentError` at construction for:

- neither or both of `ishaAngle` and `ishaInterval`
- `fajrAngle` or `ishaAngle` non-finite or outside 0 to 90 degrees
- a negative `ishaInterval`, `maghribInterval` or `ihtiyat`

:::caution
**Exactly one** of `ishaAngle` and `ishaInterval` must be given. In C, an `isha_angle` of zero silently means "use the interval instead", so a caller passing a literal zero angle would switch modes without noticing. Requiring exactly one makes the choice explicit and the mistake impossible.
:::

| Parameter | Meaning |
| --- | --- |
| `fajrAngle` | Solar depression angle for Fajr, in degrees |
| `ishaAngle` | Solar depression angle for Isha, in degrees |
| `ishaInterval` | Fixed minutes after Maghrib, as an alternative to the angle |
| `maghribInterval` | Fixed minutes after sunset |
| `asrSchool` | Juristic rule for Asr |
| `ihtiyat` | Precautionary minutes added to each time |

## `PrayerTimesUnavailable`

```dart
final class PrayerTimesUnavailable implements Exception {
  final List<Prayer> prayers;
  final double latitude;
  final double longitude;
  final DateTime date;
}
```

Thrown when the C library cannot produce a finite time for one or more prayers. The overwhelmingly common cause is a high latitude where the sun never reaches the depression angle the method requires.

`prayers` lists exactly which ones failed, and which they are depends on the season **and on the method**. Since `v0.2.0` the high-latitude rule belongs to the calculation method, so MWL and Moonsighting carry a reference latitude for the polar case while the other 20 methods do not.

Carrying one is not the same as always resolving. Since `v0.2.1` no method reports asr where the Sun casts no shadow, and at Longyearbyen there is a narrow band of four days a year where the Sun is visible only by refraction: sunrise exists and fajr, maghrib and isha all resolve, but nothing casts a shadow. On those days `prayers` is `[Prayer.asr]` even under MWL.

Under Kemenag at 69.6°N, midsummer loses Fajr, Maghrib and Isha, while midwinter loses only Maghrib. Under the default MWL parameters neither date throws at all. Read the list rather than assuming.

`toString()` names the affected prayers, the date and the coordinates:

```text
PrayerTimesUnavailable: no fajr, maghrib, isha on 2026-06-21 at latitude 69.6496, longitude 18.956
```

## Errors at a glance

| Condition | Thrown |
| --- | --- |
| Latitude outside -90 to 90, or non-finite | `ArgumentError` |
| Longitude outside -180 to 180, or non-finite | `ArgumentError` |
| `utcOffset` outside -18 to +18 hours | `ArgumentError` |
| Neither or both of `ishaAngle` and `ishaInterval` | `ArgumentError` |
| An angle outside 0 to 90 degrees, or non-finite | `ArgumentError` |
| A negative interval or ihtiyat | `ArgumentError` |
| A calculated time is not finite | `PrayerTimesUnavailable` |

`ArgumentError` means your input was wrong. `PrayerTimesUnavailable` means the input was fine and the sky has no answer.

## Relationship to the C API

The binding exposes what `prayertimes.h` exposes and adds no calculation features of its own. The differences are all about contracts the C API documents but cannot enforce.

| C | Dart |
| --- | --- |
| `calculate_prayer_times()` takes seven loose scalars | `PrayerTimes.forDate()` takes named arguments, validated before the call |
| Times are returned as `double` decimal hours | Times are UTC `DateTime` instants |
| `format_time_hm()` writes into a caller-supplied buffer | Not needed, the ceiling convention is applied when the instant is built |
| `method_params_get()` returns a pointer into static storage | `CalculationParameters` copies before it modifies, so the shared table is never written to |
| `method_from_string()` returns `CALC_CUSTOM` for an unknown name | No equivalent, a custom method is a constructor, not a name lookup |
| Passing a null `params` segfaults the process | Unreachable, callers never supply a pointer |
| A prayer with no solution yields a non-finite `double` | `PrayerTimesUnavailable` |
| An out-of-range latitude yields `NaN` | `ArgumentError` |
| `HighLatMethod` is declared in the header | Not exposed. `MethodParams` has no high-latitude field and `calculate_prayer_times()` never reads one, so it would be a lever wired to nothing |
| `MidnightMode` is a field of `MethodParams` | Not exposed. The header defines a single value and the calculation returns no midnight time |
| The astronomical constants are `#define`s in the header | Not exposed. They are implementation details of the C algorithm |

The C reference for the same header is in the [C API section](../../c/Prayer%20times%20API/api-reference), and the Rust binding is in the [Rust API section](../../rust/Prayer%20times%20API/api-reference).
