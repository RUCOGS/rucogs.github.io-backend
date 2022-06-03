import { createUnsecureEntityManager } from "@src/controllers/entity-manager.controller";
import { User } from "@src/generated/graphql-endpoint.types";
import { RoleCode, UserInsertInput } from "@src/generated/model.types";
import { startServer } from "@src/misc/server-constructor";
import { mock } from "@twinlogix/typetta";
import { ObjectId } from "mongodb";
import { create } from 'random-seed';
import { paragraph, sentence } from 'txtgen';

const randInst = create("seed");

async function startMockServer() {
  mock.idSpecifications = {
    ID: {
      generate: () => new ObjectId(),
      stringify: (t: unknown) => (t as ObjectId).toString(),
    },
  }

  await startServer(true, true);
  
  const unsecure = createUnsecureEntityManager("mock");
  
  const avatars = [
    "https://pfps.gg/assets/pfps/6721-rimuru-tempest.png",
    "https://pfps.gg/assets/pfps/5081-anime-girl-with-pink-hair.png",
    "https://pfps.gg/assets/pfps/9018-super-cute-anime-girl-with-brown-eyes.png",
    "https://pfps.gg/assets/pfps/6667-amongus-red-with-mask.png",
    "https://pfps.gg/assets/pfps/7356-spiderman-no-way-home.gif",
    "https://pfps.gg/assets/pfps/8172-a-super-cute-rushia.png",
    "https://pfps.gg/assets/pfps/1482-a-cute-anime-girl-with-glasses.png",
    "https://pfps.gg/assets/pfps/1791-cat-smoking.png",
    "https://pfps.gg/assets/pfps/9197-oooio.gif",
    "https://pfps.gg/assets/pfps/5239-girl-with-shadow-hedgehog.png",
  ]

  const banners = [
    "https://pfps.gg/assets/banners/2592-harish.gif",
    "https://pfps.gg/assets/banners/6531-mob-psycho-100-rage.gif",
    "https://pfps.gg/assets/banners/1868-anime-vafe.png",
    "https://pfps.gg/assets/banners/6711-sangonomiya-kokomi.gif",
    "https://pfps.gg/assets/banners/4391-shirakami-fubuki-dark-background.gif",
    "https://pfps.gg/assets/banners/3077-pixelated-sadge-anime-comp.gif",
    "https://pfps.gg/assets/banners/5406-sobhanspisy.gif",
    "https://pfps.gg/assets/banners/1912-roronoa-zoro.gif",
    "https://pfps.gg/assets/banners/3073-name.gif",
    "https://pfps.gg/assets/banners/2241-matrix-rain.gif",
    "https://pfps.gg/assets/banners/4807-death-the-kid.gif",
    "https://pfps.gg/assets/banners/5532-k-da-villain.gif",
    "https://pfps.gg/assets/banners/3800-blacky.gif",
  ]

  const usernames = [
    "atlinx",
    "sorrer",
    "briez",
    "luke",
    "endofletime",
    "fakemillwright",
    "fakejittery",
    "tamefake",
    "fakeagitated",
    "fakeprompt",
    "realtorfake",
    "fakearcana",
    "fakescuba",
    "faketrip",
    "fakeknown",
    "spottedfake",
    "knickersfake",
    "fakeattend",
    "composefake",
    "graduatefake",
    "fakepiccalilli",
  ];

  const displayNames = [
    "Alan",
    "Bridge",
    "Alex",
    "Luke",
    "Ari",
    "Bonita Werner",
    "Julia Roy",
    "Kyran Gilmore",
    "Nimrah Oconnor",
    "Khaleesi Rosario",
    "Brayden Mason",
    "Tarik Timms",
    "Ameerah Eastwood",
    "Emma Joyner",
    "Finlay Nguyen",
  ];

  const userCount = 1000;
  const users: UserInsertInput[] = [];
  for (let i = 0; i < userCount; i++) {
    const username = getRandElem(usernames) + makeId(5);
    const displayName = getRandElem(displayNames);
    const email = username + "@fake.com";
    const avatarLink = getRandElem(avatars);
    const bannerLink = getRandElem(banners);
    const bio = paragraph(randInst.range(4) + 1);
    users.push({
      username,
      displayName,
      email,
      avatarLink,
      bannerLink,
      bio
    })
  }

  let validRoles: RoleCode[] = [];
  for (const roleCodeKey in RoleCode) {
    const roleCode = (<any>RoleCode)[roleCodeKey] as RoleCode;
    if (roleCode === RoleCode.User)
      continue;
    validRoles.push(roleCode);
  }

  // Populate fake data
  for (const user of users) {
    const result = await unsecure.user.insertOne({
      record: user
    });
    
    await unsecure.userRole.insertOne({
      record: {
        userId: result.id,
        roleCode: RoleCode.User
      }
    })

    const randomRoleCodes = getRandomSubarray(validRoles, randInst.range(validRoles.length)).concat(RoleCode.User);

    for (const roleCode of randomRoleCodes) {
      await unsecure.userRole.insertOne({
        record: {
          userId: result.id,
          roleCode: roleCode
        }
      }) 
    }
  }

  console.log("🥸 Mock server configured!");
}

function getRandElem<T>(array: T[]) {
  return array[Math.floor(randInst.random() * array.length)];
}

function makeId(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(randInst.random() * 
 charactersLength));
   }
   return result;
}

function getRandomSubarray<T>(arr: T[], size: number) {
    var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * randInst.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

startMockServer();
