import { h } from '../util/dom';
import {commentDiscussion} from "../icons/octicons";
import {fetchTimezone} from "../util/fetch";
import {formatTimezone} from "../util/misc";

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