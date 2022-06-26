import { createUnsecureEntityManager } from '@src/controllers/entity-manager.controller';
import { Access, RoleCode, UserInsertInput } from '@src/generated/model.types';
import { EntityManager } from '@src/generated/typetta';
import { startServer } from '@src/misc/server-constructor';
import { getRolesOfType, RoleDataList, RoleType } from '@src/shared/security';
import { mock } from '@twinlogix/typetta';
import { ObjectId } from 'mongodb';
import { create } from 'random-seed';
import { paragraph } from 'txtgen';

const randInst = create('seed');

async function startMockServer() {
  mock.idSpecifications = {
    ID: {
      generate: () => new ObjectId(),
      stringify: (t: unknown) => (t as ObjectId).toString(),
    },
  };

  await startServer(true, true);

  const unsecure = createUnsecureEntityManager('mock');
  const userIds = await generateUsers(unsecure, 100);
  const projectIds = await generateProjects(unsecure, userIds, 50);
  const eboardIds = await generateEBoard(unsecure, userIds, 10);

  console.log('🥸 Mock server configured!');
}

async function generateEBoard(unsecure: EntityManager, userIds: string[], count: number) {
  const portraits = [
    'https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg',
    'https://i.pinimg.com/236x/a3/ac/1e/a3ac1ed5abaedffd9947face7901e14c.jpg',
    'https://www.peerspace.com/resources/wp-content/uploads/best-vancouver-portrait-photographers-754x600.png',
  ];

  const validEBoardRoles = getRolesOfType(RoleType.EBoard)
    .filter((x) => x.roleCode !== RoleCode.Eboard)
    .map((x) => x.roleCode);

  let eBoardIds: string[] = [];
  for (let i = 0; i < count; i++) {
    const id = userIds[i];
    const user = await unsecure.user.findOne({ filter: { id } });
    if (!user) throw Error("User doesn't exist in Mock generation!");
    await unsecure.user.updateOne({
      filter: { id },
      changes: {
        username: 'eboard_' + user?.username,
      },
    });
    const eBoard = await unsecure.eBoard.insertOne({
      record: {
        bio: paragraph(3),
        userId: user.id,
        avatarLink: getRandElem(portraits),
      },
    });
    eBoardIds.push(eBoard.id);

    // Generate eboard terms
    const start = randInst(5);
    const randTerms = randInst.range(5) + 1;
    for (let i = 0; i < randTerms; i++) {
      const term = await unsecure.eBoardTerm.insertOne({
        record: {
          eBoardId: eBoard.id,
          year: new Date().getFullYear() - (i - start),
        },
      });

      const roleCodes = randInst.range(2) ? getRandomSubarray(validEBoardRoles, randInst.range(3) + 1) : [];
      roleCodes.push(RoleCode.Eboard);

      for (const roleCode of roleCodes) {
        await unsecure.eBoardTermRole.insertOne({
          record: {
            termId: term.id,
            roleCode,
          },
        });
      }
    }
  }
  return eBoardIds;
}

