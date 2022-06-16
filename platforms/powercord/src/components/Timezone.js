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

const { React, Flux, getModule } = require('powercord/webpack');
const { loadTimezone } = require('../store/action.js');
const store = require('../store/store.js');

const { formatTimezone } = require('../util.js');
const UsersStore = getModule(['getCurrentUser', 'getUser'], false);

function Timezone({
	userId,
	render,
	prefix,
	display,
	timezone,
	displayCurrent,
}) {
	React.useEffect(() => void loadTimezone(userId), [userId]);
	if (!timezone) return null;
	const p = formatTimezone(timezone, displayCurrent ?? false);

	if (!p || !display) return null;
	return render
		? render(p)
		: React.createElement(
				React.Fragment,
				null,
				prefix ?? null,
				React.createElement('span', null, p),
		  );
}

module.exports = Flux.connectStores(
	[store, powercord.api.settings.store, UsersStore],
	({ userId, region }) => ({
		timezone: store.getTimezone(userId),
		display:
			powercord.api.settings.store.getSetting(
				'timezonedb-powercord',
				`display-${region}`,
				true,
			) &&
			(UsersStore.getCurrentUser().id !== userId ||
				!powercord.api.settings.store.getSetting(
					'timezonedb-powercord',
					'hide-self',
					false,
				)),
	}),
)(React.memo(Timezone));
