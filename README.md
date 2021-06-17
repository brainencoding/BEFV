# BEFV (BrainEncoding-form-validator)
----
To create a validator instance use 
```js
    const instance = new BEFormValidator.Create(formConfig, [
        inputConfig1,
        inputConfig2
    ])
    instance.init();
```

[See examples](https://github.com/brainencoding/BEFV/tree/main/example)

## Form configuration
```js
const formConfig = {
    element: 'form', // Form element, can be as string for get element or HTMLFormElement
    options: {
        default: true // - if you need a standard form submission, then set the default flag to true
    },
    handlers: {
        submit(event) {
            console.log(event) // Event Listener - Submit
        }
    },
    subscriptions: {
        valid(validator) {
            console.log('Form is valid')
        },
        invalid(validator) {
            console.log('Form is invalid')
        }    
    }       
}
```
#### Attention: 
- **do not use regex with flag /.../gm if you don use textarea**

----
## Element[input] configuration
If you use select or input with any types, then this config will suit you
```js
const inputConfig = {
    element: '.input',
    message: { // non required
        rule: {
            error: 'Error with rule',
            success: 'Success rule',
        },
        required: {
            error: 'Field is required',
            success: 'Field is success required',
        }
    }
    rules: {
        required: true,
        // rule: /(.*)/g // can be a regex
        // rule: function (value, validator) { // can be a function 
             // this is current input validator
        //}
        // rule: [/(\d+)/, ({value}) => value === 1] // can be an array of regex or function 
    },
}
```

if you need input handler, use
```js
    ...element: '.input'
    handlers: {
        input(e) {
            console.log('validate input event: ', e)
        }
    },
```


if you need subscribe to input validation change, use: 
```js
    ...element: '.input'
    subscriptions: {
        valid(validatorElement) {
            console.log('input is valid')
        },
        invalid(validatorElement) {
            console.log('input is invalid')
        }
    }
```

If you need to put errors elsewhere, use:
```js
    ...
    message: {  
        location: document.querySelector('.yourLocation'),
        noAdjacent: true,
    },
    ...
```

If you need bordering your input when is valid/invalid use field border: true in message
```js
    ...
    message: {  
     border: true,
    },
    ...
```

If you need validate input only on submit form, use onlyOnSubmit: true
```js
{
    element: '.input',
    onlyOnSubmit: true,
    ...
}
```

If you use a checkbox, then only the rules: {required: true} fields are available to you and only message: {required: {error: 'error', success: 'success'}} is available for displaying messages, but the location and noAdjacent.
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

----
## Available default validators
- **IsNumber**
- **Phone**
  - RU
- **Email**
- **Card Holder**
  - Mastercard
  - VisaMasterCard
  - VisaCard
  - UnionPayCard
  - JCBCard
  - MaestroCard
  - AmericanExpress

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
