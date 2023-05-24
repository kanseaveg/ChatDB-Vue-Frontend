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

export function Myreplace(str, list) {
    let temp =str
    if(list&&str){
        list.map((v,i)=>{
           temp= temp.replace(new RegExp(v,'g'),"")

        })
    }
    return temp
}