async function generateProjects(unsecure: EntityManager, userIds: string[], count: number) {
  const banners = [
    'https://i.guim.co.uk/img/media/c6f7b43fa821d06fe1ab4311e558686529931492/168_84_1060_636/master/1060.jpg?width=1020&quality=85&auto=format&fit=max&s=e4648b544f7b2578fca68c11a3f054de',
    'https://cdn1.epicgames.com/400347196e674de89c23cc2a7f2121db/offer/AC%20KINGDOM%20PREORDER_STANDARD%20EDITION_EPIC_Key_Art_Portrait_640x854-640x854-288120c5573756cb988b6c1968cebd86.png',
    'https://www.topgear.com/sites/default/files/news-listicle/image/8_rocket_league.jpg',
    'https://d1e00ek4ebabms.cloudfront.net/production/551a8404-fe88-4357-bdcb-02014724329e.jpg',
    'https://cdn1.dotesports.com/wp-content/uploads/2020/09/02125331/TopBanner_com.innersloth.spacemafia.jpg',
    'https://cdn.vox-cdn.com/thumbor/Xm1C9TWbMK55zAnuR09oD6XMyRI=/0x0:1024x1024/1200x800/filters:focal(444x567:606x729)/cdn.vox-cdn.com/uploads/chorus_image/image/65813576/mobile_MarioKartTour_screen_01.0.png',
    'https://media.contentapi.ea.com/content/dam/gin/images/2021/06/battlefield-2042-key-art.jpg.adapt.crop1x1.767p.jpg',
    'https://media0.giphy.com/media/j5ThXdq3wTKdW/200.gif',
    'https://c.tenor.com/2JkeSn_SOSwAAAAC/kirby-falling.gif',
    'https://media.contentapi.ea.com/content/dam/masseffect/images/2020/10/me-featured-image-mele-keyart-logo.jpg.adapt.crop16x9.1023w.jpg',
    'https://upload.wikimedia.org/wikipedia/en/1/14/Halo_Infinite.png',
    'https://upload.wikimedia.org/wikipedia/en/f/f6/Hw2_coverart.png',
    'https://c.tenor.com/9wI_bxPl3LIAAAAC/thumbs-up-bt7274.gif',
    'https://cdn.akamai.steamstatic.com/steam/apps/1237970/capsule_616x353.jpg?t=1619804815',
    'https://static-cdn.jtvnw.net/ttv-boxart/21465_IGDB-272x380.jpg',
    'https://cdn.cdkeys.com/700x700/media/catalog/product/f/i/fifa-22-pc-game-origin-cover_14_.jpg',
  ];

  const words = [
    'pick',
    'module',
    'kneel',
    'voucher',
    'piano',
    'confront',
    'delicate',
    'premature',
    'father',
    'intervention',
    'conscious',
    'conflict',
    'illustrate',
    'left',
    'terrace',
    'flock',
    'color-blind',
    'incredible',
    'approve',
    'conversation',
  ];

  const validMemberRoles = getRolesOfType(RoleType.ProjectMember)
    .filter((x) => x.roleCode !== RoleCode.ProjectMember)
    .map((x) => x.roleCode);

  async function addProjectMembersFor(
    projectId: string,
    createdAt: number,
    updatedAt: number,
    memberCount: number = randInst.range(20) + 1,
  ) {
    for (const userId of getRandomSubarray(userIds, memberCount)) {
      const memberResult = await unsecure.projectMember.insertOne({
        record: {
          userId,
          contributions: paragraph(3),
          projectId,
          createdAt,
          updatedAt,
        },
      });

      const roleCodes = randInst.range(2) ? getRandomSubarray(validMemberRoles, validMemberRoles.length) : [];
      roleCodes.push(RoleCode.ProjectMember);

      for (const roleCode of roleCodes) {
        await unsecure.projectMemberRole.insertOne({
          record: {
            projectMemberId: memberResult.id,
            roleCode,
          },
        });
      }
    }
  }

  async function insertMinecraft() {
    const createdAt = Date.now() + randDuration();
    const updatedAt = createdAt + randDuration(0.1);
    const completedAt = updatedAt + randDuration();
    const projectResult = await unsecure.project.insertOne({
      record: {
        access: Access.Open,
        name: 'Minecraft',
        pitch:
          "Minecraft is a 3-D computer game where players can build anything. The game which has been described as like an 'online Lego' involves building blocks and creating structures across different environments and terrains. Set in a virtual world the game involves resource gathering, crafting items, building, and combat.",
        description: `
# About
  
Minecraft is a 3-D computer game where players can build anything. The game which has been described as like an 'online Lego' involves building blocks and creating structures across different environments and terrains. Set in a virtual world the game involves resource gathering, crafting items, building, and combat.Minecraft is a 3-D computer game where players can build anything. The game which has been described as like an 'online Lego' involves building blocks and creating structures across different environments and terrains. Set in a virtual world the game involves resource gathering, crafting items, building, and combat.
  
## Process

Minecraft is a 3-D computer game where players can build anything. The game which has been described as like an 'online Lego' involves building blocks and creating structures across different environments and terrains. Set in a virtual world the game involves resource gathering, crafting items, building, and combat.

## Conclusion

Minecraft is a 3-D computer game where players can build anything. The game which has been described as like an 'online Lego' involves building blocks and creating structures across different environments and terrains. Set in a virtual world the game involves resource gathering, crafting items, building, and combat.`,
        bannerLink: 'https://img.redbull.com/images/redbullcom/2020/4/28/bjoyslzjb3uxqyg82uz2/minecraft0400w',
        cardImageLink:
          'https://cdn.vox-cdn.com/thumbor/l9a45cx4ZfppNgzhQ5H3EX6glvs=/1400x1050/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/19355555/jbareham_191158_ply0958_decade_minecraft.jpg',
        downloadLinks: [`https://fake${randId(4)}.com`],
        galleryImageLinks: [
          'https://scontent-lga3-2.xx.fbcdn.net/v/t39.30808-6/281692677_5169199979782116_2845997978136777337_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=e3f864&_nc_ohc=bRq74Gl3L_oAX9vFAyF&_nc_ht=scontent-lga3-2.xx&oh=00_AT-3DeBaGSqhU_pE5CP1CZXpnAhhhqfCQQTYCW4t6_i6wg&oe=62B0AF7E',
          'https://s.yimg.com/uu/api/res/1.2/7tc4vobHWOLCBT2jd7dsdw--~B/Zmk9ZmlsbDtoPTQyMjt3PTY3NTthcHBpZD15dGFjaHlvbg--/https://s.yimg.com/os/creatr-uploaded-images/2021-10/ddcb2660-2e81-11ec-bffd-d8075a925d79.cf.webp',
          'https://cdn.mos.cms.futurecdn.net/A7zC3bvSNxWGyaP8jSuz2W-970-80.jpg.webp',
          'https://www.minecraft.net/content/dam/games/minecraft/screenshots/RayTracing-MineCraft-PMP-Always-Something-New.jpg',
        ],
        tags: ['Open world', 'RPG', 'Action', 'Retro'],
        createdAt,
        soundcloudEmbedSrc: 'https%3A//api.soundcloud.com/playlists/225126829',
        completedAt: randInst.range(1) ? completedAt : undefined,
        updatedAt,
      },
    });

    await addProjectMembersFor(projectResult.id, createdAt, updatedAt, 20);
  }

  await insertMinecraft();

  for (let i = 0; i < count; i++) {
    const createdAt = Date.now() + randDuration();
    const updatedAt = createdAt + randDuration(0.1);
    const completedAt = updatedAt + randDuration();
    const projectResult = await unsecure.project.insertOne({
      record: {
        access: Access.Open,
        bannerLink: getRandElem(banners),
        cardImageLink: getRandElem(banners),
        name: getRandomSubarray(words, randInst.range(3) + 1).join(' '),
        pitch: paragraph(randInst.range(2) + 1),
        description: paragraph(randInst.range(5) + 3),
        downloadLinks: [`https://fake${randId(4)}.com`],
        galleryImageLinks: getRandomSubarray(banners, randInst.range(4) + 3),
        soundcloudEmbedSrc: 'https%3A//api.soundcloud.com/playlists/225126829',
        tags: getRandomSubarray(words, randInst.range(3) + 4),
        createdAt,
        completedAt: randInst.range(1) ? completedAt : undefined,
        updatedAt,
      },
    });

    await addProjectMembersFor(projectResult.id, createdAt, updatedAt);
  }

  return (await unsecure.project.findAll({ projection: { id: true } })).map((x) => x.id);
}

