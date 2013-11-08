
/**
 * Dependencies
 */

var express = require('express'),
    app = express(),
    requireDir = require('requiredir'),
    routes = requireDir('./routes'),
    hbs = require('hbs'),
    _ = require('underscore');

hbs.registerHelper('escape', function(data) {
  return require('querystring').escape(data);
});


/**
 * Express Config
 */

app.configure('development', function() {
  app.use(express.logger('dev'));
});

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.engine('html', hbs.__express);
  app.set('view engine', 'html');
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

/**
 * Routes
 */

app.get('/', function(req, res, next) {
  res.redirect('/r/Music');
});

app.post('/', function(req, res, next) {
  res.redirect('/r/' + req.body.subreddit);
});

app.get('/subreddits.json', function(req, res, next) {
  res.send(_.uniq(["Music","listentothis","hiphopheads","hiphopheads","dubstep","dubstep","electronicmusic","electronicmusic","Metal","Metal","classicalmusic","classicalmusic","vinyl","mashups","mashups","Jazz","Jazz","futurebeats","electrohouse","guitarlessons","trance","trance","treemusic","edmproduction","ifyoulikeblank","ifyoulikeblank","musictheory","audiophile","punk","gamemusic","DaftPunk","DnB","DnB","Bass","audioengineering","piano","radiohead","kpop","drums","beatles","indie_rock","trap","coversongs","realdubstep","postrock","indie","House","MetalMemes","OFWGKTA","DJs","progmetal","LetsTalkMusic","chillmusic","RepublicOfMusic","IndieFolk","radioreddit","radioreddit","radioreddit","Metalcore","pinkfloyd","PostHardcore","Ska","swinghouse","spotify","futuregarage","InstrumentPorn","chiptunes","crappymusic","poppunkers","Learnmusic","triphop","ToolBand","ukulele","stonerrock","rap","blues","singing","ambientmusic","abletonlive","folk","gratefuldead","groovesharkplaylists","phish","trapmuzik","progrockmusic","Techno","reggae","Alternativerock","experimentalmusic","ThisIsOurMusic","Blink182","psychedelicrock","MusicNews","MusicNews","synthesizers","synthesizers","psytrance","idm","Psybient","RedHotChiliPeppers","audio","Complextro","doommetal","Luthier","freemusic","electroswing","mathrock","hardstyle","Muse","Vocaloid","Bluegrass","SoundsVintage","deadmau5","nin","FL_Studio","guitarpedals","mixes","90sHipHop","shamelessplug","FolkPunk","FolkPunk","Songwriters","Tabs","rush","Djent","BlackMetal","minimal","shoegaze","grunge","futurefunkairlines","altrap","Nirvana","jpop","moviemusic","Punk_Rock","CarAV","Brostep","composer","composer","composer","industrialmusic","country","gorillaz","unheardof","ClassicRock","banjo","glitch","japanesemusic","greenday","led_zeppelin","PowerMetal","folkmetal","Logic_Studio","darkstep","Punkskahardcore","classicalguitar","mixcd","ModestMouse","SpaceMusic","rock","rnb","animemusic","indiewok","purplemusic","musicians","Deathmetal","violinist","melodicdeathmetal","LadyGaga","grime","brandnew","Gear4Sale","listentomusic","MusicInTheMaking","Zappa","Deathcore","partymusic","partymusic","basslessons","jambands","vintageobscura","WorldMusic","harmonica","EmoScreamo","newmusic","breakcore","opera","breakbeat","futurebeatproducers","DIYGear","tech_house","Albumoftheday","90sAlternative","Metallica","AudioPost","happyhardcore","heythatwasin","Saxophonics","musicpics","ElectronicJazz","bandporn","protools","trumpet","acappella","Coldplay","reasoners","abletonclass","electronicdancemusic","noiserock","FrenchHouse","HardRock","FunkSouMusic","Percussionists","VSTi","bluesrock","raggajungle","CONCERTTICKETS","musicfestivals","VinylReleases","Glitchop","GameAudio","filth","recordstore","ICoveredASong","ICoveredASong","MusicVideos","MyChemicalRomance","TheStrokes","pearljam","Cello","frenchelectro","80smusic","Samplehunters","telecaster","albumaday","futuresynth","Rockband","Disco","pirateradio","pianocovers","Trombone","choralmusic","cassetteculture","funkhouse","gypsyjazz","jackwhite","TrueMetal","AcousticCovers","90smusic","Electropop","orchestra","riseagainst","melodicmetal","electrohiphop","DieAntwoord","ElitistClassical","DMB","UKFunky","Umphreys","Irishmusic","lanadelrey","BruceSpringsteen","Macklemore","redditmusicclub","deftones","MusicAlbums","EnterShikari","monsterfuzz","MusicEssentials","filmmusic","Baroque","arcadefire","GaragePunk","John_Frusciante","bandmembers","bandmembers","doublebass","fidget","DavidBowie","Turntablists","Turntablists","dreampop","Turntablists","symphonicmetal","RootsMusic","astateoftrance","TOUHOUMUSIC","TheAvettBrothers","TouringMusicians","germusic","ween","HighFidelity","Reaper","cpop","numetal","chambermusic","contemporary","CircleMusic","gabber","Clarinet","listentoconcerts","listentoconcerts","TheKillers","bassheavy","weirdal","sigurros","flaminglips","AcousticOriginals","weezer","aperfectcircle","italodisco","Flute","gameofbands","OutlawCountry","koreanmusic","mymusic","beatbox","albumreviews","Puscifer","RATM","Soulies","90sRock","RateMyAudio","morrissey","newwave","brass","Opeth","percussion","MaxMSP","womenrock","incubus","Skweee","headnodders","musicology","SmashingPumpkins","Accordion","chaphop","elliegoulding","LadiesofMetal","60sMusic","ethnomusicology","lyrics","keys","ConcertBand","porcupinetree","oasis","AcidHouse","backspin","MattAndKim","mgmt","LocationSound","afrobeat","minimalism_music","oldskoolrave","50sMusic","CanadianMusic","retromusic","linuxaudio","PsyBreaks","jrock","311","70smusic","altcountry","cubase","onealbumaweek","bossanova","NewAlbums","thebeachboys","Tuba","AtmosphericDnB","albumlisteners","musicinstructor","folkrock","renoise","EarlyMusic","Moombahcore","EarlyMusic","icm","MiddleEasternMusic","swing","symphonicblackmetal","RedditOriginals","feedme","Concerts","horn","balkanmusic","ipm","neilyoung","oldiemusic","musictosleepto","Viola","Slipknot","LiquidDubstep","earlymusicalnotation","earlymusicalnotation","earlymusicalnotation","tranceandbass","Krautrock","MelancholyMusic","70s","ratemyband","ineedasong","christcore","GothicMetal","Exotica","rainymood","popmusic","klezmer","musicindustry","MusicCritics","FindABand","MetalNews","themvoices","BritPop","chopping","asianrap","Slayer","bassoon","ElectronicBlues","powerpop","albums","drummers","prettylights","MinusTheBear","tango","heady","2000sMusic","chicagohouse","TheseAreOurAlbums","hardhouse","Neopsychedelia","Ocarina","ProductionLounge","80sHardcorePunk","WTFMusicVideos","Chipbreak","balkanbrass","saxophone","musiciansblogs","oboe","motown","2010sMusic","performer","GunsNRoses","MainstreamMusic","hispanicmusic","tribalbeats","boogiemusic","remix","danktunes","TheCure","electronicmagic","OSOM","truethrash","MusicMods","solresol","recordclub","baysideisacult","Megadeth","BillyTalent","VelvetUnderground","independentmusic","independentmusic","gaymusic","TheRealBookVideos","Rapverses","boomswing","SynthRock","TheOffspring","femalevocalists","horrorpunk","songbooks","ITALIANMUSIC","livemusic","hammondorgan","outkast","lt10k","piccolo","kings_of_leon","muzyka","AORmelodic","bigbeat","U2Band","TragicallyHip","RoyaltyFreeMusic","crunkcore","CanadianClassicRock","FusionDanceMusic","musicsuggestions","Manowar","ausmetal","TheMagneticZeros","UnicornsMusic","Pianorock","llawenyddhebddiwedd","Catchysongs","gfunk","Cd_collectors","SalsaMusic","MusicEventMeetUp","Pinback","recordstorefinds","nightstep","DeepPurple","yesband","Recorder","cityandcolour","ExplainThisSong","poptorock","BMSR","dutchmusic","dembow","Skullcandy","The_Residents","CARMUSIC","ListenToNews","stevereich","lennykravitz","remixxd","RockbandChallenges","cutcopy","sparksftw","daughter","handpan","SpotifyMusic","Conte"],function(item){    return item;}));
});

app.get('/r/:subreddit.json', routes.charts.json);
app.get('/r/:subreddit.jspf', routes.charts.jspf);
app.get('/r/:subreddit.xml', routes.charts.xml);
app.get('/r/:subreddit.xspf', routes.charts.xspf);
app.get('/r/:subreddit', function(req, res) {
  res.sendfile('public/index.html');
});
app.get(/^\/i\/(.+)\.png$/, routes.image);

/**
 * Listen Up
 */

require('http').createServer(app).listen(process.env.PORT || 3000);