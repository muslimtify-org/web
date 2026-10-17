---
slug: prayer-times-part-3-sunrise-dhuhr-and-maghrib
title: "Prayer times, part 3: sunrise, Dhuhr and Maghrib"
authors:
  - rizukirr
tags: [muslimtify, prayer-time-calculation]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

{/*
  REVIEW NOTES (not rendered):
  The Python, TypeScript, Rust and C snippets were run. Their raw sunrise, noon and
  sunset values match libmuslim's internal solver to six decimal places for Jakarta
  on 2026-10-17, and the Kemenag lines match the library's public output exactly.
  The Go, Kotlin and Dart snippets were written to match but were NOT run.
*/}

[Part 2](/blog/prayer-times-part-2-where-is-the-sun) ended with the sun at its highest over Jakarta at 11:38. That is the first prayer time in the series, even if we did not call it one. This part adds the second ingredient, your latitude, and with it the moment the sun crosses the horizon. By the end you will have three times that you can check against the sky and against the Kemenag timetable: sunrise, Dhuhr and Maghrib.

{/* truncate */}

:::info[This is part 3 of a series]
[Part 1](/blog/prayer-times-part-1-what-the-quran-and-sunnah-say) covered the sources. [Part 2](/blog/prayer-times-part-2-where-is-the-sun) computed the sun's declination and the equation of time for any date. This part turns them into the first three prayer times. Part 4 points the same tool below the horizon for Fajr and Isha. The full series is under the [prayer time calculation](/blog/tags/prayer-time-calculation) tag.
:::

## Dhuhr is the easy one

From the hadith of Abdullah ibn Amr in part 1, Dhuhr begins "when the sun has declined", *idha zalat ash-shams*. The sun declines the instant it passes its highest point. We computed that instant in part 2 and called it solar noon:

```text
noon = 12 + timezone - longitude / 15 - equation_of_time / 60
```

That is Dhuhr. There is nothing more to compute. For Jakarta on 17 October 2026 it is 11:38.1.

What the published timetable adds is precaution, not astronomy. Kemenag adds two minutes of *ihtiyat* and rounds up to the next whole minute, so 11:38.1 becomes 11:40.1 and then 11:41. The hadith of Uqbah in part 1 forbids praying while the sun stands at its peak, and two minutes is more than enough for the sun to have visibly moved on. Other authorities use a different margin or none, which is one of the differences part 6 will go through.

## The sun's day as a clock

To find sunrise and sunset we need a new idea, and it is the only new idea in this part.

The earth turns once every 24 hours, which is 15° per hour. Picture the sun's daily path as a clock face with noon at the top and midnight at the bottom. The sun's position on that face, measured in degrees from noon, is called its **hour angle**. At noon the hour angle is 0°. Three hours after noon it is 45°. At midnight it is 180°.

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 520 470" role="img" aria-label="The sun's daily circle drawn as a clock face: noon at the top, midnight at the bottom, and the hour angle H measured from noon to sunset, with the daylight wedge shaded" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<circle cx="260" cy="240" r="170" fill="none" stroke="currentColor" strokeWidth="2" />
<line x1="260.0" y1="70.0" x2="260.0" y2="80.0" stroke="currentColor" strokeWidth="1.5" />
<line x1="304.0" y1="75.8" x2="302.7" y2="80.6" stroke="currentColor" strokeWidth="1.5" />
<line x1="345.0" y1="92.8" x2="342.5" y2="97.1" stroke="currentColor" strokeWidth="1.5" />
<line x1="380.2" y1="119.8" x2="376.7" y2="123.3" stroke="currentColor" strokeWidth="1.5" />
<line x1="407.2" y1="155.0" x2="402.9" y2="157.5" stroke="currentColor" strokeWidth="1.5" />
<line x1="424.2" y1="196.0" x2="419.4" y2="197.3" stroke="currentColor" strokeWidth="1.5" />
<line x1="430.0" y1="240.0" x2="420.0" y2="240.0" stroke="currentColor" strokeWidth="1.5" />
<line x1="424.2" y1="284.0" x2="419.4" y2="282.7" stroke="currentColor" strokeWidth="1.5" />
<line x1="407.2" y1="325.0" x2="402.9" y2="322.5" stroke="currentColor" strokeWidth="1.5" />
<line x1="380.2" y1="360.2" x2="376.7" y2="356.7" stroke="currentColor" strokeWidth="1.5" />
<line x1="345.0" y1="387.2" x2="342.5" y2="382.9" stroke="currentColor" strokeWidth="1.5" />
<line x1="304.0" y1="404.2" x2="302.7" y2="399.4" stroke="currentColor" strokeWidth="1.5" />
<line x1="260.0" y1="410.0" x2="260.0" y2="400.0" stroke="currentColor" strokeWidth="1.5" />
<line x1="216.0" y1="404.2" x2="217.3" y2="399.4" stroke="currentColor" strokeWidth="1.5" />
<line x1="175.0" y1="387.2" x2="177.5" y2="382.9" stroke="currentColor" strokeWidth="1.5" />
<line x1="139.8" y1="360.2" x2="143.3" y2="356.7" stroke="currentColor" strokeWidth="1.5" />
<line x1="112.8" y1="325.0" x2="117.1" y2="322.5" stroke="currentColor" strokeWidth="1.5" />
<line x1="95.8" y1="284.0" x2="100.6" y2="282.7" stroke="currentColor" strokeWidth="1.5" />
<line x1="90.0" y1="240.0" x2="100.0" y2="240.0" stroke="currentColor" strokeWidth="1.5" />
<line x1="95.8" y1="196.0" x2="100.6" y2="197.3" stroke="currentColor" strokeWidth="1.5" />
<line x1="112.8" y1="155.0" x2="117.1" y2="157.5" stroke="currentColor" strokeWidth="1.5" />
<line x1="139.8" y1="119.8" x2="143.3" y2="123.3" stroke="currentColor" strokeWidth="1.5" />
<line x1="175.0" y1="92.8" x2="177.5" y2="97.1" stroke="currentColor" strokeWidth="1.5" />
<line x1="216.0" y1="75.8" x2="217.3" y2="80.6" stroke="currentColor" strokeWidth="1.5" />
<text x="260.0" y="52.0" textAnchor="middle" fill="currentColor">noon, H = 0°</text>
<text x="260.0" y="436.0" textAnchor="middle" fill="currentColor">midnight, H = 180°</text>
<path d="M 260 240 L 90.1 245.5 A 170 170 0 1 1 429.9 245.5 Z" fill="var(--ifm-color-primary)" fillOpacity="0.15" stroke="none" />
<text x="200" y="130" textAnchor="middle" fill="currentColor">daylight</text>
<text x="355" y="218" fill="currentColor" fontSize="11">15° per hour</text>
<text x="260" y="330" textAnchor="middle" fill="currentColor">night</text>
<line x1="260" y1="240" x2="260.0" y2="70.0" stroke="currentColor" strokeWidth="2" />
<line x1="260" y1="240" x2="429.9" y2="245.5" stroke="var(--ifm-color-primary)" strokeWidth="2.5" />
<line x1="260" y1="240" x2="90.1" y2="245.5" stroke="var(--ifm-color-primary)" strokeWidth="2.5" strokeDasharray="6 4" />
<path d="M 260.0 180.0 A 60 60 0 0 1 320.0 241.9" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2" />
<text x="316.0" y="189.7" textAnchor="middle" fill="var(--ifm-color-primary)" fontWeight="600">H</text>
<circle cx="429.9" cy="245.5" r="6" fill="var(--ifm-color-primary)" />
<text x="439.9" y="249.5" fill="var(--ifm-color-primary)" fontWeight="600">sunset</text>
<circle cx="90.1" cy="245.5" r="6" fill="var(--ifm-color-primary)" />
<text x="80.1" y="249.5" textAnchor="end" fill="var(--ifm-color-primary)" fontWeight="600">sunrise</text>
<text x="260" y="458" textAnchor="middle" fill="currentColor">Jakarta, 17 October 2026: H = 91.9°, which is 6 h 7 min either side of noon</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>The sun's day as a clock face. The earth turns 15° an hour, so the hour angle H from noon to sunset, in degrees, is the length of the afternoon. Sunrise sits the same angle on the other side.</figcaption>
</figure>

