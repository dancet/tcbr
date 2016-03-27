// requires
const fs = require('fs');

const bunyan = require('bunyan');
const cheerio = require('cheerio');
const superagent = require('superagent');

// set some vars
const url = 'https://donate.ccia.org.au/campaign/1/townsville-to-cairns-bike-ride-2016';
const fundraisingId = '#ItemCampaignCurrent'	// WARNING! This may need to be updated from time to time
const fundraisingFile = 'current-total.txt'

// set up the logger
const log = bunyan.createLogger({
	name: "pixo-scraper",
    streams: [
	    {
	        type: 'rotating-file',
	        path: 'scraper.log',
	        period: '1d',
	        reemitErrorEvents: true
	    },
		{
            level: 'trace',
            stream: process.stdout
        }
    ]	

});

// GET request to the Pixo site
superagent
	.get(url)
  	.end(function(err, res){
	  	if (err) {
	  		log.error(`An error occurred: ${err}`)
	  	}
	  	else {
	  		// scrape the fundraising total
  			const html = res.text;
  			const $ = cheerio.load(html);
  			const fundraisingTotal = $(fundraisingId).text();

			// update a local file for reading later
			fs.writeFile(fundraisingFile, fundraisingTotal, err => {
			    if(err) {
			        log.error(`An error occurred writing the total to the file. ${err}`);
			    }
		    	else {
		    		log.info(`Fundraising total (${fundraisingTotal}) updated successfully`);	
		    	}
			});  
	  	}
	});
