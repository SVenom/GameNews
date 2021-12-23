// const news = []
require('../utils/database');
const req = require('express/lib/request');
const category = require("../model/category");
const customerservice = require('../model/contact');
const latestnews = require("../model/exp_news");



// category
exports.getNews= async (req,res,next)=> {
    try {
        const limitNumber =5;
        const categories = await category.find({}).limit(limitNumber);
        const latest = await latestnews.find({}).sort({_id: -1}).limit(limitNumber);
        const coc = await latestnews.find({"category": 'Clash-Of-Clans'}).limit(limitNumber);
        const news = {latest,coc};
        // console.log(latest);
        // console.log( "MONGO ID:", news[0]._id);
        res.render('news.ejs',{categories,news});
        console.log("In news js");
    } catch (error) {
        res.status(500).send({message: Error.message || "Error Occured"});
    }

}
// View All
exports.getviewAll= async (req,res,next)=> {
    try {
        const limitNumber =20;
        const categories = await category.find({}).limit(limitNumber);
        // console.log(categories);
        res.render('viewall.ejs',{title: 'View All',categories});
        console.log("In viewall js");
    } catch (error) {
        res.status(500).send({message: Error.message || "Error Occured"});
    }

}

exports.getviewAllById= async (req,res,next)=> {
    try {
        let viewallId = req.params.id;
        // console.log("feaching:" ,viewallId);
        const limitNumber =20;
        const viewById = await latestnews.find({'category': viewallId}).limit(limitNumber);
        // console.log(viewById);
        res.render('viewall.ejs',{title: 'View All', viewById});
        // console.log("In viewall js");
    } catch (error) {
        res.status(500).send({message: Error.message || "Error Occured"});
    }

}

exports.searchnews = async(req, res,next) => {
    try {
      let searchTerm = req.body.searchTerm;
      // let searchTerm= req.params.searchTerm;
      let search =  await category.find({name: searchTerm});
      // console.log(search);
      // console.log(searchTerm);
      // let search = searchTerm;
      res.render('search.ejs', { title: 'Search',search } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" });
    }
    
  }




exports.getspecificNews = async (req,res,next)=> {
    try {
       let newsid = req.params.id;
       const news = await latestnews.findById(newsid);
        res.render('latest_news.ejs',{news});
        console.log("In latestnews js");
    } catch (error) {
        res.status(500).send({message: Error.message || "Error Occured"});
    }

}

exports.explorelatest = async (req,res,next)=> {
    try {
        const limitNumber = 20;
        const latest = await latestnews.find({}).sort({_id: -1}).limit(limitNumber);
        res.render('explore-latest.ejs',{title: 'Explore Latest',latest});
        console.log("In explore-latest js");
    } catch (error) {
        res.status(500).send({message: Error.message || "Error Occured"});
    }

}

exports.exploreRandom = async(req, res) => {
    try {
        
      let count = await latestnews.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let showrandom = await latestnews.findOne().skip(random).exec();
      res.render('explore-random.ejs', {title: 'Explore Random',showrandom } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" });
    }
  }

  /**
 * GET /submit-news
 * Submit News
*/
exports.submitnews = async(req, res,next) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit_news.ejs', {title: 'Submit',infoErrorsObj, infoSubmitObj  } );
  }
  
  /**
   * POST /submit-news
   * Submit News
  */
  exports.submitnewsonpost = async(req, res,next) => {
    try {
  
      let imageUploadFile;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/img/' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err);
        })
  
      }
  
      const newNews = new latestnews({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        news: req.body.news,
        category: req.body.category,
        image: newImageName
      });
      
      await newNews.save();
  
      req.flash('infoSubmit', 'News has been added.')
      res.redirect('/submit-news');
    } catch (error) {
      req.flash('infoErrors', error);
      res.redirect('/submit-news');
    }
  }


// Contact US
// GET

exports.contactus = async(req,res,next)=>{
  res.render('contact.ejs',{title: 'Contact'});
}
exports.contactusonpost = async(req,res,next) =>{
  console.log(req.body);
  
  try {
    console.log(req.body);
    
    const contact = new  customerservice({
        email: req.body.email,
        user: req.body.user,
        topic: req.body.topic,
        details: req.body.details
  })
  await contact.save();
  res.redirect('/');
}catch (error){
  res.status(500).send({message: error.message || "Error Occured" });
}
}
  


