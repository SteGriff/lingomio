drop table if exists [UserQuota];

-- A monthly quota for a user
-- One month in unixepoch is 30 days * 24 hours * 60 minutes * 60 seconds = 2592000 seconds
-- The periodStart is the unixepoch of the first second of the month
create table [UserQuota]
(
  [id] integer primary key autoincrement,
  [userId] integer not null,
  [periodStart] int not null, -- unixepoch
  [llmUsages] int not null default 0,
  [llmQuota] int not null default 0,
  [ttsUsages] int not null default 0,
  [ttsQuota] int not null default 0
);
