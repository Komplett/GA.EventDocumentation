-- BigQuery Setup Script for Google Analytics Event Documentation Framework
-- This script creates a dataset named 'ga_event_names' and a table named 'event_names'
-- with the schema required for the event documentation system.

-- Create the dataset if it doesn't exist
CREATE SCHEMA IF NOT EXISTS `ga_event_names`
OPTIONS(
  location = 'EU'  -- Change this to your preferred location (US, EU, etc.)
);

-- Create the table with the required schema
CREATE OR REPLACE TABLE `ga_event_names.event_names` (
  event_name STRING,
  description STRING,
  format JSON,
  type STRING,
  tags JSON
);

-- Add a description to the table
ALTER TABLE `ga_event_names.event_names` 
SET OPTIONS (
  description = 'Google Analytics event documentation table containing event names, descriptions, formats, types, and tags'
);

-- Add descriptions to the columns
ALTER TABLE `ga_event_names.event_names`
ALTER COLUMN event_name SET OPTIONS (description = 'The name of the Google Analytics event');

ALTER TABLE `ga_event_names.event_names`
ALTER COLUMN description SET OPTIONS (description = 'Detailed description of the event purpose and when it is triggered');

ALTER TABLE `ga_event_names.event_names`
ALTER COLUMN format SET OPTIONS (description = 'JSON structure showing the event parameters and their expected values');

ALTER TABLE `ga_event_names.event_names`
ALTER COLUMN type SET OPTIONS (description = 'Indicates whether the event is client-side or server-side');

ALTER TABLE `ga_event_names.event_names`
ALTER COLUMN tags SET OPTIONS (description = 'JSON array of tags for categorizing and filtering events');

-- Example of how to insert a sample event (commented out)
/*
INSERT INTO `ga_event_names.event_names` (event_name, description, format, type, tags)
VALUES (
  'page_view',
  'Triggered when a user views a page',
  JSON '{"page_location": "string", "page_title": "string", "page_referrer": "string"}',
  'client',
  JSON '["core", "page_tracking"]'
);
*/

-- Note: Replace project_id in all queries with your actual Google Cloud project ID when executing
-- Example: CREATE SCHEMA IF NOT EXISTS `your-project-id.ga_event_names`
