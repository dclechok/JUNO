function validateCreateUser(newUser, users){
    //object can not have empty values
    for(let property in newUser){
        if(!newUser[property]) return window.alert('No fields can be blank!');
    }
    //validate no duplicate usernames
    if(users.find(user => user.username === newUser.username)) return window.alert('This username already exists!');

    return true;
}

export default validateCreateUser;