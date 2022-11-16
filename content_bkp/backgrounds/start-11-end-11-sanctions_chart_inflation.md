---
uuid: ZTZR2V9ynxPHOQiMHtkRz
name: sanctions_chart_curtain,sanctions_chart_inflation
narrative: 1
stepstart: 10
stepend: 11
component: LineChart
chartoptions: |-
  {
    "responsive": "true",
    "borderColor": "black",
    "backgroundColor": "black",
    "plugins": {
      "legend": {
        "display": "false"
      },
      "tooltips": {
        "callbacks": {
           "label": "() => {}"
        }
      },
      "subtitle": {
          "display": "false"
      },
      "title": {
        "display": "true",
        "text": "Mentions", 
        "color": "black",
        "font": {
          "size": "30",
          "family": "Open Sans"
        }
      }
    },
      "scales": {
        "x": {
            "type": "time",
            "time": {
                "unit": "week",
                "tooltipFormat": "MMM dd",
                "displayFormats": {
                 "week": "MMM dd"
               }
            }
        }
    }
  }
identifier: "[Start:10][End:11]-sanctions_chart_curtain,sanctions_chart_inflation"
---
