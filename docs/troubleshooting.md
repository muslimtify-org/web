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

   If nothing shows, the issue is with your desktop notification daemon, not
   Muslimtify.

3. **On Windows**, local system settings can block toast delivery. Check your
   notification settings, Focus Assist / Do Not Disturb, and make sure the command
   is running in an interactive desktop session.

## Location detection is not working

- Run the automatic detection again:

  ```bash
  muslimtify location set --auto
  ```

- Set your coordinates manually if auto-detection keeps failing:

  ```bash
  muslimtify location set --lat=<latitude> --long=<longitude>
  ```

- If the host machine is in a different region than the coordinates, override the
  timezone:

  ```bash
  muslimtify location set --lat=-6.21 --long=106.84 --timezone=Asia/Jakarta
  ```

- Auto-detection relies on network access to `ipinfo.io`. Check that this host is
  reachable if detection fails.

## The daemon is not running

- Check its status:

  ```bash
  muslimtify daemon status
  ```

- Re-register the service:

  ```bash
  muslimtify daemon install
  ```

- On Linux, the daemon runs under systemd. Confirm your session has an active user
  systemd instance if the service refuses to start.

## Resetting your configuration

Delete `config.json` to return to defaults. Muslimtify recreates it with built-in
defaults the next time you change a setting.

| Platform | Config path |
| --- | --- |
| Linux | `~/.config/muslimtify/config.json` |
| Windows | `%APPDATA%\muslimtify\config.json` |

## Still stuck?

- Open an issue: [GitHub Issues](https://github.com/rizukirr/muslimtify/issues)
- Ask the community: [GitHub Discussions](https://github.com/rizukirr/muslimtify/discussions)
