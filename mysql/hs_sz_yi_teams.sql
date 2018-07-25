-- phpMyAdmin SQL Dump
-- version 3.3.7
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2018 年 07 月 10 日 10:58
-- 服务器版本: 5.1.69
-- PHP 版本: 5.2.17p1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `huang_iiio`
--

-- --------------------------------------------------------

--
-- 表的结构 `hs_sz_yi_teams`
--

CREATE TABLE IF NOT EXISTS `hs_sz_yi_teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '群id',
  `team_host_id` int(11) NOT NULL COMMENT '建群人id',
  `createtime` int(10) DEFAULT NULL COMMENT '创建时间',
  `teamName` varchar(20) NOT NULL COMMENT '群聊名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='建立的群表' AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `hs_sz_yi_teams`
--

