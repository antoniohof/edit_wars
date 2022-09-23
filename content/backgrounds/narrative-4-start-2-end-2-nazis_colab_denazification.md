---
uuid: t8d_S_W4hpnuMlF1OUFHK
name: nazis_colab_denazification
narrative: 4
stepstart: 2
stepend: 2
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
identifier: "[Narrative:3]-[Start:2][End:2]-nazis_colab_denazification"
---
