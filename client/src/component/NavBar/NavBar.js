import { useState } from "react";
import "./NavBar.css";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [hidden, setHidden] = useState(true);

    return (
        <div
            id="navBar"
            className={hidden ? "hidden" : ""}
        >
            <svg
                id="navBarButton"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => setHidden(!hidden)}
            >
                <path
                    id="background"
                    d="M18 0H6C3 0 0 3 0 6V18C0 21 3 24 6 24H18C21 24 24 21 24 18V6C24 3 21 0 18 0Z"
                />
                <path
                    id="vector1"
                    d={hidden ? "M6 6 L18 6" : "M6 6 L18 18"}
                />
                <path
                    id="vector2"
                    d={hidden ? "M6 12 L18 12" : "M11.9 12 L12.1 12"}
                    strokeOpacity={hidden ? 1 : 0}
                />
                <path
                    id="vector3"
                    d={hidden ? "M6 18 L18 18" : "M6 18 L18 6"}
                />
            </svg>
            <label onClick={() => window.history.back()}>Retour</label>
            <label
                className={location.pathname === "/selectionJeux" ? "disabled" : ""}
                onClick={() => navigate("/selectionJeux")}
            >
                Selection du jeux
            </label>
            <label
                className={location.pathname === "/leaderboard" ? "disabled" : ""}
                onClick={() => navigate("/leaderboard")}
            >
                Leaderboard
            </label>
            <label
                className={location.pathname === "/profil" ? "disabled" : ""}
                onClick={() => navigate("/profil")}
            >
                Profil
            </label>
        </div>
    );
}
export default Navbar;
