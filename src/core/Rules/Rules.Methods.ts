export default {
    isLength: (length: Record<any, any>) =>
    {
        // @ts-ignore
        const _args = arguments;

        // @ts-ignore
        return function ({value})
        {
            let min;
            let max;

            if (typeof (length) === "object") {
                min = length.min || 0;
                max = length.max;
            } else { // backwards compatibility: isLength(str, min [, max])
                min = _args[0] || 0;
                max = _args[1];
            }

            const presentationSequences = value.match(/(\uFE0F|\uFE0E)/g) || [];
            const surrogatePairs = value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
            const len = value.length - presentationSequences.length - surrogatePairs.length;
            return len >= min && (typeof max === "undefined" || len <= max);
        };
    },
};