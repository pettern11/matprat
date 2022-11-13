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
  bilde_adr VARCHAR(255) DEFAULT 'https://miro.medium.com/max/1000/1*5DnGR_PQnMR7CkZhvNuMYQ.png',
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
