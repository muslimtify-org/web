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

Strategy for high-latitude locations where the Sun may not reach the required depression angle. The enumerators are `HIGHLAT_NONE`, `HIGHLAT_MIDDLE_OF_NIGHT`, `HIGHLAT_ONE_SEVENTH`, `HIGHLAT_ANGLE_BASED` and `HIGHLAT_NEAREST_LATITUDE`.

Since `v0.2.0` this is a property of the calculation method rather than a global fallback. `MethodParams` carries `high_lat_method` and `high_lat_ref`, and `calculate_prayer_times()` reads them.

Every value except `HIGHLAT_NEAREST_LATITUDE` is defined in terms of the interval between sunset and sunrise, so none of them can answer inside the polar circle, where that interval does not exist. `high_lat_ref` supplies a reference latitude for exactly that case, and it is consulted only there.

:::note Most methods carry no rule, and that is deliberate
Only two of the researched authorities publish a position. `CALC_MWL` carries `HIGHLAT_ANGLE_BASED` with a reference latitude of 45, which its own Fiqh Council decree names. `CALC_MOONSIGHTING` carries `HIGHLAT_ONE_SEVENTH` anchored at 60, which its published page states.

The other 20 methods carry no reference latitude, so inside the polar circle their prescribed times are non-finite rather than substituted. The library declines to attribute a ruling to an authority that never issued one. Tracked as [libmuslim#51](https://github.com/muslimtify-org/libmuslim/issues/51).
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
  HighLatMethod high_lat_method; // rule this authority publishes, if any
  double high_lat_ref;  // reference latitude for the polar case; 0 => none
} MethodParams;
```

#### `struct PrayerTimes`

The five prescribed prayer times, each expressed as **decimal hours** in local time (for example `17.75` means 17:45). Use `format_time_hm()` or `format_time_hms()` to render them.

```c
struct PrayerTimes {
  double fajr;
  double dhuhr;
  double asr;
  double maghrib;
  double isha;
};
```

:::info `sunrise` and `dhuha` were removed in `v0.2.0`
Neither is a prescribed prayer. Sunrise is the end of the fajr window, and dhuha is a voluntary prayer carried only by Indonesian timetables.

Both are still computed inside the library, because maghrib is sunset and every high-latitude substitution measures the night between sunset and sunrise, but neither is part of the contract. Code reading `t.sunrise` or `t.dhuha` will not compile against `v0.2.0`.
:::

:::caution Values are not guaranteed to lie inside a single day
A field is normally in the range 0 to 24, but at high latitude it may not be.

Above roughly 66 degrees the Sun can fail to reach the altitude an event is defined by, and the field is then non-finite. This depends partly on the method: those carrying a `high_lat_ref`, currently MWL and Moonsighting, substitute the polar day from that reference latitude, and the other 20 report the affected times as unavailable.

Carrying a reference latitude is not the same as always resolving. Since `v0.2.1` no method reports asr where the Sun casts no shadow, which is any day the separation between the latitude and the solar declination reaches 90 degrees. There is a narrow band, four days a year at Longyearbyen, where the Sun is visible only by refraction: sunrise exists and fajr, maghrib and isha all resolve, but nothing casts a shadow, so asr alone is non-finite even under MWL.

Separately, the high-latitude fallback for fajr and isha can return a value below 0 or at or above 24, which means the event falls on the previous or the next calendar day.

This matters if you convert a field into a date or a timestamp rather than
printing it. The double carries the day offset and nothing else does, so
reducing it into 0 to 24 yourself would silently move the event onto the wrong
day. Check with `isfinite()` before using a field, and keep the whole value
when you build an instant from it.

`format_time_hm()` and `format_time_hms()` handle both cases, but a printed
clock string cannot express a date, so they do not preserve the day offset.
:::

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

A value outside 0 to 24 is first reduced onto the clock face, so `25.075`
renders as `01:05` and `-0.104` as `23:54`. The output names an hour of the
day and cannot say which day, so read the raw double if you need that.

A non-finite value renders as `--:--`, which also fits in 6 bytes.

#### `format_time_hms`

```c
void format_time_hms(double timeHours, char *outBuffer, size_t bufSize);
```

Writes a decimal-hours value into `outBuffer` as `"HH:MM:SS"`. A buffer of 9
bytes or more is enough. Seconds are rounded to nearest, so this does not
follow the round-up-to-the-minute convention that `format_time_hm()` uses.

The same reduction applies, so `-0.104` renders as `23:53:46`. A non-finite
value renders as `--:--:--`, which also fits in 9 bytes.

### Calendar helpers

A matched pair that converts between a civil (proleptic Gregorian) date and a
day number counted from 1970-01-01. They exist so you can walk a range of dates
without going through `struct tm` or `mktime()`, which keeps daylight saving and
local-time behaviour out of the loop entirely.

Both are `static inline` and are declared **outside** the implementation guard,
so they are available from every translation unit that includes the header. You
do not need to define `PRAYERTIMES_IMPLEMENTATION` to call them, and they add
nothing at link time.

#### `mt_days_from_civil`

```c
static inline long mt_days_from_civil(int y, int m, int d);
```

Returns the number of days from 1970-01-01 to the given date. The result is
signed, so any date before the epoch is negative. `1970-01-01` returns `0` and
`1969-12-31` returns `-1`.

`m` is 1-12 and `d` is 1-31. The conversion is arithmetic and does not validate
the date, so an impossible day such as 31 February still produces a number.
Validate the input yourself if it comes from a user.

#### `mt_civil_from_days`

```c
static inline void mt_civil_from_days(long z, int *y, int *m, int *d);
```

The inverse. Writes the calendar date for day number `z` into `*y`, `*m` and
`*d`. Round-tripping a value through both functions returns the original, across
pre-epoch and far-future day numbers alike.

#### Example: prayer times for a whole month

```c
const MethodParams *params = method_params_get(CALC_KEMENAG);

