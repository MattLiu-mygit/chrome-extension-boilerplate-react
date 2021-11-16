<img src="src/assets/img/icon-128.png" width="64"/>

# Webpage Diff Extension made with Chrome Extension Boilerplate with React 17 and Webpack 5

## Installing and Running

### Procedures:

1. Run `npm install` to install the dependencies.
2. Run `npm start` for CI/CD in development. Run `npm start` at least once to build the app.
3. Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.

## Structure

All your extension's code is placed in the `src` folder.

The boilerplate is already prepared to have a popup, an options page, a background page, and a new tab page (which replaces the new tab page of your browser).
The content and popup pages have been modified for this homework.
Webpack looks for index.js within these folders when building the app. Thus, content script is within the index.js of the Content folder.
As this is a React extension, Popup is written in React and all implementations are done in Popup.js.

## Resources:

- [Webpack documentation](https://webpack.js.org/concepts/)
- [Chrome Extension documentation](https://developer.chrome.com/extensions/getstarted)
