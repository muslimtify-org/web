---
title: Overview
sidebar_position: 1
---

# libmuslim Dart binding

**libmuslim_dart** is the official Dart and Flutter binding for libmuslim. It wraps the C headers in an idiomatic Dart API: times come back as `DateTime` instants, invalid input throws `ArgumentError`, and no `dart:ffi` import or manual memory management is required of the caller.

The C sources are vendored into the package and compiled by a build hook, so there is no system libmuslim to install and nothing to link by hand. Adding the dependency is the whole installation.

## Installing

The package is not yet published on pub.dev. Depend on it by Git:

```yaml title="pubspec.yaml"
dependencies:
  libmuslim_dart:
    git:
      url: https://github.com/muslimtify-org/libmuslim-dart.git
```

```dart
import 'package:libmuslim_dart/prayertimes.dart';
```

The minimum Dart SDK is **3.12**, and a C toolchain must be available at build time because the vendored C sources are compiled as part of your build. Flutter 3.44 stable or newer is recommended for Flutter apps.

## Libraries

| Import | Wraps | Purpose |
| --- | --- | --- |
| `package:libmuslim_dart/prayertimes.dart` | `prayertimes.h` | Pure astronomy. Turns a date, location and explicit UTC offset into prayer times. |
| `package:libmuslim_dart/libmuslim_dart.dart` | everything | Convenience barrel that re-exports every module. |

Importing the specific module is preferred: it keeps the import list honest about what a file actually uses, and it is what will keep working unchanged as more modules land.

:::note
Unlike the Rust binding, libmuslim_dart does **not** currently wrap `timezone.h`. There is no IANA zone lookup and no daylight saving handling, so you supply the UTC offset yourself. See [Time zones](#time-zones) below.
:::

## What the binding adds over the C API

The binding is deliberately thin. It exposes what `prayertimes.h` exposes and nothing more, so there are no calculation features here that the C library does not have. What it adds is enforcement of the contracts the C API documents but cannot check.

**Times are instants, not decimal hours.** The C library returns `double` hours local to the offset you passed. The binding converts each into a UTC `DateTime`, so the values compare, sort and subtract correctly, and no formatting buffer is involved.

**Arguments are validated before they reach C.** A latitude of 95, a non-finite longitude or an implausible offset throws `ArgumentError` at the call. In C the same inputs return `NaN` several steps later.

**A prayer with no solution is an exception, not a `NaN`.** Where the sun never reaches the required depression angle, the binding throws `PrayerTimesUnavailable` naming which prayers failed and the latitude, rather than letting a non-finite value reach your formatting code.

**The null-pointer crash is unreachable.** `calculate_prayer_times()` in C dereferences its `params` pointer unconditionally, so passing null segfaults the process with no Dart stack trace. Callers of this binding never supply a pointer, so the crash cannot be reached.

**The shared method table is never mutated.** `method_params_get()` returns a pointer into C static storage shared by the whole process. When you override a method's Asr school or ihtiyat, the binding copies the entry into a fresh allocation, applies your change there, and frees it, so the table other callers read is left untouched.

## The FFI layer is not public

The generated FFI bindings live under `lib/src/` and are not exported. `calculate_prayer_times`, `MethodParams`, `CalcMethod` and the astronomical constants are unreachable from `package:libmuslim_dart/...`, and the analyzer's `implementation_imports` lint stops another package importing them directly.

This is deliberate. Those names, their struct layouts and their failure modes all come from C and change whenever the vendored header changes, so treating them as public API would make every regeneration a breaking change.

## Time zones

`utcOffset` is a fixed `Duration`. It is not read from the device, which is what makes the result correct for a location the device is not in.

A fixed offset cannot express a zone that observes daylight saving. For `Asia/Jakarta` this never matters, since Indonesia does not observe it. For a zone that does, you must supply the offset applicable to the date you are asking about, which is not necessarily today's.

Resolving an IANA zone name to an offset is the job of `timezone.h`, which this binding does not yet wrap. Until it does, use a Dart package such as [`timezone`](https://pub.dev/packages/timezone) if you need zone names, and pass the offset it gives you.

## Platform support

The package builds and is tested on Linux x86-64. Android, iOS, macOS and Windows are the intended targets and the build hook handles them, but the struct layout is currently verified against the compiled C on x86-64 Linux only.

## License

libmuslim_dart is released under the MIT License, the same as libmuslim itself.

Continue to the [Quick start](./quick-start) for a complete working program, or jump to the [API reference](./api-reference) for every type and member.

## Links

- [Source repository](https://github.com/muslimtify-org/libmuslim-dart)
