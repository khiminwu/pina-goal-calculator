import {cloneDeep, isEmpty, parseInt} from 'lodash';
import moment from 'moment';
import constans from './constans';
import {addMonths, formatRupiah} from './helper';

export function generateChartData(
  array = [],
  setMaxY,
  isRetirement = false,
  age = 0,
  title = 'Nilai',
  date = null,
) {
  if (isEmpty(array)) return [];

  let tempMaxY = 0;
  const alreadyZero = false;

  const result = array.map((item, index) => {
    const val = parseInt(
      item.value || item.investment_net || item.initial + item.saving,
    );

    if (tempMaxY < val) tempMaxY = val;
    // if (val <= 0) alreadyZero = true;
    const value = val > 0 && !alreadyZero ? val : 0;
    return {
      x: isRetirement ? age + index : index,
      y: value,
      label: isRetirement ? age + index : index,
      value,
      tooltext: `${
        date
          ? `<center>${addMonths(date, isRetirement ? (index * 12) : index).format('D MMM YYYY')}</center>`
          : ''
      }${title}: ${formatRupiah(value, value > 1000000 ? 2 : 0)}`,
      date: date ? addMonths(date, isRetirement ? (index * 12) : index).format('YYYY-MM-DD') : null,
    };
  });

  if (setMaxY) {
    setMaxY(tempMaxY);
  }

  return result;
}

export function monthlyPMT(ir, np, pv, fv = 0, type = 0) {
  /*
   * ir   - interest rate per year
   * np   - number of periods (month)
   * pv   - present value
   * fv   - future value
   * type - when the payments are due:
   *        0: end of the period, e.g. end of month (default)
   *        1: beginning of period
   */
  // fv = typeof fv !== 'undefined' ? fv : 0;
  // type = typeof type !== 'undefined' ? type : 0;

  console.log({
    ir,
    np,
    pv,
    fv,
    type,
  });

  let result = 0;

  if (ir > 0) {
    // Interest rate exists
    const rate = Math.pow(1 + ir, 1 / 12) - 1;
    const q = Math.pow(1 + rate, np);
    // console.log('pmt rate',rate,q)
    result = (rate * (fv + q * pv)) / ((-1 + q) * (1 + rate * type));
  } else if (np > 0) {
    // No interest rate, but number of payments exists
    result = (fv + pv) / np;
  }

  // console.log({result});

  return parseInt(result);
}

export function calculatePMT(
  initial,
  monthly,
  annual_rate,
  total_month,
  addInitial = false,
) {
  const monthly_rate = Math.pow(1 + annual_rate, 1 / 12) - 1;
  // console.log('aaaaaaaaa calculatePMT');
  // console.log({
  //   initial, monthly, annual_rate, total_month, monthly_rate,
  // });

  const arr = [];
  for (let i = 0; i < total_month; i++) {
    let start_initial = initial;
    const monthly_value = Array.isArray(monthly) ? monthly[i] : monthly;
    // console.log({'aaaaaaa monthly_value': monthly_value});
    let start_saving = monthly_value;

    let saving_mo = 0;

    let saving = 0;

    if (i > 0) {
      start_initial = arr[i - 1].initial;
      if (i > 1) start_saving = arr[i - 1].saving;
      // if (!Array.isArray(monthly) && i > 1) start_saving = arr[i - 1].saving;
    }

    saving = start_saving * monthly_rate;
    saving_mo = start_saving
      + saving
      + (i > 0 ? monthly_value + monthly_value * monthly_rate : 0);

    if (addInitial && i === 0) saving_mo += initial;
    // console.log(saving_mo)
    // console.log({'aaaaaaa saving_mo': saving_mo});
    const interest = start_initial * monthly_rate;
    // console.log({'aaaaaaa interest': interest});
    // interest = interest.replace(/\./g,'')
    // // console.log(interest)
    // console.log({'aaaaaaa start_initial': start_initial});
    arr.push({
      initial: start_initial + interest,
      // saving: parseInt(saving_mo == 0 && i > 0 ? arr[i - 1].saving : saving_mo),
      saving: saving_mo == 0 && i > 0 ? arr[i - 1].saving : saving_mo,
    });
    // console.log(interest)
  }
  // console.log({'aaaaaaa arr': arr});
  // console.log(arr);
  return arr;
}

