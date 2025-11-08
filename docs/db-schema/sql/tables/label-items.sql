-- public.label_items definition

-- Drop table

-- DROP TABLE public.label_items;

CREATE TABLE public.label_items (
	label_id uuid NOT NULL,
	item_id uuid NOT NULL,
	CONSTRAINT label_items_pkey PRIMARY KEY (label_id, item_id),
	CONSTRAINT label_items_item_id FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE CASCADE,
	CONSTRAINT label_items_label_id FOREIGN KEY (label_id) REFERENCES public.labels(id) ON DELETE CASCADE
);