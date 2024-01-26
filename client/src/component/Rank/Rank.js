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
        if(props.winBataille-(props.nbBataille-props.winBataille)>15){
            setSourceBataille(rank4);
        }
        else if(props.winBataille-(props.nbBataille-props.winBataille)>10){
            setSourceBataille(rank3);
        }
        else if(props.winBataille-(props.nbBataille-props.winBataille)>5){
            setSourceBataille(rank2);
        }
        else{
            setSourceBataille(rank1);
        }
    }
    function getSourceSix(){
        if(props.winSix-(props.nbSix-props.winSix)>15){
            setSourceSix(rank4);
        }
        else if(props.winSix-(props.nbSix-props.winSix)>10){
            setSourceSix(rank3);
        }
        else if(props.winSix-(props.nbSix-props.winSix)>5){
            setSourceSix(rank2);
        }
        else{
            setSourceSix(rank1);
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