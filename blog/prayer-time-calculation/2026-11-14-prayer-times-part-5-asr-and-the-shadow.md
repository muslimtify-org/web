---
slug: prayer-times-part-5-asr-and-the-shadow
title: "Prayer times, part 5: Asr and the shadow"
authors:
  - rizukirr
tags: [muslimtify, prayer-time-calculation]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

{/*
  REVIEW NOTES (not rendered):
  - The Python, TypeScript, Rust and C snippets were run. Jakarta 2026-10-17: standard Asr
    14:45, Hanafi 15:56, Kemenag 14:48, matching libmuslim with asr_shadow 1 and 2. The raw
    values differ from libmuslim by 4 seconds because this code refines at the event and
    libmuslim uses the 0h UT declination for Asr. Go, Kotlin and Dart were NOT run.
  - The fiqh statements (noon shadow added, Hanafi two shadows, the two days of the hadith
    of Jibril) are mainstream but should be checked by a reviewer. Marked VERIFY.
*/}

Every prayer so far has been about the horizon: the sun crossing it, or sitting some number of degrees below it. Asr is different. Asr is about a shadow.

That makes it the one prayer time you can measure with no instrument but a stick, and it is also the one prayer whose time is set by your madhhab rather than by your country. Both of those facts come straight out of the texts in part 1, and both end up as a single line in the code.

{/* truncate */}

:::info[This is part 5 of a series]
[Part 1](/blog/prayer-times-part-1-what-the-quran-and-sunnah-say) covered the sources. [Part 2](/blog/prayer-times-part-2-where-is-the-sun) found the sun. [Part 3](/blog/prayer-times-part-3-sunrise-dhuhr-and-maghrib) computed sunrise, Dhuhr and Maghrib. [Part 4](/blog/prayer-times-part-4-fajr-isha-and-the-twilight-angles) computed Fajr and Isha. This part completes the five. The full series is under the [prayer time calculation](/blog/tags/prayer-time-calculation) tag.
:::

## What the texts say

The hadith of Abdullah ibn Amr in part 1 gives the end of Dhuhr and the start of Asr in one phrase: Dhuhr lasts from the sun's decline "for as long as a man's shadow is the length of his height, until Asr has come". Asr begins when your shadow is as long as you are tall.

The hadith of Jibril adds the detail that split the schools. On the first day Jibril prayed Asr "when the shadow of a thing was equal to it", and on the second day "when the shadow of a thing was twice it". Malik, ash-Shafi'i and Ahmad read the first day as the start of Asr and the second as its preferred end. Abu Hanifa read the second day as the start. So for three schools Asr begins at one shadow length, and for the Hanafi school at two. {/* VERIFY: the standard account of the Hanafi position and the response of the other schools */}

