---
title: API reference
sidebar_position: 3
---

# API reference

Complete reference for the public interface of libmuslim's two headers.

## `prayertimes.h`

Include the header wherever you use the API. In **one** translation unit, define
`PRAYERTIMES_IMPLEMENTATION` before the include to compile the implementation:

```c
#define PRAYERTIMES_IMPLEMENTATION   // one .c file only
#include "prayertimes.h"
```

### Types

#### `CalcMethod`

An enum naming the built-in calculation methods. Pass a value to
`method_params_get()` to obtain its parameters.

| Enumerator | String key | Authority |
| --- | --- | --- |
| `CALC_MWL` | `mwl` | Muslim World League |
| `CALC_MAKKAH` | `makkah` | Umm al-Qura, Makkah |
| `CALC_ISNA` | `isna` | Islamic Society of North America |
| `CALC_EGYPT` | `egypt` | Egyptian General Authority of Survey |
| `CALC_KARACHI` | `karachi` | Univ. of Islamic Sciences, Karachi |
| `CALC_TURKEY` | `turkey` | Diyanet, Turkey |
| `CALC_SINGAPORE` | `singapore` | MUIS, Singapore |
| `CALC_JAKIM` | `jakim` | JAKIM, Malaysia |
| `CALC_KEMENAG` | `kemenag` | Kemenag, Indonesia (Muslimtify default) |
| `CALC_FRANCE` | `france` | UOIF, France |
| `CALC_RUSSIA` | `russia` | Spiritual Administration, Russia |
| `CALC_DUBAI` | `dubai` | GAIAE, Dubai |
| `CALC_QATAR` | `qatar` | Ministry of Awqaf, Qatar |
| `CALC_KUWAIT` | `kuwait` | Ministry of Awqaf, Kuwait |
| `CALC_JORDAN` | `jordan` | Ministry of Awqaf, Jordan |
| `CALC_GULF` | `gulf` | Gulf Region |
| `CALC_TUNISIA` | `tunisia` | Ministry of Religious Affairs, Tunisia |
| `CALC_ALGERIA` | `algeria` | Ministry of Religious Affairs, Algeria |
| `CALC_MOROCCO` | `morocco` | Ministry of Habous, Morocco |
| `CALC_PORTUGAL` | `portugal` | Comunidade Islamica de Lisboa |
| `CALC_MOONSIGHTING` | `moonsighting` | Moonsighting Committee |
| `CALC_CUSTOM` | `custom` | User-supplied parameters |

`CALC_COUNT` is a sentinel equal to the number of methods. It is not a method
itself, use it for bounds checks and array sizes.

#### `AsrSchool`

Shadow-length rule for the Asr time.

| Enumerator | Value | School |
| --- | --- | --- |
| `ASR_STANDARD` | `1` | Shafi'i, Maliki, Hanbali (shadow = object length) |
| `ASR_HANAFI` | `2` | Hanafi (shadow = twice the object length) |

The value corresponds to the `asr_shadow` field of `MethodParams`.

#### `HighLatMethod`

Strategy for high-latitude locations where the sun may not reach the required
depression angle. The enumerators are `HIGHLAT_NONE`,
`HIGHLAT_MIDDLE_OF_NIGHT`, `HIGHLAT_ONE_SEVENTH` and `HIGHLAT_ANGLE_BASED`.

:::note
`calculate_prayer_times()` currently applies an angle-based night fraction as its
automatic fallback when an angle cannot be satisfied. This enum is provided for
callers and future configuration.
:::

#### `MidnightMode`

How Islamic midnight is derived. Currently only `MIDNIGHT_STANDARD` (`0`) is
defined (midpoint between sunset and sunrise).

#### `MethodParams`

The tunable parameters for one calculation method. Obtain a read-only pointer
from `method_params_get()`, or fill your own for `CALC_CUSTOM`.

```c
typedef struct {
  const char *name;     // human-readable label, e.g. "KEMENAG, Indonesia"
  double fajr_angle;    // sun depression angle for Fajr (degrees)
  double isha_angle;    // sun depression angle for Isha; 0 => use interval
  int isha_interval;    // minutes after Maghrib (used when isha_angle == 0)
  int maghrib_interval; // minutes after sunset (0 => Maghrib at sunset)
  int asr_shadow;       // 1 = standard, 2 = Hanafi (see AsrSchool)
  MidnightMode midnight_mode;
  int ihtiyat;          // precautionary minutes added to each time
} MethodParams;
```

