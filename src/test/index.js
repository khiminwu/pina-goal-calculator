import { calculateGoal, calculateRetirement, calculateFV, calculatePV, PMT } from '../index.js'

// var data = {
//     returnValue:0,
//     initialSavingAmount:0,
//     age:30,
//     retireAt:60,
//     income:1000000,
//     monthlySpending:1000000,
//     monthlySaving:5000000,
//     goalAmount:10000000,
//     savingDurationInMonth:0,
//     LIFE_RATIO:73,
//     generateMonthly:false,
//     invested:0,
//     inflationRate:6,
//     currentPLValue:0,
//     isFromCreatePortfolio:true,
//     goalCreatedAt:null,
//     goalInvestmentValue:0,
//     isRetirement:true,
// }


// var future = calculatePV({
//     rate: 5 / 100, 
//     nper:1, 
//     pmt:0, 
//     fv:-10000000, 
//     type:0
// })

const generatePMT = PMT({
    initial:0,
    monthly:2000000, 
    annual_rate:0.1, 
    total_month:12
    });
console.log(generatePMT)