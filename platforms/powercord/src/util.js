const dateFormat = require("./dateformat");

const { React } = require('powercord/webpack')

function wrapInHooks (fn) {
  return function (...args) {
    // IntelliJ does NOT like this
    const reactCurrent = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current
    const ogUseMemo = reactCurrent.useMemo
    const ogUseState = reactCurrent.useState
    const ogUseEffect = reactCurrent.useEffect
    const ogUseLayoutEffect = reactCurrent.useLayoutEffect
    const ogUseRef = reactCurrent.useRef
    const ogUseCallback = reactCurrent.useCallback

    reactCurrent.useMemo = (f) => f()
    reactCurrent.useState = (v) => [ v, () => void 0 ]
    reactCurrent.useEffect = () => null
    reactCurrent.useLayoutEffect = () => null
    reactCurrent.useRef = () => ({})
    reactCurrent.useCallback = (c) => c

    const res = fn(...args)

    reactCurrent.useMemo = ogUseMemo
    reactCurrent.useState = ogUseState
    reactCurrent.useEffect = ogUseEffect
    reactCurrent.useLayoutEffect = ogUseLayoutEffect
    reactCurrent.useRef = ogUseRef
    reactCurrent.useCallback = ogUseCallback

    return res
  }
}

function adjustForTimezone(d, offset) {
  const date = d.toISOString();
  const targetTime = new Date(date);
  const tzDifference = offset + targetTime.getTimezoneOffset() * 60;
  // convert the offset to milliseconds, add to targetTime, and return a new Date
  return new Date(targetTime.getTime() + tzDifference * 1000);
}

function formatTimezone(zone, includeCurrent = false) {
  let result = zone.id

  if (includeCurrent) {
    const date = adjustForTimezone(new Date(), zone.offset);
    result += ` (Currently ${dateFormat(date, 'h:MM TT')})`;
  }

  return result;
}

module.exports = { wrapInHooks, adjustForTimezone, formatTimezone }