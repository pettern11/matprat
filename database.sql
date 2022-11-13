DROP TABLE IF EXISTS oppskrift_innhold;
DROP TABLE IF EXISTS icebox;
DROP TABLE IF EXISTS oppskrift;
DROP TABLE IF EXISTS handleliste;
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
  liked BOOLEAN NOT NULL DEFAULT 0,
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
    oppskrift_id INT NOT NULL,
    ingred_id INT NOT NULL ,
    mengde VARCHAR(255) NOT NULL,
    maleenhet VARCHAR(255) NOT NULL,
      PRIMARY KEY(oppskrift_id, ingred_id))ENGINE=InnoDB CHARSET=latin1;;

CREATE TABLE handleliste(
    id INT NOT NULL AUTO_INCREMENT,
    ingred_id INT NOT NULL,
    mengde VARCHAR(255) NOT NULL,
    maleenhet VARCHAR(255) NOT NULL,
      PRIMARY KEY(id))ENGINE=InnoDB CHARSET=latin1;

CREATE TABLE icebox (
  ingred_id int NOT NULL,
  ingred_navn varchar(255) NOT NULL,
  PRIMARY KEY(ingred_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE icebox
  ADD CONSTRAINT icebox_fk1 FOREIGN KEY (ingred_id) REFERENCES ingrediens (ingred_id);

ALTER TABLE oppskrift
  ADD CONSTRAINT oppskrift_fk1 FOREIGN KEY(kategori_id) 
  REFERENCES kategori(kategori_id) ON UPDATE CASCADE,

  ADD CONSTRAINT oppskrift_fk2 FOREIGN KEY(land_id) 
  REFERENCES land(land_id) ON UPDATE CASCADE;

ALTER TABLE handleliste
  ADD CONSTRAINT handleliste_fk1 FOREIGN KEY(ingred_id) 
  REFERENCES ingrediens(ingred_id);


ALTER TABLE oppskrift_innhold
  ADD CONSTRAINT oppskriftInnhold_fk1 FOREIGN KEY(oppskrift_id) 
  REFERENCES oppskrift(oppskrift_id) ON DELETE CASCADE,

  ADD CONSTRAINT oppskriftInnhold_fk2 FOREIGN KEY(ingred_id) 
  REFERENCES ingrediens(ingred_id) ON UPDATE CASCADE;


