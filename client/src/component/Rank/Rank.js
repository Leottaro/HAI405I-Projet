import "./Rank.css";
import { useEffect, useState } from "react";

function Rank(props) {
    const [sourceBataille, setSourceBataille] = useState("rank1.png");
    const [sourceSix, setSourceSix] = useState("rank1.png");

    useEffect(() => {
        if (props.winBataille - (props.nbBataille - props.winBataille) > 15) {
            setSourceBataille("rank4.jpg");
        }
        else if (props.winBataille - (props.nbBataille - props.winBataille) > 10) {
            setSourceBataille("rank3.jpg");
        }
        else if (props.winBataille - (props.nbBataille - props.winBataille) > 5) {
            setSourceBataille("rank2.jpg");
        }
        else {
            setSourceBataille("rank1.jpg");
        }

        if (props.winSix - (props.nbSix - props.winSix) > 15) {
            setSourceSix("rank4.jpg");
        }
        else if (props.winSix - (props.nbSix - props.winSix) > 10) {
            setSourceSix("rank3.jpg");
        }
        else if (props.winSix - (props.nbSix - props.winSix) > 5) {
            setSourceSix("rank2.jpg");
        }
        else {
            setSourceSix("rank1.jpg");
        }
    }, [props]);

    return (
        <div>
            <img id="rankBataille" src={"../../assets/ranks/" + sourceBataille} alt="" />
            <img id="rankSix" src={"../../assets/ranks/" + sourceSix} alt="" />
        </div>
    );
}
export default Rank;