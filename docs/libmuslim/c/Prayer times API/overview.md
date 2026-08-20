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

:::caution The implementation file must reach the header once

The include guard suppresses the declarations on a repeat include, but the
implementation block sits outside it, exactly as in `stb` and `miniaudio`. If
the file that defines `PRAYERTIMES_IMPLEMENTATION` also includes another header
that pulls in `prayertimes.h`, the implementation expands twice and you get
`redefinition of 'calculate_prayer_times'`.

The reliable pattern is a dedicated translation unit that includes nothing else:

```c
// prayertimes.c
#define PRAYERTIMES_IMPLEMENTATION
#include "prayertimes.h"
```

Add that one file to your build and never define the macro anywhere else.

:::

The whole public interface is wrapped in `extern "C"`, so the headers can be
included directly from C++ as well as C.

## Adding it to your project

libmuslim is header-only, so there is nothing to build or link (apart from the
system math library). Vendor the headers straight into your source tree:

```bash
# Latest release
curl -LO https://github.com/muslimtify-org/libmuslim/releases/latest/download/prayertimes.h
curl -LO https://github.com/muslimtify-org/libmuslim/releases/latest/download/timezone.h
```

`-L` matters, because `latest` is a redirect.

To pin a specific release instead, name the tag:

```bash
curl -LO https://github.com/muslimtify-org/libmuslim/releases/download/2026.08.20/prayertimes.h
```

Either form is fine, and neither is `main`. `main` moves under you between
releases, and a header that silently changes beneath a vendored copy is the
failure this convention exists to prevent. `latest` moves too, but only when a
release is cut, and only at the moment you download. Once the file is in your
tree it is yours until you replace it.

Prefer `latest` when you are starting out, and a pinned tag when a build has to
be reproducible from the command alone. If you ever need to know which version
a vendored file is, read the banner at the top of it. Every release is on the
[releases page](https://github.com/muslimtify-org/libmuslim/releases).

:::note Tag and header version are different numbers
The tag is a calendar date. Each header carries its own semantic version in its banner, and they move independently, so `2026.08.20` contains `prayertimes.h` `v0.2.1` alongside `hijri.h` and `timezone.h` at `v0.1.0`. That is expected, not a mismatch. Pin the tag to fetch a file, read the header version to reason about compatibility.
:::


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
