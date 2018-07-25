-- phpMyAdmin SQL Dump
-- version 3.3.7
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2018 年 07 月 09 日 20:18
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
-- 表的结构 `hs_sz_yi_member`
--

CREATE TABLE IF NOT EXISTS `hs_sz_yi_member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uniacid` int(11) DEFAULT '0',
  `uid` int(11) DEFAULT '0',
  `groupid` int(11) DEFAULT '0',
  `level` int(11) DEFAULT '0' COMMENT '会员等级',
  `agentid` int(11) DEFAULT '0' COMMENT '上级id',
  `openid` varchar(50) DEFAULT '',
  `realname` varchar(20) DEFAULT '',
  `mobile` varchar(11) DEFAULT '',
  `pwd` varchar(100) DEFAULT NULL,
  `weixin` varchar(100) DEFAULT '',
  `content` text,
  `createtime` int(10) DEFAULT '0',
  `agenttime` int(10) DEFAULT '0',
  `status` tinyint(1) DEFAULT '0',
  `isagent` tinyint(1) DEFAULT '0',
  `clickcount` int(11) DEFAULT '0',
  `agentlevel` int(11) DEFAULT '0',
  `bonuspluslevel` int(11) DEFAULT '0',
  `bonusplus_status` tinyint(1) DEFAULT '0',
  `bonuslevel` int(11) DEFAULT '0',
  `bonusgloballevel` int(11) NOT NULL DEFAULT '0',
  `bonusagentlevel` int(11) NOT NULL DEFAULT '0',
  `bonusagent_status` tinyint(1) NOT NULL DEFAULT '0',
  `bonus_area` tinyint(1) DEFAULT '0',
  `bonus_province` varchar(50) DEFAULT '',
  `bonus_city` varchar(50) DEFAULT '',
  `bonus_district` varchar(50) DEFAULT '',
  `bonus_area_commission` decimal(10,2) DEFAULT '0.00',
  `bonus_status` tinyint(1) DEFAULT '0',
  `bonusglobal_status` tinyint(1) NOT NULL DEFAULT '0',
  `noticeset` text,
  `nickname` varchar(255) DEFAULT '',
  `credit1` int(11) DEFAULT '0',
  `credit2` decimal(10,2) DEFAULT '0.00',
  `xunibi` decimal(20,2) NOT NULL COMMENT '虚拟币',
  `shengjijifen` decimal(20,2) NOT NULL COMMENT '升级积分',
  `gouwujifen` decimal(20,2) NOT NULL COMMENT '购物积分',
  `fengongsiprice` decimal(20,2) NOT NULL COMMENT '分公司奖金',
  `isfengongsi` tinyint(5) NOT NULL DEFAULT '0' COMMENT '是否分公司0-否1-是',
  `birthyear` varchar(255) DEFAULT NULL COMMENT '客户出生年',
  `birthmonth` varchar(255) DEFAULT NULL COMMENT '客户出生月',
  `birthday` varchar(255) DEFAULT NULL COMMENT '客户出生日',
  `gender` tinyint(3) DEFAULT '0' COMMENT '性别',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像图片',
  `province` varchar(255) DEFAULT NULL COMMENT '所在省',
  `city` varchar(255) DEFAULT NULL COMMENT '城市',
  `area` varchar(255) DEFAULT '',
  `childtime` int(11) DEFAULT '0',
  `inviter` int(11) DEFAULT '0',
  `agentnotupgrade` tinyint(3) DEFAULT '0',
  `agentselectgoods` tinyint(3) DEFAULT '0',
  `agentblack` tinyint(3) DEFAULT '0',
  `fixagentid` tinyint(3) DEFAULT '0',
  `regtype` tinyint(3) DEFAULT '1',
  `isbindmobile` tinyint(3) DEFAULT '0',
  `isjumpbind` tinyint(3) DEFAULT '0',
  `diymemberid` int(11) DEFAULT '0',
  `isblack` tinyint(3) DEFAULT '0',
  `diymemberdataid` int(11) DEFAULT '0',
  `diycommissionid` int(11) DEFAULT '0',
  `diycommissiondataid` int(11) DEFAULT '0',
  `diymemberfields` text,
  `diymemberdata` text,
  `diycommissionfields` text,
  `diycommissiondata` text,
  `referralsn` varchar(255) NOT NULL,
  `premiumlevel` int(11) DEFAULT '0',
  `premiumtime` int(11) DEFAULT '0',
  `alllevel` int(11) NOT NULL DEFAULT '0',
  `bonus_time` int(10) NOT NULL DEFAULT '0',
  `alipay` varchar(100) DEFAULT NULL COMMENT '支付宝账号',
  `bank_card` varchar(50) DEFAULT NULL COMMENT '银行卡号',
  `bank_name` varchar(50) DEFAULT NULL COMMENT '银行名称',
  PRIMARY KEY (`id`),
  KEY `idx_uniacid` (`uniacid`) USING BTREE,
  KEY `idx_shareid` (`agentid`) USING BTREE,
  KEY `idx_openid` (`openid`) USING BTREE,
  KEY `idx_status` (`status`) USING BTREE,
  KEY `idx_agenttime` (`agenttime`) USING BTREE,
  KEY `idx_isagent` (`isagent`) USING BTREE,
  KEY `idx_uid` (`uid`) USING BTREE,
  KEY `idx_groupid` (`groupid`) USING BTREE,
  KEY `idx_level` (`level`) USING BTREE
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC AUTO_INCREMENT=9 ;

