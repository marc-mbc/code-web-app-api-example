/*
* PostgreSQL 9.3
*
 */
/*
 * Drop Statements
 */

DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

/*
 * DDL Statements
 */

CREATE TABLE users
    (
    id serial NOT NULL,
    name text NOT NULL,
    lastname text NOT NULL,
    email text NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp without time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS=FALSE
);

CREATE UNIQUE INDEX users_ukey_email ON users (email);


ALTER TABLE users OWNER TO by_hours;

CREATE TABLE hotels
    (
    id serial NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp without time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT hotels_pkey PRIMARY KEY (id)
)
WITH (
    OIDS=FALSE
);

CREATE UNIQUE INDEX hotels_ukey_name ON hotels (name);

ALTER TABLE hotels OWNER TO by_hours;


CREATE TABLE room_types (
    id serial NOT NULL,
    hotel_id int NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price real NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp without time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT room_types_pkey PRIMARY KEY (id),
    FOREIGN KEY (hotel_id) REFERENCES hotels (id)
)
WITH (
    OIDS=FALSE
);

CREATE INDEX room_types_xkey_from_date ON room_types (hotel_id);

ALTER TABLE room_types OWNER TO by_hours;


CREATE TABLE rooms (
    id serial NOT NULL,
    room_type_id int NOT NULL,
    identifier text NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp without time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT rooms_pkey PRIMARY KEY (id),
    FOREIGN KEY (room_type_id) REFERENCES room_types (id)
)
WITH (
    OIDS=FALSE
);

CREATE UNIQUE INDEX rooms_ukey_identifier ON rooms (room_type_id, identifier);

ALTER TABLE rooms OWNER TO by_hours;