// async function insertCategoryData(){
//     try {
//         await category.insertMany(
//             [
//                       {
//                         "name": "Clash of Clans",
//                         "image": "Coc.jpg"
//                       },
//                       {
//                         "name": "PUBG",
//                         "image": "pubg.jpg"
//                       }, 
//                       {
//                         "name": "GTA-V",
//                         "image": "GTAV.jpg"
//                       },
//                       {
//                         "name": "Valorent",
//                         "image": "valo.jpg"
//                       }, 
//                       {
//                         "name": "Rocket League",
//                         "image": "RocketLeague.jpg"
//                       },
//                       {
//                         "name": "Spanish",
//                         "image": "spanish-food.jpg"
//                       }
//                     ]
//         );
//     } catch (error) {
//         console.log('Error:' + error)
        
//     }
// }
// insertCategoryData();

// latestnews


// const insertlatestnewsData = async ()=>{
//     console.log("inside insertnewdata")
//       try {
//         await latestnews.insertMany(
//         [
//           { 
//             "name": "Clash of Clans Winter 2021",
//             "description": "Hi Chief!",
//             "news":
            
//                 "Hi Chief!We’ve got a few new things that will go live during this maintenance - so without further  ado let’s dive right in!NEW SUPER TROOP: SUPER DRAGONLook up in the sky! It’s a bird, it’s a pl...no wait, why is it angry looking? Why is it engulfed in eldritch flame? Oh no, it’s taking a deep breath.Introducing a brand new Super Troop: Super Dragon.Dragon has been a staple of Clash of Clans for nearly a decade. One of the best spam Troops for lower Town Hall levels and can still be found in many Clan Castles as a War donation. As an air Troop, Dragon avoids all the ugliness from Mortars and Cannons, and from Dragon’s lofty position in the sky, he’ll breathe metal-melting blasts of flame on his foes.So what could Super Dragon possibly offer that Dragon, Baby Dragon, Inferno Dragon, Electro Dragon, Dragon Rider, or any other Draconid can’t already do? Super Dragon is the supreme Roast Master.Though being a winged whirlwind of flame does make it hard for him to give good hugs.Favorite target: AnyDamage type: Area SplashTargets: Ground & AirHousing space: 40Movement speed: 14Super Troop Cost: 25K Dark ElixirTraining time: 6 minsNEW SIEGE MACHINE: FLAME FLINGERThe Flame Flinger is a deadly contraption barely held together by spite and willpower. This little-understood wonder of siege engineering contains a payload of incendiary Fire Spirits that are flung over enemy defenses, leaving fiery destruction and mass mayhem in their wake. Although this ranged rover gives you the advantage of delivering damage from afar, it can’t take as much damage as other Siege Machines.Favorite target: DefensesDamage type: Area splashTargets: GroundHousing space: 1Movement speed: 6Training cost: 100,000 GoldTraining time: 20 mins"
//                 ,
//             "category": "Clash Of Clane", 
//             "image": "clashnews.jpg"
//           },

                         
//             { 
//             "name": "Cost Reductions Coming Soon!",
//             "description": "Hey Chief!",
//             "news":
//                      "In the coming update, we’ll be doing reductions to upgrade costs and upgrade times across the board. We wanted to make the journey from Town Hall 7 to Town Hall 12 a bit smoother so... from Troops to Heroes to Defenses to Spells, we’re slashing costs!Most buildings have had their Gold upgrade cost cut by 10-25% between TH7-TH12The Laboratory is getting massive cuts to Elixir costs and upgrade timers, especially on the first few levels of each TroopHeroes too! Barbarian King and Archer Queen get moderate cost and timer cuts through the middle levels (30-65), while the Grand Warden and Royal Champion receive large cuts to cost and timers for the first several levels to help players unlock their abilities soonerDid we mention Walls? Walls are getting 25-60% of their cost reduced from TH6 all the way to TH12.D",
//              "category": "Clash Of Clane", 
//                         "image": "Coc2ndNews.jpg"
//                      },
//                  { 
//                 "name": "End of Support: Below iOS 11 and Android 5.0",
//                 "description": "Hey Chief!",
//                 "news":
//                          "Due to technical reasons beyond our control, in the next update to Clash of Clans (later this year), we are unfortunately forced to end support for all Apple and Android devices running on OS versions lower than iOS 11 and Android 5.0, respectively.If your device is currently running on a operating system lower than iOS 11 or Android 5.0, you will no longer be able to play Clash of Clans unless you update to a later iOS/Android version. Please update to iOS version 11 / Android 5.0 (or higher) as soon as possible.Instructions on how to update your iOS can be found through the Apple Support website.For instructions on how to check and update your Android version, visit Google's Support website.For more information on how to link your account to a Supercell ID or transfer your Village to a new device, please have a look at our Frequently Asked Questions.- Clash of Clans team",

