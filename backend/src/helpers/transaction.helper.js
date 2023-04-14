import { getOneAtmDetail } from "../controllers/atmDetail.controller";

let denominations = [  
  /*
    { value: 100, count: 101 },  
    { value: 50, count: 101 },  
    { value: 20, count: 101 },  
    { value: 10, count: 101 },
*/  ];

let denominationsCopy = [  /*
    { value: 100, count: 0 },  
    { value: 50, count: 0 },  
    { value: 20, count: 0 },  
    { value: 10, count: 0 },
    */];

const percentages = [0.6, 0.3, 0.1, 0.1];

let result = [];
let remainder = 0;
let sum = 0;

const init = async (id) =>{
    result = [];
    remainder = 0;
    sum = 0;
    const valor = [100,50,20,10] 
    const atmDetail = await getOneAtmDetail(id) 
    denominations[0] = {value:100, count: atmDetail.hundred}
    denominations[1] = {value:50, count: atmDetail.fifty}
    denominations[2] = {value:20, count: atmDetail.twenty}
    denominations[3] = {value:10, count: atmDetail.ten}
}

const calculateRemainder = (amount) => {
  for (let i = 0; i < denominations.length; i++) {
    const denomination = denominations[i];
    const maxCount = Math.min(
      Math.floor(remainder / denomination.value),
      denomination.count
    );
    if (result[i]) {
      result[i].count += maxCount;
    } else {
      result.push({ value: denomination.value, count: maxCount });
    }
    remainder -= maxCount * denomination.value;
    denominations[i].count -= maxCount;
  }
   //console.log("sobrante",amount, result)
};

const calculateRemainders = async (amount, id) => {
    await init(id);  ///otro llamado a la db
    for (let i = 0; i < denominations.length; i++) {
        const denomination = denominations[i];
         if(denomination.count*denomination.value>=remainder){
            const maxCount = Math.min( Math.floor(remainder / denomination.value), denomination.count );
           
            result.push({ value: denomination.value, count: maxCount });
        
            remainder -= maxCount * denomination.value;
            denominations[i].count -= maxCount;
             
         }else{
               result.push({ value: denomination.value, count: 0 });
         }
    } 
    
    if(remainders !==0){
      return []
    }
    return results
};

const getMoney = async (amount, id) => {
  await init(id)

  if (amount % 10 !== 0) {
    return "No se puede retirar la cantidad exacta";
  }

  if (amount <= 100) {
    percentages[0] = 0.5;
    percentages[1] = 0.3;
    percentages[2] = 0.2;
    percentages[3] = 0.1;
  }
    
  for (let i = 0; i < denominations.length; i++) {
    if (denominations[i].count <= 100) {
      if (denominationsCopy[i].count === 0) {
        denominationsCopy[i].count = denominations[i].count;
      }
      denominations[i].count = 0;
    }

    let val = amount * percentages[i];

    if (i !== denominations.length - 1) {
      if (val <= denominations[i].value * denominations[i].count && sum < amount) {
        const carry = val - Math.floor(val / denominations[i].value) * denominations[i].value;
        val -= carry;
        sum += denominations[i].value * (val / denominations[i].value);
        remainder += carry;
        denominations[i].count -= val / denominations[i].value;
        result.push({ value: denominations[i].value, count: val / denominations[i].value });
      } else {
        sum += denominations[i].value * (val / denominations[i].value);
        denominations[i].count -= val / denominations[i].value;
        result.push({ value: denominations[i].value, count: val / denominations[i].value });
      }
    } else {
      calculateRemainder(remainder);
    }
  }

  if (remainder !== 0) {
      const rem = await calculateRemainders(amount, id)
       
      if(rem.legth>0){
        return rem 
      }
      return "No se puede retirar la cantidad exacta"; 
  }
  
  console.log("denomination\n", denominations, denominationsCopy)    
  return result;
};

console.log(getMoney(1000));