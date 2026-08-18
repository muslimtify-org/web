---
title: API reference
sidebar_position: 3
---

# API reference

Every public type and function in `hijri.h`. All angles are in degrees, all
distances as noted per field, and all instants are Julian Days unless a name says
otherwise.

## Time scales

Julian Day arguments are **UT** unless the parameter name ends in `_tt`. The
distinction is not cosmetic: the two differ by `delta T`, which is about 69
seconds today and grows for dates far from the present.

```c
double hijri_delta_t_seconds(double jd);
double hijri_jd_tt_from_ut(double jd_ut);
```

The position functions take TT, the event finders take UT and convert
internally.

## Calendar arithmetic

```c
double hijri_jd_from_gregorian(int year, int month, double day);
void   hijri_gregorian_from_jd(double jd, int *year, int *month, double *day);
int    hijri_jd_weekday(double jd);   /* 0 = Sunday ... 6 = Saturday */
```

`day` is a `double` so a fraction can carry a time of day. Noon on the 27th is
`27.5`.

## Tabular calendar

```c
typedef struct {
    int year;
    int month;   /* 1 = Muharram ... 12 = Dhu al-Hijjah */
    int day;     /* 1..30 */
} HijriDate;

double    hijri_tabular_to_jd(HijriDate date);
HijriDate hijri_tabular_from_jd(double jd);
int       hijri_tabular_date_valid(HijriDate date);
```

A fixed 30-year leap cycle, sometimes called the Kuwaiti algorithm. No astronomy,
no observer, always succeeds, and reproducible on any machine. It can differ from
an observed calendar by a day or two.

`hijri_tabular_to_jd()` and `hijri_tabular_from_jd()` do not validate their
input. Garbage in, garbage out on an invalid month. Call
`hijri_tabular_date_valid()` first if the date came from a user.

## Location

```c
typedef struct {
    double latitude_deg;
    double longitude_deg;
    double elevation_m;
    const char *name;   /* optional, for logging */
} HijriLocation;
```

Longitude is positive east. `name` is never read by the library.

## Sunset conventions

Sunset is not one definition. These pin refraction at the horizon and the solar
semidiameter, which together set how far below the geometric horizon the Sun's
centre sits at the moment called sunset.

```c
typedef struct {
    double refraction_at_horizon_deg;
    double solar_semidiameter_arcsec_at_1au;
} HijriSunsetConvention;
```

| Constant | Refraction | Semidiameter |
| --- | --- | --- |
| `HIJRI_SUNSET_CONVENTION_MUHAMMADIYAH` | 0.575 | 959.63 |
| `HIJRI_SUNSET_CONVENTION_KEMENAG` | 0.575 | 959.63 |
| `HIJRI_SUNSET_CONVENTION_ASTRONOMICAL` | 0.5667 | 959.63 |

Muhammadiyah and Kemenag are numerically identical today. They are separate
constants because they are separate sources, and either could change without the
other.

Pass the convention that matches the criterion you are evaluating. Mixing a
Kemenag threshold with the astronomical convention gives a number that belongs to
neither.

## Sun and Moon positions

```c
HijriSunPosition  hijri_sun_position(double jd_tt);
HijriMoonPosition hijri_moon_position(double jd_tt);
void hijri_moon_topocentric(const HijriMoonPosition *geo, double jd_ut,
                            double latitude_deg, double longitude_deg,
                            double elevation_m,
                            double *ra_topo_deg, double *dec_topo_deg);
```

:::note The two bodies are in different frames

`hijri_sun_position()` returns **apparent** coordinates, referred to the true
equinox of date, with nutation and aberration applied.
`hijri_moon_position()` returns **geometric** coordinates, mean equinox of date,
with neither.

This is deliberate and documented in the header. Making the frames consistent was
measured and made elongation accuracy slightly worse, because the mismatch
partially cancels the solar truncation error. Read the header's `ACCURACY CAVEAT`
before acting on this.

:::

Measured against JPL DE440 over 24 epochs spanning 1900 to 2100:

```
Moon    longitude 0.0051 deg    latitude 0.0006 deg    distance 41.9 km
Sun     longitude 0.0084042 deg
```

The Sun is the dominant term in the error bar, not the Moon.

## Altitudes and event finders

```c
double hijri_sun_altitude(double jd_ut, const HijriLocation *loc);
double hijri_moon_altitude(double jd_ut, const HijriLocation *loc);

HijriEventStatus hijri_find_sunset(double jd_local_midnight_ut,
                                   const HijriLocation *loc,
                                   const HijriSunsetConvention *conv,
                                   double *result_jd);
HijriEventStatus hijri_find_moonset(double jd_after,
                                    const HijriLocation *loc,
                                    double *result_jd);

HijriEventStatus hijri_find_previous_conjunction(double jd_before, double *result_jd);
HijriEventStatus hijri_find_next_conjunction(double jd_after, double *result_jd);
HijriEventStatus hijri_find_relevant_conjunction(double jd_evening, double *result_jd);
```

