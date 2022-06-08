declare const __DEV__: boolean

import { Browser }  from "webextension-polyfill";
declare global {
  export const browser: Browser;
  interface Window {
    wrappedJSObject: Window
  }

  interface Element {
    wrappedJSObject: Element
  }

  interface NodeList {
    [Symbol.iterator](): Iterator<Node | ParentNode>
  }
}

declare module '*.vue' {
  const component: any
  export default component
}
