select
  CAST(timestamp as date) as roundedDate,
  name,
  emailAddress,
  COUNT(*) as loginCount
from
  logins l
  join users u on u.id = l.userId
group by
  CAST(timestamp as date),
  name,
  emailAddress
order by
  roundedDate desc,
  name;

