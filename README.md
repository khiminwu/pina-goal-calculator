# Pina Goal Chart

## Features
- Calculate Chart
- Get Risk Profile (Future)
- Generate Chart (Future)
- Render Chart (Future)

## Installation

```sh
npm i @pinaid/pina-goal-calculator
```

## How to use
```sh
import {calculateGoal} from @pinaid/pina-goal-calculator;
```

## Available Functions Example
### Calculate Goal
```sh
var calculation = calculateGoal({
  returnValue: 15.46, //from risk profile
  isRetirement: false,
  initialSavingAmount: 0,
  age: 22,
  retireAt: 60,
  income: 2500000,
  monthlySpending: 2250000,
  monthlySaving: 0,
  goalAmount: 0,
  savingDurationInMonth: 0,
  LIFE_RATIO: 70,
  generateMonthly: true,
  inflationRate:5 [Optional]
})
```

### Calculate Goal Retirement
```sh
var calculation = calculateGoal({
  returnValue: 15.46,
  isRetirement: true,
  initialSavingAmount: 0,
  age: 22,
  retireAt: 60,
  income: 2500000,
  monthlySpending: 2250000,
  monthlySaving: 0,
  goalAmount: 0,
  savingDurationInMonth: 0,
  LIFE_RATIO: 70,
  generateMonthly: true,
  inflationRate:5 [Optional]
})
```

### Calculate FV
The FV function is a financial function that returns the future value of an investment

**rate** = The interest rate per period.<br>
**nper** = The total number of payment periods.<br>
**pmt** = The payment made each period. Must be entered as a negative number.<br>
**pv** = [optional] The present value of future payments. If omitted, assumed to be zero. Must be entered as a negative number.<br>
**type** = [optional] When payments are due. 0 = end of period, 1 = beginning of period. Default is 0.

```sh
var calculation = calculateFV({
  rate: 5 / 100, 
  nper:1, 
  pmt:0, 
  pv:-10000000, 
  type:0
})
```

### Calculate PV
The PV function is a financial function that returns the present value of an investment

**rate** = The interest rate per period.<br>
**nper** = The total number of payment periods.<br>
**pmt** = The payment made each period. Must be entered as a negative number.<br>
**FV** = [optional] The future value.<br>
**type** = [optional] When payments are due. 0 = end of period, 1 = beginning of period. Default is 0.

```sh
var calculation = calculatePV({
  rate: 5 / 100, 
  nper:1, 
  pmt:0, 
  pv:-10000000, 
  type:0
})
```

### Calculate PMT
The PMT function is a financial function that returns the periodic payment for a loan

**initial** = The initial value.<br>
**monthly** = The payment made each period.<br>
**annual_rate** = The interest rate annualy.<br>
**total_month** = The total number of payment periods.<br>


```sh
const calculation = PMT({
    initial:0,
    monthly:2000000, 
    annual_rate:0.1, 
    total_month:12
});
```


### Goal Chart 
```sh
var chart = Charts({
    series: [{
    data: [700, 200, 300, 400, 500, 600, 700, 800, 900, 1380]
    }],
    type:'line'
})


on render area

return (
...
<WebView originWhitelist={["*"]} source={{ html: chart }}/>
...
)

```




