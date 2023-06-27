select
  CAST(timestamp as date) as roundedDate,
  submissionIds,
  left (submissionSearch,
    10) + '...' as truncatedSubmissionSearch,
  emailAddress
from
  DownloadLog d
  join Users u on u.id = d.userId
where
  name != 'Zach Smith'
order by
  timestamp desc;