//                  "category": "Clash Of Clane", 
//                             "image": "coc3rdnews.jpg"
//                         },

//                      { 
//                 "name": "Clash-O-Ween Optional Update!",
//                 "description": "Hey Chief!",
//                 "news":
//                          " The Clash-O-Ween optional update is rolling out to all app stores, Chiefs!Be sure to update to version 14.211.3 if you'd like to enjoy the brand new Clash-O-Ween loading screen, and our classic spooktacular jingle and sound effects!(And by the way, you can download the full loading screen image from our Twitter!)Clash On!",

//                  "category": "Clash Of Clane", 
//                             "image": "coc4thnews.png"
//                         },
    
//                      { 
//                 "name": "World Championship Finals Details",
//                 "description": "Hey Chief!",
//                 "news":
//                          " The moment we’ve all been waiting for is nearly here: The 2021 Clash of Clans World Championship Finals! The action will all take place from December 3rd-5th, and we’re so excited to see this year’s top 8 teams fight it out for the chance to be called World Champions. Before we get to the event, though, we have lots of news to share with you!The World Championship Finals will be a double-elimination bracket including the top 8 teams from Clash Worlds 2021: The 6 Golden Ticket winners through the year’s Monthly Qualifiers, plus the 2 Golden Ticket winners from the Last Chance Qualifier that will be held November 13th-14th. Like all Clash Worlds events in 2021, all Wars in the World Championship Finals will be best-of-1.Teams will be seeded in order of when they earned their tickets, with defending champions ATN.aTTaX entering as the #1 seed for winning the May Qualifier Golden Ticket, and the winning team from Day 2 of the Last Chance Qualifier entering as the #8 seed. Like the Monthly Qualifiers, there will be a bracket reset if needed in the Grand Finals. Take a look at the bracket below for current seeding based on the 6 teams that have qualified so far.The World Championship Finals action will begin at 5:00 AM UTC each day and will be streamed live on YouTube and Twitch. The first 5 Wars will be played on December 3rd. The next 5 Wars will be played on December 4th, and all remaining Wars, including the bracket reset if needed, will be played on December 5th until a champion is crowned!As for prizing, $300,000 of the Clash Worlds prize pool has already been awarded through Monthly Qualifiers and the Last Chance Qualifier. Now, our World Championship Finalists will be competing for their shares of $700,000 more from this year’s $1,000,000 prize pool! Here is what each team will take home when everything concludes next month: Furthermore, we have updated the Clash Worlds rulebook with all the above information, plus more details specifically for players and teams that we strongly encourage participants to read before the World Championship Finals begin.All 8 teams have worked so hard to reach this year’s World Championship Finals, and we can’t wait to see which team comes out on top when they finally go head-to-head next month! Clash On!",

//                  "category": "Clash Of Clane", 
//                             "image": "coc5thnews.png"
//                         },

//     // -----------------------------COC END-------------------------------------------------------
    
    
    
    
//           { 
//             "name": "PUBG LABS: WINTER RACE",
//             "description": "Hello Survivors!",
//             "news": 
//                         "  Don’t worry about your Christmas date this year, as Winter Race is here to accompany you in this cold season. Select your vehicle, streak through thrilling race tracks, and enjoy Vikendi’s cool wind whipping at your face as you drive your way to victory!You’ll first need a vehicle to start racing! Select the vehicle of your choice during the race countdown by comparing each vehicle’s speed and durability.Available vehicles: Motorbike, Pickup, Coupe RB, Quad, Zima Each vehicle provides its own weapon and a set of equipmentIn every match, players will play in a randomly selected racetrack among the five shown above.Tracks Track 1: A straight line track starting from the starting line to the finishing line.Track 2: A circular track requiring players to finish 2 laps to complete the race.Track 3: A square track requiring players to finish 2 laps to complete the race.Track 4: A track requiring players to return to the starting line to complete the race.Track 5: A frozen straight line track starting from the starting line to the finishing line.Checkpoints Players will have to drive through several checkpoints during the race.If players go off-track for too long, they will be automatically respawned to their recent checkpoint."
//                     ,
//             "category": "PUBG", 
//             "image": "PUb1stnews.jpg"
//           },




