const { generateResultCreatePortfolio,calculateGeneralPortofolio } = require('./calculation.js')
const { html } = require('./Charts/Charts.js')


/**
 * @param {Number} returnValue
 * @param {Boolean} isRetirement
 * @param {Number} initialSavingAmount
 * @param {Number} age
*/




export const getGoals = ()=>{
  return 'goalsssddddd'
}

/**
     * @function calculateGoal
     * @params  returnValue  = persen return value.
     * @params  inflation    = persen inflasi (default 5%).
     * @params target = target value
     * @return {Object}   Kalkulasi Goal
     * * 
 */

export const calculateGoal = (data)=>{
  
  // returnValue => risk profile return 
  // isRetirement, => bool
  // initialSavingAmount,
  // age,
  // retireAt,
  // income,
  // monthlySpending,
  // monthlySaving,
  // goalAmount,
  // savingDurationInMonth,
  // LIFE_RATIO,
  // generateMonthly = true,
  // goalChart = [],
  // invested = 0,
  // currentPLValue = 0,
  // isFromCreatePortfolio = true,
  // goalCreatedAt = null,
  // goalInvestmentValue = 0,
  
  
  return calculateGeneralPortofolio(data);
}

export const calculateRetirement = (data)=>{
  
  // returnValue => risk profile return 
  // isRetirement, => bool
  // initialSavingAmount,
  // age,
  // retireAt,
  // income,
  // monthlySpending,
  // monthlySaving,
  // goalAmount,
  // savingDurationInMonth,
  // LIFE_RATIO,
  // generateMonthly = true,
  // goalChart = [],
  // invested = 0,
  // currentPLValue = 0,
  // isFromCreatePortfolio = true,
  // goalCreatedAt = null,
  // goalInvestmentValue = 0,
  data.isRetirement=true;
  return generateResultCreatePortfolio(data);
}

export const calculateEducation = (data)=>{
  return generateResultCreatePortfolio(data);
}

export const generateChart=({series,chartOptions,type='1D',categories,title})=>{
  // console.log(series)
  return html(series,categories,chartOptions?chartOptions:false,type,title)
}

export const generateWebChart=({series,chartOptions,type='bar'})=>{
  return html(series,chartOptions?chartOptions:false,type)
}

