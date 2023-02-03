SELECT
	u.email,
	u.id,
	r.id as resource_id,
	u.raw_user_meta_data->>'apiKey' as api_key,
	pu.usename
FROM
	auth.users u
	LEFT JOIN resource r ON r.creator_id = u.id::varchar
		AND starts_with (r.id,
			'reso_postgres')
			left join pg_user pu on pu.usename = ('usr_' || u.id);

