CasperJS - Google Analytics Real Time Scraping
==============================================

Currently logs in to Google Analytics and scrapes the realtime page for the active visitors number from the overview screen.

Usage:

    rake 'run[your.google@account.com,googlePassword,http://api.yourdomain.com/update-metric]'
  
Your api should take a post variable 'value' which contains the updated count, i.e: `{value: "3098"}`

Make sure to initialise submodules to get CasperJS
