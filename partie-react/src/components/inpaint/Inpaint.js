import { useEffect, useState } from "react";
import { getUserImage, inpaintDjango, saveFavoris, search } from "../../store/apiCall";
import LeftBoard from "../leftBoard/LeftBoard";
import inpaintStyle from './Inpaint.module.css'
import { useNavigate } from "react-router-dom";


function Inpaint() {
    const [prompt, setPrompt] = useState("");
    const [inpaintim, setInpaintim] = useState();
    const [profileIm, setProfileIm] = useState();
    const [lesLien, setLesLien] = useState();
    //<im src={`data:image/webp;base64,${inpaintim}`}  alt="erreur" />

    const navigate = useNavigate();

    const chercher = async() => {
        if(inpaintim){
            const param = encodeURIComponent(inpaintim);
            const data = await search(param);
            setLesLien(data);
        }
    }

    const addtofavoris = async() => {
        if(inpaintim){
            const userObject = JSON.parse(localStorage.getItem('user'));
            const userId = userObject.userS.id;
            const data = await saveFavoris({
                userId: userId,
                image: inpaintim, 
            });
        }
        
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const resp = await getUserImage();
        const data = await resp.json();
        const image = data.image;
        const param = encodeURIComponent(image);

        const res = await inpaintDjango(param, prompt);
        setInpaintim(res)
        //const dataa = await res.json();
    }
    useEffect(()=>{
        console.log(inpaintim);
        const imUser = async()=>{
            const res = await getUserImage();
            if(res.status === 200){
                const data = await res.json();
                const image = data.image;
                setProfileIm(image);
            }
            else{
                navigate('/');
            }
        }
        if(!profileIm){
            imUser();
        }
    },[inpaintim, profileIm, lesLien]);

   
    return (
        <>
        <div className={inpaintStyle.main}>
            <LeftBoard test={1} className={inpaintStyle.board}/>

            <div className={inpaintStyle.left}>
                <img className={inpaintStyle.profileIm} src={`data:image/webp;base64,${profileIm}`} alt="erreur" height="400px" width="400px"/>
                <form className={inpaintStyle.prompt} onSubmit={handleSubmit}>
                    <input type="text" className={inpaintStyle.inputprompt} name={prompt} placeholder="prompt" onChange={(e) => setPrompt(e.target.value)} />
                    <input type="submit" className={inpaintStyle.promptbtn}/>
                </form>
                
            </div>

            <div className={inpaintStyle.right}>
                <div className={inpaintStyle.imResult}>
                    {inpaintim ? (
                        <>
                            <img src={`data:image/webp;base64,${inpaintim}`} alt="erreur" height="400px" width="400px"/>
                        </>
                    ) : (
                        <img src="data:image/png;base64,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" />


                    )}
                </div>
                <div className={inpaintStyle.lesbt}>
                    <button className={inpaintStyle.btnadd} onClick={addtofavoris}>Add To Favoris</button>
                    <button className={inpaintStyle.btnsearch} >Search</button>
                </div>
                <div className={inpaintStyle.searchres}>
                    {lesLien && (
                        <>
                            {lesLien.map((lien, index) =>
                                <p>
                                    <img src={lien.im} alt="erreur" height="100px" width="100px"/>
                                    
                                    <a href={lien.site} target="_blank">{lien.site}</a>
                                </p>
                            )}
                        </>
                    )}
                    
                </div>
            </div>
        </div>
        </>
    );
}

export default Inpaint;
