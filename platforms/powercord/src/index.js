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

const { Plugin } = require('powercord/entities')
const { inject, uninject } = require('powercord/injector')
const { React, getModule, getModuleByDisplayName } = require('powercord/webpack')
const { getReactInstance } = require('powercord/util')

const useTimezone = require('./store/useTimezone.js')
const Timezone = require('./components/Timezone.js')
const Settings = require('./components/Settings.jsx')

class TimezoneDB extends Plugin {
  async startPlugin () {
    this.loadStylesheet('styles.css')
    powercord.api.settings.registerSettings('timezonedb', {
      category: this.entityID,
      label: 'TimezoneDB',
      render: Settings
    })

    const _this = this;
    const UserInfoBase = await getModule((m) => m.default?.displayName == 'UserInfoBase')
    const MessageHeader = await this._getMessageHeader()
    const UserPopOutComponents = await getModule([ 'UserPopoutProfileText' ])
    const Autocomplete = await getModuleByDisplayName('Autocomplete')

    let memoizedType
    inject('timezonedb-messages-header', MessageHeader, 'default', function ([ props ], res) {
      if (!memoizedType) {
        const ogType = res.type
        memoizedType = (props) => {
          const res = ogType(props)
          res.props.children[1].props.children.push(
            React.createElement(
              'span',
              { className: 'timezonedb-timezone' },
              React.createElement(Timezone, {
                userId: props.message.author.id,
                prefix: ' • ',
                displayCurrent: true,
              })
            )
          )

          return res
        }
      }

      res.type = memoizedType
      return res
    })

    inject('timezonedb-popout-render', UserPopOutComponents, 'UserPopoutProfileText', function ([ { user } ], res) {
      if (!res.props.children[3]) {
        res.props.children.push(
          React.createElement(Timezone, {
            userId: user.id,
            displayCurrent: true,
            render: (p) => React.createElement(
              'div',
              { className: 'aboutMeSection-PUghFQ' },
              React.createElement('h3', { className: 'aboutMeTitle-3pjiS7 base-21yXnu size12-oc4dx4 muted-eZM05q uppercase-2unHJn' }, 'Timezone'),
              React.createElement('div', { className: 'aboutMeBody-1J8rhz markup-eYLPri clamped-2ZePhX' }, p)
            )
          })
        )
      } else {
        res.props.children[3].props.children.push(
          React.createElement(
            'div',
            {
              className: 'timezonedb-timezone aboutMeBody-1J8rhz markup-eYLPri clamped-2ZePhX',
            },
            React.createElement(Timezone, {
              userId: user.id,
              displayCurrent: true,
              prefix: '\n'
            })
          )
        )
      }

      return res
    })


    // inject('timezonedb-profile-render', UserInfoBase, 'default', function ([ props ], res) {
    //   res.props.children[0].props.children.push(
    //     React.createElement(Timezone, {
    //       userId: props.user.id,
    //       render: (p) => React.createElement(
    //         React.Fragment,
    //         null,
    //         React.createElement('div', { className: 'userInfoSectionHeader-3TYk6R base-1x0h_U size12-3cLvbJ uppercase-3VWUQ9' }, 'Timezone'),
    //         React.createElement('div', { className: 'marginBottom8-AtZOdT size14-e6ZScH colorStandard-2KCXvj' }, p)
    //       )
    //     })
    //   );
    //   return res;
    // });
    // UserInfoBase.default.displayName = 'UserInfoBase'


    inject('timezonedb-autocomplete-render', Autocomplete.User.prototype, 'renderContent', function (_, res) {
      if (!_this.settings.get('display-autocomplete', true)) return res

      const section = res.props.children[2].props.children
      section.push(
        React.createElement(
          'span',
          { className: 'timezonedb-timezone' },
          React.createElement(Timezone, { userId: this.props.user.id, displayCurrent: true, prefix: ' • ' })
        )
      )

      return res
    })

    // function ctxMenuInjection ([ { user } ], res) {
    //   const timezone = useTimezone(user.id)
    //   const group = findInReactTree(res, (n) => n.children?.find?.((c) => c?.props?.id === 'note'))
    //   if (!group) return res
    //
    //   const note = group.children.indexOf((n) => n?.props?.id === 'note')
    //   if (timezone === 'unspecified') {
    //     group.children.splice(note, 0, React.createElement(Menu.MenuItem, { id: 'timezonedb', label: 'Add Pronouns', action: () => _this._promptAddPronouns(user) }))
    //   }
    //
    //   return res
    // }

    // injectContextMenu('timezonedb-user-add-timezone-guild', 'GuildChannelUserContextMenu', ctxMenuInjection)
    // injectContextMenu('timezonedb-user-add-timezone-dm', 'DMUserContextMenu', ctxMenuInjection)

    // fix for messages in search and inbox
    for (const component of [ 'ChannelMessage', 'InboxMessage' ]) {
      const mdl = await getModule(m => m.type && m.type.displayName === component);
      if (mdl) {
        inject(`timezonedb-fix-${component}`, mdl, 'type', (_, res) => {
          if (res.props.childrenHeader) {
            res.props.childrenHeader.type.type = MessageHeader.default;
          }
          return res;
        });
        mdl.type.displayName = component;
      }
    }

    this._forceUpdate()
  }

  pluginWillUnload () {
    powercord.api.settings.unregisterSettings('timezonedb')
    uninject('timezonedb-messages-header')
    uninject('timezonedb-popout-render')
    uninject('timezonedb-profile-render')
    uninject('timezonedb-autocomplete-render')
    uninject('timezonedb-user-add-timezone-guild')
    uninject('timezonedb-user-add-timezone-dm')

    uninject('timezonedb-fix-ChannelMessage')
    uninject('timezonedb-fix-InboxMessage')

    this._forceUpdate()
  }

  _forceUpdate () {
    document.querySelectorAll('[id^="chat-messages-"] > div').forEach((e) => getReactInstance(e).memoizedProps.onMouseMove());
  }

  async _getMessageHeader () {
    const d = (m) => {
      const def = m.__powercordOriginal_default ?? m.default
      return typeof def === 'function' ? def : null
    }
    return getModule((m) => d(m)?.toString().includes('showTimestampOnHover'))
  }
}

module.exports = TimezoneDB