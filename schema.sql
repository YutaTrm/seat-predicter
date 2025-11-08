-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.artists (
  id integer NOT NULL DEFAULT nextval('artists_id_seq'::regclass),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT artists_pkey PRIMARY KEY (id)
);
CREATE TABLE public.lottery_slots (
  id integer NOT NULL DEFAULT nextval('lottery_slots_id_seq'::regclass),
  artist_id integer NOT NULL,
  name character varying NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lottery_slots_pkey PRIMARY KEY (id),
  CONSTRAINT lottery_slots_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id)
);
CREATE TABLE public.tickets (
  id integer NOT NULL DEFAULT nextval('tickets_id_seq'::regclass) UNIQUE,
  artist_id integer,
  tour_id integer NOT NULL,
  block text NOT NULL,
  column numeric NOT NULL CHECK ("column" = floor("column")),
  number numeric NOT NULL CHECK (number = floor(number)),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  lottery_slots_id integer NOT NULL,
  block_number numeric NOT NULL CHECK (block_number = floor(block_number)),
  CONSTRAINT tickets_pkey PRIMARY KEY (tour_id, block, block_number, column, number),
  CONSTRAINT tickets_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id),
  CONSTRAINT tickets_tour_id_fkey FOREIGN KEY (tour_id) REFERENCES public.tours(id),
  CONSTRAINT tickets_lottery_slots_id_fkey FOREIGN KEY (lottery_slots_id) REFERENCES public.lottery_slots(id)
);
CREATE TABLE public.tours (
  id integer NOT NULL DEFAULT nextval('tours_id_seq'::regclass),
  artist_id integer,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  end_date date NOT NULL,
  print_start_date date,
  result_post_url text UNIQUE,
  keywords jsonb,
  CONSTRAINT tours_pkey PRIMARY KEY (id),
  CONSTRAINT tours_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id)
);