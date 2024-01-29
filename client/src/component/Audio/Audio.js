import { useRef, useState } from "react";
import './Audio.css';

function Audio() {
    const source = "../assets/musiques/background_music.mp3";
    const audioRef = useRef(null);
    const [volume, setVolume] = useState(0);
    const [mouseDown, setMouseDown] = useState(false);

    function handleClick() {
        const newVolume = (volume + 1) % 4; // 0: mute, 1: 25%, 2: 66%, 3:100%
        setVolume(newVolume);
        audioRef.current.volume = newVolume === 1 ? 0.25 : newVolume === 2 ? 0.66 : newVolume === 3 ? 1 : 0;
    }

    window.onmouseup = () => setMouseDown(false);

    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 24" id="volumeButton" className={(mouseDown ? "clicking" : "")} onClick={handleClick} onMouseDown={() => setMouseDown(true)}>
                <path fill="#fff"
                    d="M0 7V17C0 17.5523 0.447715 18 1 18H5.72302C5.90426 18 6.0821 18.0493 6.23751 18.1425L11.9855 21.5913C12.652 21.9912 13.5 21.5111 13.5 20.7338V3.26619C13.5 2.4889 12.652 2.00878 11.9855 2.4087L6.23751 5.85749C6.0821 5.95074 5.90426 6 5.72302 6H1C0.447717 6 0 6.44772 0 7Z" />
                <g fillOpacity={0} stroke="#fff" strokeWidth={2} strokeLinecap="round">
                    <path strokeOpacity={volume === 0 ? 1 : 0} d="M17.5 7.5L26.5 16.5M26.5 7.5L17.5 16.5" />
                    <path strokeOpacity={volume >= 1 ? 1 : 0} d="M17 9C19 11 19 13 17 15" />
                    <path strokeOpacity={volume >= 2 ? 1 : 0} d="M20 7C23.5 10.5 23.5 13.5 20 17" />
                    <path strokeOpacity={volume >= 3 ? 1 : 0} d="M23 5C28 10 28 14 23 19" />
                </g>
            </svg>
            <audio ref={audioRef} muted={volume === 0} hidden controls autoPlay loop>
                <source src={source} type="audio/mpeg" />
            </audio>
        </>
    );
}
export default Audio;

