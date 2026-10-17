---
slug: prayer-times-part-2-where-is-the-sun
title: "Prayer times, part 2: where is the sun today?"
authors:
  - rizukirr
tags: [muslimtify, prayer-time-calculation]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

{/*
  REVIEW NOTES (not rendered):
  The Python, TypeScript, Rust and C snippets were run and agree with each other
  and with a Meeus reference to 0.01 degrees and 0.1 minutes. The Go, Kotlin and
  Dart snippets were written to match but were NOT run. Run them before publishing.
*/}

In [part 1](/blog/prayer-times-part-1-what-the-quran-and-sunnah-say) we saw that every prayer time is a sentence about the sun. The sun declines. A shadow reaches a length. The twilight fades. A white line spreads along the horizon.

To turn those sentences into a number, you need to know where the sun is. Not roughly, but exactly: on this date, in this city, at this minute. That is what this part is about. By the end you will have a small program that tells you two facts about the sun for any date, and you will use them to work out the moment the sun is highest over your head today, which you can check with a stick.

{/* truncate */}

:::info[This is part 2 of a series]
[Part 1](/blog/prayer-times-part-1-what-the-quran-and-sunnah-say) covered what the Quran, the Sunnah and the early generations say about prayer times. This part builds the one piece of astronomy everything else depends on. Part 3 uses it to compute Dhuhr, sunrise and Maghrib. The full series is under the [prayer time calculation](/blog/tags/prayer-time-calculation) tag.
:::

## From words to numbers

The scholars of the first centuries left exact definitions in words. Turning them into numbers for a given city on a given day was the work of a different kind of scholar.

In ninth century Baghdad, al-Khwarizmi compiled a *zij*, a book of tables giving the position of the sun, moon and planets for any date, with instructions for using them. Al-Battani, a generation later, measured the length of the year and the tilt of the earth's axis so precisely that his numbers were still being quoted in Europe seven hundred years on. By the thirteenth century the great mosques of Cairo and Damascus employed a *muwaqqit*, a timekeeper whose job was to apply these tables to the prayer times of his own city. The most famous of them, Ibn al-Shatir, was muwaqqit of the Umayyad Mosque in Damascus and built a sundial for it in 1371 that computed the prayer times directly from the shadow.

A zij was a big book because the astronomers had to tabulate everything by hand. We are going to write a very small zij, about thirty lines, that gives us the two numbers the muwaqqit needed for the sun.

## The two numbers

Think about what a prayer time actually needs to know.

Dhuhr needs to know when the sun is at its highest over *your* city, which is not 12:00 on the clock. Fajr, Maghrib and Isha need to know when the sun is a certain distance below *your* horizon. Asr needs to know how high the sun climbs today, because that sets the length of the shortest shadow.

All of those depend on where you are, which we handle in part 3, and on two things that change with the date and are the same for everyone on earth:

1. How far north or south of the equator the sun stands today. Astronomers call it the sun's **declination**.
2. How far ahead of or behind the clock the sun is running today. Astronomers call it the **equation of time**.

Get these two from the date, add your latitude and longitude, and everything else is geometry.

### Declination: the sun's latitude

The earth's axis is tilted by about 23.44° compared to its path around the sun. As the earth goes around, that tilt makes the sun appear to drift north and south over the year. On 21 June the sun stands directly over the Tropic of Cancer, 23.44° north. On 21 December it stands over the Tropic of Capricorn, 23.44° south. On the two equinoxes in March and September it is directly over the equator.

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 800 330" role="img" aria-label="The earth at four points of its orbit around the sun, with its axis tilted 23.44 degrees in the same direction at every point" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<ellipse cx="400" cy="150" rx="300" ry="90" fill="none" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5" strokeDasharray="4 6" />
<circle cx="400" cy="150" r="22" fill="var(--ifm-color-primary)" />
<text x="400" y="154" textAnchor="middle" fill="var(--ifm-color-primary-contrast-background)" fontWeight="600">Sun</text>
<circle cx="100" cy="150" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" /><line x1="74.3" y1="138.9" x2="125.7" y2="161.1" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5" /><line x1="116.7" y1="111.5" x2="83.3" y2="188.5" stroke="currentColor" strokeWidth="2" /><text x="120.7" y="109.5" fill="currentColor">N</text><text x="100" y="198" textAnchor="middle" fill="currentColor" fontWeight="600">21 June</text><text x="100" y="214" textAnchor="middle" fill="var(--ifm-color-primary)">sun over 23.44° N</text>
<circle cx="700" cy="150" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" /><line x1="674.3" y1="138.9" x2="725.7" y2="161.1" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5" /><line x1="716.7" y1="111.5" x2="683.3" y2="188.5" stroke="currentColor" strokeWidth="2" /><text x="720.7" y="109.5" fill="currentColor">N</text><text x="700" y="198" textAnchor="middle" fill="currentColor" fontWeight="600">21 December</text><text x="700" y="214" textAnchor="middle" fill="var(--ifm-color-primary)">sun over 23.44° S</text>
<circle cx="400" cy="60" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" /><line x1="374.3" y1="48.9" x2="425.7" y2="71.1" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5" /><line x1="416.7" y1="21.5" x2="383.3" y2="98.5" stroke="currentColor" strokeWidth="2" /><text x="420.7" y="19.5" fill="currentColor">N</text><text x="400" y="108" textAnchor="middle" fill="currentColor" fontWeight="600">21 March</text><text x="400" y="124" textAnchor="middle" fill="var(--ifm-color-primary)">sun over the equator</text>
<circle cx="400" cy="240" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" /><line x1="374.3" y1="228.9" x2="425.7" y2="251.1" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5" /><line x1="416.7" y1="201.5" x2="383.3" y2="278.5" stroke="currentColor" strokeWidth="2" /><text x="420.7" y="199.5" fill="currentColor">N</text><text x="400" y="288" textAnchor="middle" fill="currentColor" fontWeight="600">23 September</text><text x="400" y="304" textAnchor="middle" fill="var(--ifm-color-primary)">sun over the equator</text>
<text x="400" y="322" textAnchor="middle" fill="currentColor">The axis always leans the same way, so the sun lights the north more in June and the south more in December.</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>The tilt of the earth's axis stays fixed while the earth goes around the sun. That is the whole reason the sun's declination swings north and south through the year.</figcaption>
</figure>

The declination is the latitude the sun is "over" today. It runs from +23.44° to -23.44° and back every year.

