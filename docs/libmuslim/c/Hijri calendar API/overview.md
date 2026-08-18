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

## Adding it to your project

Header-only, so there is nothing to build or link beyond the system math
library:

```bash
curl -O https://raw.githubusercontent.com/muslimtify-org/libmuslim/v0.1.0/hijri.h
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
