class EventEmitter {
    static instance: EventEmitter;

    constructor(private events: Record<any, any> = {}) {}

    addListener(eventName: string, ...callbacks: Array<Function>): void {
        if (!callbacks) {
            this.events[eventName] = [];
            return;
        }

        this.events[eventName] = [...callbacks];
    }

    emit(eventName: string, ...args: Array<any>) {
        return (
            this.events &&
            this.events[eventName]?.length &&
            this.events[eventName].forEach((fn: Function) => {
                args.length
                    ? args.forEach((arg) => {
                        fn(arg);
                    })
                    : fn(undefined);
            })
        );
    }
}

export default EventEmitter;