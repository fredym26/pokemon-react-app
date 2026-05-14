import Tabla from './components/Tabla';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";




function App() {
  return (
    
    <div style={{ width: "100%", margin:"0 auto"}} className="max-w-4xl mx-auto p-6"><h2 className=" text-2xl text-red-500 font-bold text-center mb-1">Lista de Pokemones</h2>
    <Tabla></Tabla>
    
    </div>
  )
}

export default App

