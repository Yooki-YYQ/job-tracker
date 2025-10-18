DELETE FROM applications WHERE data::text LIKE '%Debug%';
DELETE FROM applications WHERE data::text LIKE '%"0":"{%';
DELETE FROM applications WHERE data::text LIKE '%"1":"\"%';