Every event in a prayer timetable is a question of the form: at what hour angle does the sun reach a certain height above or below the horizon? Answer that in degrees, divide by 15 to get hours, and add or subtract from noon.

The formula that answers it is the one piece of trigonometry in the whole series:

```text
cos(H) = ( sin(altitude) - sin(latitude) * sin(declination) ) / ( cos(latitude) * cos(declination) )
```

Three inputs. The *altitude* is the height of the sun you are asking about, 0° for the horizon, negative below it. The *latitude* is yours. The *declination* is the sun's latitude, which part 2 gave us for any date. Out comes `H`, the hour angle, and `H / 15` is the number of hours before or after noon.

You do not need to derive it, but you can see that it makes sense. Stand on the equator at an equinox, so latitude and declination are both 0. The formula collapses to `cos(H) = sin(altitude)`. Ask for the horizon, `altitude = 0`, and you get `cos(H) = 0`, so `H = 90°`, which is six hours. Sunrise six hours before noon and sunset six hours after, a twelve-hour day. That is right.

### What latitude does

Now move away from the equator. The sun still goes around once a day, but its path no longer stands straight up from the horizon. It leans. At latitude 40° it crosses the horizon at a 50° slant. At latitude 60° it crosses at 30°. Near the poles it barely crosses at all.

Two things follow from the lean, and both matter for prayer times.

The first is the length of the day. When the sun's declination is on your side of the equator, the leaning path puts more than half of the sun's circle above your horizon, and days are long. When the declination is on the other side, days are short. In Jakarta, 6° south of the equator, the lean is tiny and days are always close to 12 hours. In Oslo they swing from 6 hours to 19.

