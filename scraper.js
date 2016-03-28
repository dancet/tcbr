// requires
const fs = require('fs');

const bunyan = require('bunyan');
const cheerio = require('cheerio');
const superagent = require('superagent');

const config = require('./config.js');

// set up the logger
const log = bunyan.createLogger(config.logger.scraper);

// GET request to the Pixo site
superagent
	.get(config.url)
  	.end(function(err, res){
	  	if (err) {
	  		log.error(`An error occurred: ${err}`)
	  	}
	  	else {
	  		// scrape the fundraising total
  			const html = res.text;
  			const $ = cheerio.load(html);
  			const fundraisingTotal = $(config.fundraising_id).text();

			// update a local file for reading later
			fs.writeFile(config.fundraising_file, fundraisingTotal, err => {
			    if(err) {
			        log.error(`An error occurred writing the total to the file. ${err}`);
			    }
		    	else {
		    		log.info(`Fundraising total (${fundraisingTotal}) updated successfully`);	
		    	}
			});  
	  	}
	});
