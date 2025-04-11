-- BigQuery Scheduled Job Setup Script for Google Analytics Event Documentation Framework
-- This script creates a scheduled query that runs monthly to identify new events
-- and insert them into the event documentation table.

-- Note: This script uses GoogleSQL (Standard SQL) syntax and requires appropriate permissions
-- to create scheduled queries in your project.

-- Create a scheduled query to identify new events
CREATE OR REPLACE SCHEDULED QUERY scheduled_event_documentation_update
OPTIONS(
  schedule='0 0 1 * *',  -- Run at midnight on the 1st day of every month (cron format)
  description='Identifies new GA events and adds them to the documentation table'
)
AS

-- First, identify new events that aren't yet in the documentation table
WITH new_events AS (
  SELECT DISTINCT e.event_name
  FROM `YOUR_PROJECT_ID.analytics_XXXXXX.events_*` AS e
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
      AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
    AND e.event_name NOT IN (
      SELECT DISTINCT event_name FROM `YOUR_PROJECT_ID.ga_event_names.event_names`
    )
)

-- Insert the new events into the documentation table with default values
INSERT INTO `YOUR_PROJECT_ID.ga_event_names.event_names` (event_name, description, format, type, tags)
SELECT 
  event_name,
  'Needs documentation',  -- Default description
  JSON '{}',              -- Empty JSON object for format
  'unknown',              -- Default type
  JSON '["needs_review"]' -- Default tags
FROM new_events
ORDER BY event_name ASC;

-- IMPORTANT: Before running this script:
-- 1. Replace YOUR_PROJECT_ID with your actual Google Cloud project ID
-- 2. Replace analytics_XXXXXX with your actual Google Analytics dataset ID
-- 3. Ensure you have appropriate permissions to create scheduled queries
-- 4. This script requires GoogleSQL (Standard SQL) mode, not Legacy SQL

-- To run this script:
-- 1. In BigQuery Console, ensure "Use Legacy SQL" is unchecked
-- 2. Copy and paste this script, replacing the placeholders
-- 3. Click "Run"

-- To modify the schedule:
-- The schedule is in cron format: minute hour day-of-month month day-of-week
-- Example: '0 0 1 * *' runs at midnight on the 1st day of every month
-- For more frequent updates, you could use:
-- '0 0 * * 0'  -- Weekly (midnight every Sunday)
-- '0 0 * * *'  -- Daily (midnight every day)
