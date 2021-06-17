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
                location: document.querySelector('.js-errors')
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
                subscription: {
                    valid() {
                        alert('FORM IS VALID')
                    }
                }
            }

            const instance = new BEFormValidator.Create(formConfig, inputs)
            instance.init();
        }
    })
})();
