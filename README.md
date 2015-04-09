# i18n-cli

## Usage

Create a folder `shared/locales`, and a file:

```js
// shared/locales/en-US.js
module.exports = {
    key: { found: "foobar" },
    formated: "formated %s",
    array_value: ["item1", "item2"],
    wildkey: {
        '*': { 'subkey': 'value default' },
        'linux': { 'subkey': 'value linux' },
    }
};
```

Now you can use:

```js
// index.js
import { I18n } from 'i18n';     // es6
var I18n = require('i18n');      // es5

var i18n = new I18n({
    path  : ('locales'),
    locale: 'en-US'
});

i18n.t('key.found');              // "foobar"
i18n.t('formated', "with value"); // "formated with value"
i18n.t('array_value');            // ["item1", "item2"]
i18n.t('wildkey.linux.subkey');   // value linux
i18n.t('wildkey.macosx.subkey');  // value default
```

Check the [printf](https://www.npmjs.com/package/printf) to know what to use in "formated strings".

## License

"Azuki", "Azk" and the Azuki logo are copyright (c) 2013-2015 Azuki Serviços de Internet LTDA.

i18n-cli is released under Apache 2 License.

Check LEGAL and LICENSE files for more information.
