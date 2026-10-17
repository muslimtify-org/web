---
slug: prayer-times-part-1-what-the-quran-and-sunnah-say
title: "Prayer times, part 1: what the Quran and Sunnah actually say"
authors:
  - rizukirr
tags: [muslimtify, prayer-time-calculation]
---

{/*
  REVIEW NOTES (not rendered):
  Hadith numbers follow sunnah.com numbering. Every citation marked VERIFY
  below must be checked against the printed collection by a reviewer with
  religious training before this post is published.
*/}

Open two prayer apps on the same phone, in the same city, on the same day, and there is a fair chance they will not agree on Fajr. One says 04:21, the other 04:27. Both are made by Muslims who care about getting it right. So who is wrong?

Usually nobody. To see why, you have to go back to where prayer times come from. Not from an app, and not from an astronomer, but from the Quran, from the Prophet ﷺ, and from the generations who learned from him. That is what this first part is about. There is no code in it, and no math. Just the texts, and what they ask us to look at in the sky.

{/* truncate */}

:::info[This is part 1 of a series]
The series explains how prayer times are defined and how a computer works them out. Later parts cover the sun's position, each prayer's formula, why Indonesia, Turkey and Saudi Arabia publish different tables, and a complete implementation you can run yourself. Each part stands on its own, but they read best in order.
:::

## The Quran gives anchors, not clock times

The Quran is clear that prayer has fixed times:

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا</p>

> "Indeed, prayer has been decreed upon the believers at specified times." (An-Nisa 4:103)

But when the Quran describes those times, it never says an hour or a minute. It points at the sun and the sky:

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا</p>

> "Establish prayer from the declining of the sun until the darkness of the night, and the recitation of dawn. Indeed, the recitation of dawn is ever witnessed." (Al-Isra 17:78)

The commentators read this one verse as a map of all five prayers. *Duluk ash-shams*, the sun beginning to decline from its highest point, is Dhuhr, and the stretch from there to *ghasaq al-layl*, the full darkness of night, covers Dhuhr, Asr, Maghrib and Isha. *Quran al-fajr*, the recitation at dawn, is Fajr.

Other verses add detail to the same picture:

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِّنَ اللَّيْلِ</p>

> "And establish prayer at the two ends of the day and in the early hours of the night." (Hud 11:114)

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ وَقَبْلَ غُرُوبِهَا ۖ وَمِنْ آنَاءِ اللَّيْلِ فَسَبِّحْ وَأَطْرَافَ النَّهَارِ</p>

> "And glorify your Lord with praise before the rising of the sun and before its setting, and during the hours of the night, and at the ends of the day." (Ta-Ha 20:130)

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ ۝ وَلَهُ الْحَمْدُ فِي السَّمَاوَاتِ وَالْأَرْضِ وَعَشِيًّا وَحِينَ تُظْهِرُونَ</p>

> "So glorify Allah when you reach the evening and when you reach the morning. To Him is praise in the heavens and the earth, and in the late afternoon and when you are at noon." (Ar-Rum 30:17-18)

And for the start of Fajr, the verse about the fast gives the most physical description of all:

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>وَكُلُوا وَاشْرَبُوا حَتَّىٰ يَتَبَيَّنَ لَكُمُ الْخَيْطُ الْأَبْيَضُ مِنَ الْخَيْطِ الْأَسْوَدِ مِنَ الْفَجْرِ</p>

> "And eat and drink until the white thread of dawn becomes distinct to you from the black thread." (Al-Baqarah 2:187)

Notice what the Quran is doing. It tells us *what to watch for*: the sun leaving its peak, the sun setting, the dark of night, a thin white line on the horizon. It does not tell us the minute. That is the whole reason a prayer time can be calculated at all. There is a physical event to find, and the sun follows laws we can write down.

## The Prophet ﷺ gave the windows

The Quran gives the anchors. The Sunnah gives each prayer a beginning and an end.

The single most useful hadith for anyone who wants to understand prayer times is narrated by Abdullah ibn Amr رضي الله عنهما, in Sahih Muslim:

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>وَقْتُ الظُّهْرِ إِذَا زَالَتِ الشَّمْسُ وَكَانَ ظِلُّ الرَّجُلِ كَطُولِهِ مَا لَمْ يَحْضُرِ الْعَصْرُ، وَوَقْتُ الْعَصْرِ مَا لَمْ تَصْفَرَّ الشَّمْسُ، وَوَقْتُ صَلَاةِ الْمَغْرِبِ مَا لَمْ يَغِبِ الشَّفَقُ، وَوَقْتُ صَلَاةِ الْعِشَاءِ إِلَىٰ نِصْفِ اللَّيْلِ الْأَوْسَطِ، وَوَقْتُ صَلَاةِ الصُّبْحِ مِنْ طُلُوعِ الْفَجْرِ مَا لَمْ تَطْلُعِ الشَّمْسُ</p>

