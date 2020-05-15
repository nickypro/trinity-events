const eventScraper = require('./scraper')

function checkEvent( EventModel, e ) {
  EventModel.findById(e._id, (err, data) => {
    if (data) {
      console.log(e._id, " Has been found, updating:")
      EventModel.updateOne({id: e._id}, e)

    } else {
      console.log(e._id +" not Found, Adding to Database")
      event = new EventModel(e)
      event.save()
    }
  })
}

async function scrapeAndUpdate(options, EventModel) {

  const events = await eventScraper(options)
  
  for (i in events) {
      console.log(events[i])
      checkEvent(EventModel, events[i])
  }
}

module.exports = scrapeAndUpdate