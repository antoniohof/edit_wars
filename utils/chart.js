const defaultOptions = {
  responsive: true,
  borderColor: "black",
  backgroundColor: "black",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      position: (context) => {
        return 'nearest'
        console.log("context", context)
        if (context.chart.tooltip && context.tooltip.dataPoints[0].raw.type === 'event') {
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
          //console.log("context", context)
          let type = context[0].raw.type ? context[0].raw.type : context[1].raw.type
          if (!type) return
          const maxCharPerLine = 50
          let str = context[0].raw.label ? context[0].raw.label : context[1].raw.label
          if (str == undefined) return ""
          var words = str.split(" ")
          var lines = [""]
          var i = 0
          words.forEach(w => {
            if (lines[i].length + w.length > maxCharPerLine) {
              i++
              lines[i] = ""
            } else {
              lines[i] += " " + w
            }
          })
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
      text: "Mentions of the word 'Nazi'",
      color: "black",
      font: {
        size: "18",
        weight: "normal",
        family: "Golos-Text-Regular",
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
        display: false,
        drawBorder: true,
        drawOnChartArea: false,
        drawTicks: false,
      },
    },
    y: {
      grid: {
        display: false,
        drawBorder: true,
        drawOnChartArea: false,
        drawTicks: false,
      },
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return value;
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
  var dateDiff = getDateDiff(closestDate, date)
  
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


export { defaultOptions, getDateValue }