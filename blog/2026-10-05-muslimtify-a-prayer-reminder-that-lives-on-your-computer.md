---
slug: muslimtify-a-prayer-reminder-that-lives-on-your-computer
title: Muslimtify, a prayer reminder that lives on your computer
authors:
  - rizukirr
tags: [muslimtify, introduction]
---

You sit down at your computer after Dhuhr with a full list of things to do. The work pulls you in. Your phone is face down on silent because you wanted to focus. When you finally look up, the sky outside is already turning orange and Asr is almost gone.

Most of us who work or study in front of a screen know this moment. We did not decide to delay the prayer. We lost track of time.

Introducing **Muslimtify**. It is a small, free app for Linux and Windows that sits quietly in the background of your computer and tells you when the prayer is coming, and again when it is time to pray.

{/* truncate */}

## What Muslimtify does for you

Muslimtify works out the five daily prayer times for the place where you live, then shows a notification on your desktop at the right moments. By default you get a reminder 30 minutes, 15 minutes and 5 minutes before each prayer, and one more when the time arrives, with the sound of the adhan.

You can change all of it. If three reminders feel like too many, keep one. If you want a longer warning before Fajr and a shorter one before Maghrib, each prayer can have its own reminders. You can turn the adhan off for a single prayer, or replace it with a recording of the adhan you love most.

There is no window to keep open and nothing to click every morning. You set it up once, and it keeps running each time you use your computer.

## Prayer times that match where you live

Muslims around the world do not all use the same prayer timetable. The Ministry of Religious Affairs in Indonesia, JAKIM in Malaysia, Umm al-Qura in Makkah, Diyanet in Turkey and ISNA in North America each follow their own standard for Fajr and Isha. A timetable that is right in Jakarta can be several minutes off from what the mosque announces in Istanbul.

Muslimtify supports 21 of these standards:

| Standard | Used in |
| --- | --- |
| Muslim World League | Europe, Far East |
| Umm al-Qura | Makkah, Arabian Peninsula |
| ISNA | North America |
| Egyptian General Authority | Egypt, Africa, Middle East |
| University of Islamic Sciences, Karachi | Pakistan, India, Bangladesh |
| Diyanet | Turkey |
| MUIS | Singapore |
| JAKIM | Malaysia |
| Kemenag | Indonesia |
| UOIF | France |
| Spiritual Administration | Russia |
| GAIAE | Dubai, UAE |
| Ministry of Awqaf | Qatar |
| Ministry of Awqaf | Kuwait |
| Ministry of Awqaf | Jordan |
| Gulf Region | Gulf states |
| Ministry of Religious Affairs | Tunisia |
| Ministry of Religious Affairs | Algeria |
| Ministry of Habous | Morocco |
| Comunidade Islamica de Lisboa | Portugal |
| Moonsighting Committee | Worldwide |

You do not need to know which one applies to you. Muslimtify looks at the country you are in and picks the standard used there. If your local mosque follows a different one, you can switch with a single command.

The time of Asr also depends on the madhhab. Muslimtify lets you choose between the Shafi'i and Hanafi calculation, so the reminder matches the way you were taught to pray.

## Your location stays with you

Many prayer apps ask you to create an account, then send your location to a server every day to fetch a timetable. Muslimtify has no account, no advertising and no tracking. It does the calculation on your own computer, using the position of the sun for your location and date.

To do that it needs to know roughly where you are, and you decide how it finds out. It can estimate your city from your internet connection, which is the easiest option and the only time Muslimtify contacts the internet. You can type in your coordinates yourself. Or, if your computer has a GPS receiver, it can read your position from that.

With the second or third option, Muslimtify never contacts the internet at all. It keeps reminding you on a plane, in a village with a weak signal, or on a day when your connection is down.

## Small details that matter in daily life

A reminder is only useful if you can trust it, so a lot of the work went into the situations where prayer apps usually go wrong.

When your laptop wakes up from sleep, Muslimtify checks what it missed. If a prayer time passed within the last 15 minutes, you still get the notification. If you closed the lid for the whole afternoon, it stays quiet about the prayers that are long past, so you are not greeted by three adhans playing one after another.

When the clocks change for daylight saving, the prayer times follow automatically. When you travel, Muslimtify can re-check your location and adjust.

In places and seasons where a prayer time cannot be calculated, such as far northern cities in summer, Muslimtify does not invent a time for it.

If your mosque calls the adhan a few minutes earlier or later than the calculation, you can shift any prayer by a few minutes so the two agree. You can also choose how times are shown, either as 4:35 PM or as 16:35.

## How to get it

