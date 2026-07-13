---
slug: integrate-muslimtify-with-waybar
title: Integrate muslimtify with waybar
authors:
  - rizukirr
tags: [muslimtify, linux, waybar, wayland]
---

<img width="1920" height="1080" alt="2026-07-13-135546_hyprshot" src="https://github.com/user-attachments/assets/1015c250-6262-4071-a0a5-d0e4c30a6c69" style={{height: 'auto'}} />

If you're a Muslim using a tiling window manager on Linux, you've probably wished for a subtle, always-visible prayer time indicator on your status bar. In this article, I'll walk you through how I integrated Muslimtify, a prayer time notification tool, with Waybar, the popular status bar for Wayland compositors like Hyprland and Sway.

The end result: a clean module in your Waybar that shows the next prayer name, time, and countdown, with a hover tooltip displaying the full prayer schedule.

{/* truncate */}

## What is Muslimtify?

Muslimtify is a minimalist prayer time notification daemon for Muslims designed specifically for Linux and Windows desktops (MacOS soon). It calculates Islamic prayer times locally using pure astronomical formulas. It provides a seamless way to receive accurate prayer alerts directly through native system notifications and a clean command-line interface.

Key CLI subcommands we'll use:

```bash
muslimtify show --headless          # Show today's prayer times in key=value format
muslimtify show --next --headless   # Show next prayer's name, time, and remaining countdown in key=value format
```

## Prerequisites

- Waybar installed and configured
- Muslimtify installed 
- A Nerd Font (I use JetBrainsMono Nerd Font for the prayer icon)

Make sure Muslimtify is working before proceeding:

```bash
muslimtify daemon status
```

If this returns with active status, you're good to go, otherwise you can run:

```bash
muslimtify daemon install
```

## Configure Your Location (Optional)

Muslimtify calculates prayer times based on your coordinates, which are detected automatically. You can verify your current location and prayer times by running:


```bash
muslimtify show
```

If the displayed prayer times are already accurate (within a tolerance of ±2 minutes), you can safely skip this section. Otherwise, follow the steps below to manually adjust your location settings.

The quickest way is to auto-detect from your IP address:

```bash
muslimtify location set --auto
```

Or set it manually if you prefer:

```bash
muslimtify location set --lat=-6.21 --long=106.84 --timezone=Asia/Jakarta
```

Optionally, pick a calculation method and madzhab that match your region:

```bash
muslimtify method --auto   # Auto-select from your country
muslimtify madzhab shafi   # Or hanafi
```

Now verify Muslimtify is returning data:

```bash
muslimtify show --headless
```

You should see five `key=value` prayer lines (fajr, dhuhr, asr, maghrib, isha). Once you do, the Waybar module has something to display.

## Step 1: Create the Waybar Script

Waybar custom modules can consume JSON output with `text` and `tooltip` fields. We'll write a small shell script that queries Muslimtify and formats the output.

Create `~/.local/bin/waybar-muslimtify.sh` (or in any location you want):

```bash
#!/bin/bash

# Next prayer: `muslimtify show --next --headless` emits two key=value lines,
# e.g.  asr=15:22  /  remaining=03:08  (prayer name is lowercase)
name=""
time=""
remaining=""
while IFS='=' read -r key val; do
    [[ -z "$key" ]] && continue
    if [[ "$key" == "remaining" ]]; then
        remaining="$val"
    else
        name="$key"
        time="$val"
    fi
done < <(muslimtify show --next --headless 2>/dev/null)

if [[ -n "$name" && -n "$time" && -n "$remaining" ]]; then
    display_name="${name^}"   # Capitalize first letter for display

    # Build beautiful tooltip from prayer times
    tooltip="󰧧  <b>Prayer Times</b>\n━━━━━━━━━━━━━━━━━━━━━"

    while IFS='=' read -r prayer ptime; do
        [[ -z "$prayer" ]] && continue
        icon=""
        case "$prayer" in
            fajr)    icon="󰖜" ;;
            dhuhr)   icon="󰖙" ;;
            asr)     icon="󰖚" ;;
            maghrib) icon="󰖛" ;;
            isha)    icon="󰖔" ;;
        esac

        pretty="${prayer^}"
        padded=$(printf '%-9s' "$pretty")   # pad name so times align in a column

        if [[ "$prayer" == "$name" ]]; then
            tooltip+="\n${icon}  <b>${padded}${ptime}</b>  󰁍"
        else
            tooltip+="\n${icon}  ${padded}${ptime}"
        fi
    done < <(muslimtify show --headless 2>/dev/null)

    tooltip+="\n━━━━━━━━━━━━━━━━━━━━━"
    tooltip+="\n󰔟  Next: <b>${display_name}</b> in <b>${remaining}</b>"

    printf '{"text": "󱠧  %s %s | 󰔟 %s", "tooltip": "%s"}\n' \
        "$display_name" "$time" "$remaining" "$tooltip"
else
    printf '{"text": "󱠧 --:--", "tooltip": "Prayer times unavailable"}\n'
fi
```

Make it executable:

```bash
chmod +x ~/.local/bin/waybar-muslimtify.sh
```

**How the script works:**

