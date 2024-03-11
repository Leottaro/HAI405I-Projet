import "./joueurMemory.css";

function JoueurMemory(props) {
    // {pseudo,score}

    return (
        <div className="joueurMemory">
            <label className="labelJB">{props.pseudo}</label>
            <label className="labelJB">{props.score}</label>
        </div>
    );
}

export default JoueurMemory;
