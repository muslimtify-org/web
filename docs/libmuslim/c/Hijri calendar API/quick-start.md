---
title: Quick start
sidebar_position: 2
---

# Quick start

## Two files

Create a dedicated translation unit that carries the implementation and includes
nothing else:

```c title="hijri.c"
#define HIJRI_IMPLEMENTATION
#include "hijri.h"
```

Everywhere else, include the header normally.

```c title="main.c"
#include "hijri.h"
#include <stdio.h>

int main(void) {
    const HijriLocation jakarta = { -6.2088, 106.8456, 8.0, "Jakarta" };
    HijriDate date;

    /* 1. Tabular: arithmetic only, no astronomy. Always succeeds. */
    date = hijri_tabular_from_jd(hijri_jd_from_gregorian(2026, 7, 27));
    printf("tabular         %04d-%02d-%02d AH\n", date.year, date.month, date.day);

    /* 2. A named criterion evaluated at one location. */
    if (hijri_from_gregorian_with_local_predicate(
            2026, 7, 27, &jakarta, HIJRI_PREDICATE_MABIMS_2021, &date)) {
        printf("MABIMS 2021     %04d-%02d-%02d AH\n", date.year, date.month, date.day);
    }

    /* 3. The Mecca-based Umm al-Qura policy, from the published table. */
    if (hijri_umm_al_qura_from_gregorian(2026, 7, 27, &date)) {
        printf("Umm al-Qura     %04d-%02d-%02d AH\n", date.year, date.month, date.day);
    }

    return 0;
}
```

Build it:

```bash
cc -std=c11 main.c hijri.c -lm -o demo
```

## Output

```text
tabular         1448-02-11 AH
MABIMS 2021     1448-02-12 AH
Umm al-Qura     1448-02-13 AH
```

## Read that output again

Three answers, three different days, same Gregorian date.

This is not a bug and it is not a precision problem. The tabular calendar is
arithmetic that ignores the sky. MABIMS 2021 asks whether the crescent clears a
threshold as seen from Jakarta. Umm al-Qura reports what Saudi Arabia published,
computed for Mecca.

They are three different questions, so they get three different answers. **There
is no function in this header that returns "the" Hijri date**, because no such
thing exists independently of a criterion and a location. Choose deliberately,
and record which one you chose.

## Getting the raw numbers instead

When you want to show your working, or apply a rule the header does not
implement, compute the evening parameters directly.

```c title="evening.c"
#include "hijri.h"
#include <stdio.h>

int main(void) {
    const HijriLocation jakarta = { -6.2088, 106.8456, 8.0, "Jakarta" };
    HijriEveningParameters p = hijri_compute_evening_parameters(
        2026, 3, 19, &jakarta, &HIJRI_SUNSET_CONVENTION_KEMENAG);

    /* Always check the status. At high latitude the Sun may not set at all. */
    if (p.sunset_status != HIJRI_EVENT_OK) {
        printf("no sunset at this location on this date\n");
        return 1;
    }

    printf("moon centre altitude      %7.3f deg\n", p.moon_center_geometric_altitude_deg);
    printf("topocentric elongation    %7.3f deg\n", p.topocentric_elongation_deg);
    printf("moon age                  %7.3f h\n",   p.moon_age_hours);
    printf("moonset lag               %7.3f min\n", p.lag_time_minutes);
    printf("MABIMS 2021 passes        %s\n",
           hijri_local_predicate_evaluate(HIJRI_PREDICATE_MABIMS_2021, &p) ? "yes" : "no");

    return 0;
}
```

```text
moon centre altitude        1.623 deg
topocentric elongation      5.164 deg
moon age                    9.657 h
moonset lag                10.248 min
MABIMS 2021 passes        no
```

## Why it failed, term by term

A boolean tells you the answer but not how close it was. `hijri_predicate_margins()`
reports each term against its own threshold, in that term's own units:

```c
HijriDecisionMargins m = hijri_predicate_margins(HIJRI_PREDICATE_MABIMS_2021, &p);

for (int i = 0; i < m.count; i++) {
    printf("  term %d  value %7.3f  threshold %6.3f  margin %+7.3f  passes %s\n",
           i, m.terms[i].value, m.terms[i].threshold, m.terms[i].margin,
           m.terms[i].passes ? "yes" : "no");
}
```

```text
  term 0  value   1.623  threshold  3.000  margin  -1.377  passes no
  term 1  value   5.164  threshold  6.400  margin  -1.236  passes no
```

Both terms missed, and neither was marginal. That is a different situation from a
term sitting 0.01 deg below its threshold, where the ephemeris error bar matters
and a human should look.

The function combines nothing and labels nothing as "near". Whether a margin is
small enough to be unsafe is your decision, and it depends on the error bar
documented in the header, which is asymmetric.

## Next

The [API reference](./api-reference) covers every type and function, including
the Yallop and Odeh visibility models, the Sun and Moon position functions, and
the sunset conventions.