Why it matters to you: Jakarta is at about 6.2° south. Twice a year, in early March and again in early October, the declination is exactly -6.2°, and at noon on those days the sun is straight overhead and a vertical stick casts no shadow at all. On every other day the noon shadow has some length, and that length is set by the gap between your latitude and today's declination. That is the stick from part 1, and it is how Asr will be computed in part 5.

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 760 320" role="img" aria-label="The sun's declination through 2026, a wave between plus and minus 23.44 degrees, crossing Jakarta's latitude of minus 6.2 degrees on 5 March and 10 October" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<line x1="70" y1="239.7" x2="730" y2="239.7" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="243.7" textAnchor="end" fill="currentColor">-23.44</text>
<line x1="70" y1="185.4" x2="730" y2="185.4" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="189.4" textAnchor="end" fill="currentColor">-10</text>
<line x1="70" y1="145.0" x2="730" y2="145.0" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="149.0" textAnchor="end" fill="currentColor">0</text>
<line x1="70" y1="104.6" x2="730" y2="104.6" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="108.6" textAnchor="end" fill="currentColor">+10</text>
<line x1="70" y1="50.3" x2="730" y2="50.3" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="54.3" textAnchor="end" fill="currentColor">+23.44</text>
<line x1="70.0" y1="40" x2="70.0" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="97.5" y="268" textAnchor="middle" fill="currentColor">Jan</text>
<line x1="126.2" y1="40" x2="126.2" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="153.7" y="268" textAnchor="middle" fill="currentColor">Feb</text>
<line x1="177.0" y1="40" x2="177.0" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="204.5" y="268" textAnchor="middle" fill="currentColor">Mar</text>
<line x1="233.2" y1="40" x2="233.2" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="260.7" y="268" textAnchor="middle" fill="currentColor">Apr</text>
<line x1="287.6" y1="40" x2="287.6" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="315.1" y="268" textAnchor="middle" fill="currentColor">May</text>
<line x1="343.8" y1="40" x2="343.8" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="371.3" y="268" textAnchor="middle" fill="currentColor">Jun</text>
<line x1="398.2" y1="40" x2="398.2" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="425.7" y="268" textAnchor="middle" fill="currentColor">Jul</text>
<line x1="454.4" y1="40" x2="454.4" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="481.9" y="268" textAnchor="middle" fill="currentColor">Aug</text>
<line x1="510.6" y1="40" x2="510.6" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="538.1" y="268" textAnchor="middle" fill="currentColor">Sep</text>
<line x1="565.0" y1="40" x2="565.0" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="592.5" y="268" textAnchor="middle" fill="currentColor">Oct</text>
<line x1="621.2" y1="40" x2="621.2" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="648.7" y="268" textAnchor="middle" fill="currentColor">Nov</text>
<line x1="675.6" y1="40" x2="675.6" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="703.1" y="268" textAnchor="middle" fill="currentColor">Dec</text>
<line x1="70" y1="145.0" x2="730" y2="145.0" stroke="currentColor" strokeWidth="1.2" />
<text x="76" y="30" fill="currentColor">declination, degrees</text>
<line x1="70" y1="170.0" x2="730" y2="170.0" stroke="var(--ifm-color-primary)" strokeWidth="1.5" strokeDasharray="6 4" />
<text x="76" y="164.0" fill="var(--ifm-color-primary)">Jakarta, 6.2° south</text>
<polyline points="70.0,237.9 71.8,237.6 73.6,237.2 75.4,236.8 77.3,236.4 79.1,235.9 80.9,235.4 82.7,234.9 84.5,234.4 86.3,233.8 88.1,233.2 89.9,232.5 91.8,231.9 93.6,231.2 95.4,230.4 97.2,229.7 99.0,228.9 100.8,228.1 102.6,227.3 104.5,226.4 106.3,225.5 108.1,224.6 109.9,223.7 111.7,222.8 113.5,221.8 115.3,220.8 117.1,219.7 119.0,218.7 120.8,217.6 122.6,216.5 124.4,215.4 126.2,214.3 128.0,213.1 129.8,212.0 131.6,210.8 133.5,209.5 135.3,208.3 137.1,207.1 138.9,205.8 140.7,204.5 142.5,203.2 144.3,201.9 146.2,200.6 148.0,199.2 149.8,197.9 151.6,196.5 153.4,195.1 155.2,193.7 157.0,192.3 158.8,190.8 160.7,189.4 162.5,187.9 164.3,186.5 166.1,185.0 167.9,183.5 169.7,182.0 171.5,180.5 173.4,179.0 175.2,177.5 177.0,176.0 178.8,174.4 180.6,172.9 182.4,171.3 184.2,169.8 186.0,168.2 187.9,166.6 189.7,165.1 191.5,163.5 193.3,161.9 195.1,160.3 196.9,158.7 198.7,157.1 200.5,155.6 202.4,154.0 204.2,152.4 206.0,150.8 207.8,149.2 209.6,147.6 211.4,146.0 213.2,144.4 215.1,142.8 216.9,141.2 218.7,139.6 220.5,138.0 222.3,136.4 224.1,134.8 225.9,133.3 227.7,131.7 229.6,130.1 231.4,128.5 233.2,127.0 235.0,125.4 236.8,123.9 238.6,122.3 240.4,120.8 242.3,119.3 244.1,117.7 245.9,116.2 247.7,114.7 249.5,113.2 251.3,111.7 253.1,110.2 254.9,108.8 256.8,107.3 258.6,105.9 260.4,104.4 262.2,103.0 264.0,101.6 265.8,100.2 267.6,98.8 269.5,97.4 271.3,96.0 273.1,94.7 274.9,93.3 276.7,92.0 278.5,90.7 280.3,89.4 282.1,88.1 284.0,86.8 285.8,85.6 287.6,84.4 289.4,83.1 291.2,81.9 293.0,80.8 294.8,79.6 296.6,78.5 298.5,77.3 300.3,76.2 302.1,75.1 303.9,74.1 305.7,73.0 307.5,72.0 309.3,71.0 311.2,70.0 313.0,69.0 314.8,68.1 316.6,67.1 318.4,66.2 320.2,65.3 322.0,64.5 323.8,63.7 325.7,62.8 327.5,62.1 329.3,61.3 331.1,60.5 332.9,59.8 334.7,59.1 336.5,58.5 338.4,57.8 340.2,57.2 342.0,56.6 343.8,56.1 345.6,55.5 347.4,55.0 349.2,54.5 351.0,54.1 352.9,53.6 354.7,53.2 356.5,52.8 358.3,52.5 360.1,52.1 361.9,51.8 363.7,51.6 365.5,51.3 367.4,51.1 369.2,50.9 371.0,50.8 372.8,50.6 374.6,50.5 376.4,50.4 378.2,50.4 380.1,50.4 381.9,50.4 383.7,50.4 385.5,50.5 387.3,50.5 389.1,50.7 390.9,50.8 392.7,51.0 394.6,51.2 396.4,51.4 398.2,51.6 400.0,51.9 401.8,52.2 403.6,52.6 405.4,52.9 407.3,53.3 409.1,53.7 410.9,54.2 412.7,54.6 414.5,55.1 416.3,55.6 418.1,56.2 419.9,56.8 421.8,57.4 423.6,58.0 425.4,58.6 427.2,59.3 429.0,60.0 430.8,60.7 432.6,61.4 434.5,62.2 436.3,63.0 438.1,63.8 439.9,64.6 441.7,65.5 443.5,66.4 445.3,67.3 447.1,68.2 449.0,69.1 450.8,70.1 452.6,71.1 454.4,72.1 456.2,73.1 458.0,74.1 459.8,75.2 461.6,76.3 463.5,77.4 465.3,78.5 467.1,79.6 468.9,80.8 470.7,81.9 472.5,83.1 474.3,84.3 476.2,85.5 478.0,86.8 479.8,88.0 481.6,89.3 483.4,90.6 485.2,91.9 487.0,93.2 488.8,94.5 490.7,95.8 492.5,97.2 494.3,98.5 496.1,99.9 497.9,101.3 499.7,102.7 501.5,104.1 503.4,105.5 505.2,106.9 507.0,108.4 508.8,109.8 510.6,111.3 512.4,112.8 514.2,114.2 516.0,115.7 517.9,117.2 519.7,118.7 521.5,120.2 523.3,121.7 525.1,123.2 526.9,124.8 528.7,126.3 530.5,127.8 532.4,129.4 534.2,130.9 536.0,132.5 537.8,134.0 539.6,135.6 541.4,137.1 543.2,138.7 545.1,140.3 546.9,141.8 548.7,143.4 550.5,145.0 552.3,146.6 554.1,148.1 555.9,149.7 557.7,151.3 559.6,152.8 561.4,154.4 563.2,156.0 565.0,157.5 566.8,159.1 568.6,160.7 570.4,162.2 572.3,163.8 574.1,165.3 575.9,166.9 577.7,168.4 579.5,170.0 581.3,171.5 583.1,173.0 584.9,174.6 586.8,176.1 588.6,177.6 590.4,179.1 592.2,180.6 594.0,182.0 595.8,183.5 597.6,185.0 599.5,186.4 601.3,187.9 603.1,189.3 604.9,190.7 606.7,192.2 608.5,193.6 610.3,194.9 612.1,196.3 614.0,197.7 615.8,199.0 617.6,200.4 619.4,201.7 621.2,203.0 623.0,204.3 624.8,205.5 626.6,206.8 628.5,208.0 630.3,209.3 632.1,210.5 633.9,211.7 635.7,212.8 637.5,214.0 639.3,215.1 641.2,216.2 643.0,217.3 644.8,218.4 646.6,219.4 648.4,220.4 650.2,221.4 652.0,222.4 653.8,223.4 655.7,224.3 657.5,225.2 659.3,226.1 661.1,227.0 662.9,227.8 664.7,228.6 666.5,229.4 668.4,230.1 670.2,230.9 672.0,231.6 673.8,232.2 675.6,232.9 677.4,233.5 679.2,234.1 681.0,234.7 682.9,235.2 684.7,235.7 686.5,236.2 688.3,236.6 690.1,237.0 691.9,237.4 693.7,237.8 695.5,238.1 697.4,238.4 699.2,238.7 701.0,238.9 702.8,239.1 704.6,239.3 706.4,239.4 708.2,239.5 710.1,239.6 711.9,239.6 713.7,239.6 715.5,239.6 717.3,239.6 719.1,239.5 720.9,239.4 722.7,239.2 724.6,239.0 726.4,238.8 728.2,238.6 730.0,238.3" fill="none" stroke="currentColor" strokeWidth="2" />
<circle cx="380.1" cy="50.4" r="4" fill="var(--ifm-color-primary)" />
<text x="380.1" y="38.4" textAnchor="middle" fill="var(--ifm-color-primary)">21 Jun, over the Tropic of Cancer</text>
<circle cx="711.9" cy="239.6" r="4" fill="var(--ifm-color-primary)" />
<text x="701.9" y="229.6" textAnchor="end" fill="var(--ifm-color-primary)">21 Dec, over the Tropic of Capricorn</text>
<circle cx="184.2" cy="169.8" r="4" fill="var(--ifm-color-primary)" />
<text x="176.2" y="187.8" textAnchor="end" fill="var(--ifm-color-primary)">5 Mar</text>
<circle cx="581.3" cy="171.5" r="4" fill="var(--ifm-color-primary)" />
<text x="589.3" y="189.5" textAnchor="start" fill="var(--ifm-color-primary)">10 Oct</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>The sun's declination through 2026, computed with the code below. Where the curve crosses Jakarta's latitude the noon sun is straight overhead and a stick has no shadow.</figcaption>
</figure>

