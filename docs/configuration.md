---
title: Configuration
sidebar_position: 2
---

# Configuration

Muslimtify can be configured with CLI commands or by editing `config.json` directly. Validation runs automatically every time the config is loaded.

## Config file location

| Platform | Config | Cache |
| --- | --- | --- |
| Linux | `~/.config/muslimtify/config.json` | `~/.cache/muslimtify` |
| Windows | `%APPDATA%\muslimtify\config.json` | `%LOCALAPPDATA%\muslimtify` |

To reset everything, delete `config.json`. Muslimtify falls back to built-in defaults when the file is missing and rewrites it the next time you change a
setting.

## Location

Muslimtify needs your coordinates and timezone to calculate prayer times.

```bash
muslimtify location set --auto                       # detect from your IP
muslimtify location set --auto --city=Mansoura       # auto-detect, custom city label
muslimtify location set --lat=-6.175 --long=106.82   # set manually (uses system timezone)
muslimtify location set --timezone=Asia/Jakarta      # override the timezone
muslimtify location set --city=Jakarta               # add a city label
muslimtify location set --refresh-interval=43200     # re-check every 12 hours
muslimtify location                                  # show current location
```

If the machine is in a different region than the coordinates you set, override the timezone explicitly with `--timezone=<iana>`.

## Location auto-refresh

When your location is auto-detected (`location set --auto`), the background daemon re-checks it once the saved location is older than `refresh_interval` seconds. That
way a machine that moves picks up its new location without you re-running detection. The default is `43200` (12 hours).

Each re-check is a request to `ipinfo.io`, the same service `--auto` uses. At the default interval that is at most two requests per day.

```bash
muslimtify location set --refresh-interval=21600   # re-check every 6 hours
muslimtify location set --refresh-interval=3600    # re-check hourly (the minimum)
muslimtify location set --refresh-interval=0       # disable auto-refresh entirely
muslimtify location                                # shows the current interval
```

Rules worth knowing:

- **`0` disables it.** Your location is still detected once when it is first needed, then never re-checked automatically. You can always refresh on demand with
  `muslimtify location set --auto`.
- **The minimum is `3600` (1 hour).** Values between `1` and `3599` are rejected, and a hand-edited `config.json` below the floor is raised to `3600` on load. This keeps Muslimtify within the limits of the free `ipinfo.io` endpoint.
- **Manual locations are never re-checked.** Setting `--lat` / `--long` turns auto-detection off, which disables refreshing regardless of the interval.
- **A failed refresh is harmless.** If the network is unavailable, Muslimtify keeps your last known coordinates and tries again on a later cycle.

The `updated_at` key in `config.json` records when the location was last fetched successfully (Unix seconds, `0` means never). Muslimtify maintains it for you.

## Calculation method and madzhab

```bash
muslimtify method --auto     # select the method for your detected country
muslimtify method --list     # list all available methods
muslimtify method mwl        # set a method by key
muslimtify madzhab hanafi    # set madzhab (shafi or hanafi)
```

The full list of methods and their regions is in the [Command reference](./command.md#muslimtify-method). The default method is `kemenag` and the
default madzhab is `shafi`.

You can also define a **custom method** by setting `"method": "custom"` in `config.json` with your own `fajr_angle` and `isha_angle` values.

## Prayers and offsets

Each prayer can be enabled or disabled, and given a per-prayer time `offset` (in minutes) to match your local mosque. Sunrise and Dhuha are disabled by default.

```json
"asr": {
  "enabled": true,
  "adhan": "",
  "adhan_enabled": true,
  "reminders": [30, 15, 5],
  "offset": 0
}
```

## Notifications and reminders

Reminders are the minutes-before-Adhan nudges. Configure them per prayer or for all prayers at once:

```bash
muslimtify notification --reminder --all 30 15 5   # set reminders for every prayer
muslimtify notification --reminder fajr 30 15 5    # set reminders for a single prayer
muslimtify notification                            # show current notification settings
```

The `notification` block also controls the toast `timeout`, `urgency`, sounds, and
icon:

```json
"notification": {
  "timeout": 5000,
  "urgency": "critical",
  "sound": "adhan",
  "sound_alarm": "alarm",
  "sound_reminder": "reminder",
  "icon": "muslimtify"
}
```

## Adhan and sounds

Each prayer can play a full Adhan or a gentle reminder chime. Toggle audio per prayer with `adhan_enabled`, and point `adhan` at a custom sound file to override the default for that prayer. The global `sound`, `sound_alarm`, and `sound_reminder` keys in the `notification` block set the defaults.

## Full default config.json

<details>
<summary>Default config.json</summary>

```json
{
  "location": {
    "latitude": 0.0,
    "longitude": 0.0,
    "timezone": "UTC",
    "timezone_offset": 0.0,
    "auto_detect": true,
    "updated_at": 0,
    "refresh_interval": 43200,
    "city": "",
    "country": ""
  },
  "prayers": {
    "fajr":    { "enabled": true,  "adhan": "", "adhan_enabled": true,  "reminders": [30, 15, 5], "offset": 0 },
    "sunrise": { "enabled": false, "adhan": "", "adhan_enabled": false, "reminders": [],          "offset": 0 },
    "dhuha":   { "enabled": false, "adhan": "", "adhan_enabled": false, "reminders": [],          "offset": 0 },
    "dhuhr":   { "enabled": true,  "adhan": "", "adhan_enabled": true,  "reminders": [30, 15, 5], "offset": 0 },
    "asr":     { "enabled": true,  "adhan": "", "adhan_enabled": true,  "reminders": [30, 15, 5], "offset": 0 },
    "maghrib": { "enabled": true,  "adhan": "", "adhan_enabled": true,  "reminders": [30, 15, 5], "offset": 0 },
    "isha":    { "enabled": true,  "adhan": "", "adhan_enabled": true,  "reminders": [30, 15, 5], "offset": 0 }
  },
  "notification": {
    "timeout": 5000,
    "urgency": "critical",
    "sound": "adhan",
    "sound_alarm": "alarm",
    "sound_reminder": "reminder",
    "icon": "muslimtify"
  },
  "calculation": {
    "method": "kemenag",
    "madhab": "shafi"
  }
}
```

</details>
