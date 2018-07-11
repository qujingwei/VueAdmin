import { UPLOAD_BASEURL } from './config'
import VueCookie from 'vue-cookie'

export function DateFormat(time, format){
    let t = new Date(time);
    let tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}

export function getUploadUrl(type){
    const type_map = {
        'movie': 'movie',
        'live': 'live',
        'video': 'video',
        'dramas': 'dramas',
        'animation':'animation',
        'documentary': 'documentary',
        'temp': 'temp'
    }
    if(!type_map[type]){
        return ''
    }
    let peerid = VueCookie.get('peerid') || ''
    let sessionid = VueCookie.get('sessionid') || ''

    return `${UPLOAD_BASEURL}/${type}/${peerid}/${sessionid}`
}
