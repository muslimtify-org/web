---
title: Calculation methods
sidebar_position: 4
---

# Calculation methods

Muslimtify derives prayer times from your coordinates, date, and timezone using
established astronomical algorithms, entirely on your machine. A **calculation
method** is the set of parameters a religious authority uses to define the edges of
each prayer window, mainly the twilight angles for Fajr and Isha.

Set your method with [`muslimtify method`](./command.md#muslimtify-method), the
default is `kemenag`.

## How a method is defined

Each built-in method sets a handful of parameters:

- **Fajr / Isha angle**: how far the sun sits below the horizon (in degrees) at the
  start of Fajr and the start of Isha. A larger angle means an earlier Fajr and a
  later Isha.
- **Isha interval**: some authorities (Umm al-Qura, Qatar, Gulf, Portugal) define
  Isha as a fixed number of minutes after Maghrib instead of an angle.
- **Maghrib offset**: a small number of minutes added after sunset. Only Portugal
  and the Moonsighting Committee use one (3 minutes).
- **Ihtiyat**: a precautionary margin added to every prayer time. Only Kemenag
  (+2 min) and Jordan (+5 min) apply one, every other method uses 0. Sunrise gets
  the same margin subtracted rather than added.

The Asr time is **not** part of the method. It is controlled separately by your
madzhab and applies identically across every method, see
[Asr and madzhab](#asr-and-madzhab).

## Method parameters

All angles are in degrees. "Isha interval" is minutes after Maghrib, used when the
method is not angle-based. "Ihtiyat" is the precautionary margin added to each
prayer (and subtracted from sunrise).

| Key | Organization | Fajr | Isha angle | Isha interval | Maghrib offset | Ihtiyat |
| --- | --- | --- | --- | --- | --- | --- |
| `mwl` | Muslim World League | 18.0 | 17.0 | — | 0 | 0 |
| `makkah` | Umm al-Qura, Makkah | 18.5 | — | 90 min | 0 | 0 |
| `isna` | ISNA (North America) | 15.0 | 15.0 | — | 0 | 0 |
| `egypt` | Egyptian General Authority | 19.5 | 17.5 | — | 0 | 0 |
| `karachi` | Univ. of Islamic Sciences, Karachi | 18.0 | 18.0 | — | 0 | 0 |
| `turkey` | Diyanet, Turkey | 18.0 | 17.0 | — | 0 | 0 |
| `singapore` | MUIS, Singapore | 20.0 | 18.0 | — | 0 | 0 |
| `jakim` | JAKIM, Malaysia | 20.0 | 18.0 | — | 0 | 0 |
| `kemenag` | Kemenag, Indonesia (default) | 20.0 | 18.0 | — | 0 | +2 (−2 sunrise) |
| `france` | UOIF, France | 12.0 | 12.0 | — | 0 | 0 |
| `russia` | Spiritual Administration, Russia | 16.0 | 15.0 | — | 0 | 0 |
| `dubai` | GAIAE, Dubai | 18.2 | 18.2 | — | 0 | 0 |
| `qatar` | Ministry of Awqaf, Qatar | 18.0 | — | 90 min | 0 | 0 |
| `kuwait` | Ministry of Awqaf, Kuwait | 18.0 | 17.5 | — | 0 | 0 |
| `jordan` | Ministry of Awqaf, Jordan | 18.0 | 18.0 | — | 0 | +5 (−5 sunrise) |
| `gulf` | Gulf Region (general) | 19.5 | — | 90 min | 0 | 0 |
| `tunisia` | Ministry of Religious Affairs | 18.0 | 18.0 | — | 0 | 0 |
| `algeria` | Ministry of Religious Affairs | 18.0 | 17.0 | — | 0 | 0 |
| `morocco` | Ministry of Habous, Morocco | 19.0 | 17.0 | — | 0 | 0 |
| `portugal` | Comunidade Islamica de Lisboa | 18.0 | — | 77 min | 3 min | 0 |
| `moonsighting` | Moonsighting Committee | 18.0 | 18.0 | — | 3 min | 0 |

All computed times are rounded **up** to the next whole minute (the Kemenag
convention), for every method.

## Simplifications to be aware of

Muslimtify implements each method from its core angle/interval parameters. A few
authorities apply extra, calendar- or location-specific adjustments in their
official schedules that Muslimtify intentionally does **not** replicate:

- **Umm al-Qura (`makkah`)**: Isha is a fixed **90 minutes** after Maghrib all year.
  The official Saudi calendar switches to 120 minutes during Ramadan and advances the
  printed times by ~3 minutes, Muslimtify does neither.
- **Diyanet (`turkey`)**: the official Turkish times apply a *temkin* correction
  (about 10 minutes for Istanbul). Muslimtify does not apply temkin, so its times may
  differ from official Diyanet schedules by that amount.
- **Dubai (`dubai`)**: Muslimtify uses the plain 18.2°/18.2° angles. The small
  per-prayer rounding offsets seen in some official UAE tables are not applied.
- **Moonsighting (`moonsighting`)**: Muslimtify treats this as a fixed 18° baseline
  angle plus a 3-minute Maghrib offset. The committee's real method uses seasonal,
  latitude-dependent curve-fit functions and multiple *shafaq* modes, those are not
  implemented.
- **Morocco (`morocco`)**: official times are adjusted manually per city by the
  Ministry of Habous. Muslimtify approximates with the 19.0°/17.0° angles only.

Where these differences matter for your local mosque, use the per-prayer
[offset](./configuration.md#prayers-and-offsets) to line the times up exactly.

## Notable per-method details (as implemented)

- **Kemenag (`kemenag`, default)**: applies an *ihtiyat* precaution of +2 minutes to
  every prayer (and −2 minutes to sunrise). See
  [Kemenag, the default](#kemenag-the-default).
- **Jordan (`jordan`)**: applies a +5 minute *ihtiyat* to every prayer (and −5
  minutes to sunrise). This is a whole-schedule margin, not a Maghrib-only offset.
- **Portugal (`portugal`)**: Isha is a fixed 77-minute interval after Maghrib, and
  Maghrib itself is set 3 minutes after sunset.
- **Moonsighting (`moonsighting`)**: Maghrib is set 3 minutes after sunset, Fajr and
  Isha use the 18° angle.

## Dhuha

Muslimtify also computes a **Dhuha** time (sun altitude 4.3°, about 4°18′, above
the eastern horizon) for every method, though it is disabled by default. Enable it with
`muslimtify notification enable dhuha`.

## Asr and madzhab

The madzhab you choose affects only the **Asr** calculation, through the shadow
factor `n`. It is applied the same way regardless of which calculation method is
active.

| Madzhab | Shadow factor | Rule |
| --- | --- | --- |
| Standard (Shafi'i, Maliki, Hanbali) | 1 | Shadow = object height + noon shadow |
| Hanafi | 2 | Shadow = 2× object height + noon shadow |

Set it with [`muslimtify madzhab shafi`](./command.md#muslimtify-madzhab) or
`hanafi`. The default is `shafi` (Standard).

## Kemenag, the default

Kemenag (the Indonesian Ministry of Religious Affairs) is the default because
Muslimtify originated in Indonesia and Kemenag is a well-validated, widely-used
standard there. Its parameters:

- Fajr angle **20°**, Isha angle **18°** (shared with JAKIM and MUIS).
- **Ihtiyat**: +2 minutes on all prayer times, −2 minutes on sunrise.
- **Rounding**: always rounds up (ceiling) to the next minute.

Academic comparisons of calculation against observation in Indonesia find
differences of only 0–3 minutes, which is considered within acceptable limits.

## Accuracy and tolerance

No major authority publishes a formal, quantified accuracy standard. In practice:

- The general jurisprudential consensus is that **±5 minutes** from the "true" time
  is acceptable.
- A few methods carry a small precautionary *ihtiyat* buffer (Kemenag ±2, Jordan ±5),
  most apply none.
- Muslimtify's underlying astronomical model is accurate to roughly **4 seconds of
  time**, so the choice of method (its Fajr/Isha angles) has far more effect on the
  result than the algorithm itself.

If your calculated times differ slightly from a local mosque's printed schedule,
that is expected: mosques often apply their own offsets. You can match them with the
per-prayer **offset** in [Configuration](./configuration.md#prayers-and-offsets).

## High latitudes

At high latitudes (roughly above 48–50° N/S) the sun may never reach the required
depression angle in summer, so the standard Fajr/Isha formula has no solution. When
that happens, Muslimtify falls back to the **angle-based** approximation: it treats
the twilight angle as a fraction of the night and places Fajr and Isha that fraction
before sunrise / after sunset. If you live at a high latitude and see unusual Fajr or
Isha times around the solstices, this is why.

## Custom method

If none of the built-in methods fits, set a custom one directly in `config.json`:

```json
"calculation": {
  "method": "custom",
  "madhab": "shafi"
}
```

Then provide your own `fajr_angle` and `isha_angle` values (in degrees). See
[Configuration](./configuration.md#calculation-method-and-madzhab).