The second is how long twilight lasts, and this is the one that will matter for Fajr and Isha in part 4. Fajr begins when the sun is about 18° below the horizon, and it ends at sunrise. Between those two moments the sun has to climb 18°. Near the equator it climbs almost straight up and takes about 70 minutes. In Oslo it climbs at a slant and takes well over two hours on the same date. The twilight band is the same 18° everywhere. The path through it is not.

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 800 330" role="img" aria-label="Three panels for Jakarta, Istanbul and Oslo showing the sun's path crossing the horizon at a steeper or shallower angle depending on latitude, and the minutes it takes to climb from 18 degrees below the horizon to sunrise" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<rect x="20" y="150" width="226" height="75.6" fill="var(--ifm-color-primary)" fillOpacity="0.12" stroke="none" />
<line x1="20" y1="150" x2="246" y2="150" stroke="currentColor" strokeWidth="2" />
<line x1="20" y1="225.6" x2="246" y2="225.6" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" strokeDasharray="4 4" />
<text x="242" y="219.6" textAnchor="end" fill="currentColor" fontSize="11">−18°</text>
<line x1="166.3" y1="234.7" x2="184.5" y2="68.0" stroke="currentColor" strokeWidth="2.5" />
<circle cx="175.6" cy="150" r="5" fill="var(--ifm-color-primary)" />
<circle cx="167.3" cy="225.6" r="5" fill="var(--ifm-color-primary)" />
<text x="133.0" y="40" textAnchor="middle" fill="currentColor" fontWeight="600">Jakarta, 6° S</text>
<text x="133.0" y="58" textAnchor="middle" fill="currentColor">the sun climbs at 84° to the horizon</text>
<text x="133.0" y="275.6" textAnchor="middle" fill="var(--ifm-color-primary)" fontWeight="600">−18° to sunrise: 70 min</text>
<rect x="286" y="150" width="226" height="75.6" fill="var(--ifm-color-primary)" fillOpacity="0.12" stroke="none" />
<line x1="286" y1="150" x2="512" y2="150" stroke="currentColor" strokeWidth="2" />
<line x1="286" y1="225.6" x2="512" y2="225.6" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" strokeDasharray="4 4" />
<text x="508" y="219.6" textAnchor="end" fill="currentColor" fontSize="11">−18°</text>
<line x1="367.9" y1="234.7" x2="495.7" y2="87.7" stroke="currentColor" strokeWidth="2.5" />
<circle cx="441.6" cy="150" r="5" fill="var(--ifm-color-primary)" />
<circle cx="375.8" cy="225.6" r="5" fill="var(--ifm-color-primary)" />
<text x="399.0" y="40" textAnchor="middle" fill="currentColor" fontWeight="600">Istanbul, 41° N</text>
<text x="399.0" y="58" textAnchor="middle" fill="currentColor">the sun climbs at 49° to the horizon</text>
<text x="399.0" y="275.6" textAnchor="middle" fill="var(--ifm-color-primary)" fontWeight="600">−18° to sunrise: 92 min</text>
<rect x="552" y="150" width="226" height="75.6" fill="var(--ifm-color-primary)" fillOpacity="0.12" stroke="none" />
<line x1="552" y1="150" x2="778" y2="150" stroke="currentColor" strokeWidth="2" />
<line x1="552" y1="225.6" x2="778" y2="225.6" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" strokeDasharray="4 4" />
<text x="774" y="219.6" textAnchor="end" fill="currentColor" fontSize="11">−18°</text>
<line x1="561.4" y1="234.7" x2="778.9" y2="108.6" stroke="currentColor" strokeWidth="2.5" />
<circle cx="707.6" cy="150" r="5" fill="var(--ifm-color-primary)" />
<circle cx="577.1" cy="225.6" r="5" fill="var(--ifm-color-primary)" />
<text x="665.0" y="40" textAnchor="middle" fill="currentColor" fontWeight="600">Oslo, 60° N</text>
<text x="665.0" y="58" textAnchor="middle" fill="currentColor">the sun climbs at 30° to the horizon</text>
<text x="665.0" y="275.6" textAnchor="middle" fill="var(--ifm-color-primary)" fontWeight="600">−18° to sunrise: 139 min</text>
<text x="400.0" y="320" textAnchor="middle" fill="currentColor">Same date, 17 October 2026. The twilight band is the same 18° everywhere, but a shallower path takes longer to cross it.</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>Latitude sets the angle at which the sun crosses the horizon. Near the equator it climbs almost straight up and twilight is short. Far north it climbs at a slant, and the same 18° of twilight takes much longer.</figcaption>
</figure>

## Why sunrise is not at 0°

If sunrise means "the first edge of the sun appears", the sun's center is not on the horizon at that moment. Two small things put it lower.

The sun is a disc, not a point, about 0.53° across. When its top edge touches the horizon, its center is still half a disc below it: 0.267°.

The atmosphere bends light. Near the horizon, light from the sun curves around the earth's edge a little on its way to your eye, and you see the sun about 0.567° higher than it really is. Astronomers call it refraction. It is the same effect that makes a straw in a glass of water look bent.

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 640 250" role="img" aria-label="The sun's disc at sunrise: the real sun's center is 0.833 degrees below the horizon while the refracted image you see has its top edge on the horizon" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<line x1="40" y1="50" x2="600" y2="50" stroke="currentColor" strokeWidth="2" />
<text x="600" y="42" textAnchor="end" fill="currentColor">horizon, 0°</text>
<circle cx="200" cy="150.0" r="32.0" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
<text x="200" y="200.0" textAnchor="middle" fill="currentColor" fontWeight="600">where the sun really is</text>
<text x="200" y="216.0" textAnchor="middle" fill="currentColor">its center is 0.833° below the horizon</text>
<circle cx="420" cy="82.0" r="32.0" fill="var(--ifm-color-primary)" fillOpacity="0.25" stroke="var(--ifm-color-primary)" strokeWidth="2" />
<text x="420" y="132.1" textAnchor="middle" fill="var(--ifm-color-primary)" fontWeight="600">where you see it</text>
<text x="420" y="148.1" textAnchor="middle" fill="var(--ifm-color-primary)">its top edge touches the horizon</text>
<line x1="90" y1="50" x2="90" y2="150.0" stroke="currentColor" strokeWidth="1.5" />
<line x1="84" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="1.5" />
<line x1="84" y1="150.0" x2="96" y2="150.0" stroke="currentColor" strokeWidth="1.5" />
<text x="80" y="104.0" textAnchor="end" fill="currentColor">0.833°</text>
<defs><marker id="lift" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,8 L4,0 L8,8 z" fill="currentColor" /></marker></defs>
<line x1="310" y1="150.0" x2="310" y2="88.0" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#lift)" />
<text x="310" y="166.0" textAnchor="middle" fill="currentColor">the air lifts it 0.567°</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>Why sunrise and sunset use −0.833° instead of 0°. Half the sun's width (0.267°) plus the lift from the atmosphere (0.567°) is where the real sun sits when you see its first or last edge.</figcaption>
</figure>

Add the two and you get 0.833°. That is the number every prayer time library uses: sunrise and sunset are the moments the sun's center is 0.833° below the horizon. Maghrib is sunset. If you set the altitude to 0 instead, every sunset in the world would come out about three and a half minutes early. In Jakarta Maghrib would be announced while a sliver of the sun was still showing.

The 0.567° is an average. Refraction changes a little with temperature and air pressure, which is one of the reasons two careful calculators can differ by a few seconds at sunset. Nobody adjusts for it in a prayer timetable, and a minute of precaution covers it.

## Getting the moment right

Part 2 computed the sun's position once, at the start of the day in UTC, and used it for everything. That is fine for noon, but the declination changes by up to 0.4° a day, and sunset is three quarters of a day after our 0h UTC snapshot. An error of 0.3° in declination can move a sunset by a minute at mid latitudes.