#### `struct PrayerTimes`

The computed times, each expressed as **decimal hours** in local time (for
example `17.75` means 17:45). Use `format_time_hm()` or `format_time_hms()` to
render them.

```c
struct PrayerTimes {
  double fajr;
  double sunrise;
  double dhuha;   // Dhuha (roughly 28-30 min after sunrise for Kemenag)
  double dhuhr;
  double asr;
  double maghrib;
  double isha;
};
```

### Functions

#### `calculate_prayer_times`

```c
struct PrayerTimes calculate_prayer_times(
    int year, int month, int day,
    double latitude, double longitude,
    double timezone,
    const MethodParams *params);
```

Calculates all prayer times for the given calendar date and location.

| Parameter | Description |
| --- | --- |
| `year`, `month`, `day` | Gregorian calendar date. `month` is 1-12. |
| `latitude` | Degrees north, negative for south. |
| `longitude` | Degrees east, negative for west. |
| `timezone` | UTC offset in hours (for example `7.0` for UTC+7, `-5.0` for UTC-5). Not resolved from a name, supply it directly or use `parse_timezone_offset()`. |
| `params` | Method parameters, from `method_params_get()` or your own struct. |

Returns a `struct PrayerTimes` by value. Times are decimal hours in the local
time implied by `timezone`.

#### `method_params_get`

```c
const MethodParams *method_params_get(CalcMethod method);
```

Returns a pointer to the built-in parameters for `method`, or `NULL` if `method`
is out of range. The returned pointer is owned by the library, do not free or
modify it.

#### `method_from_string`

```c
CalcMethod method_from_string(const char *name);
```

Maps a lowercase string key (such as `"kemenag"`) to its `CalcMethod`. Returns
`CALC_CUSTOM` if `name` is `NULL` or does not match a known key.

#### `method_to_string`

```c
const char *method_to_string(CalcMethod method);
```

Returns the lowercase string key for `method` (such as `"jakim"`), or `"custom"`
if there is no match. The returned string is a static literal, do not free it.

#### `format_time_hm`

```c
void format_time_hm(double timeHours, char *outBuffer, size_t bufSize);
```

Writes a decimal-hours value into `outBuffer` as `"HH:MM"`. Minutes are always
rounded up, following the Kemenag convention. A buffer of 6 bytes or more is
enough.

#### `format_time_hms`

```c
void format_time_hms(double timeHours, char *outBuffer, size_t bufSize);
```

Writes a decimal-hours value into `outBuffer` as `"HH:MM:SS"`. A buffer of 9
bytes or more is enough.

---

## `timezone.h`

An **optional** companion that resolves a numeric UTC offset from an IANA time
zone name, with daylight saving and historical zone changes honored by the host
operating system. Use it only if you do not already know the offset to pass to
`calculate_prayer_times()`.

```c
#define MUSLIM_TIMEZONE_IMPLEMENTATION   // one .c file only
#include "timezone.h"
```

:::caution
Include `timezone.h` **before** any system `<time.h>` in the translation unit.
On glibc the UTC-offset field requires a feature-test macro that must be set
before `<time.h>` is first included, the header sets it for you, but only if
nothing has pulled in `<time.h>` ahead of it.
:::

Unlike `prayertimes.h`, this header touches the operating system:

- **POSIX**: reads the system tz database via `setenv(TZ)` and `localtime_r()`.
- **Windows**: uses `EnumDynamicTimeZoneInformation` and
  `SystemTimeToTzSpecificLocalTimeEx`, translating IANA names through a
  CLDR-derived table. Zones outside that table resolve to UTC.

### Functions

#### `parse_timezone_offset`

```c
double parse_timezone_offset(const char *tz_name, time_t when);
```

Returns the UTC offset, in hours, for the IANA zone `tz_name` at the instant
`when` (Unix epoch seconds, UTC). Daylight saving is already applied: for
`"Europe/London"` this returns `0.0` in winter and `1.0` during British Summer
Time. Pass the result straight into `calculate_prayer_times()`.

Returns `0.0` if `tz_name` is `NULL` or cannot be resolved by the host.

#### `get_system_timezone`

```c
int get_system_timezone(char *buf, size_t cap);
```

Writes the host system's IANA time zone name (such as `"Asia/Jakarta"`) into
`buf`. `cap` is the size of `buf` in bytes. Returns `0` on success, or `-1` on
failure, in which case `buf` is set to `"UTC"` when there is room.
