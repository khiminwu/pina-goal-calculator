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
Calculate Goal
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
  generateMonthly: true
})
```

Calculate Goal Retirement
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
  generateMonthly: true
})
```


Goal Chart 
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