There is **no sunrise finder**. Only sunset is solved, because only sunset
matters to a lunar calendar.

```c
typedef enum {
    HIJRI_EVENT_OK = 0,
    HIJRI_EVENT_NEVER_RISES,
    HIJRI_EVENT_NEVER_SETS,
    HIJRI_EVENT_NOT_FOUND
} HijriEventStatus;
```

Always check the status before reading `*result_jd`. On anything other than
`HIJRI_EVENT_OK` the out-parameter is left untouched, so an unchecked read gives
you whatever was already in your variable. The circumpolar statuses come from the
rise and set solvers, `HIJRI_EVENT_NOT_FOUND` from the conjunction finders and
from non-finite input.

## Evening parameters

The layer most applications want. One call computes every quantity the criteria
threshold, for one evening at one location.

```c
HijriEveningParameters hijri_compute_evening_parameters(
    int gy, int gm, int gd,
    const HijriLocation *loc,
    const HijriSunsetConvention *conv);
```

| Field | Meaning |
| --- | --- |
| `jd_sunset_ut` | Sunset instant |
| `jd_moonset_ut` | Moonset instant |
| `jd_relevant_conjunction_ut` | The conjunction this evening is judged against |
| `sunset_status`, `moonset_status` | Check these first |
| `sun_center_geometric_altitude_deg` | Sun centre, geometric |
| `moon_center_geometric_altitude_deg` | Moon centre, geometric |
| `moon_upper_limb_apparent_altitude_deg` | Moon upper limb, apparent |
| `geocentric_elongation_deg` | Sun to Moon separation, geocentric |
| `topocentric_elongation_deg` | Same, corrected for parallax at the observer |
| `moon_age_hours` | Signed hours from conjunction to sunset |
| `lag_time_minutes` | Moonset minus sunset |
| `conjunction_before_sunset` | 0 or 1 |
| `moonset_after_sunset` | 0 or 1 |

The altitude fields differ in ways that matter. A criterion written for the
upper limb cannot be evaluated with the centre altitude and vice versa. The gap
is about 0.83 deg, since it carries the Moon's semidiameter, refraction at the
horizon and parallax together, which is larger than several of the thresholds
below. Measured at Jakarta on one evening, the centre sits at -1.70 deg while
the upper limb sits at -0.87 deg.

Elongation comes in both geocentric and topocentric forms. MABIMS 2021 uses the
topocentric value. Kemenag's own published announcements use the geocentric one,
which the library established by matching a published figure to within 0.43
arcmin.

## Predicates

```c
typedef enum {
    HIJRI_PREDICATE_MABIMS_1992,
    HIJRI_PREDICATE_MABIMS_2021,
    HIJRI_PREDICATE_WUJUDUL_HILAL,
    HIJRI_PREDICATE_LAG_AT_LEAST_5_MINUTES,
    HIJRI_PREDICATE_ALTITUDE_5_ELONGATION_8,
    HIJRI_PREDICATE_CONJUNCTION_AND_MOONSET
} HijriLocalPredicate;

int hijri_local_predicate_evaluate(HijriLocalPredicate predicate,
                                   const HijriEveningParameters *p);
```

Returns 1 if the criterion passes. The published thresholds are exposed as
macros, because they are part of each criterion's definition:

```c
#define HIJRI_MABIMS_1992_ALTITUDE_DEG     2.0
#define HIJRI_MABIMS_1992_ELONGATION_DEG   3.0
#define HIJRI_MABIMS_1992_AGE_HOURS        8.0
#define HIJRI_MABIMS_2021_ALTITUDE_DEG     3.0
#define HIJRI_MABIMS_2021_ELONGATION_DEG   6.4
#define HIJRI_WUJUDUL_HILAL_LIMB_DEG       0.0
#define HIJRI_LAG_THRESHOLD_MINUTES        5.0
#define HIJRI_RESEARCH_ALTITUDE_DEG        5.0
#define HIJRI_RESEARCH_ELONGATION_DEG      8.0
```

## Decision margins

```c
HijriDecisionMargins hijri_predicate_margins(HijriLocalPredicate predicate,
                                             const HijriEveningParameters *p);

typedef struct {
    HijriDecisionTerm term;
    HijriUnit unit;      /* HIJRI_UNIT_DEGREES, _HOURS, _MINUTES */
    double value;
    double threshold;
    double margin;       /* value - threshold */
    int strict;          /* 1 if the criterion uses >, 0 if >= */
    int passes;
} HijriDecisionTermMargin;
```

