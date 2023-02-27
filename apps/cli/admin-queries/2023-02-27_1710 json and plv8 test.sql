CREATE OR REPLACE FUNCTION public.xjsonb_object_keys(obj jsonb)
 RETURNS text[]
 LANGUAGE plv8
 IMMUTABLE STRICT
AS $function$
    return Object.keys(obj);
$function$

CREATE OR REPLACE FUNCTION public.jsonb_object_keys_to_text_array(_js jsonb)
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$SELECT ARRAY(SELECT jsonb_object_keys(_js))$function$

CREATE OR REPLACE FUNCTION public.plv8_test(keys text[], vals text[])
 RETURNS json
 LANGUAGE plv8
 IMMUTABLE STRICT
AS $function$
    var o = {};
    for(var i=0; i<keys.length; i++){
        o[keys[i]] = vals[i];
    }
    return o;
$function$


CREATE OR REPLACE FUNCTION public.jsonb_array_to_text_array(_js jsonb)
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE STRICT
AS $function$SELECT ARRAY(SELECT jsonb_array_elements_text(_js))$function$
