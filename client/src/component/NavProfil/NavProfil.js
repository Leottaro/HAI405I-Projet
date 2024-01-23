import './NavProfil.css';
import { useNavigate } from "react-router-dom";

function NavProfil(){

    const navigate = useNavigate();

    function goToProfil(){
        setTimeout(() => navigate("/profil/"), 10);
    }
    return (
    <div id="navProfil">
        <button onClick={goToProfil}>Profil</button>
    </div>
)
} 
export default NavProfil;