# [Tabio](http://colebemis.github.io/tabio)

### Effortless tab management for Chrome

Tabio is a Chrome extension designed to make managing lots of browser tabs significantly easier. The extension generates a searchable, scrollable and fully keyboard-accessible list of all open browser tabs.

Available on the [Google Chrome Webstore](https://chrome.google.com/webstore/detail/tabio/bgbhfmeabcmpjblimfddkeikogidjhao).

## Keyboard Shortcuts

| OSX | Windows/Linux | Description |
|---|---|---|
| <kbd>Cmd</kbd> + <kbd>K</kbd> | <kbd>Ctrl</kbd> + <kbd>K</kbd> | Toggle extension<sup>1</sup> |
| <kbd>Enter</kbd> | <kbd>Enter</kbd> | Go to selected tab |
| <kbd>Cmd</kbd> + <kbd>Delete</kbd> | <kbd>Ctrl</kbd> + <kbd>Backspace</kbd> | Close selected tab |
| <kbd>Up</kbd> | <kbd>Up</kbd> | Select previous tab |
| <kbd>Down</kbd> | <kbd>Down</kbd> | Select next tab |
| <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>K</kbd> | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>K</kbd> | Focus search input |
| <kbd>Esc</kbd> | <kbd>Esc</kbd> | Close extension |

<sup>1</sup> This can be configured in `chrome://extensions`. More information on that [here](http://lifehacker.com/add-custom-keyboard-shortcuts-to-chrome-extensions-for-1595322121).

## Contributing

Contributions of any kind are always welcome. Help make Tabio better by submitting a bug report, feature request or pull request. Please refer to the [contribution guidelines](CONTRIBUTING.md) for more infomation.

### Development Dependencies

| Name    | Installation                                                                       |
|---------|------------------------------------------------------------------------------------|
| Node.js | [Instructions](http://nodejs.org/download/)                                        |
| Bower   | [Instructions](http://bower.io/#install-bower)                                     |
| Gulp    | [Instructions](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) |

### Setup

* Clone the repository

```
$ git clone https://github.com/colebemis/tabio.git
$ cd tabio
```

* Install npm dependencies

```
$ npm install
```

* Install bower dependencies

```
$ bower install
```

* Create the initial build

```
$ gulp build
```

* Load the extension

  - Open Google Chrome and type `chrome://extensions` inside the address bar
  - Enable `Developer mode`
  - Click on `Load unpacked extension`
  - Select the `/dist` folder

### Gulp Tasks

| Task    | Description                                   |
|---------|-----------------------------------------------|
| `build` | Compile, minify and copy the extension files  |
| `zip`   | Create a zip archive for publishing           |

## License

Tabio is licensed under the [MIT License](LICENSE.md).
