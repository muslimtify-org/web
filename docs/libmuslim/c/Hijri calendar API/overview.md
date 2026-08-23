---
title: Overview
sidebar_position: 1
---

# Hijri calendar API

`hijri.h` converts between Gregorian and Hijri dates. It is a single-file C
header with no dependency beyond `<math.h>`, and it is independent of
`prayertimes.h`. Neither header includes the other.

The Hijri calendar is lunar, so a month begins when the new crescent is
first seen. What counts as "seen" is not one rule but several, and different
authorities answer it differently. This header does not hide that. It gives you
the astronomy, the individual criteria, and the raw quantities each criterion
thresholds, and it leaves the choice of criterion to you.

## Three layers

Pick the lowest layer that answers your question.

| Layer | Use when | Entry point |
| --- | --- | --- |
| **Tabular** | You want a fast, deterministic, offline date and do not need astronomical accuracy | `hijri_tabular_from_jd()` |
| **Local predicates** | You want a date from a named criterion evaluated at one observer location | `hijri_from_gregorian_with_local_predicate()` |
| **Evening parameters** | You want the raw numbers and will apply your own rule | `hijri_compute_evening_parameters()` |

The tabular layer is arithmetic. It applies a fixed 30-year leap cycle and never
computes a Moon position, so it is fast and reproducible but can differ from an
observed calendar by a day or two.

The other two layers compute real Sun and Moon positions.

## A local predicate is not a national calendar

This is the most important thing on this page.

`hijri_from_gregorian_with_local_predicate()` evaluates one criterion at one
latitude and longitude. It does not aggregate a decision across a country, it
does not model an official `itsbat` meeting, and it does not weigh sighting
testimony. Real authorities do all three.

For Indonesia, the library reproduces the Kemenag calendar on 33 of 37 month
starts and never starts a month early. The gap is not an ephemeris error, it is
the difference between a calculation and a decision made by people.

Use these predicates to compute, to check, and to explain. Do not present the
result as an authority's declaration.

## Criteria included

| Predicate | Rule |
| --- | --- |
| `HIJRI_PREDICATE_MABIMS_1992` | Altitude 2 deg, elongation 3 deg, Moon age 8 hours |
| `HIJRI_PREDICATE_MABIMS_2021` | Altitude 3 deg, topocentric elongation 6.4 deg |
| `HIJRI_PREDICATE_WUJUDUL_HILAL` | Conjunction before sunset and the upper limb above the horizon |
| `HIJRI_PREDICATE_LAG_AT_LEAST_5_MINUTES` | Moonset at least 5 minutes after sunset |
| `HIJRI_PREDICATE_ALTITUDE_5_ELONGATION_8` | Altitude 5 deg, elongation 8 deg |
| `HIJRI_PREDICATE_CONJUNCTION_AND_MOONSET` | Conjunction before sunset and moonset after sunset |

MABIMS is the shared criterion of Brunei, Indonesia, Malaysia and Singapore.
Wujudul Hilal is the Muhammadiyah rule, and it applies through the end of
1446 AH only. Muhammadiyah moved to KHGT from 1447 AH, which is a different
criterion and is not implemented here.

The last three are neutrally named on purpose. They claim no authority and are
there for research and comparison.

There is also `hijri_umm_al_qura_from_gregorian()`, a dedicated Mecca-based
policy backed by the published Umm al-Qura table, and standalone
implementations of the **Yallop** and **Odeh** visibility models, which grade
visibility into zones rather than returning a yes or no.

## Supported range

Four things bound this header, and they bind in different places. Since `v0.1.1` the range is a measured contract rather than a description of whatever the tests happened to cover.

| Bound | Range | What sits outside it |
| --- | --- | --- |
| **Validated** | 1900 to 2100 | Nothing is checked against an independent ephemeris, so the error bar below stops being measured |
| **Umm al-Qura table** | 1882-11-12 to 2174-11-25 | `hijri_umm_al_qura_from_gregorian()` falls back to reconstruction. `hijri_umm_al_qura_covers()` tells the two apart |
| **Delta T model** | adequate 1600 to 2200 | Worst case 0.005 deg of lunar longitude, below the 0.0051 deg the lunar series itself carries, so this is never the binding constraint |

Use the header freely from 1600 to 2200. Treat 1882 to 2174 as the range where Umm al-Qura is a published table rather than a reconstruction.

### The real limit is the margin, not the date

Every criterion here thresholds a continuous quantity, so an evening whose value sits inside the error bar of its threshold has an answer the library cannot stand behind. Counting evenings at Mecca under MABIMS 2021 where a term sits within 0.0070 deg of its threshold, which is the worst topocentric elongation error measured against JPL DE440, the answer is between 4 and 10 per century, and it is flat: the 1600s and the 2300s both show 4.

