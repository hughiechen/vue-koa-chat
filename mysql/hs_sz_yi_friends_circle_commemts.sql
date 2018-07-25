-- phpMyAdmin SQL Dump
-- version 3.3.7
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2018 年 07 月 21 日 15:01
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
-- 表的结构 `hs_sz_yi_friends_circle_commemts`
--

CREATE TABLE IF NOT EXISTS `hs_sz_yi_friends_circle_commemts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postId` int(11) NOT NULL COMMENT '动态id',
  `commentId` int(11) NOT NULL COMMENT '评论人id',
  `commentName` varchar(255) DEFAULT NULL COMMENT '评论人名称',
  `likes` int(11) DEFAULT '0' COMMENT '是否点赞，0为未点赞，1为点赞',
  `commentText` varchar(255) NOT NULL COMMENT '评论内容',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='朋友圈评论表' AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `hs_sz_yi_friends_circle_commemts`
--

