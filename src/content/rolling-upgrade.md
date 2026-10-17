---
type: article
title: Rolling Upgrade™
excerpt: Or how we upgraded a 300k line PHP codebase while continuing the development of new features and bug fixing.
timestamp: 2024-05-14
published: true
---


# Rolling Upgrade™

You're part of a small team with four developers, juggling product roadmap deadlines, bug fixes, customer support, and the need to upgrade a 300k-line PHP codebase—all without pausing development. How do you do it?

With tight deadlines, we could only allocate one developer to the upgrade, but that meant it would take weeks. Meanwhile, the rest of the team would keep updating the codebase with new features and bug fixes, leading to a nightmare of merge conflicts.

Our solution? Automate the upgrade process. I dedicated about 30% of my time to writing a script capable of upgrading the codebase with a single click, what we jokingly called in hindsight Rolling Upgrade™.

## The approach

The project was a backend for a web app with 300k lines of PHP 5.6 code using Symfony 2.7. The goal was to upgrade to PHP 8.1 and Symfony 6.4—the latest versions at the time. The app handled database migrations, generated Excel files, created PDFs, sent emails, uploaded images, processed customer billing, interacted with SOAP servers, and more. The number of vendor dependencies was significant.

Upgrading PHP itself wasn’t too difficult. The main challenge was ensuring compatibility with 8.1 by updating deprecated syntax. The real problem lay in updating vendor dependencies, as all of them had to be upgraded to versions compatible with PHP 8.1.

We systematically reviewed each vendor, determined the correct version, found upgrade guides, and modified our upgrade script accordingly. Some vendors were deprecated and unsupported for PHP 8.1, requiring replacements and adjustments in our automation process.

Symfony's upgrade was more complex. Despite excellent documentation, the changes included new folder structures, namespace updates, configuration adjustments, the introduction of secrets, type-hinted dependency injection, a new database migration system, and more.

To move from Symfony 2.7 to 6.4, we had to navigate four major and sixteen minor version upgrades:

![Symfony versions](/posts/rolling-upgrade/symfony-versions.png)

We studied each intermediate upgrade guide, identified the impact on our codebase, and automated the required modifications. This included new configurations, folder restructuring, and best practices we chose to adopt for long-term maintainability.

## The script

The script was a bash file that cloned the codebase, applied structural changes, and updated files using regex, rsync, find, sed, and custom PHP scripts. Docker containers were used to execute Composer and Symfony console commands. At each step, the script committed changes to create debugging checkpoints.

An extract from the bash script where it updates entity manager injection:

```bash
log "Update entity manager injection to allow type-hintyng in services"
find $S6_DIR/src/ $S6_DIR/tests/ -type f -exec gsed -i -E -e 's/\$\bem\b/\$coreEm/g' {} +
find $S6_DIR/src/ $S6_DIR/tests/ -type f -exec gsed -i -E -e 's/->em\b/->coreEm/g' {} +
find $S6_DIR/src/ $S6_DIR/tests/ -type f -exec gsed -i -E -e 's/\$\bthis->em\b/\$this->coreEm/g' {} +
find $S6_DIR/src/ $S6_DIR/tests/ -type f -exec gsed -i -E -e 's/->get\("doctrine"\)->getManager\('"'"'access'"'"'\)/->get\('"'"'doctrine.orm.access_entity_manager'"'"'\)/g' {} +
find $S6_DIR/src/ $S6_DIR/tests/ -type f -exec gsed -i -E -e 's/->get\("doctrine"\)->getManager\('"'"'default'"'"'\)/->get\('"'"'doctrine.orm.core_entity_manager'"'"'\)/g' {} +
find $S6_DIR/src/ $S6_DIR/tests/ -type f -exec gsed -i -E -e 's/->get\('"'"'doctrine'"'"'\)->getManager\('"'"'default'"'"'\)/->get\('"'"'doctrine.orm.core_entity_manager'"'"'\)/g' {} +
commit "UPDATE: entity manager injection to allow type-hinting in services" $S6_DIR
```

Here we replace PHPExcel with PhpSpreadsheet using RectorPHP:

```bash
log "Replace PHPExcel -> PhpSpreadsheet with rector"
docker exec upgrade-php-8 composer require --no-interaction --with-all-dependencies --working-dir=/var/www/api.s6 --dev rector/rector rector/rector-phpoffice
docker exec upgrade-php-8 /bin/ash -c "cd /var/www/api.s6/ && php bin/console cache:pool:clear cache.global_clearer"
docker cp $CONFIG/rector.php upgrade-php-8:/var/www/api.s6/
docker cp $CONFIG/phpoffice upgrade-php-8:/var/www/api.s6/vendor
docker exec upgrade-php-8 /bin/ash -c "cd /var/www/api.s6/ && vendor/bin/rector process src"
docker exec upgrade-php-8 composer remove --no-interaction --with-all-dependencies --working-dir=/var/www/api.s6 --dev rector/rector rector/rector-phpoffice
commit "UPDATE: replace PHPExcel -> PhpSpreadsheet with rector" $S6_DIR
```

Here an extract from the PHP script that adds `getSubscribedServices()` to each controllers to make them work with the new dependency injection system:

```php
// Find the class definition in the controller with a regex
// (use PREG_OFFSET_CAPTURE to get the match offset (in bytes))
$matchClass = '/class.*[\n\r]*{/';
preg_match($matchClass, $content, $matches, PREG_OFFSET_CAPTURE);
list($capture, $offset) = $matches[0];

$capturedLengh = strlen($capture); // lenght of the matched string
$insertPosition = $offset + $capturedLengh; // position where to insert the text
$parts = str_split($content, $insertPosition); // split the file content in the insert position
$beforeText = array_shift($parts); // this is the text befor the inset position
$afterText = implode($parts); // this is the text after the insert position

// Search all the container call like  $this->container->get(XXX) and extract the asked services.
$matchServices = '/\$this\s*->container\s*->get\(\s*(\'|")(?<service>[.\-\w]*)(\'|")\s*\)/';
preg_match_all($matchServices, $content, $matchedServices);
...
// The new text to intert
$glue = ",\n            "; // keep the spaces for indentation
$subscribers = implode($glue, $serviceDefinitions);
$newText = <<<EOF
    public static function getSubscribedServices(): array
    {
        return array_merge(parent::getSubscribedServices(), [{$subscribers}]);
    }
EOF;
```

At the end, the script consisted of a 1,200+ line of bash, 500+ lines of PHP and YAML configuration files, and over 500 commits.

## The outcome

After 20 months of work—yes, months, not weeks—we finally pulled the trigger:

```bash
sh ./run.sh
# Several minutes later…
Done, checkout the codebase with Symfony 6.4 and PHP 8.1 in $S6_DIR
```

We swapped the old codebase with the new one, preserved the .git folder, and committed the changes. A single commit modified every file in the repository.

This wasn’t an easy task. At times, we doubted whether we'd ever finish, but we knew it was necessary, so we pushed through. Choosing to automate the upgrade instead of freezing feature development was the right call. It required a significant upfront effort, but it made the process testable and repeatable. Post-upgrade, we immediately saw benefits: PHP 8.1’s performance boost, a cleaner codebase free of deprecated dependencies, and access to new Symfony features.

We realized our team was capable of handling more complexity than we had thought. More importantly, we understood that neglecting updates led to a far greater effort down the line. Through this upgrade, I learned advanced bash scripting, how to analyze vendor upgrade paths, how to balance long-term projects with daily development, and most importantly, how to persist through seemingly endless tasks—because eventually, even a 20-month upgrade gets done.