There is no sign of the calculation degrading with distance from J2000. What degrades outside 1900 to 2100 is confidence in the error bar itself, because it stops being measured. Expect a handful of evenings per century where the verdict is a coin toss the arithmetic cannot settle, at any epoch including the present one.

### Latitude: nothing breaks, things stop existing

Ten years of evenings, 2020 to 2029, longitude 0, MABIMS 2021, counting what a caller actually gets back:

| Latitude | Verdict | No sunset | No moonset |
| --- | --- | --- | --- |
| 0 | 96.58% | 0.00% | 3.42% |
| 40 | 96.69% | 0.00% | 3.31% |
| 60 | 96.82% | 0.00% | 3.18% |
| 63 | 88.20% | 0.00% | 11.80% |
| 66 | 67.12% | 4.76% | 28.11% |
| 70 | 34.08% | 33.97% | 31.95% |
| 80 | 6.71% | 71.20% | 22.09% |
| 89 | 0.05% | 97.24% | 2.71% |

Flat to 60, then the verdict rate collapses. Nothing is wrong in that collapse. Above the polar circles the Sun genuinely does not set for part of the year, and a criterion thresholding the Moon's altitude at sunset has nothing to threshold. The statuses say so.

The accuracy margin does not vary with latitude at all: between 0 and 2 evenings per 3653 sit inside the error bar, at every latitude from 0 to 89, with no trend. The geographic limit is availability, not accuracy.

:::note The 3.4% at the equator is not a latitude effect

It is the Moon's own period. `hijri_find_moonset()` scans 24 hours from sunset and the Moon sets once per 24h 50m, so roughly one evening in thirty holds no moonset anywhere on Earth, Jakarta and Mecca included. That comes back as `HIJRI_EVENT_NOT_FOUND`, which is a normal result rather than a reserved one.
:::

So: use the header freely to latitude 60, where better than 96 percent of evenings yield a verdict and the rest are the Moon's period rather than anything geographic. Between 60 and the polar circles expect a growing share of evenings with no answer. Above them expect most evenings to have none, check the status before the value, and decide at the application level what a calendar does when its criterion cannot be evaluated. That last question is open, and it is the same one [libmuslim#51](https://github.com/muslimtify-org/libmuslim/issues/51) asks for prayer times.

### Longitude and elevation

Longitude is safe, and it is worth knowing why it is only almost safe. This header carries no time zone database and derives local midnight from longitude as mean solar time, so "the evening of date D" is the solar-day evening rather than the civil-day one. Measured over every evening of 2025 at the five zones furthest from their solar meridian, Kashgar, Adak, Vigo, Urumqi and Anchorage, with gaps up to 2.93 hours, zero evenings land on another civil day. Sunset sits far enough from midnight that a three hour offset never crosses a date boundary. If you need civil-day semantics, resolve the offset yourself and use the JD-based entry points.

`loc->elevation_m` is carried but very nearly inert. It does not lower the sunset target and does not correct parallax. Both omissions are deliberate and both were measured: each correction made agreement with published calendars worse.

## Adding it to your project

Header-only, so there is nothing to build or link beyond the system math
library:

```bash
curl -LO https://github.com/muslimtify-org/libmuslim/releases/latest/download/hijri.h
```

Pin the tag rather than `main`. `main` moves, and a header that silently changes
under a vendored copy is the failure this convention exists to avoid.

Define the implementation macro in **exactly one** translation unit:

```c
#define HIJRI_IMPLEMENTATION
#include "hijri.h"
```

:::caution That file must reach the header once

The include guard suppresses the declarations on a repeat include, but the
implementation block sits outside it. If the file defining `HIJRI_IMPLEMENTATION`
also includes another header that pulls in `hijri.h`, the implementation expands
twice and you get `redefinition of 'hijri__norm_deg'`.

The reliable pattern is a dedicated translation unit that includes nothing else:

```c
// hijri.c
#define HIJRI_IMPLEMENTATION
#include "hijri.h"
```

:::

Then compile, linking the math library:

```bash
cc your_app.c hijri.c -lm -o your_app
```

The whole public interface is wrapped in `extern "C"`, so the header works from
C++ as well as C.

## License

MIT, the same as the rest of libmuslim. Free for open-source and commercial use.
The source lives at
[github.com/muslimtify-org/libmuslim](https://github.com/muslimtify-org/libmuslim).

Continue to the [Quick start](./quick-start), or jump to the
[API reference](./api-reference).
