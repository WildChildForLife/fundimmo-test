DROP DATABASE IF EXISTS test;
DROP DATABASE IF EXISTS fundimmo;

CREATE DATABASE IF NOT EXISTS fundimmo CHARACTER SET = 'utf8' COLLATE 'utf8_general_ci';
USE fundimmo;

DROP TABLE IF EXISTS `countries`;

CREATE TABLE `countries` (
    `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NULL,
    `topLevelDomain` text NULL,
    `alpha2Code` varchar(255) NULL,
    `alpha3Code` varchar(255) NULL,
    `capital` varchar(255) NULL,
    `altSpellings` text NULL,
    `region` varchar(255) NULL,
    `subregion` varchar(255) NULL,
    `population` bigint(20) NULL,
    `latlng` text NULL,
    `demonym` varchar(255) NULL,
    `area` bigint(20) NULL,
    `gini` float(10,4) NULL,
    `timezones` text NULL,
    `borders` text NULL,
    `nativeName` varchar(255) NULL,
    `numericCode` int(11) NULL,
    `flag` text NULL,
    `cioc` varchar(255) NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# TABLE STRUCTURE FOR: currencies
#

DROP TABLE IF EXISTS `currencies`;

CREATE TABLE `currencies` (
    `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
    `country_id` int(9) unsigned NOT NULL,
    `code` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `symbol` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# TABLE STRUCTURE FOR: languages
#

DROP TABLE IF EXISTS `languages`;

CREATE TABLE `languages` (
    `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
    `country_id` int(9) unsigned NOT NULL,
    `iso639_1` varchar(255) NOT NULL,
    `iso639_2` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `nativeName` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# TABLE STRUCTURE FOR: regionalBlocs
#

DROP TABLE IF EXISTS `regionalBlocs`;

CREATE TABLE `regionalBlocs` (
    `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
    `country_id` int(9) unsigned NOT NULL,
    `acronym` varchar(255) NOT NULL,
    `name` varchar(100) NOT NULL,
    `otherAcronyms` text NOT NULL,
    `otherNames` text NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# TABLE STRUCTURE FOR: translations
#

DROP TABLE IF EXISTS `translations`;

CREATE TABLE `translations` (
    `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
    `country_id` int(9) unsigned NOT NULL,
    `de` varchar(255) NOT NULL,
    `es` varchar(255) NOT NULL,
    `fr` varchar(255) NOT NULL,
    `ja` varchar(255) NOT NULL,
    `it` varchar(255) NOT NULL,
    `br` varchar(255) NOT NULL,
    `pt` varchar(255) NOT NULL,
    `nl` varchar(255) NOT NULL,
    `hr` varchar(255) NOT NULL,
    `fa` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
