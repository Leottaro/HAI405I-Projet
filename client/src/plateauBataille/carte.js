function Carte(props) {
    let valeur=props.valeur;
    let type=props.type;
    let lien="../../asset/"+valeur+"De"+type+".png";
    console.log(lien);
    return (
        <div className="carte">
            <img height={"100"} src={lien}></img>
        </div>
    );
}
export default Carte;