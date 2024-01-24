import './Retour.css';
import { useNavigate } from "react-router-dom";

function Retour(){

    const navigate = useNavigate();

    function goBack(){
        //en attente
    }

    return (
    <div id="retour">
        <button id="back" onClick={goBack}>Retour</button>
    </div>
)
} 
export default Retour;