### Equation of time: the sun runs fast and slow

Here is something that surprises most people. If you set a sundial to show exactly 12:00 at the moment the sun is highest on one day, it will be wrong on most other days of the year, by up to about 16 minutes.

The sun is not a perfect clock. The earth's orbit is slightly oval, so it moves faster in January and slower in July. And because the axis is tilted, the sun's eastward drift against the stars is not even across the year. Together these make the real sun run ahead of a perfect clock for part of the year and behind it for the rest. The difference is the equation of time. In early November the sun is about 16 minutes early. In mid February it is about 14 minutes late. Four times a year it is on time.

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 760 320" role="img" aria-label="The equation of time through 2026, swinging from 14.2 minutes late in February to 16.4 minutes early in November, with 17 October marked at plus 14.6 minutes" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<line x1="70" y1="232.5" x2="730" y2="232.5" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="236.5" textAnchor="end" fill="currentColor">-15</text>
<line x1="70" y1="203.3" x2="730" y2="203.3" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="207.3" textAnchor="end" fill="currentColor">-10</text>
<line x1="70" y1="174.2" x2="730" y2="174.2" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="178.2" textAnchor="end" fill="currentColor">-5</text>
<line x1="70" y1="145.0" x2="730" y2="145.0" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="149.0" textAnchor="end" fill="currentColor">0</text>
<line x1="70" y1="115.8" x2="730" y2="115.8" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="119.8" textAnchor="end" fill="currentColor">+5</text>
<line x1="70" y1="86.7" x2="730" y2="86.7" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="90.7" textAnchor="end" fill="currentColor">+10</text>
<line x1="70" y1="57.5" x2="730" y2="57.5" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="62" y="61.5" textAnchor="end" fill="currentColor">+15</text>
<line x1="70.0" y1="40" x2="70.0" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="97.5" y="268" textAnchor="middle" fill="currentColor">Jan</text>
<line x1="126.2" y1="40" x2="126.2" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="153.7" y="268" textAnchor="middle" fill="currentColor">Feb</text>
<line x1="177.0" y1="40" x2="177.0" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="204.5" y="268" textAnchor="middle" fill="currentColor">Mar</text>
<line x1="233.2" y1="40" x2="233.2" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="260.7" y="268" textAnchor="middle" fill="currentColor">Apr</text>
<line x1="287.6" y1="40" x2="287.6" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="315.1" y="268" textAnchor="middle" fill="currentColor">May</text>
<line x1="343.8" y1="40" x2="343.8" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="371.3" y="268" textAnchor="middle" fill="currentColor">Jun</text>
<line x1="398.2" y1="40" x2="398.2" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="425.7" y="268" textAnchor="middle" fill="currentColor">Jul</text>
<line x1="454.4" y1="40" x2="454.4" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="481.9" y="268" textAnchor="middle" fill="currentColor">Aug</text>
<line x1="510.6" y1="40" x2="510.6" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="538.1" y="268" textAnchor="middle" fill="currentColor">Sep</text>
<line x1="565.0" y1="40" x2="565.0" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="592.5" y="268" textAnchor="middle" fill="currentColor">Oct</text>
<line x1="621.2" y1="40" x2="621.2" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="648.7" y="268" textAnchor="middle" fill="currentColor">Nov</text>
<line x1="675.6" y1="40" x2="675.6" y2="250" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
<text x="703.1" y="268" textAnchor="middle" fill="currentColor">Dec</text>
<line x1="70" y1="145.0" x2="730" y2="145.0" stroke="currentColor" strokeWidth="1.2" />
<text x="76" y="30" fill="currentColor">equation of time, minutes</text>
<polyline points="70.0,164.4 71.8,167.2 73.6,169.9 75.4,172.6 77.3,175.2 79.1,177.8 80.9,180.3 82.7,182.8 84.5,185.3 86.3,187.7 88.1,190.0 89.9,192.3 91.8,194.6 93.6,196.7 95.4,198.8 97.2,200.9 99.0,202.9 100.8,204.8 102.6,206.6 104.5,208.4 106.3,210.1 108.1,211.7 109.9,213.2 111.7,214.7 113.5,216.1 115.3,217.4 117.1,218.7 119.0,219.8 120.8,220.9 122.6,221.9 124.4,222.8 126.2,223.7 128.0,224.5 129.8,225.1 131.6,225.7 133.5,226.3 135.3,226.7 137.1,227.1 138.9,227.4 140.7,227.6 142.5,227.8 144.3,227.8 146.2,227.8 148.0,227.7 149.8,227.6 151.6,227.4 153.4,227.1 155.2,226.7 157.0,226.3 158.8,225.8 160.7,225.2 162.5,224.6 164.3,223.9 166.1,223.1 167.9,222.3 169.7,221.4 171.5,220.5 173.4,219.5 175.2,218.5 177.0,217.4 178.8,216.3 180.6,215.1 182.4,213.8 184.2,212.6 186.0,211.2 187.9,209.9 189.7,208.5 191.5,207.0 193.3,205.6 195.1,204.1 196.9,202.5 198.7,201.0 200.5,199.4 202.4,197.8 204.2,196.1 206.0,194.5 207.8,192.8 209.6,191.1 211.4,189.4 213.2,187.7 215.1,185.9 216.9,184.2 218.7,182.4 220.5,180.7 222.3,178.9 224.1,177.2 225.9,175.4 227.7,173.7 229.6,171.9 231.4,170.2 233.2,168.4 235.0,166.7 236.8,165.0 238.6,163.3 240.4,161.6 242.3,159.9 244.1,158.3 245.9,156.6 247.7,155.0 249.5,153.4 251.3,151.9 253.1,150.4 254.9,148.9 256.8,147.4 258.6,146.0 260.4,144.6 262.2,143.2 264.0,141.9 265.8,140.6 267.6,139.3 269.5,138.1 271.3,136.9 273.1,135.8 274.9,134.7 276.7,133.7 278.5,132.7 280.3,131.8 282.1,130.9 284.0,130.0 285.8,129.2 287.6,128.5 289.4,127.8 291.2,127.2 293.0,126.6 294.8,126.1 296.6,125.6 298.5,125.2 300.3,124.8 302.1,124.5 303.9,124.2 305.7,124.0 307.5,123.9 309.3,123.8 311.2,123.8 313.0,123.8 314.8,123.9 316.6,124.0 318.4,124.2 320.2,124.4 322.0,124.7 323.8,125.1 325.7,125.5 327.5,125.9 329.3,126.4 331.1,127.0 332.9,127.6 334.7,128.2 336.5,128.9 338.4,129.7 340.2,130.4 342.0,131.3 343.8,132.1 345.6,133.0 347.4,134.0 349.2,134.9 351.0,135.9 352.9,137.0 354.7,138.0 356.5,139.1 358.3,140.3 360.1,141.4 361.9,142.6 363.7,143.8 365.5,145.0 367.4,146.2 369.2,147.4 371.0,148.7 372.8,149.9 374.6,151.2 376.4,152.5 378.2,153.7 380.1,155.0 381.9,156.3 383.7,157.6 385.5,158.8 387.3,160.1 389.1,161.3 390.9,162.5 392.7,163.7 394.6,164.9 396.4,166.1 398.2,167.2 400.0,168.4 401.8,169.4 403.6,170.5 405.4,171.5 407.3,172.5 409.1,173.5 410.9,174.4 412.7,175.3 414.5,176.2 416.3,177.0 418.1,177.8 419.9,178.5 421.8,179.2 423.6,179.8 425.4,180.4 427.2,180.9 429.0,181.4 430.8,181.8 432.6,182.2 434.5,182.5 436.3,182.8 438.1,183.0 439.9,183.1 441.7,183.2 443.5,183.3 445.3,183.3 447.1,183.2 449.0,183.0 450.8,182.8 452.6,182.6 454.4,182.3 456.2,181.9 458.0,181.5 459.8,181.0 461.6,180.4 463.5,179.8 465.3,179.2 467.1,178.4 468.9,177.7 470.7,176.8 472.5,175.9 474.3,175.0 476.2,174.0 478.0,172.9 479.8,171.8 481.6,170.6 483.4,169.4 485.2,168.2 487.0,166.9 488.8,165.5 490.7,164.1 492.5,162.6 494.3,161.1 496.1,159.6 497.9,158.0 499.7,156.4 501.5,154.8 503.4,153.1 505.2,151.3 507.0,149.6 508.8,147.8 510.6,145.9 512.4,144.1 514.2,142.2 516.0,140.3 517.9,138.3 519.7,136.4 521.5,134.4 523.3,132.4 525.1,130.4 526.9,128.4 528.7,126.3 530.5,124.3 532.4,122.2 534.2,120.1 536.0,118.0 537.8,116.0 539.6,113.9 541.4,111.8 543.2,109.7 545.1,107.6 546.9,105.6 548.7,103.5 550.5,101.4 552.3,99.4 554.1,97.3 555.9,95.3 557.7,93.3 559.6,91.4 561.4,89.4 563.2,87.5 565.0,85.6 566.8,83.7 568.6,81.8 570.4,80.0 572.3,78.2 574.1,76.5 575.9,74.8 577.7,73.1 579.5,71.4 581.3,69.9 583.1,68.3 584.9,66.8 586.8,65.4 588.6,64.0 590.4,62.6 592.2,61.3 594.0,60.1 595.8,58.9 597.6,57.8 599.5,56.7 601.3,55.7 603.1,54.8 604.9,53.9 606.7,53.1 608.5,52.4 610.3,51.7 612.1,51.1 614.0,50.6 615.8,50.2 617.6,49.8 619.4,49.5 621.2,49.3 623.0,49.1 624.8,49.1 626.6,49.1 628.5,49.2 630.3,49.3 632.1,49.6 633.9,49.9 635.7,50.3 637.5,50.8 639.3,51.4 641.2,52.1 643.0,52.8 644.8,53.7 646.6,54.6 648.4,55.6 650.2,56.6 652.0,57.8 653.8,59.0 655.7,60.4 657.5,61.8 659.3,63.2 661.1,64.8 662.9,66.4 664.7,68.1 666.5,69.9 668.4,71.7 670.2,73.7 672.0,75.7 673.8,77.7 675.6,79.8 677.4,82.0 679.2,84.3 681.0,86.6 682.9,88.9 684.7,91.3 686.5,93.8 688.3,96.3 690.1,98.9 691.9,101.5 693.7,104.2 695.5,106.8 697.4,109.6 699.2,112.3 701.0,115.1 702.8,117.9 704.6,120.8 706.4,123.6 708.2,126.5 710.1,129.4 711.9,132.3 713.7,135.1 715.5,138.0 717.3,141.0 719.1,143.8 720.9,146.7 722.7,149.6 724.6,152.5 726.4,155.3 728.2,158.2 730.0,161.0" fill="none" stroke="currentColor" strokeWidth="2" />
<circle cx="624.8" cy="49.1" r="4" fill="var(--ifm-color-primary)" />
<text x="624.8" y="37.1" textAnchor="middle" fill="var(--ifm-color-primary)">3 Nov, 16.4 min early</text>
<circle cx="144.3" cy="227.8" r="4" fill="var(--ifm-color-primary)" />
<text x="144.3" y="249.8" textAnchor="middle" fill="var(--ifm-color-primary)">11 Feb, 14.2 min late</text>
<circle cx="594.0" cy="60.1" r="4" fill="var(--ifm-color-primary)" />
<text x="584.0" y="54.1" textAnchor="end" fill="var(--ifm-color-primary)">17 Oct, +14.6</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>How far the real sun runs ahead of (positive) or behind (negative) a perfect clock through 2026. The curve crosses zero four times a year.</figcaption>
</figure>

