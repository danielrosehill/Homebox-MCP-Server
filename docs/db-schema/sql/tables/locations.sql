-- public.locations definition

-- Drop table

-- DROP TABLE public.locations;

CREATE TABLE public.locations (
	id uuid NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	group_locations uuid NOT NULL,
	location_children uuid NULL,
	CONSTRAINT locations_pkey PRIMARY KEY (id),
	CONSTRAINT locations_groups_locations FOREIGN KEY (group_locations) REFERENCES public."groups"(id) ON DELETE CASCADE,
	CONSTRAINT locations_locations_children FOREIGN KEY (location_children) REFERENCES public.locations(id) ON DELETE SET NULL
);