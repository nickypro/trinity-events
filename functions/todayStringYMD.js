const dateFormat = require('dateformat');
const todayStringYMD = () => dateFormat(new Date(), "yyyy-mm-dd") 
module.exports = todayStringYMD