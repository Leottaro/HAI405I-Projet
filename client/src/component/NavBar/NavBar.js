import "./NavBar.css";
import NavProfil from "../NavProfil/NavProfil";
import Retour from "../Retour/Retour"
import { useNavigate } from "react-router-dom";

function Navbar(){
    const navigate = useNavigate();

    function navLeaderboard(){
        navigate("/leaderboard");
        
    }

    function navSelection(){
        navigate("/selectionJeux");
    }

    return (
        <div id="navBar">
            <NavProfil/>
            <button onClick={navLeaderboard} className="navBarButton">Leader board</button>
            <button onClick={navSelection} className="navBarButton">Selection du jeu</button>
            <Retour/>
        </div>
    )
}
export default Navbar;