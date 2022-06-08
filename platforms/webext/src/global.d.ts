declare const __DEV__: boolean

import { Browser }  from "webextension-polyfill";
declare global {
  export const browser: Browser;
}

declare module '*.vue' {
  const component: any
  export default component
}
