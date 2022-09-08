 # set schedule query, 
# query name: `form_measure_events_daily_today`
# table id: `form_measure_events_daily_{run_date}`
# overwrite
WITH
  `raw_data` AS (
    SELECT
      publish_time,
      JSON_QUERY_ARRAY(SAFE_CONVERT_BYTES_TO_STRING(data)) data,
      _PARTITIONTIME as pt
    FROM
      `form_measure_event.form_measure_events`
    WHERE
      (
        DATE(_PARTITIONTIME) = CURRENT_DATE()
        OR _PARTITIONTIME IS NULL
      )
  ),
  `raw_events` AS (
    SELECT
      publish_time,
      data,
      pt
    FROM
      raw_data,
      UNNEST (data) data
  ),
  `events` AS (
    SELECT
      SAFE_CAST(JSON_EXTRACT_SCALAR(data, "$.ts") AS INT64) AS timestamp,
      JSON_EXTRACT_SCALAR(data, "$.uid") AS uid,
      SAFE_CAST(JSON_EXTRACT_SCALAR(data, "$.sid") AS INT64) AS session_id,
      SAFE_CAST(JSON_EXTRACT_SCALAR(data, "$.i") AS INT64) AS event_order,
      JSON_EXTRACT_SCALAR(data, "$.e") AS event,
      JSON_EXTRACT_SCALAR(data, "$.fid") AS form_id,
      JSON_EXTRACT_SCALAR(data, "$.n") AS field_name,
      JSON_EXTRACT_SCALAR(data, "$.nn") AS field_tag_name,
      JSON_EXTRACT_SCALAR(data, "$.t") AS field_type,
      JSON_EXTRACT_SCALAR(data, "$.v") AS field_value,
      SAFE_CAST(JSON_EXTRACT_SCALAR(data, "$.vl") AS INT64) AS field_value_length,
      JSON_EXTRACT_SCALAR(data, "$.ua") AS useragent,
      JSON_EXTRACT_SCALAR(data, "$.url") AS url,
      JSON_EXTRACT_SCALAR(data, "$.referer") AS referer,
      JSON_EXTRACT_SCALAR(data, "$.fst") AS fst,
      JSON_EXTRACT(data, "$.fda") AS fda,
      publish_time,
      pt
    FROM
      raw_events
  )
SELECT
  *
FROM
  events
ORDER BY
  uid,
  session_id,
  event_order,
  timestamp