/*
 * Copyright (c) 2020-2022 Cynthia K. Rey, All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
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

import { commentDiscussion } from '../icons/octicons';
import { fetchTimezone } from '../util/fetch';
import { fetchReactProp } from '../util/react';
import { h, css } from '../util/dom';
import {formatTimezone} from "~/contentScripts/util/misc";

export const match = /^https:\/\/(.+\.)?twitch\.tv/

const settings = {
    chat: true,
    popout: true,
    streamer: true,
    chatStyle: 'badge',
}

const usersCache = Object.create(null)
async function injectChat (element: HTMLElement) {
    const isFFZ = !element.dataset.aUser

    let userId
    if (isFFZ) {
        userId = element.parentElement?.parentElement?.dataset.userId
    } else {
        const username = element.dataset.aUser
        if (!username) return
        if (!(username in usersCache)) {
            // eslint-disable-next-line require-atomic-updates
            usersCache[username] = await fetchReactProp(element, [ 'return', 'key' ]).then((s) => s.split('-')[0])
        }

        userId = usersCache[username]
    }

    const timezone = await fetchTimezone('twitch', userId)
    if (timezone === 'unspecified') return

    if (settings.chatStyle === 'badge') {
        const badgesContainer = isFFZ
            ? element.parentElement?.parentElement?.querySelector('.chat-line__message--badges')
            : element.parentElement?.parentElement?.parentElement?.firstChild
        if (!badgesContainer) return

        badgesContainer.insertBefore(
            h(
                'span',
                {
                    class: 'timezonedb-chat-badge',
                    style: css({
                        display: 'inline-block',
                        borderRadius: 'var(--border-radius-medium)',
                        backgroundColor: 'var(--color-background-button-secondary-default)',
                        color: 'var(--color-text-button-secondary)',
                        lineHeight: '1.8rem',
                        position: 'relative',
                        bottom: '-1px',
                        marginRight: '4px',
                        padding: '0 2px',
                    }),
                },
                formatTimezone(timezone)
            ),
            badgesContainer.firstChild!
        )
    } else {
        element.parentElement?.appendChild(
            h(
                'span',
                {
                    class: 'timezonedb-chat-inline',
                    style: (element.getAttribute('style') || '') + css({ opacity: '0.7' }),
                },
                ` (${formatTimezone(timezone)})`
            )
        )
    }

    if (!document.querySelector('.chat-paused-footer')) {
        const scroller = document.querySelector('[data-a-target="chat-scroller"] .simplebar-scroll-content')
        scroller?.scrollTo(0, scroller.scrollHeight)
    }
}

async function injectViewerCard (element: HTMLElement) {
    const container = element.querySelector<HTMLElement>('.viewer-card-header__display-name')
    if (!container) return

    const query = { $find: 'targetUser', $in: [ 'child', 'sibling', 'memoizedProps', '0', '1' ] }
    const cardId = await fetchReactProp(element, [ query, 'targetUser', 'id' ])
    if (!cardId) return

    const timezone = await fetchTimezone('twitch', cardId)
    if (timezone === 'unspecified') return

    container.appendChild(
        h(
            'div',
            {
                class: 'timezonedb-viewer-card',
                style: css({ display: 'flex', color: 'var(--color-text-overlay)' }),
            },
            commentDiscussion({ fill: 'var(--color-fill-current)' }),
            h(
                'p',
                {
                    style: css({
                        marginLeft: '0.5rem',
                        marginTop: 'auto',
                        color: 'var(--color-text-overlay)',
                        fontSize: 'var(--font-size-6)',
                    }),
                },
                formatTimezone(timezone, true)
            )
        )
    )
}

async function injectStreamerAbout () {
    const channelInfo = document.querySelector<HTMLElement>('.channel-info-content')
    if (!channelInfo) return

    const streamerId = await fetchReactProp(channelInfo, [ { $find: 'channelID', $in: [ 'child', 'memoizedProps' ] }, 'channelID' ])
    if (!streamerId) return

    const timezone = await fetchTimezone('twitch', streamerId)
    if (timezone === 'unspecified') return

    const el = document.querySelector('.about-section div + div span div')
    if (!el) return

    const prevPronounsContainer = el.querySelector<HTMLElement>('.timezonedb-streamer-about div')
    if (prevPronounsContainer) {
        prevPronounsContainer.innerText = formatTimezone(timezone, true);
        return
    }

    el.appendChild(
        h('div', {
            class: 'timezonedb-streamer-about',
            style: css({
                marginLeft: '0.5rem',
                marginRight: '0.5rem',
                fontSize: 'var(--font-size-5)',
                lineHeight: 'var(--line-height-heading)',
                fontWeight: 'var(--font-weight-semibold)',
            }),
        }, '·')
    )

    el.appendChild(h('div', {}, formatTimezone(timezone, true)))
}

function handleMutation (nodes: MutationRecord[]) {
    for (const { addedNodes } of nodes) {
        for (const added of addedNodes) {
            if (added instanceof HTMLElement) {
                if (settings.chat) {
                    const displayName = added.querySelector<HTMLElement>('.chat-author__display-name')
                    if (added.className.includes('chat-line__') && displayName) {
                        injectChat(displayName)
                        continue
                    }
                }

                const viewerCard = added.firstElementChild as HTMLElement
                if (settings.popout && viewerCard?.dataset.aTarget === 'viewer-card') {
                    injectViewerCard(added)
                    continue
                }

                if (settings.streamer && added.querySelector('.about-section')) {
                    injectStreamerAbout()
                    continue
                }
            }
        }
    }
}

export function inject () {
    // todo: load settings

    // Process all existing elements
    document.querySelectorAll<HTMLElement>('.chat-author__display-name').forEach((el) => injectChat(el))
    if (document.querySelector('.about-section')) injectStreamerAbout()

    // Start observer
    const observer = new MutationObserver(handleMutation)
    observer.observe(document, { childList: true, subtree: true })
}