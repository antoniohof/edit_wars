---
uuid: XD9BMTmtMIWwOh3PasbXD
name: sanctions_chart_assets_1
stepstart: 9
stepend: 9
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
        "text": "Theft mentions",
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
identifier: "[Start:9][End:9]-sanctions_chart_assets_1"
---
