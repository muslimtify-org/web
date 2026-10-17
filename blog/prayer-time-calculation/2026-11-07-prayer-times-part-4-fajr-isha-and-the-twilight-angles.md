---
slug: prayer-times-part-4-fajr-isha-and-the-twilight-angles
title: "Prayer times, part 4: Fajr, Isha and the twilight angles"
authors:
  - rizukirr
tags: [muslimtify, prayer-time-calculation]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

{/*
  REVIEW NOTES (not rendered):
  - The Python, TypeScript, Rust and C snippets were run. For Jakarta on 2026-10-17 all
    seven method rows match libmuslim's calculate_prayer_times output exactly, and the
    raw (pre-ihtiyat) values match to five decimals. Go, Kotlin and Dart were NOT run.
  - The short histories of each method's angles are marked VERIFY. They are mainstream
    accounts but dates and attributions should be checked before publishing.
*/}

Part 1 opened with two apps that disagreed about Fajr by six minutes. We now have everything needed to say exactly why, and to reproduce both numbers.

Fajr and Isha use the same formula as sunrise and sunset from [part 3](/blog/prayer-times-part-3-sunrise-dhuhr-and-maghrib). The only thing that changes is the altitude we ask for. Instead of the sun's center sitting 0.833° below the horizon, we ask for 18°, or 20°, or 15°. The code is four lines. The number is the whole story.

{/* truncate */}

:::info[This is part 4 of a series]
[Part 1](/blog/prayer-times-part-1-what-the-quran-and-sunnah-say) covered the sources. [Part 2](/blog/prayer-times-part-2-where-is-the-sun) found the sun. [Part 3](/blog/prayer-times-part-3-sunrise-dhuhr-and-maghrib) computed sunrise, Dhuhr and Maghrib. This part finishes the twilight prayers. Part 5 covers Asr and the shadow. The full series is under the [prayer time calculation](/blog/tags/prayer-time-calculation) tag.
:::

## The same question, a different altitude

In part 3, `sun_event` answered the question "at what time does the sun reach this altitude, before or after noon?" For sunrise we asked for −0.833° before noon. For sunset, −0.833° after noon.

Fajr is the same question with a deeper altitude, before noon. Isha is the same question with a deeper altitude, after noon:

```text
fajr = sun_event(jd, lat, lon, tz, -fajr_angle, before noon)
isha = sun_event(jd, lat, lon, tz, -isha_angle, after noon)
```

A handful of authorities define Isha differently, as a fixed number of minutes after Maghrib. Umm al-Qura in Makkah uses 90. For those, `isha = maghrib + 90 minutes` and no angle is involved.

That is the entire change to the code. The rest of this part is about one thing: what number to put in for the angle, and why Indonesia says 20 while North America says 15.

## What the sky looks like 18° down

Astronomers divide the time after sunset into three bands by how far the sun's center has sunk below the horizon.

From 0° to 6° is **civil twilight**. The sky is bright, you can read a newspaper outside, and only the brightest planets are visible. From 6° to 12° is **nautical twilight**, named because sailors could still see the horizon to take star sights. The brighter stars are out and the sea is distinguishable from the sky. From 12° to 18° is **astronomical twilight**. The sky looks dark to a casual glance but a faint glow lingers on the horizon where the sun went down, and the faintest stars are still washed out. At 18° the glow is gone and astronomers call it night.

