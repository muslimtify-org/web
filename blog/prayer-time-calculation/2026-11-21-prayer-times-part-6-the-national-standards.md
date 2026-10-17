---
slug: prayer-times-part-6-the-national-standards
title: "Prayer times, part 6: the national standards"
authors:
  - rizukirr
tags: [muslimtify, prayer-time-calculation]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

{/*
  REVIEW NOTES (not rendered):
  - The Python, TypeScript, Rust and C programs print a 21 by 5 table for Jakarta on
    2026-10-17 that is identical, cell for cell, to libmuslim's calculate_prayer_times
    output. Go, Kotlin and Dart were NOT run.
  - The method parameters come from libmuslim's METHOD_TABLE and match
    docs/calculation-methods.md. The historical notes are marked VERIFY. Sources consulted:
    Hisabuna and El-Falaky journals (UIN Alauddin) on Djambek and the 20 degree criterion;
    Kompas TV reports on Kemenag's December 2020 statement and Muhammadiyah's change to
    18 degrees; praytimes.org on Umm al-Qura's 19 to 18.5 degree change in December 2008;
    the International Astronomical Center on ISNA and the Fiqh Council of North America;
    sorularlaislamiyet.com and praytimes.net documents on Diyanet's temkin history.
*/}

Muslimtify ships 21 calculation methods. [Part 4](/blog/prayer-times-part-4-fajr-isha-and-the-twilight-angles) looked at seven of them through their Fajr and Isha angles. This part goes through the whole table, region by region, and looks at the things a national standard adds *on top of* the angles: minutes added after sunset, Isha set by the clock instead of the sky, precaution margins, rounding rules, and the corrections Muslimtify deliberately does not copy.

By the end, the code can print the complete timetable for any of the 21 standards, and it matches the production library in every cell.

{/* truncate */}

:::info[This is part 6 of a series]
Parts [1](/blog/prayer-times-part-1-what-the-quran-and-sunnah-say) to [5](/blog/prayer-times-part-5-asr-and-the-shadow) built the five prayer times from the texts up. This part is about what each country does with them. Part 7, the last, covers the far north where the formula runs out, the clock, and the complete program tested against libmuslim for a whole year. The full series is under the [prayer time calculation](/blog/tags/prayer-time-calculation) tag.
:::

## Three kinds of parameter

Every method in Muslimtify is described by five numbers, and they are not all the same kind of thing.

The **Fajr and Isha angles** are observations. Someone stood outside and judged when the true dawn appeared or the twilight faded, and part 4 told that story.

The **clock rules** are conventions. Four authorities define Isha as a fixed number of minutes after Maghrib rather than by an angle, and two add a few minutes to Maghrib itself after sunset. Neither is an astronomical claim. They are decisions about how to publish a timetable that is simple and never early.

The **precaution** is fiqh. Kemenag adds two minutes to every prayer, Jordan adds five, and Kemenag's tables round every time up to the next whole minute. Part 1 traced this to the hadith "leave what makes you doubt".

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 800 200" role="img" aria-label="Five boxes in a row showing how a Maghrib time is produced: astronomy gives sunset at 17:45:28, the method adds no offset, ihtiyat adds two minutes to give 17:47:28, rounding up gives 17:48, and 17:48 is printed" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<defs><marker id="pipe" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="currentColor" /></marker></defs>
<rect x="10.0" y="50" width="132" height="84" rx="8" fill="none" fillOpacity="1" stroke="currentColor" strokeWidth="1.5" />
<text x="76.0" y="72" textAnchor="middle" fill="currentColor" fontWeight="600">astronomy</text>
<text x="76.0" y="92" textAnchor="middle" fill="currentColor" fontSize="11">sunset</text>
<text x="76.0" y="118" textAnchor="middle" fill="var(--ifm-color-primary)" fontWeight="600" fontSize="15">17:45:28</text>
<line x1="145.0" y1="92.0" x2="169.0" y2="92.0" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#pipe)" />
<rect x="172.0" y="50" width="132" height="84" rx="8" fill="none" fillOpacity="1" stroke="currentColor" strokeWidth="1.5" />
<text x="238.0" y="72" textAnchor="middle" fill="currentColor" fontWeight="600">method offset</text>
<text x="238.0" y="92" textAnchor="middle" fill="currentColor" fontSize="11">+0 min</text>
<text x="238.0" y="118" textAnchor="middle" fill="var(--ifm-color-primary)" fontWeight="600" fontSize="15">17:45:28</text>
<line x1="307.0" y1="92.0" x2="331.0" y2="92.0" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#pipe)" />
<rect x="334.0" y="50" width="132" height="84" rx="8" fill="none" fillOpacity="1" stroke="currentColor" strokeWidth="1.5" />
<text x="400.0" y="72" textAnchor="middle" fill="currentColor" fontWeight="600">ihtiyat</text>
<text x="400.0" y="92" textAnchor="middle" fill="currentColor" fontSize="11">+2 min</text>
<text x="400.0" y="118" textAnchor="middle" fill="var(--ifm-color-primary)" fontWeight="600" fontSize="15">17:47:28</text>
<line x1="469.0" y1="92.0" x2="493.0" y2="92.0" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#pipe)" />
<rect x="496.0" y="50" width="132" height="84" rx="8" fill="none" fillOpacity="1" stroke="currentColor" strokeWidth="1.5" />
<text x="562.0" y="72" textAnchor="middle" fill="currentColor" fontWeight="600">round up</text>
<text x="562.0" y="92" textAnchor="middle" fill="currentColor" fontSize="11">next minute</text>
<text x="562.0" y="118" textAnchor="middle" fill="var(--ifm-color-primary)" fontWeight="600" fontSize="15">17:48</text>
<line x1="631.0" y1="92.0" x2="655.0" y2="92.0" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#pipe)" />
<rect x="658.0" y="50" width="132" height="84" rx="8" fill="var(--ifm-color-primary)" fillOpacity="0.15" stroke="var(--ifm-color-primary)" strokeWidth="1.5" />
<text x="724.0" y="72" textAnchor="middle" fill="currentColor" fontWeight="600">printed</text>
<text x="724.0" y="92" textAnchor="middle" fill="currentColor" fontSize="11">Maghrib</text>
<text x="724.0" y="118" textAnchor="middle" fill="var(--ifm-color-primary)" fontWeight="600" fontSize="15">17:48</text>
<text x="400.0" y="174" textAnchor="middle" fill="currentColor">Kemenag, Jakarta, 17 October 2026. Only the first box is astronomy. The rest is the standard.</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>What a national standard adds on top of the formula. For Kemenag that is two minutes of precaution and rounding up. For Portugal the second box would add three minutes to Maghrib, and for Jordan the third box would add five.</figcaption>
</figure>