Every prayer time inherits this. If your app ignored the equation of time, Dhuhr would be off by a quarter of an hour in some months.

## Counting days

Astronomy formulas do not want a month and a day. They want a single number: how many days have passed since some fixed starting point. The starting point almost everyone uses now is noon UTC on 1 January 2000, written J2000.0.

Astronomers get to that count through the **Julian day**, a continuous count of days running since 4713 BC. The Julian day of J2000.0 is 2451545.0. So the number we want is:

```text
d = julian_day(date) - 2451545.0
```

Converting a calendar date to a Julian day takes a handful of integer tricks to account for the uneven months and leap years. The function below is the standard one from Jean Meeus's *Astronomical Algorithms*. You do not need to understand it. You need to know that it turns 17 October 2026 into 2461330.5, and that it works for every date after October 1582.

## The recipe

With `d` in hand, this is the whole calculation. It comes from the *Astronomical Almanac*, the yearly reference published by the US and UK naval observatories, and it is accurate to about one sixtieth of a degree between 1950 and 2050. That is far more precision than a prayer timetable rounded to the minute can use. It is also, line for line, the formula inside libmuslim, the library that computes Muslimtify's times. What you write here is what the app runs.

All angles are in degrees. The `mod 360` steps just keep the angles in the 0 to 360 range.

