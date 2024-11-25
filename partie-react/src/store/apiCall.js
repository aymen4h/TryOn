import { json } from "react-router-dom";

export const loginCall = async( body ) => {
    
    var res = await fetch("Auth/Login", {
        method: "post",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify(body)
    })

    const data = await res.json();
    
    return data;
}

export const registerCall = async( body ) => {
    
    var res = await fetch("Auth/Register", {
        method: "post",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify(body)
    })

    const data = await res.json();
    
    return data;
}

export const get = async( ) => {
    var res = await fetch("WeatherForecast", {
        method: "get",
        headers: new Headers({
            "Content-Type": "application/json"
        })
    });    
    const data = await res.json();
    //console.log(data);
    return data;
}

export const django = async() => {
    var res = await fetch("http://localhost:8000/dataa/", {
        method: "get",
        headers: new Headers({
            "Content-Type": "application/json"
        })
    });    
    //const data = await res.json();
    const data = await res.json();
    //console.log(data);
    return data;
}
export const search = async(imBase64) => {
    
    var res = await fetch(`http://localhost:8000/search/?param=${imBase64}`, {
        method: "get",
        headers: new Headers({
            "Content-Type": "application/json"
        })
    });    
    //const data = await res.json();
    const data = await res.json();
    console.log(data);
    return data;
}
export const getUserImage = async() => {
    const userObject = JSON.parse(localStorage.getItem('user'));
    let token;
    let userId;
    if(userObject === null){
        token = "";
        userId = "";
    }
    else{
        token = userObject.token;
        userId = userObject.userS.id;
    }
    
    var res = await fetch(`App/GetUserImage?id=${userId}`,{
        method: "get",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        })
    });
    //const data = await res.json();
    //console.log(token);
    return res;
}
export const inpaintDjango = async(im, prompt) => {
    var res = await fetch(`http://localhost:8000/inpaint/?image=${im}&prompt=${prompt}`,{
        method: "get",
        headers: new Headers({
            "Content-Type": "application/json"
        })
    });
    const data = await res.json();
    //console.log(data);
    return data;
}
export const saveFavoris = async(body) => {
    
    var res = await fetch('App/SaveFavoris', {
        method: "post",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body : JSON.stringify(body),
    });
    const data = await res.json();
    //console.log(data);
    return data;
}
export const getFavoris = async() => {
    const userObject = JSON.parse(localStorage.getItem('user'));
    let token;
    let userId;
    if(userObject === null){
        token = "";
        userId = "";
    }
    else{
        token = userObject.token;
        userId = userObject.userS.id;
    }
    
    var res = await fetch(`App/GetFavoris?id=${userId}`,{
        method: "get",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        })
    });
    //const data = await res.json();
    //console.log(res);
    return  res;
}
export const removeFavoris = async(id) => {
    var res = await fetch(`App/RemoveFavoris/${id}`,{
        method: "delete",
        headers: new Headers({
            "Content-Type": "application/json"
        })
    });
    const data = await res.json();
    return data;
}

