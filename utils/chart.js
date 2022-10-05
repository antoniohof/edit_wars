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
        if (context.chart.tooltip.dataPoints !== undefined && context.tooltip.dataPoints[0].raw.type === 'event') {
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
};

export { defaultOptions }