Dawn runs the same bands in reverse. Somewhere in the deep end of astronomical twilight, as the sun climbs from about 20° to 15° below the horizon, the first horizontal whiteness appears along the eastern horizon. That is the moment the hadith of Samurah describes, and the moment every Fajr angle is trying to pin down.

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 900 400" role="img" aria-label="A horizontal gauge of the sun's depth below the horizon from 0 to 21 degrees, with civil, nautical and astronomical twilight bands and the Fajr and Isha angles used by seven calculation methods marked on it" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<rect x="60.0" y="160" width="234.3" height="80" fill="var(--ifm-color-primary)" fillOpacity="0.06" stroke="none" />
<text x="177.1" y="180" textAnchor="middle" fill="currentColor" fontWeight="600">civil twilight</text>
<rect x="294.3" y="160" width="234.3" height="80" fill="var(--ifm-color-primary)" fillOpacity="0.13" stroke="none" />
<text x="411.4" y="180" textAnchor="middle" fill="currentColor" fontWeight="600">nautical twilight</text>
<rect x="528.6" y="160" width="234.3" height="80" fill="var(--ifm-color-primary)" fillOpacity="0.20" stroke="none" />
<text x="645.7" y="180" textAnchor="middle" fill="currentColor" fontWeight="600">astronomical twilight</text>
<rect x="762.9" y="160" width="117.1" height="80" fill="var(--ifm-color-primary)" fillOpacity="0.27" stroke="none" />
<text x="821.4" y="180" textAnchor="middle" fill="currentColor" fontWeight="600">night</text>
<line x1="60" y1="200" x2="880" y2="200" stroke="currentColor" strokeWidth="2" />
<line x1="60.0" y1="195" x2="60.0" y2="205" stroke="currentColor" strokeWidth="1.5" />
<text x="60.0" y="222" textAnchor="middle" fill="currentColor">horizon</text>
<line x1="177.1" y1="195" x2="177.1" y2="205" stroke="currentColor" strokeWidth="1.5" />
<text x="177.1" y="222" textAnchor="middle" fill="currentColor">−3°</text>
<line x1="294.3" y1="195" x2="294.3" y2="205" stroke="currentColor" strokeWidth="1.5" />
<text x="294.3" y="222" textAnchor="middle" fill="currentColor">−6°</text>
<line x1="411.4" y1="195" x2="411.4" y2="205" stroke="currentColor" strokeWidth="1.5" />
<text x="411.4" y="222" textAnchor="middle" fill="currentColor">−9°</text>
<line x1="528.6" y1="195" x2="528.6" y2="205" stroke="currentColor" strokeWidth="1.5" />
<text x="528.6" y="222" textAnchor="middle" fill="currentColor">−12°</text>
<line x1="645.7" y1="195" x2="645.7" y2="205" stroke="currentColor" strokeWidth="1.5" />
<text x="645.7" y="222" textAnchor="middle" fill="currentColor">−15°</text>
<line x1="762.9" y1="195" x2="762.9" y2="205" stroke="currentColor" strokeWidth="1.5" />
<text x="762.9" y="222" textAnchor="middle" fill="currentColor">−18°</text>
<line x1="880.0" y1="195" x2="880.0" y2="205" stroke="currentColor" strokeWidth="1.5" />
<text x="880.0" y="222" textAnchor="middle" fill="currentColor">−21°</text>
<text x="60" y="54" fill="var(--ifm-color-primary)" fontWeight="600" fontSize="14">Fajr angles</text>
<line x1="528.6" y1="200" x2="528.6" y2="142.0" stroke="var(--ifm-color-primary)" strokeWidth="1.5" />
<circle cx="528.6" cy="200" r="4" fill="var(--ifm-color-primary)" />
<text x="528.6" y="130.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">France 12°</text>
<line x1="645.7" y1="200" x2="645.7" y2="142.0" stroke="var(--ifm-color-primary)" strokeWidth="1.5" />
<circle cx="645.7" cy="200" r="4" fill="var(--ifm-color-primary)" />
<text x="645.7" y="130.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">ISNA 15°</text>
<line x1="762.9" y1="200" x2="762.9" y2="114.0" stroke="var(--ifm-color-primary)" strokeWidth="1.5" />
<circle cx="762.9" cy="200" r="4" fill="var(--ifm-color-primary)" />
<text x="762.9" y="102.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">MWL, Karachi 18°</text>
<line x1="782.4" y1="200" x2="782.4" y2="142.0" stroke="var(--ifm-color-primary)" strokeWidth="1.5" />
<circle cx="782.4" cy="200" r="4" fill="var(--ifm-color-primary)" />
<text x="782.4" y="130.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">Makkah 18.5°</text>
<line x1="821.4" y1="200" x2="821.4" y2="86.0" stroke="var(--ifm-color-primary)" strokeWidth="1.5" />
<circle cx="821.4" cy="200" r="4" fill="var(--ifm-color-primary)" />
<text x="821.4" y="74.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">Egypt 19.5°</text>
<line x1="841.0" y1="200" x2="841.0" y2="58.0" stroke="var(--ifm-color-primary)" strokeWidth="1.5" />
<circle cx="841.0" cy="200" r="4" fill="var(--ifm-color-primary)" />
<text x="841.0" y="46.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">Kemenag, JAKIM 20°</text>
<text x="60" y="354" fill="var(--ifm-color-primary)" fontWeight="600" fontSize="14">Isha angles</text>
<line x1="528.6" y1="200" x2="528.6" y2="258.0" stroke="var(--ifm-color-primary)" strokeWidth="1.5" />
<circle cx="528.6" cy="200" r="4" fill="var(--ifm-color-primary)" />
<text x="528.6" y="274.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">France 12°</text>
<line x1="645.7" y1="200" x2="645.7" y2="258.0" stroke="var(--ifm-color-primary)" strokeWidth="1.5" />
<circle cx="645.7" cy="200" r="4" fill="var(--ifm-color-primary)" />
<text x="645.7" y="274.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">ISNA 15°</text>
<line x1="723.8" y1="200" x2="723.8" y2="254.0" stroke="var(--ifm-color-primary)" strokeWidth="1.5" />
<circle cx="723.8" cy="200" r="4" fill="var(--ifm-color-primary)" />
<text x="723.8" y="270.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">MWL 17°</text>
<line x1="743.3" y1="200" x2="743.3" y2="282.0" stroke="var(--ifm-color-primary)" strokeWidth="1.5" />
<circle cx="743.3" cy="200" r="4" fill="var(--ifm-color-primary)" />
<text x="743.3" y="298.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">Egypt 17.5°</text>
<line x1="762.9" y1="200" x2="762.9" y2="310.0" stroke="var(--ifm-color-primary)" strokeWidth="1.5" />
<circle cx="762.9" cy="200" r="4" fill="var(--ifm-color-primary)" />
<text x="762.9" y="326.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">Karachi, Kemenag 18°</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>The twilight gauge: how far the sun's center is below the horizon. Fajr begins when the rising sun reaches the method's angle, Isha when the sinking sun reaches it. The named bands are the astronomers' divisions of twilight.</figcaption>
</figure>

