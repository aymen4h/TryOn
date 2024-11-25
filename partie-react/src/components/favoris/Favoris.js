import { useEffect, useState } from "react";
import {search, saveFavoris, getFavoris, removeFavoris} from '../../store/apiCall';
import styleFavoris from './Favoris.module.css';
import LeftBoard from '../leftBoard/LeftBoard';
import { useNavigate } from "react-router-dom";




function Favoris(){
    
    const [fill, setFill] = useState("");
    const [fdata, setFdata] = useState([]);
    const [nbFData, setNbFData] = useState(true);
    //[{image: "erreur", id: 2}]
    const [lesLien, setLesLien] = useState();
    const [testFav, setTestFav] = useState();
    const [tsetcliq, setTestcliq] = useState(false)

    const navigate = useNavigate();

    const supprimer = async(id) => {
        const data = await removeFavoris(id);
        setNbFData(!nbFData);
    }

    const cherchers = async(img) => {
        document.getElementsByClassName(styleFavoris.searchres)[0].hidden = false;
        setTestcliq(true);
        document.getElementsByClassName(styleFavoris.searchres)[0].scrollIntoView();
        const param = encodeURIComponent(img);
        const data = await search(param);
        setTestcliq(false);
        setLesLien(data);
    }

    useEffect(() => {
        const fet = async() => {
            const favorisData = await getFavoris();
            console.log(favorisData.status);

            if(favorisData.status === 200){
                const data = await favorisData.json();
                setFdata(data);
                setTestFav(true);
            }
            else if(favorisData.status === 401){
                navigate('/');
            }
            else{
                setTestFav(false);
            }
            
        }
        fet();
    },[nbFData, tsetcliq]);
    
   
    const savefavoris = async(e) => {
        e.preventDefault();
        const userObject = JSON.parse(localStorage.getItem('user'));
        const userId = userObject.userS.id;
        const data = await saveFavoris({
            userId: userId,
            image: fill, 
        });
        setNbFData(!nbFData);
    }

    const chercher = async(e) => {
        e.preventDefault();
        if(fill){
            const param = encodeURIComponent(fill);
            const data = await search(param);
            setLesLien(data);
        }
        
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
                    //console.log(resizedBase64);
                    setFill(resizedBase64);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };


    return(
        <>
        <div className={styleFavoris.main}>
            <LeftBoard test={2} className={styleFavoris.board}/>
            <div className={styleFavoris.container}>
                <form onSubmit={savefavoris} className={styleFavoris.formUpload}>
                    <label for={styleFavoris.inputfile} id={styleFavoris.droparea} 
                        onDragOver={(e) => {e.preventDefault();}}
                        onDrop={(e) => {
                            e.preventDefault();
                            const files = e.dataTransfer.files;
                            if (files.length) {
                                changeImage({ target: { files } });
                            }
                        }}
                    >
                        <input id={styleFavoris.inputfile} type="file" name="file" hidden required accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => changeImage(e)}  
                        />
                        <div id={styleFavoris.imgview}>
                        {
                            fill !== "" ? (
                                <img id={styleFavoris.imdraged} src={`data:image/webp;base64,${fill}`} alt="erreur" height="300px" width="500px" />
                            ) : (
                                <>
                                    <img id={styleFavoris.uplogo} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAABDCAYAAADHyrhzAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD60lEQVR4nO2aTYxTVRSAH78KJoI/caEbggs2biAEWbKBmBhdmLzERKDMOe+edkKGMIAxYcHoGkKCCxQGJcq/MWjiQiUB5f9vQ2CGDAujg6P8TDvvnBkmiKjX3NZO+5wOvE5vO+30fsnJy+tt8+79es69793W8xwOh8PhcDgcDofD4XD8B9HAHFD8NhB3ouKTQNwFxDeQ+AKSfAnEm4NAlnqenuJNVoB4MRB/g8QPkETHiF+QZOPKlbee8iYLq5PDL4GSw0j8T0wJ0VB8Cyl8y2t0MMlLgPj3cUn4X4CSXUR6hteIgJI3kfi+DRFFQr71fT3TayQgFS5Ekns2RRQJOdwwkyvR4PNA0lsNESNCiNvMtTo69FS/Xc/y6hVU8mE5A1Mp0Zveyx3jZwf/gUp+yq9MQMJA8h3SYJBI6Ce9eoCIXy5j6dTrN7C+1pXR/el09mjOK88a6cUkL59oFx6Q7Izb6XXtrLu6cyLycb0no9s3VS4Eif8CJTCBKvQUVNw3XhG2hYDivycsQ4JAllYqwnqGKPm5rU0/UXMZSLLRhgjrGRLIGqsDJfptdgvJq7kbKUmYI6RkQfF6j0o+etxk2X29IOJuf1r33owKMOfm9fy5eX+lkyqQHH+nLf10xRKQ+DVQ/DWQDI9Rl3eAeIdZRUDJwbgZYQa859NQnz0fzRJz/vHuMCLERoaA4odIfBqJfd/X08qS0NLK85HkRHz7/CcqTsctjc/3DWTbSskwr3+yN6zSKpOdR65AauiVeNmQDJcBcb+NC5cSse9AONI+lgwTez+rohDi+6bUHyliDYWLxiqJ8cS5C9HB7j9YEPE4GSbM+4vbL16Otlco5AEQrygporWVnwGSX+1dTLLfZn4gh47kSqMcGSbM5/Lt17ptysiW9+1UauiF0eVBvNXmhUxseZ/18ROZ7GRZqj2ODBO794T6hx8zessHtsokIqQzIsLYQct7D3EiroxqhnnoAxh+cUQGBKGqdSfqRYaJgHhtcYkcbWYZSPxVsYyrzSzD/FxRKBPFd5pZBhLfLciwvKRio8lQcrNYxqVmlgHE54tkcGeTyyjcayDJG80tQ14fkWF2lDHmlp3NOHWmcKtt4uTp0bfsVQ/FfaN2w5AGg1p3ZFdn9EHM7GVMQGa0jHo28X09DZQcq3Vntm0P9ZEvBvTW7bUXYcY75mYPIj+b+69Ezb+d2ofiHvOk7j2KVWvluXJ2uRoxgPhUyUf3Uvi+ngkk74KSgcklQTJmF7+jQ0+PJaJE2aSQ5PtGFWP6bf7KgIqTiUQ417OF365nJZLhPLNhXO9h+lnXv9A7HA6Hw+FwOBwOh8PhcHiV8y/T5YmAcUi/ewAAAABJRU5ErkJggg==" />
                                    <p>Drag and drop or click here<br/>to upload image</p>
                                    <span>Upload any image from desktop</span>
                                </>
                            )
                        }
                            
                        </div>
                    </label>
                    <input type="submit" value="Add To Favoris" />
                </form>
                {/*<button className={styleFavoris.btnsavefav} onClick={savefavoris}>Add To Favoris</button>*/}
                {/*<form onSubmit={savefavoris}>
                    <input type="file" name="file" required accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={(e) => changeImage(e)}    
                    />
                    <input type="submit" value="enregistrer" />
                </form>*/}
                
                <div className={styleFavoris.lesimg}>
                    {testFav && (
                        <>
                        {fdata.map((favori, index) =>
                            <div key={favori.id} className={styleFavoris.fdata}>
                                <img  src={`data:image/webp;base64,${favori.image}`}  alt="erreur" height="400px" width="400px" />
                                <div className={styleFavoris.lesbtn}>
                                    <button onClick={() => supprimer(favori.id)} className={styleFavoris.rmbtn}>Remove</button>
                                    <button onClick={() => cherchers(favori.image)} className={styleFavoris.schbtn}>Search</button>
                                </div>
                            </div>
                        )}
                        </>
                    )}
                    
                    
                </div>
                
                {/*lesLien && (
                    <div className={styleFavoris.searchres}>
                        {lesLien.map((lien, index) =>
                            <p>
                                <img src={lien.im} alt="erreur" height="100px" width="100px"/>
                                    
                                <a href={lien.site} target="_blank" style={{color: "white"}}>{lien.site}</a>
                            </p>
                        )}
                    </div>
                )*/}
                    <div className={styleFavoris.searchres} hidden>
                        {tsetcliq ? (
                            <span className={styleFavoris.loader}></span>
                        ) : (<>{lesLien && (
                            lesLien.map((lien, index) => (
                                <p key={index}>
                                    <img src={lien.im} alt="erreur" height="100px" width="100px" style={{display:"span", marginRight: "10px"}} />
                                    <a href={lien.site} target="_blank" style={{ color: "#6366f1" }}>{lien.site}</a>
                                </p>
                            ))
                        )}
                            
                        </>)}
                    </div>
                
            </div>
        </div>
        </>
    )
};
export default Favoris;
