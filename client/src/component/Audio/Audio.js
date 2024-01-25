import { useEffect, useState } from "react";
import './Audio.css';

function Audio() { 
    const source = "../Assets/audio.mp3";
    
    return (
        <div>
            <audio hidden className="audio" controls autoPlay loop>
                <source src={source} type="audio/mpeg" />
            </audio>
        </div>
    );
}
export default Audio;