```text
g = 357.529 + 0.98560028 * d                  mean anomaly: how far around its orbit the earth is
q = 280.459 + 0.98564736 * d                  mean longitude: where the sun would be if the orbit were a circle
L = q + 1.915 * sin(g) + 0.020 * sin(2g)      true longitude: the correction for the oval orbit
e = 23.439 - 0.00000036 * d                   tilt of the earth's axis, shrinking very slowly

declination      = asin( sin(e) * sin(L) )
right ascension  = atan2( cos(e) * sin(L), cos(L) ) / 15        in hours
equation of time = q / 15 - right ascension                     in hours
```

Read the two lines with `g` and `q` first. Both are just "a starting angle plus a fixed amount per day". The `0.9856` is 360° divided by 365.25 days, the sun's average progress per day. The `L` line is the oval orbit correction, and it is where the "fast and slow" comes from. The `e` line is the tilt.

The last three lines convert that position into the two numbers we want. The declination is the sun's latitude. The right ascension is the sun's position measured eastward in hours, the way a star chart does it. The equation of time is the gap between where the sun would be on a perfect clock, `q / 15`, and where it really is.

### Where the numbers come from

None of the constants are magic. Each one is a measurement of the earth's orbit, and there are only four kinds.

| Constant | What it is | How to check it |
| --- | --- | --- |
| `357.529` | Mean anomaly at J2000.0: degrees travelled since the last perihelion, the earth's closest approach to the sun | 2.471° short of a full lap, at 0.9856°/day, is 2.5 days. Perihelion in 2000 fell on 4 January. |
| `280.459` | Mean longitude at J2000.0: the sun's position along its yearly path, measured from the March equinox point | 270° is the December solstice. 10.46° past it is 10.6 days, which lands on 1 January. |
| `0.98564736` | Degrees per day of mean longitude | `360 / 365.2422`, the tropical year from equinox to equinox |
| `0.98560028` | Degrees per day of mean anomaly | `360 / 365.2596`, the anomalistic year from perihelion to perihelion |
| `1.915`, `0.020` | Correction for the oval orbit, in degrees | From the orbit's eccentricity `e = 0.01671`: `2e` and `(5/4)e²` in radians, converted to degrees |
| `23.439` | Tilt of the earth's axis at J2000.0 | 23° 26′ 21.4″, measured |
| `0.00000036` | Decrease of the tilt per day | 46.8 arcseconds per century, from the pull of the other planets |
| `2451545.0` | Julian day of J2000.0 | Noon UTC on 1 January 2000 |
| `15` | Degrees per hour | The earth turns 360° in 24 hours |