The table, in the order libmuslim keeps it:

| Key | Authority | Fajr | Isha | Maghrib offset | Ihtiyat |
| --- | --- | --- | --- | --- | --- |
| `mwl` | Muslim World League | 18° | 17° | | |
| `makkah` | Umm al-Qura, Makkah | 18.5° | 90 min | | |
| `isna` | ISNA, North America | 15° | 15° | | |
| `egypt` | Egyptian General Authority of Survey | 19.5° | 17.5° | | |
| `karachi` | University of Islamic Sciences, Karachi | 18° | 18° | | |
| `turkey` | Diyanet, Turkey | 18° | 17° | | |
| `singapore` | MUIS, Singapore | 20° | 18° | | |
| `jakim` | JAKIM, Malaysia | 20° | 18° | | |
| `kemenag` | Kemenag, Indonesia | 20° | 18° | | +2 min |
| `france` | UOIF, France | 12° | 12° | | |
| `russia` | Spiritual Administration of Muslims, Russia | 16° | 15° | | |
| `dubai` | GAIAE, Dubai | 18.2° | 18.2° | | |
| `qatar` | Ministry of Awqaf, Qatar | 18° | 90 min | | |
| `kuwait` | Ministry of Awqaf, Kuwait | 18° | 17.5° | | |
| `jordan` | Ministry of Awqaf, Jordan | 18° | 18° | | +5 min |
| `gulf` | Gulf region | 19.5° | 90 min | | |
| `tunisia` | Ministry of Religious Affairs, Tunisia | 18° | 18° | | |
| `algeria` | Ministry of Religious Affairs, Algeria | 18° | 17° | | |
| `morocco` | Ministry of Habous, Morocco | 19° | 17° | | |
| `portugal` | Comunidade Islamica de Lisboa | 18° | 77 min | +3 min | |
| `moonsighting` | Moonsighting Committee | 18° | 18° | +3 min | |

Asr is not in the table because it is not part of any method. It is the madhhab setting from part 5.

## Region by region

### Indonesia, Malaysia and Singapore

Kemenag, JAKIM and MUIS share the same angles, 20° for Fajr and 18° for Isha, which makes sense for three neighbours under the same humid equatorial sky. The 20° dawn criterion originates with Saadoeddin Djambek, the Indonesian falak scholar, and Kemenag has used it ever since. {/* VERIFY: Djambek's dates and the publication where he proposed it */}

It is also the most argued-over number in the table. In December 2020 Muhammadiyah's Tarjih council decided to move its own criterion to 18°, which makes Subuh about eight minutes later. Kemenag replied the same month that 20° stands, citing dawn observations by its own falak team at Labuan Bajo in 2018 and by Nahdlatul Ulama researchers at Banyuwangi. Indonesian academic studies since have reported observed values anywhere from 13° to 20° depending on site and technique. So an Indonesian reader may find two timetables on the same street that differ by eight minutes at Fajr, both produced by careful people. {/* VERIFY: Kompas TV reports of December 2020 */}

What Kemenag adds on top: two minutes of *ihtiyat* on every prayer, and rounding up to the next whole minute. In Muslimtify's table JAKIM and MUIS carry no ihtiyat, so a Malaysian or Singaporean timetable from the same angles prints a minute or two earlier than Kemenag's.

### The Arabian Peninsula

Umm al-Qura is the official Saudi calendar. Fajr was 19° until December 2008 and 18.5° since. Isha is not an angle at all but 90 minutes after Maghrib, and in the official calendar that becomes 120 minutes during Ramadan. Muslimtify uses 90 all year, so during Ramadan its `makkah` Isha is half an hour before the printed Saudi one. That is intentional. The Ramadan rule is a calendar policy, not a change in the sky, and Muslimtify does not currently know which days are Ramadan. {/* VERIFY: praytimes.org note on the 2008 change */}

Qatar (18°, 90 minutes) and the general Gulf method (19.5°, 90 minutes) follow the same clock-based Isha. Kuwait uses angles, 18° and 17.5°. Dubai's GAIAE uses 18.2° for both, a number precise enough to suggest it was fitted to something, and the official UAE tables also carry small per-prayer rounding offsets that Muslimtify does not apply.

Jordan is the other authority with a precaution margin, and it is a generous one: five minutes on every prayer. Note that it applies to the whole schedule. It is not a Maghrib-only offset like Portugal's.

### Egypt, North Africa and the Levant

The Egyptian General Authority of Survey publishes one of the oldest national standards, 19.5° for Fajr and 17.5° for Isha, and al-Azhar follows it. The 17.5° is tied to the disappearance of the red twilight. Egypt's Fajr angle is the deepest in the table after the three Southeast Asian authorities, which is why Egyptian Fajr in Jakarta comes out within a minute of Kemenag's. {/* VERIFY: the origin of the Egyptian figures is not well documented */}

Tunisia uses 18° and 18°. Algeria uses 18° and 17°. Morocco uses 19° and 17°, and the Ministry of Habous then adjusts the official times city by city by hand, which Muslimtify does not reproduce.

### Turkey

Diyanet uses 18° and 17°, the same angles as the Muslim World League. What makes Turkish timetables differ from a plain calculation is *temkin*, a precaution margin that Diyanet applies prayer by prayer. The margins have been revised several times since the 1980s, when the dawn angle was also changed from 19° to 18° and the margin on imsak was removed, and the exact minutes in force today are best read from the official Diyanet calendar. Muslimtify applies no temkin, so expect its `turkey` times to sit a few minutes off the printed Turkish ones. {/* VERIFY: temkin history, sorularlaislamiyet and praytimes.net documents */}

### South Asia

The University of Islamic Sciences in Karachi uses 18° for both prayers. The 18° Isha follows the Hanafi position that the white twilight must also disappear, and readers in Pakistan, India and Bangladesh will usually pair this method with the Hanafi Asr from part 5. Both settings are independent in Muslimtify, so that pairing is a choice, not a default.

### Europe, Russia and North America

The Muslim World League's 18° and 17° is the closest thing to a worldwide default. It is what most apps fall back to when they do not know where you are, and it is used across much of Europe and East Asia.

