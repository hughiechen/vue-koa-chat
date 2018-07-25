-- phpMyAdmin SQL Dump
-- version 3.3.7
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2018 年 07 月 10 日 07:41
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
-- 表的结构 `hs_sz_yi_friend_succeed`
--

CREATE TABLE IF NOT EXISTS `hs_sz_yi_friend_succeed` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '申请人id',
  `addid` int(11) NOT NULL COMMENT '被添加人id',
  `realname` varchar(20) DEFAULT NULL COMMENT '申请人名字',
  `avatar` varchar(255) DEFAULT NULL COMMENT '申请人头像',
  `addname` varchar(20) DEFAULT NULL COMMENT '被添加人名字',
  `addavatar` varchar(255) DEFAULT NULL COMMENT '被添加人头像',
  `mobile` varchar(11) DEFAULT NULL COMMENT '申请人的号码',
  `mobile1` varchar(11) DEFAULT NULL COMMENT '被添加人的号码',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='好友表' AUTO_INCREMENT=59 ;

--
-- 转存表中的数据 `hs_sz_yi_friend_succeed`
--

INSERT INTO `hs_sz_yi_friend_succeed` (`id`, `uid`, `addid`, `realname`, `avatar`, `addname`, `addavatar`, `mobile`, `mobile1`) VALUES
(56, 5, 6, '倪妮', 'http://huang.iiio.top/attachment/images/1/2018/06/f5ISf0kid4ix5d34K53nF0N3dT3SQ5.jpg', '爱丽丝', 'http://huang.iiio.top/attachment/images/1/2018/06/WO36U4LZ6l363CuzT3zYQ034nO3yu3.jpeg', '13733333333', '13744444466'),
(55, 5, 7, '倪妮', 'http://huang.iiio.top/attachment/images/1/2018/06/f5ISf0kid4ix5d34K53nF0N3dT3SQ5.jpg', '逆袭', 'http://huang.iiio.top/attachment/images/1/2018/06/EB9iCDCDzSy9yBy2nM29zdS9iZYBdF.jpg', '13733333333', '13755555555'),
(54, 3, 5, 'chc', 'http://huang.iiio.top/attachment/images/1/2018/07/p6QB0qicTqN30qQw0dqtDqBNnqbWqQ.gif', '倪妮', 'http://huang.iiio.top/attachment/images/1/2018/06/f5ISf0kid4ix5d34K53nF0N3dT3SQ5.jpg', '13711111111', '13733333333'),
(53, 4, 5, 'asd', 'http://huang.iiio.top/attachment/images/1/2018/06/Yh2wPrK0wT1R1kkbsHwWBqRWRf2KHN.jpg', '倪妮', 'http://huang.iiio.top/attachment/images/1/2018/06/f5ISf0kid4ix5d34K53nF0N3dT3SQ5.jpg', '13722222222', '13733333333'),
(57, 1, 5, 'hansen', 'http://huang.iiio.top/attachment/images/1/2018/06/MjPxSm1mPCd28jCd1MR8s1pccKz6j3.png', '倪妮', 'http://huang.iiio.top/attachment/images/1/2018/06/f5ISf0kid4ix5d34K53nF0N3dT3SQ5.jpg', '13755555566', '13733333333'),
(58, 2, 5, 'ycy', 'http://huang.iiio.top/attachment/images/1/2018/07/C36aUQA6U6aU47EGNn666vFqQCva3E.jpg', '倪妮', 'http://huang.iiio.top/attachment/images/1/2018/06/f5ISf0kid4ix5d34K53nF0N3dT3SQ5.jpg', '13700000000', '13733333333');
