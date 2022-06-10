/*
 * Copyright (c) 2020-2021 Cynthia K. Rey, All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { h } from '../util/dom';
import { commentDiscussion } from '../icons/octicons';
import { fetchTimezone } from '../util/fetch';
import { formatTimezone } from '../util/misc';

export const match = /^https:\/\/(.+\.)?github\.com/

async function injectUserProfile () {
    const userId = document.querySelector<HTMLElement>('[data-scope-id]')!.dataset.scopeId
    const list = document.querySelector('.vcard-details')
    if (!userId || !list) return

    const timezone = await fetchTimezone('github', userId)
    if (timezone === 'unspecified') return

    const formattedZone = formatTimezone(timezone, true);
    const el = h(
        'li',
        {
            class: 'vcard-detail pt-1 css-truncate css-truncate-target hide-sm hide-md',
            itemprop: 'timezone',
            show_title: false,
            'aria-label': `Timezone: ${formattedZone}`,
        },
        commentDiscussion({ class: 'octicon' }),
        h('span', { class: 'p-label' }, formattedZone)
    )

    list.appendChild(el)

    // Tabs do not trigger a page reload but does re-render everything, so we need to re-inject
    document.querySelectorAll('.UnderlineNav-item').forEach((tab) => {
        let hasTriggered = false
        tab.addEventListener('click', () => {
            if (hasTriggered) return

            hasTriggered = true
            const interval = setInterval(() => {
                if (!document.querySelector('.vcard-details [itemprop="timezone"]')) {
                    clearInterval(interval)
                    injectUserProfile()
                }
            }, 100)
        })
    })
}


export function inject () {
    if (document.querySelector('.user-profile-bio')) injectUserProfile();
}