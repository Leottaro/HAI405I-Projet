import './NavProfil.css';
import { useNavigate } from "react-router-dom";

function NavProfil() {
    const navigate = useNavigate();

    function goToProfil() {
        navigate("/profil/");
    }

    return (
        <div id="navProfil">
            <button id="buttonProfil" onClick={goToProfil}>Profil</button>
            {/*<img className="imgProfil" src="Assets/FaceCachee.png"></img>*/}
        </div>
    );
}
export default NavProfil;