## Which light counts

Before the true dawn there is an earlier light, and the formula cannot see it, which is worth understanding.

An hour or two before the true dawn, in clear dark skies, a faint cone of light appears standing up from the eastern horizon, leaning along the path the sun will follow. It is sunlight scattered by dust spread through the plane of the solar system, and astronomers call it the zodiacal light. It is the false dawn, *al-fajr al-kadhib*, "the one that rises vertically". It brightens, then fades, and the sky goes dark again.

The true dawn, *al-fajr as-sadiq*, is different light with a different cause. It is sunlight scattered by the upper atmosphere, and because the atmosphere is a layer wrapped around the earth, the light lies flat along the horizon and spreads sideways as the sun climbs. Once it appears it never fades, it only grows into day.

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 760 280" role="img" aria-label="Two panels of the eastern horizon before sunrise: on the left a narrow vertical cone of light, the false dawn; on the right a horizontal band of light spreading along the horizon, the true dawn" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<rect x="20" y="60" width="340" height="140" fill="currentColor" fillOpacity="0.08" stroke="none" />
<polygon points="220,200 250,200 280,72 260,72" fill="var(--ifm-color-primary)" fillOpacity="0.35" stroke="none" />
<line x1="20" y1="200" x2="360" y2="200" stroke="currentColor" strokeWidth="2" />
<text x="360" y="216" textAnchor="end" fill="currentColor" fontSize="11">eastern horizon</text>
<text x="190" y="36" textAnchor="middle" fill="currentColor" fontWeight="600">False dawn, al-fajr al-kadhib</text>
<text x="190" y="240" textAnchor="middle" fill="currentColor">a tall faint cone that fades again</text>
<text x="190" y="258" textAnchor="middle" fill="var(--ifm-color-primary)">no legal effect, suhur continues</text>
<rect x="390" y="60" width="340" height="140" fill="currentColor" fillOpacity="0.08" stroke="none" />
<rect x="400" y="174" width="320" height="26" fill="var(--ifm-color-primary)" fillOpacity="0.45" stroke="none" />
<rect x="430" y="156" width="260" height="18" fill="var(--ifm-color-primary)" fillOpacity="0.2" stroke="none" />
<line x1="390" y1="200" x2="730" y2="200" stroke="currentColor" strokeWidth="2" />
<text x="730" y="216" textAnchor="end" fill="currentColor" fontSize="11">eastern horizon</text>
<text x="560" y="36" textAnchor="middle" fill="currentColor" fontWeight="600">True dawn, al-fajr as-sadiq</text>
<text x="560" y="240" textAnchor="middle" fill="currentColor">a band along the horizon that only grows</text>
<text x="560" y="258" textAnchor="middle" fill="var(--ifm-color-primary)">Fajr begins, the fast begins</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>The two dawns from the hadith of Samurah in part 1. The false dawn is sunlight scattered by dust in the plane of the solar system, and it points up. The true dawn is sunlight scattered by the upper atmosphere, and it lies flat along the horizon.</figcaption>
</figure>

Our formula computes one thing: how far the sun is below the horizon. The false dawn does not depend on that in any simple way, because it comes from dust far outside the atmosphere. The true dawn does, closely. So when a method says "Fajr at 18°", it is a claim about the true dawn only. The false dawn is not in the calculation at all, which is exactly what the hadith asks for.

## Where each number comes from

Every authority answered the same question: on a clear night, at what depression of the sun do careful observers first see the true dawn, and last see the evening glow? They got different numbers, and part 1 gave the four reasons they could. Here is how it played out for the methods Muslimtify ships.

| Method | Fajr | Isha | Where the numbers come from |
| --- | --- | --- | --- |
| Egyptian General Authority | 19.5° | 17.5° | One of the oldest national standards, published by Egypt's survey authority and used by al-Azhar. The 17.5° Isha is tied to the disappearance of the red twilight. The origin of the exact figures is not well documented. {/* VERIFY */} |
| Muslim World League | 18° | 17° | Adopted by the League's fiqh council in the 1970s as a round figure usable worldwide, with 17° for the disappearance of the red twilight. {/* VERIFY */} |
| Karachi | 18° | 18° | The same Fajr as the League, with 18° for Isha following the Hanafi view that the white twilight must also disappear. {/* VERIFY */} |
| Umm al-Qura, Makkah | 18.5° | 90 min | The official Saudi calendar. Fajr was 19° until December 2008, when it moved to 18.5°. Isha is a fixed interval after Maghrib rather than an angle, simpler to publish and never early, and the official calendar uses 120 minutes during Ramadan. {/* VERIFY */} |
| Kemenag, Indonesia | 20° | 18° | The 20° dawn criterion originates with Saadoeddin Djambek, the Indonesian falak scholar, and is still Kemenag's. In December 2020 Kemenag reaffirmed it, citing dawn observations by its own falak team at Labuan Bajo in 2018 and by Nahdlatul Ulama researchers at Banyuwangi. The same month Muhammadiyah moved its own criterion to 18°, about 8 minutes later. {/* VERIFY */} |
| ISNA, North America | 15° | 15° | ISNA's long-standing convention. Around 2010 the Fiqh Council of North America discussed moving to 18°, and reports after that disagree on what was adopted, so many North American communities now use 18° or 17.5° while apps still label 15° as ISNA. {/* VERIFY */} |
| UOIF, France | 12° | 12° | A pragmatic choice by the French federation now called Musulmans de France. At 18° there is no Fajr at all in France for weeks in summer. When and how 12° was adopted is not well documented. {/* VERIFY */} |

