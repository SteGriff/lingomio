drop table if exists [PhraseCache];

create table [PhraseCache]
(
  [id] integer primary key autoincrement,
  [normalizedPhrase] text not null unique,
  [explanation] text not null
);