ISNA's 15° and 15° has been the North American convention for decades. Around 2010 the Fiqh Council of North America discussed moving to 18°, and reports after that disagree about what was finally adopted, so many communities on the continent now use 18° or 17.5° while apps still label 15° as "ISNA". The Spiritual Administration of Muslims of Russia uses 16° and 15°, a shallower pair suited to a country where 18° is unreachable for much of the summer. {/* VERIFY: International Astronomical Center exchanges with ISNA, 2010 and 2012 */}

France's 12° and 12° is the shallowest in the table. At 18° there is no Fajr at all in France for weeks around midsummer, and the French federation (then UOIF, now Musulmans de France) chose 12° so that a timetable could be published at all. When and how it was adopted is not well documented. {/* VERIFY */}

Two methods add minutes to Maghrib. The Lisbon community uses 18° for Fajr, three minutes after sunset for Maghrib, and 77 minutes after that for Isha. The Moonsighting Committee uses 18° for both twilight prayers and the same three minutes on Maghrib. The committee's real method is more elaborate than that: it uses seasonal, latitude-dependent functions and several *shafaq* modes. Muslimtify keeps only the 18° baseline, so its `moonsighting` is an approximation of the committee's tables, not a reproduction.

## What Muslimtify leaves out, on purpose

Reading the sections above, you can list the things an official timetable may contain that the code in this series does not: Umm al-Qura's Ramadan interval, Diyanet's temkin, Dubai's rounding offsets, Morocco's per-city adjustments, the Moonsighting Committee's seasonal curves. The [calculation methods page](/docs/calculation-methods#simplifications-to-be-aware-of) in the docs keeps the current list.

