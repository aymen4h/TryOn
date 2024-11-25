import Login from './components/Login';
import Ts from './components/ts';
import Favoris from './components/favoris/Favoris'
import Inpaint from './components/inpaint/Inpaint'
import {BrowserRouter,Route,Routes}from "react-router-dom";


function App() {
  return (
    <>
    
       <BrowserRouter>
          <Routes>
             <Route path="/" exact element= {<Login />} />
             <Route path="/ts" exact element= {<Ts />} />
             <Route path="/favoris" exact element= {<Favoris />} />
             <Route path="/inpaint" exact element= {<Inpaint />} />
          </Routes>
       </BrowserRouter>
    
    </>
    )
}

export default App;
