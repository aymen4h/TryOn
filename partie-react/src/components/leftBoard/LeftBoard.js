import leftStyle from './Left.module.css'
import { useNavigate  } from 'react-router-dom';




function LeftBoard({test}){
    const navigate = useNavigate();
    let col1 = "";
    let col2 = "";
    let col3 = "";
    if (test === 1){
        col1 = '#7980f4';
    }
    else if(test === 2){
        col2 = '#7980f4';
    }
    else if(test === 3){
        col3 = '#7980f4';
    }
    const handleLogOut = () => {
        localStorage.setItem("user", null);
        navigate("/");
    }
    return(
        <>
            <div className={leftStyle.main}>
                <div className={leftStyle.up}>
                    <h1 className={leftStyle.profile} style={{background: col3}}>
                    <img style={{marginRight: '10px'}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA+klEQVR4nO1TO24CMRC1UlBGoSbUewiOkWuA4FpBSNsmLdwgKVPS8tlFnmVmZ6SJJopAWcWLwKbbJz3J8tjvzcd2rkMKVJUOPckCkA9GT5KXqFkycUDeAon+IfLOYtEG3jJviv/Sk8yjDcDaEjAA5PLeBkW0gSfJgy1Cfo02KFEzG+g/2W8A9NklfKZz67nRMk8m3iEIVX2o6noEKLNCtd+M71WfAGVqZ+zsNcI9OMrEE6/PP5a/APllo/potPXP3jm+hqOM7W6rOIAOAOUz+LHoAlE+TCNsQPJ+szid+BY08Mh1rIFHrtsq0BR04QpkFV+BLFsH3cE18A2B3I286xntNAAAAABJRU5ErkJggg==" height='25px' width='25px' />


                        <span className={leftStyle.proftext}>Profile</span>
                    </h1>

                    <h1 className={leftStyle.h1Inpaint} onClick={()=> navigate("/inpaint")} style={{backgroundColor: col1}}>
                        <img style={{marginRight: '10px'}} src="data:image/png;base64,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" height='25px' width='25px' />
                        <span>Inpaint</span>
                    </h1>
                    <h1 className={leftStyle.h1Favoris} onClick={()=> navigate("/favoris")} style={{backgroundColor: col2}}>
                    <img style={{marginRight: '10px'}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADPElEQVR4nO1YOYgUURAdz0VdULwvMDHQSDDS0MADRFBEEUSFDTQwMxMTMdrAZMEDI8FE2UQFwUBlETVaQcRgRXS9QARlj5mq6aqp75ZUH+Ms9sz2sDO93dAPPtPz+3f9fv2r/qv6pVKBnAPIvUJ22s0G5F52nUi3SWDYUiOSV/t1FEQSAosVaROFayUEFq6VNdcimQR2fd2ynxoRIDlov6o6X1UX5paIBgSWAMsHYPmoqj25DcYKu5PRPFV2x3NLBNk9bci7HueSSLWqW4DkD5BMAQkBiUPUzTkURLkcpvLPgeReeH0pV0RUdR6wfPJfnt1pJDkUXMuo3cssEVVdCqAbyqTbsFbbhZ4779snmVTVZaq6GEl+h0F/wtxuXHVFJoggyW0k+QUktaaFFcmtaDyQ3GwyZhxYviC5t8hyNXUiQG54elkrgiRjwPLddAPZPbMvH433PN3qxwvLqI2LLY1ZvqVOZFJ1FbIbCr9qGUkOt2sDPNlv7hfFDzDvmJMYsdQDWAbCFZlCln5T9FJCsQSSarSzVSq6ds6DHWvubEOsPBpTXd5srKouMMKNcaSqizKz/VY82RPtTEByo/m8AQkg8YDdmUzqiO06gV3pn5EIy0CHJu0CEXKvzWbFk71Rn7mNuVP0HzzZF8bFcCaJTKiuDHMrMoG0PmB3ytwNWD7bDlUXzzD3smcyRwRJjoY2h0zlgd39/3XCDZZVV9suFQb6kcwRAZLrwcu5N3VtsIAmdxFr7lzUhyw/7Uw4jJNr2VsRlvfTld69sNwruh+u0sPpqyQjmSJSVl3ToAsTpitxWW6QFbs+y6/qhEHXZyn77fFjg+Quom781ydXYudG3QTsHlg930o8s1JYjRSn8e2gOPtNCCzOfrv4xcCTA0junTW77rT9WSHJRH55ym4wpix9UibdPlv7HUGriVS119JtS+4ikauSu2DNF7wg/aCwIuxt135HETeRKW+V3TFg+VovX0nuVCq6rrFWt1rCPzkM0owfoZLPzwQRYN4ZJXNRvVCt1XY3e36m8Zg2kaRfOA6tVhDTJpLU51shLqYwdSIJd6EkiNvlSt2Gf7jWhi60A4h0h91Qp20XKKWMvwM++TjjFTtJAAAAAElFTkSuQmCC" height='25px' width='25px' />
                        <span>Favoris</span>
                    </h1>
                </div>
                <div className={leftStyle.down}>
                    <h1 className={leftStyle.h1Logout} onClick={handleLogOut}>
                    <img style={{marginRight: '10px'}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD5ElEQVR4nO1aW48UVRA+RHBNvAKi8qDBN41GJfwHRcSgwIvom/HyBOvyrhCJCRp90OAP0aDxRUETbgsISEQWNcQLESS4O13VUzVVSZmaPj3paMTt2e7p6Q1f0plMZs7pU+er26k6IdzAIsU1szuRZDOyvIOs+4FlBlkuAwkBCSPJNWQ5578hy3tIsmnWbHkYB5jZsoT1RWT9or9YVivzAIn62IT1JTObaEKAiYR0J7D8VliUIOuXyLIbSbZ0yB5KErvH/+sC++53yB5GkueA9E1k/crZGoxn+T0lnTKzW0YiBJBsyNQm7izpGWB9edZsRdm5/jK7C1hfQdLjBYF+BJKna2UBSD4uCPAddGW9mS2pYn6fC0m/LTC8r3J2AGw1kE7HF3SRdNLMltawWTch6Q4gSbN36XSS2L2VTJ6m9gCwXBjQzrw21IyE+TFgOR/feaHbtQcXzgTLxXx35sxWhhFhzmwlkB7JhRmamcwm9HAU4rDHicpX+/9ruHUgDOn0UDYDLB/E3bjYMVsVGsKcM5OrGcm+0hMgy95+ZGZ+PDSMxG0mdwBdWR/aDCSdzO1lZEGzDpjZUiQ9FWPYZGgzgGRDFjDl0lCseM4EpIeA9GBoEGa2BElPuDAJ67bSQng6El3g0dAwsKevxTTm86GE8E//HhrGrNlyPzJ4tj2v2OaxwzPbqJPnAOy+MCYA0oPZ5sqzrWOiCGTZFTf43dBGJnIgyfNZTNFPQhuZyJEwPxI3+ofQRiZydMzujjZyJfwTxeNmXQ+QfhMqgJlNxCSSmhLk69oF6fxbtVaHMUXH1/pfqrVojL1NzGC/onkd97uoAmIbmIGYogDJxnkNGEdmZs1W5EnjVbM7hk3jj4WGgT19Pbrzz0oPjsIc97JQaP5gddIFSVlfCG0FkGyMBYhfG2lDVFh8OB3tdXtoK1LSqcjG+VJsjFOBDpif6HcBsgLdkyUHy/t5ybRJt9sxW1XoBnw4bBH7UHS7R7y7VMtKr7+G27xyk1dwhjZwP1wBy8/RwE6Msq3QcSZyIVhmFqwVaWr3F5ouP2Gvty6MwiZ4oE4z3a6tqWZiZ4b0WN56846ud2pDDS42JZ0aGDbp0crt08xuBpaPCs3Qs959raIZ6nMAyTODOBENu9agB115yg80RYGwp696QWCYBLCfO8W0A6MqlXaxC2EHSd8All+KtxiA9ACyvI0kW/1ygKukV839/+4oEuZH/VAEpG95Kl68LeFpB5Jub+oGxDJP3jwTLd5imH8xon9bYr/PMTa5059mt2cVQNmDrJ9m6id/uOHGSzVXkeV7P576yc7rtqXOEzcQ2oW/AdX02gGzOwyqAAAAAElFTkSuQmCC" height='25px' width='25px' alt='erreur' />


                    Log out
                    </h1>
                </div>
            </div>
        </>
    );
}
export default LeftBoard;