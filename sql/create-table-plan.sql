drop table if exists [Plan];

create table [Plan]
(
  [id] integer primary key,
  [name] nvarchar(50) not null,
  [llmUsages] int not null default 0,
  [ttsUsages] int not null default 0
);

insert into [Plan] (id, name, llmUsages, ttsUsages) values (1, 'Free', 20, 20);
insert into [Plan] (id, name, llmUsages, ttsUsages) values (2, 'Premium', 200, 200);