Read down the Fajr column and you see the pattern from part 1. The numbers from 18° to 20° are all observations of the same dawn in different skies. The numbers at 15° and 12° are decisions, made by authorities for their own people, that trade a little of the astronomy for a timetable people in those places can actually keep. Both kinds are legitimate in their place, and the authority of each country settles which applies there.

The Isha column adds the oldest disagreement of all. The hadith says Maghrib lasts "as long as the twilight (*shafaq*) has not disappeared", and the Companions already differed over whether that means the red glow or the whiter glow that outlasts it. The red fades first. So the authorities that follow the red twilight tend to sit at 17° or 17.5°, and those that follow the Hanafi white twilight at 18°. One degree, roughly four minutes in Jakarta, and it traces back to Ibn Umar and Abu Hanifa.

## How much does the angle matter?

More than you might think, and more the further you are from the equator.

For Jakarta on 17 October 2026, before any precaution or rounding, the seven methods above put Fajr anywhere from 04:12 to 04:45, half an hour apart. Between the two most common choices, 18° and 20°, the gap is 8 minutes. That is the six minutes from part 1's two apps, once you allow for rounding and precaution.

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 760 260" role="img" aria-label="Two timelines for Jakarta on 17 October 2026 showing Fajr by method from 04:14 to 04:45 and Isha by method from 18:31 to 19:15" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<text x="70" y="84" textAnchor="end" fill="currentColor" fontWeight="600">Fajr</text>
<line x1="80" y1="80" x2="680" y2="80" stroke="currentColor" strokeWidth="1.5" />
<line x1="126.2" y1="76" x2="126.2" y2="84" stroke="currentColor" />
<text x="126.2" y="98" textAnchor="middle" fill="currentColor" fontSize="11">04:15</text>
<line x1="203.1" y1="76" x2="203.1" y2="84" stroke="currentColor" />
<text x="203.1" y="98" textAnchor="middle" fill="currentColor" fontSize="11">04:20</text>
<line x1="280.0" y1="76" x2="280.0" y2="84" stroke="currentColor" />
<text x="280.0" y="98" textAnchor="middle" fill="currentColor" fontSize="11">04:25</text>
<line x1="356.9" y1="76" x2="356.9" y2="84" stroke="currentColor" />
<text x="356.9" y="98" textAnchor="middle" fill="currentColor" fontSize="11">04:30</text>
<line x1="433.8" y1="76" x2="433.8" y2="84" stroke="currentColor" />
<text x="433.8" y="98" textAnchor="middle" fill="currentColor" fontSize="11">04:35</text>
<line x1="510.8" y1="76" x2="510.8" y2="84" stroke="currentColor" />
<text x="510.8" y="98" textAnchor="middle" fill="currentColor" fontSize="11">04:40</text>
<line x1="587.7" y1="76" x2="587.7" y2="84" stroke="currentColor" />
<text x="587.7" y="98" textAnchor="middle" fill="currentColor" fontSize="11">04:45</text>
<line x1="664.6" y1="76" x2="664.6" y2="84" stroke="currentColor" />
<text x="664.6" y="98" textAnchor="middle" fill="currentColor" fontSize="11">04:50</text>
<circle cx="83.5" cy="80" r="5" fill="var(--ifm-color-primary)" />
<line x1="83.5" y1="74" x2="83.5" y2="44.0" stroke="var(--ifm-color-primary)" strokeWidth="1" />
<text x="83.5" y="38.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">kemenag 04:12</text>
<circle cx="115.1" cy="80" r="5" fill="var(--ifm-color-primary)" />
<line x1="115.1" y1="86" x2="115.1" y2="120.0" stroke="var(--ifm-color-primary)" strokeWidth="1" />
<text x="115.1" y="132.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">egypt 04:14</text>
<circle cx="178.3" cy="80" r="5" fill="var(--ifm-color-primary)" />
<line x1="178.3" y1="74" x2="178.3" y2="56.0" stroke="var(--ifm-color-primary)" strokeWidth="1" />
<text x="178.3" y="50.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">makkah 04:18</text>
<circle cx="209.9" cy="80" r="5" fill="var(--ifm-color-primary)" />
<line x1="209.9" y1="86" x2="209.9" y2="108.0" stroke="var(--ifm-color-primary)" strokeWidth="1" />
<text x="209.9" y="120.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">mwl, karachi 04:20</text>
<circle cx="399.4" cy="80" r="5" fill="var(--ifm-color-primary)" />
<line x1="399.4" y1="74" x2="399.4" y2="44.0" stroke="var(--ifm-color-primary)" strokeWidth="1" />
<text x="399.4" y="38.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">isna 04:33</text>
<circle cx="588.5" cy="80" r="5" fill="var(--ifm-color-primary)" />
<line x1="588.5" y1="86" x2="588.5" y2="120.0" stroke="var(--ifm-color-primary)" strokeWidth="1" />
<text x="588.5" y="132.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">france 04:45</text>
<text x="70" y="204" textAnchor="end" fill="currentColor" fontWeight="600">Isha</text>
<line x1="80" y1="200" x2="680" y2="200" stroke="currentColor" strokeWidth="1.5" />
<line x1="113.3" y1="196" x2="113.3" y2="204" stroke="currentColor" />
<text x="113.3" y="218" textAnchor="middle" fill="currentColor" fontSize="11">18:30</text>
<line x1="168.9" y1="196" x2="168.9" y2="204" stroke="currentColor" />
<text x="168.9" y="218" textAnchor="middle" fill="currentColor" fontSize="11">18:35</text>
<line x1="224.4" y1="196" x2="224.4" y2="204" stroke="currentColor" />
<text x="224.4" y="218" textAnchor="middle" fill="currentColor" fontSize="11">18:40</text>
<line x1="280.0" y1="196" x2="280.0" y2="204" stroke="currentColor" />
<text x="280.0" y="218" textAnchor="middle" fill="currentColor" fontSize="11">18:45</text>
<line x1="335.6" y1="196" x2="335.6" y2="204" stroke="currentColor" />
<text x="335.6" y="218" textAnchor="middle" fill="currentColor" fontSize="11">18:50</text>
<line x1="391.1" y1="196" x2="391.1" y2="204" stroke="currentColor" />
<text x="391.1" y="218" textAnchor="middle" fill="currentColor" fontSize="11">18:55</text>
<line x1="446.7" y1="196" x2="446.7" y2="204" stroke="currentColor" />
<text x="446.7" y="218" textAnchor="middle" fill="currentColor" fontSize="11">19:00</text>
<line x1="502.2" y1="196" x2="502.2" y2="204" stroke="currentColor" />
<text x="502.2" y="218" textAnchor="middle" fill="currentColor" fontSize="11">19:05</text>
<line x1="557.8" y1="196" x2="557.8" y2="204" stroke="currentColor" />
<text x="557.8" y="218" textAnchor="middle" fill="currentColor" fontSize="11">19:10</text>
<line x1="613.3" y1="196" x2="613.3" y2="204" stroke="currentColor" />
<text x="613.3" y="218" textAnchor="middle" fill="currentColor" fontSize="11">19:15</text>
<line x1="668.9" y1="196" x2="668.9" y2="204" stroke="currentColor" />
<text x="668.9" y="218" textAnchor="middle" fill="currentColor" fontSize="11">19:20</text>
<circle cx="125.8" cy="200" r="5" fill="var(--ifm-color-primary)" />
<line x1="125.8" y1="194" x2="125.8" y2="164.0" stroke="var(--ifm-color-primary)" strokeWidth="1" />
<text x="125.8" y="158.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">france 18:31</text>
<circle cx="262.5" cy="200" r="5" fill="var(--ifm-color-primary)" />
<line x1="262.5" y1="206" x2="262.5" y2="240.0" stroke="var(--ifm-color-primary)" strokeWidth="1" />
<text x="262.5" y="252.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">isna 18:43</text>
<circle cx="353.8" cy="200" r="5" fill="var(--ifm-color-primary)" />
<line x1="353.8" y1="194" x2="353.8" y2="176.0" stroke="var(--ifm-color-primary)" strokeWidth="1" />
<text x="353.8" y="170.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">mwl 18:52</text>
<circle cx="376.6" cy="200" r="5" fill="var(--ifm-color-primary)" />
<line x1="376.6" y1="206" x2="376.6" y2="228.0" stroke="var(--ifm-color-primary)" strokeWidth="1" />
<text x="376.6" y="240.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">egypt 18:54</text>
<circle cx="399.5" cy="200" r="5" fill="var(--ifm-color-primary)" />
<line x1="399.5" y1="194" x2="399.5" y2="164.0" stroke="var(--ifm-color-primary)" strokeWidth="1" />
<text x="399.5" y="158.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">karachi, kemenag 18:56</text>
<circle cx="618.5" cy="200" r="5" fill="var(--ifm-color-primary)" />
<line x1="618.5" y1="206" x2="618.5" y2="240.0" stroke="var(--ifm-color-primary)" strokeWidth="1" />
<text x="618.5" y="252.0" textAnchor="middle" fill="var(--ifm-color-primary)" fontSize="11">makkah 19:15</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>The same sky, seven standards. Jakarta, 17 October 2026, before any precaution or rounding. Half an hour separates the earliest Fajr from the latest, and Isha spans three quarters of an hour because Makkah uses a fixed 90 minutes after sunset.</figcaption>
</figure>