//           { 
//             "name": "PUBG: BATTLEGROUNDS X KAKAO FRIENDS COLLABORATION",
//             "description": "Hello Survivors!",
//             "news": 
//                         "  KAKAO FRIENDS LAND, LOOT, SURVIVE!The adorable KAKAO FRIENDS have landed on the Battlegrounds!EVENT 1:  KAKAO FRIENDS LANDVikendi’s prehistoric amusement park Dinoland has been reconstructed into a KAKAO FRIENDS theme park!In this wintery and magical park, players will be able to meet various KAKAO FRIENDS such as RYAN, APEACH, MUZI and more!Don’t forget to take memorable screenshots with your squad before KAKAO FRIENDS LAND closes doors Oh, and keep your eyes wide open as you’ll be able to find KAKAO FRIENDS LAND billboards here and there in Vikendi. Just because KAKAO FRIENDS LAND looks cute doesn’t mean it’s not dangerous. Watch out, as enemies may always be lurking behind trees or buildings.But who knows? If RYAN is in a good mood, he might be able to tell you where an enemy is hiding. KAKAO FRIENDS LAND OPENING DATE PC PST: November 30, 2021 (After Live server maintenance) CET: December 1, 2021 (After Live server maintenance) KST: December 1, 2021 (After Live server maintenance) CONSOLE PST: December 8, 2021 (After Live server maintenance) CET: December 9, 2021 (After Live server maintenance) KST: December 9, 2021 (After Live server maintenance) KAKAO FRIENDS LAND CLOSING DATE PC & CONSOLE PST: January 11, 2022 (After Live server maintenance) CET: January 12, 2022 (After Live server maintenance) KST: January 12, 2022 (After Live server maintenance)"
//                     ,
//             "category": "PUBG", 
//             "image": "pubg2ndnews.jpg"
//           },
//           { 
//             "name": "VIKENDI WONDERLAND GIVEAWAY",
//             "description": "Hello Survivors!",
//             "news": 
//                         "  Twas the First Of December and all through Vikendi there was snow and fun Now is the time of cheer and giving And we’ve got a Holiday Haul Prize Pack that could be won… Season’s greetings Survivors, if you’ve dropped into Vikendi lately you’ll notice we’ve given our signature snowy map a festive holiday makeover. However snow and decorations aren’t the only gifts we’re giving this year, the Vikendi Wonderland Giveaway will have nine winners winning with a Contraband Coupon, ten Nickel G-Coin Boxes and one grand prize winner will receive the Holiday Prize Pack courtesy of SteelSeries which includes: Qck Mousepad Rival 310 Mouse Apex M750 TKL Keyboard Arctic 5 Headphone"
//                     ,
//             "category": "PUBG", 
//             "image": "pubg3rdnews.jpg"
//           },
//           { 
//             "name": "PUBG: 2021 ANTI-CHEAT DEV LETTER",
//             "description": "Hello Survivors!",
//             "news": 
//                         "  As you’ve no doubt heard by now, PUBG: BATTLEGROUNDS is going free-to-play on January 12, 2022! While this is certainly an exciting time, we know that there are often important questions that pop up with such a transition. Namely, how will we address cheaters in a free-to-play game? Anti-cheat is always a critical priority, but with Free-to-Play incoming, the need for an effective anti-cheat system is more important than ever as banned accounts can easily and infinitely be replaced. To that end, we’ve been quietly, yet fiercely, preparing a number of countermeasures to combat cheat programs. That said, anti-cheat is always a never-ending fight and nothing we or anyone can do will ever completely stomp out cheating in competitive online games..In this Dev Letter, we’re going to dive in and talk more about what we’ve been building in 2021, how our anti-cheat situation is looking today, and what we have in store for the future. WHAT WE’VE BEEN DOING IN 2021 We’ve broken down our 2021 efforts into four categories that we’ll go into more depth on: Anti-Cheat Solution Improvements Hardware Ban Improvements Game Client Vulnerabilities In-Game Abuse Reinforcements ANTI-CHEAT SOLUTION IMPROVEMENTS: ZAKYNTHOS Zakynthos is our proprietary anti-cheat solution that we implemented in January of 2021 as a means to speed up the anti-cheat process. Where before we had to rely on slower external solutions, the time saved with Zakynthos helped us remove an additional 28% of cheaters from the previous year.Before we talk about what the future holds for Zakynthos and anti-cheat, let’s take a moment to talk about how we go about tackling cheat programs. When we discover a new cheat program, we secure and reverse engineer said program to get a full, deep analysis of what it does and how it bypasses our security. Once our tests lead us to a countermeasure, we develop detection logic into our anti-cheat solutions. Stability tests and other steps then help to ensure these updates don’t compromise the overall integrity of the game.Even with all of the above, cheat developers are tenacious and will learn how to bypass our anti-cheat solutions’ radars after a time, meaning we always need to be adjusting and improving those solutions in an effort to keep up. "
//                     ,
//             "category": "PUBG", 
//             "image": "pubg4thnews.jpg"
//           },
//           { 
//             "name": "DECEMBER SHOP UPDATE 2021",
//             "description": "Hello Survivors!",
//             "news": 
//                         "Welcome to the last shop update for 2021! Before it gets too cold this winter, lay your hands on some sizzling hot new items, skins, and contraband crates! But don’t just leave after checking out the new goods – read until the end for some important end date reminders of popular items that’ll be leaving the store this December.NEW ITEMS AND SKINS ※ The sales periods shown below are subject to change  ITEMS LIST Set KAKAO FRIENDS Ultimate Bundle (7460 → 5490 G-COIN) 26% SALE The RYAN Set (3100 → 2490 G-COIN) 20% SALE The APEACH Set (3680 → 2490 G-COIN) 32% SALE The TUBE Set (1300 → 1240 G-COIN) 5% SALE The NEO Set (1300 → 1240 G-COIN) 5% SALE Emote Victory Dance – Neo’s Crazy Night (500 G-COIN) Victory Dance – TUBE’s Move (600 G-COIN) SALES PERIOD: PC PST: December 7 2021, 6 PM – January 5 2022, 6 PM CET: December 8 2021, 3 AM – January 6 2022, 3 AM KST: December 8 2021, 11 AM – January 6 2022, 11 AM Console PST: December 8 2021, 8 PM – January 6 2022, 8 PM CET: December 9 2021, 5 AM – January 7 2022, 5 AM KST: December 9 2021, 1 PM – January 7 2022, 1 PM FESTIVE SEASONITEMS LIST Set Polar Bear Pack (1600 → 1290 G-COIN) 19% SALE Festive Bundle (3380 → 1990 G-COIN) 41% SALE Season’s Greetings Set (1490 → 1090 G-COIN) 27% SALE Santa Selfie Pack (700 → 500 G-COIN) 29% SALE Individual Items Polar Bear Mask (600 G-COIN) Polar Bear Suit (800 G-COIN) Polar Bear Feet (200 G-COIN) Festive Fur Coat (990 G-COIN) Plaid Sugarplum Top (700 G-COIN) Plaid Sugarplum Skirt (990 G-COIN) Holiday Ribbon Shoes (700 G-COIN) Season’s Greetings Dress (990 G-COIN) Pom Pom Slips (500 G-COIN) Santa Selfie Hoodie (350 G-COIN) Santa Selfie Pants (350 G-COIN) Nameplate Snow Globe (500 G-COIN) Deadly Greetings (500 G-COIN) Frosty (500 G-COIN) Emote Victory Dance 75 (600 G-COIN) SALES PERIOD: PC PST: December 16 2021, 6 PM – February 8 2022, 6 PM CET: December 17 2021, 3 AM – February 9 2022, 3 AM KST: December 17 2021, 11 AM – February 9 2022, 11 AM Console PST: December 16 2021, 8 PM – February 16 2022, 8 PM CET: December 17 2021, 5 AM – February 17 2022, 5 AMKST: December 17 2021, 1 PM – February 17 2022, 1 PM",
//             "category": "PUBG", 
//             "image": "pubg5thnews.jpg"
//           },


