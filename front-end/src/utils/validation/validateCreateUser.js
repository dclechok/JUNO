function validateCreateUser(newUser, users){
    //object can not have empty values
    for(let property in newUser){
        if(!newUser[property]){ 
            window.alert('No fields can be blank!');
            return null;
        }
    }
    //validate no duplicate usernames
    if(users.find(user => user.username === newUser.username)) return window.alert('This username already exists!');

    if(!/\S+@\S+\.\S+/.test(newUser.email)) return window.alert('Please enter a valid email address.');

    return true;
}

export default validateCreateUser;