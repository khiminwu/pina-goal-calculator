import { calculateGoal, calculateRetirement, calculateFV, calculatePV, PMT,PMTMonthly } from '../index.js'

var data = {
  "returnValue": 5.75,
  "isRetirement": false,
  "initialSavingAmount": 0,
  "age": 0,
  "retireAt": 0,
  "income": 0,
  "monthlySpending": 0,
  "monthlySaving": 0,
  "goalAmount": 105000000,
  "savingDurationInMonth": 12,
  "LIFE_RATIO": 0,
  "generateMonthly": true
}


const calcRetirement = calculateRetirement(data)
delete calcRetirement.datasetProjection
delete calcRetirement.datasetTarget
delete calcRetirement.datasetActual

const calculate = calculateGoal(data)
console.log(calculate,'calculate')

var future = calculateFV({
    rate: 6 / 100, 
    nper:10, 
    pmt:-360000000, 
    pv:0, 
    type:0
})
// console.log('FV : '+future)

// var present = calculatePV({
//     rate: 10 / 100, 
//     nper:3, 
//     pmt:0, 
//     fv:-2000000, 
//     type:0
// })
// console.log(present)



// rate, nper, pmt, pv, type



const monthly = PMTMonthly({
    ir:(5.67/100), 
    np:3, 
    pv:10122722,
    fv:0
    
})

// console.log('monthly : '+monthly)

// const generatePMT = PMT({
//     initial:0,
//     monthly:parseFloat(monthly), 
//     annual_rate:(16.33/100), 
//     total_month:360
//     });



// console.log(generatePMT[generatePMT.length-1])
// console.log('monthly = ',monthly)