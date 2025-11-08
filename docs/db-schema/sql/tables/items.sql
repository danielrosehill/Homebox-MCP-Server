-- public.items definition

-- Drop table

-- DROP TABLE public.items;

CREATE TABLE public.items (
	id uuid NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	import_ref varchar NULL,
	notes varchar NULL,
	quantity int8 DEFAULT 1 NOT NULL,
	insured bool DEFAULT false NOT NULL,
	archived bool DEFAULT false NOT NULL,
	asset_id int8 DEFAULT 0 NOT NULL,
	serial_number varchar NULL,
	model_number varchar NULL,
	manufacturer varchar NULL,
	lifetime_warranty bool DEFAULT false NOT NULL,
	warranty_expires timestamptz NULL,
	warranty_details varchar NULL,
	purchase_time timestamptz NULL,
	purchase_from varchar NULL,
	purchase_price float8 DEFAULT 0 NOT NULL,
	sold_time timestamptz NULL,
	sold_to varchar NULL,
	sold_price float8 DEFAULT 0 NOT NULL,
	sold_notes varchar NULL,
	group_items uuid NOT NULL,
	item_children uuid NULL,
	location_items uuid NULL,
	sync_child_items_locations bool DEFAULT false NOT NULL,
	CONSTRAINT items_pkey PRIMARY KEY (id),
	CONSTRAINT items_groups_items FOREIGN KEY (group_items) REFERENCES public."groups"(id) ON DELETE CASCADE,
	CONSTRAINT items_items_children FOREIGN KEY (item_children) REFERENCES public.items(id) ON DELETE SET NULL,
	CONSTRAINT items_locations_items FOREIGN KEY (location_items) REFERENCES public.locations(id) ON DELETE CASCADE
);
CREATE INDEX idx_items_group_parent_active ON public.items USING btree (group_items, item_children, archived);
CREATE INDEX idx_items_location_parent ON public.items USING btree (location_items, item_children) WHERE (archived = false);
CREATE INDEX idx_items_name_parent_search ON public.items USING btree (name, item_children) WHERE (archived = false);
CREATE INDEX idx_items_parent_child ON public.items USING btree (item_children) WHERE (item_children IS NOT NULL);
CREATE INDEX idx_items_root_items ON public.items USING btree (group_items, location_items) WHERE ((item_children IS NULL) AND (archived = false));
CREATE INDEX item_archived ON public.items USING btree (archived);
CREATE INDEX item_asset_id ON public.items USING btree (asset_id);
CREATE INDEX item_manufacturer ON public.items USING btree (manufacturer);
CREATE INDEX item_model_number ON public.items USING btree (model_number);
CREATE INDEX item_name ON public.items USING btree (name);
CREATE INDEX item_serial_number ON public.items USING btree (serial_number);