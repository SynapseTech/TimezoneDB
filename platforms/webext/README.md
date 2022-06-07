# TimezoneDB Web Extensions
Web extension codebase for TimezoneDB.

## Installation
1. Install dependencies with `yarn`
2. `npx mix` to build into `dist`
3. Enable dev mode in `chrome://extensions/` and upload your extension
    - If you want to develop for Firefox, you need the [web-ext cli](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/)

## Directory Structure

Laravel Mix is rather easy to read, so there isn't really much explaining to do.

- Every Typescript file in the top-level `src/ts` is compiled into the top-level `dist/js`
    - `ui/options.ts` and `ui/popup.ts` are also currently compiled into the top-level `dist/js`
- Scss files in `src/scss` is compiled into their respective css into the top-level `dist/css`
- Files in `src/static` are moved into the top-level `dist`

### Uncompiled

```markdown
src/
├─ scss/
│  ├─ styles.scss
├─ static/
│  ├─ manifest.json
│  ├─ options.html
│  ├─ popup.html
├─ ts/
│  ├─ ui/
│     ├─ components/
│        ├─ OptionsScreen.vue
│        ├─ PopupScreen.vue
│        ├─ example-composition-api.ts
│     ├─ options.ts
│     ├─ popup.ts
│  ├─ background.ts
│  ├─ content-script.ts
```

### Compiled

```markdown
dist/
├─ css/
│  ├─ styles.css
├─ js/
│  ├─ options.js
│  ├─ popup.js
│  ├─ background.js
│  ├─ content-script.js
├─ manifest.json
├─ options.html
├─ popup.html
```

## Contributing

Not gonna lie, I'm not the brightest bulb in the shed. One time I said that 5 x 22 was 1100. Pull requests are welcomed.

## Todo

- [ ]  [Replace feature flag globals during bundling](http://link.vuejs.org/feature-flags). Apparently, this doesn't seem to be possible with Laravel Mix since they [override any user DefinePlugins](https://stackoverflow.com/questions/48906425/laravel-mix-webpack-environment-dependent-variable-for-client-code). If anyone wants to port this to pure Webpack so we can check this off, please feel free.