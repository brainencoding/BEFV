;(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.querySelector('.js-auth');

        if (form) {
            const field = {
                username: form.querySelector('#username'),
                password: form.querySelector('#password'),
            }

            const loc = {
                noAdjacent: true,
                location: document.querySelector('.js-errors'),
                border: true
            }

            const inputs = [
                {
                    element: field.username,
                    rules: {
                        required: true
                    },
                    message: {
                        required: {
                            error: 'Field => username are required!'
                        },
                        ...loc
                    }
                },
                {
                    element: field.password,
                    rules: {
                        required: true,
                        rule: ({value}) => {
                            return value.length >= 8
                        }
                    },
                    message: {
                        required: {
                            error: 'Field => password are required!'
                        },
                        rule: {
                            error: 'Password is not valid. Min length 8'
                        },
                        ...loc
                    },
                }
            ]

            const formConfig = {
                element: form,
                options: {
                    default: false,
                },
                subscriptions: {
                    valid() {
                        alert('FORM IS VALID')
                    },
                    invalid() {
                        alert('FORM IS INVALID')
                    }
                },
                subscribeOnInput: true
            }

            const instance = new BEFormValidator.Create(formConfig, inputs)
            instance.init();

            window.k = instance
        }
    })
})();
