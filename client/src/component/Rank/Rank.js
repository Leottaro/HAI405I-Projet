import "./Rank.css";
import { useEffect, useState } from "react";

function Rank(props) {
    const [source, setSource] = useState("rank1.jpg");

    useEffect(() => {
        if (props.win - (props.nb - props.win) > 5) {
            setSource("rank4.jpg");
        } else if (props.win - (props.nb - props.win) > 3) {
            setSource("rank3.jpg");
        } else if (props.win - (props.nb - props.win) > 1) {
            setSource("rank2.jpg");
        } else {
            setSource("rank1.jpg");
        }
    }, [props]);

    return (
        <img
            id="rank"
            src={"../../assets/ranks/" + source}
            alt=""
        />
    );
}
export default Rank;