The two rates differ in the fifth decimal because the perihelion point itself creeps forward, about one degree every 58 years, so a lap from perihelion to perihelion takes 25 minutes longer than a lap from equinox to equinox.

The `1.915` deserves one more sentence, because it is the only piece of real physics in the block. A planet on an oval orbit moves fastest when it is closest to the sun. Kepler worked out the correction for that, and for a nearly circular orbit it expands as `2e sin(g) + (5/4)e² sin(2g)` with `e` the eccentricity. Put in `e = 0.01671`, convert from radians to degrees, and you get `1.915 sin(g) + 0.020 sin(2g)`. The next term would be about 0.0003°, which is why the Almanac stops at two.

The full solar model behind the *Astronomical Almanac* has hundreds of terms: the pull of the moon, the pull of Jupiter, and so on. These four lines are what remains after throwing all of that away and keeping only what is needed to stay within a minute of arc for a century. For a timetable rounded to the minute, that is everything.

## The code

Here is the recipe in code, plus a `solar_noon` function that uses the equation of time to find when the sun is highest by your local clock. Pick your language. The tab you choose is remembered across the whole series.

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

def sun_position(year, month, day):
    d = julian_day(year, month, day) - 2451545.0  # days since J2000.0

    g = math.radians((357.529 + 0.98560028 * d) % 360)  # mean anomaly
    q = (280.459 + 0.98564736 * d) % 360               # mean longitude, degrees
    L = math.radians((q + 1.915 * math.sin(g) + 0.020 * math.sin(2 * g)) % 360)  # ecliptic longitude
    e = math.radians(23.439 - 0.00000036 * d)          # tilt of the earth's axis

    declination = math.degrees(math.asin(math.sin(e) * math.sin(L)))
    right_ascension = math.degrees(math.atan2(math.cos(e) * math.sin(L), math.cos(L))) / 15  # hours
    equation_of_time = (q / 15 - right_ascension + 12) % 24 - 12  # hours, kept near zero
    return declination, equation_of_time * 60  # degrees, minutes

def solar_noon(year, month, day, longitude, timezone):
    _, eqt = sun_position(year, month, day)
    return 12 + timezone - longitude / 15 - eqt / 60  # local clock hours

if __name__ == "__main__":
    dec, eqt = sun_position(2026, 10, 17)
    print(f"declination {dec:.2f} deg, equation of time {eqt:.1f} min")
    noon = solar_noon(2026, 10, 17, 106.8456, 7)  # Jakarta, WIB
    h = int(noon); m = (noon - h) * 60
    print(f"solar noon in Jakarta {h:02d}:{m:04.1f}")
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

function sunPosition(year: number, month: number, day: number) {
  const d = julianDay(year, month, day) - 2451545.0; // days since J2000.0

  const g = rad(mod(357.529 + 0.98560028 * d, 360)); // mean anomaly
  const q = mod(280.459 + 0.98564736 * d, 360); // mean longitude, degrees
  const L = rad(mod(q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g), 360)); // ecliptic longitude
  const e = rad(23.439 - 0.00000036 * d); // tilt of the earth's axis

  const declination = deg(Math.asin(Math.sin(e) * Math.sin(L)));
  const rightAscension = deg(Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L))) / 15; // hours
  const equationOfTime = mod(q / 15 - rightAscension + 12, 24) - 12; // hours, kept near zero
  return { declination, equationOfTime: equationOfTime * 60 }; // degrees, minutes
}

function solarNoon(year: number, month: number, day: number, longitude: number, timezone: number): number {
  const { equationOfTime } = sunPosition(year, month, day);
  return 12 + timezone - longitude / 15 - equationOfTime / 60; // local clock hours
}

const { declination, equationOfTime } = sunPosition(2026, 10, 17);
console.log(`declination ${declination.toFixed(2)} deg, equation of time ${equationOfTime.toFixed(1)} min`);
const noon = solarNoon(2026, 10, 17, 106.8456, 7); // Jakarta, WIB
const h = Math.floor(noon);
console.log(`solar noon in Jakarta ${String(h).padStart(2, "0")}:${((noon - h) * 60).toFixed(1)}`);
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
func sunPosition(year, month, day int) (float64, float64) {
	d := julianDay(year, month, day) - 2451545.0 // days since J2000.0

	g := rad(mod(357.529+0.98560028*d, 360))                     // mean anomaly
	q := mod(280.459+0.98564736*d, 360)                          // mean longitude, degrees
	L := rad(mod(q+1.915*math.Sin(g)+0.020*math.Sin(2*g), 360)) // ecliptic longitude
	e := rad(23.439 - 0.00000036*d)                              // tilt of the earth's axis

	declination := deg(math.Asin(math.Sin(e) * math.Sin(L)))
	rightAscension := deg(math.Atan2(math.Cos(e)*math.Sin(L), math.Cos(L))) / 15 // hours
	equationOfTime := mod(q/15-rightAscension+12, 24) - 12                       // hours, kept near zero
	return declination, equationOfTime * 60
}

func solarNoon(year, month, day int, longitude, timezone float64) float64 {
	_, eqt := sunPosition(year, month, day)
	return 12 + timezone - longitude/15 - eqt/60 // local clock hours
}

