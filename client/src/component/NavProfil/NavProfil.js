import './NavProfil.css';
import { useNavigate } from "react-router-dom";

function NavProfil(){

    const navigate = useNavigate();

    function goToProfil(){
        setTimeout(() => navigate("/profil/"), 10);
    }
    return (
    <div id="navProfil">
        <button id="buttonProfil" onClick={goToProfil}>Profil</button>
        <img src="../../../public/Assets/FaceCachee.png"></img>
    </div>
)
} 
export default NavProfil;