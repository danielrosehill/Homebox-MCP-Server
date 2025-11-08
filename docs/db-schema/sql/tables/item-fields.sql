-- public.item_fields definition

-- Drop table

-- DROP TABLE public.item_fields;

CREATE TABLE public.item_fields (
	id uuid NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	"type" varchar NOT NULL,
	text_value varchar NULL,
	number_value int8 NULL,
	boolean_value bool DEFAULT false NOT NULL,
	time_value timestamptz NOT NULL,
	item_fields uuid NULL,
	CONSTRAINT item_fields_pkey PRIMARY KEY (id),
	CONSTRAINT item_fields_items_fields FOREIGN KEY (item_fields) REFERENCES public.items(id) ON DELETE CASCADE
);
CREATE INDEX idx_item_fields_item_lookup ON public.item_fields USING btree (item_fields, name);
CREATE INDEX idx_item_fields_name_type ON public.item_fields USING btree (name, type);
CREATE INDEX idx_item_fields_number_search ON public.item_fields USING btree (name, number_value) WHERE (number_value IS NOT NULL);
CREATE INDEX idx_item_fields_text_search ON public.item_fields USING btree (name, text_value) WHERE ((text_value IS NOT NULL) AND ((text_value)::text <> ''::text));