There is one more detail the jurists added, and it matters for the math. At noon a stick already has a shadow, short or long depending on the season and where you live. The schools agree that this noon shadow, *fay' az-zawal*, does not count. Asr begins when the shadow has grown *by* one stick height beyond whatever it was at noon, or by two for the Hanafi school. {/* VERIFY: fay' az-zawal is added in all four schools */}

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 800 400" role="img" aria-label="A vertical stick on flat ground with three shadow lengths marked: the short noon shadow, the noon shadow plus the stick's height for the standard Asr, and the noon shadow plus twice the height for the Hanafi Asr, with the sun's position drawn for each" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<line x1="40" y1="300" x2="760" y2="300" stroke="currentColor" strokeWidth="2" />
<line x1="300" y1="300" x2="300" y2="170" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
<text x="288" y="235.0" textAnchor="end" fill="currentColor">height</text>
<line x1="336" y1="300" x2="260.0" y2="25.4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
<circle cx="260.0" cy="25.4" r="9" fill="currentColor" fillOpacity="0.5" />
<line x1="300" y1="314" x2="336" y2="314" stroke="currentColor" strokeWidth="2" />
<line x1="336" y1="309" x2="336" y2="319" stroke="currentColor" strokeWidth="2" />
<text x="344" y="318" fill="currentColor" fontWeight="400">noon shadow</text>
<line x1="466" y1="300" x2="181.9" y2="77.5" stroke="var(--ifm-color-primary)" strokeWidth="1.5" strokeDasharray="4 4" />
<circle cx="181.9" cy="77.5" r="9" fill="var(--ifm-color-primary)" fillOpacity="1" />
<line x1="300" y1="340" x2="466" y2="340" stroke="var(--ifm-color-primary)" strokeWidth="2" />
<line x1="466" y1="335" x2="466" y2="345" stroke="var(--ifm-color-primary)" strokeWidth="2" />
<text x="474" y="344" fill="var(--ifm-color-primary)" fontWeight="600">noon shadow + height, Asr (standard)</text>
<line x1="596" y1="300" x2="162.7" y2="109.7" stroke="var(--ifm-color-primary)" strokeWidth="1.5" strokeDasharray="4 4" />
<circle cx="162.7" cy="109.7" r="9" fill="var(--ifm-color-primary)" fillOpacity="1" />
<line x1="300" y1="366" x2="596" y2="366" stroke="var(--ifm-color-primary)" strokeWidth="2" />
<line x1="596" y1="361" x2="596" y2="371" stroke="var(--ifm-color-primary)" strokeWidth="2" />
<text x="308" y="382" fill="var(--ifm-color-primary)" fontWeight="600">noon shadow + 2 × height, Asr (Hanafi)</text>
<line x1="300" y1="309" x2="300" y2="371" stroke="currentColor" strokeWidth="1" />
<text x="760" y="24" textAnchor="end" fill="currentColor" fontSize="11">the sun sinks to the left as the afternoon goes on</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>The stick from part 1. At noon the shadow is at its shortest. Asr begins when the shadow has grown by the stick's own height (most schools) or by twice its height (Hanafi). The noon shadow is drawn long here to make the construction clear; in Jakarta in October it is a few percent of the height.</figcaption>
</figure>

## From a shadow to an angle

A stick's shadow is simple geometry. If the sun is at altitude `a` above the horizon, a stick of height 1 casts a shadow of length `1 / tan(a)`. High sun, short shadow. Low sun, long shadow.

At noon the sun is as high as it gets, and from part 2 we know how high: it is overhead minus the gap between your latitude and today's declination. In Jakarta on 17 October 2026 that gap is 3.0°, so the noon sun is 87.0° up and the noon shadow is `tan(3.0°)`, about 0.05 stick heights. In Istanbul the same day the gap is 50.2° and the noon shadow is 1.2 stick heights, already longer than the stick.

Asr begins when the shadow equals the noon shadow plus one stick height (or two). Put that into the shadow formula and solve for the altitude:

```text
noon_shadow = tan( |latitude - declination| )
shadow at Asr = noon_shadow + n              n = 1 for most schools, 2 for Hanafi
altitude at Asr = atan( 1 / (noon_shadow + n) )
```

