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
import {formatTimezone} from "../util/misc";

export const match = /^https:\/\/(.+\.)?twitter\.com/

async function injectProfileHeader (header: HTMLElement) {
    const node = header.parentElement!
    const id = await fetchReactProp(node, [ 'return', 'return', 'memoizedProps', 'user', 'id_str' ])
    if (!id) return

    const timezone = await fetchTimezone('twitter', id)
    if (timezone === 'unspecified') return

    const prevPronouns = header.querySelector<HTMLElement>('[data-timezonedb]')
    if (prevPronouns) {
        prevPronouns.innerText = formatTimezone(timezone, true)
        return
    }

    const template = header.children[header.children.length - 1];
    header.appendChild(
        h(
            'span',
            { class: template.className, 'data-timezonedb': 'true' },
            commentDiscussion({ class: template.children[0].getAttribute('class')! }),
            formatTimezone(timezone, true)
        )
    )
}

async function injectProfilePopOut (popout: HTMLElement) {
    const userInfo = popout.querySelector('a + div')?.parentElement
    const template = userInfo?.querySelector<HTMLElement>('a [dir=ltr]')
    if (!template || !userInfo) return

    const id = await fetchReactProp(popout, [ 'memoizedProps', 'children', '2', 'props', 'children', 'props', 'userId' ])
    if (!id) return

    const timezone = await fetchTimezone('twitter', id)
    if (timezone === 'unspecified') return

    const childClass = template.children[0].className
    const parentClass = template.className
    const element = h(
        'span',
        { class: parentClass, 'data-timezonedb': 'true' },
        h(
            'span',
            {
                class: childClass,
                style: css({
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '4px',
                }),
            },
            commentDiscussion({
                style: css({
                    color: 'inherit',
                    fill: 'currentColor',
                    width: '1.1em',
                    height: '1.1em',
                    marginRight: '4px',
                }),
            }),
            formatTimezone(timezone)
        )
    )

    const prevPronouns = popout.querySelector('[data-timezonedb]')
    if (prevPronouns) prevPronouns.remove()
    userInfo.appendChild(element)
}

function handleMutation (nodes: MutationRecord[]) {
    const layers = document.querySelector<HTMLElement>('#layers')
    if (!layers) return

    for (const { addedNodes } of nodes) {
        // @ts-ignore
        for (const added of addedNodes) {
            if (added instanceof HTMLElement) {
                if (added.tagName === 'META' && added.getAttribute('property') === 'al:android:url' && added.getAttribute('content')?.startsWith('twitter://user?')) {
                    const header = document.querySelector<HTMLElement>('[data-testid="UserProfileHeader_Items"]')!
                    const prevPronouns = header.querySelector('[data-timezonedb]')
                    if (prevPronouns) prevPronouns.remove()
                    injectProfileHeader(header)
                    continue
                }

                if (
                    added.tagName === 'LINK'
                    && added.getAttribute('rel') === 'canonical'
                    && document.head.querySelector('meta[property="al:android:url"]')?.getAttribute('content')?.startsWith('twitter://user?')
                ) {
                    const header = document.querySelector<HTMLElement>('[data-testid="UserProfileHeader_Items"]')!
                    if (header.querySelector('[data-timezonedb]')) continue
                    injectProfileHeader(header)
                    continue
                }

                if (layers.contains(added)) {
                    const link = added.querySelector('a[href*="/following"]')
                    if (link) injectProfilePopOut(link.parentElement!.parentElement!.parentElement!.parentElement!)
                    continue
                }
            }
        }
    }
}

export function inject() {
    const header = document.querySelector<HTMLElement>('[data-testid="UserProfileHeader_Items"]')
    if (header) injectProfileHeader(header)

    const observer = new MutationObserver(handleMutation)
    observer.observe(document, { childList: true, subtree: true })
}