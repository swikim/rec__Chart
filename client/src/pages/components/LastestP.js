import React, { useEffect,useState } from "react";
import { Card, Title,Flex,Text}from "@tremor/react";
import {format} from "date-fns/format";
import axios from "axios";

function LastestP(){
    const [LPA, setLPA] = useState(null)    

    const dateFormat = (date) => {
        try {
          let formattedDate = format(date, "yyyyMMdd");
          return formattedDate;
        } catch (error) {
          console.error("Error formatting date:", error);
          return null;
        }
      };   
    const lastedTT=()=>{
        const today = new Date();
        today.setDate(today.getDate()-1)
        while(1){
            
            if(today.getDay() === 2|| today.getDay()===4){
                
                break;
            }else {
                today.setDate(today.getDate() - 1);
            }
            }
            return today;
    }
    

    useEffect(()=>{
        const closestTT = lastedTT();

        const fetchData = async()=>{
            try{
            const response  =  await axios.get(`check_land?data=${dateFormat(closestTT)}`);
            const LHP = response.data.data.최고가;
            const LLP = response.data.data.최저가;
           
            return {'최고가' : LHP, '최저가' : LLP}
        }
            catch(err){console.error("LastestP - useEffect error",err)}
            return null;
        }
        fetchData().then((data)=>{
            if(data){
                setLPA(data);

            }
        })

    },[])
    
    return(
        <>
        <Card className="top_card_left">
            <Title>REC현물</Title>
            {LPA ? (
                <div>
                <p>최고가: {`${LPA.최고가}`}</p>
                <Flex>        
                    <p>최저가: {LPA.최저가}</p>   
                    <Text style={{textAlign:'right'}}>{`${dateFormat(lastedTT(new Date()))}`}기준</Text>
                </Flex>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </Card>
        </>
    );
}

export default LastestP;