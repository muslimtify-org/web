---
title: Quick start
sidebar_position: 2
---

# Quick start

This example calculates the prayer times for Jakarta on 12 July 2026 using the
KEMENAG (Indonesia) method and prints each time as `HH:MM`.

## The program

```c title="example.c"
#define PRAYERTIMES_IMPLEMENTATION
#include "prayertimes.h"
#include <stdio.h>

int main(void) {
    // 1. Pick a calculation method from the built-in catalogue.
    const MethodParams *params = method_params_get(CALC_KEMENAG);

    // 2. Compute the times for a date, location and UTC offset.
    struct PrayerTimes t = calculate_prayer_times(
        2026, 7, 12,        // year, month, day
        -6.2088, 106.8456,  // latitude, longitude (Jakarta)
        7.0,                // UTC+7 (numeric offset in hours)
        params);

    // 3. Format the results. Times come back as decimal hours.
    char buf[16];
    format_time_hm(t.fajr, buf, sizeof buf);    printf("Fajr     %s\n", buf);
    format_time_hm(t.sunrise, buf, sizeof buf); printf("Sunrise  %s\n", buf);
    format_time_hm(t.dhuha, buf, sizeof buf);   printf("Dhuha    %s\n", buf);
    format_time_hm(t.dhuhr, buf, sizeof buf);   printf("Dhuhr    %s\n", buf);
    format_time_hm(t.asr, buf, sizeof buf);     printf("Asr      %s\n", buf);
    format_time_hm(t.maghrib, buf, sizeof buf); printf("Maghrib  %s\n", buf);
    format_time_hm(t.isha, buf, sizeof buf);    printf("Isha     %s\n", buf);
    return 0;
}
```

## Build and run

```bash
cc example.c -lm -o example
./example
```

```text title="Output"
Fajr     04:41
Sunrise  06:01
Dhuha    06:29
Dhuhr    11:56
Asr      15:20
Maghrib  17:47
Isha     18:59
```

:::note
Exact times depend on the calculation method and your inputs. The values above
are illustrative.
:::

## Letting the library resolve the time zone

In the example above the UTC offset (`7.0`) is hard-coded. If you would rather
have the offset resolved from an IANA time zone, with daylight saving handled
automatically, include the optional `timezone.h` helper.

:::caution
`timezone.h` must be included **before** any system `<time.h>` in that
translation unit, because it sets a feature-test macro that glibc needs for the
UTC-offset field.
:::

```c title="example_tz.c"
#define PRAYERTIMES_IMPLEMENTATION
#include "prayertimes.h"

#define MUSLIM_TIMEZONE_IMPLEMENTATION
#include "timezone.h"   // must come before <time.h>

#include <time.h>
#include <stdio.h>

int main(void) {
    time_t when = time(NULL);
    double offset = parse_timezone_offset("Asia/Jakarta", when); // -> 7.0

    const MethodParams *params = method_params_get(CALC_KEMENAG);
    struct PrayerTimes t = calculate_prayer_times(
        2026, 7, 12, -6.2088, 106.8456, offset, params);

    char buf[16];
    format_time_hm(t.dhuhr, buf, sizeof buf);
    printf("Dhuhr %s\n", buf);
    return 0;
}
```

See the [API reference](./api-reference) for the full list of types and
functions.
