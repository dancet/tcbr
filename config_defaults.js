var config = module.exports = {};

config.port = 8080;

config.fundraising_file = 'fundraising-total.txt';
config.url = 'https://donate.ccia.org.au/campaign/1/townsville-to-cairns-bike-ride-2016';
config.fundraising_id = '#ItemCampaignCurrent';	// WARNING! This may need to be updated from time to time

// set up the logger
config.logger = {};
config.logger.scraper = {
	name: "pixo-scraper",
    streams: [
	    {
	        type: 'rotating-file',
	        path: 'scraper.log',
	        period: '1d'
	    },
		{
            level: 'trace',
            stream: process.stdout
        }
    ]	
};

config.logger.server = {
    name: "fundraising-server",
    streams: [
        {
            type: 'rotating-file',
            path: 'server.log',
            period: '1d'
        },
        {
            level: 'trace',
            stream: process.stdout
        }
    ]   
};
