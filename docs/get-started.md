---
title: Get Started
slug: /
sidebar_position: 1
---

# Get Started

Muslimtify keeps you consistent with your daily prayers by delivering accurate prayer times and timely desktop notifications. Designed for **Linux and Windows**, it automatically calculates prayer schedules and reminds you 30, 15, and 5 minutes before the Adhan, or at your own custom intervals, and again when it is time to pray.

All prayer time calculations run **locally** on your machine, with no accounts and no tracking. The only time Muslimtify reaches the network is to detect your location from your IP address via `ipinfo.io`, and that is optional. Set your coordinates manually with `location set --lat/--long`, or read them from a GPS receiver with `location gps on`, and it never makes a network request. Muslimtify supports **21 international calculation methods**, all madzhab, and every country, with Kemenag as the default method.

## Installation

Every release ships ready-to-run binaries for Linux and Windows on the [releases page](https://github.com/rizukirr/muslimtify/releases/latest). Pick the
option that matches your system.

### Arch Linux (AUR)

```bash
yay -S muslimtify && muslimtify daemon install
```

### Fedora (COPR)

```bash
sudo dnf copr enable rizukirr/muslimtify && sudo dnf install muslimtify && muslimtify daemon install
```

### Debian / Ubuntu (PPA)

```bash
sudo add-apt-repository ppa:rizukirr/muslimtify && sudo apt update && sudo apt install muslimtify && muslimtify daemon install
```

### Windows (winget)

```powershell
winget install muslimtify && muslimtify daemon install
```

### Prebuilt binaries (Linux)

The Linux binaries are dynamically linked, so install the runtime libraries first,
then extract and install:

```bash
# Ubuntu/Debian
sudo apt install libnotify4 libcurl4
# Fedora/RHEL
sudo dnf install libnotify libcurl
# Arch
sudo pacman -S libnotify curl

# download from https://github.com/rizukirr/muslimtify/releases/latest
tar xzf muslimtify-<version>-linux-<arch>.tar.gz
sudo cp -r muslimtify-<version>-linux-<arch>/{bin,lib,share} /usr/local/
muslimtify daemon install
```

Verify any download against the published checksums:

```bash
sha256sum -c SHA256SUMS
```

### Prebuilt installer (Windows)

[Download](https://github.com/rizukirr/muslimtify/releases/latest) and run the installer that matches your architecture:

```powershell
muslimtify-<version>-setup-x64.exe      # Intel / AMD
muslimtify-<version>-setup-arm64.exe    # ARM
```

### Build from source

Install the build dependencies:

```bash
# Ubuntu/Debian
sudo apt install git build-essential cmake pkg-config libnotify-dev libcurl4-openssl-dev
# Fedora/RHEL
sudo dnf install git gcc cmake pkgconfig libnotify-devel libcurl-devel
# Arch Linux
sudo pacman -S git base-devel cmake pkgconfig libnotify curl
```

Then clone, install, and register the background service:

```bash
git clone https://github.com/rizukirr/muslimtify.git
cd muslimtify
sudo ./install.sh
muslimtify daemon install
```

On Windows, run `.\install.ps1` instead of `./install.sh` (remove later with
`.\uninstall.ps1`). Building on Windows requires MSVC, and the build stops with an explicit message if another compiler is used.

`install.sh` compiles as the user who invoked `sudo` rather than as root, and refuses to build from a source tree that is group- or world-writable, since anything in that tree would otherwise be executed with root privileges. If it reports unsafe permissions, correct the listed paths so each is owned by root or by you and is not writable by others, then re-run.

### Optional: GPS support

GPS is optional and needs nothing at build time. On Linux, install and start `gpsd` if you want Muslimtify to read coordinates from a local receiver instead of the network:

```bash
# Ubuntu/Debian
sudo apt install gpsd
# Fedora/RHEL
sudo dnf install gpsd
# Arch
sudo pacman -S gpsd
```

Muslimtify talks to `gpsd` over a socket, so there is no `libgps` dependency and no rebuild is needed. Enable it with `muslimtify location gps on`. On Windows nothing needs installing, but location access must be enabled in Settings.

## Quick start

After installing, confirm the background service is registered:

```bash
muslimtify daemon status
```

If no status is found, register it:

```bash
muslimtify daemon install
```

Muslimtify automatically selects the standard calculation method based on your country and location. Run `show` to see today's prayer times and verify your
configuration:

```bash
muslimtify show
```

If the automatic detection is off, set your location and method manually:

```bash
muslimtify location set --auto     # detect location from your IP
muslimtify method --auto           # pick the method for your detected country
```

If you have a GPS receiver and would rather not use a network lookup at all:

```bash
muslimtify location gps on         # probe the receiver and enable it
```

That is it. Muslimtify now runs quietly in the background and notifies you before
every prayer.

## Next steps

- [Configuration](./configuration.md): tune location, method, madzhab, reminders, and sounds.
- [Command reference](./command.md): every CLI command with examples.
- [Troubleshooting](./troubleshooting.md): fixes for notifications, location, and the daemon.
