---
title: Troubleshooting
sidebar_position: 5
---

# Troubleshooting

## Notifications are not appearing

1. Confirm the background service is running:

```bash
muslimtify daemon status
```
If it is not registered, run `muslimtify daemon install`.

2. **On Linux**, verify that desktop notifications work at all:

```bash
notify-send "Test" "Hello"
```
If nothing shows, the issue is with your desktop notification daemon, not Muslimtify.

3. **On Windows**, local system settings can block toast delivery. Check your notification settings, Focus Assist / Do Not Disturb, and make sure the command is running in an interactive desktop session.

## A notification did not fire while the machine was busy or asleep

Muslimtify catches up on triggers it missed. If a check cycle runs late, any trigger scheduled within the previous **15 minutes** still fires. Anything older than that is dropped without firing, so resuming from a long suspend does not replay a stack of stale Adhans hours after the fact.

If notifications are missing well inside that window, the daemon is most likely not running at all. Check with `muslimtify daemon status`.

## Location detection is not working

- Run the automatic detection again:

```bash
muslimtify location set --auto
```

- Set your coordinates manually if auto-detection keeps failing:

```bash
muslimtify location set --lat=<latitude> --long=<longitude>
```

- If the host machine is in a different region than the coordinates, override the timezone:

```bash
muslimtify location set --lat=-6.21 --long=106.84 --timezone=Asia/Jakarta
```

- Auto-detection relies on network access to `ipinfo.io`. Check that this host is reachable if detection fails.

## GPS will not turn on

`muslimtify location gps on` probes the receiver before saving the setting, so it refuses rather than enabling something that cannot work. The message tells you which part is missing.

| Message | Fix |
| --- | --- |
| `GPS: cannot reach gpsd.` | Install `gpsd` and start it. Muslimtify reads it over a local socket on `127.0.0.1:2947` |
| `GPS: no GPS device detected.` | `gpsd` is running but sees no hardware. Connect the receiver and confirm `gpsd` has picked it up |
| `GPS: location access is turned off.` | On Windows, enable Settings > Privacy & security > Location, then try again |
| `GPS not available in this build.` | This binary has no GPS client for the platform it is running on |

If it reports that GPS is enabled but no fix is available yet, that is not an error. The setting is saved and `ipinfo.io` is used until the receiver locks on.

To check the current state at any time:

```bash
muslimtify location gps    # prints "GPS is enabled" or "GPS is disabled"
muslimtify location        # the gps field appears alongside your coordinates
```

## GPS turned itself off

If the GPS daemon or device stops being reachable after you enabled it, Muslimtify warns once and clears the setting so it does not retry on every cycle. Restore the receiver, then run `muslimtify location gps on` again.

A denied permission is treated differently and does **not** disable GPS, because granting access in Settings is enough to make the next attempt succeed on its own.

## Muslimtify rejects my timezone

```
Error: Unknown timezone 'Asia/Jakartaa'
```

The name has to resolve on this system. Check the spelling against the IANA database, for example `Asia/Jakarta`, `Europe/London`, or `America/New_York`. Zones that legitimately sit at UTC+0, such as `Africa/Abidjan`, are accepted.

## Prayer times are off by an hour

This is almost always daylight saving. Muslimtify derives the UTC offset from your IANA `timezone` for the date being calculated, so DST transitions are handled for you, but only when a valid zone name is saved.

Check what is stored:

```bash
muslimtify location
```

The `gmt` field shows the offset in effect today, not the one recorded when you last set your location. If `timezone` is empty or wrong, set it explicitly:

```bash
muslimtify location set --timezone=Europe/London
```

## `show --date` rejects my dates

Two limits apply. Years must be between `1` and `9999`, and a range may span at most 366 days. A range longer than that is refused before any output is printed. Split it into smaller spans:

```bash
muslimtify show --date 2026-01-01 2026-12-31    # 365 days, accepted
```

## I moved, but my location did not update

An auto-detected location is re-checked in the background every 12 hours by default, so it can take up to that long to catch up after you travel. To update it right away:

```bash
muslimtify location set --auto
```

To make the automatic re-check more frequent, lower the interval (the minimum is
`3600`, one hour):

```bash
muslimtify location set --refresh-interval=3600
```

If your location never updates on its own, check `muslimtify location`: a `refresh_interval` of `disabled` turns automatic re-checks off, and coordinates set manually with `--lat` / `--long` are never re-checked at all. See [Location auto-refresh](./configuration.md#location-auto-refresh).

## The daemon is not running

- Check its status:

```bash
muslimtify daemon status
```

- Re-register the service:

```bash
muslimtify daemon install
```

- On Linux, the daemon runs under systemd. Confirm your session has an active user systemd instance if the service refuses to start.

## Resetting your configuration

Delete `config.json` to return to defaults. Muslimtify recreates it with built-in defaults the next time you change a setting.

| Platform | Config path |
| --- | --- |
| Linux | `~/.config/muslimtify/config.json` |
| Windows | `%APPDATA%\muslimtify\config.json` |

## Still stuck?

- Open an issue: [GitHub Issues](https://github.com/rizukirr/muslimtify/issues)
- Ask the community: [GitHub Discussions](https://github.com/rizukirr/muslimtify/discussions)
- Join the [Discord server](https://discord.gg/tpNZBXmKpd)
