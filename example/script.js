const form = document.querySelector('.js-form-with-validator');

const text = document.querySelector('.text');
const phone = document.querySelector('.phone');
const email = document.querySelector('.email');
const file = document.querySelector('.file');

const formConfig = {
    element: form,
    options: {
        default: false, // if form is not use ajax, | default = false
    },
    handlers: {
        submit(event) {
            console.log(event)
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

/**

 EXAMPLE

 {
        element: file,
        message: {
                 error: '',
                 success: '',
                 location: document.querySelector('.yourLocation'),
                 noAdjacent: true,
                 border: true
             }
        rules: {
            required: true,
        },
        handlers: {
             input(e) {
                 console.log('validate input event: ', e)
             }
        },
        subscriptions: {
            valid(validatorElement) {
                console.log('input is valid')
            },
            invalid(validatorElement) {
                console.log('input is invalid')
            }
        }
    },

 * */

const validationItems = [
    {
        element: text,
        rules: {
            required: true,
        },
        message: {
            error: 'Поле обязательно для заполнения',
            success: 'Поле заполнено',
            required: {
                error: 'Поле reuired error',
                success: 'Поле reuired success',
            }
        }
    },
    {
        element: phone,
        rules: {},
        message: {
            error: '',
            success: ''
        }
    },
    {
        element: email,
        rules: {},
        message: {
            error: '',
            success: ''
        }
    },
    {
        element: file,
        rules: {},
        message: {
            error: '',
            success: ''
        }
    },
];

const formValidator = new BEFormValidator.Create(formConfig, validationItems);
formValidator.init();