// // ------------------------------------------PUBG END------------------------------------------
    
    
//             { 
//             "name": "VALORANT GAME AND NETWORK INSTABILITY BASICS",
//             "description":" Hello Agents",
//             "news": 
//                          " Hey everyone. You’re probably here because you’ve noticed some instability icons in your game and you want them to go away. Or, you’re curious how VALORANT tells players if something is going wrong mid-game.We’ve collected the minds of the VALORANT Gameplay Technology team here to help define what the little instability indicators are, why they are important, and how to troubleshoot.WHAT ARE INSTABILITY INDICATORS?Instability indicators are what we call the set of visual icons displayed in-game to help you and others understand the condition of your network and game. These will show up on your top right corner to help diagnose potential issues with your network connection or hardware that is degrading your VALORANT experience.You can find the setting in Settings > General > Other - Instability Indicators. WHAT SHOULD I DO WHEN INSTABILITY INDICATORS APPEAR? An indicator has two thresholds: warning and critical. Generally the warning thresholds indicate a point at which the gameplay may start to degrade and critical thresholds represent a gamestate that is likely approaching unplayable. The exact numbers for these thresholds may vary per-region or patch.It’s generally safe to ignore indicators that appear temporarily and go away very quickly. However, if you’re seeing the instability indicators frequently or for long durations, there are a few ways to continue to diagnose the root causes. For detailed diagnostic information, you can turn on performance stat or graph displays (Settings > Video > Stats). This data can help to identify if there is a specific problem with your network connection or game client performance. See details and troubleshooting tips for specific instability indicators below:Please Note: You are more likely to experience frequent instability indicators during gameplay if you do not meet VALORANT’s minimum specification requirement."
//                     ,
//             "category": "Valorent", 
//             "image": "valonews.jpg"
//           },
//             { 
//             "name": "RiotX Arcane: Until Next Time",
//             "description":" Hello Agents",
//             "news": 
//                          "That’s a wrap! With the launch of Arcane’s epic finale on Netflix and our Undercity Nights celebration over the weekend, the RiotX Arcane event officially draws to a close. We’ve been so humbled by your enthusiasm and creativity over the last month. Thank you to everyone who has watched and supported Arcane. If you missed any of this weekend's festivities or announcements, here’s what went down:  Riot Gauntlet The Riot Gauntlet gave creators the opportunity to stick it to our balance teams for charity. Eight global teams competed for bragging rights and their share of a $100,000 donation pool. Arcane Finale Conversation with Cast and Creators Arcane was the result of years of dedicated work from animators, writers, artists, a talented cast, and many many more passionate creators. We held a Q&A with the people who made Arcane a reality to talk about their favorite moments, funny interactions, and how Arcane came together. Spoiler Warning, if you haven’t seen all nine episodes of Arcane yet, there will be spoilers in this video. So check out the rest of the series on Netflix and bookmark this one for later. Notes from the Undercity Pusha T, Bones UK, Mako, Miyavi, and PVRIS hit the stage for Notes from the Undercity, a live musical performance featuring original songs from the Arcane soundtrack. Hypixel Studios Brings Hytale to Life In 2020, the brilliant folks over at Hypixel Studios joined the Riot family. We’ve been huge fans of Hytale since the first trailer released and they dropped by to give an update on their community-powered block game that combines the scope of a creative sandbox with the depth of a roleplaying game."
//                     ,
//             "category": "Valorent", 
//             "image": "valo2ndnews.jpg"
//           },