long start = mt_days_from_civil(2026, 7, 1);
long end   = mt_days_from_civil(2026, 7, 31);

for (long serial = start; serial <= end; serial++) {
    int y, m, d;
    mt_civil_from_days(serial, &y, &m, &d);

    struct PrayerTimes t =
        calculate_prayer_times(y, m, d, -6.2851291, 106.9814968, 7.0, params);

    char buffer[16];
    format_time_hm(t.fajr, buffer, sizeof(buffer));
    printf("%04d-%02d-%02d  Fajr: %s\n", y, m, d, buffer);
}
```

Incrementing the day number is what makes this safe. Adding 86400 seconds to a
`time_t` would drift by an hour across a daylight saving transition, and
month-end rollover would have to be handled by hand.

:::note
Both functions use Howard Hinnant's public-domain civil calendar algorithm. The
`mt_` prefix is retained so this header stays byte-comparable with the copy
vendored inside Muslimtify itself.
:::

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

- **POSIX**: reads the zone's TZif file directly from the system tz database, resolved against `TZDIR` (falling back to `/usr/share/zoneinfo`).
- **Windows**: uses `EnumDynamicTimeZoneInformation` and
  `SystemTimeToTzSpecificLocalTimeEx`, translating IANA names through a
  CLDR-derived table. Zones outside that table cannot be resolved and are
  reported as a failure.

### Functions

#### `parse_timezone_offset`

```c
int parse_timezone_offset(const char *tz_name, time_t when, double *out);
```

Writes the UTC offset, in hours, for the IANA zone `tz_name` at the instant
`when` (Unix epoch seconds, UTC) into `*out`. Daylight saving is already
applied: for `"Europe/London"` this yields `0.0` in winter and `1.0` during
British Summer Time. Pass the result straight into `calculate_prayer_times()`.

Returns `0` on success. Returns `-1` if `tz_name` or `out` is `NULL`, or if the
zone cannot be resolved by the host, leaving `*out` untouched.

On POSIX, `tz_name` may also be an absolute path to a TZif file, either form
with a leading `:`, or a bare POSIX TZ string such as `"WIB-7"` when no matching
file exists. TZif files below version 2 are not read.

:::note
This function used to return the offset as a `double`, with `0.0` standing for
both real UTC and an unresolvable zone. It now reports failure separately, so
those two cases can be told apart.
:::

#### `get_system_timezone`

```c
int get_system_timezone(char *buf, size_t cap);
```

Writes the host system's IANA time zone name (such as `"Asia/Jakarta"`) into
`buf`. `cap` is the size of `buf` in bytes. Returns `0` on success, or `-1` on
failure, in which case `buf` is set to `"UTC"` when there is room.
