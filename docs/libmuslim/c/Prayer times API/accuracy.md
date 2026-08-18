---
title: Accuracy and limits
sidebar_position: 4
---

# Accuracy and limits

Prayer times are an act of worship, so this page states what the library has
actually been measured against, and what it has not. Every figure here is
reproducible with `make check` in the
[libmuslim repository](https://github.com/muslimtify-org/libmuslim).

## What is measured

**Maghrib** is checked against `hijri_find_sunset` from `hijri.h`, which is
itself validated against JPL DE440. The comparison covers latitudes -60 to +60
in steps of 10, longitudes -120, 0 and +120, every day of 2025, 14235 points.

```
maximum absolute difference   6.5966 s
worst case                    latitude -60, longitude -120, 2025-12-17
```

The refraction conventions are paired explicitly for that comparison, so the
bound measures agreement rather than absorbing a constant offset.

**The published-table suite** reports 910 checks against published schedules, at
a uniform tolerance of 2 minutes. Uniform matters here: an earlier version of
the suite carried a 3 minute tolerance on some rows, and two of those rows were
hiding a real defect in how the solar declination was evaluated.

## What is not measured

This is the part worth reading before you ship.

**The 6.5966 second figure is not a global claim.** The oracle covers
`|latitude| <= 60` only. Beyond that the two solvers diverge sharply, because
near the polar circle the Sun crosses the horizon at grazing incidence and a
small altitude difference becomes a large time difference:

```
lat +60    2.39 s        lat -60     6.60 s
lat +66    9.58 s        lat -66   123.65 s
lat +68   29.55 s        lat -68   104.44 s
lat +70   33.37 s        lat -70    77.99 s
```

**Sunrise has no oracle**, because `hijri.h` exposes no sunrise finder. It is
covered only indirectly, by sharing a code path and a declination with sunset.

**Fajr and Isha have no oracle either.** They are covered only by the
published-table fixtures. This matters at high latitude, where they run through
a fallback path that sunset never touches. Tracked as
[libmuslim#52](https://github.com/muslimtify-org/libmuslim/issues/52).

**Asr** is covered only by the published-table fixtures. Refining it was
measured and made results worse, so it was deliberately left alone.

## Known issues

### Dhuha is NaN at high latitude

`dhuha` is the only event solved without a fallback. On days when the Sun never
reaches the dhuha altitude, it is `NaN`, with no error and no sentinel value.

```
onset      about 62.5 degrees of latitude
Reykjavik  40 days a year
lat 66     58 days of 336 sampled
lat 72    130 days of 336 sampled
```

Sunrise and Dhuhr solve normally on those same days, so only this one field is
affected. If you display Dhuha and support high-latitude users, test it:

```c
#include <math.h>

if (isnan(t.dhuha)) {
    // Dhuha does not occur at this location on this date.
}
```

This is a raw C hazard only. Both bindings already guard the output, so you
inherit the check rather than having to write it:

| Binding | Behaviour |
| --- | --- |
| [Rust](../../rust/Prayer%20times%20API/api-reference) | `Error::NonFiniteResult` |
| [Dart](../../dart/Prayer%20times%20API/api-reference) | throws `PrayerTimesUnavailable`, naming every affected prayer |

Tracked as
[libmuslim#51](https://github.com/muslimtify-org/libmuslim/issues/51).

## Ihtiyat

The Kemenag method adds a 2 minute precautionary margin (`ihtiyat`) to each
time, and subtracts it from sunrise. This is a sourced convention rather than an
error bar, and it is applied on top of everything above. Set `ihtiyat` to 0 in
`MethodParams` if you want the unadjusted astronomical value.

## A calculated time is not an observation

The library computes positions. It does not decide religious validity, model an
official `itsbat` meeting, or weigh sighting testimony. Where a local authority
publishes a schedule, that schedule governs.