Move to Istanbul and the same 18° versus 20° gap is 11 minutes, because the sun crosses the twilight band at a slant, as the three panels in part 3 showed. In Oslo it is 17 minutes. In midsummer in London, 18° never arrives at all, because the sun does not get that far below the horizon all night, and that is the problem the French 12° was meant to solve and that part 7 returns to.

## The code

Add this to the file from part 3, in place of its last block. It is a small table of methods and two functions. Nothing in `sun_event` changes.

<Tabs groupId="lang" queryString>
  <TabItem value="python" label="Python" default>

```python
METHODS = {
    #  key         fajr angle  isha angle  isha minutes after maghrib  ihtiyat minutes
    "isna":    dict(fajr=15.0, isha=15.0, interval=0,  ihtiyat=0),
    "france":  dict(fajr=12.0, isha=12.0, interval=0,  ihtiyat=0),
    "mwl":     dict(fajr=18.0, isha=17.0, interval=0,  ihtiyat=0),
    "karachi": dict(fajr=18.0, isha=18.0, interval=0,  ihtiyat=0),
    "makkah":  dict(fajr=18.5, isha=0.0,  interval=90, ihtiyat=0),
    "egypt":   dict(fajr=19.5, isha=17.5, interval=0,  ihtiyat=0),
    "kemenag": dict(fajr=20.0, isha=18.0, interval=0,  ihtiyat=2),
}

def fajr(jd, latitude, longitude, timezone, method):
    return sun_event(jd, latitude, longitude, timezone, -method["fajr"], -1)

def isha(jd, latitude, longitude, timezone, method):
    if method["interval"]:
        maghrib = sun_event(jd, latitude, longitude, timezone, SUNRISE_ALTITUDE, +1)
        return None if maghrib is None else maghrib + method["interval"] / 60
    return sun_event(jd, latitude, longitude, timezone, -method["isha"], +1)

def with_ihtiyat(t, method):
    return None if t is None else t + method["ihtiyat"] / 60

if __name__ == "__main__":
    jd = julian_day(2026, 10, 17)
    lat, lon, tz = -6.2088, 106.8456, 7  # Jakarta, WIB
    print("method    fajr   isha   (as the timetable prints them)")
    for key, m in METHODS.items():
        f = with_ihtiyat(fajr(jd, lat, lon, tz, m), m)
        i = with_ihtiyat(isha(jd, lat, lon, tz, m), m)
        print(f"{key:<9} {hm(f, round_up=True)}  {hm(i, round_up=True)}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
type Method = { fajr: number; isha: number; interval: number; ihtiyat: number };

const METHODS: Record<string, Method> = {
  isna:    { fajr: 15.0, isha: 15.0, interval: 0,  ihtiyat: 0 },
  france:  { fajr: 12.0, isha: 12.0, interval: 0,  ihtiyat: 0 },
  mwl:     { fajr: 18.0, isha: 17.0, interval: 0,  ihtiyat: 0 },
  karachi: { fajr: 18.0, isha: 18.0, interval: 0,  ihtiyat: 0 },
  makkah:  { fajr: 18.5, isha: 0.0,  interval: 90, ihtiyat: 0 },
  egypt:   { fajr: 19.5, isha: 17.5, interval: 0,  ihtiyat: 0 },
  kemenag: { fajr: 20.0, isha: 18.0, interval: 0,  ihtiyat: 2 },
};

function fajr(jd: number, lat: number, lon: number, tz: number, m: Method) {
  return sunEvent(jd, lat, lon, tz, -m.fajr, -1);
}

function isha(jd: number, lat: number, lon: number, tz: number, m: Method) {
  if (m.interval) {
    const maghrib = sunEvent(jd, lat, lon, tz, SUNRISE_ALTITUDE, 1);
    return maghrib === null ? null : maghrib + m.interval / 60;
  }
  return sunEvent(jd, lat, lon, tz, -m.isha, 1);
}

const withIhtiyat = (t: number | null, m: Method) => (t === null ? null : t + m.ihtiyat / 60);

const jd = julianDay(2026, 10, 17);
const [lat, lon, tz] = [-6.2088, 106.8456, 7]; // Jakarta, WIB
console.log("method    fajr   isha   (as the timetable prints them)");
for (const [key, m] of Object.entries(METHODS)) {
  console.log(`${key.padEnd(9)} ${hm(withIhtiyat(fajr(jd, lat, lon, tz, m), m), true)}  ${hm(withIhtiyat(isha(jd, lat, lon, tz, m), m), true)}`);
}
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
type Method struct {
	Fajr, Isha float64 // degrees below the horizon
	Interval   float64 // minutes after maghrib, 0 to use the angle
	Ihtiyat    float64 // precaution minutes added to every time
}

var methodOrder = []string{"isna", "france", "mwl", "karachi", "makkah", "egypt", "kemenag"}
var methods = map[string]Method{
	"isna":    {15.0, 15.0, 0, 0},
	"france":  {12.0, 12.0, 0, 0},
	"mwl":     {18.0, 17.0, 0, 0},
	"karachi": {18.0, 18.0, 0, 0},
	"makkah":  {18.5, 0.0, 90, 0},
	"egypt":   {19.5, 17.5, 0, 0},
	"kemenag": {20.0, 18.0, 0, 2},
}

func fajr(jd, lat, lon, tz float64, m Method) (float64, bool) {
	return sunEvent(jd, lat, lon, tz, -m.Fajr, -1)
}

func isha(jd, lat, lon, tz float64, m Method) (float64, bool) {
	if m.Interval > 0 {
		maghrib, ok := sunEvent(jd, lat, lon, tz, sunriseAltitude, 1)
		return maghrib + m.Interval/60, ok
	}
	return sunEvent(jd, lat, lon, tz, -m.Isha, 1)
}

func main() {
	jd := julianDay(2026, 10, 17)
	lat, lon, tz := -6.2088, 106.8456, 7.0 // Jakarta, WIB
	fmt.Println("method    fajr   isha   (as the timetable prints them)")
	for _, key := range methodOrder {
		m := methods[key]
		f, fOk := fajr(jd, lat, lon, tz, m)
		i, iOk := isha(jd, lat, lon, tz, m)
		fmt.Printf("%-9s %s  %s\n", key, hm(f+m.Ihtiyat/60, fOk, true), hm(i+m.Ihtiyat/60, iOk, true))
	}
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
struct Method { key: &'static str, fajr: f64, isha: f64, interval: f64, ihtiyat: f64 }

const METHODS: [Method; 7] = [
    Method { key: "isna",    fajr: 15.0, isha: 15.0, interval: 0.0,  ihtiyat: 0.0 },
    Method { key: "france",  fajr: 12.0, isha: 12.0, interval: 0.0,  ihtiyat: 0.0 },
    Method { key: "mwl",     fajr: 18.0, isha: 17.0, interval: 0.0,  ihtiyat: 0.0 },
    Method { key: "karachi", fajr: 18.0, isha: 18.0, interval: 0.0,  ihtiyat: 0.0 },
    Method { key: "makkah",  fajr: 18.5, isha: 0.0,  interval: 90.0, ihtiyat: 0.0 },
    Method { key: "egypt",   fajr: 19.5, isha: 17.5, interval: 0.0,  ihtiyat: 0.0 },
    Method { key: "kemenag", fajr: 20.0, isha: 18.0, interval: 0.0,  ihtiyat: 2.0 },
];

fn fajr(jd: f64, lat: f64, lon: f64, tz: f64, m: &Method) -> Option<f64> {
    sun_event(jd, lat, lon, tz, -m.fajr, -1.0)
}

fn isha(jd: f64, lat: f64, lon: f64, tz: f64, m: &Method) -> Option<f64> {
    if m.interval > 0.0 {
        return sun_event(jd, lat, lon, tz, SUNRISE_ALTITUDE, 1.0).map(|maghrib| maghrib + m.interval / 60.0);
    }
    sun_event(jd, lat, lon, tz, -m.isha, 1.0)
}

fn with_ihtiyat(t: Option<f64>, m: &Method) -> Option<f64> {
    t.map(|t| t + m.ihtiyat / 60.0)
}

fn main() {
    let jd = julian_day(2026, 10, 17);
    let (lat, lon, tz) = (-6.2088, 106.8456, 7.0); // Jakarta, WIB
    println!("method    fajr   isha   (as the timetable prints them)");
    for m in &METHODS {
        println!("{:<9} {}  {}", m.key, hm(with_ihtiyat(fajr(jd, lat, lon, tz, m), m), true), hm(with_ihtiyat(isha(jd, lat, lon, tz, m), m), true));
    }
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
data class Method(val fajr: Double, val isha: Double, val interval: Double = 0.0, val ihtiyat: Double = 0.0)

val METHODS = linkedMapOf(
    "isna" to Method(15.0, 15.0),
    "france" to Method(12.0, 12.0),
    "mwl" to Method(18.0, 17.0),
    "karachi" to Method(18.0, 18.0),
    "makkah" to Method(18.5, 0.0, interval = 90.0),
    "egypt" to Method(19.5, 17.5),
    "kemenag" to Method(20.0, 18.0, ihtiyat = 2.0),
)

fun fajr(jd: Double, lat: Double, lon: Double, tz: Double, m: Method) = sunEvent(jd, lat, lon, tz, -m.fajr, -1)

fun isha(jd: Double, lat: Double, lon: Double, tz: Double, m: Method): Double? {
    if (m.interval > 0) return sunEvent(jd, lat, lon, tz, SUNRISE_ALTITUDE, 1)?.plus(m.interval / 60)
    return sunEvent(jd, lat, lon, tz, -m.isha, 1)
}

fun main() {
    val jd = julianDay(2026, 10, 17)
    val lat = -6.2088
    val lon = 106.8456
    val tz = 7.0 // Jakarta, WIB
    println("method    fajr   isha   (as the timetable prints them)")
    for ((key, m) in METHODS) {
        val f = fajr(jd, lat, lon, tz, m)?.plus(m.ihtiyat / 60)
        val i = isha(jd, lat, lon, tz, m)?.plus(m.ihtiyat / 60)
        println("${key.padEnd(9)} ${hm(f, true)}  ${hm(i, true)}")
    }
}
```

  </TabItem>
  <TabItem value="dart" label="Dart">

