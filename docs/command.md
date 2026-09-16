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

This flexibility makes it easy to integrate muslimtify into custom Linux widgets, such as [`waybar`](/blog/integrate-muslimtify-with-waybar) or [`yad`](https://github.com/rizukirr/muslimtify/discussions/10).

Every prayer output carries the date it describes, in all three formats: a `Date` column in the tables, a `date=` line in `--headless`, and a `"date"` field in `--json`. The shapes are shown under each command below.

Clock times follow the saved [time format](#muslimtify-timeformat), `HH:MM` by default or `hh:MM AM` / `hh:MM PM` in 12-hour mode. That applies to `--json` and `--headless` too, so a script that parses the time should allow for both.

Every command accepts `-h` / `--help` for its own usage and examples, e.g. `muslimtify show --help`.

## `muslimtify show`

Print **today's prayer times** using your current configuration. This is the quickest way to verify your setup.

```bash
muslimtify show              # today's prayer times as a table
muslimtify show --json       # same data as JSON
muslimtify show --headless   # same data as key=value
```

The table lists every prayer with its date, time, whether notifications are enabled, and its reminders:

```
+------------+------------+----------+----------+-----------------------+
| Date       | Prayer     | Time     | Status   | Reminders             |
+------------+------------+----------+----------+-----------------------+
| 2026-09-16 | Fajr       | 04:31    | Enabled  | 30, 15, 5 min before  |
| 2026-09-16 | Dhuhr      | 11:50    | Enabled  | 30, 15, 5 min before  |
| 2026-09-16 | Asr        | 15:04    | Enabled  | 30, 15, 5 min before  |
| 2026-09-16 | Maghrib    | 17:52    | Enabled  | 30, 15, 5 min before  |
| 2026-09-16 | Isha       | 19:01    | Enabled  | 30, 15, 5 min before  |
+------------+------------+----------+----------+-----------------------+
```

`--headless` prints a `date=` line, then one `<prayer>=<time>` line for each **enabled** prayer. Disabled prayers are left out.

```
date=2026-09-16
fajr=04:31
dhuhr=11:50
asr=15:04
maghrib=17:52
isha=19:01
```

`--json` prints a single object with the date and **every** prayer, including disabled ones:

```json
{
  "date": "2026-09-16",
  "prayers": {
    "fajr": {
      "time": "04:31",
      "offset": 0,
      "enabled": true,
      "reminders": [30, 15, 5]
    },
    "dhuhr": {
      "time": "11:50",
      "offset": 0,
      "enabled": true,
      "reminders": [30, 15, 5]
    },
    "asr": {
      "time": "15:04",
      "offset": 0,
      "enabled": true,
      "reminders": [30, 15, 5]
    },
    "maghrib": {
      "time": "17:52",
      "offset": 0,
      "enabled": true,
      "reminders": [30, 15, 5]
    },
    "isha": {
      "time": "19:01",
      "offset": 0,
      "enabled": true,
      "reminders": [30, 15, 5]
    }
  }
}
```

### When a prayer falls on another day

At high latitudes a prayer can fall past midnight, so Isha calculated for 30 April actually happens early on 1 May. Muslimtify reports the day the prayer really falls on rather than silently printing a time that looks earlier than Maghrib:

| Format | How the day shift is shown |
| --- | --- |
| Table | The `Date` column carries the real date, e.g. `2026-05-01` on the Isha row |
| `--headless` | An extra `<prayer>_offset=<days>` line after the prayer, only when it is not `0`, e.g. `isha_offset=1` |
| `--json` | The `offset` field, always present: `1` for the next day, `-1` for the previous day, `0` otherwise |

> The `offset` in this output is a **day** shift. It is unrelated to the per-prayer minute adjustment set with [`muslimtify offset`](#muslimtify-offset), which is stored as `offset` in `config.json`.

```
date=2026-04-30
fajr=02:41
dhuhr=13:27
asr=17:40
maghrib=21:51
isha=00:01
isha_offset=1
```

A prayer the sun never produces on that day, such as Isha during a polar summer, prints as `--:--`.

## `muslimtify show --next`

Print the **next prayer time** and the remaining time until it starts. For example, if it is currently Dhuhr, it shows Asr and the countdown. After the day's last prayer, it rolls over to tomorrow's Fajr.

```bash
muslimtify show --next             # next prayer as a table
muslimtify show --next --json      # next prayer as JSON
muslimtify show --next --headless  # next prayer as key=value
```

```
+------------+------------+----------+-----------+
| Date       | Prayer     | Time     | Remaining |
+------------+------------+----------+-----------+
| 2026-09-17 | Fajr       | 04:30    | 07:18     |
+------------+------------+----------+-----------+
```

`date` is the day the prayer actually falls on, so after Isha it is tomorrow's date. `remaining` is a duration in `HH:MM`, hours and minutes until the prayer, and is never shown in 12-hour form.

```
date=2026-09-17
fajr=04:30
remaining=07:18
```

```json
{
  "date": "2026-09-17",
  "prayer": "fajr",
  "time": "04:30",
  "remaining": "07:18"
}
```

In `--headless` the prayer name is the key of the second line. Skip `date` and `remaining` to find it.

## `muslimtify show --date <start> [end]`

Print the prayer times for a **specific date**, or an **inclusive date range** when a second date is given. Dates use the `yyyy-mm-dd` format.

```bash
muslimtify show --date 2026-07-07                 # a single day
muslimtify show --date 2026-07-01 2026-07-30      # every day from Jul 1 to Jul 30 (inclusive)
muslimtify show --date 2026-07-07 --json          # single day as JSON
```

Two limits apply to the dates you pass:

| Limit | Value | Behaviour when exceeded |
| --- | --- | --- |
| Year | `1` to `9999` | The date is rejected as malformed |
| Range span | 366 days (inclusive) | The range is rejected before any output |

The 366-day cap covers a full leap year, which is the longest span with a practical use. Components do not need to be zero-padded, so `2026-7-7` parses the same as `2026-07-07`. Anything else, including a leading sign, extra digits such as `00002026`, or trailing characters, is rejected. `--json` and `--headless` may appear before or after the dates.

A single date prints exactly like [`muslimtify show`](#muslimtify-show). A range prints one row per day:

```
+------------------------------------------------------+
| Date       | Fajr  | Dhuhr | Asr   | Maghrib | Isha  |
+------------------------------------------------------+
| 2026-09-16 | 04:31 | 11:50 | 15:04 | 17:52   | 19:01 |
| 2026-09-17 | 04:30 | 11:50 | 15:03 | 17:52   | 19:01 |
+------------------------------------------------------+
```

Because each row is a single date, a prayer that falls on another day is marked in the cell instead: `00:01+` for the next day and `23:58-` for the previous one. A legend is printed under the table whenever a marker appears.

```
| 2026-04-30 | 02:41  | 13:27  | 17:40  | 21:51   | 00:01+ |
+----------------------------------------------------------+
  + falls after midnight, on the next day
```

In `--headless` a range is a series of blocks, one per day, separated by a blank line, each in the same shape as a single day:

```
date=2026-09-16
fajr=04:31
dhuhr=11:50
asr=15:04
maghrib=17:52
isha=19:01

date=2026-09-17
fajr=04:30
dhuhr=11:50
asr=15:03
maghrib=17:52
isha=19:01
```

In `--json` a range is an array with one element per day, and each element has exactly the shape of the single-day object shown under [`muslimtify show`](#muslimtify-show): a `date` and a `prayers` object holding all five prayers.

## `muslimtify show --day-offset <days>`

Print the prayer times for a day **relative to today**, without working out the date yourself. The offset is a whole number of days and may be negative.

```bash
muslimtify show --day-offset 1             # tomorrow
muslimtify show --day-offset -1            # yesterday
muslimtify show --day-offset 7 --json      # one week from today, as JSON
muslimtify show --day-offset -365          # one year ago
```

The output is the same as a single-day [`show --date`](#muslimtify-show---date-start-end), so the `date` field tells you which day was shown. The shifted date must fall in years `1` to `9999`.

`--day-offset` cannot be combined with `--next` or `--date`.

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
muslimtify location set --refresh-interval=21600     # re-check the location every 6 hours
muslimtify location set --refresh-interval=0         # never re-check automatically
muslimtify location gps on                           # read coordinates from a GPS receiver
```

The `location` view reports a `gps` field alongside the saved coordinates, showing whether the GPS source is enabled. It appears in all three output formats, as a `gps` row in the table, `gps=true` / `gps=false` in `--headless`, and a boolean `"gps"` in `--json`.

The `gmt` field shows the offset in effect **today**, so it follows daylight saving rather than the value frozen in the config when the location was last set.

`muslimtify location set` updates only the fields you pass, leaving the rest untouched.

| Flag | Description |
| --- | --- |
| `--auto` | Detect coordinates, timezone, and country from your IP address |
| `--lat=<latitude>` | Set latitude manually (make sure the timezone matches) |
| `--long=<longitude>` | Set longitude manually (make sure the timezone matches) |
| `--timezone=<iana>` | Set the IANA timezone, e.g. `Asia/Jakarta` (make sure the coordinates match). The name must resolve on this system or it is rejected |
| `--city=<name>` | Set a display label for your city |
| `--country=<iso2>` | Set the ISO-2 country code, e.g. `ID` (used by `method --auto`) |
| `--refresh-interval=<seconds>` | How often an auto-detected location is re-checked. `0` disables it, the minimum is `3600` (1 hour), and the default is `43200` (12 hours). See [Location auto-refresh](./configuration.md#location-auto-refresh) |

> `--auto` may be combined only with `--city` and/or `--country`. It cannot be mixed with `--lat`, `--long`, or `--timezone`.

> Setting coordinates manually with `--lat` / `--long` turns auto-detection off, so the location is never re-checked. `--refresh-interval` only affects locations detected with `--auto`.

> An unknown or unresolvable timezone name is rejected with `Error: Unknown timezone '<name>'` rather than saved. Real zones that sit at UTC+0, such as `Africa/Abidjan`, are accepted normally.

## `muslimtify location gps`

Read your coordinates from a GPS receiver on the machine instead of looking them up over the network. GPS is **off by default**.

```bash
muslimtify location gps        # show whether GPS is currently enabled
muslimtify location gps on     # probe the receiver and enable it if one is present
muslimtify location gps off    # disable GPS and go back to ipinfo lookup
```

| Argument | Description |
| --- | --- |
| _(none)_ | Print `GPS is enabled` or `GPS is disabled` |
| `on` | Probe for a receiver, and enable GPS only if one is reachable |
| `off` | Disable GPS and use `ipinfo.io` network geolocation |
| `-h`, `--help` | Show the help for this subcommand |

Where the coordinates come from depends on the platform:

| Platform | Source | Requirement |
| --- | --- | --- |
| Linux | A running `gpsd`, read over a local socket on `127.0.0.1:2947` | `gpsd` installed and running, with a GPS device attached |
| Windows | The WinRT Geolocator | Location access enabled under Settings > Privacy & security > Location |

`gps on` is a **validating enable**. It probes the receiver first and only saves the setting if one is actually available, so a typo or a missing daemon fails immediately instead of silently degrading later. Two outcomes enable GPS:

- A fix is ready now, confirmed with the detected coordinates.
- A device is present but has no fix yet. GPS is enabled anyway and `ipinfo.io` is used until a fix arrives.

Everything else leaves GPS disabled and reports why:

| Message | Meaning |
| --- | --- |
| `GPS: cannot reach gpsd. Install and start it, then try again.` | No `gpsd` is listening on the local socket |
| `GPS: no GPS device detected. Connect one, then try again.` | `gpsd` is running but reports no device |
| `GPS: location access is turned off.` | Windows location permission is denied |
| `GPS not available in this build.` | The binary has no GPS client for this platform |

> GPS supplies coordinates only, never a timezone. The timezone is taken from the host system when a GPS fix is used, so set it explicitly with `--timezone` if the machine's clock is in a different region.

> Toggling GPS clears the cached prayer times so the next run recomputes them from the new source.

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

## `muslimtify timeformat`

Show or set the clock format used for every printed time. Available from **v0.4.3**.

```bash
muslimtify timeformat          # show the current format
muslimtify timeformat 12       # 12-hour clock, e.g. 05:52 PM
muslimtify timeformat 24       # 24-hour clock, e.g. 17:52 (default)
muslimtify timeformat --list   # list both formats, * marks the current one
```

The setting is saved in `config.json` and applies everywhere a clock time is printed: the tables, `--json`, `--headless`, `show --next`, and the text of desktop notifications. The hour keeps its leading zero in both modes, so `05:52 PM` rather than `5:52 PM`, which keeps table columns aligned.

```
date=2026-09-16
fajr=04:31 AM
dhuhr=11:50 AM
asr=03:04 PM
maghrib=05:52 PM
isha=07:01 PM
```

Two things are not affected. The `remaining` countdown in `show --next` is a duration, not a time of day, so it stays `HH:MM`. Dates are always `yyyy-mm-dd`.

> If you parse `--json` or `--headless` output in a script, allow for both forms. A 12-hour time contains a space before `AM` or `PM`.

## `muslimtify notification`

Show or configure the notifications and reminders shown around each prayer.

```bash
muslimtify notification              # show current settings
muslimtify notification --json       # show settings as JSON
muslimtify notification --headless   # show settings as key=value
```

Prayer names accepted below are `fajr`, `dhuhr`, `asr`, `maghrib`, and `isha` (or `all`). `sunrise` and `dhuha` were accepted until `prayertimes.h` `v0.2.0` removed them, since neither is a prescribed prayer.

### Enable / disable a prayer

```bash
muslimtify notification enable fajr    # enable Fajr notifications
muslimtify notification disable asr    # disable Asr notifications
muslimtify notification enable all     # enable every prayer
muslimtify notification disable        # no prayer name also means every prayer
```

### Reminders

Set one or more reminders that fire a number of minutes **before** the Adhan. Each value is minutes (1–1440).

```bash
muslimtify notification --reminder fajr 30 15 5   # reminders for a single prayer
muslimtify notification --reminder --all 30 15 5  # the same reminders for every prayer
muslimtify notification --reminder fajr none      # clear Fajr's reminders (clear also works)
```

With no reminders a prayer still notifies once, when it is time to pray.

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
muslimtify notification --adhan set /path/to/adhan.mp3  # use a custom adhan file for every prayer
muslimtify notification --adhan stop             # stop an adhan that is playing now
```

`--adhan set` applies the file to all five prayers. To use a different file for one prayer, edit its `adhan` key in [`config.json`](./configuration.md#adhan-and-sounds). The path must point to an existing regular file. Symlinks and directories are rejected, and the path is saved in its resolved, absolute form.

`--adhan stop` prints `Adhan playback stopped`, or `No adhan is currently playing` when there is nothing to stop. On Windows the notification also carries a Stop button that does the same.

### Sound mode

Choose what sound the notification itself plays.

```bash
muslimtify notification --sound adhan    # adhan | default | off
```

### Send a test notification

Check that notifications and sound work without waiting for the next prayer. The test uses the real settings for the next upcoming prayer, including its time, urgency and sound.

```bash
muslimtify notification test           # send the "it's time" notification now
muslimtify notification test --adhan   # send it with that prayer's adhan
```

```
Sent test notification for Maghrib at 17:52
```

If every prayer is disabled there is nothing to test, and the command exits with `No upcoming prayers enabled.`

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