> "The time of Dhuhr is when the sun has declined and a man's shadow is the length of his height, for as long as Asr has not come. The time of Asr lasts as long as the sun has not turned yellow. The time of Maghrib lasts as long as the twilight has not disappeared. The time of Isha extends to the middle of the night. And the time of Subh is from the appearance of dawn for as long as the sun has not risen." (Sahih Muslim 612) {/* VERIFY: number and exact wording */}

Read it slowly, because every number in a prayer app comes from a word in this hadith:

| The Prophet ﷺ said | The event in the sky | What the app computes |
| --- | --- | --- |
| "when the sun has declined" (*zalat ash-shams*) | the sun passes its highest point | Dhuhr |
| "a man's shadow is the length of his height" | shadow grows back to the object's length | Asr |
| "as long as the sun has not turned yellow" | late afternoon | end of Asr |
| "as long as the twilight (*shafaq*) has not disappeared" | the glow after sunset fades | Maghrib and the start of Isha |
| "to the middle of the night" | midpoint between sunset and dawn | end of Isha |
| "from the appearance of dawn" (*tulu' al-fajr*) | the first true light before sunrise | Fajr |
| "as long as the sun has not risen" | sunrise | end of Fajr |

<figure style={{margin: '2rem 0', textAlign: 'center'}}>
<svg viewBox="0 0 800 440" role="img" aria-label="The sun's daily arc with the five prayers marked: Fajr while the sun is still below the eastern horizon, sunrise, Dhuhr just after the top, Asr on the way down, Maghrib at sunset, Isha when the sun is below the western horizon" style={{maxWidth: '100%', height: 'auto'}} fontSize="12">
<line x1="40" y1="275" x2="760" y2="275" stroke="currentColor" strokeWidth="1.5" />
<text x="760" y="267" textAnchor="end" fill="currentColor">horizon</text>
<text x="60" y="293" fill="currentColor">east</text>
<text x="740" y="293" textAnchor="end" fill="currentColor">west</text>
<path d="M 194.5 366.5 A 225 225 0 0 1 175.0 275.0" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
<path d="M 175.0 275.0 A 225 225 0 0 1 625.0 275.0" fill="none" stroke="currentColor" strokeWidth="2" />
<path d="M 625.0 275.0 A 225 225 0 0 1 605.5 366.5" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
<path d="M 186.0 344.5 A 225 225 0 0 1 175.0 275.0" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="4" />
<path d="M 400.0 50.0 A 225 225 0 0 1 559.1 115.9" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="4" />
<path d="M 559.1 115.9 A 225 225 0 0 1 625.0 275.0" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="4" />
<path d="M 625.0 275.0 A 225 225 0 0 1 614.0 344.5" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="4" />
<circle cx="186.0" cy="344.5" r="6" fill="var(--ifm-color-primary)" />
<text x="172.0" y="344.5" textAnchor="end" fill="currentColor" fontWeight="600">Fajr</text>
<text x="172.0" y="359.5" textAnchor="end" fill="currentColor" fontSize="11">the white thread spreads</text>
<circle cx="175.0" cy="275.0" r="6" fill="var(--ifm-color-primary)" />
<text x="161.0" y="265.0" textAnchor="end" fill="currentColor" fontWeight="600">Sunrise</text>
<text x="161.0" y="280.0" textAnchor="end" fill="currentColor" fontSize="11">end of Fajr</text>
<circle cx="400.0" cy="50.0" r="6" fill="var(--ifm-color-primary)" />
<text x="400.0" y="34.0" textAnchor="middle" fill="currentColor" fontWeight="600">Dhuhr</text>
<text x="400.0" y="49.0" textAnchor="middle" fill="currentColor" fontSize="11">the sun has declined</text>
<circle cx="559.1" cy="115.9" r="6" fill="var(--ifm-color-primary)" />
<text x="573.1" y="109.9" textAnchor="start" fill="currentColor" fontWeight="600">Asr</text>
<text x="573.1" y="124.9" textAnchor="start" fill="currentColor" fontSize="11">a shadow equals its object</text>
<circle cx="625.0" cy="275.0" r="6" fill="var(--ifm-color-primary)" />
<text x="639.0" y="265.0" textAnchor="start" fill="currentColor" fontWeight="600">Maghrib</text>
<text x="639.0" y="280.0" textAnchor="start" fill="currentColor" fontSize="11">the sun has set</text>
<circle cx="614.0" cy="344.5" r="6" fill="var(--ifm-color-primary)" />
<text x="628.0" y="348.5" textAnchor="start" fill="currentColor" fontWeight="600">Isha</text>
<text x="628.0" y="363.5" textAnchor="start" fill="currentColor" fontSize="11">the twilight has disappeared</text>
<text x="400" y="315" textAnchor="middle" fill="currentColor" fontSize="11">below the horizon the sun is out of sight, but its depth still sets the light in the sky</text>
</svg>
<figcaption style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>Each prayer begins at a point on the sun's daily arc. The phrases are from the hadith of Abdullah ibn Amr. Fajr and Isha begin while the sun is below the horizon, which is why they need an angle rather than a shadow.</figcaption>
</figure>

The second great source is the hadith of Jibril عليه السلام, narrated by Ibn Abbas رضي الله عنهما. Jibril led the Prophet ﷺ in prayer at the Kaaba on two consecutive days, once at the earliest moment of each prayer and once at the latest, and then said:

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>يَا مُحَمَّدُ، هَٰذَا وَقْتُ الْأَنْبِيَاءِ مِنْ قَبْلِكَ، وَالْوَقْتُ مَا بَيْنَ هَٰذَيْنِ الْوَقْتَيْنِ</p>

> "O Muhammad, this is the time of the prophets before you, and the time is between these two times." (Sunan Abi Dawud 393, Jami' at-Tirmidhi 149) {/* VERIFY: numbers and wording of the closing sentence */}

Two details from this hadith will matter later. On the first day Jibril prayed Asr "when the shadow of a thing was equal to it", and on the second day "when the shadow of a thing was twice it". And on both days he prayed Fajr: once "when dawn broke" and once "when it had become quite bright". Keep those in mind. They are the oldest roots of two disagreements that still shape timetables today.

### Which dawn?

The word *fajr* needs care, because there are two dawns. The Prophet ﷺ explained the difference to the Companions in the context of suhur:

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>لَا يَغُرَّنَّكُمْ مِنْ سَحُورِكُمْ أَذَانُ بِلَالٍ وَلَا بَيَاضُ الْأُفُقِ الْمُسْتَطِيلُ هَٰكَذَا حَتَّىٰ يَسْتَطِيرَ</p>

> "Do not let the adhan of Bilal deceive you about your suhur, nor the whiteness of the horizon that rises vertically like this, until it spreads horizontally." (Sahih Muslim 1094) {/* VERIFY: number, narrated by Samurah ibn Jundub */}

The first light, a tall pale column that appears and then fades, is *al-fajr al-kadhib*, the false dawn. It has no legal effect. The true dawn, *al-fajr as-sadiq*, is the white light that spreads sideways along the horizon and only grows. That is the "white thread" of Al-Baqarah 2:187, and it is the moment Fajr begins. Bilal's night adhan was a reminder for the sleepers, and Ibn Umm Maktum's adhan marked the real dawn:

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>إِنَّ بِلَالًا يُؤَذِّنُ بِلَيْلٍ، فَكُلُوا وَاشْرَبُوا حَتَّىٰ يُؤَذِّنَ ابْنُ أُمِّ مَكْتُومٍ</p>

> "Bilal gives the adhan at night, so eat and drink until Ibn Umm Maktum gives the adhan." (Sahih al-Bukhari 617) {/* VERIFY: number */}

When a prayer app says Fajr is at 18° or 20° below the horizon, it is making a claim about when *this* horizontal light becomes visible. Hold that thought for part 4.

## The Companions turned observation into practice

The generation that prayed behind the Prophet ﷺ did not have tables. They had the sky, a stick, and what they had seen him do.

The stick matters more than it sounds. Plant a straight stick in the ground and its shadow is a clock. The shadow is shortest when the sun is at its peak, and the moment it starts to grow again is *zawal*, the start of Dhuhr. Mark the length of the shortest shadow, and when the shadow has grown by the stick's own height, Asr has come. Every muwaqqit for the next thousand years, and every line of code in part 5, is refining this stick.

When the Muslim state grew beyond Madinah, Umar ibn al-Khattab رضي الله عنه wrote to his governors describing when each prayer should be prayed, so that the far provinces would pray as Madinah prayed. Malik records the letter in the Muwatta. {/* VERIFY: Muwatta, Kitab Wuqut as-Salah, first hadiths of the book; quote the Dhuhr and Asr clauses here after checking the text */} This is the first time a Muslim authority set a common standard for prayer times across different lands, and it is the precedent behind every national timetable today.

The Companions also disagreed, and their disagreements were honest readings of the same words. The clearest example is *shafaq*, the twilight whose disappearance ends Maghrib and begins Isha. After sunset the western sky first glows red, and when the red fades a whiter glow lingers a while longer. Ibn Umar رضي الله عنهما held that *shafaq* is the redness. {/* VERIFY: reported by ad-Daraqutni and al-Bayhaqi as a statement of Ibn Umar */} Others held it to be the whiteness that follows. Red twilight disappears earlier than white, so the two readings put Isha some minutes apart. When you later see one country use 17° for Isha and another use 18°, this is where the difference was born.

## The Tabi'in and their students wrote it down

The scholars of the next two generations, the Tabi'in and the Tabi' at-Tabi'in, inherited these observations and turned them into fiqh. The four imams whose schools most Muslims follow today, Abu Hanifa, Malik, ash-Shafi'i and Ahmad ibn Hanbal, all lived in this period.

Most of what they wrote about prayer times agrees, because the hadith of Abdullah ibn Amr is explicit. The differences are few, and each one goes back to a text:

For Asr, Abu Hanifa took the second day of the hadith of Jibril literally. Asr begins when the shadow of an object is *twice* its height. Malik, ash-Shafi'i and Ahmad took the first day and the hadith of Abdullah ibn Amr: Asr begins when the shadow *equals* the height. In Muslimtify this is the madzhab setting, and it is the one part of the timetable that is not tied to any country.
For shafaq, Abu Hanifa, in one of the two reports from him, followed the view that *shafaq* is the white twilight, so Isha begins later. The other three imams followed the red twilight. {/* VERIFY: the attribution of the white shafaq view to Abu Hanifa and the opposing view of his two students */}
For Fajr, ash-Shafi'i and Malik preferred praying Fajr in *ghalas*, the early darkness, following Aisha رضي الله عنها who described women leaving the Prophet's mosque wrapped in their cloaks and unrecognizable in the dark. Abu Hanifa preferred *isfar*, a little later when the light had spread, following the hadith "Pray Fajr when it brightens, for that is greater in reward". (Jami' at-Tirmidhi 154) {/* VERIFY: number, narrated by Rafi' ibn Khadij */} This is a preference about when to pray within the window, not about when the window starts, but it shows how early the question of "how much light is dawn?" was already alive.

By the end of this period, every prayer had a legal definition in words: the sun declines, a shadow reaches a length, the sun sets, a colored glow disappears, a white line spreads along the horizon. What nobody had yet was a way to turn those words into a number for a given city on a given date. That came next, from the astronomers of Baghdad, Cairo and Damascus, and it is where part 2 begins.

## Why the same texts give different timetables

Now back to the two apps that disagreed about Fajr. If the definitions come from one hadith, how can Indonesia, Turkey, Egypt and Saudi Arabia each publish a different table? The answer has four parts, and every one of them is itself grounded in the sources.

### The texts describe something you have to see

Al-Baqarah 2:187 says "until the white thread becomes distinct *to you*". The hadith of Samurah describes a light that "spreads". These are instructions to observe, and observation depends on where the observer stands. Dawn in the dry air of the Hijaz does not look like dawn in the humid air of Java. Altitude, haze, dust, moonlight and city lights all change how deep the sun must be below the horizon before the first horizontal light can be seen. Egyptian observers in the nineteenth century settled on 19.5°. Indonesian observers settled on 20°. Muslim World League scholars settled on 18°. Each number is an honest answer to the question the Quran asked. They differ because the sky differs.

### The first generations already read the words differently

Red or white *shafaq*. One shadow or two for Asr. *Ghalas* or *isfar* for Fajr. None of these is a modern invention. A country whose scholars follow the Hanafi school will set Isha later than a country that follows the Shafi'i school, and both are standing on the reading of an imam who learned from the Tabi'in. A table is not wrong for following a different legitimate reading.

### Precaution is itself a Sunnah

The Prophet ﷺ said:

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>دَعْ مَا يَرِيبُكَ إِلَىٰ مَا لَا يَرِيبُكَ</p>

> "Leave what makes you doubt for what does not make you doubt." (Jami' at-Tirmidhi 2518) {/* VERIFY: number, narrated by al-Hasan ibn Ali */}

Prayer times are a place where this is applied every day. Praying Dhuhr a minute *before* the sun has left its peak would make the prayer invalid, and the Prophet ﷺ forbade praying at that moment:

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>ثَلَاثُ سَاعَاتٍ كَانَ رَسُولُ اللَّهِ ﷺ يَنْهَانَا أَنْ نُصَلِّيَ فِيهِنَّ: حِينَ تَطْلُعُ الشَّمْسُ بَازِغَةً حَتَّىٰ تَرْتَفِعَ، وَحِينَ يَقُومُ قَائِمُ الظَّهِيرَةِ حَتَّىٰ تَمِيلَ الشَّمْسُ، وَحِينَ تَضَيَّفُ الشَّمْسُ لِلْغُرُوبِ حَتَّىٰ تَغْرُبَ</p>

> "There are three times at which the Messenger of Allah ﷺ forbade us to pray: when the sun rises until it is well up, when it stands at its zenith until it declines, and when it leans toward setting until it has set." (Sahih Muslim 831) {/* VERIFY: number, narrated by Uqbah ibn Amir */}

So authorities add a safety margin. Indonesia's Kemenag adds two minutes to every prayer and calls it *ihtiyat*, precaution. Turkey's Diyanet adds a larger *temkin*. Umm al-Qura in Makkah defines Isha as a fixed ninety minutes after Maghrib rather than an angle, which is simpler for the public and never early. These margins are a reason tables differ, and they are a direct application of the hadith above.

### Authority settles what ijtihad leaves open

<p dir="rtl" lang="ar" style={{fontSize: '1.45rem', lineHeight: 2.1}}>يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ وَأُولِي الْأَمْرِ مِنكُمْ</p>

> "O you who believe, obey Allah and obey the Messenger and those in authority among you." (An-Nisa 4:59)

When a question has more than one legitimate answer, the scholars of fiqh hold that the ruling of the authority removes the disagreement for the people under it. Umar's letter to his governors was exactly this. Today the same role is played by Kemenag in Indonesia, JAKIM in Malaysia, Diyanet in Turkey, the Egyptian General Authority of Survey, and the rest of the twenty-one standards Muslimtify ships. A Muslim in Jakarta follows the Kemenag table not because 20° is the only defensible angle, but because that is what the authority responsible for Indonesian Muslims has adopted, after its own observation and ijtihad.

This is why Muslimtify asks you to pick a calculation method instead of guessing one, and why it defaults to Kemenag: it is the standard of the country its author prays in. Picking the method of your own country is not a technical setting. It is choosing which authority's ijtihad you follow.

## What to carry into part 2

Every prayer time starts as a word in a hadith. The words name events in the sky. The events can be seen with the eye, and because the sun is predictable, they can also be computed. Where the texts leave room, the first generations already read them more than one way, the scholars of each land added their own precaution, and the authority of each country chose one answer for its people.

In part 2 we leave the texts and go outside. We will work out where the sun is on any day of the year for any place on earth, which is the one piece of astronomy everything else in this series depends on. Bring a stick.

{/*
  SOURCES TO CONFIRM BEFORE PUBLISHING
  - Sahih Muslim 612 (Abdullah ibn Amr): wording of each clause.
  - Sunan Abi Dawud 393 / Jami' at-Tirmidhi 149 (Ibn Abbas, hadith of Jibril): closing sentence and the Asr and Fajr clauses for both days.
  - Sahih Muslim 1094 (Samurah): false and true dawn.
  - Sahih al-Bukhari 617 (Ibn Umar): Bilal and Ibn Umm Maktum.
  - Muwatta Malik, Kitab Wuqut as-Salah: Umar's letter to the governors. Add the quote.
  - Ibn Umar's statement that shafaq is the redness: Daraqutni / Bayhaqi, and confirm it is mawquf.
  - Attribution of the white-shafaq view to Abu Hanifa and the red view to Abu Yusuf and Muhammad.
  - Sahih al-Bukhari 578 (Aisha, ghalas) if you decide to quote it in Arabic.
  - Jami' at-Tirmidhi 154 (Rafi' ibn Khadij, isfar).
  - Jami' at-Tirmidhi 2518 (al-Hasan ibn Ali, "leave what makes you doubt").
  - Sahih Muslim 831 (Uqbah ibn Amir, three forbidden times).
  - Quran translations are adapted from Saheeh International. Decide on one translation and credit it.
*/}
