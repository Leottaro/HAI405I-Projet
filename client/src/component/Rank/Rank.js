import "./Rank.css";
import { useEffect, useState } from "react";
import rank1 from './rank.jpg';
import rank2 from './rank2.jpg';
import rank3 from './rank3.jpg';
import rank4 from './rank4.jpg';

function Rank(props) { 

    const [sourceBataille,setSourceBataille]= useState(rank1);
    const [sourceSix,setSourceSix]= useState(rank1);

    useEffect(() => {
        getSourceBataille();
        getSourceSix();
    }, []);

    function getSourceBataille(){
        if(props.nbBataille-props.winBataille>30){
            setSourceBataille(rank4)
        }
        else if(props.nbBataille-props.winBataille>20){
            setSourceBataille(rank3)
        }
        else if(props.nbBataille-props.winBataille>10){
            setSourceBataille(rank2)
        }
        else{
            setSourceBataille(rank1)
        }
    }
    function getSourceSix(){
        if(props.nbSix-props.winSix>30){
            setSourceSix(rank4)
        }
        else if(props.nbSix-props.winSix>20){
            setSourceSix(rank3)
        }
        else if(props.nbSix-props.winSix>10){
            setSourceSix(rank2)
        }
        else{
            setSourceSix(rank1)
        }
    }
    return (
        <div>
            <img id="rankBataille" src={sourceBataille}/>
            <img id="rankSix" src={sourceSix}/>
        </div>
    );
}
export default Rank;