// // ---------------------------------VALO END-----------------------------


//             { 
//             "name": "GTA-V",
//             "description":"EVERYTHING ABOUT THE GTA-V",
//             "news": 
//                     "December 15, 2021 New Content in Grand Theft Auto Online The Contract has been added to GTA Online. Today’s update includes 7 new cars, 3 new weapons, the Agency property, the Dr. Dre Contract missions, Security Contracts, Payphone Hits, the MOTOMAMI Los Santos radio station, new music on Radio Los Santos and West Coast Classics, Record A Studios, Short Trips, new clothing and accessories, new Quality of Life updates and more. The Agency Property:A new multi-floor property that acts as the base of operations for F. Clinton & Partner. It can be purchased from dynasty8executive.com. Purchasing the Agency property gives owners access to several new features including new GTA Online story missions for solo players or for groups. The Dr. Dre Contract: After partnering with Franklin Clinton in his Agency and setting up the business, players can begin new Story Missions which has them working with Dr. Dre to recover valuable stolen property. These Missions can be played either solo or with other players. Security Contracts:   Security Contracts are Freemode Missions that are launched from the Agency computer. These are jobs for your clients in need of help. Security Contracts have various difficulty levels that can increase the cash reward for completion:      Recover Valuables  Vehicle Recovery Gang Termination Rescue Operation Asset Protection Liquidize Assets Payphone Hits:Payphone Hits are Freemode Missions that task players with taking out a target and come with bonus rewards for meeting special criteria — such as using certain weapons, vehicles, killing at specific locations or timings. These missions are started by answering ringing payphones throughout the map and can be accessed after completing a few Security Contracts.Three new Weapons have been added to GTA Online:Heavy Rifle available at Ammu-Nation or the Agency’s Armory Compact EMP Launcher available at the Agency’s Armory   Stun Gun available at the Agency’s Armory Four new Weapons Finishes. These can be unlocked by completing specific gameplay from The Contract: Bone Finish (Pump Shotgun)  Families Finish (Heavy Rifle) Organics Finish (Micro SMG)  Record A Finish (AP Pistol) Seven new Vehicles have been added to GTA Online: Pfister Astron Bravado Buffalo STX ewbauchee Champion"
//                 ,
//             "category": "GTA-V", 
//             "image": "gta5.jpg"
//           },
    
    
//     // --------------------------GTA V END ----------------------------
    
