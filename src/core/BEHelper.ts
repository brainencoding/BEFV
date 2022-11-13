export class BEHelper
{
    static generateId()
    {
        let dec2hex: string[] = [];
        for (let i = 0; i <= 15; i++) {
            dec2hex[i] = i.toString(16);
        }

        let uuid = "";
        for (var i = 1; i <= 36; i++) {
            if (i === 9 || i === 14 || i === 19 || i === 24) {
                uuid += "";
            } else if (i === 15) {
                uuid += 4;
            } else if (i === 20) {
                uuid += dec2hex[(Math.random() * 4 | 8)];
            } else {
                uuid += dec2hex[(Math.random() * 16 | 0)];
            }
        }

        return uuid;
    }

    // @ts-ignore
    static arrayEquals(source, comparable)
    {
        if (!source && !comparable) {
            return false;
        }

        if (source.length !== comparable.length) {
            return false;
        }

        for (let i = 0, l = source.length; i < l; i++) {
            if (source[i] instanceof Array && comparable[i] instanceof Array) {
                if (!BEHelper.arrayEquals(source[i], comparable[i])) {
                    return false;
                }
            } else if (source[i] !== comparable[i]) {
                return false;
            }
        }

        return true;
    }

    // @ts-ignore
    static objectEquals(source, comparable)
    {
        for (let propName in source) {
            if (source.hasOwnProperty(propName) !== comparable.hasOwnProperty(propName)) {
                return false;
            } else if (typeof source[propName] !== typeof comparable[propName]) {
                return false;
            }
        }

        for (let propName in comparable) {
            if (source.hasOwnProperty(propName) !== comparable.hasOwnProperty(propName)) {
                return false;
            } else if (typeof source[propName] !== typeof comparable[propName]) {
                return false;
            }

            if (!source.hasOwnProperty(propName)) {
                continue;
            }

            if (source[propName] instanceof Array && comparable[propName] instanceof Array) {
                if (!BEHelper.arrayEquals(source[propName], comparable[propName])) {
                    return false;
                }
            } else if (source[propName] instanceof Object && comparable[propName] instanceof Object) {
                if (!BEHelper.objectEquals(source[propName], comparable[propName])) {
                    return false;
                }
            } else if (source[propName] !== comparable[propName]) {
                return false;
            }
        }
        return true;
    }
}