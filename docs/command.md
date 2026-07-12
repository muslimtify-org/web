---
title: Command
sidebar_position: 3
---

# Command reference

Every Muslimtify feature is available from the `muslimtify` command. Run `muslimtify help` (or any command with `--help`) to see the available options.

## Output formats

By default, muslimtify prints a human-readable **table**. Most read-only commands (`show`, `location`, `notification`) also support two machine-friendly formats:

| Flag | Output |
| --- | --- |
| _(none)_ | Tabular, human-readable (default) |
| `--json` | Structured JSON |
| `--headless` | Plain `key=value` pairs |

This flexibility makes it easy to integrate muslimtify into custom Linux widgets, such as [`waybar`](https://github.com/rizukirr/muslimtify/discussions/17) or [`yad`](https://github.com/rizukirr/muslimtify/discussions/10).

Every command accepts `-h` / `--help` for its own usage and examples, e.g. `muslimtify show --help`.

## `muslimtify show`

Print **today's prayer times** using your current configuration. This is the quickest way to verify your setup.

```bash
muslimtify show              # today's prayer times as a table
muslimtify show --json       # same data as JSON
muslimtify show --headless   # same data as key=value
```

## `muslimtify show --next`

Print the **next prayer time** and the remaining time until it starts. For example, if it is currently Dhuhr, it shows Asr and the countdown. After the day's last prayer, it rolls over to tomorrow's Fajr.

```bash
muslimtify show --next             # next prayer as a table
muslimtify show --next --json      # next prayer as JSON
muslimtify show --next --headless  # next prayer as key=value
```

## `muslimtify show --date <start> [end]`

Print the prayer times for a **specific date**, or an **inclusive date range** when a second date is given. Dates use the `yyyy-mm-dd` format.

```bash
muslimtify show --date 2026-07-07                 # a single day
muslimtify show --date 2026-07-01 2026-07-30      # every day from Jul 1 to Jul 30 (inclusive)
muslimtify show --date 2026-07-07 --json          # single day as JSON
```

## `muslimtify location`

Show or update your location. Prayer times depend on your coordinates and timezone.

```bash
muslimtify location                                  # show current location
muslimtify location --json                           # show location as JSON
muslimtify location set --auto                       # detect from your IP
muslimtify location set --auto --city=Mansoura       # auto-detect, custom city label
muslimtify location set --auto --country=EG          # auto-detect, custom country code
muslimtify location set --lat=-6.175 --long=106.82   # set coordinates manually
muslimtify location set --timezone=Asia/Jakarta      # override the timezone
muslimtify location set --city=Jakarta               # set a city label
```

`muslimtify location set` updates only the fields you pass, leaving the rest untouched.

| Flag | Description |
| --- | --- |
| `--auto` | Detect coordinates, timezone, and country from your IP address |
| `--lat=<latitude>` | Set latitude manually (make sure the timezone matches) |
| `--long=<longitude>` | Set longitude manually (make sure the timezone matches) |
| `--timezone=<iana>` | Set the IANA timezone, e.g. `Asia/Jakarta` (make sure the coordinates match) |
| `--city=<name>` | Set a display label for your city |
| `--country=<iso2>` | Set the ISO-2 country code, e.g. `ID` (used by `method --auto`) |

> `--auto` may be combined only with `--city` and/or `--country`. It cannot be mixed with `--lat`, `--long`, or `--timezone`.

## `muslimtify method`

Show or set the calculation method used to derive prayer times.

```bash
muslimtify method            # show the current method
muslimtify method mwl        # set a method by key
muslimtify method --auto     # auto-select the method from your country
muslimtify method --list     # list all available methods
```

### Available methods

| Key | Method | Region |
| --- | --- | --- |
| `mwl` | Muslim World League | Europe, Far East |
| `makkah` | Umm al-Qura, Makkah | Arabian Peninsula |
| `isna` | ISNA | North America |
| `egypt` | Egyptian General Authority | Africa, Middle East |
| `karachi` | Univ. Islamic Sciences, Karachi | Pakistan, India, Bangladesh |
| `turkey` | Diyanet, Turkey | Turkey |
| `singapore` | MUIS, Singapore | Singapore |
| `jakim` | JAKIM, Malaysia | Malaysia |
| `kemenag` | KEMENAG, Indonesia | Indonesia (default) |
| `france` | UOIF, France | France |
| `russia` | Spiritual Admin., Russia | Russia |
| `dubai` | GAIAE, Dubai | UAE |
| `qatar` | Min. of Awqaf, Qatar | Qatar |
| `kuwait` | Min. of Awqaf, Kuwait | Kuwait |
| `jordan` | Min. of Awqaf, Jordan | Jordan |
| `gulf` | Gulf Region | Gulf states |
| `tunisia` | Min. of Religious Affairs, Tunisia | Tunisia |
| `algeria` | Min. of Religious Affairs, Algeria | Algeria |
| `morocco` | Min. of Habous, Morocco | Morocco |
| `portugal` | Comunidade Islamica de Lisboa | Portugal |
| `moonsighting` | Moonsighting Committee | Worldwide |

For a custom method, set `"method": "custom"` in `config.json` with your own `fajr_angle` and `isha_angle` (in degrees).

## `muslimtify madzhab`

Show or set the madzhab, which affects the Asr calculation.

```bash
muslimtify madzhab           # show the current madzhab
muslimtify madzhab shafi     # Shafi'i (default)
muslimtify madzhab hanafi    # Hanafi
muslimtify madzhab --list    # list madzhab options
```

## `muslimtify notification`

Show or configure the notifications and reminders shown around each prayer.

```bash
muslimtify notification              # show current settings
muslimtify notification --json       # show settings as JSON
muslimtify notification --headless   # show settings as key=value
```

Prayer names accepted below are `fajr`, `sunrise`, `dhuha`, `dhuhr`, `asr`, `maghrib`, and `isha` (or `all`).

### Enable / disable a prayer

```bash
muslimtify notification enable fajr     # enable Fajr notifications
muslimtify notification disable sunrise # disable Sunrise notifications
muslimtify notification enable all      # enable every prayer
```

### Reminders

Set one or more reminders that fire a number of minutes **before** the Adhan. Each value is minutes (1–1440).

```bash
muslimtify notification --reminder fajr 30 15 5   # reminders for a single prayer
muslimtify notification --reminder --all 30 15 5  # the same reminders for every prayer
muslimtify notification --reminder fajr none      # clear Fajr's reminders
```

### Urgency

Set the desktop notification urgency level.

```bash
muslimtify notification --urgency normal    # normal | critical | low
```

### Adhan

Play (and configure) the Adhan per prayer.

```bash
muslimtify notification --adhan enable maghrib   # play adhan for Maghrib
muslimtify notification --adhan disable fajr     # stop playing adhan for Fajr
muslimtify notification --adhan set /path/to/adhan.mp3  # set a custom adhan file
```

### Sound mode

Choose what sound the notification itself plays.

```bash
muslimtify notification --sound adhan    # adhan | default | off
```

## `muslimtify offset`

Shift a prayer time by a fixed number of minutes to fine-tune it against your local mosque. The value is a signed integer from `-60` to `60`.

```bash
muslimtify offset fajr +4    # shift Fajr 4 minutes later
muslimtify offset asr -2     # shift Asr 2 minutes earlier
muslimtify offset all 0      # reset the offset for every prayer
```

## `muslimtify daemon`

Manage the background service that watches the clock and fires notifications.

```bash
muslimtify daemon install    # register and start the background service
muslimtify daemon status     # check whether the service is running (also the default)
muslimtify daemon uninstall  # stop and remove the background service
```

On Linux the daemon is registered with systemd. Run `muslimtify daemon status` after installing to confirm it is active.

## Other commands

```bash
muslimtify version   # show version information
muslimtify help      # show the top-level help message
```
