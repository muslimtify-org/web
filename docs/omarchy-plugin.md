---
title: Omarchy plugin
sidebar_position: 5
---

# Omarchy plugin

The [muslimtify-omarchy](https://github.com/muslimtify-org/muslimtify-omarchy) plugin puts Muslimtify on the [Omarchy](https://omarchy.org) bar. The bar shows the next prayer and its time. Click it for a popup with today's prayer times and every Muslimtify setting.

<video controls src="https://github.com/user-attachments/assets/ca837af0-7132-4384-aba0-0535c539fbf0" style={{width: '100%', height: 'auto'}} />

## Requirements

- Omarchy, with its Quickshell-based shell.
- Muslimtify installed and on your `PATH`. See [Get Started](./get-started.md).

The plugin reads your Muslimtify config and changes it only through the `muslimtify` CLI. Notifications still come from the Muslimtify daemon, so check that it is running:

```bash
muslimtify daemon status
```

## Install

```bash
omarchy plugin add https://github.com/muslimtify-org/muslimtify-omarchy --enable
```

The widget lands in the center of the bar. To move it, for example to the left of the clock:

```bash
omarchy bar move muslimtify-org.muslimtify --section center --index 1
```

You can also drag it along the bar.

## Remove

```bash
omarchy plugin disable muslimtify-org.muslimtify
omarchy plugin remove muslimtify-org.muslimtify
```

## Using it

### On the bar

The label is the next prayer as plain text, such as `Asr 14:54`.

| Action | Result |
| --- | --- |
| Left-click | Opens or closes the popup |
| Right-click | Switches between the prayer time and the countdown, such as `Asr -01:55` |

The label turns the accent color when the next prayer is 15 minutes away or less.

### Today

The popup opens on today's schedule:

- A card with the next prayer, its time, a countdown, and progress since the previous prayer. After Isha it shows tomorrow's Fajr.
- The five prayers. The next one sits in a box, and past ones are dimmed.
- On each prayer row, a bell toggles its notification and a speaker toggles its adhan.
- Links to the Muslimtify GitHub repository and this website.

### Settings

Open settings with the gear button or the `s` key. It has four sections:

| Section | Settings |
| --- | --- |
| Location | Latitude, longitude, timezone, city, country, refresh interval, GPS, and a **Detect from IP** button |
| Calculation | Method and madzhab |
| Prayers | Reminder minutes and offset for each prayer |
| Notifications | Urgency and sound |

Changes save right away. Toggles and dropdowns apply when you change them, and text fields apply when you press Enter or move to another field. An invalid value turns the field red and is not saved.

Changing the coordinates switches the location to manual, clears the city and country, and sets the timezone from the new coordinates. Set the city and country again afterwards if you want them.

See [Configuration](./configuration.md) for what each setting does.

### Keys

| Key | Action |
| --- | --- |
| `s` | Opens settings, or closes them |
| `r` | Refreshes the prayer times |
| Esc | Leaves settings, or closes the popup |
| Tab | Moves to the next bar panel |

## Troubleshooting

### The popup says muslimtify was not found

Install Muslimtify and make sure `command -v muslimtify` prints a path, then restart the shell:

```bash
omarchy-restart-shell
```

### The widget does not appear

Check that the plugin is installed and enabled:

```bash
omarchy plugin list
```

If it shows as disabled, enable it with `omarchy plugin enable muslimtify-org.muslimtify`. If it still does not appear, restart the shell with `omarchy-restart-shell`.

For anything else, open an issue on [muslimtify-omarchy](https://github.com/muslimtify-org/muslimtify-omarchy/issues).