The fix is simple and worth understanding, because every serious implementation does some version of it. Compute a first guess for the event using the declination at 0h UTC. Then recompute the sun's position at the moment of that guess and solve again. The second answer is accurate to seconds. In the code this is a loop that runs twice.

libmuslim goes one step further and brackets the exact moment with a binary search on the sun's altitude, which handles a few awkward days in the polar regions where the simple loop gets confused. Part 7 looks at those. For every city where most readers live, two rounds of the loop and the binary search agree to the second.

## The code

Two changes from part 2. `sun_position` now takes a Julian day instead of a calendar date, so we can ask for the sun's position at any moment of the day, not only at midnight. And there are three new functions: `hour_angle`, the formula above; `sun_event`, which finds when the sun reaches a given altitude before or after noon and refines the answer once; and `hm`, which prints hours as a clock time, rounding up when asked, because Kemenag does.

Pick your language. The choice is remembered from part 2.

<Tabs groupId="lang" queryString>
  <TabItem value="python" label="Python" default>

```python
import math

def julian_day(year, month, day):
    if month <= 2:
        year -= 1
        month += 12
    a = year // 100
    b = 2 - a + a // 4
    return math.floor(365.25 * (year + 4716)) + math.floor(30.6001 * (month + 1)) + day + b - 1524.5

def sun_position(jd):
    d = jd - 2451545.0  # days since J2000.0
    g = math.radians((357.529 + 0.98560028 * d) % 360)
    q = (280.459 + 0.98564736 * d) % 360
    L = math.radians((q + 1.915 * math.sin(g) + 0.020 * math.sin(2 * g)) % 360)
    e = math.radians(23.439 - 0.00000036 * d)
    declination = math.degrees(math.asin(math.sin(e) * math.sin(L)))
    right_ascension = math.degrees(math.atan2(math.cos(e) * math.sin(L), math.cos(L))) / 15
    equation_of_time = (q / 15 - right_ascension + 12) % 24 - 12
    return declination, equation_of_time * 60  # degrees, minutes

def hour_angle(latitude, declination, altitude):
    """Hours between solar noon and the moment the sun stands at `altitude` degrees."""
    lat, dec, alt = (math.radians(v) for v in (latitude, declination, altitude))
    cos_h = (math.sin(alt) - math.sin(lat) * math.sin(dec)) / (math.cos(lat) * math.cos(dec))
    if cos_h < -1 or cos_h > 1:
        return None  # the sun never reaches that altitude today
    return math.degrees(math.acos(cos_h)) / 15

SUNRISE_ALTITUDE = -0.833  # refraction 0.567 + half the sun's width 0.267

def solar_noon(jd, longitude, timezone):
    _, eqt = sun_position(jd)
    return 12 + timezone - longitude / 15 - eqt / 60  # local clock hours

def sun_event(jd, latitude, longitude, timezone, altitude, direction):
    """Local clock time when the sun reaches `altitude`, before noon (-1) or after (+1)."""
    t = solar_noon(jd, longitude, timezone)  # first guess, then refine at the event itself
    for _ in range(2):
        dec, _ = sun_position(jd + (t - timezone) / 24)
        h = hour_angle(latitude, dec, altitude)
        if h is None:
            return None
        t = solar_noon(jd + (t - timezone) / 24, longitude, timezone) + direction * h
    return t

def hm(t, round_up=False):
    if t is None:
        return "--:--"
    minutes = math.ceil(t * 60) if round_up else round(t * 60)
    return f"{int(minutes // 60) % 24:02d}:{int(minutes % 60):02d}"

if __name__ == "__main__":
    jd = julian_day(2026, 10, 17)
    lat, lon, tz = -6.2088, 106.8456, 7  # Jakarta, WIB
    noon = solar_noon(jd, lon, tz)
    rise = sun_event(jd, lat, lon, tz, SUNRISE_ALTITUDE, -1)
    sunset = sun_event(jd, lat, lon, tz, SUNRISE_ALTITUDE, +1)
    print(f"sunrise    {hm(rise)}   (end of Fajr)")
    print(f"dhuhr      {hm(noon)}   (solar noon)")
    print(f"maghrib    {hm(sunset)}   (sunset)")
    ihtiyat = 2 / 60
    print(f"kemenag    dhuhr {hm(noon + ihtiyat, round_up=True)}, maghrib {hm(sunset + ihtiyat, round_up=True)}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (rad: number) => (rad * 180) / Math.PI;
const mod = (a: number, n: number) => ((a % n) + n) % n;

function julianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

function sunPosition(jd: number) {
  const d = jd - 2451545.0; // days since J2000.0
  const g = rad(mod(357.529 + 0.98560028 * d, 360));
  const q = mod(280.459 + 0.98564736 * d, 360);
  const L = rad(mod(q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g), 360));
  const e = rad(23.439 - 0.00000036 * d);
  const declination = deg(Math.asin(Math.sin(e) * Math.sin(L)));
  const rightAscension = deg(Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L))) / 15;
  const equationOfTime = mod(q / 15 - rightAscension + 12, 24) - 12;
  return { declination, equationOfTime: equationOfTime * 60 }; // degrees, minutes
}

/** Hours between solar noon and the moment the sun stands at `altitude` degrees. */
function hourAngle(latitude: number, declination: number, altitude: number): number | null {
  const [lat, dec, alt] = [latitude, declination, altitude].map(rad);
  const cosH = (Math.sin(alt) - Math.sin(lat) * Math.sin(dec)) / (Math.cos(lat) * Math.cos(dec));
  if (cosH < -1 || cosH > 1) return null; // the sun never reaches that altitude today
  return deg(Math.acos(cosH)) / 15;
}

const SUNRISE_ALTITUDE = -0.833; // refraction 0.567 + half the sun's width 0.267

function solarNoon(jd: number, longitude: number, timezone: number): number {
  const { equationOfTime } = sunPosition(jd);
  return 12 + timezone - longitude / 15 - equationOfTime / 60; // local clock hours
}

/** Local clock time when the sun reaches `altitude`, before noon (-1) or after (+1). */
function sunEvent(jd: number, latitude: number, longitude: number, timezone: number, altitude: number, direction: -1 | 1): number | null {
  let t = solarNoon(jd, longitude, timezone); // first guess, then refine at the event itself
  for (let i = 0; i < 2; i++) {
    const { declination } = sunPosition(jd + (t - timezone) / 24);
    const h = hourAngle(latitude, declination, altitude);
    if (h === null) return null;
    t = solarNoon(jd + (t - timezone) / 24, longitude, timezone) + direction * h;
  }
  return t;
}

function hm(t: number | null, roundUp = false): string {
  if (t === null) return "--:--";
  const minutes = roundUp ? Math.ceil(t * 60) : Math.round(t * 60);
  return `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

