
const getSocieties = async (db, log = ()=>{}) => await new Promise((resolve, reject) => {
  
  db.query("SELECT * FROM societies", async (err, societies, fields) => {
    if (err) {
      console.error(err.message);
      log(` - ERROR getting societies : ${err.message}`)
      reject()

    } else {
      // sort societies by alphabetical order
      societies.sort((soc1, soc2) => {
        if (soc1.name < soc2.name) return -1
        if (soc1.name > soc2.name) return 1
        return 0
      })

      const message = ` - Got list of ${societies.length} societies`
      console.log(message)
      log(message)

      resolve( societies )
    }

  });

})

module.exports = getSocieties