```dart
class Method {
  final double fajr, isha; // degrees below the horizon
  final double interval; // minutes after maghrib, 0 to use the angle
  final double ihtiyat; // precaution minutes added to every time
  const Method(this.fajr, this.isha, {this.interval = 0, this.ihtiyat = 0});
}

const methods = {
  'isna': Method(15.0, 15.0),
  'france': Method(12.0, 12.0),
  'mwl': Method(18.0, 17.0),
  'karachi': Method(18.0, 18.0),
  'makkah': Method(18.5, 0.0, interval: 90),
  'egypt': Method(19.5, 17.5),
  'kemenag': Method(20.0, 18.0, ihtiyat: 2),
};

double? fajr(double jd, double lat, double lon, double tz, Method m) => sunEvent(jd, lat, lon, tz, -m.fajr, -1);

double? isha(double jd, double lat, double lon, double tz, Method m) {
  if (m.interval > 0) {
    final maghrib = sunEvent(jd, lat, lon, tz, sunriseAltitude, 1);
    return maghrib == null ? null : maghrib + m.interval / 60;
  }
  return sunEvent(jd, lat, lon, tz, -m.isha, 1);
}

void main() {
  final jd = julianDay(2026, 10, 17);
  const lat = -6.2088, lon = 106.8456, tz = 7.0; // Jakarta, WIB
  print('method    fajr   isha   (as the timetable prints them)');
  for (final entry in methods.entries) {
    final m = entry.value;
    final f = fajr(jd, lat, lon, tz, m);
    final i = isha(jd, lat, lon, tz, m);
    print('${entry.key.padRight(9)} ${hm(f == null ? null : f + m.ihtiyat / 60, roundUp: true)}  ${hm(i == null ? null : i + m.ihtiyat / 60, roundUp: true)}');
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
    double interval; /* minutes after maghrib, 0 to use the angle */
    double ihtiyat;  /* precaution minutes added to every time */
} method_t;

static const method_t METHODS[] = {
    {"isna",    15.0, 15.0, 0,  0},
    {"france",  12.0, 12.0, 0,  0},
    {"mwl",     18.0, 17.0, 0,  0},
    {"karachi", 18.0, 18.0, 0,  0},
    {"makkah",  18.5, 0.0,  90, 0},
    {"egypt",   19.5, 17.5, 0,  0},
    {"kemenag", 20.0, 18.0, 0,  2},
};

static double fajr(double jd, double lat, double lon, double tz, const method_t *m) {
    return sun_event(jd, lat, lon, tz, -m->fajr, -1);
}

static double isha(double jd, double lat, double lon, double tz, const method_t *m) {
    if (m->interval > 0)
        return sun_event(jd, lat, lon, tz, SUNRISE_ALTITUDE, 1) + m->interval / 60;
    return sun_event(jd, lat, lon, tz, -m->isha, 1);
}

int main(void) {
    double jd = julian_day(2026, 10, 17);
    double lat = -6.2088, lon = 106.8456, tz = 7; /* Jakarta, WIB */
    printf("method    fajr   isha   (as the timetable prints them)\n");
    for (size_t i = 0; i < sizeof METHODS / sizeof METHODS[0]; i++) {
        const method_t *m = &METHODS[i];
        char f[8], s[8];
        hm(fajr(jd, lat, lon, tz, m) + m->ihtiyat / 60, true, f);
        hm(isha(jd, lat, lon, tz, m) + m->ihtiyat / 60, true, s);
        printf("%-9s %s  %s\n", m->key, f, s);
    }
    return 0;
}
```

  </TabItem>