Reports how far each term sits from its own threshold and nothing else. It
combines nothing, converts nothing between units, and labels nothing as "near".

`strict` is per term rather than global because whether a value exactly on the
threshold passes is a convention each criterion states, not a measurement.
Singapore's MUIS, for instance, words the MABIMS 2021 thresholds as *exceed*,
a strict `>`, while the library evaluates `>=`. That difference only bites at
exact equality, but if you need MUIS wording, this field is how you implement it.

Read a margin against the **right side** of the error bar. The solar residual is
biased rather than symmetric, measured at mean 0.0020391 deg, minimum
-0.0024953 deg and maximum 0.0084042 deg, so a symmetric tolerance is the wrong
comparison.

## Calendar conversion

```c
HijriMonthDecision hijri_evaluate_evening(int gy, int gm, int gd,
                                          const HijriLocation *loc,
                                          HijriLocalPredicate predicate);

int hijri_from_gregorian_with_local_predicate(int gy, int gm, int gd,
                                              const HijriLocation *loc,
                                              HijriLocalPredicate predicate,
                                              HijriDate *out);
```

The conversion requires an observer location. That is a deliberate API decision,
not an inconvenience: a predicate-derived Hijri date does not exist without one.

Returns 0 on failure, leaving `*out` untouched.

## Umm al-Qura

```c
int hijri_umm_al_qura_from_gregorian(int gy, int gm, int gd, HijriDate *out);
int hijri_umm_al_qura_covers(int gy, int gm, int gd);
```

Backed by the published Umm al-Qura table rather than recomputed. This is
deliberate. Astronomical reconstruction reached 183 of 198 month starts, and
198 of 198 was proven unreachable from the published rule, because for seven
months in the window the official table departs from its own stated criterion.

Call `hijri_umm_al_qura_covers()` first. Outside the table's range the conversion
fails rather than extrapolating.

## Visibility models

Unlike the predicates, these grade visibility into zones rather than returning a
yes or no.

```c
double hijri_yallop_q(double arcv_deg, double crescent_width_arcmin);
HijriYallopZone hijri_yallop_classify(double arcv_deg, double crescent_width_arcmin);

double hijri_odeh_v(double arcv_deg, double crescent_width_arcmin);
HijriOdehZone hijri_odeh_classify(double arcv_deg, double crescent_width_arcmin);
```

```c
typedef enum {
    HIJRI_YALLOP_A_EASILY_VISIBLE,
    HIJRI_YALLOP_B_VISIBLE_PERFECT_CONDITIONS,
    HIJRI_YALLOP_C_MAY_NEED_OPTICAL_AID,
    HIJRI_YALLOP_D_NEEDS_OPTICAL_AID,
    HIJRI_YALLOP_E_NOT_VISIBLE_TELESCOPE,
    HIJRI_YALLOP_F_NOT_VISIBLE_BELOW_LIMIT
} HijriYallopZone;

typedef enum {
    HIJRI_ODEH_NOT_VISIBLE = 0,
    HIJRI_ODEH_VISIBLE_WITH_OPTICAL_AID_ONLY,
    HIJRI_ODEH_VISIBLE_WITH_OPTICAL_AID_COULD_BE_NAKED_EYE,
    HIJRI_ODEH_VISIBLE_NAKED_EYE
} HijriOdehZone;
```

The result structs carry the intermediate quantities alongside the zone, so you
can show the working:

```c
typedef struct {
    double jd_best_time_ut;
    double arcv_deg;
    double crescent_width_arcmin;
    double q;                 /* v, for the Odeh struct */
    HijriYallopZone zone;
} HijriYallopResult;
```

**Yallop is validated against observations.** All 271 evening observations in
Technical Note 69 Table 4 are checked, with a maximum q residual of 0.053577.

**Odeh is not.** Its coefficients and thresholds are verified verbatim against
the primary source and its topocentric frame confirmed by a published anchor, but
no observation-level validation exists, because the paper's Table VI is
image-only. Tracked as
[libmuslim#47](https://github.com/muslimtify-org/libmuslim/issues/47).

A zone is not a date. Turning a graded zone into a calendar decision needs an
application policy that this header deliberately does not supply.

## What this header will not do

- It does not aggregate a decision across a territory
- It does not model an official `itsbat` meeting or sighting testimony
- It does not decide religious validity
- It has no general policy abstraction, by design, until at least two complete
  policies with genuinely different decision flows exist

See the [ROADMAP](https://github.com/muslimtify-org/libmuslim/blob/main/ROADMAP.md)
for what is planned and what is deliberately not.