//             { 
//             "name": "Rocket League",
//             "description": "News about Rocket League",
//                 "news":
//                        "Get ready for the most wonderful time of the year in Rocket League! The annual winter event, Frosty Fest, will make its return starting December 16, featuring wintery items, Golden Gifts, LTMs, and more! Starting Thursday at 9 a.m. PST (5 p.m. UTC), complete Frosty Fest Challenges to unlock the coolest new items in Rocket League, featuring Ring-a-Ling Wheels, three new Decals, Flannel Paint Finish, Abominable Throwman Player Title, and more! Check them all out in the slideshow below. Plus, claim the Ski-Free Player Banner in the Item Shop for free all throughout Frosty Fest! Since it's the season for gift giving, we're bringing back Golden Gifts! The Challenge for Golden Gifts can be completed five times and the gifts will unlock items from the Zephyr, Elevation, and Vindicator Item Series.  Beckwith Park is getting into the spirit of the season with a new Snowy variant of the classic Arena. Slide into this new version in Ranked, Casual, and Private Matches throughout the event! Then, sled into the featured LTMs of Winter Breakaway and Spike Rush! If you haven't checked them out before, Winter Breakaway takes place on Throwback Stadium (Snowy) and replaces the standard ball with the hockey puck from Snow Day. In Spike Rush, the Spike power-up from Rumble Mode is engaged after kickoff. The ball carrier can't boost and is demolished on impact, but can pass the ball to teammates to pull off some ice cold plays! Enjoy Winter Breakaway starting December 16 through December 24 and Spike Rush from December 24 through January 3. If you're still looking to deck your car in even more seasonal items, be sure to check out the Item Shop, which will feature plenty of festive finds. There will even be a new Frosty Pack bundle including Tygris (Crimson Painted), Frostbite Boost (Forest Green Painted), Wonderment Wheels (Crimson Painted), and Sub-Zero Goal Explosion (Forest Green Painted) for 1100 Credits. We hope you enjoy this year's Frosty Fest in Rocket League! From all of us at Psyonix, have a wonderful holiday and rest of 2021! Classic meets current when two models of the iconic Ford MustangⓇ vehicle charge into Rocket League! Prepare yourself for the cutting-edge, all-electric Ford Mustang Mach-E™ SUV and the car that started it all: the 1965 Ford Mustang ShelbyⓇ GT350R. See them in action in the trailer above featuring voice-over from Emmy Award Winning actor and the voice of Ford, Bryan Cranston!"
//                     ,
//                         "category": "Rocket League", 
//                         "image": "rocketleaguenews.jpg"
//                     },   


// // -----------------------------------------RL END-----------------------------------




