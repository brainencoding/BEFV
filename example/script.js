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


const validationItems = [
    {
        element: text,
        rules: {
            required: true,
        },
        message: {
            border: true,
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
    {
        element: phone,
        rules: {
            rule: [BEFormValidator.DefaultRules.phone.ru]
        },
        message: {
            border: true,
            rule: {
                error: 'неверная херня',
            }
        }
    },
    {
        element: email,
        rules: {
            required: true,
            rule: [/\D+/, function({value}) {
                console.log(value)

                return BEFormValidator.DefaultRules.email.test(value)
            }]
        },
        message: {
            border: true,
            required: {
                error: 'Поле required error',
                success: 'Поле required success',
            },
            rule: {
                error: 'Email не валидный',
                success: 'Email валидный ',
            },
        }
    },
    // {
    //     element: file,
    //     rules: {},
    //     message: {
    //         error: '',
    //         success: ''
    //     }
    // },
];

const formValidator = new BEFormValidator.Create(formConfig, validationItems);
formValidator.init();
