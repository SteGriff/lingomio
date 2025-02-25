drop table if exists [UserPlan];

-- A perenial plan for a user
-- The usage numbers they will be allowed each month
create table [UserPlan]
(
  [id] integer primary key autoincrement,
  [userId] integer not null,
  [activeFrom] int not null, -- unixepoch
  [llmUsages] int not null default 0,
  [ttsUsages] int not null default 0
);