export function calculateRetirementPMT(
  initial, // initial uang
  age, // umur
  year_periode, // retire_at - age?
  monthly_income, // monthly income
  return_rate, // risk profile?
  monthly_expense, // monthly usage
  saving_plan_perc, // percentage from monthly income
  life_ratio = constans.LIFE_RATIO,
  retirement_return_rate = constans.RETIREMENT_RETURN_RATE,
  inflation_rate = constans.INFLATION_RATE,
  bpjs_rate = constans.BPJS_RATE,
  isFromCreatePortfolio = false,
  monthlySpendingFuture = 0,
) {
  // age: 29
  // bpjs_rate: 8
  // ​expense: 5000000
  // ​inflation_rate: 4
  // ​initial: 20000000
  // ​investment_rate: 15
  // ​life_ratio: 72
  // ​monthly_income: 10000000
  // ​return_rate: 9.17
  // ​saving_plan_perc: 30
  // ​saving_rate: 0
  // ​year_periode: 21

  // life_ratio +=1;

  // age = 35;
  // monthly_income = 10000000;
  // saving_plan_perc = 30;

  // console.log({
  //   initial,
  //   age,
  //   year_periode,
  //   monthly_income,
  //   return_rate,
  //   life_ratio,
  //   retirement_return_rate,
  //   inflation_rate,
  //   saving_plan_perc,
  // });

  const total_year_retirement = life_ratio - age - year_periode;
  const yearly_income = monthly_income * 12;
  const monthly_rate = (1 + parseFloat(return_rate) / 100) ** (1 / 12) - 1;
  const actual_arr = [];
  const target_arr = [];
  const actual_without_interest = [];

  let actual_total_value = 0;
  let total_bpjs = 0;

  let target_retirement_expense = fv(
    inflation_rate / 100,
    year_periode,
    0,
    monthly_expense * -12,
  );

  if (monthlySpendingFuture) {
    target_retirement_expense = monthlySpendingFuture;
  }

  const target_retirement_rate = (1 + retirement_return_rate / 100) / (1 + inflation_rate / 100) - 1;
  const target_duration = life_ratio - age - year_periode;

  let target_total_value = pv(
    target_retirement_rate,
    target_duration,
    target_retirement_expense / (1 + inflation_rate / 100),
    0,
    1,
  );
  target_total_value = Math.abs(target_total_value);

  const yearly_bpjs = (bpjs_rate / 100) * yearly_income;
  total_bpjs = Math.abs(
    fv(parseFloat(return_rate) / 100, year_periode, 0, yearly_bpjs, 0),
  ); // temp not used
  const yearly_contribution = yearly_income * (saving_plan_perc / 100);
  // yearly_bpjs????
  let initial_fv = fv(
    parseFloat(return_rate) / 100,
    year_periode,
    0,
    initial,
    0,
  );
  initial_fv = Math.abs(initial_fv);
  // console.log('initial_fv',parseFloat(return_rate) / 100,year_periode,initial,initial_fv)
  const calc = (Math.pow(1 + inflation_rate / 100, year_periode)
    - Math.pow(1 + return_rate / 100, year_periode))
    / (inflation_rate / 100 - return_rate / 100);

  const value_current_contribution = yearly_contribution * calc;

  const shortfall = target_total_value - initial_fv - value_current_contribution;

  const suggested_nper = nper(
    retirement_return_rate / 100,
    inflation_rate / 100,
    (target_retirement_expense / (1 + inflation_rate / 100)) * -1,
    target_total_value - shortfall,
    0,
  );

  const suggested_saving = shortfall / calc;
  const suggested_saving_perc = ((suggested_saving + yearly_contribution) / yearly_income) * 100;

  let income = yearly_income;

  let expense = parseFloat(target_retirement_expense);

  // console.log(parseFloat(suggested_nper),suggested_saving,suggested_saving_perc)
  for (let i = 0; i <= year_periode + total_year_retirement; i++) {
    let investment_net = 0;
    let annual_contribution = 0;
    let target_contribution = 0;
    let target_investment_net = 0;

    let investment_actual = 0;

    if (i <= year_periode) {
      if (initial && initial > 0) {
        target_investment_net = investment_net = investment_actual = initial;
      }
      if (i > 0) {
        if (i > 1) income += income * (inflation_rate / 100);

        const bpjs = income * 0.057;
        // console.log(bpjs)
        // actual
        annual_contribution = income * ((isFromCreatePortfolio ? suggested_saving_perc : saving_plan_perc) / 100);
        let interest = fv(
          parseFloat(return_rate) / 100,
          1,
          annual_contribution,
          actual_arr[i - 1].investment_net,
        );
        interest = Math.abs(interest)
          - (actual_arr[i - 1].investment_net + annual_contribution);

        investment_net = actual_arr[i - 1].investment_net + annual_contribution + interest;
        investment_actual = actual_without_interest[i - 1].investment_net + annual_contribution;

        // target
        target_contribution = income * (suggested_saving_perc / 100);
        let target_interest = fv(
          parseFloat(return_rate) / 100,
          1,
          target_contribution,
          target_arr[i - 1].investment_net,
        );
        target_interest = Math.abs(target_interest)
          - (target_arr[i - 1].investment_net + target_contribution);

        target_investment_net = target_arr[i - 1].investment_net
          + target_contribution
          + target_interest;

        if (i == year_periode) {
          // target_investment_net += total_bpjs;
          // investment_net += total_bpjs;
          actual_total_value = investment_net;
        }
        // console.log(expense)
        // let interest =
        // console.log(parseFloat(return_rate)/100,1,-(annual_contribution),-(actual_arr[i-1].investment_net))
      }
      // console.log(i,income,annual_contribution,interest,investment_net)
    } else {
      const key = i - year_periode;
      if (key > 0) expense += expense * (inflation_rate / 100);

      let interest = fv(0.05, 1, 0, actual_arr[i - 1].investment_net);
      interest = Math.abs(interest) - actual_arr[i - 1].investment_net;
      investment_net = actual_arr[i - 1].investment_net + interest - expense;

      investment_actual = actual_without_interest[i - 1].investment_net - expense;

      let target_interest = fv(0.05, 1, 0, target_arr[i - 1].investment_net);
      target_interest = Math.abs(target_interest) - target_arr[i - 1].investment_net;
      target_investment_net = target_arr[i - 1].investment_net + target_interest - expense;
      // console.log(expense)
    }

    // if (!isNaN(investment_net)) {
    actual_arr.push({
      investment_net,
    });
    // }
    actual_without_interest.push({
      investment_net: investment_actual,
    });

    // if (!isNaN(target_investment_net)) {
    target_arr.push({
      investment_net: target_investment_net,
    });
    // }
  }

  const result = {
    suggested: {
      year_to_payout: parseFloat(suggested_nper),
      saving: suggested_saving / 12,
      saving_perc: suggested_saving_perc,
    },
    shortfall,
    total_value: {
      actual: actual_total_value,
      target: target_total_value,
    },
    actual: actual_arr,
    target: target_arr,
    actual_without_interest,
    monthlySpendingFuture: target_retirement_expense,
  };

  console.log('result: ', result);
  console.log('actual_without_interest: ', actual_without_interest);

  return result;
}



