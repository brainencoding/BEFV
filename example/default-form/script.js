;(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.querySelector('.js-postcard');

        if (form) {
            const field = {
                name: form.querySelectorAll('#name'),
                email: form.querySelector('#email'),
                message: form.querySelector('#message'),
                check: form.querySelector('#check'),
                file: form.querySelector('#file'),
                _hidden: form.querySelector('#_hidden'),
            }

            window.fillField = function ()
            {
                field._hidden.value = "test";
            }

            const inputs = [
                {
                    element: field.name,
                    rules: {
                        required: true
                    },
                    message: {
                        required: {
                            error: 'Field are required!'
                        }
                    }
                },
                {
                    element: field.email,
                    rules: {
                        required: true,
                        rule: BEFormValidator.DefaultRules.email
                    },
                    message: {
                        required: {
                            error: 'Field are required!'
                        },
                        rule: {
                            error: 'E-mail is not valid. example: ex@info.com'
                        }
                    },
                },
                {
                    element: field.message,
                    rules: {
                        required: true
                    },
                    message: {
                        required: {
                            error: 'Field are required!'
                        }
                    }
                },
                {
                    element: field.check,
                    rules: {
                        required: true,
                    },
                    message: {
                        required: {
                            error: 'Field are required!'
                        }
                    }
                },
                {
                    element: field._hidden,
                    rules: {
                        required: true,
                    },
                    message: {
                        required: {
                            error: '-- Field are required!'
                        }
                    }
                },
                {
                    element: field.file,
                    rules: {
                        required: true,
                        rule: function (input, validator) {
                            this.messagePreventDefault();
                            const chs = validator.getElement(input).messages.changeStatus

                            chs(false, 'Test text for not valid')
                            return false
                        }
                    },
                    message: {
                        required: {
                            error: 'Field are required!'
                        }
                    }
                }
            ]

            const formConfig = {
                element: form,
                options: {
                    default: true,
                },
            }

            const instance = new BEFormValidator.Create(formConfig, inputs)
            instance.init();
        }
    })
})();