</Tabs>

The sign on the angle is the one thing people get wrong. `sun_event` takes an altitude, and "18° below the horizon" is an altitude of −18°. The method table stores the angle as a positive number because that is how every authority writes it, so the two functions negate it on the way in.

## Check your work

Run it. For Jakarta on 17 October 2026 you should see:

```text
method    fajr   isha   (as the timetable prints them)
isna      04:33  18:44
france    04:46  18:32
mwl       04:21  18:52
karachi   04:21  18:56
makkah    04:19  19:16
egypt     04:15  18:54
kemenag   04:15  18:58
```

Every row is rounded up to the next minute, and the Kemenag row includes its two minutes of ihtiyat, so these are the times a timetable in each country would print for Jakarta. The Kemenag row is what Muslimtify shows by default. Switch the method with [`muslimtify method`](/docs/command#muslimtify-method) and each of the other rows should appear.

Now look at the spread. Egypt at 19.5° and Kemenag at 20° print the same Fajr, because the half degree between them is worth about two minutes in Jakarta, the same as Kemenag's precaution, and the two cancel out. ISNA at 15° is eighteen minutes later. If you have ever wondered why your phone and the mosque disagree about Fajr by a quarter of an hour, the answer is almost always that they are using two rows of this table.

Finally, the sky test. Fajr is harder to see than sunset, but it can be done. On a clear morning away from city lights, face east about forty minutes before sunrise. If you can catch the first flat band of whiteness appearing on the horizon and note the time, you have done what Saadoeddin Djambek did when he proposed 20°. Compare it with the 18° and 20° rows and you will have an opinion of your own about which is right for your sky. It is also exactly what Kemenag's team did at Labuan Bajo in 2018 before reaffirming 20°, and what Muhammadiyah's team did before choosing 18°.

## What to carry into part 5

Fajr and Isha are the horizon question from part 3 asked with a deeper altitude, and the altitude is a measurement of twilight that different authorities made in different skies, with a few choosing a shallower angle for practical reasons. The one degree between 17° and 18° for Isha goes back to the Companions and the colour of the evening glow. The method you pick is not a technical setting. It is the authority whose observation you follow.

Part 5 is Asr, and it is different from everything so far. Asr does not depend on the sun being below the horizon at all. It depends on the length of a shadow, the first instrument in the series and the last one we need. It is also the one prayer whose time is set by your madhhab rather than by your country.