CREATE TABLE bookings (
    id serial NOT NULL,
    room_id int NOT NULL,
    user_id int NOT NULL,
    from_date date NOT NULL,
    to_date date NOT NULL,
    total_price real NOT NULL,
    CONSTRAINT bookings_valid_range_dates CHECK (from_date <= to_date),
    created_at timestamp without time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp without time zone NOT NULL DEFAULT NOW(),
    CONSTRAINT bookings_pkey PRIMARY KEY (id),
    FOREIGN KEY (room_id) REFERENCES rooms (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
)
WITH (
    OIDS=FALSE
);
CREATE INDEX bookings_xkey_from_date ON bookings (from_date);
CREATE INDEX bookings_xkey_to_date ON bookings (to_date);
CREATE INDEX bookings_xkey_room_id ON bookings (room_id);
CREATE INDEX bookings_xkey_day_updated_at ON bookings (date_trunc('day', updated_at));
CREATE INDEX bookings_xkey_week_updated_at ON bookings (date_trunc('week', updated_at));

ALTER TABLE bookings OWNER TO by_hours;


/*
 * DML Statements
 */

DO
$do$
DECLARE hotel_id int;
DECLARE room_type_id int;
DECLARE room_id int;

BEGIN

  INSERT INTO users (name, lastname, email) VALUES ('Marc', 'Blando Coll', 'marc.mbc@gmail.com');

  FOR i IN 1..5000 LOOP

    INSERT INTO hotels(name, description) VALUES ('Hotel ' || i, 'Description ' || i) RETURNING id INTO hotel_id;
    
    INSERT INTO room_types(hotel_id, name, description, price) VALUES (hotel_id, 'Room type A', 'Description A', 50) RETURNING id INTO room_type_id;
    FOR j IN 1..100 LOOP
      INSERT INTO rooms(room_type_id, identifier) VALUES (room_type_id, 'A' || j) RETURNING id INTO room_id;
      FOR k IN 1..10 LOOP
        INSERT INTO bookings(room_id, user_id, from_date, to_date, total_price) VALUES (room_id, 1, DATE '2014-10-03' - 30*k , DATE '2014-10-13' - 30*k, 600);
      END LOOP;
    END LOOP;
    
    INSERT INTO room_types(hotel_id, name, description, price) VALUES (hotel_id, 'Room type B', 'Description B', 100) RETURNING id INTO room_type_id;
    FOR j IN 1..50 LOOP
      INSERT INTO rooms(room_type_id, identifier) VALUES (room_type_id, 'B' || j) RETURNING id INTO room_id;
      FOR k IN 1..10 LOOP
        INSERT INTO bookings(room_id, user_id, from_date, to_date, total_price) VALUES (room_id, 1, DATE '2014-10-09' - 30*k, DATE '2014-10-12' - 30*k, 300);
      END LOOP;
    END LOOP;
    
    INSERT INTO room_types(hotel_id, name, description, price) VALUES (hotel_id, 'Room type C', 'Description C', 150) RETURNING id INTO room_type_id;
    FOR j IN 1..25 LOOP
      INSERT INTO rooms(room_type_id, identifier) VALUES (room_type_id, 'C' || j) RETURNING id INTO room_id;
      FOR k IN 1..10 LOOP
        INSERT INTO bookings(room_id, user_id, from_date, to_date, total_price) VALUES (room_id, 1, DATE '2014-11-07' - 30*k, DATE '2014-11-15' - 30*k, 400);
      END LOOP;
    END LOOP;
    
    INSERT INTO room_types(hotel_id, name, description, price) VALUES (hotel_id, 'Room type D', 'Description D', 200) RETURNING id INTO room_type_id;
    FOR j IN 1..5 LOOP
      INSERT INTO rooms(room_type_id, identifier) VALUES (room_type_id, 'D' || j) RETURNING id INTO room_id;
      FOR k IN 1..10 LOOP
        INSERT INTO bookings(room_id, user_id, from_date, to_date, total_price) VALUES (room_id, 1, DATE '2014-06-05' - 30*k, DATE '2014-06-08' - 30*k, 200);
      END LOOP;
    END LOOP;

  END LOOP;
END
$do$

/*
  * Queries Examples
 */
 

 --- Search hotels with some room avaliable at a given range
SELECT h.*
FROM hotels h 
WHERE EXISTS(
  SELECT r.id FROM room_types rt
  INNER JOIN rooms r ON r.room_type_id = rt.id
  WHERE r.id NOT IN (
    SELECT room_id FROM bookings WHERE room_id = r.id AND from_date < '2014-12-30'::date AND to_date > '2014-4-6'::date LIMIT 1
  )
  LIMIT 1
)
LIMIT 20;

SELECT rt.*
FROM room_types rt
WHERE rt.hotel_id=1 AND

--- room types avaliable of a hotel

SELECT  rt.*, COUNT(r.id) as total_avaliable, (rt.price * ('2014-04-10'::date - '2014-04-01'::date)) as total_price
FROM room_types rt
INNER JOIN rooms r ON r.room_type_id = rt.id
WHERE rt.hotel_id = 1 AND r.id NOT IN (
  SELECT room_id FROM bookings WHERE room_id = r.id AND from_date < '2014-04-10'::date AND to_date > '2014-04-01'::date LIMIT 1
)
GROUP BY rt.id
ORDER BY total_price

--- Daily sales
SELECT SUM(b.total_price) as sales, COUNT(*) as bookings_count
FROM bookings b
WHERE date_trunc('day', b.updated_at) = date_trunc('day', NOW());

--- Best hotel of the day
SELECT h.*, SUM(b.total_price) as hotel_benefit, COUNT(*) as bookings_count
FROM hotels h
INNER JOIN room_types rt ON rt.hotel_id = h.id 
INNER JOIN rooms r ON r.room_type_id = rt.id
INNER JOIN bookings b ON b.room_id = r.id
WHERE date_trunc('day', b.updated_at) = date_trunc('day', NOW())
GROUP BY h.id
ORDER BY hotel_benefit DESC


--- Weekly accumulated sales

SELECT SUM(b.total_price) as sales, COUNT(*) as bookings_count
FROM bookings b
WHERE date_trunc('week', b.updated_at) >= date_trunc('week', NOW());