--
-- 转存表中的数据 `hs_sz_yi_member`
--

INSERT INTO `hs_sz_yi_member` (`id`, `uniacid`, `uid`, `groupid`, `level`, `agentid`, `openid`, `realname`, `mobile`, `pwd`, `weixin`, `content`, `createtime`, `agenttime`, `status`, `isagent`, `clickcount`, `agentlevel`, `bonuspluslevel`, `bonusplus_status`, `bonuslevel`, `bonusgloballevel`, `bonusagentlevel`, `bonusagent_status`, `bonus_area`, `bonus_province`, `bonus_city`, `bonus_district`, `bonus_area_commission`, `bonus_status`, `bonusglobal_status`, `noticeset`, `nickname`, `credit1`, `credit2`, `xunibi`, `shengjijifen`, `gouwujifen`, `fengongsiprice`, `isfengongsi`, `birthyear`, `birthmonth`, `birthday`, `gender`, `avatar`, `province`, `city`, `area`, `childtime`, `inviter`, `agentnotupgrade`, `agentselectgoods`, `agentblack`, `fixagentid`, `regtype`, `isbindmobile`, `isjumpbind`, `diymemberid`, `isblack`, `diymemberdataid`, `diycommissionid`, `diycommissiondataid`, `diymemberfields`, `diymemberdata`, `diycommissionfields`, `diycommissiondata`, `referralsn`, `premiumlevel`, `premiumtime`, `alllevel`, `bonus_time`, `alipay`, `bank_card`, `bank_name`) VALUES
(1, 1, 0, 0, 0, 0, 'oZH4N1fJ2tBroxGW-8-6qb5UZaq4', 'hansen', '13755555566', 'c4ca4238a0b923820dcc509a6f75849b', '1', '', 1517553797, 1517553797, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', 0.00, 0, 0, NULL, '老司机', 1000, 9690.00, 1100.36, 0.00, 0.00, 0.00, 0, '2010', '06', '29', 1, 'http://huang.iiio.top/attachment/images/1/2018/06/MjPxSm1mPCd28jCd1MR8s1pccKz6j3.png', '广东省', '广州市', '', 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, '', 0, 0, 0, 0, '', '', ''),
(2, 1, 0, 0, 0, 1, 'oZH4N1SPbBaX9_Sj4r4rWrTWVv6Y', 'ycy', '13700000000', 'c4ca4238a0b923820dcc509a6f75849b', '41277', NULL, 1517581934, 1517581934, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', 0.00, 0, 0, NULL, 'cy', 1000, 10000.00, 0.00, 0.00, 0.00, 0.00, 0, '0', '0', '0', 1, 'http://huang.iiio.top/attachment/images/1/2018/07/C36aUQA6U6aU47EGNn666vFqQCva3E.jpg', '请选择省份', '请选择城市', '', 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, '', 0, 0, 0, 0, NULL, NULL, NULL),
(3, 1, 0, 0, 0, 1, 'oZH4N1fkKgckhLEcC_bYOwn651TI', 'chc', '13711111111', 'c4ca4238a0b923820dcc509a6f75849b', '0104174', NULL, 1517554893, 1517554893, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', 0.00, 0, 0, NULL, '马云', 1000, 10000.00, 0.00, 0.00, 0.00, 0.00, 0, '0', '0', '0', 1, 'http://huang.iiio.top/attachment/images/1/2018/07/p6QB0qicTqN30qQw0dqtDqBNnqbWqQ.gif', '请选择省份', '请选择城市', '', 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, '', 0, 0, 0, 0, NULL, NULL, NULL),
(4, 1, 0, 0, 0, 1, 'oZH4N1ZaX0ODW28owSh6t7MHA6bk', 'asd', '13722222222', 'c4ca4238a0b923820dcc509a6f75849b', '13722222222', NULL, 1517583339, 1517583339, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', 0.00, 0, 0, NULL, 'sd', 1000, 10000.00, 0.00, 0.00, 0.00, 0.00, 0, '2000', '06', '29', 1, 'http://huang.iiio.top/attachment/images/1/2018/06/Yh2wPrK0wT1R1kkbsHwWBqRWRf2KHN.jpg', '上海市', '上海辖区', '', 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, '', 0, 0, 0, 0, NULL, NULL, NULL),
(5, 1, 0, 0, 0, 1, 'oZH4N1eRD4HPpsX85J7szBjai7ag', '倪妮', '13733333333', 'c4ca4238a0b923820dcc509a6f75849b', '1234567', NULL, 1517583705, 1517583705, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', 0.00, 0, 0, NULL, '妮妮', 1000, 977600.00, 0.00, 0.00, 0.00, 0.00, 0, '1998', '06', '06', 2, 'http://huang.iiio.top/attachment/images/1/2018/06/f5ISf0kid4ix5d34K53nF0N3dT3SQ5.jpg', '上海市', '上海辖区', '', 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, '', 0, 0, 0, 0, NULL, NULL, NULL),
(6, 1, 0, 0, 0, 2, 'oZH4N1UAc_Hm92Nx0tclVlOfM9fA', '爱丽丝', '13744444466', '202cb962ac59075b964b07152d234b70', '12', '', 1517584741, 1517584741, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', 0.00, 0, 0, NULL, '空空', 1000, 10000.00, 0.00, 0.00, 0.00, 0.00, 0, '1998', '06', '21', 2, 'http://huang.iiio.top/attachment/images/1/2018/06/WO36U4LZ6l363CuzT3zYQ034nO3yu3.jpeg', '广东省', '广州市', '', 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, '', 0, 0, 0, 0, NULL, NULL, NULL),
(7, 1, 0, 0, 4, 3, 'oZH4N1TrCiVRkl2RBdSsi_tFh3HU', '逆袭', '13755555555', 'c4ca4238a0b923820dcc509a6f75849b', '123', '', 1517584784, 1517584784, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', 0.00, 0, 0, NULL, '夜', 10000, 99999999.99, 1000.00, 0.00, 0.00, 0.00, 0, '1993', '08', '16', 1, 'http://huang.iiio.top/attachment/images/1/2018/06/EB9iCDCDzSy9yBy2nM29zdS9iZYBdF.jpg', '广东省', '广州市', '', 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, '', 0, 0, 0, 0, NULL, NULL, NULL);
