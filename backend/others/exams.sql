-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2021 at 07:52 AM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mini_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` varchar(50) NOT NULL,
  `course` varchar(50) NOT NULL,
  `theory1` varchar(100) NOT NULL,
  `exam1` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `course`, `theory1`, `exam1`, `theory2`, `exam2`) VALUES
('ed9f3214-772b-4ad8-81b1-41717b69daf3', 'test course one', 'Amazon.com, Inc. is an American multinational technology company which focuses on e-commerce, cloud ', '{\"question\": \"Who is the founder of amazon\",\r\n\"answers\":[\r\n{\"answer\": \"Bill Gates\", \"correct\": \"false\"},\r\n{\"answer\": \"Jeff Besos\", \"correct\": \"true\"},\r\n{\"answer\": \"Elorn Mulsk\", \"correct\": \"false\"},\r\n{\"answer\": \"Mark Zuckerburg\", \"correct\": \"false\"}]\r\n}', 'test theory two', '{\"question\": \"Who is the founder of amazon\",\r\n\"answers\":[\r\n{\"answer\": \"Bill Gates\", \"correct\": \"false\"},\r\n{\"answer\": \"Jeff Besos\", \"correct\": \"true\"},\r\n{\"answer\": \"Elorn Mulsk\", \"correct\": \"false\"},\r\n{\"answer\": \"Mark Zuckerburg\", \"correct\": \"false\"}]\r\n}');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