For Jakarta on 17 October: `atan(1 / (0.05 + 1))` is 43.5°, and `atan(1 / (0.05 + 2))` is 26.0°. Asr begins when the afternoon sun has come down to 43.5° above the horizon, or 26.0° for the Hanafi school.

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 760 340" role="img" aria-label="The length of a stick's shadow through the afternoon in Jakarta on 17 October 2026, nearly zero at noon and rising steeply toward sunset, with the standard Asr marked where the shadow reaches one stick height and the Hanafi Asr where it reaches two" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<line x1="70" y1="280.0" x2="720" y2="280.0" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="284.0" textAnchor="end" fill="currentColor">0×</text>
<line x1="70" y1="217.5" x2="720" y2="217.5" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="221.5" textAnchor="end" fill="currentColor">1×</text>
<line x1="70" y1="155.0" x2="720" y2="155.0" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="159.0" textAnchor="end" fill="currentColor">2×</text>
<line x1="70" y1="92.5" x2="720" y2="92.5" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="96.5" textAnchor="end" fill="currentColor">3×</text>
<line x1="70" y1="30.0" x2="720" y2="30.0" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="34.0" textAnchor="end" fill="currentColor">4×</text>
<line x1="70.0" y1="30" x2="70.0" y2="280" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="70.0" y="298" textAnchor="middle" fill="currentColor">11:00</text>
<line x1="170.0" y1="30" x2="170.0" y2="280" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="170.0" y="298" textAnchor="middle" fill="currentColor">12:00</text>
<line x1="270.0" y1="30" x2="270.0" y2="280" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="270.0" y="298" textAnchor="middle" fill="currentColor">13:00</text>
<line x1="370.0" y1="30" x2="370.0" y2="280" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="370.0" y="298" textAnchor="middle" fill="currentColor">14:00</text>
<line x1="470.0" y1="30" x2="470.0" y2="280" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="470.0" y="298" textAnchor="middle" fill="currentColor">15:00</text>
<line x1="570.0" y1="30" x2="570.0" y2="280" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="570.0" y="298" textAnchor="middle" fill="currentColor">16:00</text>
<line x1="670.0" y1="30" x2="670.0" y2="280" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="670.0" y="298" textAnchor="middle" fill="currentColor">17:00</text>
<text x="76" y="20" fill="currentColor">shadow length, in stick heights</text>
<polyline points="70.0,269.1 71.7,269.4 73.3,269.6 75.0,269.9 76.7,270.2 78.3,270.4 80.0,270.7 81.7,270.9 83.3,271.2 85.0,271.4 86.7,271.7 88.3,271.9 90.0,272.2 91.7,272.4 93.3,272.7 95.0,272.9 96.7,273.2 98.3,273.4 100.0,273.6 101.7,273.9 103.3,274.1 105.0,274.3 106.7,274.5 108.3,274.8 110.0,275.0 111.7,275.2 113.3,275.4 115.0,275.5 116.7,275.7 118.3,275.9 120.0,276.0 121.7,276.2 123.3,276.3 125.0,276.4 126.7,276.5 128.3,276.6 130.0,276.6 131.7,276.7 133.3,276.7 135.0,276.7 136.7,276.6 138.3,276.6 140.0,276.5 141.7,276.4 143.3,276.3 145.0,276.2 146.7,276.0 148.3,275.9 150.0,275.7 151.7,275.5 153.3,275.4 155.0,275.2 156.7,275.0 158.3,274.8 160.0,274.5 161.7,274.3 163.3,274.1 165.0,273.9 166.7,273.6 168.3,273.4 170.0,273.2 171.7,272.9 173.3,272.7 175.0,272.4 176.7,272.2 178.3,271.9 180.0,271.7 181.7,271.4 183.3,271.2 185.0,270.9 186.7,270.7 188.3,270.4 190.0,270.2 191.7,269.9 193.3,269.6 195.0,269.4 196.7,269.1 198.3,268.8 200.0,268.6 201.7,268.3 203.3,268.0 205.0,267.8 206.7,267.5 208.3,267.2 210.0,267.0 211.7,266.7 213.3,266.4 215.0,266.1 216.7,265.9 218.3,265.6 220.0,265.3 221.7,265.0 223.3,264.7 225.0,264.5 226.7,264.2 228.3,263.9 230.0,263.6 231.7,263.3 233.3,263.1 235.0,262.8 236.7,262.5 238.3,262.2 240.0,261.9 241.7,261.6 243.3,261.3 245.0,261.0 246.7,260.8 248.3,260.5 250.0,260.2 251.7,259.9 253.3,259.6 255.0,259.3 256.7,259.0 258.3,258.7 260.0,258.4 261.7,258.1 263.3,257.8 265.0,257.5 266.7,257.2 268.3,256.9 270.0,256.6 271.7,256.3 273.3,256.0 275.0,255.7 276.7,255.4 278.3,255.1 280.0,254.7 281.7,254.4 283.3,254.1 285.0,253.8 286.7,253.5 288.3,253.2 290.0,252.9 291.7,252.5 293.3,252.2 295.0,251.9 296.7,251.6 298.3,251.2 300.0,250.9 301.7,250.6 303.3,250.3 305.0,249.9 306.7,249.6 308.3,249.3 310.0,248.9 311.7,248.6 313.3,248.3 315.0,247.9 316.7,247.6 318.3,247.2 320.0,246.9 321.7,246.6 323.3,246.2 325.0,245.9 326.7,245.5 328.3,245.2 330.0,244.8 331.7,244.5 333.3,244.1 335.0,243.7 336.7,243.4 338.3,243.0 340.0,242.7 341.7,242.3 343.3,241.9 345.0,241.6 346.7,241.2 348.3,240.8 350.0,240.4 351.7,240.1 353.3,239.7 355.0,239.3 356.7,238.9 358.3,238.5 360.0,238.1 361.7,237.7 363.3,237.4 365.0,237.0 366.7,236.6 368.3,236.2 370.0,235.8 371.7,235.4 373.3,234.9 375.0,234.5 376.7,234.1 378.3,233.7 380.0,233.3 381.7,232.9 383.3,232.4 385.0,232.0 386.7,231.6 388.3,231.2 390.0,230.7 391.7,230.3 393.3,229.8 395.0,229.4 396.7,229.0 398.3,228.5 400.0,228.0 401.7,227.6 403.3,227.1 405.0,226.7 406.7,226.2 408.3,225.7 410.0,225.3 411.7,224.8 413.3,224.3 415.0,223.8 416.7,223.3 418.3,222.8 420.0,222.3 421.7,221.8 423.3,221.3 425.0,220.8 426.7,220.3 428.3,219.8 430.0,219.3 431.7,218.7 433.3,218.2 435.0,217.7 436.7,217.1 438.3,216.6 440.0,216.1 441.7,215.5 443.3,214.9 445.0,214.4 446.7,213.8 448.3,213.2 450.0,212.7 451.7,212.1 453.3,211.5 455.0,210.9 456.7,210.3 458.3,209.7 460.0,209.1 461.7,208.4 463.3,207.8 465.0,207.2 466.7,206.6 468.3,205.9 470.0,205.3 471.7,204.6 473.3,203.9 475.0,203.3 476.7,202.6 478.3,201.9 480.0,201.2 481.7,200.5 483.3,199.8 485.0,199.1 486.7,198.4 488.3,197.6 490.0,196.9 491.7,196.1 493.3,195.4 495.0,194.6 496.7,193.8 498.3,193.0 500.0,192.3 501.7,191.5 503.3,190.6 505.0,189.8 506.7,189.0 508.3,188.1 510.0,187.3 511.7,186.4 513.3,185.5 515.0,184.6 516.7,183.7 518.3,182.8 520.0,181.9 521.7,181.0 523.3,180.0 525.0,179.0 526.7,178.1 528.3,177.1 530.0,176.1 531.7,175.1 533.3,174.0 535.0,173.0 536.7,171.9 538.3,170.8 540.0,169.7 541.7,168.6 543.3,167.5 545.0,166.3 546.7,165.2 548.3,164.0 550.0,162.8 551.7,161.5 553.3,160.3 555.0,159.0 556.7,157.7 558.3,156.4 560.0,155.1 561.7,153.7 563.3,152.4 565.0,151.0 566.7,149.5 568.3,148.1 570.0,146.6 571.7,145.1 573.3,143.6 575.0,142.0 576.7,140.4 578.3,138.8 580.0,137.1 581.7,135.4 583.3,133.7 585.0,131.9 586.7,130.1 588.3,128.3 590.0,126.4 591.7,124.5 593.3,122.6 595.0,120.6 596.7,118.5 598.3,116.5 600.0,114.3 601.7,112.1 603.3,109.9 605.0,107.6 606.7,105.3 608.3,102.9 610.0,100.4 611.7,97.9 613.3,95.3 615.0,92.7 616.7,90.0 618.3,87.2 620.0,84.3 621.7,81.4 623.3,78.4 625.0,75.2 626.7,72.1 628.3,68.8 630.0,65.4 631.7,61.9 633.3,58.3 635.0,54.6 636.7,50.8 638.3,46.8 640.0,42.8 641.7,38.6 643.3,34.2" fill="none" stroke="currentColor" strokeWidth="2" />
<line x1="70" y1="214.2" x2="445.6" y2="214.2" stroke="var(--ifm-color-primary)" strokeWidth="1.5" strokeDasharray="6 4" />
<line x1="445.6" y1="214.2" x2="445.6" y2="280" stroke="var(--ifm-color-primary)" strokeWidth="1.5" strokeDasharray="6 4" />
<circle cx="445.6" cy="214.2" r="5" fill="var(--ifm-color-primary)" />
<text x="453.6" y="206.2" fill="var(--ifm-color-primary)" fontWeight="600">standard Asr 14:45</text>
<text x="76" y="208.2" fill="var(--ifm-color-primary)" fontSize="11">noon shadow + 1</text>
<line x1="70" y1="151.7" x2="564.1" y2="151.7" stroke="var(--ifm-color-primary)" strokeWidth="1.5" strokeDasharray="6 4" />
<line x1="564.1" y1="151.7" x2="564.1" y2="280" stroke="var(--ifm-color-primary)" strokeWidth="1.5" strokeDasharray="6 4" />
<circle cx="564.1" cy="151.7" r="5" fill="var(--ifm-color-primary)" />
<text x="572.1" y="143.7" fill="var(--ifm-color-primary)" fontWeight="600">Hanafi Asr 15:56</text>
<text x="76" y="145.7" fill="var(--ifm-color-primary)" fontSize="11">noon shadow + 2</text>
<circle cx="133.4" cy="276.7" r="5" fill="currentColor" />
<text x="141.4" y="268.7" fill="currentColor">noon, shadow 0.05×</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>A stick's shadow in Jakarta on 17 October 2026, measured in stick heights. The sun is almost overhead at noon so the shadow nearly vanishes, then it lengthens faster and faster. Asr is where the curve crosses the dashed lines.</figcaption>
</figure>

