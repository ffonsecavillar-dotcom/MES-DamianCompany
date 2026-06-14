create table if not exists app_records (
  id text primary key,
  collection text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_records_collection_idx on app_records(collection);
create index if not exists app_records_data_status_idx on app_records((data->>'status'));
create index if not exists app_records_data_project_idx on app_records((data->>'projectId'));
create index if not exists app_records_data_client_idx on app_records((data->>'clientId'));

-- The MVP stores module records as JSONB so the app can evolve quickly while
-- preserving PostgreSQL persistence, indexing and reporting paths.
