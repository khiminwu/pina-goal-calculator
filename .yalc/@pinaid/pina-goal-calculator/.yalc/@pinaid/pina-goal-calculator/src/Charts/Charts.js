import _ from 'lodash';

export class Template { }

// var http = require('http'),
//     fs = require('fs');

// var html_str = fs.readFile('./index.html', function (err, html) {
//     if (err) {
//         throw err; 
//     }       
//     return html;
    
// });
var apex = require('./apexchart.min.js')

export function html(series,categories, chartOptions,type) {
    // console.log(series)
    // console.log(categories)
    if(type=='1D'){

    }
    var new_series = [...series];
    new_series= new_series.filter(n => n)
    const min = new_series.reduce((a, b) => Math.min(a, b))
    const max = new_series.reduce((a, b) => Math.max(a, b))

    var reverseSeries = []
    _.each(series,(item,key)=>{
        if(item!=null){
            reverseSeries.push(null)
        }else{
            if(series[key-1]==null){
                reverseSeries.push(reverseSeries[key-1])
            }else{
                reverseSeries.push(series[key-1])
            }
            
        }
    })

    var allSeries = [{
                    "name": "Stock Series",
                    "type": "area",
                    "data": series
                }]

                if(type=='1D'){
                    allSeries.push({
                        "name": "Stock Series Null",
                        "data": reverseSeries
                    })
                }
    
    // console.log(new_series,min,max)
    const html = `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
        <meta http-equiv="x-ua-compatible" content="IE=edge">
        
        
        <script/ src="https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.29.0/apexcharts.min.js"
            integrity="sha512-fe6OklXva8AWoqdwgkE7Ni4uWgHGWxFQWZx4lYehzY2Qrst5YfogjAbnLd6egsoTrnjGI9/LYt1Ont2cKNbP2A=="
            crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        
        <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>

        <link href="https://fonts.cdnfonts.com/css/gotham-rounded?styles=36545,36544" rel="stylesheet">

        <style>
            body {
                margin: 0;
                overflow: hidden;
            }

            #stock-chart .apexcharts-text {
                fill: #9e9e9e;
            }

            #stock-chart .apexcharts-marker {
                transition: none;
            }

            #stock-chart .apexcharts-svg {
                overflow: visible;
            }

            #stock-chart .apexcharts-xaxis-tick {
                display: none;
            }

            #stock-chart .apexcharts-xaxis line {
                stroke: transparent;
            }

            #stock-chart .apexcharts-tooltip {
                display: none !important;
            }

            #stock-chart .apexcharts-xcrosshairs {
                stroke-dasharray: 2;
            }

            #stock-chart .apexcharts-yaxis-annotation-label {
                font-family: 'gotham rounded', sans-serif !important;
                font-size: 10px;
            }

            #stock-chart .apexcharts-point-annotations text {
                font-family: 'gotham rounded', sans-serif !important;
                fill: #88df2f !important;
                font-size: 8px;
            }

            #stock-chart .apexcharts-point-annotations .apexcharts-point-annotation-label-low {
                fill: #F16528 !important;
            }

            #stock-chart .apexcharts-point-annotations .apexcharts-point-annotation-label-neutral {
                fill: #D8D8D8 !important;
            }

            #stock-chart .apexcharts-point-annotations rect {
                fill: transparent;
            }

            #stock-chart .apexcharts-gridline {
                opacity: .7;
                fill: #E6EEEF;
            }

            #stock-chart .apexcharts-grid-borders line {
                opacity: .7;
                fill: #E6EEEF;
            }

            #stock-chart .apexcharts-xaxis-texts-g text {
                font-family: 'gotham rounded', sans-serif !important;
                font-size: 10px;
            }

            #stock-chart .apexcharts-xaxis-texts-g text:first-child {
                transform: translateX(20px);
            }

            #stock-chart .apexcharts-gridlines-vertical line:nth-child(4) {
                opacity: 0;
            }

            #stock-chart .apexcharts-gridlines-vertical line:first-child {
                opacity: 0;
            }

            #chart-1D .apexcharts-xaxis-texts-g {
                opacity: 0;
            }

            #custom-tooltip {
                position: absolute;
                top: 0;
                font-size: 10px;
                left: 0;
                opacity: 0;
                width: 100%;
                z-index: 20;
            }

            #tooltip-data {
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
                background: #FFF;
                padding: 0.3rem 0.6rem;
                text-align: center;
                border-radius: 4px;
                display: inline-block;
                font-family: 'gotham rounded', sans-serif !important;
                font-size: 10px;
            }
        </style>

        
    </head>

    <body>

        <div class="container-fluid">
            <div class="row">
                <div class="col-md-10" style="position: relative; overflow: hidden;">
                    <div id="custom-tooltip">
                        <span id="tooltip-data"
                            className="bg-white py-2 px-3 shadow-pina rounded-md inline-block text-center">
                            Rp* - DD MMM YYYY HH:MM
                        </span>
                    </div>
                    <div id="stock-chart"></div>
                </div>
            </div>
        </div>

        <script>

            function currency(
                _amount,
                _options = {
                    locale: "id-ID",
                    currency: "IDR",
                    currencyDisplay: "symbol",
                    currencySign: "standard",
                    minimumFractionDigits: 0,
                    // custom
                    removeSymbol: false,
                    removeSpaceAfterSymbol: false,
                    addDotAfterSymbol: false,
                },
            ) {
                const options = {
                    style: "currency",
                    locale: "id-ID",
                    currency: "IDR",
                    currencyDisplay: "symbol",
                    currencySign: "standard",
                    minimumFractionDigits: 0,
                    // custom
                    removeSymbol: false,
                    removeSpaceAfterSymbol: false,
                    addDotAfterSymbol: false,
                    ..._options,
                }

                let formatted = new Intl.NumberFormat(options.locale, options).format(_amount);

                if (options.addDotAfterSymbol) {
                    formatted = formatted.replace("Rp", "Rp.");
                }

                if (options.removeSpaceAfterSymbol) {
                    formatted = formatted.replace(/^Rp\s/, "Rp");
                    formatted = formatted.replace("Rp ", "Rp");
                }

                if (options.removeSymbol) {
                    formatted = formatted.replace(/^Rp\s/, "");
                    formatted = formatted.replace("Rp", "");
                }

                return formatted;
            }

            function resetTooltip() {
                const markers = document.querySelectorAll('.apexcharts-marker');
                const markEls = document.querySelectorAll("#stock-chart .apexcharts-series-markers-wrap");
                const elCrossHairs = document.querySelectorAll(".apexcharts-xcrosshairs");
                const ct = document.querySelector("#custom-tooltip");
                const cf = document.querySelector("#custom-filter");

                ct.style.opacity = 0;
                if (cf) {
                    cf.style.opacity = 1;
                    cf.classList.add('z-30');
                }
                elCrossHairs.forEach(el => { el.style.opacity = 0; });
                markEls.forEach((el) => { el.style.opacity = 0; });
                markers.forEach(elMarker => { elMarker.style.opacity = 0; });
            }

            const screenSize = window.innerWidth;
            const { series, categories, maxY, minY, annotations, colors, xAxisDateFormat, tooltipDateFormat } = {
                "series": ${JSON.stringify(allSeries)},
                "categories": ${JSON.stringify(categories)},
                "colors": [
                    "#F16528",
                    "#D8D8D8"
                ],
                "annotations": {
                    "position": "front",
                    "points": [{
                        "x": "14",
                        "y": ${min},
                        "label": {
                            "borderColor": "transparent",
                            "textAnchor": "end",
                            "offsetX": 15,
                            "offsetY": 20,
                            "text": "L: ${min}",
                            "style": {
                                "color": "#F16528",
                                "background": "transparent",
                                "cssClass": "apexcharts-point-annotation-label-low"
                            }
                        },
                        "marker": {
                            "size": 0
                        }
                    },
                    {
                        "x": "09",
                        "y": ${max},
                        "label": {
                            "borderColor": "transparent",
                            "textAnchor": "start",
                            "offsetX": 15,
                            "offsetY": 0,
                            "text": "H: ${max}",
                            "style": {
                                "color": "#F16528",
                                "background": "transparent",
                                "cssClass": "apexcharts-point-annotation-label-low"
                            }
                        },
                        "marker": {
                            "size": 0
                        }
                    }
                    ],
                    "yaxis": [{
                        "strokeDashArray": 4,
                        "borderColor": "#F16528",
                        "fillColor": "#F16528",
                        "width": "100%",
                        "label": {
                            "offsetX": 0,
                            "offsetY": 6,
                            "show": true,
                            "borderWidth": 0,
                            "position": "right",
                            "style": {
                                "color": "#F16528",
                                "background": "transparent",
                                "fontFamily": "gotham rounded",
                                "fontSize": "10px",
                                "cssClass": "apexcharts-point-annotation-label-low",
                                "padding": {
                                    "left": 2,
                                    "right": 2,
                                    "top": 4,
                                    "bottom": 2
                                }
                            }
                        }
                    }]
                },
                "maxY": ${max},
                "minY": ${min},
                "xAxisDateFormat": "HH:MM",
                "tooltipDateFormat": "DD MMM YYYY - HH:mm"
            };


            var options = {
                series: series,
                annotations: annotations,
                chart: {
                    toolbar: {
                        show: false,
                    },
                    sparkline: {
                        enabled: false,
                    },
                    type: "area",
                    height: 190,
                    zoom: {
                        enabled: false,
                    },
                    animations: {
                        enabled: true,
                        easing: "linear",
                        speed: 350,
                        animateGradually: {
                            enabled: false,
                            delay: 150,
                        },
                        dynamicAnimation: {
                            enabled: false,
                            speed: 350,
                        },
                    },
                    events: {
                        mouseLeave: () => { resetTooltip() },
                        mouseMove: (event) => { },
                        click: (e, chartContext, config) => { resetTooltip() },
                        mounted: () => { },
                        animationEnd: () => { },
                    },
                },
                colors: colors,
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    show: true,
                    dashArray: [0, 3],
                    width: 2,
                    curve: "smooth",
                },
                markers: {
                    size: 0,
                    colors: colors,
                    strokeColors: colors,
                    hover: {
                        strokeWidth: 2,
                        size: 4,
                    },
                },
                yaxis: {
                    show: true,
                    opposite: true,
                    tickAmount: 3,
                    min: minY,
                    max: maxY,
                    labels: {
                        show: categories?.length > 0,
                        offsetX: -4,
                        align: 'left',
                        style: {
                            colors: [],
                            fontSize: '10px',
                            fontFamily: 'gotham rounded, sans-serif',
                        },
                        formatter: (value) => {
                            return parseInt(value);
                        },
                    }
                },
                xaxis: {
                    categories: categories,
                    floating: false,
                    show: true,
                    showAlways: true,
                    tickPlacement: "on",
                    tickAmount: 2,
                    labels: {
                        show: true,
                        rotate: 0,
                        formatter: function (value) {
                            if (value) {
                                return dayjs(parseInt(value)).format(xAxisDateFormat);
                            }
                        },
                    },
                    tooltip: {
                        enabled: false,
                    },
                    axisTicks: {
                        show: true,
                    },
                },
                grid: {
                    show: true,
                    borderColor: "#E6EEEF",
                    strokeDashArray: 0,
                    position: "back",
                    yaxis: {
                        lines: {
                            show: true
                        }
                    },
                    xaxis: {
                        lines: {
                            show: true
                        }
                    },
                    padding: {
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0,
                    },
                },
                legend: {
                    show: false,
                },
                tooltip: {
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        const head = dayjs(parseInt(categories[dataPointIndex])).format(tooltipDateFormat);

                        let value = 'Data tidak tersedia';

                        if (series.length > 1 && series[1][dataPointIndex] && !series[0][dataPointIndex]) {
                            value = "Lunch Break";
                        } else if (series[0][dataPointIndex]) {
                            value = currency(series[0][dataPointIndex], {
                                removeSymbol: true,
                                removeSpaceAfterSymbol: false,
                            });
                        }

                        const markEls = document.querySelectorAll("#stock-chart .apexcharts-series-markers-wrap");
                        const elCrossHairs = document.querySelectorAll(".apexcharts-xcrosshairs");
                        const ct = document.querySelector("#custom-tooltip");
                        const ctd = document.querySelector("#tooltip-data");
                        const cf = document.querySelector("#custom-filter");
                        const ag = document.querySelector(".apexcharts-grid");

                        ctd.innerHTML = value + '<br/>' + head;
                        let widthTooltip = (ctd.getBoundingClientRect().width / 2);
                        let widthAg = ag.getBoundingClientRect().width;
                        let widthYg = screenSize - widthAg;
                        let widthChartArea = screenSize - widthYg;

                        let position = ((dataPointIndex / (categories.length - 1)) * widthChartArea - widthTooltip);
                        if (position <= 0) position = 5;
                        if (position >= widthChartArea - widthTooltip - 10) position = widthChartArea - widthTooltip - 10;

                        if (cf) {
                            cf.classList.remove('z-30');
                            cf.style.opacity = 0;
                        }

                        ct.style.left = position + 'px';
                        ct.style.opacity = 1;
                        markEls.forEach((el) => { el.style.opacity = 1; });
                        elCrossHairs.forEach(el => {
                            el.style.opacity = 1;
                            el.style.stroke = colors[0];
                        });

                        const markers = document.querySelectorAll('.apexcharts-marker');
                        markers.forEach(elMarker => {
                            elMarker.style.opacity = 1;
                        });

                        return "";
                    },
                    marker: {
                        show: true,
                    },
                    fixed: {
                        enabled: true,
                        position: "topLeft",
                        offsetX: 10,
                        offsetY: -30,
                    },
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.4,
                        opacityTo: 0.7,
                        stops: [0, 90, 100]
                    }
                },
            }

            var chart = new ApexCharts(document.querySelector("#stock-chart"), options);

            chart.render();

        </script>

    </body>

    </html>`
    // console.log(html)
    return html;
}