And now we are back on familiar ground. "At what time does the sun reach 43.5° above the horizon, after noon?" is exactly the question `sun_event` from part 3 answers. The only difference from every earlier use is that the altitude is positive. The function does not care.

## Why Asr is a madhhab setting, not a country setting

Look at what goes into the Asr altitude: your latitude, today's declination, and the number `n`. There is no twilight, no observation of the sky, nothing for a national authority to measure and decide. The only choice is `n`, and `n` is a question of which reading of the hadith of Jibril you follow. That is a question of madhhab.

So Muslimtify keeps Asr separate from the calculation method. You pick Kemenag or Diyanet or ISNA for Fajr and Isha, and you pick your madhhab for Asr, and the two settings do not touch. A Hanafi in Jakarta uses Kemenag's 20° and the two-shadow Asr. A Shafi'i in Istanbul uses Diyanet's angles and the one-shadow Asr. The [calculation methods page](/docs/calculation-methods#asr-and-madzhab) in the docs describes the setting.

## The code

Add this to the file from part 3, in place of its last block. `asr_altitude` is the formula above. `asr` computes the noon declination, turns it into the altitude, and hands the altitude to `sun_event` to find the time.

<Tabs groupId="lang" queryString>
  <TabItem value="python" label="Python" default>

```python
def asr_altitude(latitude, declination, shadow_factor):
    """Sun altitude when a stick's shadow is its noon shadow plus shadow_factor times its height."""
    noon_zenith = abs(latitude - declination)  # degrees between the noon sun and straight overhead
    return math.degrees(math.atan(1 / (shadow_factor + math.tan(math.radians(noon_zenith)))))

def asr(jd, latitude, longitude, timezone, shadow_factor=1):
    noon = solar_noon(jd, longitude, timezone)
    declination, _ = sun_position(jd + (noon - timezone) / 24)
    altitude = asr_altitude(latitude, declination, shadow_factor)
    return sun_event(jd, latitude, longitude, timezone, altitude, +1)

if __name__ == "__main__":
    jd = julian_day(2026, 10, 17)
    lat, lon, tz = -6.2088, 106.8456, 7  # Jakarta, WIB
    standard = asr(jd, lat, lon, tz, 1)
    hanafi = asr(jd, lat, lon, tz, 2)
    print(f"asr, shadow = height       {hm(standard)}   (Shafi'i, Maliki, Hanbali)")
    print(f"asr, shadow = 2 x height   {hm(hanafi)}   (Hanafi)")
    ihtiyat = 2 / 60
    print(f"kemenag                    {hm(standard + ihtiyat, round_up=True)}   (standard, +2 min, rounded up)")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
/** Sun altitude when a stick's shadow is its noon shadow plus `shadowFactor` times its height. */
function asrAltitude(latitude: number, declination: number, shadowFactor: number): number {
  const noonZenith = Math.abs(latitude - declination); // degrees between the noon sun and straight overhead
  return deg(Math.atan(1 / (shadowFactor + Math.tan(rad(noonZenith)))));
}

function asr(jd: number, latitude: number, longitude: number, timezone: number, shadowFactor = 1): number | null {
  const noon = solarNoon(jd, longitude, timezone);
  const { declination } = sunPosition(jd + (noon - timezone) / 24);
  return sunEvent(jd, latitude, longitude, timezone, asrAltitude(latitude, declination, shadowFactor), 1);
}

const jd = julianDay(2026, 10, 17);
const [lat, lon, tz] = [-6.2088, 106.8456, 7]; // Jakarta, WIB
const standard = asr(jd, lat, lon, tz, 1);
const hanafi = asr(jd, lat, lon, tz, 2);
console.log(`asr, shadow = height       ${hm(standard)}   (Shafi'i, Maliki, Hanbali)`);
console.log(`asr, shadow = 2 x height   ${hm(hanafi)}   (Hanafi)`);
const ihtiyat = 2 / 60;
console.log(`kemenag                    ${hm(standard === null ? null : standard + ihtiyat, true)}   (standard, +2 min, rounded up)`);
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
// asrAltitude is the sun's altitude when a stick's shadow is its noon shadow
// plus shadowFactor times its height.
func asrAltitude(latitude, declination, shadowFactor float64) float64 {
	noonZenith := math.Abs(latitude - declination) // degrees between the noon sun and straight overhead
	return deg(math.Atan(1 / (shadowFactor + math.Tan(rad(noonZenith)))))
}

func asr(jd, latitude, longitude, timezone, shadowFactor float64) (float64, bool) {
	noon := solarNoon(jd, longitude, timezone)
	declination, _ := sunPosition(jd + (noon-timezone)/24)
	return sunEvent(jd, latitude, longitude, timezone, asrAltitude(latitude, declination, shadowFactor), 1)
}

func main() {
	jd := julianDay(2026, 10, 17)
	lat, lon, tz := -6.2088, 106.8456, 7.0 // Jakarta, WIB
	standard, sOk := asr(jd, lat, lon, tz, 1)
	hanafi, hOk := asr(jd, lat, lon, tz, 2)
	fmt.Printf("asr, shadow = height       %s   (Shafi'i, Maliki, Hanbali)\n", hm(standard, sOk, false))
	fmt.Printf("asr, shadow = 2 x height   %s   (Hanafi)\n", hm(hanafi, hOk, false))
	ihtiyat := 2.0 / 60
	fmt.Printf("kemenag                    %s   (standard, +2 min, rounded up)\n", hm(standard+ihtiyat, sOk, true))
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
/// Sun altitude when a stick's shadow is its noon shadow plus `shadow_factor` times its height.
fn asr_altitude(latitude: f64, declination: f64, shadow_factor: f64) -> f64 {
    let noon_zenith = (latitude - declination).abs(); // degrees between the noon sun and straight overhead
    (1.0 / (shadow_factor + noon_zenith.to_radians().tan())).atan().to_degrees()
}

fn asr(jd: f64, latitude: f64, longitude: f64, timezone: f64, shadow_factor: f64) -> Option<f64> {
    let noon = solar_noon(jd, longitude, timezone);
    let (declination, _) = sun_position(jd + (noon - timezone) / 24.0);
    sun_event(jd, latitude, longitude, timezone, asr_altitude(latitude, declination, shadow_factor), 1.0)
}

fn main() {
    let jd = julian_day(2026, 10, 17);
    let (lat, lon, tz) = (-6.2088, 106.8456, 7.0); // Jakarta, WIB
    let standard = asr(jd, lat, lon, tz, 1.0);
    let hanafi = asr(jd, lat, lon, tz, 2.0);
    println!("asr, shadow = height       {}   (Shafi'i, Maliki, Hanbali)", hm(standard, false));
    println!("asr, shadow = 2 x height   {}   (Hanafi)", hm(hanafi, false));
    let ihtiyat = 2.0 / 60.0;
    println!("kemenag                    {}   (standard, +2 min, rounded up)", hm(standard.map(|t| t + ihtiyat), true));
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
/** Sun altitude when a stick's shadow is its noon shadow plus [shadowFactor] times its height. */
fun asrAltitude(latitude: Double, declination: Double, shadowFactor: Double): Double {
    val noonZenith = abs(latitude - declination) // degrees between the noon sun and straight overhead
    return deg(atan(1 / (shadowFactor + tan(rad(noonZenith)))))
}

fun asr(jd: Double, latitude: Double, longitude: Double, timezone: Double, shadowFactor: Double = 1.0): Double? {
    val noon = solarNoon(jd, longitude, timezone)
    val sun = sunPosition(jd + (noon - timezone) / 24)
    return sunEvent(jd, latitude, longitude, timezone, asrAltitude(latitude, sun.declination, shadowFactor), 1)
}

fun main() {
    val jd = julianDay(2026, 10, 17)
    val lat = -6.2088
    val lon = 106.8456
    val tz = 7.0 // Jakarta, WIB
    val standard = asr(jd, lat, lon, tz, 1.0)
    val hanafi = asr(jd, lat, lon, tz, 2.0)
    println("asr, shadow = height       ${hm(standard)}   (Shafi'i, Maliki, Hanbali)")
    println("asr, shadow = 2 x height   ${hm(hanafi)}   (Hanafi)")
    val ihtiyat = 2.0 / 60
    println("kemenag                    ${hm(standard?.plus(ihtiyat), true)}   (standard, +2 min, rounded up)")
}
```

  </TabItem>
  <TabItem value="dart" label="Dart">

```dart
/// Sun altitude when a stick's shadow is its noon shadow plus [shadowFactor] times its height.
double asrAltitude(double latitude, double declination, double shadowFactor) {
  final noonZenith = (latitude - declination).abs(); // degrees between the noon sun and straight overhead
  return deg(atan(1 / (shadowFactor + tan(rad(noonZenith)))));
}

double? asr(double jd, double latitude, double longitude, double timezone, {double shadowFactor = 1}) {
  final noon = solarNoon(jd, longitude, timezone);
  final sun = sunPosition(jd + (noon - timezone) / 24);
  return sunEvent(jd, latitude, longitude, timezone, asrAltitude(latitude, sun.declination, shadowFactor), 1);
}

void main() {
  final jd = julianDay(2026, 10, 17);
  const lat = -6.2088, lon = 106.8456, tz = 7.0; // Jakarta, WIB
  final standard = asr(jd, lat, lon, tz, shadowFactor: 1);
  final hanafi = asr(jd, lat, lon, tz, shadowFactor: 2);
  print("asr, shadow = height       ${hm(standard)}   (Shafi'i, Maliki, Hanbali)");
  print('asr, shadow = 2 x height   ${hm(hanafi)}   (Hanafi)');
  const ihtiyat = 2.0 / 60;
  print('kemenag                    ${hm(standard == null ? null : standard + ihtiyat, roundUp: true)}   (standard, +2 min, rounded up)');
}
```

  </TabItem>
  <TabItem value="c" label="C">

```c
/* Sun altitude when a stick's shadow is its noon shadow plus shadow_factor times its height. */
static double asr_altitude(double latitude, double declination, double shadow_factor) {
    double noon_zenith = fabs(latitude - declination); /* degrees between the noon sun and straight overhead */
    return deg(atan(1 / (shadow_factor + tan(rad(noon_zenith)))));
}

static double asr(double jd, double latitude, double longitude, double timezone, double shadow_factor) {
    double noon = solar_noon(jd, longitude, timezone);
    sun_position_t sun = sun_position(jd + (noon - timezone) / 24);
    return sun_event(jd, latitude, longitude, timezone, asr_altitude(latitude, sun.declination, shadow_factor), 1);
}

int main(void) {
    double jd = julian_day(2026, 10, 17);
    double lat = -6.2088, lon = 106.8456, tz = 7; /* Jakarta, WIB */
    double standard = asr(jd, lat, lon, tz, 1);
    double hanafi = asr(jd, lat, lon, tz, 2);
    char a[8];
    hm(standard, false, a);
    printf("asr, shadow = height       %s   (Shafi'i, Maliki, Hanbali)\n", a);
    hm(hanafi, false, a);
    printf("asr, shadow = 2 x height   %s   (Hanafi)\n", a);
    double ihtiyat = 2.0 / 60;
    hm(standard + ihtiyat, true, a);
    printf("kemenag                    %s   (standard, +2 min, rounded up)\n", a);
    return 0;
}
```

  </TabItem>
</Tabs>

One subtlety. `asr_altitude` uses the declination at noon, and `sun_event` then refines the time using the declination at Asr itself. Between noon and Asr the declination moves by a few hundredths of a degree, which changes the shadow by less than a thousandth of a stick height. libmuslim takes the slightly simpler route of using the start-of-day declination for the whole Asr calculation. The two agree to within four seconds for Jakarta, which is why the post does not bother to recompute the altitude inside the loop.

## Check your work

Run it. For Jakarta on 17 October 2026 you should see:

```text
asr, shadow = height       14:45   (Shafi'i, Maliki, Hanbali)
asr, shadow = 2 x height   15:56   (Hanafi)
kemenag                    14:48   (standard, +2 min, rounded up)
```

The last line is the Kemenag timetable's Asr for Jakarta and what Muslimtify shows by default. Switch the madhhab setting to Hanafi and it will show 15:59, the second line plus the same two minutes and rounding.

The gap between the two schools is 71 minutes in Jakarta today. It is not the same everywhere: the shadow grows faster when the sun is lower in the sky, so in winter at higher latitudes the two Asrs can be less than half an hour apart, and in Jakarta, where the afternoon sun stays high for a long time, they are further apart than almost anywhere.

Then the stick test, which for Asr is the real thing and not a metaphor. Find a straight stick, a pole, or a doorframe on flat ground in the sun. At 11:38 measure its shadow and mark the length. Then add the stick's own height to that mark. When the shadow reaches the new mark, look at your watch. If the sky is clear, it will say 14:45, give or take the care you took with the measuring. You have just computed Asr the way the Companions did.

## What to carry into the rest of the series

With Asr the five prayers are complete. Every one of them reduced to the same shape: a date gives the sun's declination and the equation of time, those plus your longitude give solar noon, and noon plus an hour angle gives the time the sun reaches some altitude. The altitude is −0.833° for sunrise and sunset, a twilight angle for Fajr and Isha, and a shadow angle for Asr. The whole timetable is one formula asked five ways.

What remains is the part that is not astronomy. Part 6 goes through the national standards one by one, Kemenag, Diyanet, Umm al-Qura and the rest, and shows what each one adds on top of the formula: precaution minutes, rounding rules, Ramadan exceptions, and the regional corrections that Muslimtify intentionally leaves out. Part 7, the last, deals with the places where the formula gives no answer at all, in the far north, and with the clock, which is not astronomy either. Then it puts everything into a single program and checks it against libmuslim for a whole year.
