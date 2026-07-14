---
title: Get Started
slug: /
sidebar_position: 1
---

# Get Started

Muslimtify keeps you consistent with your daily prayers by delivering accurate prayer times and timely desktop notifications. Designed for **Linux and Windows**, it automatically calculates prayer schedules and reminds you 30, 15, and 5 minutes before the Adhan, or at your own custom intervals, and again when it is time to pray.

All calculations run **locally** on your machine. No internet connection, no accounts, and no tracking. Muslimtify supports **21 international calculation methods**, all madzhab, and every country, with Kemenag as the default method.

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
`.\uninstall.ps1`).

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

That is it. Muslimtify now runs quietly in the background and notifies you before
every prayer.

## Next steps

- [Configuration](./configuration.md): tune location, method, madzhab, reminders, and sounds.
- [Command reference](./command.md): every CLI command with examples.
- [Troubleshooting](./troubleshooting.md): fixes for notifications, location, and the daemon.
