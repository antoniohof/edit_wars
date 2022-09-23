---
uuid: -l1eDYK0i_RbhR3A0wQoG
name: sanctions_chart_gas
stepstart: 12
stepend: 12
component: BarChart
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
          "family": "Golos-Text-Regular"
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
identifier: "[Start:12][End:12]-sanctions_chart_gas"
---
