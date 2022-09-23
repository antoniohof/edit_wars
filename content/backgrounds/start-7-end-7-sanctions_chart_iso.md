---
uuid: USyTD8KFqvg4yagAjOhb1
name: sanctions_chart_iso,sanctions_chart_assets_0,sanctions_chart_assets_1
narrative: 1
stepstart: 6
stepend: 8
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
identifier: "[Start:6][End:8]-sanctions_chart_iso,sanctions_chart_assets_0,sanc\
  tions_chart_assets_1"
---
