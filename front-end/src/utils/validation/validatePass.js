function validatePass(pw){
    if(pw.length < 8) return window.alert('Password must be at least 8 characters!');
    return true;
}

export default validatePass;