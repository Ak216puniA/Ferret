function getCookie(cookie_name){
    let decoded_cookie = decodeURIComponent(document.cookie);
    let cookie_array = decoded_cookie.split('; ');
    for(let i=0 ; i<cookie_array.length ; i++){
        let cookie = cookie_array[i].split('=');
        if(cookie[0]===cookie_name){
            return cookie[1];
        }
    }
    return null
}

export default getCookie