func main() {
	dec, eqt := sunPosition(2026, 10, 17)
	fmt.Printf("declination %.2f deg, equation of time %.1f min\n", dec, eqt)
	noon := solarNoon(2026, 10, 17, 106.8456, 7) // Jakarta, WIB
	h := math.Floor(noon)
	fmt.Printf("solar noon in Jakarta %02d:%04.1f\n", int(h), (noon-h)*60)
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
fn sun_position(year: i32, month: i32, day: i32) -> (f64, f64) {
    let d = julian_day(year, month, day) - 2451545.0; // days since J2000.0

    let g = (357.529 + 0.98560028 * d).rem_euclid(360.0).to_radians(); // mean anomaly
    let q = (280.459 + 0.98564736 * d).rem_euclid(360.0); // mean longitude, degrees
    let l = (q + 1.915 * g.sin() + 0.020 * (2.0 * g).sin()).rem_euclid(360.0).to_radians(); // ecliptic longitude
    let e = (23.439 - 0.00000036 * d).to_radians(); // tilt of the earth's axis

    let declination = (e.sin() * l.sin()).asin().to_degrees();
    let right_ascension = (e.cos() * l.sin()).atan2(l.cos()).to_degrees() / 15.0; // hours
    let equation_of_time = (q / 15.0 - right_ascension + 12.0).rem_euclid(24.0) - 12.0; // hours, kept near zero
    (declination, equation_of_time * 60.0)
}

fn solar_noon(year: i32, month: i32, day: i32, longitude: f64, timezone: f64) -> f64 {
    let (_, eqt) = sun_position(year, month, day);
    12.0 + timezone - longitude / 15.0 - eqt / 60.0 // local clock hours
}

fn main() {
    let (dec, eqt) = sun_position(2026, 10, 17);
    println!("declination {dec:.2} deg, equation of time {eqt:.1} min");
    let noon = solar_noon(2026, 10, 17, 106.8456, 7.0); // Jakarta, WIB
    let h = noon.floor();
    println!("solar noon in Jakarta {:02}:{:04.1}", h as i32, (noon - h) * 60.0);
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

fun sunPosition(year: Int, month: Int, day: Int): SunPosition {
    val d = julianDay(year, month, day) - 2451545.0 // days since J2000.0

    val g = rad(mod(357.529 + 0.98560028 * d, 360.0)) // mean anomaly
    val q = mod(280.459 + 0.98564736 * d, 360.0) // mean longitude, degrees
    val l = rad(mod(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360.0)) // ecliptic longitude
    val e = rad(23.439 - 0.00000036 * d) // tilt of the earth's axis

    val declination = deg(asin(sin(e) * sin(l)))
    val rightAscension = deg(atan2(cos(e) * sin(l), cos(l))) / 15 // hours
    val equationOfTime = mod(q / 15 - rightAscension + 12, 24.0) - 12 // hours, kept near zero
    return SunPosition(declination, equationOfTime * 60)
}

fun solarNoon(year: Int, month: Int, day: Int, longitude: Double, timezone: Double): Double {
    val sun = sunPosition(year, month, day)
    return 12 + timezone - longitude / 15 - sun.equationOfTime / 60 // local clock hours
}

fun main() {
    val sun = sunPosition(2026, 10, 17)
    println("declination %.2f deg, equation of time %.1f min".format(sun.declination, sun.equationOfTime))
    val noon = solarNoon(2026, 10, 17, 106.8456, 7.0) // Jakarta, WIB
    val h = floor(noon)
    println("solar noon in Jakarta %02d:%04.1f".format(h.toInt(), (noon - h) * 60))
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
({double declination, double equationOfTime}) sunPosition(int year, int month, int day) {
  final d = julianDay(year, month, day) - 2451545.0; // days since J2000.0

  final g = rad(mod(357.529 + 0.98560028 * d, 360)); // mean anomaly
  final q = mod(280.459 + 0.98564736 * d, 360); // mean longitude, degrees
  final l = rad(mod(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360)); // ecliptic longitude
  final e = rad(23.439 - 0.00000036 * d); // tilt of the earth's axis

  final declination = deg(asin(sin(e) * sin(l)));
  final rightAscension = deg(atan2(cos(e) * sin(l), cos(l))) / 15; // hours
  final equationOfTime = mod(q / 15 - rightAscension + 12, 24) - 12; // hours, kept near zero
  return (declination: declination, equationOfTime: equationOfTime * 60);
}

double solarNoon(int year, int month, int day, double longitude, double timezone) {
  final sun = sunPosition(year, month, day);
  return 12 + timezone - longitude / 15 - sun.equationOfTime / 60; // local clock hours
}

void main() {
  final sun = sunPosition(2026, 10, 17);
  print('declination ${sun.declination.toStringAsFixed(2)} deg, '
      'equation of time ${sun.equationOfTime.toStringAsFixed(1)} min');
  final noon = solarNoon(2026, 10, 17, 106.8456, 7); // Jakarta, WIB
  final h = noon.floor();
  print('solar noon in Jakarta ${h.toString().padLeft(2, '0')}:${((noon - h) * 60).toStringAsFixed(1)}');
}
```

  </TabItem>
  <TabItem value="c" label="C">

```c
#include <math.h>
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

static sun_position_t sun_position(int year, int month, int day) {
    double d = julian_day(year, month, day) - 2451545.0; /* days since J2000.0 */

    double g = rad(mod(357.529 + 0.98560028 * d, 360)); /* mean anomaly */
    double q = mod(280.459 + 0.98564736 * d, 360);      /* mean longitude, degrees */
    double L = rad(mod(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360)); /* ecliptic longitude */
    double e = rad(23.439 - 0.00000036 * d);            /* tilt of the earth's axis */

    double declination = deg(asin(sin(e) * sin(L)));
    double right_ascension = deg(atan2(cos(e) * sin(L), cos(L))) / 15; /* hours */
    double equation_of_time = mod(q / 15 - right_ascension + 12, 24) - 12; /* hours, kept near zero */
    return (sun_position_t){declination, equation_of_time * 60};
}

static double solar_noon(int year, int month, int day, double longitude, double timezone) {
    sun_position_t sun = sun_position(year, month, day);
    return 12 + timezone - longitude / 15 - sun.equation_of_time / 60; /* local clock hours */
}

int main(void) {
    sun_position_t sun = sun_position(2026, 10, 17);
    printf("declination %.2f deg, equation of time %.1f min\n", sun.declination, sun.equation_of_time);
    double noon = solar_noon(2026, 10, 17, 106.8456, 7); /* Jakarta, WIB */
    double h = floor(noon);
    printf("solar noon in Jakarta %02d:%04.1f\n", (int)h, (noon - h) * 60);
    return 0;
}
```

Build with `gcc -std=c23 sun.c -lm -o sun`.

  </TabItem>
</Tabs>

One line deserves a comment: `(q / 15 - right_ascension + 12) % 24 - 12`. The raw difference can come out as, say, 23.76 hours when it means "0.24 hours early", because right ascension wraps around at 24. Adding 12, taking the remainder, and subtracting 12 again folds it back into the range from -12 to +12, which keeps the result near zero where it belongs.

### Solar noon

The `solar_noon` function is the first prayer-shaped number in the series, so it is worth reading slowly.

```text
noon = 12 + timezone - longitude / 15 - equation_of_time / 60
```

Start at 12:00. The earth turns 15° every hour, so a city 106.8456° east of Greenwich sees the sun at its peak 7 hours and 7.4 minutes before Greenwich does, hence `- longitude / 15`. But Jakarta's clocks are set to UTC+7, a round 7 hours, so we add the timezone back. That leaves the sun peaking at 11:52.6 by the Jakarta clock if the sun were a perfect clock. It is not. On 17 October it is running 14.6 minutes early, so we subtract that too.

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 760 160" role="img" aria-label="Timeline from 12:00 to solar noon in Jakarta on 17 October 2026: minus 7.4 minutes for longitude, then minus 14.6 minutes for the equation of time, arriving at 11:38" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="currentColor" /></marker></defs>
<line x1="60" y1="90" x2="660" y2="90" stroke="currentColor" strokeWidth="1.5" />
<line x1="60.0" y1="85" x2="60.0" y2="95" stroke="currentColor" />
<text x="60.0" y="112" textAnchor="middle" fill="currentColor">11:30</text>
<line x1="160.0" y1="85" x2="160.0" y2="95" stroke="currentColor" />
<text x="160.0" y="112" textAnchor="middle" fill="currentColor">11:35</text>
<line x1="260.0" y1="85" x2="260.0" y2="95" stroke="currentColor" />
<text x="260.0" y="112" textAnchor="middle" fill="currentColor">11:40</text>
<line x1="360.0" y1="85" x2="360.0" y2="95" stroke="currentColor" />
<text x="360.0" y="112" textAnchor="middle" fill="currentColor">11:45</text>
<line x1="460.0" y1="85" x2="460.0" y2="95" stroke="currentColor" />
<text x="460.0" y="112" textAnchor="middle" fill="currentColor">11:50</text>
<line x1="560.0" y1="85" x2="560.0" y2="95" stroke="currentColor" />
<text x="560.0" y="112" textAnchor="middle" fill="currentColor">11:55</text>
<line x1="660.0" y1="85" x2="660.0" y2="95" stroke="currentColor" />
<text x="660.0" y="112" textAnchor="middle" fill="currentColor">12:00</text>
<path d="M 660.0 82 C 660.0 30 512.0 30 512.0 82" fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" />
<text x="586.0" y="35.0" textAnchor="middle" fill="currentColor">longitude, −7.4 min</text>
<path d="M 512.0 82 C 512.0 30 222.0 30 222.0 82" fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" />
<text x="367.0" y="35.0" textAnchor="middle" fill="currentColor">equation of time, −14.6 min</text>
<circle cx="660.0" cy="90" r="5" fill="currentColor" />
<text x="660.0" y="132" textAnchor="middle" fill="currentColor" fontWeight="400">12:00 clock noon</text>
<circle cx="512.0" cy="90" r="5" fill="currentColor" />
<text x="512.0" y="132" textAnchor="middle" fill="currentColor" fontWeight="400">11:52.6</text>
<circle cx="222.0" cy="90" r="5" fill="var(--ifm-color-primary)" />
<text x="222.0" y="132" textAnchor="middle" fill="var(--ifm-color-primary)" fontWeight="600">11:38.1 solar noon</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>How 12:00 becomes 11:38 in Jakarta on 17 October 2026. Two corrections, one for where you are and one for the date.</figcaption>
</figure>

## Check your work

Run the program. For 17 October 2026 you should see:

```text
declination -9.17 deg, equation of time 14.6 min
solar noon in Jakarta 11:38.1
```

A declination of -9.17° means the sun is standing over a point 9.17° south of the equator today, a little south of Jakarta, heading toward its southern limit in December. An equation of time of +14.6 minutes means the sun is running almost a quarter of an hour ahead of the clock.

Now check it against something you did not write. The NOAA solar calculator at [gml.noaa.gov/grad/solcalc](https://gml.noaa.gov/grad/solcalc/) uses a more detailed version of the same astronomy. Enter Jakarta's coordinates and the date, and compare its "Equation of Time", "Solar Declination" and "Solar Noon". They should match ours to within a tenth of a minute and a hundredth of a degree.

Then check it against the sky. At 11:38 on 17 October, a vertical stick in Jakarta casts its shortest shadow of the day, pointing almost due south. If you want to feel what the muwaqqit felt, go outside and watch it.

Finally, open the Kemenag timetable for Jakarta and look at Dhuhr for the same date. It says 11:41, not 11:38. That gap is not an error. Kemenag adds two minutes of *ihtiyat* to every prayer and then rounds up to the next whole minute, so 11:38.1 becomes 11:40.1 and then 11:41. The precaution is the practical form of the hadith of Uqbah in part 1, which forbids praying while the sun still stands at its peak. Part 3 is where we add it.

## A note on precision

The code evaluates the sun's position at the start of the day in UTC and uses that for the whole day. The declination changes by at most 0.4° a day, which is harmless for solar noon but can shift a twilight time by about a minute at high latitudes. The production algorithm in [libmuslim](/docs/libmuslim/c/Prayer%20times%20API/overview) recomputes the sun's position at the moment of each prayer. We will do the same from part 3 on, once we have a first estimate to refine.

## What to carry into part 3

From a date alone, two numbers: where the sun stands north or south, and how far the sun is ahead of or behind the clock. From the second one, plus your longitude, the moment the sun is highest over your city.

Part 3 brings in your latitude. With it, the declination tells us how high the sun gets at noon and, more importantly for prayer, at what time it crosses the horizon on the way up and on the way down. That gives us sunrise, which ends Fajr, and sunset, which is Maghrib. It also gives us the tool that part 4 will point below the horizon to find the twilight angles.
