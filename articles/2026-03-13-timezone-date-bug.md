---
title: The One-Day-Off Date Bug
date: 2026-03-13
time: 13:38
excerpt: How a subtle JavaScript timezone quirk made today's article dates show up as yesterday.
tags: [javascript, bugs, timezone]
author: nogoth
---

Today's articles were showing March 12 instead of March 13, while the older ones from March 4 looked fine. The cause was a single line: `new Date("2026-03-13")`. When you give JavaScript a date string with no time attached, it assumes you mean midnight UTC. But if you're in a timezone behind UTC, like Mountain Time (UTC-6), midnight UTC is actually 6 PM the previous evening in your local clock. So the browser displayed March 12. The March 4 articles weren't visibly affected because the off-by-one landed on March 3—still obviously wrong, but nobody noticed until today's date didn't match the calendar staring back at us. The fix was dead simple—append `T00:00:00` to the date string so JavaScript treats it as midnight local time instead of midnight in London. One of those bugs where the code looks perfectly fine until the browser and the calendar disagree on what "today" means.
