let persistToken = (key, token) =>{
    try{
        let expiryDate = new Date().getTime() + (24 * 60 * 60 * 1000);
        return localStorage.setItem(key, JSON.stringify({session:token, expires:expiryDate}));
    }catch (error) {
        console.log(error)
        return null;
    }

};

let searchToken = (key) =>{
    try{
        return JSON.parse(localStorage.getItem(key));
    }catch(error){
        console.log(error)
        return null;
    }
};

let persistUserCommandHistory = (key, history) =>{
    try{
        return localStorage.setItem(key, JSON.stringify(history));
    }catch (error) {
        console.log(error)
        return null;
    }

};

let getUserCommandHistory = (key) =>{
    try{
        return JSON.parse(localStorage.getItem(key));
    }catch(error){
        console.log(error)
        return null;
    }
};