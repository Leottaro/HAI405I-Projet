import './Start.css';

function Start(props){

    return (
    <div id="divStart">
        <h2 className="code">code de la partie:</h2>
        <h2 className="code">{props.code}</h2>
        <button hidden={!props.afficheStart} id="start" onClick={props.start}>commencer</button>
        <button hidden={!props.afficheSave} id="save" onClick={props.save}>save</button>
    </div>
)
} 
export default Start;





