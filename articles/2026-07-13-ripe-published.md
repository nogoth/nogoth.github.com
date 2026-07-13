---
title: Rust Internet Pipe Engine
date: 2026-07-13
excerpt: Published a Rust project to emulate the old Pipes flow for RSS feeds
tags: [rust, claude, tui, ratatui]
author: nogoth
---

## I published ripe. 

Yeah I know that i'm supposed to exclaim this all over creation and claim all the code was written by me. It wasn't.
The whole point of the project [here](http://github.com/nogoth/ripe) is to highlight what using an LLM to help create
a new project could look like. 

The rough idea was to take the old Pipes project that yahoo had posted and recreate it with the ratatui library. 
Put up a rough idea and got a mock up of a view in jpeg format and that seemed to be what I was looking for.

The hope was to make something that was a TUI and that I could use on the regular to add in new feeds and make them
more readable or drop certain scored or mentions before adding to my feed reader. I hacked out two sides the ripe ui, and
then added the ability to hook it up to a cron job to output the file or stdout to some location and let me either 
publish the new rss to another web server or feed the stdout to 'some other program' (emacs).

All in all, it has bugs, there were iterations spent trying to stomp them all, but there are some UI features 
that I don't really like (for me ctrl-s to save is Weird). there is a <Leader> character ':' and that lest me 
search over the various commands that are in the program so I didn't have to remember that 's' is not the same as 'S'
or the like.

Next up, given time, is to make the github actions do releases. Using llm's to help find documentation, not 
trusting it, and then going to the old googling has been super helpful, both in keeping me from blindly trusting everything 
it says, and helping to reinforce the various ideas that turn out are 80%ly correct.


