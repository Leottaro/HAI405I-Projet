import { useEffect, useState } from "react";
import socket from "../../socket";
import { useParams } from "react-router-dom";
import SixParam from "./SixParam/SixParam";

function Creer() {
  const { jeux } = useParams();
  const [nbrJoueursMax, setNbrJoueursMax] = useState(2);
  const [roundDelays, setRoundDelays] = useState({});
  const [choiceDelays, setChoiceDelays] = useState({});

  useEffect(() => {
    socket.emit("reqGamesInfos", jeux);
  }, [jeux]);

  socket.on("resGamesInfos", (json) => {
    // quand jeux === sixQuiPrend { roundDelays: {min, default, max}, choiceDelays: {min, default, max} }
    setRoundDelays(json.roundDelays);
    setChoiceDelays(json.choiceDelays);
  });

  function valider() {
    let json = { nbrJoueursMax: nbrJoueursMax, jeux: jeux };
    if (jeux === "sixQuiPrend") {
      json.options = options;
    }
    socket.emit("reqCreate", json);
  }

  let options = {};
  return (
    <div id="CRContent">
      <label className="CRtitle">Nombre de joueurs max dans la partie:</label>
      <input
        className="CRinput"
        defaultValue={2}
        type="number"
        min={2}
        max={10}
        onChange={(event) => {
          setNbrJoueursMax(parseInt(event.target.value));
        }}
      />
      {jeux === "sixQuiPrend" ? (
        <div id="ParametersDiv">
          <SixParam
            desc="temps max par rounds"
            min={roundDelays.min}
            defaultValue={roundDelays.default}
            max={roundDelays.max}
            onChange={(value) => (options.roundDelay = value)}
          />
          <SixParam
            desc="temps max choix de ligne"
            min={choiceDelays.min}
            defaultValue={choiceDelays.default}
            max={choiceDelays.max}
            onChange={(value) => (options.choiceDelay = value)}
          />
        </div>
      ) : (
        <></>
      )}
      <button className="CRButton CRvalider" onClick={valider}>
        Creer
      </button>
    </div>
  );
}
export default Creer;
