import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType
  const baseCsp = `script-src \'self\' http://localhost:${port}; object-src \'self\'`;

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    browser_action: {
      default_icon: './assets/icon-512.png',
    },
    content_security_policy: {
      extension_pages: baseCsp,
    },
    options_ui: {
      page: './dist/options/index.html',
      open_in_tab: true,
    },
    icons: {
      16: './assets/icon-512.png',
      48: './assets/icon-512.png',
      128: './assets/icon-512.png',
    },
    permissions: [
      'storage',
      'http://*/',
      'https://*/',
    ],
    content_scripts: [{
      matches: ['http://*/*', 'https://*/*'],
      js: ['./dist/contentScripts/index.global.js'],
    }],
    web_accessible_resources: [
      {
        "resources": [ 'reactRuntime.js' ],
        "matches": [ "https://*/*" ],
      },
    ],
  }

  return manifest
}
