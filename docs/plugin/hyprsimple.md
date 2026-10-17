---
title: Hyprsimple
sidebar_position: 2
---

# Hyprsimple plugin

The [muslimtify-hyprsimple](https://github.com/muslimtify-org/muslimtify-hyprsimple) plugin puts Muslimtify on the [Hyprsimple](https://github.com/rizukirr/hyprsimple) bar. The bar shows the next prayer and its time. Click it for a panel with today's prayer times, a countdown, and every Muslimtify setting.

<video controls src="https://github.com/user-attachments/assets/6e8a1070-8362-4473-b5af-f1fdba2cbd25" style={{width: '100%', height: 'auto'}} />

## Requirements

- Hyprsimple with the external plugin API 1, which is any version that ships the `hyprsimple-plugin` command.
- Arch Linux, because the plugin manager installs Muslimtify from the AUR when it is missing.

You do not need to install Muslimtify first. The plugin declares the `muslimtify` AUR package as a dependency, and the manager installs it, registers the daemon and enables the plugin in one step. Hyprsimple also installs this plugin by default, so on a fresh Hyprsimple setup it is already on the bar.

The plugin reads your Muslimtify config and changes it only through the `muslimtify` CLI. Notifications still come from the Muslimtify daemon, so if they stop, check that it is running:

```bash
muslimtify daemon status
```

## Install

```bash
hyprsimple-plugin muslimtify-org/muslimtify-hyprsimple
```

A bare `owner/repository` or a GitHub HTTPS URL is treated as `install`, so this is the same as `hyprsimple-plugin install https://github.com/muslimtify-org/muslimtify-hyprsimple.git`. The code lands in `~/.local/share/hyprsimple-plugins/muslimtify`, and the plugin is recorded in `~/.config/hyprsimple/plugins.json`.

Installing runs `muslimtify daemon install` and then `muslimtify daemon status`. If either fails, the plugin is installed but left disabled, and the command says so. Fix the cause and run `hyprsimple-plugin enable muslimtify`.

The widget sits on the left of the bar. To move it, set `placement` for the `muslimtify` entry in `~/.config/hyprsimple/plugins.json` to `left`, `center` or `right`, then restart the bar.

## Bind a key

The plugin binds no key of its own. Its panel alias is `prayer`, so you can open it from any Hyprsimple binding. Add a line to `~/.config/hypr/bindings/applications.lua`:

```lua
hl.bind("SUPER + P", hl.dsp.exec_cmd(vars.barPanel .. "prayer"), { description = "Prayer Times (panel)" })
```

The same panel opens from a terminal or a script:

```bash
qs -p ~/.local/share/hyprsimple/default/quickshell ipc call bar toggle prayer
```

## Manage

```bash
hyprsimple-plugin list                  # installed plugins, with version and whether each is enabled
hyprsimple-plugin update muslimtify     # update to the newest release
hyprsimple-plugin disable muslimtify    # hide the widget and unregister the daemon
hyprsimple-plugin enable muslimtify     # register the daemon and show the widget again
hyprsimple-plugin remove muslimtify     # disable, then delete the plugin's code
```

`enable` runs `muslimtify daemon install` and checks `muslimtify daemon status`. If either fails the plugin stays disabled and `enable` can be run again. `disable` runs `muslimtify daemon uninstall`. Disabling or removing the plugin keeps your Muslimtify configuration and the installed package, so `enable` or a fresh install brings everything back as it was.

## Using it

### On the bar

The label is the next prayer as plain text, such as `Asr 14:54`. It is hidden until a schedule has been read.

| Action | Result |
| --- | --- |
| Left-click | Opens or closes the panel |
| Right-click | Switches between the prayer time and the countdown, such as `Asr -01:55` |

Hovering shows the full line, for example `Asr at 14:54, in 01:55`. The label is highlighted when the next prayer is 15 minutes away or less.

### Today

The panel opens on today's schedule:

- A card with the next prayer, its time and a countdown. After Isha it shows tomorrow's Fajr, marked `tomorrow`.
- The five prayers with their times.
- On each prayer row, a bell toggles its notification and a speaker toggles its adhan.
- Links to the Muslimtify GitHub repository and this website.

If the schedule cannot be read, the panel header shows the error, keeps the last usable schedule on screen, and retries on its own.

### Settings

Open settings with the gear button or the `s` key. The sections, top to bottom:

| Section | Settings |
| --- | --- |
| Time format | 12-hour or 24-hour clock |
| Location | Whether the location is auto-detected or set manually, a **Detect from IP** button, latitude, longitude, timezone, city, country, refresh interval, and a **Use GPS** switch |
| Calculation | Method and madzhab |
| One section per prayer | Reminder minutes and offset for Fajr, Dhuhr, Asr, Maghrib and Isha |
| Notifications | Urgency and sound |

Changes save right away through the `muslimtify` CLI. Toggles and dropdowns apply when you change them, and text fields apply when you press Enter or move to another field. A value Muslimtify rejects is shown as an error under the field and is not saved.

Changing the coordinates switches the location to manual, clears the city and country, and sets the timezone from the new coordinates. Set the city and country again afterwards if you want them.

See [Configuration](../configuration.md) for what each setting does.

### Keys

| Key | Action |
| --- | --- |
| `s` | Opens settings, or closes them |
| `r` | Refreshes the prayer times |
| Esc | Leaves settings, or closes the panel |

Keys typed into a text field go to the field, not to the panel.

## Troubleshooting

### The panel says muslimtify was not found

The plugin could not run the `muslimtify` command. Install the package and make sure `command -v muslimtify` prints a path, then restart the bar. If you removed the package yourself, `hyprsimple-plugin enable muslimtify` installs it again.

### The widget does not appear

Check that the plugin is installed and enabled:

```bash
hyprsimple-plugin list
```

If it is listed as disabled, run `hyprsimple-plugin enable muslimtify` and read its output: it fails when `muslimtify daemon install` or `muslimtify daemon status` fails, and says which. The widget is also hidden until the first schedule has been read, so give it a moment after enabling.

### `update` refuses to run

```
hyprsimple-plugin: refusing dirty plugin update
```

The plugin directory has local edits. The manager updates with git and will not overwrite your changes. Either commit or discard them in `~/.local/share/hyprsimple-plugins/muslimtify`, or remove and reinstall the plugin.

For anything else, open an issue on [muslimtify-hyprsimple](https://github.com/muslimtify-org/muslimtify-hyprsimple/issues).
