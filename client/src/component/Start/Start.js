import "./Start.css";

function Start(props) {
    return (
        <div id="divStart">
            <label className="code">code de la partie:</label>
            <label className="code">{props.code}</label>
            <button
                hidden={!props.afficheStart}
                onClick={props.start}
            >
                commencer
            </button>
            <button
                hidden={!props.afficheSave}
                onClick={props.save}
            >
                save
            </button>
            <button
                hidden={!props.afficheBot}
                onClick={props.addBot}
            >
                ajouter un bot
            </button>
        </div>
    );
}
export default Start;
