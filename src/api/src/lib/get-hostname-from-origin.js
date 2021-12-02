/**
 * Some environments pass origin with protocol
 * some just pass the hostname
 *
 * Either is fine since the value is parametrized
 * before sending to SQL Server
 */
export default origin => {
  let hostname
  try {
    hostname = new URL(origin).hostname
  } catch (error) {
    hostname = origin
  }

  return hostname
}