export function nper(rate, per, pmt, pv, fv) {
  // console.log(rate,per,pmt,pv,fv)
  fv = parseFloat(fv);
  pmt = parseFloat(pmt);
  pv = parseFloat(pv);
  per = parseFloat(per);

  let nper_value = 0;
  if (per == 0 || pmt == 0) {
    alert('Why do you want to test me with zeros?');
    return 0;
  }

  rate = eval(rate / (per * 100));
  // console.log(rate)
  if (rate == 0) {
    // Interest rate is 0
    nper_value = -(fv + pv) / pmt;
  } else {
    nper_value = Math.log((-fv * rate + pmt) / (pmt + rate * pv)) / Math.log(1 + rate);
  }

  nper_value = conv_number(nper_value, 2);

  return nper_value;
}

export function pv(rate, nper, pmt, fv, type) {
  rate = parseFloat(rate);
  nper = parseFloat(nper);
  pmt = parseFloat(pmt);
  fv = parseFloat(fv);
  type = typeof type !== 'undefined' ? type : 0;
  // console.log('pv',type)
  if (nper == 0) {
    // alert("Why do you want to test me with zeros?");
    return 0;
  }
  let pv_value = 0;
  if (rate == 0) {
    // Interest rate is 0
    pv_value = -(fv + pmt * nper);
  } else {
    pv_value = (((1 - Math.pow(1 + rate, nper)) / rate) * pmt * (1 + rate * type) - fv)
      / Math.pow(1 + rate, nper);
    // console.log(pv_value)
  }
  pv_value = conv_number(pv_value, 2);
  return pv_value;
}

export function fv(rate, nper, pmt, pv, type) {
  rate = parseFloat(rate);
  nper = parseFloat(nper);
  pmt = parseFloat(pmt);
  pv = parseFloat(pv);
  type = typeof type !== 'undefined' ? type : 0;
  if (nper == 0) {
    // alert("Why do you want to test me with zeros?");
    return 0;
  }
  let fv_value = 0;
  if (rate == 0) {
    // Interest rate is 0
    fv_value = -(pv + pmt * nper);
  } else {
    const x = Math.pow(1 + rate, nper);
    // fv_value = - ( -pmt + x * pmt + rate * x * pv ) /rate;
    fv_value = (pmt * (1 + rate * type) * (1 - x)) / rate - pv * x;
  }
  fv_value = conv_number(fv_value, 2);
  return fv_value;
}

