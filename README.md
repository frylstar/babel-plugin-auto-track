# babel-plugin-auto-track

## Usage

add babel-plugin-dev-debug plugin to babel.config.js

```js
// babel.config.js
module.exports = {
  plugins: ["auto-track", { trackerPath: "tracker" }],
};
```

in you code

```js
import aa from 'aa';
import * as bb from 'bb';
import { cc } from 'cc';
import 'dd';

function a () {
    console.log('aaa');
}

class B {
    bb() {
        return 'bbb';
    }
}

const c = () => 'ccc';

const d = function () {
    console.log('ddd');
}
```

Convert the above code to this:

```js
import _tracker2 from "tracker";
import aa from 'aa';
import * as bb from 'bb';
import { cc } from 'cc';
import 'dd';

function a() {
  _tracker2();

  console.log('aaa');
}

class B {
  bb() {
    _tracker2();

    return 'bbb';
  }

}

const c = () => {
  _tracker2();

  return 'ccc';
};

const d = function () {
  _tracker2();

  console.log('ddd');
};
```
