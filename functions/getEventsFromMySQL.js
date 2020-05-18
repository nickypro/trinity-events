const getEventsFromMySQL = (db, startDate, callback = () => {},  selectedSocieties = []) => {
  //get events from database 
  const getAll = (selectedSocieties.length === 0)
  db.query(`
  SELECT
    e.*,
    CAST(concat('[', group_concat(json_quote(s.name) ORDER BY s.name SEPARATOR ','), ']') as json) AS societyNames,
    CAST(concat('[', group_concat(s.id ORDER BY s.id SEPARATOR ','), ']') as json) AS societyIds
  FROM
    events e
    INNER JOIN society_event se
      ON se.event_id = e.id
    INNER JOIN societies s
      ON s.id = se.society_id
  WHERE
    ${getAll?"":"s.id in (?) AND"}
    e.date > '${startDate} 00:00:00'
  GROUP BY
    e.id
  `, (getAll ? [] : selectedSocieties), 
    (err, results, fields) => {
      if (err) return console.log(" - Error getting events from MySQL ", err.message);
      
      console.log(` - Got events for ${selectedSocieties.length === 0 ? "all societeies" : selectedSocieties}.`)
      
      const events = results
        .map((event) => ({...event, societyNames: JSON.parse(event.societyNames), societyIds: JSON.parse(event.societyIds) }))
        .sort((ev1, ev2) => Number(ev1.date) - Number(ev2.date))

      callback(events)
      return events
    }
  )
}

module.exports = getEventsFromMySQL