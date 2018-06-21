

const APP_KEY = 'kid_SkOtOd2sM';
const APP_SECRET = 'cee63b15f1e74dc9a3a978390384c6cc';

let result = window.btoa(APP_KEY + ':' + APP_SECRET)

console.log(result);