function conv_number(expr, decplaces) {
  let str = `${Math.round(eval(expr) * Math.pow(10, decplaces))}`;
  while (str.length <= decplaces) {
    str = `0${str}`;
  }

  const decpoint = str.length - decplaces;
  return `${str.substring(0, decpoint)}.${str.substring(decpoint, str.length)}`;
}
export function truncate(text, textLength) {
  if (text.length > textLength) {
    return `${text.substring(0, textLength)}...`;
  }
  return text;
}

export function NPER(rate, payment, present, future, type) {
  // Initialize type
  type = (typeof type === 'undefined') ? 0 : type;

  // Initialize future value
  future = (typeof future === 'undefined') ? 0 : future;

  // Return number of periods
  const num = payment * (1 + rate * type) - future * rate;
  const den = (present * rate + payment * (1 + rate * type));
  return Math.log(num / den) / Math.log(1 + rate);
}

export const generateResultCreatePortfolio = ({
  returnValue,
  isRetirement,
  initialSavingAmount,
  age,
  retireAt,
  income,
  monthlySpending,
  monthlySaving,
  goalAmount,
  savingDurationInMonth,
  LIFE_RATIO,
  generateMonthly = true,
  goalChart = [],
  invested = 0,
  currentPLValue = 0,
  isFromCreatePortfolio = true,
  goalCreatedAt = null,
  goalInvestmentValue = 0,
  fundingValue = 0,
  monthlySpendingFuture = 0,
}) => {
  const interestRate = parseFloat(returnValue || 5);

  let actualInvestValue = [];
  let datasetActual = [];
  let temporaryGoalAmount = cloneDeep(goalAmount);
  let totalInvestRetirement = 0;
  let totalInvest = 0;
  let targetTotalInvest = 0;
  let additionalTopup = 0;
  let suggestedSavingPerc = 0;
  let datasetProjection = [];
  let datasetTarget = [];
  let temporaryMonthly = 0;
  let datasetGeneral = [];
  let historyGoal = [];
  let isOnTrack = true;
  let marginLeftToday = 0;
  let tempMonthlySpendingFuture = 0;

  if (isRetirement) {
    const retirementPlan = calculateRetirementPMT(
      initialSavingAmount + parseInt(goalInvestmentValue) + fundingValue,
      age,
      retireAt - age,
      income,
      interestRate,
      monthlySpending,
      (monthlySaving / income) * 100,
      LIFE_RATIO,
      constans.RETIREMENT_RETURN_RATE,
      constans.INFLATION_RATE,
      constans.BPJS_RATE,
      isFromCreatePortfolio,
      monthlySpendingFuture,
    );

    tempMonthlySpendingFuture = retirementPlan?.monthlySpendingFuture || 0;

    const totalActual = parseInt(retirementPlan?.total_value?.actual || 0);
    const totalTarget = parseInt(retirementPlan?.total_value?.target || 0);

    actualInvestValue = parseInt(
      retirementPlan?.actual_without_interest[
        retireAt - age
      ].investment_net,
    );

    isOnTrack = (((totalActual - totalTarget) / totalTarget) * 100 > constans.OFFSET_TOLERANCE_GOAL);

    if (goalAmount === 0 && isFromCreatePortfolio) {
      temporaryGoalAmount = totalTarget;
    }

    totalInvestRetirement = totalActual;
    targetTotalInvest = totalTarget;
    additionalTopup = isFromCreatePortfolio
      ? parseInt((retirementPlan?.suggested?.saving || 0) + monthlySaving)
      : parseInt(income * ((retirementPlan?.suggested?.saving_perc || 0) / 100));
    suggestedSavingPerc = retirementPlan?.suggested?.saving_perc || 0;

    datasetTarget = generateChartData(retirementPlan.target, null, true, age, 'Target', goalCreatedAt);
    datasetProjection = generateChartData(retirementPlan.actual, null, true, age, 'Proyeksi');

    if (isFromCreatePortfolio) {
      datasetActual = generateChartData(
        retirementPlan.actual,
        null,
        true,
        age,
        'Dana Pensiun',
        new Date(),
      );
    } else {
      let monthlySavings = [];
      if (!isEmpty(goalChart)) {
        monthlySavings = goalChart.map((g, index) => ({
          value:
            index === goalChart.length - 1
              ? parseInt(invested + currentPLValue)
              : g.value,
        }));
        historyGoal = monthlySavings;
      }

      datasetActual = generateChartData(
        [...monthlySavings, ...retirementPlan.actual.slice(monthlySavings.length)],
        null,
        true,
        age,
        'Proyeksi',
      );
    }
  } else {
    let monthly = generateMonthly ? monthlyPMT(
      interestRate / 100,
      savingDurationInMonth,
      0,
      isFromCreatePortfolio ? goalAmount - initialSavingAmount : goalAmount,
    ) : monthlySaving;

    temporaryMonthly = monthly;

    const monthlyGeneralPlan = monthlyPMT(
      interestRate / 100,
      savingDurationInMonth,
      0,
      goalAmount,
    );

    const generalPlan = calculatePMT(
      initialSavingAmount,
      monthlyGeneralPlan,
      interestRate / 100,
      savingDurationInMonth,
    );

    if (isFromCreatePortfolio) {
      const defaultPlan = calculatePMT(
        initialSavingAmount,
        monthly,
        0,
        savingDurationInMonth,
      );

      datasetActual = generateChartData(
        [
          { initial: 0, saving: 0 },
          ...defaultPlan,
        ],
        null,
        false,
        0,
        'Investment',
      );

      datasetGeneral = generateChartData(
        [
          { initial: 0, saving: 0 },
          ...generalPlan,
        ],
        null,
        false,
        0,
        'Return',
        moment(),
      );

      if (!generateMonthly) {
        temporaryGoalAmount = datasetGeneral[datasetGeneral.length - 1].value;
      }
    } else {
      const chartData = generateChartData(
        [
          { initial: 0, saving: 0 },
          ...generalPlan,
        ],
        null,
        null,
        null,
        'Target',
        goalCreatedAt,
      );
      totalInvest = chartData[chartData.length - 1]?.y || 0;
      datasetGeneral = chartData;

      let monthlySavings = [];
      if (!isEmpty(goalChart)) {
        monthlySavings = goalChart.map((g, index) => ({
          value:
            index === goalChart.length - 1
              ? parseInt(goalInvestmentValue)
              : g.value,
        }));

        historyGoal = monthlySavings;
      }

      if (fundingValue !== 0) {
        let tempValue = (monthlySavings?.[monthlySavings?.length - 1]?.value) + fundingValue;
        if (fundingValue < 0) {
          tempValue = invested - fundingValue;
        }
        monthlySavings.push({ value: tempValue });
      }

      const historyLength = monthlySavings.length - 1;

      if (historyLength > 0) {
        marginLeftToday = (historyLength / generalPlan.length) * (Metrics.screenWidth - s(40));
      }

      const investedValue = isEmpty(monthlySavings)
        ? initialSavingAmount
        : monthlySavings[historyLength].value;

      monthly = monthlyPMT(
        interestRate / 100,
        savingDurationInMonth - (historyLength),
        -investedValue,
        goalAmount,
      );

      if (generateMonthly) {
        temporaryMonthly = monthly;
      }

      const generalCurrentPlan = calculatePMT(
        investedValue,
        temporaryMonthly,
        interestRate / 100,
        savingDurationInMonth - (historyLength),
      );
      const defaultPlan = calculatePMT(
        0,
        monthly,
        0,
        savingDurationInMonth,
      );

      const datasetCurrentChart = generateChartData(
        [...monthlySavings, ...generalCurrentPlan],
        null,
        null,
        null,
        'Proyeksi',
      );

      datasetActual = generateChartData(
        [
          { initial: 0, saving: 0 },
          ...defaultPlan,
        ],
        null,
        false,
        0,
        'Investment',
      );

      isOnTrack = (((datasetCurrentChart?.[datasetCurrentChart.length - 1]?.y - goalAmount) / goalAmount) * 100) > constans.OFFSET_TOLERANCE_GOAL;
      additionalTopup = monthly > 0 ? monthly : 0;
      datasetProjection = datasetCurrentChart;
    }
  }

  return {
    actualInvestValue,
    datasetActual,
    temporaryGoalAmount,
    totalInvestRetirement,
    totalInvest,
    targetTotalInvest,
    additionalTopup,
    suggestedSavingPerc,
    datasetProjection,
    datasetTarget,
    temporaryMonthly,
    datasetGeneral,
    historyGoal,
    isOnTrack,
    marginLeftToday,
    monthlySpendingFuture: tempMonthlySpendingFuture,
  };
};

