---
title: Overview
sidebar_position: 1
---

# libmuslim C API

**libmuslim** is the prayer-time engine extracted from Muslimtify into a small,
reusable C library. It calculates the daily prayer times for any date and
location on Earth, using 21 international calculation methods, with no external
dependencies and no network access.

The library ships as two single-file headers:

| Header | Purpose | Dependencies |
| --- | --- | --- |
| `prayertimes.h` | Pure astronomy. Turns a date, latitude, longitude and UTC offset into prayer times. | `<math.h>` only. Fully portable. |
| `timezone.h` | Optional DST-aware helper. Resolves the correct UTC offset for an IANA time zone. | Uses the host OS time zone database (POSIX or Windows). |

`prayertimes.h` is self-contained and portable. `timezone.h` is optional: use it
only if you want the library to work out the UTC offset for you, otherwise you
supply the offset yourself.

## Single-header design

Both files follow the [stb-style](https://github.com/nothings/stb) single-header
convention. The declarations are always visible when you include the header. The
implementation is compiled into your program only when you define a macro in
**exactly one** translation unit (`.c` file):

```c
#define PRAYERTIMES_IMPLEMENTATION
#include "prayertimes.h"
```

Everywhere else, include the header normally without the macro. The same pattern
applies to `timezone.h` with `MUSLIM_TIMEZONE_IMPLEMENTATION`.

The whole public interface is wrapped in `extern "C"`, so the headers can be
included directly from C++ as well as C.

## Adding it to your project

libmuslim is header-only, so there is nothing to build or link (apart from the
system math library). Vendor the headers straight into your source tree:

```bash
# Copy the headers from the repository
curl -O https://raw.githubusercontent.com/muslimtify-org/libmuslim/main/prayertimes.h
curl -O https://raw.githubusercontent.com/muslimtify-org/libmuslim/main/timezone.h
```

Then compile, linking the math library (`-lm`) that `prayertimes.h` needs:

```bash
cc your_app.c -lm -o your_app
```

## License

libmuslim is released under the MIT License, the same as Muslimtify itself. You
are free to use it in open-source and commercial projects. The source lives at
[github.com/muslimtify-org/libmuslim](https://github.com/muslimtify-org/libmuslim).

Continue to the [Quick start](./quick-start) for a complete working example, or
jump to the [API reference](./api-reference) for every type and function.
