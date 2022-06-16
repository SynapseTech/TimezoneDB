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

const { React } = require('powercord/webpack');
const { SwitchItem, TextInput } = require('powercord/components/settings');
const ErrorBoundary = require('./ErrorBoundary.jsx');
const Preview = require('./Preview.jsx');

function Settings({ getSetting, updateSetting, toggleSetting }) {
	return (
		<div>
			<ErrorBoundary>
				<Preview />
			</ErrorBoundary>

			<SwitchItem
				value={getSetting('display-chat', true)}
				onChange={() => toggleSetting('display-chat', true)}
			>
				Show timezone in chat
			</SwitchItem>

			<SwitchItem
				value={getSetting('display-popout', true)}
				onChange={() => toggleSetting('display-popout', true)}
			>
				Show timezone in pop-outs
			</SwitchItem>

			<SwitchItem
				value={getSetting('display-profile', true)}
				onChange={() => toggleSetting('display-profile', true)}
			>
				Show timezone in profiles
			</SwitchItem>

			<SwitchItem
				value={getSetting('display-autocomplete', true)}
				onChange={() => toggleSetting('display-autocomplete', true)}
			>
				Show timezone in autocomplete
			</SwitchItem>

			<SwitchItem
				value={getSetting('hide-self', false)}
				onChange={() => toggleSetting('hide-self', false)}
				note='This will locally hide your own timezone, if you do not wish it to appear.'
			>
				Do not show timezone for myself
			</SwitchItem>

			<TextInput
				note={
					"The base API endpoint. Don't change this unless you know what you're doing."
				}
				value={getSetting('api-url', 'https://tzdbapi.synapsetech.dev')}
				required
				onChange={(val) =>
					updateSetting(
						'api-url',
						val.endsWith('/') ? val.slice(0, -1) : val,
					)
				}
			/>

			<a
				href='https://tzdb.synapsetech.dev/legal/attribution'
				target='_blank'
			>
				Attribution
			</a>
		</div>
	);
}

module.exports = React.memo(Settings);
