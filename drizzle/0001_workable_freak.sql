CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`originalText` text NOT NULL,
	`correctedText` text,
	`faseehScore` int,
	`errorCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grammarErrors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`errorType` varchar(100) NOT NULL,
	`position` int NOT NULL,
	`originalText` varchar(500) NOT NULL,
	`suggestion` varchar(500) NOT NULL,
	`explanation` text,
	`severity` varchar(20) DEFAULT 'medium',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grammarErrors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `terminology` (
	`id` int AUTO_INCREMENT NOT NULL,
	`arabicTerm` varchar(255) NOT NULL,
	`englishTerm` varchar(255),
	`category` varchar(100),
	`definition` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `terminology_id` PRIMARY KEY(`id`),
	CONSTRAINT `terminology_arabicTerm_unique` UNIQUE(`arabicTerm`)
);
