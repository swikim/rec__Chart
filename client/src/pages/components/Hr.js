import React,{useEffect,useState} from "react";
import axios from "axios";
import { DateRangePicker,Button,Text,Title} from "@tremor/react";
import { ko } from 'date-fns/locale';
import { differenceInDays,format } from 'date-fns';
import "../Main.css"

const Hr=({region,onRegionChange})=>{
    const apiKey = process.env.REACT_APP_API_Key

    const [dateValue, setDateValue] = useState({
        from : new Date(2024,2,1),
        to : new Date(),
    })
    const [avgHr, setAvgHr] = useState([]);
    const [regionNames, setRegionNames] = useState(['경기','강원','충북','충남','전북','전남','경북','경남','제주'])
    const regionCodes = [119,114,131,232,146,156,138,152,184]
        //경기,강원,충북,충남,전북,전남,경북,경남,제주

    //지역코드 보내기
    const handleClick=(region)=>{
        onRegionChange(region);
    }
    //날의 차

    const dateSubtract = () => {
        const { from, to } = dateValue;
        return differenceInDays(to, from);
    };
    const dateFormat = (date)=>{
        try {
            return format(date, "yyyyMMdd");
          } catch (error) {
            console.error("Error formatting date:", error);
            return null;
          }
    }

    const get_Weather = async(startDate,endDate,region_Code)=>{
       
        const dayDifference = dateSubtract()
        const url =`https://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList?serviceKey=${apiKey}&pageNo=1&numOfRows=${dayDifference}&dataType=json&dataCd=ASOS&dateCd=DAY&startDt=${startDate}&endDt=${dateFormat(endDate)}&stnIds=${region_Code}`
        try {
            const response = await axios.get(url);
            const data = response.data.response.body.items.item;
    
            let sumHr = 0;
            data.forEach(item => {
                sumHr += Number(item.sumSsHr);
            });
    
            return (sumHr / dayDifference).toFixed(1);
        } catch (err) {
            console.error("Error fetching get_weather", err);
            return null;
        }
    }
    function isToday(date) {
        const today = new Date();
        return (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      }

      useEffect(()=>{
        const fetchWeatherData = async () => {
            const startDate = dateFormat(dateValue.from);
            const currentDate = new Date(dateValue.to);
            let endDate = new Date(currentDate);
    
            if (isToday(currentDate)) {
                endDate.setDate(currentDate.getDate() - 1);
            }
    
            // 모든 지역에 대한 API 호출을 동시에 처리
            const promises = regionCodes.map(regionCode => get_Weather(startDate, endDate, regionCode));
            const results = await Promise.all(promises);
    
            setAvgHr(results);  // 상태를 한 번에 업데이트
        };
    
        fetchWeatherData();
      },[dateValue])
     
    return (
        <>
         <div style={{width:'800px',height:'auto',position:'relative'}}>
            <Title>일조량 평균값</Title>
         <DateRangePicker
            value={dateValue}
            onValueChange={setDateValue}
            locale={ko}
            selectPlaceholder='선택하세요'
            >
        </DateRangePicker>
            <h2 style={{position:'absolute',top:'5px',right:'40px'}}>단위:시간</h2>
         <img src="/koreamap.png" 
        style={{width:'800px',height:'800px'}}/>
           
           
            {regionNames.map((regionName, index) => (
                <Button key={index} className={`region${index + 1}`} onClick={() => handleClick(regionName)}>
                    {avgHr[index] ? (
                        <Text className="text">
                            {regionName}
                            <br />
                            {`${avgHr[index]}`} 
                        </Text>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Button>
            ))}
        </div>
        </>
    )
}

export default Hr;