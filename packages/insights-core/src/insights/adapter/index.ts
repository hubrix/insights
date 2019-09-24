import Postgres from './sql/postgres'
import SQLite from './sql/sqlite'

module.exports = function createAdapter (connection) {
  if (connection.indexOf('postgresql://') === 0 || connection.indexOf('psql://') === 0) {
    return new Postgres(connection)
  } else if (connection.indexOf('sqlite://') === 0) {
    return new SQLite(connection)
  } else {
    throw new Error('No compatible database found!')
  }
}
