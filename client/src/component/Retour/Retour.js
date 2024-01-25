import './Retour.css';

function Retour(props) { // styling props
    return (
        <button style={{...props}} id="retour" onClick={() => window.history.back()}>Retour</button>
    );
}
export default Retour;