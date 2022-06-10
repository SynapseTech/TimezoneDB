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

const { resolve } = require('path')
const { React, getModule } = require('powercord/webpack')
const { Card } = require('powercord/components')
const { SETTINGS_FOLDER } = require('powercord/constants')
const { gotoOrJoinServer } = require('powercord/util')
const { DISCORD_INVITE } = require('../constants');

const REPO = 'SynapseTech/TimezoneDB'

class ErrorBoundary extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      crashed: false
    }
  }

  componentDidCatch (e) {
    const basePath = resolve(SETTINGS_FOLDER, '..')

    this.setState({
      crashed: true,
      error: (e.stack || '')
        .split('\n')
        .filter(l => !l.includes('discordapp.com/assets/') && !l.includes('discord.com/assets/'))
        .join('\n')
        .split(basePath)
        .join('')
    })
  }

  render () {
    if (this.state.crashed) {
      return (
        <Card className='timezonedb-error'>
          <p>
            An error occurred while rendering the preview. Please let us know by opening an issue
            on the <a href={`https://github.com/${REPO}/issues`} target='_blank'>GitHub repository</a>,
            or by filing a bug report in <a href='#' onClick={this.joinDiscord}>our server</a>.
          </p>
          <code>{this.state.error}</code>
        </Card>
      )
    }

    return this.props.children
  }

  joinDiscord() {
    getModule(['popLayer'], false).popLayer()
    gotoOrJoinServer(DISCORD_INVITE)
  }
}

module.exports = ErrorBoundary