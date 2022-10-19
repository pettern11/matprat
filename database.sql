DROP TABLE IF EXISTS oppskrift_innhold;

DROP TABLE IF EXISTS oppskrift;
DROP TABLE IF EXISTS ingrediens;
DROP TABLE IF EXISTS land;
DROP TABLE IF EXISTS kategori;


CREATE TABLE oppskrift(
  oppskrift_id INT NOT NULL AUTO_INCREMENT,
  oppskrift_navn VARCHAR(255) NOT NULL, 
  oppskrift_beskrivelse LONGTEXT NOT NULL,
  oppskrift_steg LONGTEXT NOT NULL,
  ant_pors INT NOT NULL,
  bilde_adr VARCHAR(255),
  kategori_id INT NOT NULL,
  land_id INT NOT NULL,
  ant_like INT NOT NULL DEFAULT 0,
    PRIMARY KEY (oppskrift_id)
)ENGINE=InnoDB CHARSET=latin1;;

CREATE TABLE ingrediens(
  ingred_id INT NOT NULL AUTO_INCREMENT,
  ingred_navn VARCHAR(255) NOT NULL,
    PRIMARY KEY(ingred_id)
)ENGINE=InnoDB CHARSET=latin1;;

CREATE TABLE land(
    land_id INT NOT NULL AUTO_INCREMENT, 
    land_navn VARCHAR(255) NOT NULL,
      PRIMARY KEY(land_id))ENGINE=InnoDB CHARSET=latin1;;


CREATE TABLE kategori(
    kategori_id INT NOT NULL AUTO_INCREMENT,
    kategori_navn VARCHAR(255) NOT NULL,
      PRIMARY KEY(kategori_id))ENGINE=InnoDB CHARSET=latin1;;


CREATE TABLE oppskrift_innhold(
    id INT NOT NULL AUTO_INCREMENT,
    oppskrift_id INT NOT NULL,
    ingred_id INT NOT NULL ,
    mengde INT NOT NULL,
    maleenhet VARCHAR(255) NOT NULL,
      PRIMARY KEY(id))ENGINE=InnoDB CHARSET=latin1;;

ALTER TABLE oppskrift
  ADD CONSTRAINT oppskrift_fk1 FOREIGN KEY(kategori_id) 
  REFERENCES kategori(kategori_id) ON UPDATE CASCADE,

  ADD CONSTRAINT oppskrift_fk2 FOREIGN KEY(land_id) 
  REFERENCES land(land_id) ON UPDATE CASCADE;


ALTER TABLE oppskrift_innhold
  ADD CONSTRAINT oppskriftInnhold_fk1 FOREIGN KEY(oppskrift_id) 
  REFERENCES oppskrift(oppskrift_id) ON DELETE CASCADE,

  ADD CONSTRAINT oppskriftInnhold_fk2 FOREIGN KEY(ingred_id) 
  REFERENCES ingrediens(ingred_id) ON UPDATE CASCADE;


INSERT INTO land(land_navn)
  VALUES 
    ("Norge"),
    ("Sverige"),
    ("England"),
    ("Frankrike"),
    ("Pakistan"),
    ("USA"),
    ("India"),
    ("Kina"),
    ("Italia"),
    ("Hellas");
  
INSERT INTO ingrediens(ingred_navn)
  VALUES
    ("kylling"),
    ("fløte"),
    ("ris"),
    ("pasta"),
    ("potet"),
    ("gulrot"),
    ("gulløk"),
    ("rødløk"),
    ("hvetemel"),
    ("vann"),
    ("pizzasaus"),
    ("ost"),
    ("skinke"),
    ("vegansk pizzating"),
    ("hvitløk");
  
INSERT INTO kategori(kategori_navn)
  VALUES
    ("enkel hverdagsmat"),
    ("italiensk"),
    ("vegansk");

INSERT INTO oppskrift(oppskrift_navn, oppskrift_beskrivelse,oppskrift_steg, ant_pors, bilde_adr, kategori_id, land_id)
  VALUES
    ("skinkepizza", "Skinkepizza er en klassiker til både store og små. Enkelt å lage og kjempe digg.","Lag pizza",
    4, "https://usercontent.one/wp/www.framittkjokken.no/wp-content/uploads/2019/11/Photo_1586412317644-1140x855.jpg",
    2, 9 ),

    ("kremet pasta og kylling", "Kylling er digg","Stek kylling",
    2, "https://mills.no/content/uploads/2019/09/Kremet-pasta-med-sopp-og-kylling.jpg",
    1, 1 );
    

INSERT INTO oppskrift_innhold(oppskrift_id, ingred_id, mengde, maleenhet)
  VALUES 
    (1,9,1000,"gram"),
    (1,10,4, "dl" ),
    (1,11, 2, "boks"),
    (1,12, 2, "håndfull"),
    (1,13, 300, "gram");
