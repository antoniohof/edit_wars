const zoomOptions = {
  zoom: {
    wheel: {
      enabled: false
    }
    // zoom options and/or events
  },
  pan: {
    enabled: false,
    mode: 'xy',
  }
};

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

const getClostestDate = (min, max, chartData) => {
  chartData.labels.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a) - new Date(b);
  })
  var minDate = new Date(chartData.labels[0])
  var maxDate = null
  var lastDate = null

  chartData.labels.forEach(date => {
    if (new Date(date) <= new Date(min)) {
      minDate = new Date(date)
    }
    if (new Date(date) > new Date(max) && maxDate == null) {
      maxDate = new Date(date)
    }
    lastDate = new Date(date)
  })
  maxDate = maxDate || lastDate

  return { min: minDate, max: maxDate }
}

const defaultOptions = {
  //maintainAspectRatio: false,
  responsive: true,
  borderColor: "black",
  backgroundColor: "black",
  plugins: {
    zoom: zoomOptions,
    pan: {
      enabled: false,
      modifierKey: 'ctrl',
    },
    htmlLegend: {

    },
    legend: {
      display: true,
      position: 'bottom',
      align: 'center',
      labels: {
        // This more specific font property overrides the global property
        font: {
          size: 12,
          family: "Space Mono",
        },
        usePointStyle: true,
        filter: (legend, data) => {
          return true
          let filtered = data.datasets.filter(d=>d.label !== 'scatter')
          // console.log("legend", legend, filtered)
          if (filtered.length > 1) {
            return legend.text !== 'scatter'
          } else {
            return false
          }
        },
      }
    },
    tooltip: {
      position: (context) => {
        return 'nearest'
        if (context.chart.tooltip?.dataPoints && context.chart.tooltip && context.tooltip.dataPoints[0].raw.type === 'event') {
          return 'bottom'
        } else {
          return 'nearest'
        }
      },
      enabled: true,
      displayColors: false,
      callbacks: {
        label: (context) => "",
        title: (context) => "",
        afterBody: (context) => {
          let type = context[0].raw.type ? context[0].raw.type : context[1].raw.type
          if (!type) return
          const maxCharPerLine = 50
          let str = typeof context[0].raw.label == "string" ? context[0].raw.label : context[1].raw.label
          let src = typeof context[0].raw.source == "string" ? context[0].raw.source : context[1].raw.source
          if (str == undefined) return ""
          if (type == 'headline') str = `“${str}”`
          var words = str.split(" ")
          var lines = [""]
          var i = 0
          words.forEach(w => {
            if (lines[i].length + w.length > maxCharPerLine) {
              i++
              lines[i] = w + " "
            } else {
              lines[i] = lines[i] + w + " " 
            }
          })
          if (src) lines.push(src)
          return lines
        }
      },
      labelTextColor: "white",
      bodyFont: {
        size: "12",
        family: "Open Sans",
      },
      backgroundColor: 'rgb(0, 0, 0)'
    },
    subtitle: {
      display: false,
    },
    title: {
      display: true,
      text: "",
      color: "black",
      font: {
        size: "18",
        weight: "normal",
        family: "Space Mono",
      },
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "week",
        //tooltipFormat: "MMM YYYY",
        displayFormats: {
          week: "MMM dd",
        },
      },
      grid: {
        display: true,
        drawBorder: true,
        drawOnChartArea: true,
        drawTicks: true,
      },
      ticks: {
        font: {
          size: 10,
          family: 'Space Mono'
        }
      },
      min: new Date('2022-01-01').valueOf(),
      max: new Date('2022-07-31').valueOf()
    },
    y: {
      grid: {
        display: true,
        drawBorder: true,
        drawOnChartArea: true,
        drawTicks: true,
      },
      ticks: {
        font: {
          size: 10,
          family: 'Space Mono'
        },
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return Math.floor(value);
        },
      },
    },
  },
  /*
  animation: {
    x: {
      duration: 5000,
      from: 0
    },
    y: {
      duration: 3000,
      from: 500
    }
  }*/
};

const days = (1000 * 60 * 60 * 24);
const week = days * 7;

const getDateValue = (date, data) => {
  // try exact date
  var value = 0
  var value = data.find((d, i) => (
    new Date(d.x).getDate() == new Date(date).getDate() &&
    new Date(d.x).getMonth() == new Date(date).getMonth() &&
    new Date(d.x).getYear() == new Date(date).getYear()
  ))
  if (value) {
    // found exact value
    value = value.y
  } else {
    var closestIndex = 1
    var minDiff = 9999999999999999
    data.forEach((d, i) => {
      let timeDiff = Math.abs(new Date(d.x).getTime() - new Date(date).getTime())
      if (minDiff > timeDiff) {
        minDiff = timeDiff
        closestIndex = i
      }
    })
    let nextDate, prevDate
    let currentDate = new Date(date).getTime() 
    let closestDate = new Date (data[closestIndex].x).getTime()
    if (currentDate - closestDate < 0) {
      nextDate = data[closestIndex]
      prevDate = data[Math.max(closestIndex-1, 0)]
    } else {
      nextDate = data[Math.min(closestIndex+1, data.length-1)]
      prevDate = data[closestIndex]
    }
    let diffNext = Math.abs(new Date(nextDate.x).getTime() - new Date(date).getTime())
    //let diffPrevNext = new Date(nextDate.x).getTime() - new Date(prevDate.x).getTime()
    //let diffPrev = Math.abs(new Date(prevDate.x).getTime() - new Date(date).getTime())
    value = nextDate.y * (1 - (diffNext / week)) + prevDate.y * (diffNext / week)
  }
  if (value) {
    return Math.max(0, value)
  } else {
    return 0
  }
}

const getDateDiff = (d1, d2) => {
  var diff = new Date(d2).getTime() - new Date(d1).getTime();
  var daydiff = diff / (1000 * 60 * 60 * 24);
  return daydiff
}


export { defaultOptions, getDateValue, getClostestDate }