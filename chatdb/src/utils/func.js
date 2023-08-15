import CryptoJS from 'crypto-js';
var APPID = "065317c5";
var API_SECRET = "MDIyYTY3N2NiOTBkNjg5YmM2ZmZmMDIx";
var API_KEY = "6ec94ede6d3d4f4599f67c465bd219c2";
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

export function getWebSocketUrl() {
    // 请求地址根据语种不同变化
    var url = "wss://iat-api.xfyun.cn/v2/iat";
    var host = "iat-api.xfyun.cn";
    var apiKey = API_KEY;
    var apiSecret = API_SECRET;
    var date = new Date().toGMTString();
    var algorithm = "hmac-sha256";
    var headers = "host date request-line";
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    var signature = CryptoJS.enc.Base64.stringify(signatureSha);
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    var authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    return url;
  }