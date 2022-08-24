Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function cleanDate (dateString) {
  dateString = dateString.slice(0, dateString.length - 9) 
  var dateParts = dateString.split("/");
  // month is 0-based, that's why we need dataParts[1] - 1
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  return dateObject
}

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
      dateArray.push(new Date (currentDate).toLocaleDateString('en-GB'));
      currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

function processTableutData (data, dates) { 
  var dataValues = dates.map(d => 0)
  data.map((d) => {
    var date = cleanDate(d.fetchdate_orig).toLocaleDateString('en-GB')
    console.log("date", date)
    var index = dates.indexOf(date)
    dataValues[index] = dataValues[index]+1
  })
  return dataValues
}

function filterDatabyDate (data, startDate, endDate) {
  data = data.filter(d => {
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    var date = cleanDate(d.fetchdate_orig)
    return date >= startDate && date <= endDate
  })
  return data
}

export { getDates, processTableutData, filterDatabyDate }