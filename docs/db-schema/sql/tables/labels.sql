-- public.labels definition

-- Drop table

-- DROP TABLE public.labels;

CREATE TABLE public.labels (
	id uuid NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	color varchar NULL,
	group_labels uuid NOT NULL,
	CONSTRAINT labels_pkey PRIMARY KEY (id),
	CONSTRAINT labels_groups_labels FOREIGN KEY (group_labels) REFERENCES public."groups"(id) ON DELETE CASCADE
);