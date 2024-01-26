import { useEffect, useState } from "react";
import './Audio.css';

function Audio() { 
    const source = "../Assets/EpicSaxoGuy.mp3";
    const [mute, setMute] = useState(false);

    function muted(){
        setMute(!mute);
    }

    return (
        <div>
            <button id="buttonMute" onClick={muted}>Mute</button>
            <audio muted={mute} hidden className="audio" controls autoPlay loop>
                <source src={source} type="audio/mpeg" />
            </audio>
        </div>
    );
}
export default Audio;