There is a principle behind leaving them out. Each method in Muslimtify is the authority's own published angles and rules, nothing more. Where an authority applies an adjustment that depends on the calendar, the city, or an unpublished table, copying a guess would mean attributing a ruling to that authority that it never issued in that form. When your mosque's printed table differs from Muslimtify by a fixed minute or two, the [per-prayer offset](/docs/configuration#prayers-and-offsets) in the configuration is the honest tool: you are matching your mosque, and the method stays what the authority said.

## Why the angles cluster

Fourteen of the twenty-one methods put Fajr within one degree of 18°. That is not a coincidence or copying. Eighteen degrees is the astronomers' end of twilight, the depth at which the sky is as dark as it gets, and the true dawn is the first light after that darkness, so every careful observer lands near it. The spread from 18° to 20° is the different skies of part 4. The methods that sit far from the cluster, ISNA at 15°, Russia at 16°, France at 12°, are the ones that chose a shallower angle for practical reasons at high latitudes.

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 760 500" role="img" aria-label="A scatter plot of the 21 calculation methods by Fajr angle (12 to 20 degrees) against Isha angle (12 to 18.2 degrees), with most methods clustered at 18 degrees Fajr and 17 to 18 degrees Isha, and the four interval-based methods on a separate strip" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<line x1="80.0" y1="40" x2="80.0" y2="330" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="80.0" y="348" textAnchor="middle" fill="currentColor">11°</text>
<line x1="144.0" y1="40" x2="144.0" y2="330" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="144.0" y="348" textAnchor="middle" fill="currentColor">12°</text>
<line x1="208.0" y1="40" x2="208.0" y2="330" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="208.0" y="348" textAnchor="middle" fill="currentColor">13°</text>
<line x1="272.0" y1="40" x2="272.0" y2="330" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="272.0" y="348" textAnchor="middle" fill="currentColor">14°</text>
<line x1="336.0" y1="40" x2="336.0" y2="330" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="336.0" y="348" textAnchor="middle" fill="currentColor">15°</text>
<line x1="400.0" y1="40" x2="400.0" y2="330" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="400.0" y="348" textAnchor="middle" fill="currentColor">16°</text>
<line x1="464.0" y1="40" x2="464.0" y2="330" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="464.0" y="348" textAnchor="middle" fill="currentColor">17°</text>
<line x1="528.0" y1="40" x2="528.0" y2="330" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="528.0" y="348" textAnchor="middle" fill="currentColor">18°</text>
<line x1="592.0" y1="40" x2="592.0" y2="330" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="592.0" y="348" textAnchor="middle" fill="currentColor">19°</text>
<line x1="656.0" y1="40" x2="656.0" y2="330" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="656.0" y="348" textAnchor="middle" fill="currentColor">20°</text>
<line x1="720.0" y1="40" x2="720.0" y2="330" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="720.0" y="348" textAnchor="middle" fill="currentColor">21°</text>
<line x1="80" y1="330.0" x2="720" y2="330.0" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="72" y="334.0" textAnchor="end" fill="currentColor">11°</text>
<line x1="80" y1="293.8" x2="720" y2="293.8" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="72" y="297.8" textAnchor="end" fill="currentColor">12°</text>
<line x1="80" y1="257.5" x2="720" y2="257.5" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="72" y="261.5" textAnchor="end" fill="currentColor">13°</text>
<line x1="80" y1="221.2" x2="720" y2="221.2" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="72" y="225.2" textAnchor="end" fill="currentColor">14°</text>
<line x1="80" y1="185.0" x2="720" y2="185.0" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="72" y="189.0" textAnchor="end" fill="currentColor">15°</text>
<line x1="80" y1="148.8" x2="720" y2="148.8" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="72" y="152.8" textAnchor="end" fill="currentColor">16°</text>
<line x1="80" y1="112.5" x2="720" y2="112.5" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="72" y="116.5" textAnchor="end" fill="currentColor">17°</text>
<line x1="80" y1="76.2" x2="720" y2="76.2" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="72" y="80.2" textAnchor="end" fill="currentColor">18°</text>
<line x1="80" y1="40.0" x2="720" y2="40.0" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="72" y="44.0" textAnchor="end" fill="currentColor">19°</text>
<text x="400.0" y="370" textAnchor="middle" fill="currentColor">Fajr angle below the horizon</text>
<text x="72" y="26" textAnchor="end" fill="currentColor">Isha angle</text>
<circle cx="528.0" cy="112.5" r="8" fill="var(--ifm-color-primary)" fillOpacity="0.85" />
<text x="514.0" y="116.5" textAnchor="end" fill="currentColor" fontSize="11">MWL, Turkey, Algeria</text>
<circle cx="336.0" cy="185.0" r="4" fill="var(--ifm-color-primary)" fillOpacity="0.85" />
<text x="346.0" y="177.0" textAnchor="start" fill="currentColor" fontSize="11">ISNA</text>
<circle cx="624.0" cy="94.4" r="4" fill="var(--ifm-color-primary)" fillOpacity="0.85" />
<text x="634.0" y="98.4" textAnchor="start" fill="currentColor" fontSize="11">Egypt</text>
<circle cx="528.0" cy="76.2" r="10" fill="var(--ifm-color-primary)" fillOpacity="0.85" />
<text x="514.0" y="80.2" textAnchor="end" fill="currentColor" fontSize="11">Karachi, Jordan, Tunisia, Moonsighting</text>
<circle cx="656.0" cy="76.2" r="8" fill="var(--ifm-color-primary)" fillOpacity="0.85" />
<text x="656.0" y="60.2" textAnchor="middle" fill="currentColor" fontSize="11">Singapore, JAKIM, Kemenag</text>
<circle cx="144.0" cy="293.8" r="4" fill="var(--ifm-color-primary)" fillOpacity="0.85" />
<text x="154.0" y="285.8" textAnchor="start" fill="currentColor" fontSize="11">France</text>
<circle cx="400.0" cy="185.0" r="4" fill="var(--ifm-color-primary)" fillOpacity="0.85" />
<text x="410.0" y="189.0" textAnchor="start" fill="currentColor" fontSize="11">Russia</text>
<circle cx="540.8" cy="69.0" r="4" fill="var(--ifm-color-primary)" fillOpacity="0.85" />
<text x="550.8" y="83.0" textAnchor="start" fill="currentColor" fontSize="11">Dubai</text>
<circle cx="528.0" cy="94.4" r="4" fill="var(--ifm-color-primary)" fillOpacity="0.85" />
<text x="538.0" y="100.4" textAnchor="start" fill="currentColor" fontSize="11">Kuwait</text>
<circle cx="592.0" cy="112.5" r="4" fill="var(--ifm-color-primary)" fillOpacity="0.85" />
<text x="602.0" y="116.5" textAnchor="start" fill="currentColor" fontSize="11">Morocco</text>
<text x="80" y="404" fill="var(--ifm-color-primary)" fontSize="11" fontWeight="600">Isha set by the clock instead of an angle</text>
<line x1="80" y1="430" x2="720" y2="430" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" strokeDasharray="4 4" />
<circle cx="560.0" cy="430" r="4" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2" />
<circle cx="528.0" cy="430" r="4" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2" />
<circle cx="624.0" cy="430" r="4" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2" />
<circle cx="528.0" cy="430" r="4" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2" />
<text x="528.0" y="418" textAnchor="middle" fill="currentColor" fontSize="11">Qatar 90 min, Portugal 77 min</text>
<text x="560.0" y="452" textAnchor="middle" fill="currentColor" fontSize="11">Makkah 90 min</text>
<text x="634.0" y="434" textAnchor="start" fill="currentColor" fontSize="11">Gulf 90 min</text>
<text x="400.0" y="490" textAnchor="middle" fill="currentColor" fontSize="11">Larger dots are several authorities sharing the same pair of angles.</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>All 21 standards Muslimtify ships, placed by their two angles. Fourteen of them sit within one degree of 18° for Fajr. The outliers are decisions, not observations: ISNA and Russia at 15° to 16°, France at 12°, and the four Gulf and Portuguese authorities that define Isha by the clock instead of the sky.</figcaption>
</figure>

Isha clusters the same way between 17° and 18°, with the red-or-white twilight question of part 1 deciding which side of 17.5° an authority falls on.

## The code

Add this to the file from part 5. It replaces the seven-method table from part 4 with all twenty-one, adds the Maghrib offset, and assembles the five prayers into one `prayer_times` function that applies the method's offsets and precaution. Rounding up happens when printing, as before.

<Tabs groupId="lang" queryString>
  <TabItem value="python" label="Python" default>

```python
METHODS = {
    #  key              fajr  isha  isha interval  maghrib offset  ihtiyat   (angles in degrees, the rest in minutes)
    "mwl":          dict(fajr=18.0, isha=17.0, interval=0,  maghrib=0, ihtiyat=0),
    "makkah":       dict(fajr=18.5, isha=0.0,  interval=90, maghrib=0, ihtiyat=0),
    "isna":         dict(fajr=15.0, isha=15.0, interval=0,  maghrib=0, ihtiyat=0),
    "egypt":        dict(fajr=19.5, isha=17.5, interval=0,  maghrib=0, ihtiyat=0),
    "karachi":      dict(fajr=18.0, isha=18.0, interval=0,  maghrib=0, ihtiyat=0),
    "turkey":       dict(fajr=18.0, isha=17.0, interval=0,  maghrib=0, ihtiyat=0),
    "singapore":    dict(fajr=20.0, isha=18.0, interval=0,  maghrib=0, ihtiyat=0),
    "jakim":        dict(fajr=20.0, isha=18.0, interval=0,  maghrib=0, ihtiyat=0),
    "kemenag":      dict(fajr=20.0, isha=18.0, interval=0,  maghrib=0, ihtiyat=2),
    "france":       dict(fajr=12.0, isha=12.0, interval=0,  maghrib=0, ihtiyat=0),
    "russia":       dict(fajr=16.0, isha=15.0, interval=0,  maghrib=0, ihtiyat=0),
    "dubai":        dict(fajr=18.2, isha=18.2, interval=0,  maghrib=0, ihtiyat=0),
    "qatar":        dict(fajr=18.0, isha=0.0,  interval=90, maghrib=0, ihtiyat=0),
    "kuwait":       dict(fajr=18.0, isha=17.5, interval=0,  maghrib=0, ihtiyat=0),
    "jordan":       dict(fajr=18.0, isha=18.0, interval=0,  maghrib=0, ihtiyat=5),
    "gulf":         dict(fajr=19.5, isha=0.0,  interval=90, maghrib=0, ihtiyat=0),
    "tunisia":      dict(fajr=18.0, isha=18.0, interval=0,  maghrib=0, ihtiyat=0),
    "algeria":      dict(fajr=18.0, isha=17.0, interval=0,  maghrib=0, ihtiyat=0),
    "morocco":      dict(fajr=19.0, isha=17.0, interval=0,  maghrib=0, ihtiyat=0),
    "portugal":     dict(fajr=18.0, isha=0.0,  interval=77, maghrib=3, ihtiyat=0),
    "moonsighting": dict(fajr=18.0, isha=18.0, interval=0,  maghrib=3, ihtiyat=0),
}

def prayer_times(year, month, day, latitude, longitude, timezone, method, shadow_factor=1):
    """The five prayer times as local clock hours, with the method's offsets and precaution applied."""
    jd = julian_day(year, month, day)
    sunset = sun_event(jd, latitude, longitude, timezone, SUNRISE_ALTITUDE, +1)
    maghrib = None if sunset is None else sunset + method["maghrib"] / 60
    if method["interval"]:
        isha = None if maghrib is None else maghrib + method["interval"] / 60
    else:
        isha = sun_event(jd, latitude, longitude, timezone, -method["isha"], +1)
    times = {
        "fajr": sun_event(jd, latitude, longitude, timezone, -method["fajr"], -1),
        "dhuhr": solar_noon(jd, longitude, timezone),
        "asr": asr(jd, latitude, longitude, timezone, shadow_factor),
        "maghrib": maghrib,
        "isha": isha,
    }
    return {name: None if t is None else t + method["ihtiyat"] / 60 for name, t in times.items()}

if __name__ == "__main__":
    print("method        fajr   dhuhr  asr    maghrib isha")
    for key, method in METHODS.items():
        t = prayer_times(2026, 10, 17, -6.2088, 106.8456, 7, method)  # Jakarta, WIB
        print(f"{key:<13} {hm(t['fajr'], round_up=True)}  {hm(t['dhuhr'], round_up=True)}  {hm(t['asr'], round_up=True)}  "
              f"{hm(t['maghrib'], round_up=True)}  {hm(t['isha'], round_up=True)}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
type Method = { fajr: number; isha: number; interval: number; maghrib: number; ihtiyat: number };

// angles in degrees, the rest in minutes
const METHODS: Record<string, Method> = {
  mwl:          { fajr: 18.0, isha: 17.0, interval: 0,  maghrib: 0, ihtiyat: 0 },
  makkah:       { fajr: 18.5, isha: 0.0,  interval: 90, maghrib: 0, ihtiyat: 0 },
  isna:         { fajr: 15.0, isha: 15.0, interval: 0,  maghrib: 0, ihtiyat: 0 },
  egypt:        { fajr: 19.5, isha: 17.5, interval: 0,  maghrib: 0, ihtiyat: 0 },
  karachi:      { fajr: 18.0, isha: 18.0, interval: 0,  maghrib: 0, ihtiyat: 0 },
  turkey:       { fajr: 18.0, isha: 17.0, interval: 0,  maghrib: 0, ihtiyat: 0 },
  singapore:    { fajr: 20.0, isha: 18.0, interval: 0,  maghrib: 0, ihtiyat: 0 },
  jakim:        { fajr: 20.0, isha: 18.0, interval: 0,  maghrib: 0, ihtiyat: 0 },
  kemenag:      { fajr: 20.0, isha: 18.0, interval: 0,  maghrib: 0, ihtiyat: 2 },
  france:       { fajr: 12.0, isha: 12.0, interval: 0,  maghrib: 0, ihtiyat: 0 },
  russia:       { fajr: 16.0, isha: 15.0, interval: 0,  maghrib: 0, ihtiyat: 0 },
  dubai:        { fajr: 18.2, isha: 18.2, interval: 0,  maghrib: 0, ihtiyat: 0 },
  qatar:        { fajr: 18.0, isha: 0.0,  interval: 90, maghrib: 0, ihtiyat: 0 },
  kuwait:       { fajr: 18.0, isha: 17.5, interval: 0,  maghrib: 0, ihtiyat: 0 },
  jordan:       { fajr: 18.0, isha: 18.0, interval: 0,  maghrib: 0, ihtiyat: 5 },
  gulf:         { fajr: 19.5, isha: 0.0,  interval: 90, maghrib: 0, ihtiyat: 0 },
  tunisia:      { fajr: 18.0, isha: 18.0, interval: 0,  maghrib: 0, ihtiyat: 0 },
  algeria:      { fajr: 18.0, isha: 17.0, interval: 0,  maghrib: 0, ihtiyat: 0 },
  morocco:      { fajr: 19.0, isha: 17.0, interval: 0,  maghrib: 0, ihtiyat: 0 },
  portugal:     { fajr: 18.0, isha: 0.0,  interval: 77, maghrib: 3, ihtiyat: 0 },
  moonsighting: { fajr: 18.0, isha: 18.0, interval: 0,  maghrib: 3, ihtiyat: 0 },
};

type Times = { fajr: number | null; dhuhr: number | null; asr: number | null; maghrib: number | null; isha: number | null };

/** The five prayer times as local clock hours, with the method's offsets and precaution applied. */
function prayerTimes(year: number, month: number, day: number, lat: number, lon: number, tz: number, m: Method, shadowFactor = 1): Times {
  const jd = julianDay(year, month, day);
  const sunset = sunEvent(jd, lat, lon, tz, SUNRISE_ALTITUDE, 1);
  const maghrib = sunset === null ? null : sunset + m.maghrib / 60;
  const isha = m.interval ? (maghrib === null ? null : maghrib + m.interval / 60) : sunEvent(jd, lat, lon, tz, -m.isha, 1);
  const times: Times = {
    fajr: sunEvent(jd, lat, lon, tz, -m.fajr, -1),
    dhuhr: solarNoon(jd, lon, tz),
    asr: asr(jd, lat, lon, tz, shadowFactor),
    maghrib,
    isha,
  };
  const precaution = (t: number | null) => (t === null ? null : t + m.ihtiyat / 60);
  return { fajr: precaution(times.fajr), dhuhr: precaution(times.dhuhr), asr: precaution(times.asr), maghrib: precaution(times.maghrib), isha: precaution(times.isha) };
}

console.log("method        fajr   dhuhr  asr    maghrib isha");
for (const [key, m] of Object.entries(METHODS)) {
  const t = prayerTimes(2026, 10, 17, -6.2088, 106.8456, 7, m); // Jakarta, WIB
  console.log(`${key.padEnd(13)} ${hm(t.fajr, true)}  ${hm(t.dhuhr, true)}  ${hm(t.asr, true)}  ${hm(t.maghrib, true)}  ${hm(t.isha, true)}`);
}
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
type Method struct {
	Fajr, Isha float64 // degrees below the horizon
	Interval   float64 // isha, minutes after maghrib, 0 to use the angle
	Maghrib    float64 // minutes added after sunset
	Ihtiyat    float64 // precaution minutes added to every time
}

var methodOrder = []string{"mwl", "makkah", "isna", "egypt", "karachi", "turkey", "singapore", "jakim", "kemenag", "france",
	"russia", "dubai", "qatar", "kuwait", "jordan", "gulf", "tunisia", "algeria", "morocco", "portugal", "moonsighting"}

var methods = map[string]Method{
	"mwl":          {18.0, 17.0, 0, 0, 0},
	"makkah":       {18.5, 0.0, 90, 0, 0},
	"isna":         {15.0, 15.0, 0, 0, 0},
	"egypt":        {19.5, 17.5, 0, 0, 0},
	"karachi":      {18.0, 18.0, 0, 0, 0},
	"turkey":       {18.0, 17.0, 0, 0, 0},
	"singapore":    {20.0, 18.0, 0, 0, 0},
	"jakim":        {20.0, 18.0, 0, 0, 0},
	"kemenag":      {20.0, 18.0, 0, 0, 2},
	"france":       {12.0, 12.0, 0, 0, 0},
	"russia":       {16.0, 15.0, 0, 0, 0},
	"dubai":        {18.2, 18.2, 0, 0, 0},
	"qatar":        {18.0, 0.0, 90, 0, 0},
	"kuwait":       {18.0, 17.5, 0, 0, 0},
	"jordan":       {18.0, 18.0, 0, 0, 5},
	"gulf":         {19.5, 0.0, 90, 0, 0},
	"tunisia":      {18.0, 18.0, 0, 0, 0},
	"algeria":      {18.0, 17.0, 0, 0, 0},
	"morocco":      {19.0, 17.0, 0, 0, 0},
	"portugal":     {18.0, 0.0, 77, 3, 0},
	"moonsighting": {18.0, 18.0, 0, 3, 0},
}

// Times holds the five prayer times as local clock hours; the matching Ok flag is false when a time does not exist.
type Times struct {
	Fajr, Dhuhr, Asr, Maghrib, Isha float64
	Ok                              [5]bool
}

// prayerTimes returns the five prayer times with the method's offsets and precaution applied.
func prayerTimes(year, month, day int, lat, lon, tz float64, m Method, shadowFactor float64) Times {
	jd := julianDay(year, month, day)
	fajr, fajrOk := sunEvent(jd, lat, lon, tz, -m.Fajr, -1)
	asrT, asrOk := asr(jd, lat, lon, tz, shadowFactor)
	sunset, maghribOk := sunEvent(jd, lat, lon, tz, sunriseAltitude, 1)
	maghrib := sunset + m.Maghrib/60
	var isha float64
	ishaOk := maghribOk
	if m.Interval > 0 {
		isha = maghrib + m.Interval/60
	} else {
		isha, ishaOk = sunEvent(jd, lat, lon, tz, -m.Isha, 1)
	}
	iht := m.Ihtiyat / 60
	return Times{fajr + iht, solarNoon(jd, lon, tz) + iht, asrT + iht, maghrib + iht, isha + iht, [5]bool{fajrOk, true, asrOk, maghribOk, ishaOk}}
}

func main() {
	fmt.Println("method        fajr   dhuhr  asr    maghrib isha")
	for _, key := range methodOrder {
		t := prayerTimes(2026, 10, 17, -6.2088, 106.8456, 7, methods[key], 1) // Jakarta, WIB
		fmt.Printf("%-13s %s  %s  %s  %s  %s\n", key, hm(t.Fajr, t.Ok[0], true), hm(t.Dhuhr, t.Ok[1], true), hm(t.Asr, t.Ok[2], true), hm(t.Maghrib, t.Ok[3], true), hm(t.Isha, t.Ok[4], true))
	}
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
struct Method { key: &'static str, fajr: f64, isha: f64, interval: f64, maghrib: f64, ihtiyat: f64 }

// angles in degrees, the rest in minutes
const METHODS: [Method; 21] = [
    Method { key: "mwl",          fajr: 18.0, isha: 17.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "makkah",       fajr: 18.5, isha: 0.0,  interval: 90.0, maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "isna",         fajr: 15.0, isha: 15.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "egypt",        fajr: 19.5, isha: 17.5, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "karachi",      fajr: 18.0, isha: 18.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "turkey",       fajr: 18.0, isha: 17.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "singapore",    fajr: 20.0, isha: 18.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "jakim",        fajr: 20.0, isha: 18.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "kemenag",      fajr: 20.0, isha: 18.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 2.0 },
    Method { key: "france",       fajr: 12.0, isha: 12.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "russia",       fajr: 16.0, isha: 15.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "dubai",        fajr: 18.2, isha: 18.2, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "qatar",        fajr: 18.0, isha: 0.0,  interval: 90.0, maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "kuwait",       fajr: 18.0, isha: 17.5, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "jordan",       fajr: 18.0, isha: 18.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 5.0 },
    Method { key: "gulf",         fajr: 19.5, isha: 0.0,  interval: 90.0, maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "tunisia",      fajr: 18.0, isha: 18.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "algeria",      fajr: 18.0, isha: 17.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "morocco",      fajr: 19.0, isha: 17.0, interval: 0.0,  maghrib: 0.0, ihtiyat: 0.0 },
    Method { key: "portugal",     fajr: 18.0, isha: 0.0,  interval: 77.0, maghrib: 3.0, ihtiyat: 0.0 },
    Method { key: "moonsighting", fajr: 18.0, isha: 18.0, interval: 0.0,  maghrib: 3.0, ihtiyat: 0.0 },
];

/// The five prayer times as local clock hours, in the order fajr, dhuhr, asr, maghrib, isha,
/// with the method's offsets and precaution applied.
fn prayer_times(year: i32, month: i32, day: i32, lat: f64, lon: f64, tz: f64, m: &Method, shadow_factor: f64) -> [Option<f64>; 5] {
    let jd = julian_day(year, month, day);
    let maghrib = sun_event(jd, lat, lon, tz, SUNRISE_ALTITUDE, 1.0).map(|sunset| sunset + m.maghrib / 60.0);
    let isha = if m.interval > 0.0 { maghrib.map(|t| t + m.interval / 60.0) } else { sun_event(jd, lat, lon, tz, -m.isha, 1.0) };
    let times = [
        sun_event(jd, lat, lon, tz, -m.fajr, -1.0),
        Some(solar_noon(jd, lon, tz)),
        asr(jd, lat, lon, tz, shadow_factor),
        maghrib,
        isha,
    ];
    times.map(|t| t.map(|t| t + m.ihtiyat / 60.0))
}

fn main() {
    println!("method        fajr   dhuhr  asr    maghrib isha");
    for m in &METHODS {
        let t = prayer_times(2026, 10, 17, -6.2088, 106.8456, 7.0, m, 1.0); // Jakarta, WIB
        println!("{:<13} {}  {}  {}  {}  {}", m.key, hm(t[0], true), hm(t[1], true), hm(t[2], true), hm(t[3], true), hm(t[4], true));
    }
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
// angles in degrees, the rest in minutes
data class Method(val fajr: Double, val isha: Double, val interval: Double = 0.0, val maghrib: Double = 0.0, val ihtiyat: Double = 0.0)

val METHODS = linkedMapOf(
    "mwl" to Method(18.0, 17.0),
    "makkah" to Method(18.5, 0.0, interval = 90.0),
    "isna" to Method(15.0, 15.0),
    "egypt" to Method(19.5, 17.5),
    "karachi" to Method(18.0, 18.0),
    "turkey" to Method(18.0, 17.0),
    "singapore" to Method(20.0, 18.0),
    "jakim" to Method(20.0, 18.0),
    "kemenag" to Method(20.0, 18.0, ihtiyat = 2.0),
    "france" to Method(12.0, 12.0),
    "russia" to Method(16.0, 15.0),
    "dubai" to Method(18.2, 18.2),
    "qatar" to Method(18.0, 0.0, interval = 90.0),
    "kuwait" to Method(18.0, 17.5),
    "jordan" to Method(18.0, 18.0, ihtiyat = 5.0),
    "gulf" to Method(19.5, 0.0, interval = 90.0),
    "tunisia" to Method(18.0, 18.0),
    "algeria" to Method(18.0, 17.0),
    "morocco" to Method(19.0, 17.0),
    "portugal" to Method(18.0, 0.0, interval = 77.0, maghrib = 3.0),
    "moonsighting" to Method(18.0, 18.0, maghrib = 3.0),
)

/** The five prayer times as local clock hours, in the order fajr, dhuhr, asr, maghrib, isha. */
fun prayerTimes(year: Int, month: Int, day: Int, lat: Double, lon: Double, tz: Double, m: Method, shadowFactor: Double = 1.0): List<Double?> {
    val jd = julianDay(year, month, day)
    val maghrib = sunEvent(jd, lat, lon, tz, SUNRISE_ALTITUDE, 1)?.plus(m.maghrib / 60)
    val isha = if (m.interval > 0) maghrib?.plus(m.interval / 60) else sunEvent(jd, lat, lon, tz, -m.isha, 1)
    val times = listOf(
        sunEvent(jd, lat, lon, tz, -m.fajr, -1),
        solarNoon(jd, lon, tz),
        asr(jd, lat, lon, tz, shadowFactor),
        maghrib,
        isha,
    )
    return times.map { it?.plus(m.ihtiyat / 60) }
}

fun main() {
    println("method        fajr   dhuhr  asr    maghrib isha")
    for ((key, m) in METHODS) {
        val t = prayerTimes(2026, 10, 17, -6.2088, 106.8456, 7.0, m) // Jakarta, WIB
        println("${key.padEnd(13)} ${t.joinToString("  ") { hm(it, true) }}")
    }
}
```

  </TabItem>
  <TabItem value="dart" label="Dart">

```dart
class Method {
  final double fajr, isha; // degrees below the horizon
  final double interval; // isha, minutes after maghrib, 0 to use the angle
  final double maghrib; // minutes added after sunset
  final double ihtiyat; // precaution minutes added to every time
  const Method(this.fajr, this.isha, {this.interval = 0, this.maghrib = 0, this.ihtiyat = 0});
}

const methods = {
  'mwl': Method(18.0, 17.0),
  'makkah': Method(18.5, 0.0, interval: 90),
  'isna': Method(15.0, 15.0),
  'egypt': Method(19.5, 17.5),
  'karachi': Method(18.0, 18.0),
  'turkey': Method(18.0, 17.0),
  'singapore': Method(20.0, 18.0),
  'jakim': Method(20.0, 18.0),
  'kemenag': Method(20.0, 18.0, ihtiyat: 2),
  'france': Method(12.0, 12.0),
  'russia': Method(16.0, 15.0),
  'dubai': Method(18.2, 18.2),
  'qatar': Method(18.0, 0.0, interval: 90),
  'kuwait': Method(18.0, 17.5),
  'jordan': Method(18.0, 18.0, ihtiyat: 5),
  'gulf': Method(19.5, 0.0, interval: 90),
  'tunisia': Method(18.0, 18.0),
  'algeria': Method(18.0, 17.0),
  'morocco': Method(19.0, 17.0),
  'portugal': Method(18.0, 0.0, interval: 77, maghrib: 3),
  'moonsighting': Method(18.0, 18.0, maghrib: 3),
};

/// The five prayer times as local clock hours, in the order fajr, dhuhr, asr, maghrib, isha.
List<double?> prayerTimes(int year, int month, int day, double lat, double lon, double tz, Method m, {double shadowFactor = 1}) {
  final jd = julianDay(year, month, day);
  final sunset = sunEvent(jd, lat, lon, tz, sunriseAltitude, 1);
  final maghrib = sunset == null ? null : sunset + m.maghrib / 60;
  final isha = m.interval > 0 ? (maghrib == null ? null : maghrib + m.interval / 60) : sunEvent(jd, lat, lon, tz, -m.isha, 1);
  final times = [
    sunEvent(jd, lat, lon, tz, -m.fajr, -1),
    solarNoon(jd, lon, tz),
    asr(jd, lat, lon, tz, shadowFactor: shadowFactor),
    maghrib,
    isha,
  ];
  return [for (final t in times) t == null ? null : t + m.ihtiyat / 60];
}

void main() {
  print('method        fajr   dhuhr  asr    maghrib isha');
  for (final entry in methods.entries) {
    final t = prayerTimes(2026, 10, 17, -6.2088, 106.8456, 7, entry.value); // Jakarta, WIB
    print('${entry.key.padRight(13)} ${t.map((x) => hm(x, roundUp: true)).join('  ')}');
  }
}
```

  </TabItem>
  <TabItem value="c" label="C">

```c
typedef struct {
    const char *key;
    double fajr;     /* degrees below the horizon */
    double isha;     /* degrees, unused when interval is set */
    double interval; /* isha, minutes after maghrib, 0 to use the angle */
    double maghrib;  /* minutes added after sunset */
    double ihtiyat;  /* precaution minutes added to every time */
} method_t;

static const method_t METHODS[] = {
    {"mwl",          18.0, 17.0, 0,  0, 0},
    {"makkah",       18.5, 0.0,  90, 0, 0},
    {"isna",         15.0, 15.0, 0,  0, 0},
    {"egypt",        19.5, 17.5, 0,  0, 0},
    {"karachi",      18.0, 18.0, 0,  0, 0},
    {"turkey",       18.0, 17.0, 0,  0, 0},
    {"singapore",    20.0, 18.0, 0,  0, 0},
    {"jakim",        20.0, 18.0, 0,  0, 0},
    {"kemenag",      20.0, 18.0, 0,  0, 2},
    {"france",       12.0, 12.0, 0,  0, 0},
    {"russia",       16.0, 15.0, 0,  0, 0},
    {"dubai",        18.2, 18.2, 0,  0, 0},
    {"qatar",        18.0, 0.0,  90, 0, 0},
    {"kuwait",       18.0, 17.5, 0,  0, 0},
    {"jordan",       18.0, 18.0, 0,  0, 5},
    {"gulf",         19.5, 0.0,  90, 0, 0},
    {"tunisia",      18.0, 18.0, 0,  0, 0},
    {"algeria",      18.0, 17.0, 0,  0, 0},
    {"morocco",      19.0, 17.0, 0,  0, 0},
    {"portugal",     18.0, 0.0,  77, 3, 0},
    {"moonsighting", 18.0, 18.0, 0,  3, 0},
};

typedef struct {
    double fajr, dhuhr, asr, maghrib, isha; /* local clock hours, NAN when unavailable */
} prayer_times_t;

/* The five prayer times with the method's offsets and precaution applied. */
static prayer_times_t prayer_times(int year, int month, int day, double lat, double lon, double tz,
                                   const method_t *m, double shadow_factor) {
    double jd = julian_day(year, month, day);
    double maghrib = sun_event(jd, lat, lon, tz, SUNRISE_ALTITUDE, 1) + m->maghrib / 60;
    double isha = m->interval > 0 ? maghrib + m->interval / 60 : sun_event(jd, lat, lon, tz, -m->isha, 1);
    double iht = m->ihtiyat / 60;
    return (prayer_times_t){
        .fajr = sun_event(jd, lat, lon, tz, -m->fajr, -1) + iht,
        .dhuhr = solar_noon(jd, lon, tz) + iht,
        .asr = asr(jd, lat, lon, tz, shadow_factor) + iht,
        .maghrib = maghrib + iht,
        .isha = isha + iht,
    };
}

int main(void) {
    printf("method        fajr   dhuhr  asr    maghrib isha\n");
    for (size_t i = 0; i < sizeof METHODS / sizeof METHODS[0]; i++) {
        prayer_times_t t = prayer_times(2026, 10, 17, -6.2088, 106.8456, 7, &METHODS[i], 1); /* Jakarta, WIB */
        char f[8], d[8], a[8], mg[8], s[8];
        hm(t.fajr, true, f);
        hm(t.dhuhr, true, d);
        hm(t.asr, true, a);
        hm(t.maghrib, true, mg);
        hm(t.isha, true, s);
        printf("%-13s %s  %s  %s  %s  %s\n", METHODS[i].key, f, d, a, mg, s);
    }
    return 0;
}
```

  </TabItem>
</Tabs>

The order of operations inside `prayer_times` matters for two methods. Portugal's Isha is 77 minutes after *Maghrib*, and Maghrib is already 3 minutes after sunset, so the interval is added to the offset time, not to the raw sunset. And the precaution is added last, to every prayer, after offsets and intervals, which is why Jordan's Isha moves by five minutes even though its angle is the same as Karachi's.

## Check your work

Run it. For Jakarta on 17 October 2026 you should see:

```text
method        fajr   dhuhr  asr    maghrib isha
mwl           04:21  11:39  14:46  17:46  18:52
makkah        04:19  11:39  14:46  17:46  19:16
isna          04:33  11:39  14:46  17:46  18:44
egypt         04:15  11:39  14:46  17:46  18:54
karachi       04:21  11:39  14:46  17:46  18:56
turkey        04:21  11:39  14:46  17:46  18:52
singapore     04:13  11:39  14:46  17:46  18:56
jakim         04:13  11:39  14:46  17:46  18:56
kemenag       04:15  11:41  14:48  17:48  18:58
france        04:46  11:39  14:46  17:46  18:32
russia        04:29  11:39  14:46  17:46  18:44
dubai         04:20  11:39  14:46  17:46  18:57
qatar         04:21  11:39  14:46  17:46  19:16
kuwait        04:21  11:39  14:46  17:46  18:54
jordan        04:26  11:44  14:51  17:51  19:01
gulf          04:15  11:39  14:46  17:46  19:16
tunisia       04:21  11:39  14:46  17:46  18:56
algeria       04:21  11:39  14:46  17:46  18:52
morocco       04:17  11:39  14:46  17:46  18:52
portugal      04:21  11:39  14:46  17:49  19:06
moonsighting  04:21  11:39  14:46  17:49  18:56
```

Every cell of this table is what libmuslim's `calculate_prayer_times` returns for the same inputs, which means it is what Muslimtify shows when you switch methods with [`muslimtify method`](/docs/command#muslimtify-method).

A few things to notice while reading it. Dhuhr, Asr and Maghrib are the same in every row except three, because no method touches them except through precaution and the Maghrib offset: Kemenag and Jordan shift all of them, Portugal and Moonsighting shift Maghrib. Singapore and JAKIM print Fajr two minutes before Kemenag from the same angle, which is exactly the ihtiyat. And Makkah, Qatar and Gulf all land on 19:16 for Isha despite different Fajr angles, because 90 minutes after the same sunset is the same time.

Then change the city. Jakarta is almost the gentlest place on earth for this table, because near the equator the angle differences compress. Put in your own coordinates, or Istanbul's (41.0082, 28.9784, UTC+3), and watch the Fajr column spread out.

## What to carry into part 7

A calculation method is the authority's published angles plus its clock rules plus its precaution, and nothing else. The angles cluster near 18° because that is where twilight ends, the clock rules exist to make a timetable simple and safe, and the precaution is a hadith applied with a stopwatch. The things Muslimtify leaves out are the things an authority never published as a rule.

One column of the table hides a problem. Run the program for Oslo on 21 June and the Fajr and Isha cells come back empty, because the sun never gets 18° below the horizon there in midsummer. Part 7 is about what a timetable should say when the sky gives no answer, and about the two authorities in the table, the Muslim World League and the Moonsighting Committee, that have actually published one.
