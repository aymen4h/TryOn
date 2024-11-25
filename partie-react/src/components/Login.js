import loginStyle from "./Login.module.css";
import { useAtom } from "jotai";
import { fileAtom } from "../store/store";
import { useState, useEffect } from "react";
import { loginCall, registerCall } from "../store/apiCall";
import { useNavigate  } from 'react-router-dom';

function Login(){
    const [files, setFiles] = useAtom(fileAtom);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [user, setUser] = useState(false);
    const navigate = useNavigate();



    const  handleLogin = async (e)=>{
        e.preventDefault();
        const data = await loginCall({
            email:email,
            password:password,
        });
        if (data.flag){
            console.log("ok login");
            console.log(data);
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/inpaint");
        }
        else{
            console.log("login erreur");
        }
    }
    const  handleRegister = async (e)=>{
        e.preventDefault();
        const data = await registerCall({
            name : name,
            email : email,
            password : password,
            confirmpassword : confirmpassword,
            image : files,
        });
        if (data.flag){
            console.log("ok");
            toSignin();
        }
    }

    function toSignup(){
        document.getElementById(loginStyle.h1in).innerText = "sign up";
        document.getElementsByClassName(loginStyle.comment)[0].style.setProperty("animation-name", loginStyle.frame1);
        

    }
    function toSignin(){
        document.getElementById(loginStyle.h1in).innerText = "sign in";
        document.getElementsByClassName(loginStyle.comment)[0].style.setProperty("animation-name", loginStyle.frame2);        
    }

    const changeImage = async (e) => {
        const filess = e.target.files || null;
        if (filess) {
            const fileList = Array.from(filess);
            const file = fileList[0];
            const reader = new FileReader();
            
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const canvasWidth = 400; // Largeur souhaitée
                    const canvasHeight = 400; // Hauteur souhaitée
                    
                    // Redimensionnement proportionnel de l'image si nécessaire
                    let width = img.width;
                    let height = img.height;
                    const aspectRatio = width / height;
                    
                    if (width > height) {
                        width = canvasWidth;
                        height = width / aspectRatio;
                    } else {
                        height = canvasHeight;
                        width = height * aspectRatio;
                    }
                    
                    // Définir la taille du canvas
                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;
                    
                    // Dessiner l'image redimensionnée sur le canvas
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Obtenir la représentation base64 de l'image redimensionnée
                    const resizedBase64 = canvas.toDataURL('image/jpeg').split(',')[1]; // Vous pouvez également utiliser 'image/png' si nécessaire
                    console.log(resizedBase64);
                    setFiles(resizedBase64);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };
    
  
    return(
        <div className={loginStyle.we} >
            <div className={loginStyle.index}>
                <main id={loginStyle.mainSign}> 
                
                    <div className={loginStyle.in}>
                        <form className={loginStyle.formsign} onSubmit={handleLogin}>
                            <div className={loginStyle.indata}>
                                <div><input type="text" name={email} id={loginStyle.iduserIn} placeholder="email" onChange={(e) => setEmail(e.target.value)}/></div>
                                <div><input type="password" id={loginStyle.passwordIn} name={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/></div>
                            </div>
                            <div><button name="button" value="in" id={loginStyle.btnIn} >sign in</button></div>
                        </form>
                        <h2 onClick={toSignup} id={loginStyle.h2in}>sign up</h2>
                    </div>
                    <div className={loginStyle.comment}>
                        <h1 id={loginStyle.h1in}>Sign in</h1>
                    </div>
                    <div className={loginStyle.up}>
                        <form className={loginStyle.formsign} onSubmit={handleRegister}>
                            <div className={loginStyle.updata}>

                                <div><input type="text" 
                                    name={name} id={loginStyle.iduserUp} required placeholder="name" onChange={(e) => setName(e.target.value)}
                                /></div>

                                <div><input type="text" 
                                    name={email} id={loginStyle.iduserUp} required placeholder="email" onChange={(e) => setEmail(e.target.value)}
                                /></div>

                                <div><input type="password"
                                    id={loginStyle.passwordUp} required name={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}
                                 /></div>

                                <div><input type="password" 
                                    id={loginStyle.confirmpasswordUp} required name={confirmpassword} placeholder="Confirm Password"  onChange={(e) => setConfirmpassword(e.target.value)}
                                /></div>

                                <div><input id={loginStyle.file} type="file" name="file" required accept="image/png, image/jpeg, image/jpg"
                                        onChange={(e) => changeImage(e)}    
                                /></div>

                            </div>
                            <div><button name="button" value="up" id={loginStyle.btnUp} >sign up</button></div>
                        </form>
                        <h2 onClick={toSignin}id={loginStyle.h2up}>sign in</h2>
                    </div>
                </main>
            </div>
        </div>
      
    )
}
export default Login;
