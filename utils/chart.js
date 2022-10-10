const zoomOptions = {
    zoom: {
      enabled: true
      // zoom options and/or events
    },
    pan: {
      enabled: true,
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
  var minDate = new Date(min)
  var maxDate = null
  console.log("chart.chartData", min, max)
  var lastDate = null
  chartData.labels.forEach(date => {
    if (new Date(date) <= new Date(min)) {
      minDate = new Date(date)
    }
    if (new Date(date) > new Date(max) && maxDate == null) {
      maxDate = new Date(date)
    }
    lastDate=new Date(date)
  })
  maxDate = maxDate || lastDate 

  return {min: minDate, max: maxDate}
}

const defaultOptions = {
  responsive: true,
  borderColor: "black",
  backgroundColor: "black",
  plugins: {
    zoom: zoomOptions,
    pan: {
      enabled: true,
      modifierKey: 'ctrl',
    },
    legend: {
      display: false,
      labels: {
        // This more specific font property overrides the global property
        font: {
          size: 12,
          family: "Golos-Text-Regular",
        }
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
          // console.log("context", context)
          let type = context[0].raw.type ? context[0].raw.type : context[1].raw.type
          if (!type) return
          const maxCharPerLine = 50
          let str = context[0].raw.label ? context[0].raw.label : context[1].raw.label
          let src = context[0].raw.source ? context[0].raw.source : context[1].raw.source
          if (str == undefined) return ""
          if (type == 'headline') str = `“${str}”`
          var words = str.split(" ")
          var lines = [""]
          var i = 0
          words.forEach(w => {
            if (lines[i].length + w.length > maxCharPerLine) {
              i++
              lines[i] = ""
            } else {
              lines[i] = lines[i] + " " + w
            }
          })
          if (src) lines.push(src)
          return lines
        }
      },
      labelTextColor: "white",
      bodyFont: {
        size: "12",
        family: "Golos-Text-Regular",
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
    },
    y: {
      grid: {
        display: true,
        drawBorder: true,
        drawOnChartArea: true,
        drawTicks: true,
      },
      ticks: {
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

const getDateValue = (date, data) => {
  // try exact date
  console.log("getDateValue", date)
  let foundIndex = 0
  var value = data.find((d, i) => {
    if (new Date(d.x) > new Date(date)) {
      foundIndex = i-1
      return true
    }
    /*
    new Date(d.x).getDate() == new Date(date).getDate() &&
    new Date(d.x).getMonth() == new Date(date).getMonth() &&
    new Date(d.x).getYear() == new Date(date).getYear()
    */
  })
  //console.log("value", value)
  console.log("foundIndex", foundIndex)  
  if (foundIndex === -1) {
    console.error('get date value error')
    return
  }
  var closestDate = data[foundIndex].x
  // var dateDiff = getDateDiff(closestDate, date)
  
  if (value) {
    return value.y
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