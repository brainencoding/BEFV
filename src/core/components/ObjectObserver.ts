export type TObjectObserver = ProxyConstructor;

const handlers: string = Symbol("handlers") as any;

export function ObservableObject(target?: Record<any, any>): TObjectObserver {
    target[handlers] = [];

    target.observe = function (handler: Function) {
        this[handlers].push(handler);
    };

    return <ProxyConstructor>new Proxy(target, {
        set(target, property, value, receiver) {
            let success = Reflect.set(target, property, value, receiver);

            if (success) {
                target[handlers].forEach((handler: Function) => handler(property, value));
            }

            return success;
        },
    });
}