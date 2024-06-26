import React from "react";
import { useState } from "react";
import { Select , SelectItem,Card, Title, TextInput ,Grid ,Text, Metric ,Button} from "@tremor/react";


function Calculator  () {
    
    //설치 종류
    const [I_value, setI_value] = useState("");
   
    //설비 용량
    
    const [capacity, setCapacity] = useState('');

    //체결가격
    const [contract_p, setcontract_p] = useState('')
    //총매출
    const [totalrevenues, setTotalrevenues] = useState('')

    //실제수익
    const [realreturn, setRealreturn] = useState('')

    const handleInputChange_C = (e) => {
        setCapacity(e.target.value);
      };

    

    const handleCheckInput_C = ()=>{
        if(I_value===''){
          alert('설치유형을 선택해주세요')
          return;
        }
        if(capacity===''){alert('설비용량을 입력해주세요')
          return;}
        let c_result;
        if(I_value === "1"){
          if(capacity<100){
            c_result = 1.2;
          }
          else if(100<=capacity<3000){
              c_result = ((1.2*99.999 +(capacity-99.999)*1.0)/capacity).toFixed(3);
          }
          else if(capacity>=3000){
              c_result = ((1.2*99.999)/capacity)+((2900.001*1.0)/capacity) +((capacity-3000)*0.7/capacity);
          }
        }else if(I_value === "2"){
          if(capacity <=3000) c_result = 1.5;
          else {
              c_result = ((3000*1.5+(capacity-3000))/capacity).toFixed(4);
          }
      }else if(I_value === "3"){
        if(capacity<100){
          c_result= 1.6
        }
        else if(100<=capacity<3000){
          c_result = 1.4}
        else {c_result = 1.2
          }
      }else if(I_value === "4"){
        c_result = 0.5;
      }
      setC_result(c_result)
       
    }

    //전력생산량
    const [e_output, setE_output] = useState(''); //생산량
    const [nextREC, setNextREC] = useState('');//이월 rec

    const handleInputChange_E = (e) => {
      
      setE_output(e.target.value);
      };
    const handleInputChange_R= (e) =>{
     
      setNextREC(e.target.value);
    }
    const handleInputChange_p=(e)=>{
      
      setcontract_p(e.target.value);
    }

    const [r_result, setR_result] = useState(''); //rec발급량
    const [n_result, setN_result] = useState(''); //이월된 양
    const [comm_result, setComm_result] = useState(''); //수수료

    const handleCheckInput_E = ()=>{ //rec발급량
      if(e_output===''){
        alert('전력생산량을 입력해주세요')
        return;
      }else if(e_output<=0){
        alert('다시 입력해주세요')
        return;
      }
      if(nextREC===''){
        alert('이월된 REC을 입력해주세요')
        return;
      }
      
        const result_r = (c_result * e_output)/1000; //단순결과
        const result_n = parseFloat(nextREC); // 이월된 rec float
        const resultAsNumber = parseFloat(result_r); // 계산한 float로 변환
        const result_end = result_n + resultAsNumber;
        const resultFloor = Math.floor(result_end); //정수부분만 
        const resultN = result_end - resultFloor; //이월된 양
       


        setR_result(resultFloor.toFixed());
        setN_result(resultN.toFixed(1));
    }
    const handleCheckInput_P = () =>{
      if(contract_p===''){
        alert('체결가격을 입력해주세요')
        return;
      }else if(contract_p<=0){
        alert('다시 입력해주세요')
        return;
      }
      setTotalrevenues(contract_p*r_result);
      setRealreturn(contract_p*r_result-comm_result);
      setComm_result(parseInt(r_result)*50)
    }
    
    


      //가중치 결과
      const [c_result, setC_result] = useState('');


    

    return(
        <main>
            <Title>REC Calculator</Title>
            
            <Grid numItemsMd={2} className="mt-6 gap-6">
        <Card>
          <div className="h-60">  
          <Title>태양광 REC가중치 계산기</Title>
          <Select value={I_value} onValueChange={(newValue)=> setI_value(newValue)} placeholder="설치 유형을 선택하세요">
                <SelectItem value="1">
                일반부지
                </SelectItem>
                <SelectItem value="2">
                건축물등 기존시설물 이용
                </SelectItem>
                <SelectItem value="3">
                유지 등 수면에 부유
                </SelectItem>
                <SelectItem value="4">
                    임야
                </SelectItem>
            </Select>
            <div className="Flex">
                    <TextInput 
                    type="text"
                    value={capacity}
                    onChange={handleInputChange_C}
                    placeholder="설비용량을 입력해주세요"/>
                    <div className="flex">
                    <Button onClick={handleCheckInput_C}>확인</Button>
                    <Text className="absolute  right-7"> 단위:kw</Text>
                    </div>
                    <div style={{position:'flex'}}>
                        <Metric>가중치 : </Metric>
                        <Text>{c_result}</Text>
                    </div>
                 </div>
          </div>
        </Card>
        <Card>
          <div className="h-60">
          <Title>REC발급수수료</Title>
          <Text>{comm_result}원</Text>
          </div>
        </Card>
        <Card>
          <div className="h-60" >
            <Title>REC발급량</Title>
            <div>
                <TextInput
                type="text"
                value={e_output}
                onChange={handleInputChange_E}
                placeholder="전력생산량을 입력하세요 :단위kwh"/>
                <TextInput
                type="text"
                value={nextREC}
                onChange={handleInputChange_R}
                placeholder="이월된 REC입력하세요"/>
                <Button onClick={handleCheckInput_E}>REC발급량 계산</Button>
                <Metric>REC발급량 : </Metric>
                <Text>{r_result}</Text>
                <Metric>이월된 REC발급량</Metric>
                <Text>{n_result}</Text>
            </div>
          </div>
        </Card>
        <Card>
          <div className="h-60">
            <Title>총REC매출</Title>
            <TextInput
            type="integer"
            value={contract_p}
            onChange={handleInputChange_p}
            placeholder="REC 체결가격을 입력하세요"/>
            <Button onClick={handleCheckInput_P}>확인</Button>
            <div style={{position:'flex'}}>
              <Metric>총매출 : </Metric>
              <Text>{totalrevenues}원</Text>
            </div>
            <div style={{position:'flex'}}>
              <Metric>실제수익 : </Metric>
              <Text>{realreturn}원</Text>
            </div>
          </div>
        </Card>
        
      </Grid>
        </main>
    )
    
}

export default Calculator;