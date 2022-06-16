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

const dateFormat = require('./dateformat');

const { React } = require('powercord/webpack');

function wrapInHooks(fn) {
	return function (...args) {
		// IntelliJ does NOT like this
		const reactCurrent =
			React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
				.ReactCurrentDispatcher.current;
		const ogUseMemo = reactCurrent.useMemo;
		const ogUseState = reactCurrent.useState;
		const ogUseEffect = reactCurrent.useEffect;
		const ogUseLayoutEffect = reactCurrent.useLayoutEffect;
		const ogUseRef = reactCurrent.useRef;
		const ogUseCallback = reactCurrent.useCallback;

		reactCurrent.useMemo = (f) => f();
		reactCurrent.useState = (v) => [v, () => void 0];
		reactCurrent.useEffect = () => null;
		reactCurrent.useLayoutEffect = () => null;
		reactCurrent.useRef = () => ({});
		reactCurrent.useCallback = (c) => c;

		const res = fn(...args);

		reactCurrent.useMemo = ogUseMemo;
		reactCurrent.useState = ogUseState;
		reactCurrent.useEffect = ogUseEffect;
		reactCurrent.useLayoutEffect = ogUseLayoutEffect;
		reactCurrent.useRef = ogUseRef;
		reactCurrent.useCallback = ogUseCallback;

		return res;
	};
}

// below this line is my own code and follows the project's regular license

function adjustForTimezone(d, offset) {
	const date = d.toISOString();
	const targetTime = new Date(date);
	const tzDifference = offset + targetTime.getTimezoneOffset() * 60;
	// convert the offset to milliseconds, add to targetTime, and return a new Date
	return new Date(targetTime.getTime() + tzDifference * 1000);
}

function formatTimezone(zone, includeCurrent = false) {
	let result = zone.id;

	if (includeCurrent) {
		const date = adjustForTimezone(new Date(), zone.offset);
		result += ` (Currently ${dateFormat(date, 'h:MM TT')})`;
	}

	return result;
}

module.exports = { wrapInHooks, adjustForTimezone, formatTimezone };