const jd = julianDay(2026, 10, 17);
const [lat, lon, tz] = [-6.2088, 106.8456, 7]; // Jakarta, WIB
const noon = solarNoon(jd, lon, tz);
const rise = sunEvent(jd, lat, lon, tz, SUNRISE_ALTITUDE, -1);
const set = sunEvent(jd, lat, lon, tz, SUNRISE_ALTITUDE, 1);
console.log(`sunrise    ${hm(rise)}   (end of Fajr)`);
console.log(`dhuhr      ${hm(noon)}   (solar noon)`);
console.log(`maghrib    ${hm(set)}   (sunset)`);
const ihtiyat = 2 / 60;
console.log(`kemenag    dhuhr ${hm(noon + ihtiyat, true)}, maghrib ${hm(set === null ? null : set + ihtiyat, true)}`);
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
package main

import (
	"fmt"
	"math"
)

func rad(deg float64) float64 { return deg * math.Pi / 180 }
func deg(rad float64) float64 { return rad * 180 / math.Pi }
func mod(a, n float64) float64 { return math.Mod(math.Mod(a, n)+n, n) }

func julianDay(year, month, day int) float64 {
	if month <= 2 {
		year--
		month += 12
	}
	a := year / 100
	b := 2 - a + a/4
	return math.Floor(365.25*float64(year+4716)) + math.Floor(30.6001*float64(month+1)) + float64(day+b) - 1524.5
}

// sunPosition returns the declination in degrees and the equation of time in minutes.
func sunPosition(jd float64) (float64, float64) {
	d := jd - 2451545.0 // days since J2000.0
	g := rad(mod(357.529+0.98560028*d, 360))
	q := mod(280.459+0.98564736*d, 360)
	L := rad(mod(q+1.915*math.Sin(g)+0.020*math.Sin(2*g), 360))
	e := rad(23.439 - 0.00000036*d)
	declination := deg(math.Asin(math.Sin(e) * math.Sin(L)))
	rightAscension := deg(math.Atan2(math.Cos(e)*math.Sin(L), math.Cos(L))) / 15
	equationOfTime := mod(q/15-rightAscension+12, 24) - 12
	return declination, equationOfTime * 60
}

// hourAngle returns the hours between solar noon and the moment the sun stands
// at altitude degrees, and false when the sun never reaches that altitude today.
func hourAngle(latitude, declination, altitude float64) (float64, bool) {
	lat, dec, alt := rad(latitude), rad(declination), rad(altitude)
	cosH := (math.Sin(alt) - math.Sin(lat)*math.Sin(dec)) / (math.Cos(lat) * math.Cos(dec))
	if cosH < -1 || cosH > 1 {
		return 0, false
	}
	return deg(math.Acos(cosH)) / 15, true
}

const sunriseAltitude = -0.833 // refraction 0.567 + half the sun's width 0.267

func solarNoon(jd, longitude, timezone float64) float64 {
	_, eqt := sunPosition(jd)
	return 12 + timezone - longitude/15 - eqt/60 // local clock hours
}

// sunEvent returns the local clock time when the sun reaches altitude, before
// noon (direction -1) or after (direction +1).
func sunEvent(jd, latitude, longitude, timezone, altitude, direction float64) (float64, bool) {
	t := solarNoon(jd, longitude, timezone) // first guess, then refine at the event itself
	for i := 0; i < 2; i++ {
		dec, _ := sunPosition(jd + (t-timezone)/24)
		h, ok := hourAngle(latitude, dec, altitude)
		if !ok {
			return 0, false
		}
		t = solarNoon(jd+(t-timezone)/24, longitude, timezone) + direction*h
	}
	return t, true
}

func hm(t float64, ok bool, roundUp bool) string {
	if !ok {
		return "--:--"
	}
	var minutes int
	if roundUp {
		minutes = int(math.Ceil(t * 60))
	} else {
		minutes = int(math.Round(t * 60))
	}
	return fmt.Sprintf("%02d:%02d", (minutes/60)%24, minutes%60)
}

