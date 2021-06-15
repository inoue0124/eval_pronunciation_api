-- -----------------------------------------------------
-- Schema eval-speech
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `eval-speech` DEFAULT CHARACTER SET utf8mb4;
USE `eval-speech` ;

-- -----------------------------------------------------
-- Table `eval-speech`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eval-speech`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(200) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  `type` INT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
) CHARACTER SET utf8mb4;


-- -----------------------------------------------------
-- Table `eval-speech`.`teachers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eval-speech`.`teachers` (
  `user_id` INT NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `gender` INT NULL,
  `birth_date` DATETIME NULL,
  `birth_place` INT NULL,
  `year_of_learning` INT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_tearcher_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `eval-speech`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) CHARACTER SET utf8mb4;


-- -----------------------------------------------------
-- Table `eval-speech`.`learners`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eval-speech`.`learners` (
  `user_id` INT NOT NULL,
  `teacher_id` INT NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `gender` INT NULL,
  `birth_date` DATETIME NULL,
  `birth_place` INT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  INDEX `fk_learner_teacher_id_idx` (`teacher_id` ASC),
  CONSTRAINT `fk_learner_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `eval-speech`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_learner_teacher_id`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `eval-speech`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) CHARACTER SET utf8mb4;


-- -----------------------------------------------------
-- Table `eval-speech`.`units`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eval-speech`.`units` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `teacher_id` INT NOT NULL,
  `name` VARCHAR(200) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_teacher_id` (`teacher_id` ASC),
  CONSTRAINT `fk_unit_teacher_id`
    FOREIGN KEY (`id`)
    REFERENCES `eval-speech`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) CHARACTER SET utf8mb4;


-- -----------------------------------------------------
-- Table `eval-speech`.`teacher_speeches`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eval-speech`.`teacher_speeches` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `teacher_id` INT NOT NULL,
  `text` VARCHAR(1000) NULL,
  `object_key` VARCHAR(200) NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_model_speech_teacher_id_idx` (`teacher_id` ASC),
  CONSTRAINT `fk_model_speech_teacher_id`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `eval-speech`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) CHARACTER SET utf8mb4;


-- -----------------------------------------------------
-- Table `eval-speech`.`learner_speeches`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eval-speech`.`learner_speeches` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `learner_id` INT NULL,
  `unit_id` INT NULL,
  `teacher_speech_id` INT NULL,
  `type` INT NULL,
  `object_key` VARCHAR(200) NULL,
  `gop_average` DOUBLE NULL,
  `gop_file_key` VARCHAR(200) NULL,
  `dtw_average` DOUBLE NULL,
  `dtw_file_key` VARCHAR(200) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_learner_id_idx` (`learner_id` ASC),
  INDEX `fk_unit_id_idx` (`unit_id` ASC),
  INDEX `fk_teacher_id_idx` (`teacher_speech_id` ASC),
  CONSTRAINT `fk_learner_speech_learner_id`
    FOREIGN KEY (`learner_id`)
    REFERENCES `eval-speech`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_learner_speech_unit_id`
    FOREIGN KEY (`unit_id`)
    REFERENCES `eval-speech`.`units` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_learner_speech_teacher_speech_id`
    FOREIGN KEY (`teacher_speech_id`)
    REFERENCES `eval-speech`.`teacher_speeches` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) CHARACTER SET utf8mb4;


-- -----------------------------------------------------
-- Table `eval-speech`.`units_teacher_speeches`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eval-speech`.`units_teacher_speeches` (
  `unit_id` INT NOT NULL,
  `teacher_speech_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `fk_md_unit_id_idx` (`unit_id` ASC),
  INDEX `fk_md_teacher_speech_id_idx` (`teacher_speech_id` ASC),
  CONSTRAINT `fk_md_unit_id`
    FOREIGN KEY (`unit_id`)
    REFERENCES `eval-speech`.`units` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_md_teacher_speech_id`
    FOREIGN KEY (`teacher_speech_id`)
    REFERENCES `eval-speech`.`teacher_speeches` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) CHARACTER SET utf8mb4;