function randDuration(multiplier: number = 1) {
  return randInst.range(2629800000 * 12 * 5 * multiplier);
}

async function generateUsers(unsecure: EntityManager, count: number) {
  const avatars = [
    'https://pfps.gg/assets/pfps/6721-rimuru-tempest.png',
    'https://pfps.gg/assets/pfps/5081-anime-girl-with-pink-hair.png',
    'https://pfps.gg/assets/pfps/9018-super-cute-anime-girl-with-brown-eyes.png',
    'https://pfps.gg/assets/pfps/6667-amongus-red-with-mask.png',
    'https://pfps.gg/assets/pfps/7356-spiderman-no-way-home.gif',
    'https://pfps.gg/assets/pfps/8172-a-super-cute-rushia.png',
    'https://pfps.gg/assets/pfps/1482-a-cute-anime-girl-with-glasses.png',
    'https://pfps.gg/assets/pfps/1791-cat-smoking.png',
    'https://pfps.gg/assets/pfps/9197-oooio.gif',
    'https://pfps.gg/assets/pfps/5239-girl-with-shadow-hedgehog.png',
  ];

  const banners = [
    'https://pfps.gg/assets/banners/2592-harish.gif',
    'https://pfps.gg/assets/banners/6531-mob-psycho-100-rage.gif',
    'https://pfps.gg/assets/banners/1868-anime-vafe.png',
    'https://pfps.gg/assets/banners/6711-sangonomiya-kokomi.gif',
    'https://pfps.gg/assets/banners/4391-shirakami-fubuki-dark-background.gif',
    'https://pfps.gg/assets/banners/3077-pixelated-sadge-anime-comp.gif',
    'https://pfps.gg/assets/banners/5406-sobhanspisy.gif',
    'https://pfps.gg/assets/banners/1912-roronoa-zoro.gif',
    'https://pfps.gg/assets/banners/3073-name.gif',
    'https://pfps.gg/assets/banners/2241-matrix-rain.gif',
    'https://pfps.gg/assets/banners/4807-death-the-kid.gif',
    'https://pfps.gg/assets/banners/5532-k-da-villain.gif',
    'https://pfps.gg/assets/banners/3800-blacky.gif',
  ];

  const usernames = [
    'atlinx',
    'sorrer',
    'briez',
    'luke',
    'endofletime',
    'fakemillwright',
    'fakejittery',
    'tamefake',
    'fakeagitated',
    'fakeprompt',
    'realtorfake',
    'fakearcana',
    'fakescuba',
    'faketrip',
    'fakeknown',
    'spottedfake',
    'knickersfake',
    'fakeattend',
    'composefake',
    'graduatefake',
    'fakepiccalilli',
  ];

  const displayNames = [
    'Alan',
    'Bridge',
    'Alex',
    'Luke',
    'Ari',
    'Bonita Werner',
    'Julia Roy',
    'Kyran Gilmore',
    'Nimrah Oconnor',
    'Khaleesi Rosario',
    'Brayden Mason',
    'Tarik Timms',
    'Ameerah Eastwood',
    'Emma Joyner',
    'Finlay Nguyen',
  ];

  const users: UserInsertInput[] = [];
  for (let i = 0; i < count; i++) {
    const username = getRandElem(usernames) + randId(5);
    const displayName = getRandElem(displayNames);
    const email = username + '@fake.com';
    const avatarLink = getRandElem(avatars);
    const bannerLink = getRandElem(banners);
    const bio = paragraph(randInst.range(4) + 1);
    const currYear = new Date().getFullYear();
    const classYear = currYear + randInst.range(6) - 3;
    users.push({
      username,
      displayName,
      email,
      avatarLink,
      bannerLink,
      classYear,
      bio,
    });
  }

  let validRoles: RoleCode[] = RoleDataList.filter(
    (x) => x.type.includes(RoleType.User) && x.roleCode !== RoleCode.SuperAdmin,
  ).map((x) => x.roleCode);

  // Populate fake data
  for (const user of users) {
    const result = await unsecure.user.insertOne({
      record: user,
    });

    const randomRoleCodes = getRandomSubarray(validRoles, randInst.range(validRoles.length)).concat(RoleCode.User);

    for (const roleCode of randomRoleCodes) {
      await unsecure.userRole.insertOne({
        record: {
          userId: result.id,
          roleCode: roleCode,
        },
      });
    }
  }

  return (await unsecure.user.findAll({ projection: { id: true } })).map((x) => x.id);
}

function getRandElem<T>(array: T[]) {
  return array[Math.floor(randInst.random() * array.length)];
}

function randId(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(randInst.random() * charactersLength));
  }
  return result;
}

function getRandomSubarray<T>(arr: T[], size: number) {
  var shuffled = arr.slice(0),
    i = arr.length,
    min = i - size,
    temp,
    index;
  while (i-- > min) {
    index = Math.floor((i + 1) * randInst.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

startMockServer();
