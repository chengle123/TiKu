/*
Navicat MySQL Data Transfer

Source Server         : 10.51.16.40
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : answer_gather

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2018-01-17 17:38:40
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for issue
-- ----------------------------
DROP TABLE IF EXISTS `issue`;
CREATE TABLE `issue` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `qid` int(25) DEFAULT '0',
  `select` varchar(100) DEFAULT NULL,
  `resolve` varchar(120) DEFAULT NULL,
  `answer` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=11836 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
