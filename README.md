# TimezoneDB
TimezoneDB is an easy, cross-platform method of keeping track of others'
timezones.

This project is inspired by [PronounDB], and we'd like to recognize [Cynthia]
for all her hard work on that project. This project wouldn't have happened if
not for PronounDB giving me the idea, and we've found a lot of the code from it
useful here (See [the License section](#license) for legal info).

> **Note**
> This project is "source-visible", meaning while it may be open source, we are
> not committed to documenting it for hosting it on your own. This also means we
> offer no warranty if you attempt to do so. *Self-host at your own risk!*

## Project motivation
Now more than ever, people across the world are connected by the internet in new
and exciting ways. As amazing and cool as this is, it also brings to light one
small problem: time differences. This becomes especially noticeable in instant
message platforms like [Discord](https://discord.com) or on social media. Many
people already put their timezone in a bio or a status, in an effort to help
other users determine their time, but it's usually not enough, because people
don't always think to look in such places.

The goal of this project is to allow people to set their timezone in a
standardized way. Other users of our tools will automatically see their timezone
and their current time in a semantic location on their profile, as part of the
platform UI The concept is  similar to [PronounDB](https://pronoundb.org) but
focused on timezone coordination rather than pronouns.

## Project goals
My primary goals for the project is to allow users to set a timezone and other
users to see their timezone and current time via application extensions. There
will be no secondary or tertiary goals.

## Roadmap
Moved to the issues tab.

# Contributing
All the essential API logic for the project can be found under the `api`
directory and is written in Kotlin. [Ktor](https://ktor.io) is used for HTTP
handling.

All supported platform integrations will be included in subdirectories of the 
`platforms` directory.

The website code will be kept inside the `web` directory and written using
Typescript and Vue.js.

Before you contribute, we ask that you have a working knowledge of HTTP services
and the languages we are using to facilitate such communications in this project
(Kotlin & Typescript). We also ask that you respect our users, employees and
fellow contributors when contributing to our software.

# License
This software is licenced under the [MIT License](LICENSE), &copy; 2022-CURRENT
Synapse Technologies, LLC.

Parts of this software were borrowed from [PronounDB][PDB-Github] and respect
its [BSD 3-Clause license][PDB-License].

You are free to reuse our work commercially, but we ask that if you find our
software useful, please reach out to us so that we can showcase how our software
is being used.

[PronounDB]: https://pronoundb.org
[Cynthia]: https://cynthia.dev/
[PDB-Github]: https://github.com/cyyynthia/pronoundb.org
[PDB-License]: https://github.com/cyyynthia/pronoundb.org/blob/mistress/LICENSE