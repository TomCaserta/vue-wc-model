# vue-wc-model

This package is designed to be a temporary work around for the issue that Vue `v-model` directives do not work on web components.

It supports all of the default `v-model` directives (`.lazy`, `.number`, `.trim`).

## Installation & Usage

Install the package with your package manager.

```
npm i vue-wc-model
```

Then to import depending on your configuration:

1. If you are using vue-cli to build your project:

Add the following to your vue configuration:

**vue.config.js**
```javascript
const { createModelDirective } = require('vue-wc-model');

module.exports = {
    // ...
    chainWebpack: config => {
        config.module
            .rule("vue")
            .use("vue-loader")
            .loader("vue-loader")
            .tap(options => {
                options.compilerOptions = options.compilerOptions || {};
                options.compilerOptions.directives = {
                    ...options.compilerOptions.directives,
                    wmodel: createModelDirective(),
                };

                return options;
            });
    },
}
```

2. If you are using webpack directly, much the same but provide it in your vue loader configuration:

**webpack.config.js**
```javascript
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        directives: {
                            wmodel: createModelDirective(),
                        }
                    }
                },
            }
        ]
    }
}
```

Once complete you are able to use the `v-wmodel` directive as normal in your component templates. See below for further configuration.

## Options

**Default configuration**:

```typescript
{
    eventNames: {
        change: 'change',
        input: 'input',
    },
    valueExpression: '$event.target.value',
}
```


Since not every web component is created equally you are able to pass through configuration to the model directive.

| Option              | Type                         | Default               | Information                                                                                           |
|---------------------|------------------------------|-----------------------|-------------------------------------------------------------------------------------------------------|
| `eventNames.change` | `string` or `ConfigFunction` | `change`              | Defines the event name to listen for changes on the component.                                        |
| `eventNames.input`  | `string` or `ConfigFunction` | `input`               | Defines the event name to listen for input events on the component when the `.lazy` modifier is used. |
| `valueExpression`   | `string` or `ConfigFunction` | `$event.target.value` | The compiled code to get the value from the event.                                                    |


**`ConfigFunction` type**:
```typescript
type ConfigFunction = (el: IASTElement, dir: IASTDirective) => string;
```

View the `./src/ypes/vue-compiler.interface.ts` source file to see the definitions for `el` and `dir`. Essentially when you pass a config function you can pretty much implement custom handling of events depending on the element.

## Other Information

Due to Vue using rollup (and not wanting to include flow compilation in this project) a lot of the vue compiler code is copied and pasted into this repository and converted to typescript. For those concerned, this will not increase your compiled bundle as this is only run during build time and would not be outputted into your bundle.
