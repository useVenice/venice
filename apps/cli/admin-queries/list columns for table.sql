SELECT *
  FROM information_schema.columns
 WHERE table_schema = 'public'
   AND table_name   = 'transaction'
     ;