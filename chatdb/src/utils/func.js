export const copyArr = (obj) => {
    var out = [],
        i = 0,
        len = obj.length;
    for (; i < len; i++) {
        if (obj[i] instanceof Array) {
            out[i] = copyArr(obj[i]);
        } else out[i] = obj[i];
    }
    return out;
}
export function debounce(func, delay) {
    let timerId;
    return function (...args) {
        for (let i = 0; i < 100; i++) {
            clearTimeout(i)
        }
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }();
}