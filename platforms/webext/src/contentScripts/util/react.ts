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

import { createDeferred } from './deferred';

type QueryElement = string | { $find: string; $in: string[] };

// @ts-ignore
const isFirefox = !chrome;
const callbacks = new Map();
let targetId = 0;

function bridgeReactStuff(
	nodes: HTMLElement[],
	propPath: QueryElement[],
	args?: any[],
): Promise<any[]> {
	const targets = nodes.map(
		(node) => (node.dataset.timezonedbTargetId = String(++targetId)),
	);
	const deferred = createDeferred<any>();
	const id = Math.random().toString(36).slice(2);
	const timeout = setTimeout(() => {
		deferred.resolve(null);
		console.error(
			'[TimezoneDB::bridge] Invocation timed out after 10 seconds.',
		);
	}, 10e3);

	callbacks.set(id, (v: any) => {
		callbacks.delete(id);
		deferred.resolve(v);
		clearTimeout(timeout);
	});

	window.postMessage(
		{
			source: 'timezonedb',
			payload: {
				action: 'bridge.query',
				targets: targets,
				props: propPath,
				args: args,
				id: id,
			},
		},
		'*',
	);

	return deferred.promise;
}

function doFetchReactProp(
	targets: Array<Element | null>,
	propPath: QueryElement[],
) {
	console.log('tgt', targets);
	const first = targets.find(Boolean);
	if (!first) return [];

	const reactKey = Object.keys(first).find(
		(k) =>
			k.startsWith('__reactInternalInstance') ||
			k.startsWith('__reactFiber'),
	);
	if (!reactKey) return [];

	let props = [];
	for (const element of targets) {
		if (!element) {
			// @ts-ignore
			props.push(null);
			continue;
		}

		let res = (element as any)[reactKey];
		for (const prop of propPath) {
			if (!res) break;
			if (typeof prop === 'string') {
				res = res[prop];
				continue;
			}

			const queue = [res];
			res = null;
			while (queue.length) {
				const el = queue.shift();
				if (prop.$find in el) {
					res = el;
					break;
				}

				for (const p of prop.$in) {
					// eslint-disable-next-line eqeqeq -- Intentional check for undefined & null
					if (p in el && el[p] != null) queue.push(el[p]);
				}
			}
		}

		// @ts-ignore
		props.push(res);
	}

	return props;
}

function doExecuteReactProp(
	targets: Array<Element | null>,
	propPath: QueryElement[],
	args: any[],
) {
	const fn = propPath.pop()!;
	if (typeof fn !== 'string') throw new Error('invalid query');
	const obj = doFetchReactProp(targets, propPath);
	// @ts-ignore
	return obj.map((o) => o[fn].apply(o, args));
}

/**
 * Deprecated in favor of transparent bulking at request-level.
 * New react fetch impl is light enough that the footprint can be ignored.
 * @deprecated
 */
export async function fetchReactPropBulk(
	nodes: HTMLElement[],
	propPath: QueryElement[],
) {
	if (isFirefox) {
		// @ts-ignore
		return doFetchReactProp(
			nodes.map((node) => node.wrappedJSObject),
			propPath,
		);
	}

	return bridgeReactStuff(nodes, propPath);
}

/**
 * Deprecated in favor of transparent bulking at request-level.
 * New react fetch impl is light enough that the footprint can be ignored.
 * @deprecated
 */
export async function executeReactPropBulk(
	nodes: HTMLElement[],
	propPath: QueryElement[],
	...args: any[]
) {
	if (isFirefox) {
		// @ts-expect-error
		return doExecuteReactProp(
			nodes.map((node) => node.wrappedJSObject),
			propPath,
			cloneInto(args, window),
		);
	}

	return bridgeReactStuff(nodes, propPath, args);
}

export async function fetchReactProp(
	node: HTMLElement,
	propPath: QueryElement[],
) {
	return fetchReactPropBulk([node], propPath).then((res) => res[0]);
}

export async function executeReactProp(
	node: HTMLElement,
	propPath: QueryElement[],
	...args: any[]
) {
	return executeReactPropBulk([node], propPath, ...args).then(
		(res) => res[0],
	);
}

// Inject main context bridge for Chromium
export function initReact() {
	if (!isFirefox) {
		window.addEventListener('message', (e) => {
			if (e.source === window && e.data?.source === 'timezonedb') {
				const data = e.data.payload;
				if (data.action === 'bridge.result') {
					if (!callbacks.has(data.id)) {
						console.warn(
							'[TimezoneDB::bridge] Received unexpected bridge result',
						);
						return;
					}

					callbacks.get(data.id).call(null, data.res);
				}
			}
		});

		const scriptEl = document.createElement('script');
		console.log('runtimeUrl', browser.runtime.getURL('/reactRuntime.js'));
		scriptEl.src = browser.runtime.getURL('/reactRuntime.js');
		document.head.appendChild(scriptEl);
	}
}
