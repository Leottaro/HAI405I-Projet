function Carte(props) {
    return (
        <div className="carte">
            <label onClick={console.log("oui")}>{props.valeur} de {props.type}</label>
        </div>
    );
}
export default Carte;