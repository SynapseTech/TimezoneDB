const { React, Flux, getModule } = require('powercord/webpack')
const { loadTimezone } = require('../store/action.js')
const store = require('../store/store.js')

const { formatTimezone } = require('../util.js')
const UsersStore = getModule([ 'getCurrentUser', 'getUser' ], false)

function Timezone ({ userId, render, prefix, display, timezone, displayCurrent }) {
  React.useEffect(() => void loadTimezone(userId), [ userId ])
  if (!timezone) return null;
  const p = formatTimezone(timezone, displayCurrent ?? false)

  if (!p || !display) return null
  return render
    ? render(p)
    : React.createElement(
      React.Fragment,
      null,
      prefix ?? null,
      React.createElement('span', null, p)
    )
}

module.exports = Flux.connectStores(
  [ store, powercord.api.settings.store, UsersStore ],
  ({ userId, region }) => ({
    timezone: store.getTimezone(userId),
    display: powercord.api.settings.store.getSetting('timezonedb-powercord', `display-${region}`, true) &&
      (UsersStore.getCurrentUser().id !== userId || !powercord.api.settings.store.getSetting('timezonedb-powercord', 'hide-self', false))
  })
)(React.memo(Timezone))