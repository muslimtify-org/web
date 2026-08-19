---
title: Quick start
sidebar_position: 2
---

# Quick start

This example calculates the prayer times for Jakarta on 12 July 2026 using the KEMENAG (Indonesia) method and prints each time as `HH:MM`.

## Add the dependency

```yaml title="pubspec.yaml"
dependencies:
  libmuslim_dart:
    git:
      url: https://github.com/muslimtify-org/libmuslim-dart.git
```

```bash
dart pub get
```

A C toolchain must be available at build time, because the package compiles the vendored libmuslim sources itself. Nothing else is installed and nothing is linked by hand.

## The program

```dart title="bin/main.dart"
import 'package:libmuslim_dart/prayertimes.dart';

/// Jakarta's offset. Every time comes back in UTC, so rendering it for a
/// reader means adding the offset of the place it describes, not the
/// device's, which is unrelated.
const jakarta = Duration(hours: 7);

String hm(DateTime time) {
  final local = time.add(jakarta);
  return '${local.hour.toString().padLeft(2, '0')}:'
      '${local.minute.toString().padLeft(2, '0')}';
}

void main() {
  final times = PrayerTimes.forDate(
    DateTime.utc(2026, 7, 12),
    latitude: -6.2088,
    longitude: 106.8456,
    utcOffset: jakarta,
    parameters: const CalculationParameters.of(CalculationMethod.kemenag),
  );

  print('Fajr     ${hm(times.fajr)}');
  print('Dhuhr    ${hm(times.dhuhr)}');
  print('Asr      ${hm(times.asr)}');
  print('Maghrib  ${hm(times.maghrib)}');
  print('Isha     ${hm(times.isha)}');
}
```

## Run it

```bash
dart run
```

```text title="Output"
Fajr     04:44
Dhuhr    12:01
Asr      15:23
Maghrib  17:54
Isha     19:08
```

:::note
Times depend on the calculation method, the location and the offset. Change any of them and the output changes.
:::

## Today's times

`PrayerTimes.today` derives the civil date from the offset you pass rather than from the device clock's zone, so a caller in London asking about Jakarta gets Jakarta's today rather than London's.

```dart
final times = PrayerTimes.today(
  latitude: -6.2088,
  longitude: 106.8456,
  utcOffset: const Duration(hours: 7),
  parameters: const CalculationParameters.of(CalculationMethod.kemenag),
);
```

`parameters` is optional and defaults to the Muslim World League method, so the three location arguments are enough on their own.

## What is next, and when

`Prayer` is exactly the five prescribed prayers, so `current` and `next` no longer skip anything. Both are null outside the day's range: `current` before Fajr, `next` after Isha.

```dart
final upcoming = times.next();          // Prayer.asr, say
final wait = times.timeUntilNext();     // Duration, or null after Isha

if (upcoming != null && wait != null) {
  print('$upcoming in ${wait.inMinutes} minutes');
}
```

Pass an instant to ask about a moment other than now. Any zone works, since the comparison is between instants:

```dart
final at = DateTime.utc(2026, 7, 12, 6, 0);   // 13:00 in Jakarta
print(times.current(at));                      // Prayer.dhuhr
print(times.next(at));                         // Prayer.asr
print(times.timeUntilNext(at));                // 2:23:00.000000
```

## Adjusting a method

`CalculationParameters.of` takes the two adjustments practitioners actually vary, the Asr school and the precautionary ihtiyat minutes:

```dart
const hanafi = CalculationParameters.of(
  CalculationMethod.kemenag,
  asrSchool: AsrSchool.hanafi,
  ihtiyat: 3,
);
```

For a method that is not in the table at all, build one from scratch. Exactly one of `ishaAngle` and `ishaInterval` must be given:

```dart
final custom = CalculationParameters.custom(
  fajrAngle: 18,
  ishaInterval: 90,   // Isha 90 minutes after Maghrib
);
```

## Handling errors

Bad arguments throw `ArgumentError` at the call, before any calculation runs:

```dart
try {
  PrayerTimes.today(
    latitude: 95,                                  // out of range
    longitude: 106.8456,
    utcOffset: const Duration(hours: 7),
  );
} on ArgumentError catch (e) {
  print(e);
  // Invalid argument (latitude): must be a finite value between -90 and 90 degrees: 95.0
}
```

A location where a prayer has no solution throws `PrayerTimesUnavailable`, which names the prayers that failed rather than handing you a `NaN`:

```dart
try {
  final times = PrayerTimes.forDate(
    DateTime.utc(2026, 6, 21),
    latitude: 69.6496,        // Tromsø, midsummer
    longitude: 18.9560,
    utcOffset: const Duration(hours: 2),
    parameters: const CalculationParameters.of(CalculationMethod.kemenag),
  );
  print(times.fajr);
} on PrayerTimesUnavailable catch (e) {
  print(e.prayers);
  // [Prayer.fajr, Prayer.maghrib, Prayer.isha]
  print(e);
  // PrayerTimesUnavailable: no fajr, maghrib, isha on 2026-06-21
  // at latitude 69.6496, longitude 18.956
}
```

Whether this throws at all depends on the calculation method, which changed in `prayertimes.h` `v0.2.0`. The high-latitude rule is now a property of the method rather than a global fallback. MWL and Moonsighting carry a reference latitude for the polar case, so under the default MWL parameters this same call **succeeds** and returns a Fajr of `00:27`. Kemenag publishes no such rule and so carries no reference latitude, which is why the example names it explicitly.

Above the Arctic Circle the sun does not set in midsummer, so under Kemenag, Fajr, Maghrib and Isha have no solution on that date. The same location and method on 21 December loses only Maghrib, because the sun does not rise. Which prayers are affected depends on the date and the method, so read `prayers` rather than assuming.

Catch `ArgumentError` and `PrayerTimesUnavailable` separately, because the first means your input was wrong, the second means the input was fine and the sky did not cooperate.

See the [API reference](./api-reference) for the full list of types and members.