//             { 
//             "name": "BREAKING THE ICE",
//             "description": "Hello Players",
//             "news":
//                     "FORTNITE CHAPTER 3 SEASON 1 IS A NEW BEGINNING — A PERFECT STARTING POINT FOR NEW PLAYERS AND A PERFECT RETURNING POINT FOR THOSE WHO HAVEN’T PLAYED IN A WHILE. WITNESS THE WINTRY NEW ISLAND THAW, DISCOVER NEW LOCATIONS PLUS A FEW SURPRISES, SEIZE VICTORY CROWNS, AND COMPLETE NEW QUESTS.",
//             "category": "Fortnite", 
//             "image": "fn1stnews.png"
//           },    



//             { 
//             "name": "SLIDE, SWING, AND RETREAT",
//             "description": "Hello Players",
//             "news":
//                    "RUNNING DOWNHILL? TRY SLIDING TO GET AROUND QUICKLY AND EVADE ENEMY FIRE — WHILE STILL BEING ABLE TO SHOOT AND BUILD. WANNA SWING ON THE DAILY BUGLE AND OTHER BUILDINGS? STARTING DECEMBER 11, YOU’LL BE ABLE TO PUT ON SPIDER-MAN'S WEB-SHOOTERS. DID AN ENEMY KNOCK YOU OUT? YOU’RE NOW ABLE TO CRAWL FASTER TO SAFELY REACH YOUR SQUAD. (YOU CAN NOW PICK STUFF UP WHILE KNOCKED OUT TOO!)",            "category": "Fortnite", 
//             "image": "fn2ndnews.png"
//           },    



//             { 
//             "name": "SWING AS SPIDEY",
//             "description": "Hello Players",
//             "news":
//                    "YOU CAN PUT ON SPIDER-MAN'S WEB-SHOOTERS NO MATTER WHAT OUTFIT YOU’RE USING, BUT YOU CAN ALSO PUT THEM ON AS THE ICONIC WEB-SLINGER HIMSELF. WITH THE CHAPTER 3 SEASON 1 BATTLE PASS, UNLOCK OUTFITS LIKE SPIDER-MAN, THE WANDERER RONIN, THE OUTLAW HARLOWE, AND MORE. LATER ON IN CHAPTER 3 SEASON 1, UNLOCK THE LEADER OF THE LEGENDARY “SEVEN”: THE FOUNDATION. AND SPEAKING OF SPIDER-MAN, LOOK OUT FOR NEW SPIDEYS (PLUS A FEW FRIENDS AND FOES) DROPPING INTO THE ITEM SHOP THROUGHOUT THE SEASON!", 
//             "category": "Fortnite", 
//             "image": "fn3rdnews.png"
//           },    



//             { 
//             "name": "XP BEYOND BATTLE ROYALE",
//             "description": "Hello Players",
//             "news":
//                    "BATTLE ROYALE ISN’T THE ONLY PLACE TO EARN XP TOWARDS YOUR BATTLE PASS. YOU CAN ALSO EARN XP FROM ACCOLADES IN CREATIVE! CREATORS CAN INCORPORATE ACCOLADES IN THEIR MAPS, GAMES, OR EXPERIENCES FOR PLAYERS JUMPING IN. PLAY YOUR PREFERRED WAY TO UNLOCK SPIDEY, THE FOUNDATION, AND MORE!", 
//             "category": "Fortnite", 
//             "image": "fn4thnews.png"
//           },    



//             { 
//             "name": "SNOW AND SEA, DESERT AND PASTURE",
//             "description": "Hello Players",
//             "news":
//                    "THE NEW ISLAND ISN’T JUST A FRESH BATTLEFIELD. IT’S ALSO RIPE FOR EXPLORATION. ROAM THE WESTERN SNOWFIELD AND ASCEND TO A “SEVEN OUTPOST.” TRAVERSE THE EASTERN TROPICS WITH A MOTORBOAT. GET A TASTE OF COZY LIVING IN CONDO CANYON. AND AFTER MOST OF THE SNOW HAS THAWED, CROSS THE GRASSLANDS AND DISCOVER A PREVIOUSLY SNOWED-IN SECRET.", 
//             "category": "Fortnite", 
//             "image": "fn5thnews.png"
//           },    
//         ]);
//       } catch (error) {
//         console.log(error)
//       }
//     }
// insertlatestnewsData();
    
  