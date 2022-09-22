---
uuid: USyTD8KFqvg4yagAjOhb1
name: sanctions_chart_iso,sanctions_chart_assets_0,sanctions_chart_assets_1
stepstart: 7
stepend: 9
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
        "text": "Mention of isolation in the media",
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
identifier: "[Start:7][End:9]-sanctions_chart_iso,sanctions_chart_assets_0,sanc\
  tions_chart_assets_1"
---
