import './App.css';

// import components
import { Header } from "./components/Header"
import Home from "./components/home"
import { Footer } from "./components/Footer"

function App() {
    return(
      <div>
        <Header/>
        <Home/>
        <Footer/>
      </div>      
    );
}

export default App;