func main() {
	jd := julianDay(2026, 10, 17)
	lat, lon, tz := -6.2088, 106.8456, 7.0 // Jakarta, WIB
	noon := solarNoon(jd, lon, tz)
	rise, riseOk := sunEvent(jd, lat, lon, tz, sunriseAltitude, -1)
	set, setOk := sunEvent(jd, lat, lon, tz, sunriseAltitude, 1)
	fmt.Printf("sunrise    %s   (end of Fajr)\n", hm(rise, riseOk, false))
	fmt.Printf("dhuhr      %s   (solar noon)\n", hm(noon, true, false))
	fmt.Printf("maghrib    %s   (sunset)\n", hm(set, setOk, false))
	ihtiyat := 2.0 / 60
	fmt.Printf("kemenag    dhuhr %s, maghrib %s\n", hm(noon+ihtiyat, true, true), hm(set+ihtiyat, setOk, true))
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
fn julian_day(mut year: i32, mut month: i32, day: i32) -> f64 {
    if month <= 2 {
        year -= 1;
        month += 12;
    }
    let a = year / 100;
    let b = 2 - a + a / 4;
    (365.25 * f64::from(year + 4716)).floor() + (30.6001 * f64::from(month + 1)).floor()
        + f64::from(day + b) - 1524.5
}

/// Returns (declination in degrees, equation of time in minutes).
fn sun_position(jd: f64) -> (f64, f64) {
    let d = jd - 2451545.0; // days since J2000.0
    let g = (357.529 + 0.98560028 * d).rem_euclid(360.0).to_radians();
    let q = (280.459 + 0.98564736 * d).rem_euclid(360.0);
    let l = (q + 1.915 * g.sin() + 0.020 * (2.0 * g).sin()).rem_euclid(360.0).to_radians();
    let e = (23.439 - 0.00000036 * d).to_radians();
    let declination = (e.sin() * l.sin()).asin().to_degrees();
    let right_ascension = (e.cos() * l.sin()).atan2(l.cos()).to_degrees() / 15.0;
    let equation_of_time = (q / 15.0 - right_ascension + 12.0).rem_euclid(24.0) - 12.0;
    (declination, equation_of_time * 60.0)
}

/// Hours between solar noon and the moment the sun stands at `altitude` degrees.
fn hour_angle(latitude: f64, declination: f64, altitude: f64) -> Option<f64> {
    let (lat, dec, alt) = (latitude.to_radians(), declination.to_radians(), altitude.to_radians());
    let cos_h = (alt.sin() - lat.sin() * dec.sin()) / (lat.cos() * dec.cos());
    if !(-1.0..=1.0).contains(&cos_h) {
        return None; // the sun never reaches that altitude today
    }
    Some(cos_h.acos().to_degrees() / 15.0)
}

const SUNRISE_ALTITUDE: f64 = -0.833; // refraction 0.567 + half the sun's width 0.267

fn solar_noon(jd: f64, longitude: f64, timezone: f64) -> f64 {
    let (_, eqt) = sun_position(jd);
    12.0 + timezone - longitude / 15.0 - eqt / 60.0 // local clock hours
}

/// Local clock time when the sun reaches `altitude`, before noon (-1.0) or after (+1.0).
fn sun_event(jd: f64, latitude: f64, longitude: f64, timezone: f64, altitude: f64, direction: f64) -> Option<f64> {
    let mut t = solar_noon(jd, longitude, timezone); // first guess, then refine at the event itself
    for _ in 0..2 {
        let (dec, _) = sun_position(jd + (t - timezone) / 24.0);
        let h = hour_angle(latitude, dec, altitude)?;
        t = solar_noon(jd + (t - timezone) / 24.0, longitude, timezone) + direction * h;
    }
    Some(t)
}

fn hm(t: Option<f64>, round_up: bool) -> String {
    let Some(t) = t else { return "--:--".to_string() };
    let minutes = if round_up { (t * 60.0).ceil() } else { (t * 60.0).round() } as i64;
    format!("{:02}:{:02}", (minutes / 60) % 24, minutes % 60)
}

fn main() {
    let jd = julian_day(2026, 10, 17);
    let (lat, lon, tz) = (-6.2088, 106.8456, 7.0); // Jakarta, WIB
    let noon = solar_noon(jd, lon, tz);
    let rise = sun_event(jd, lat, lon, tz, SUNRISE_ALTITUDE, -1.0);
    let set = sun_event(jd, lat, lon, tz, SUNRISE_ALTITUDE, 1.0);
    println!("sunrise    {}   (end of Fajr)", hm(rise, false));
    println!("dhuhr      {}   (solar noon)", hm(Some(noon), false));
    println!("maghrib    {}   (sunset)", hm(set, false));
    let ihtiyat = 2.0 / 60.0;
    println!("kemenag    dhuhr {}, maghrib {}", hm(Some(noon + ihtiyat), true), hm(set.map(|s| s + ihtiyat), true));
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
import kotlin.math.*

fun rad(deg: Double) = deg * PI / 180
fun deg(rad: Double) = rad * 180 / PI
fun mod(a: Double, n: Double) = ((a % n) + n) % n

fun julianDay(year: Int, month: Int, day: Int): Double {
    var y = year
    var m = month
    if (m <= 2) {
        y -= 1
        m += 12
    }
    val a = y / 100
    val b = 2 - a + a / 4
    return floor(365.25 * (y + 4716)) + floor(30.6001 * (m + 1)) + day + b - 1524.5
}

data class SunPosition(val declination: Double, val equationOfTime: Double) // degrees, minutes

fun sunPosition(jd: Double): SunPosition {
    val d = jd - 2451545.0 // days since J2000.0
    val g = rad(mod(357.529 + 0.98560028 * d, 360.0))
    val q = mod(280.459 + 0.98564736 * d, 360.0)
    val l = rad(mod(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360.0))
    val e = rad(23.439 - 0.00000036 * d)
    val declination = deg(asin(sin(e) * sin(l)))
    val rightAscension = deg(atan2(cos(e) * sin(l), cos(l))) / 15
    val equationOfTime = mod(q / 15 - rightAscension + 12, 24.0) - 12
    return SunPosition(declination, equationOfTime * 60)
}

/** Hours between solar noon and the moment the sun stands at [altitude] degrees, or null if it never does today. */
fun hourAngle(latitude: Double, declination: Double, altitude: Double): Double? {
    val lat = rad(latitude)
    val dec = rad(declination)
    val alt = rad(altitude)
    val cosH = (sin(alt) - sin(lat) * sin(dec)) / (cos(lat) * cos(dec))
    if (cosH < -1 || cosH > 1) return null
    return deg(acos(cosH)) / 15
}

const val SUNRISE_ALTITUDE = -0.833 // refraction 0.567 + half the sun's width 0.267

fun solarNoon(jd: Double, longitude: Double, timezone: Double): Double {
    val sun = sunPosition(jd)
    return 12 + timezone - longitude / 15 - sun.equationOfTime / 60 // local clock hours
}

/** Local clock time when the sun reaches [altitude], before noon (direction -1) or after (+1). */
fun sunEvent(jd: Double, latitude: Double, longitude: Double, timezone: Double, altitude: Double, direction: Int): Double? {
    var t = solarNoon(jd, longitude, timezone) // first guess, then refine at the event itself
    repeat(2) {
        val sun = sunPosition(jd + (t - timezone) / 24)
        val h = hourAngle(latitude, sun.declination, altitude) ?: return null
        t = solarNoon(jd + (t - timezone) / 24, longitude, timezone) + direction * h
    }
    return t
}

fun hm(t: Double?, roundUp: Boolean = false): String {
    if (t == null) return "--:--"
    val minutes = (if (roundUp) ceil(t * 60) else (t * 60).roundToLong().toDouble()).toLong()
    return "%02d:%02d".format((minutes / 60) % 24, minutes % 60)
}

fun main() {
    val jd = julianDay(2026, 10, 17)
    val lat = -6.2088
    val lon = 106.8456
    val tz = 7.0 // Jakarta, WIB
    val noon = solarNoon(jd, lon, tz)
    val rise = sunEvent(jd, lat, lon, tz, SUNRISE_ALTITUDE, -1)
    val set = sunEvent(jd, lat, lon, tz, SUNRISE_ALTITUDE, 1)
    println("sunrise    ${hm(rise)}   (end of Fajr)")
    println("dhuhr      ${hm(noon)}   (solar noon)")
    println("maghrib    ${hm(set)}   (sunset)")
    val ihtiyat = 2.0 / 60
    println("kemenag    dhuhr ${hm(noon + ihtiyat, true)}, maghrib ${hm(set?.plus(ihtiyat), true)}")
}
```

  </TabItem>
  <TabItem value="dart" label="Dart">

```dart
import 'dart:math';

double rad(double deg) => deg * pi / 180;
double deg(double rad) => rad * 180 / pi;
double mod(double a, double n) => ((a % n) + n) % n;

double julianDay(int year, int month, int day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  final a = year ~/ 100;
  final b = 2 - a + a ~/ 4;
  return (365.25 * (year + 4716)).floorToDouble() + (30.6001 * (month + 1)).floorToDouble() + day + b - 1524.5;
}

/// Declination in degrees and equation of time in minutes.
({double declination, double equationOfTime}) sunPosition(double jd) {
  final d = jd - 2451545.0; // days since J2000.0
  final g = rad(mod(357.529 + 0.98560028 * d, 360));
  final q = mod(280.459 + 0.98564736 * d, 360);
  final l = rad(mod(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360));
  final e = rad(23.439 - 0.00000036 * d);
  final declination = deg(asin(sin(e) * sin(l)));
  final rightAscension = deg(atan2(cos(e) * sin(l), cos(l))) / 15;
  final equationOfTime = mod(q / 15 - rightAscension + 12, 24) - 12;
  return (declination: declination, equationOfTime: equationOfTime * 60);
}

/// Hours between solar noon and the moment the sun stands at [altitude] degrees, or null if it never does today.
double? hourAngle(double latitude, double declination, double altitude) {
  final lat = rad(latitude);
  final dec = rad(declination);
  final alt = rad(altitude);
  final cosH = (sin(alt) - sin(lat) * sin(dec)) / (cos(lat) * cos(dec));
  if (cosH < -1 || cosH > 1) return null;
  return deg(acos(cosH)) / 15;
}

const sunriseAltitude = -0.833; // refraction 0.567 + half the sun's width 0.267

double solarNoon(double jd, double longitude, double timezone) {
  final sun = sunPosition(jd);
  return 12 + timezone - longitude / 15 - sun.equationOfTime / 60; // local clock hours
}

/// Local clock time when the sun reaches [altitude], before noon (direction -1) or after (+1).
double? sunEvent(double jd, double latitude, double longitude, double timezone, double altitude, int direction) {
  var t = solarNoon(jd, longitude, timezone); // first guess, then refine at the event itself
  for (var i = 0; i < 2; i++) {
    final sun = sunPosition(jd + (t - timezone) / 24);
    final h = hourAngle(latitude, sun.declination, altitude);
    if (h == null) return null;
    t = solarNoon(jd + (t - timezone) / 24, longitude, timezone) + direction * h;
  }
  return t;
}

String hm(double? t, {bool roundUp = false}) {
  if (t == null) return '--:--';
  final minutes = roundUp ? (t * 60).ceil() : (t * 60).round();
  return '${((minutes ~/ 60) % 24).toString().padLeft(2, '0')}:${(minutes % 60).toString().padLeft(2, '0')}';
}

void main() {
  final jd = julianDay(2026, 10, 17);
  const lat = -6.2088, lon = 106.8456, tz = 7.0; // Jakarta, WIB
  final noon = solarNoon(jd, lon, tz);
  final rise = sunEvent(jd, lat, lon, tz, sunriseAltitude, -1);
  final set = sunEvent(jd, lat, lon, tz, sunriseAltitude, 1);
  print('sunrise    ${hm(rise)}   (end of Fajr)');
  print('dhuhr      ${hm(noon)}   (solar noon)');
  print('maghrib    ${hm(set)}   (sunset)');
  const ihtiyat = 2.0 / 60;
  print('kemenag    dhuhr ${hm(noon + ihtiyat, roundUp: true)}, maghrib ${hm(set == null ? null : set + ihtiyat, roundUp: true)}');
}
```

  </TabItem>
  <TabItem value="c" label="C">

```c
#include <math.h>
#include <stdbool.h>
#include <stdio.h>

#define PI 3.14159265358979323846

static double rad(double deg) { return deg * PI / 180.0; }
static double deg(double rad) { return rad * 180.0 / PI; }
static double mod(double a, double n) { return fmod(fmod(a, n) + n, n); }

static double julian_day(int year, int month, int day) {
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    int a = year / 100;
    int b = 2 - a + a / 4;
    return floor(365.25 * (year + 4716)) + floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

typedef struct {
    double declination;      /* degrees */
    double equation_of_time; /* minutes */
} sun_position_t;

static sun_position_t sun_position(double jd) {
    double d = jd - 2451545.0; /* days since J2000.0 */
    double g = rad(mod(357.529 + 0.98560028 * d, 360));
    double q = mod(280.459 + 0.98564736 * d, 360);
    double L = rad(mod(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360));
    double e = rad(23.439 - 0.00000036 * d);
    double declination = deg(asin(sin(e) * sin(L)));
    double right_ascension = deg(atan2(cos(e) * sin(L), cos(L))) / 15;
    double equation_of_time = mod(q / 15 - right_ascension + 12, 24) - 12;
    return (sun_position_t){declination, equation_of_time * 60};
}

/* Hours between solar noon and the moment the sun stands at `altitude` degrees.
   Returns NAN when the sun never reaches that altitude today. */
static double hour_angle(double latitude, double declination, double altitude) {
    double lat = rad(latitude), dec = rad(declination), alt = rad(altitude);
    double cos_h = (sin(alt) - sin(lat) * sin(dec)) / (cos(lat) * cos(dec));
    if (cos_h < -1 || cos_h > 1)
        return NAN;
    return deg(acos(cos_h)) / 15;
}

#define SUNRISE_ALTITUDE (-0.833) /* refraction 0.567 + half the sun's width 0.267 */

static double solar_noon(double jd, double longitude, double timezone) {
    sun_position_t sun = sun_position(jd);
    return 12 + timezone - longitude / 15 - sun.equation_of_time / 60; /* local clock hours */
}

/* Local clock time when the sun reaches `altitude`, before noon (-1) or after (+1). */
static double sun_event(double jd, double latitude, double longitude, double timezone,
                        double altitude, double direction) {
    double t = solar_noon(jd, longitude, timezone); /* first guess, then refine at the event itself */
    for (int i = 0; i < 2; i++) {
        sun_position_t sun = sun_position(jd + (t - timezone) / 24);
        double h = hour_angle(latitude, sun.declination, altitude);
        if (isnan(h))
            return NAN;
        t = solar_noon(jd + (t - timezone) / 24, longitude, timezone) + direction * h;
    }
    return t;
}

static void hm(double t, bool round_up, char out[8]) {
    if (isnan(t)) {
        snprintf(out, 8, "--:--");
        return;
    }
    long minutes = (long)(round_up ? ceil(t * 60) : round(t * 60));
    snprintf(out, 8, "%02ld:%02ld", (minutes / 60) % 24, minutes % 60);
}

int main(void) {
    double jd = julian_day(2026, 10, 17);
    double lat = -6.2088, lon = 106.8456, tz = 7; /* Jakarta, WIB */
    double noon = solar_noon(jd, lon, tz);
    double rise = sun_event(jd, lat, lon, tz, SUNRISE_ALTITUDE, -1);
    double set = sun_event(jd, lat, lon, tz, SUNRISE_ALTITUDE, 1);
    char a[8], b[8];
    hm(rise, false, a);
    printf("sunrise    %s   (end of Fajr)\n", a);
    hm(noon, false, a);
    printf("dhuhr      %s   (solar noon)\n", a);
    hm(set, false, a);
    printf("maghrib    %s   (sunset)\n", a);
    double ihtiyat = 2.0 / 60;
    hm(noon + ihtiyat, true, a);
    hm(set + ihtiyat, true, b);
    printf("kemenag    dhuhr %s, maghrib %s\n", a, b);
    return 0;
}
```

Build with `gcc -std=c23 events.c -lm -o events`.

  </TabItem>
</Tabs>

Two lines deserve a comment.

`jd + (t - timezone) / 24` is how we ask for the sun's position at a particular moment. `jd` is midnight UTC at the start of the date, `t` is a local clock time in hours, and subtracting the timezone turns it into UTC. Divide by 24 and it becomes a fraction of a day to add to the Julian day.

`hour_angle` returns nothing when `cos(H)` falls outside −1 to 1. That is not an error. It is the formula telling you that the sun never reaches that altitude today: no sunrise at all in the polar night, or no true darkness in a northern summer. Part 7 is about what a timetable should do then. For Jakarta it never happens.

## Check your work

Run the program. For Jakarta on 17 October 2026 you should see:

```text
sunrise    05:31   (end of Fajr)
dhuhr      11:38   (solar noon)
maghrib    17:45   (sunset)
kemenag    dhuhr 11:41, maghrib 17:48
```

The last line is what the Kemenag timetable for Jakarta prints for that day, and what Muslimtify shows with the default method. The three lines above it are the astronomy before precaution and rounding.

Now check against something independent. The NOAA solar calculator from part 2 gives sunrise and sunset for any place and date. For Jakarta on 17 October it should agree with the first and third lines to the minute.

Then check against the sky. Sunset is the easiest prayer time to see with your own eyes. On 17 October, if the western horizon in Jakarta is clear, the last edge of the sun drops out of sight at 17:45 and a half. The adhan for Maghrib from the nearest mosque will follow about two and a half minutes later, which is the ihtiyat and the rounding. If it comes earlier than the sun, something is wrong with the mosque's table, not with the sun.

Finally, try your own city. Change the three numbers on the `lat, lon, tz` line and run it again. If you live north of about 50°, try 21 June as well as 17 October and watch the day length change.

## What to carry into part 4

One new formula, the hour angle, which turns "when does the sun reach this height" into "this many hours from noon". One new constant, 0.833°, which is where the sun's center sits when its edge touches the horizon. One new habit, refining the answer at the moment of the event. With those three, Dhuhr, sunrise and Maghrib are done, and they match the production library to the second.

Part 4 asks the same question with a different altitude. Instead of 0.833° below the horizon, Fajr asks for 18° or 20°, and Isha asks for 17° or 18°. The formula does not change at all. What changes is where those numbers come from, why they differ from country to country, and what the sky looks like when the sun is that far below the horizon. That is the post where the hadith about the white thread meets the code.
