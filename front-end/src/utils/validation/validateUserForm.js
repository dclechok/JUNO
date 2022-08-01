function validateUserForm(newUser, users = ''){

    //object can not have empty values
    for(let property in newUser){
        if(!newUser[property]){ 
            window.alert('No fields can be blank!');
            return null;
        }
    }
    //no numbers or symbols in username
    if(!/^[A-Za-z]+$/.test(newUser.username)) return window.alert('Username must contain letters only.');
    //validate username length
    if(newUser.username.length < 3) return window.alert('Username must be at least 3 characters.');
    //validate password length
    if(newUser.hash.length < 8) return window.alert('Password must be at least 8 characters.');
    //validate email format
    if(!/\S+@\S+\.\S+/.test(newUser.email)) return window.alert('Please enter a valid email address.');

    //validate no duplicate usernames
    if(users && users.find(user => user.username === newUser.username)) return window.alert('This username already exists!');

    return true;
}

export default validateUserForm;