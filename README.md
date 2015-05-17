# Tabio


### Effortless tab management for Chrome

Tabio is a Chrome extension designed to make managing lots of browser tabs significantly easier. The extension generates a searchable, scrollable and fully keyboard-accessible list of all open browser tabs.

Tabio is available on the [Google Chrome Webstore](https://chrome.google.com/webstore/detail/tabio/bgbhfmeabcmpjblimfddkeikogidjhao).

## Contributing



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
1. Open Google Chrome and type `chrome://extensions` inside the address bar
1. Enable `developer mode`
1. Click on `Load unpacked extension`
1. Select the `/dist` folder

### Gulp Tasks

| Task  | Description                                   |
|-------|-----------------------------------------------|
| build | Compile, minify and copy the extension files  |
| zip   | Create a zip archive for publishing           |

## License
