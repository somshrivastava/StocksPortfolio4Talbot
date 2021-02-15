npm run-script lint
npm run-script build
firebase serve --only functions

firebase target:apply hosting dev-stocksportfolio4talbot dev-stocksportfolio4talbot
firebase deploy --only hosting:dev-stocksportfolio4talbot

{
  "hosting": {
    "target": "dev-stocksportfolio4talbot",
    "public": "stocks-portfolio",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [ {
      "source": "**",
      "destination": "/index.html"
    } ],
    "headers": [
      {
        "source": "**/*.@(js|html)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-store, max-age=0"
          }
        ]
      }
    ]
  }
}

firebase target:apply hosting staging-stocksportfolio4talbot staging-stocksportfolio4talbot
firebase deploy --only hosting:staging-stocksportfolio4talbot

{
  "hosting": {
    "target": "staging-stocksportfolio4talbot",
    "public": "stocks-portfolio",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [ {
      "source": "**",
      "destination": "/index.html"
    } ],
    "headers": [
      {
        "source": "**/*.@(js|html)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-store, max-age=0"
          }
        ]
      }
    ]
  }
}

firebase target:apply hosting stocksportfolio4talbot stocksportfolio4talbot
firebase deploy --only hosting:stocksportfolio4talbot

{
  "hosting": {
    "target": "stocksportfolio4talbot",
    "public": "stocks-portfolio",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [ {
      "source": "**",
      "destination": "/index.html"
    } ],
    "headers": [
      {
        "source": "**/*.@(js|html)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-store, max-age=0"
          }
        ]
      }
    ]
  }
}