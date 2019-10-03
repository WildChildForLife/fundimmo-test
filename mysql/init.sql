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
    `callingCodes` text NULL,
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
    `currencies` text NULL,
    `languages` text NULL,
    `translations` text NULL,
    `flag` text NULL,
    `regionalBlocs` text NULL,
    `cioc` varchar(255) NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `createdAt` varchar(255) NULL,
    `ip` varchar(255) NOT NULL,
    `type` varchar(10) NOT NULL,
    `url` varchar(255) NOT NULL,
    `status` int(11) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
