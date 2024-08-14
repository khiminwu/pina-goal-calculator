import { generateResultCreatePortfolio, fv,pv,nper,calculatePMT,monthlyPMT } from './calculation.js'
import { html } from './Charts/Charts.js';


/**
 * @param {Number} returnValue
 * @param {Boolean} isRetirement
 * @param {Number} initialSavingAmount
 * @param {Number} age
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
  data.isRetirement=false;
  return generateResultCreatePortfolio(data);
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
  // console.log(data)
  data.isRetirement=true;
  return generateResultCreatePortfolio(data);
}

export const calculateEducation = (data)=>{
  return generateResultCreatePortfolio(data);
}

export const generateChart=({series,chartOptions,type='bar'})=>{
  return html(series,chartOptions?chartOptions:false,type)
}

export const calculateFV = ({ rate, nper, pmt, pv, type }) => {
  return fv(rate, nper, pmt, pv, type)
}

export const calculatePV = ({ rate, nper, pmt, fv, type }) => {
  return pv(rate, nper, pmt, fv, type)
}

export const calculateNPER = ({ rate, per, pmt, pv, fv }) => {
  return nper(rate, per, pmt, pv, fv)
}

export const PMT = ({ initial, monthly,annual_rate,total_month,addInitial = false }) => {
  return calculatePMT(initial, monthly, annual_rate, total_month, addInitial)
}

export const PMTMonthly = ({ ir, np, pv, fv = 0, type = 0 }) => {
  return monthlyPMT(ir, np, pv, fv = 0, type = 0)
}

