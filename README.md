# Form Validator <sup>BrainEncoding</sup>

## Docs
### Example steps for creating sample validation
1. Copy BEFV.min.js file from lib directory into your project and plug it in
2. Create form config object [See available props](#available_props_form_config)
```js
    const formConfig = Object.create({
        element: document.querySelector('.my-validated-form'),
        handlers: {
            submit()
            {
                console.log('Is submit form handler')
            }
        }
    });
```
3. Create array of input config [See available props](#available_props_input_config)
```js
const inputConfig = [
    {
        element: '.input',
        message: {
            rule: {
                error: 'Error with rule',
                success: 'Success rule',
            },
            required: {
                error: 'Field is required',
                success: 'Field is success required',
            }
        },
        rules: {
            required: true,
            rule: function ({value}, validator) { 
                return !!value.match('.');
            }
        },
    }
]
```
4. Create validation instance
```js
    const MyFormValidator = new BEFormValidator.Create(formConfig, inputConfig);
```
5. Initialize validator
```js
    MyFormValidator.init();
```

### [See more example](https://github.com/brainencoding/BEFV/tree/main/example)

## Types
<a name="available_props_input_config"></a>
### Available props intput config
| Name                             | Type                 | Default                        | Description                                                                                                                                |
| -------------------------------- | -------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `element`                    | `HTMLFormElement` or `string` | <b>REQUIRED</b>                    |  Validated input of form class name or HTMLFormElement
| `rules`                    | `object` | <b>REQUIRED</b>                    |  input validation rules
| `rules.required`                    | `bool` | `false`                    |  rule for filed to be required
| `rules.rule`                    | `RegExp` or `Function(input, validator)` or `Array<RegExp or Function>` | `undefined`                    |  rule decalration <br /><br /> 
| `onlyOnSubmit`                    | `bool` | `false`                    |  If you need validate input only on submit form, use onlyOnSubmit: true
| `subscriptions`                    | `object` | `undefined`                    |  input validation messages
| `subscriptions.valid`                    | `function` | `undefined`                    |  validation event handler 
| `subscriptions.invalid`                    | `function` | `undefined`                    |  validation event handler 
| `handlers`                    | `object` | `undefined`                    |  input validation messages
| `handlers.input`                    | `function` | `undefined`                    |  input event handler 
| `message`                    | `object` | `undefined`                    |  input validation messages
| `message.border`                    | `bool` | `false`                    |  bordering your input when is valid/invalid use field border: true in message
| `message.rule`                    | `object` | `undefined`                    |  input validation messages for rule
| `message.rule.error`                    | `string` | `undefined`                    |  input validation messages for rule error
| `message.rule.success`                    | `string` | `undefined`                    |  input validation messages for rule success
| `message.required.error`                    | `string` | `undefined`                    |  input validation messages for required error
| `message.required.success`                    | `string` | `undefined`                    |  input validation messages for required success

#### If you need to put errors elsewhere, use:
```js
    ...
    message: {  
        location: document.querySelector('.yourLocation'),
        noAdjacent: true,
    },
    ...
```

#### If you use a checkbox, then only the rules: {required: true} fields are available to you and only message: {required: {error: 'error', success: 'success'}} is available for displaying messages, but the location and noAdjacent.
```js
    {                          
        element: '.checkbox-input',
        rules: {
            required: true
        },
        message: {
            required: {
                error: 'Field are required!',
                success: 'Field are required!'
            }
        }
    }
```

### Custom rule messages
For add a custom message you need, to set rule in rules object, and call messagePreventDefault function for block render message of message
#### Example
```js
    {
        element: field.text,
            
        rules: {
                required: true,
                rule: function (input, validator) {
                    this.messagePreventDefault(); // for block message render of message.rule object 
                
                    if (!input.value.length) {
                        const validationElement = validator.getElement(input);
                        
                        validationElement.messages.changeStatus(false, 'Set custom text');
                        return false;
                    }
                
                    return true;
                }
        },
    
        message: {
            required: {
                error: 'Field are required!',
            }
        }
    }
```

<a name="available_props_form_config"></a>
### Available props form config 
| Name                             | Type                 | Default                        | Description                                                                                                                                |
| -------------------------------- | -------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `element`                    | `HTMLFormElement` or `string`| <b>REQUIRED</b>                   | Validated form class name or HTMLFormElement
| `earlyInputInitiation`                    | `bool` | `false`                    | The flag allows you to activate validation on input and not only after pressing the submit button
| `subscribeOnInput`                    | `bool` | `false`                    | Allows triggering valid\invalid events on input not only on submit <br /> <br /> basicly subscriptions work on submit, if this param is true, subcriptions like (valid, and invalid) is calling when you fill the input or etc
| `options`                    | `object` | `{}`                    | Form options
| `options.default`                    | `bool` | `false`                    | If you need a standard form submission, then set the default flag to true
| `handlers`                    | `object` | `{}`                    | Object with handlers
| `handlers.submit`                    | `function` | `undefined`                    | Submit handler
| `subscriptions`                    | `object` | `{}`                    | Object with subscriptions
| `subscriptions.valid`                    | `function` | `undefined`                    | Valid handler subscription
| `subscriptions.invalid`                    | `function` | `undefined`                    | Invalid handler subscription

----
## LICENSE
MIT License

Copyright (c) 2021 brainencoding

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