- It runs `muslimtify show --next --headless` once and parses the `key=value` lines it emits to get the next prayer's name, time, and remaining countdown.
- For the tooltip, it runs `muslimtify show --headless` to read the full prayer times as `key=value` pairs, then builds a formatted list with a Nerd Font icon for each prayer and marks the next prayer with an arrow.
- If any data is missing (e.g., Muslimtify isn't configured yet), it falls back to a placeholder `--:--` display.
- The output is a JSON object that Waybar's `return-type: json` consumes directly.

The `󱠧` character is a mosque/prayer icon from Nerd Fonts, feel free to swap it for any icon you prefer or delete it.

## Step 2: Add the Custom Module to Waybar Config

Open your Waybar config (typically `~/.config/waybar/config.jsonc`) and add the custom module definition:

```jsonc
"custom/muslimtify": {
  "exec": "~/.local/bin/waybar-muslimtify.sh",
  "return-type": "json",
  "interval": 30,
  "tooltip": true
}
```

- `exec`, path to our script
- `return-type`, tells Waybar to parse the output as JSON (using `text` and `tooltip` fields)
- `interval`, refresh every 30 seconds, which is more than enough for minute-level prayer times
- `tooltip`, enable the hover tooltip

Then, place it in whichever bar section you want. I put it in the left modules, right after workspaces:

```jsonc
"modules-left": ["hyprland/workspaces", "custom/muslimtify"],
```

## Step 3: Style the Module

Here's where it gets fun. You can use whatever colors you want. I wanted the prayer module to stand out with a warm amber accent, like a gentle reminder.

Add this to your `~/.config/waybar/style.css`:

```css
#custom-muslimtify {
  background-color: #475258;
  color: #dbbc7f;
  border: 1.5px solid rgba(219, 188, 127, 0.35);
  border-radius: 1.5rem 1.5rem 0.3rem 0.3rem;
  padding: 0.4rem 1.2rem;
  margin: 5px 0 0 1rem;
  text-shadow: 0 0 4px rgba(219, 188, 127, 0.25);
  box-shadow: inset 0 1px 0 rgba(219, 188, 127, 0.08),
              0 1px 3px rgba(45, 53, 59, 0.6);
  transition: all 300ms ease;
}

#custom-muslimtify:hover {
  background-color: rgba(219, 188, 127, 0.15);
  border-color: #dbbc7f;
  text-shadow: 0 0 10px rgba(219, 188, 127, 0.6);
  box-shadow: inset 0 1px 0 rgba(219, 188, 127, 0.15),
              0 2px 8px rgba(219, 188, 127, 0.2);
}
```

This gives the module:

- A semi-transparent amber border that subtly glows
- An asymmetric border-radius (rounded top, nearly square bottom) for a distinctive shape
- A gentle text shadow that intensifies on hover
- A subtle inset shadow for depth, with a smooth transition on hover

Swap the hex values for any colors you like. If your Waybar setup uses a shared color theme, you can also plug in your theme variables here, for example `@warning` in place of `#dbbc7f`.

## Step 4: Reload Waybar

Restart Waybar to see the changes:

```bash
killall waybar && waybar &
```

Or if you're on Hyprland, you can simply reload your config.

You should now see something like this on your bar:

```
󱠧  Asr 15:23 | 󰔟 1:42
```

Hovering over it reveals the full prayer times table:

```
Prayer Times for Saturday, February 28, 2026
Location: Jakarta, Indonesia (-6.2088, 106.8456)

┌────────────┬──────────┬──────────┬───────────────────────┐
│ Prayer     │ Time     │ Status   │ Reminders             │
├────────────┼──────────┼──────────┼───────────────────────┤
│ Fajr       │ 04:38    │ Enabled  │ 10 min before         │
│ Sunrise    │ 05:56    │ Disabled │ -                     │
│ Dhuha      │ 06:19    │ Enabled  │ At prayer time        │
│ Dhuhr      │ 12:05    │ Enabled  │ 10 min before         │
│ Asr        │ 15:23    │ Enabled  │ 10 min before         │
│ Maghrib    │ 18:12    │ Enabled  │ At prayer time        │
│ Isha       │ 19:23    │ Enabled  │ 10 min before         │
└────────────┴──────────┴──────────┴───────────────────────┘
```

## How It All Fits Together

```
systemd timer (every minute)
└─→ muslimtify check → sends desktop notification if prayer time matches

Waybar (every 30 seconds)
└─→ waybar-muslimtify.sh
      ├─→ muslimtify show --next --headless → next prayer name, time, remaining
      └─→ muslimtify show --headless        → full prayer times for the tooltip
```

Muslimtify handles two separate concerns:

1. **Notifications**, the systemd timer runs `muslimtify check` every minute and sends a desktop notification when it's prayer time.
2. **Status bar**, the Waybar module runs independently, polling the CLI every 30 seconds to show the next prayer.

Both use the same local calculation engine, so they're always in sync, no server, no API, no internet required for prayer time data.

## Wrapping Up

This integration gives you a persistent, glanceable prayer time widget right in your Waybar without sacrificing privacy or adding bloat. The total setup is just three things:

- A single shell script
- A 6-line Waybar module config
- A few lines of CSS

You can find my Waybar configuration here: [Hyprsimple](https://github.com/rizukirr/hyprsimple)

May this small tool help you stay mindful of your prayers throughout the day.
