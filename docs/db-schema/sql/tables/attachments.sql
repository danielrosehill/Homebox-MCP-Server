-- public.attachments definition

-- Drop table

-- DROP TABLE public.attachments;

CREATE TABLE public.attachments (
	id uuid NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	"type" varchar DEFAULT 'attachment'::character varying NOT NULL,
	"primary" bool DEFAULT false NOT NULL,
	item_attachments uuid NULL,
	title varchar DEFAULT ''::character varying NOT NULL,
	"path" varchar DEFAULT ''::character varying NOT NULL,
	attachment_thumbnail uuid NULL,
	mime_type varchar DEFAULT 'application/octet-stream'::character varying NULL,
	CONSTRAINT attachments_no_self_reference CHECK ((id <> attachment_thumbnail)),
	CONSTRAINT attachments_pkey PRIMARY KEY (id),
	CONSTRAINT attachments_attachments_thumbnail FOREIGN KEY (attachment_thumbnail) REFERENCES public.attachments(id) ON DELETE SET NULL,
	CONSTRAINT attachments_items_attachments FOREIGN KEY (item_attachments) REFERENCES public.items(id) ON DELETE CASCADE
);