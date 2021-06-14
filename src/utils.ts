export const utils = Object.create({});

utils.errorConstructor = (name: string): (text: string) => Error => {
	const _name = `\n\t[${name}]:`

	return (text: string) => {
		 return new Error(_name + ' ' + text + '\n')
	}
}
