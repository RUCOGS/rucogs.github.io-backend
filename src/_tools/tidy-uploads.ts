import {
  isSelfHostedFile,
  selfHostedToRelativeFilePath,
  tryDeleteFileIfSelfHosted,
  UPLOAD_DIRECTORY,
} from '@src/controllers/cdn.controller';
import { startServer } from '@src/misc/server-constructor';
import glob from 'glob';
import path from 'path';
import prompts from 'prompts';

async function main() {
  const result = await startServer(false);

  const usedFiles = new Set<string>();
  const entitiesLimitPerCycle = 100;

  let skip = 0;
  let users = [];
  do {
    const users = await result.unsecuredEntityManager.user.findAll({
      limit: entitiesLimitPerCycle,
      skip: skip++,
      projection: {
        avatarLink: true,
        bannerLink: true,
      },
    });
    for (const user of users) {
      if (user.avatarLink && isSelfHostedFile(user.avatarLink))
        usedFiles.add(selfHostedToRelativeFilePath(user.avatarLink));
      if (user.bannerLink && isSelfHostedFile(user.bannerLink))
        usedFiles.add(selfHostedToRelativeFilePath(user.bannerLink));
    }
  } while (users.length > 0);
  users = [];

  skip = 0;
  let eBoards = [];
  do {
    const eBoards = await result.unsecuredEntityManager.eBoard.findAll({
      limit: entitiesLimitPerCycle,
      skip: skip++,
      projection: {
        avatarLink: true,
        bannerLink: true,
      },
    });
    for (const eBoard of eBoards) {
      if (eBoard.avatarLink && isSelfHostedFile(eBoard.avatarLink))
        usedFiles.add(selfHostedToRelativeFilePath(eBoard.avatarLink));
    }
  } while (eBoards.length > 0);
  eBoards = [];

  skip = 0;
  let projects = [];
  do {
    const projects = await result.unsecuredEntityManager.project.findAll({
      limit: entitiesLimitPerCycle,
      skip: skip++,
      projection: {
        cardImageLink: true,
        bannerLink: true,
        galleryImageLinks: true,
      },
    });
    for (const project of projects) {
      if (project.cardImageLink && isSelfHostedFile(project.cardImageLink))
        usedFiles.add(selfHostedToRelativeFilePath(project.cardImageLink));
      if (project.bannerLink && isSelfHostedFile(project.bannerLink))
        usedFiles.add(selfHostedToRelativeFilePath(project.bannerLink));
      if (project.galleryImageLinks) {
        for (const galleryImageLink of project.galleryImageLinks) {
          if (isSelfHostedFile(galleryImageLink)) usedFiles.add(selfHostedToRelativeFilePath(galleryImageLink));
        }
      }
    }
  } while (projects.length > 0);
  projects = [];

  console.log('🔍 Found used files:');
  for (const file of usedFiles.values()) {
    console.log(`\t- ${file}`);
  }
  console.log();

  glob(`${UPLOAD_DIRECTORY}/**/*`, async (err, existingFiles) => {
    if (err) {
      console.log(`🛑 Glob failed! ${err}`);
      return;
    }
    existingFiles = existingFiles.map((x) => {
      const parsedPath = path.parse(x);
      return parsedPath.dir.substring(UPLOAD_DIRECTORY.length + 1) + parsedPath.base;
    });
    const unusedFiles = [];
    console.log('📦 Found existing files:');
    for (const existingFile of existingFiles) {
      console.log(`\t- ${existingFile}`);
      if (!usedFiles.has(existingFile)) unusedFiles.push(existingFile);
    }
    console.log();

    if (unusedFiles.length === 0) {
      console.log('🚀 Found no unused files.');
      return process.exit();
    }

    console.log('🚀 Found unused files:');
    for (const unusedFile of unusedFiles) {
      console.log(`\t- ${unusedFile}`);
    }

    const promptResult = await prompts({
      type: 'confirm',
      name: 'confirmed',
      message: 'Delete unused files?',
    });
    if (promptResult.confirmed) {
      for (const file of unusedFiles) {
        await tryDeleteFileIfSelfHosted('cdn://' + file);
      }
      console.log(`🗑️ Deleted ${unusedFiles.length} unused files.`);
    }

    process.exit();
  });
}

main();
