var config = module.exports = require('./config_defaults.js');

config.fundraising_file = '/home/ec2-user/tcbr/fundraising-total.txt'

config.logger.scraper = {
	name: "pixo-scraper",
    streams: [
	    {
	        type: 'rotating-file',
	        path: '/home/ec2-user/tcbr/scraper.log',
	        period: '1d'
	    }
    ]	
};