Muslimtify is free. On Windows, download the installer from the [releases page](https://github.com/muslimtify-org/muslimtify/releases/latest) and run it, or use winget:

```powershell
winget install muslimtify
```

On Linux it is available for the most common distributions:

```bash
# Arch Linux
yay -S muslimtify

# Fedora
sudo dnf copr enable rizukirr/muslimtify
sudo dnf install muslimtify

# Ubuntu and Debian
sudo add-apt-repository ppa:rizukirr/muslimtify
sudo apt update
sudo apt install muslimtify
```

After installing, turn on the background reminders:

```bash
muslimtify daemon install
```

Then check that the schedule looks right for your city:

```bash
muslimtify show
```

That command prints today's prayer times. If they match your local mosque, you are done. To see and hear what a reminder looks like without waiting for the next prayer, send yourself a test:

```bash
muslimtify notification test --adhan
```

From here on Muslimtify reminds you by itself.

I should be honest about one thing. Today Muslimtify is set up by typing short commands like the ones above, because it does not have a settings window yet. If you have never opened a terminal, ask a friend or family member who has, and it will take them about five minutes. A proper graphical app is the next big thing I am working on. Linux users on Omarchy already have a taste of it: a [plugin](https://github.com/muslimtify-org/muslimtify-omarchy) also on [Hyprsimple](https://github.com/rizukirr/hyprsimple), shows the next prayer on the bar at the top of the screen, and clicking it opens today's schedule and every setting.

A few commands you may want later:

```bash
muslimtify show --next                             # which prayer is next, and how long until it
muslimtify location set --auto                     # find my location again
muslimtify method --auto                           # pick the standard for my country
muslimtify madzhab hanafi                          # use the Hanafi time for Asr
muslimtify notification --reminder --all 15 5      # remind me 15 and 5 minutes before every prayer
muslimtify notification --reminder fajr 45 20 5    # different reminders for Fajr only
muslimtify notification --adhan set ~/adhan.mp3    # use my own adhan recording
muslimtify notification --adhan disable fajr       # no adhan sound at Fajr
muslimtify notification --adhan stop               # stop an adhan that is playing now
muslimtify offset fajr +4                          # move Fajr 4 minutes later to match my mosque
muslimtify timeformat 12                           # show 4:35 PM instead of 16:35
```

The full guide, with every command explained, is at [muslimtify.org](https://www.muslimtify.org).

## What is coming next

Muslimtify is still growing. I am working on a graphical app so that nobody needs the terminal, and on a Flatpak package for easier installation on any Linux system. Further ahead I want to bring it to macOS, to wearable devices, and to small standalone devices such as a prayer clock for the home.

macOS is waiting on one thing: we do not have a Mac to build and test on. If you have one and you know C, your help would bring Muslimtify to many more people.

## For the curious: how it is built

This last part is for readers who like to know what is inside. You can skip it and still use Muslimtify every day.

Muslimtify is written in standard C11 with no compiler extensions, and it builds with GCC, Clang and Microsoft's compiler. The whole program is one small native binary with two runtime dependencies on Linux, libnotify for the notifications and libcurl for the optional location lookup. It does not bundle a browser engine or a language runtime, so it starts instantly and uses almost no memory or battery while it waits.

The prayer times come from astronomy. Given a latitude, longitude, date and time zone, the engine computes the position of the sun and derives each prayer from it: the sun's angle below the horizon for Fajr and Isha, its highest point for Dhuhr, the length of a shadow for Asr, and sunset for Maghrib. Each of the 21 standards is a different set of angles and adjustments applied to the same formulas. The results are tested against reference timetables, with a tolerance of about two minutes, which is the margin the authorities themselves consider acceptable.

That engine grew important enough to live on its own. It is now [libmuslim](https://github.com/muslimtify-org/libmuslim), a portable header-only C library that any developer can drop into their own project. It also converts between Gregorian and Hijri dates, and it has official bindings for Rust and for Dart and Flutter, so the same calculation can power a phone app. Muslimtify is its first user, and I hope other apps for Muslims will follow.

The background service is a single long-running loop that wakes up once a minute, compares the clock with today's schedule, and goes back to sleep. On Linux it runs as a systemd user service, and on Windows as a native background service. Both call the same core code. The adhan is played by a small audio engine built into the program, so it needs no media player. Everything specific to an operating system sits behind a small interface with one implementation per platform, so the logic that decides when to notify you is identical on both.

The same approach covers the rest of the system. Notifications use libnotify on Linux and native WinRT toasts on Windows. GPS on Linux talks to gpsd over a local socket, with no extra library needed at build time, and on Windows it uses the built-in location service. Time zones are stored by their IANA name, such as Asia/Jakarta, and the offset is worked out for the exact date being calculated, which is how daylight saving stays correct.

The commands that show information can also print it as JSON or as plain key and value pairs. That is how the Omarchy plugin and a Waybar module show the next prayer on a Linux desktop bar, and it lets anyone build their own widget on top.

Reliability gets the same attention as features. The project has 18 test suites covering the calculation, configuration, scheduling and notification logic. Every change is built and tested automatically with three compilers on Linux and Windows, and development builds run with memory and undefined-behaviour checkers switched on. Releases ship for x86_64 and ARM64 on both operating systems, with checksums you can verify.

## Open source, and yours to share

Muslimtify is open source under the MIT License. Anyone can read the code, check what it does with their location, and improve it. The code lives at [github.com/muslimtify-org/muslimtify](https://github.com/muslimtify-org/muslimtify) and the documentation at [muslimtify.org](https://www.muslimtify.org).

If Muslimtify helps you catch a prayer you would have missed, please share it with someone who spends their day at a computer. If something does not work, tell me through GitHub Issues. And if you can write code, translate, or test on a device I do not own, you are welcome to join.

May Allah make it easy for all of us to pray on time.
