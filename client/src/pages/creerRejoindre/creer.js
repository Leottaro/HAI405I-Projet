import { useEffect, useState } from "react";
import socket from "../../socket";
import { useParams } from "react-router-dom";
import OptionalParam from "./OptionalParam/OptionalParam";

function Creer() {
    const { jeux } = useParams();
    const [nbrJoueursMax, setNbrJoueursMax] = useState(10);
    const [optionalParams, setOptionalParams] = useState({});

    useEffect(() => {
        socket.emit("reqGamesInfos", jeux);
    }, [jeux]);

    useEffect(() => {
        socket.on("resGamesInfos", (json) => {
            // quand jeux === sixQuiPrend { roundDelays: {min, default, max}, choiceDelays: {min, default, max} }
            setOptionalParams(json);
        });
        return () => {
            socket.off("resGamesInfos");
        };
    }, []);

    function valider() {
        socket.emit("reqCreate", { nbrJoueursMax, jeux, options });
    }

    let options = {};
    return (
        <div id="CRContent">
            <label className="CRtitle">Nombre de joueurs max dans la partie:</label>
            <input
                className="CRinput"
                defaultValue={10}
                type="number"
                min={2}
                max={10}
                onChange={(event) => {
                    setNbrJoueursMax(parseInt(event.target.value));
                }}
            />
            {jeux === "sixQuiPrend" ? (
                <div id="ParametersDiv">
                    {optionalParams.roundDelays ? (
                        <OptionalParam
                            desc="temps max par rounds"
                            min={optionalParams.roundDelays.min}
                            defaultValue={optionalParams.roundDelays.default}
                            max={optionalParams.roundDelays.max}
                            onChange={(value) => (options.roundDelay = value)}
                        />
                    ) : (
                        <></>
                    )}
                    {optionalParams.choiceDelays ? (
                        <OptionalParam
                            desc="temps max choix de ligne"
                            min={optionalParams.choiceDelays.min}
                            defaultValue={optionalParams.choiceDelays.default}
                            max={optionalParams.choiceDelays.max}
                            onChange={(value) => (options.choiceDelay = value)}
                        />
                    ) : (
                        <></>
                    )}
                </div>
            ) : jeux === "memory" ? (
                <div id="ParametersDiv">
                    {optionalParams.roundDelays ? (
                        <OptionalParam
                            desc="temps max par joueur"
                            min={optionalParams.roundDelays.min}
                            defaultValue={optionalParams.roundDelays.default}
                            max={optionalParams.roundDelays.max}
                            onChange={(value) => (options.roundDelay = value)}
                        />
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <></>
            )}
            <button
                className="CRButton CRvalider"
                onClick={valider}
            >
                Creer
            </button>
        </div>
    );
}
export default Creer;
