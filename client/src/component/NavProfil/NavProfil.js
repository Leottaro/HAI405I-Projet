import './NavProfil.css';
import { useNavigate } from "react-router-dom";

function NavProfil() {
    const navigate = useNavigate();

    function goToProfil() {
        navigate("/profil");
    }

    return (
        <button id="navProfil" onClick={goToProfil}>Profil</button>
    );
}
export default NavProfil;