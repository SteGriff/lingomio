(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/cuid/lib/pad.js
  var require_pad = __commonJS({
    "node_modules/cuid/lib/pad.js"(exports, module) {
      module.exports = function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length - size);
      };
    }
  });

  // node_modules/cuid/lib/fingerprint.browser.js
  var require_fingerprint_browser = __commonJS({
    "node_modules/cuid/lib/fingerprint.browser.js"(exports, module) {
      var pad = require_pad();
      var env = typeof window === "object" ? window : self;
      var globalCount = Object.keys(env).length;
      var mimeTypesLength = navigator.mimeTypes ? navigator.mimeTypes.length : 0;
      var clientId = pad((mimeTypesLength + navigator.userAgent.length).toString(36) + globalCount.toString(36), 4);
      module.exports = function fingerprint() {
        return clientId;
      };
    }
  });

  // node_modules/cuid/lib/getRandomValue.browser.js
  var require_getRandomValue_browser = __commonJS({
    "node_modules/cuid/lib/getRandomValue.browser.js"(exports, module) {
      var getRandomValue;
      var crypto = typeof window !== "undefined" && (window.crypto || window.msCrypto) || typeof self !== "undefined" && self.crypto;
      if (crypto) {
        lim = Math.pow(2, 32) - 1;
        getRandomValue = function () {
          return Math.abs(crypto.getRandomValues(new Uint32Array(1))[0] / lim);
        };
      } else {
        getRandomValue = Math.random;
      }
      var lim;
      module.exports = getRandomValue;
    }
  });

  // node_modules/cuid/index.js
  var require_cuid = __commonJS({
    "node_modules/cuid/index.js"(exports, module) {
      var fingerprint = require_fingerprint_browser();
      var pad = require_pad();
      var getRandomValue = require_getRandomValue_browser();
      var c = 0;
      var blockSize = 4;
      var base = 36;
      var discreteValues = Math.pow(base, blockSize);
      function randomBlock() {
        return pad((getRandomValue() * discreteValues << 0).toString(base), blockSize);
      }
      function safeCounter() {
        c = c < discreteValues ? c : 0;
        c++;
        return c - 1;
      }
      function cuid3() {
        var letter = "c", timestamp = (/* @__PURE__ */ new Date()).getTime().toString(base), counter = pad(safeCounter().toString(base), blockSize), print = fingerprint(), random = randomBlock() + randomBlock();
        return letter + timestamp + counter + print + random;
      }
      cuid3.slug = function slug() {
        var date = (/* @__PURE__ */ new Date()).getTime().toString(36), counter = safeCounter().toString(36).slice(-4), print = fingerprint().slice(0, 1) + fingerprint().slice(-1), random = randomBlock().slice(-2);
        return date.slice(-2) + counter + print + random;
      };
      cuid3.isCuid = function isCuid(stringToCheck) {
        if (typeof stringToCheck !== "string") return false;
        if (stringToCheck.startsWith("c")) return true;
        return false;
      };
      cuid3.isSlug = function isSlug(stringToCheck) {
        if (typeof stringToCheck !== "string") return false;
        var stringLength = stringToCheck.length;
        if (stringLength >= 7 && stringLength <= 10) return true;
        return false;
      };
      cuid3.fingerprint = fingerprint;
      module.exports = cuid3;
    }
  });

  // ui/app.mjs
  var import_cuid2 = __toESM(require_cuid(), 1);

  // ui/elements.mjs
  var import_cuid = __toESM(require_cuid(), 1);
  var ElementFactory = function () {
    this.ab = "ab";
    this.gloss = "gloss";
    this.mnem = "mnem";
    this.usage = "usage";
    this.h1 = "h1";
    this.createElement = function (elementType, order, local, foreign) {
      const el = {
        "id": (0, import_cuid.default)(),
        "elementType": elementType,
        "order": order,
        "alignment": 0,
        "words": [this.createWord(local, foreign)]
      };
      console.log("createElement", el);
      return el;
    };
    this.createWord = function (local, foreign) {
      return {
        "id": (0, import_cuid.default)(),
        "local": local || "",
        "foreign": foreign || "",
        "phrase": ""
      };
    };
    this.initElements = function () {
      return [
        this.createElement(this.h1, 0, "Greetings"),
        this.createElement(this.gloss, 1, "Hello", "Hola")
      ];
    };
    this.initElementsExemplar = this.initElements();
    this.isUnchangedElements = function (elements) {
      if (elements.length !== 2) return false;
      const initElems = this.initElementsExemplar;
      return elements.every((e, i) => {
        const initElem = initElems[i];
        return e.elementType === initElem.elementType && e.words[0].local === initElem.words[0].local && e.words[0].foreign === initElem.words[0].foreign;
      });
    };
    this.elementString = function (element) {
      return element.words.flatMap((w) => this.wordString(w)).join("\r\n");
    };
    this.wordString = function (word) {
      const def = word.local ? ` - ${word.local}` : "";
      if (word.phrase)
        return `${word.phrase}${def}`;
      if (word.foreign)
        return `${word.foreign}${def}`;
      return word.local;
    };
    this.vocabString = function (word) {
      const baseString = this.wordString(word);
      if (word.usages) {
        const usageStrings = word.usages.map((u) => u.phrase).join("\r\n");
        return [baseString, usageStrings].join("\r\n");
      }
      return baseString;
    };
  };

  // ui/names.js
  var NameFactory = function () {
    const _predicates = ["aback", "abalone", "abiding", "ablaze", "able", "aboard", "abounding", "abrasive", "abrupt", "absorbed", "absorbing", "abstracted", "abundance", "abundant", "abyssinian", "accessible", "accidental", "accurate", "achieved", "acidic", "acoustic", "actually", "acute", "adaptable", "adaptive", "adhesive", "adjoining", "admitted", "adorable", "adventurous", "aeolian", "aerial", "agate", "aged", "agreeable", "ahead", "airy", "ajar", "alabaster", "alder", "alert", "alike", "alive", "alkaline", "alluring", "almond", "almondine", "aloud", "alpine", "aluminum", "amazing", "ambiguous", "ambitious", "amenable", "amethyst", "amplified", "amused", "amusing", "ancient", "angry", "animated", "antique", "apple", "apricot", "aquamarine", "aquatic", "aromatic", "arrow", "artistic", "ash", "aspiring", "assorted", "astonishing", "atlantic", "atom", "attractive", "auspicious", "automatic", "autumn", "available", "awake", "aware", "awesome", "axiomatic", "azure", "balanced", "bald", "ballistic", "balsam", "band", "basalt", "battle", "bead", "beaded", "beautiful", "bedecked", "befitting", "bejewled", "believed", "bemused", "beneficial", "berry", "best", "better", "bevel", "big", "billowy", "bird", "bitter", "bittersweet", "blend", "bloom", "blossom", "blue", "blush", "blushing", "boatneck", "boiled", "boiling", "bold", "bolder", "boom", "booming", "bottled", "bottlenose", "boulder", "bouncy", "boundless", "bow", "brainy", "bramble", "branch", "branched", "brash", "brass", "brassy", "brave", "brawny", "brazen", "breezy", "brick", "brief", "bright", "brindle", "bristle", "broad", "broadleaf", "broken", "bronze", "bronzed", "brook", "bubble", "bubbly", "bumpy", "burly", "bustling", "busy", "butter", "buttercup", "buttered", "butternut", "buttery", "button", "buttoned", "bygone", "cactus", "cake", "calico", "calm", "camp", "canary", "candied", "candle", "candy", "canyon", "capable", "capricious", "caramel", "carbonated", "carefree", "careful", "caring", "carnation", "carnelian", "carpal", "casual", "cat", "caterwauling", "catkin", "catnip", "cautious", "cedar", "celestial", "certain", "cerulean", "chain", "chalk", "chambray", "changeable", "charm", "charmed", "charming", "chartreuse", "chatter", "checker", "checkered", "cheddar", "cheerful", "chemical", "cherry", "chestnut", "chief", "childish", "childlike", "chill", "chip", "chipped", "chisel", "chiseled", "chivalrous", "chlorinated", "chocolate", "chrome", "circular", "citrine", "clammy", "clarity", "classic", "classy", "clean", "clear", "clever", "cliff", "climbing", "closed", "cloud", "cloudy", "clover", "clumsy", "coal", "cobalt", "coconut", "coffee", "coherent", "cold", "colorful", "colossal", "comet", "comfortable", "common", "complete", "complex", "concise", "concrete", "confirmed", "confused", "confusion", "congruous", "conscious", "continuous", "cooing", "cooked", "cookie", "cool", "cooperative", "coordinated", "copper", "copy", "coral", "cord", "corner", "cosmic", "cotton", "cottony", "courageous", "crawling", "creative", "crimson", "crocus", "crystal", "crystalline", "cubic", "cuboid", "cuddly", "cultivate", "cultured", "cumbersome", "curious", "curved", "cut", "cyan", "cyber", "cyclic", "cypress", "daffodil", "daffy", "daily", "dandelion", "dandy", "dapper", "dark", "darkened", "dashing", "dawn", "dazed", "dazzling", "deadpan", "dear", "debonair", "deciduous", "decisive", "decorous", "dedicated", "deep", "deeply", "defiant", "delicate", "delicious", "delightful", "delirious", "deluxe", "denim", "dent", "dented", "descriptive", "desert", "deserted", "destiny", "detailed", "determined", "developing", "diagnostic", "diamond", "different", "difficult", "diligent", "dirt", "disco", "discovered", "discreet", "distinct", "dog", "dolomite", "dorian", "dot", "dour", "dramatic", "dull", "dune", "dust", "dusty", "dynamic", "eager", "early", "earthy", "east", "eastern", "easy", "economic", "educated", "efficacious", "efficient", "eggplant", "eight", "elastic", "elated", "elderly", "electric", "elegant", "elemental", "elite", "ember", "emerald", "eminent", "emphasized", "empty", "enchanted", "enchanting", "encouraging", "endurable", "energetic", "enormous", "enshrined", "entertaining", "enthusiastic", "equable", "equal", "equatorial", "equinox", "erratic", "estimated", "ethereal", "evanescent", "even", "evening", "evergreen", "everlasting", "excellent", "excessive", "excited", "exciting", "exclusive", "expensive", "experienced", "extreme", "exuberant", "exultant", "fabulous", "faceted", "factual", "faint", "fair", "faithful", "fallacious", "false", "familiar", "famous", "fan", "fanatical", "fancy", "fantastic", "fantasy", "far", "fascinated", "fast", "fate", "fearless", "feather", "feline", "fern", "festive", "few", "field", "fierce", "fifth", "fine", "fir", "fire", "first", "fish", "five", "fixed", "flame", "flannel", "flash", "flashy", "flat", "flawless", "flax", "flaxen", "flicker", "flint", "florentine", "flossy", "flourish", "flower", "flowery", "fluff", "fluffy", "fluorescent", "fluoridated", "fluttering", "flying", "foam", "foamy", "fog", "foggy", "foil", "foregoing", "foremost", "forest", "forested", "fork", "fortunate", "fortune", "fossil", "foul", "four", "fourth", "fragrant", "freckle", "free", "freezing", "frequent", "fresh", "friendly", "frill", "fringe", "frost", "frosted", "fuchsia", "full", "functional", "funny", "furtive", "future", "futuristic", "gainful", "galvanized", "gamy", "garnet", "garrulous", "gaudy", "gelatinous", "gem", "general", "generated", "gentle", "geode", "giant", "giddy", "gifted", "gigantic", "gilded", "ginger", "glacier", "glamorous", "glass", "glaze", "gleaming", "glib", "glimmer", "glistening", "glitter", "glittery", "global", "glorious", "glory", "glossy", "glow", "glowing", "gold", "golden", "goldenrod", "good", "goofy", "gorgeous", "gossamer", "graceful", "grand", "grandiose", "granite", "grape", "grass", "grateful", "gratis", "grave", "gravel", "gray", "great", "green", "gregarious", "grey", "grizzled", "grizzly", "groovy", "grove", "guiltless", "gusty", "guttural", "habitual", "hail", "half", "hallowed", "halved", "hammerhead", "handsome", "handsomely", "handy", "happy", "hardly", "harmless", "harmonious", "harsh", "harvest", "heady", "healthy", "heartbreaking", "heather", "heathered", "heavenly", "heavy", "held", "heliotrope", "helix", "helpful", "hexagonal", "hickory", "highfalutin", "highly", "hilarious", "hill", "hip", "hissing", "historical", "holistic", "hollow", "holy", "honey", "honeysuckle", "honorable", "honored", "horn", "horse", "hospitable", "hot", "hulking", "humane", "humble", "humdrum", "humorous", "hungry", "hurricane", "hushed", "hyper", "hypnotic", "iced", "icy", "illustrious", "imaginary", "immediate", "immense", "imminent", "impartial", "important", "imported", "impossible", "incandescent", "inconclusive", "incongruous", "incredible", "indecisive", "indigo", "indispensable", "industrious", "inexpensive", "infrequent", "ink", "inky", "innate", "innovative", "inquisitive", "insidious", "instinctive", "intelligent", "interesting", "intermediate", "internal", "intriguing", "invented", "invincible", "invited", "iodized", "ionian", "ionized", "iridescent", "iris", "iron", "irradiated", "island", "ivy", "jagged", "jasper", "jazzy", "jealous", "jelly", "jet", "jewel", "jeweled", "jolly", "joyous", "judicious", "jumbled", "jumpy", "jungle", "juniper", "just", "juvenile", "kaput", "keen", "kind", "kindhearted", "kindly", "kiwi", "knotty", "knowing", "knowledgeable", "lace", "laced", "lacy", "lake", "languid", "lapis", "laser", "lateral", "lava", "lavender", "lavish", "lead", "leaf", "lean", "learned", "leather", "leeward", "legend", "legendary", "lemon", "level", "liberating", "light", "lightning", "like", "likeable", "lilac", "lime", "linen", "literate", "lithe", "little", "lively", "living", "lizard", "local", "locrian", "lofty", "long", "longhaired", "longing", "lopsided", "loud", "lovely", "loving", "low", "lowly", "luck", "lucky", "ludicrous", "lumbar", "luminous", "lunar", "lush", "luxuriant", "luxurious", "lydian", "lying", "lyrical", "maddening", "magenta", "magnetic", "magnificent", "mahogany", "maize", "majestic", "malachite", "malleable", "mammoth", "mango", "mangrove", "maple", "marble", "marbled", "marked", "marmalade", "maroon", "marred", "married", "marsh", "marshy", "marvelous", "massive", "material", "materialistic", "mature", "maze", "meadow", "medieval", "mellow", "melodic", "melodious", "melted", "meowing", "merciful", "mercurial", "mercury", "mesquite", "metal", "meteor", "mewing", "mica", "midi", "midnight", "mighty", "mild", "mildly", "military", "mini", "miniature", "mint", "mirage", "mire", "mirror", "misty", "mixed", "mixolydian", "modern", "modest", "momentous", "moored", "morning", "motley", "mountain", "mountainous", "mousy", "mud", "muddled", "muddy", "mulberry", "mutual", "mysterious", "narrow", "natural", "navy", "near", "neat", "nebula", "nebulous", "necessary", "neighborly", "neon", "nervous", "nettle", "nice", "nickel", "nifty", "night", "nimble", "nine", "ninth", "noble", "noiseless", "nonchalant", "nonstop", "noon", "north", "northern", "nostalgic", "nosy", "notch", "nova", "numerous", "nutritious", "oasis", "observant", "obsidian", "obtainable", "obvious", "occipital", "oceanic", "octagonal", "odd", "oil", "olive", "olivine", "omniscient", "onyx", "opalescent", "opaque", "open", "opposite", "orange", "orchid", "orderly", "ordinary", "organic", "organized", "ossified", "outgoing", "outrageous", "outstanding", "oval", "overjoyed", "oxidized", "pacific", "paint", "painted", "pale", "palm", "panoramic", "paper", "parallel", "past", "pastoral", "patch", "pattern", "peaceful", "peach", "pear", "peat", "pebble", "pentagonal", "pepper", "peppered", "peppermint", "perfect", "peridot", "periodic", "periwinkle", "perpetual", "persistent", "petal", "petalite", "petite", "pewter", "phantom", "phase", "phrygian", "picayune", "pickle", "pickled", "picturesque", "pie", "pine", "pineapple", "pinnate", "pinto", "piquant", "pitch", "placid", "plaid", "plain", "planet", "plant", "plastic", "platinum", "plausible", "playful", "pleasant", "plucky", "plum", "plume", "plural", "pointed", "pointy", "poised", "polar", "polarized", "polished", "polite", "political", "pollen", "polydactyl", "polyester", "pond", "pool", "popular", "positive", "possible", "potent", "pouncing", "power", "powerful", "prairie", "precious", "pretty", "pricey", "prickle", "prickly", "principled", "prism", "private", "probable", "productive", "profuse", "prong", "protective", "proud", "proximal", "psychedelic", "puddle", "pumped", "purple", "purrfect", "purring", "pushy", "puzzle", "puzzled", "puzzling", "pyrite", "quaint", "quark", "quartz", "quasar", "quick", "quickest", "quiet", "quill", "quilled", "quilt", "quilted", "quintessential", "quirky", "quiver", "quixotic", "radial", "radical", "rain", "rainbow", "rainy", "rambunctious", "rapid", "rare", "raspy", "rattle", "real", "rebel", "recent", "receptive", "recondite", "rectangular", "reflective", "regal", "regular", "reinvented", "reliable", "relic", "relieved", "remarkable", "reminiscent", "repeated", "resilient", "resisted", "resolute", "resonant", "respected", "responsible", "rhetorical", "rhinestone", "ribbon", "rich", "rift", "right", "righteous", "rightful", "rigorous", "ring", "ringed", "ripe", "ripple", "ritzy", "river", "road", "roan", "roasted", "robust", "rocky", "rogue", "romantic", "roomy", "rose", "rotated", "rotating", "rough", "round", "rounded", "royal", "rumbling", "rune", "rural", "rust", "rustic", "saber", "sable", "safe", "sage", "salt", "salty", "same", "sand", "sandy", "sapphire", "sassy", "satin", "satisfying", "savory", "scalloped", "scandalous", "scarce", "scarlet", "scented", "scientific", "scintillating", "scratch", "scratched", "scrawny", "screeching", "scythe", "season", "seasoned", "second", "secret", "secretive", "sedate", "seed", "seemly", "seen", "selective", "separate", "separated", "sepia", "sequoia", "serene", "serious", "shade", "shaded", "shadow", "shadowed", "shared", "sharp", "sheer", "shell", "shelled", "shimmer", "shimmering", "shine", "shining", "shiny", "shocking", "shore", "short", "shorthaired", "showy", "shrouded", "shrub", "shy", "sideways", "silent", "silicon", "silk", "silken", "silky", "silly", "silver", "similar", "simple", "simplistic", "sincere", "single", "six", "sixth", "skillful", "skinny", "skitter", "sky", "slash", "sleepy", "sleet", "slender", "slime", "slimy", "slow", "sly", "small", "smart", "smiling", "smoggy", "smooth", "snapdragon", "sneaky", "snow", "snowy", "soapy", "soft", "solar", "solid", "solstice", "somber", "sophisticated", "sordid", "sore", "sour", "south", "southern", "spangle", "spangled", "spark", "sparkling", "sparkly", "special", "speckle", "speckled", "spectacled", "spectacular", "spectrum", "sphenoid", "spice", "spiced", "spicy", "spiffy", "spiky", "spiny", "spiral", "splashy", "splendid", "sponge", "spot", "spotless", "spotted", "spotty", "spring", "sprinkle", "sprout", "spurious", "square", "standing", "star", "statuesque", "steadfast", "steady", "stealth", "steel", "steep", "stellar", "sticky", "stingy", "stirring", "stitch", "stone", "storm", "stormy", "stream", "strengthened", "stripe", "striped", "strong", "stump", "stupendous", "sturdy", "stylish", "suave", "subdued", "subsequent", "substantial", "successful", "succinct", "succulent", "sudden", "sudsy", "sugar", "sugared", "sugary", "sulfuric", "sulky", "summer", "sumptuous", "sun", "sunny", "sunrise", "sunset", "super", "superb", "superficial", "supreme", "surf", "sustaining", "swamp", "swanky", "sweet", "sweltering", "swift", "synonymous", "tabby", "talented", "tall", "tame", "tan", "tangible", "tangy", "tar", "tarry", "tartan", "tasteful", "tasty", "tattered", "teal", "telling", "temporal", "ten", "tender", "terrific", "tested", "thankful", "therapeutic", "thin", "thinkable", "third", "thirsty", "thoracic", "thorn", "thoughtful", "thread", "three", "thrilling", "thunder", "thundering", "tidal", "tide", "tidy", "time", "tin", "tinted", "tiny", "titanium", "toothsome", "topaz", "torch", "torpid", "tortoiseshell", "tough", "tourmaline", "towering", "trail", "tranquil", "translucent", "transparent", "trapezoidal", "traveling", "treasure", "tree", "tremendous", "triangular", "tricky", "tricolor", "trite", "tropical", "troubled", "trusted", "trusting", "truth", "truthful", "tulip", "tundra", "tungsten", "turquoise", "twilight", "twisty", "typhoon", "typical", "ubiquitous", "ultra", "uncovered", "understood", "unequaled", "uneven", "unexpected", "unique", "universal", "unleashed", "unmarred", "unruly", "unusual", "upbeat", "useful", "utopian", "uttermost", "vagabond", "valiant", "valley", "valuable", "vanilla", "various", "vast", "vaulted", "veil", "veiled", "verbena", "verbose", "verdant", "versed", "victorious", "vigorous", "vine", "vintage", "violet", "viridian", "visual", "vivacious", "vivid", "volcano", "voltaic", "voracious", "waiting", "wakeful", "walnut", "wandering", "warm", "warp", "wary", "water", "watery", "wave", "wax", "wealthy", "well", "west", "western", "wheat", "whimsical", "whip", "whispering", "wholesale", "wide", "wiggly", "wild", "wind", "winter", "wirehaired", "wiry", "wise", "wistful", "witty", "wobbly", "wonderful", "wood", "wooded", "wooden", "wool", "woolen", "woolly", "workable", "working", "worried", "wry", "yellow", "yielding", "young", "youthful", "zany", "zealous", "zenith", "zest", "zesty", "zigzag", "zinc", "zippy", "zircon"];
    const randomElement = (array) => array[Math.floor(Math.random() * array.length)];
    const upperFirst = (word) => word.charAt(0).toUpperCase() + word.slice(1);
    this.nameForA = (entityType) => upperFirst(randomElement(_predicates)) + " " + upperFirst(entityType);
  };

  // ui/time.js
  var getTimeSince = (uts) => {
    const now = /* @__PURE__ */ new Date() / 1e3;
    const seconds = Math.floor(now - uts);
    let interval = seconds / 31536e3;
    if (interval > 1)
      return Math.floor(interval) + " years";
    interval = seconds / 2592e3;
    if (interval > 1)
      return Math.floor(interval) + " months";
    interval = seconds / 86400;
    if (interval > 1)
      return Math.floor(interval) + " days";
    interval = seconds / 3600;
    if (interval > 1)
      return Math.floor(interval) + " hours";
    interval = seconds / 60;
    if (interval > 1)
      return Math.floor(interval) + " minutes";
    return Math.floor(seconds) + " seconds";
  };

  // ui/app.mjs
  if ("serviceWorker" in navigator) {
  }
  var CONTENT = "savedBook";
  var USER = "user";
  var elementFactory = new ElementFactory();
  var nameFactory = new NameFactory();
  var storageLoad = (key) => {
    console.log("storageLoad");
    const json = window.localStorage.getItem(key);
    if (json) {
      const saved = JSON.parse(json);
      return saved || null;
    }
  };
  var newBook = () => {
    return {
      name: nameFactory.nameForA("book"),
      cuid: (0, import_cuid2.default)(),
      elements: elementFactory.initElements(),
      knownLanguage: "en",
      learningLanguage: "es"
    };
  };
  PetiteVue.createApp({
    message: null,
    dialog: null,
    menu: false,
    copied: null,
    books: [],
    currentBook: newBook(),
    selected: null,
    selectedWord: null,
    addPoint: 0,
    addToolLocation: null,
    sortLocal: false,
    pasteFailContent: "",
    importContent: "",
    userModel: null,
    username: "",
    password: "",
    explanation: null,
    explaining: false,
    elementFactory,
    nameFactory,
    async mounted() {
      console.log("mounted");
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          if (this.dialog) this.dialog = null;
          else if (this.menu) this.menu = false;
        }
      });
      await this.checkSession();
      this.currentBook = storageLoad(CONTENT) || this.currentBook();
      this.userModel = storageLoad(USER) || this.userModel;
      this.addPoint = this.nextOrdinal();
    },
    // Computed
    maxOrdinal() {
      const max = Math.max(...this.currentBook.elements.map((e) => e.order)) || 0;
      return max;
    },
    nextOrdinal() {
      if (!this.currentBook.elements?.length) this.bookBroken();
      const max = Math.max(...this.currentBook.elements.map((e) => e.order)) || 0;
      console.log("nextOrdinal", max + 1);
      return max + 1;
    },
    orderedElements() {
      if (!this.currentBook.elements?.length) this.bookBroken();
      return this.currentBook.elements.sort((a, b) => a.order - b.order);
    },
    bookBroken() {
      console.log("bookBroken");
      this.toast("This book is broken - paste a valid JSON book, or load another.");
      this.dialog = "IMPORT";
    },
    allVocab() {
      const all = [...this.currentBook.elements].flatMap((e) => e.words);
      const allWords = all.filter((e) => e.foreign > "");
      const allUsages = all.filter((e) => e.phrase > "");
      if (this.sortLocal) allWords.sort((a, b) => a.local.localeCompare(b.local));
      else allWords.sort((a, b) => a.foreign.localeCompare(b.foreign));
      allWords.forEach((w) => {
        w.usages = allUsages.filter(
          (u) => u.phrase.search(new RegExp(w.foreign, "i")) !== -1
        );
      });
      return allWords;
    },
    isSel(element) {
      return element.id === this.selected;
    },
    showTools(element) {
      const isOpenOnElement = this.addToolLocation === "ELEMENT" && this.isSel(element) && this.addPoint === element.order;
      const isOpenAtEnd = this.addToolLocation === "END" && element.order === this.maxOrdinal();
      return isOpenOnElement || isOpenAtEnd;
    },
    // Methods
    select(element, word) {
      this.menu = false;
      const prevSelected = this.selected;
      this.selected = element.id;
      if (word) this.selectedWord = word.id;
      if (this.selected !== prevSelected) this.hideElementTools();
    },
    hideElementTools() {
      if (this.addToolLocation === "ELEMENT") this.addToolLocation = null;
      console.log("hideElementTools", this.addToolLocation, this.addPoint);
    },
    toggleTools(element) {
      this.menu = false;
      const toolLocationTarget = element ? "ELEMENT" : "END";
      this.addPoint = element ? element.order : this.nextOrdinal();
      this.addToolLocation = this.addToolLocation === toolLocationTarget ? null : toolLocationTarget;
      console.log("toggleTools", this.addToolLocation, this.addPoint);
    },
    add(elementType) {
      this.menu = false;
      const order = this.addToolLocation === "END" ? this.maxOrdinal() : this.addPoint;
      const newOrdinal = order + 1;
      this.currentBook.elements.filter((e) => e.order >= newOrdinal).forEach((e) => e.order += 1);
      const newEl = this.elementFactory.createElement(
        elementType || this.elementFactory.gloss,
        newOrdinal
      );
      this.currentBook.elements.push(newEl);
      console.log("add", order, elementType);
      this.save();
    },
    remove(element) {
      const removeIndex = this.currentBook.elements.findIndex((e) => e.id === element.id);
      console.log("remove removeIndex", removeIndex, this.currentBook.elements);
      this.currentBook.elements.splice(removeIndex, 1);
      this.currentBook.elements.sort((a, b) => a.order - b.order).forEach((el, index) => {
        el.order = index;
      });
      this.save();
    },
    addWord(element) {
      const newWord = this.elementFactory.createWord();
      element.words.push(newWord);
      this.select(element, newWord);
      this.save();
    },
    removeWord(element, wordId) {
      const removeIndex = element.words.findIndex((w) => w.id === wordId);
      console.log("removeWord removeIndex", removeIndex, element.words);
      element.words.splice(removeIndex, 1);
      this.save();
    },
    moveUp(element) {
      const newOrder = element.order - 1;
      const swapElement = this.currentBook.elements.find((e) => e.order === newOrder);
      if (swapElement) swapElement.order += 1;
      element.order = newOrder;
    },
    moveDown(element) {
      const newOrder = element.order + 1;
      const swapElement = this.currentBook.elements.find((e) => e.order === newOrder);
      if (swapElement) swapElement.order -= 1;
      element.order = newOrder;
    },
    async explain(element) {
      if (element.words[0].explanation) {
        this.explanation = element.words[0].explanation;
        this.dialog = "EXPLAIN";
        return;
      }
      this.explaining = true;
      const data = {
        text: element.words[0].phrase,
        learningLanguage: this.currentBook.learningLanguage
      };
      const url = "/api/explain/";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      this.explaining = false;
      if (response.status === 401) {
        this.setUser(null);
        return;
      }
      if (response.status === 403) {
        this.message = json.message;
        return;
      }
      const json = await response.json();
      if (json.status !== "OK")
        this.message = json.message;
      console.log("explained", json);
      this.explanation = json.model;
      element.words[0].explanation = json.model;
      this.dialog = "EXPLAIN";
    },
    blur() {
      this.save();
    },
    save() {
      if (!this.currentBook.cuid)
        this.currentBook.cuid = (0, import_cuid2.default)();
      console.log("Save", this.currentBook.cuid);
      const json = JSON.stringify(this.currentBook);
      window.localStorage.setItem(CONTENT, json);
      const hasChanged = !this.elementFactory.isUnchangedElements(this.currentBook.elements);
      if (this.userModel && hasChanged) {
        this.postBook();
      }
    },
    saveName() {
      this.save();
      this.dialog = null;
    },
    copy(content, label) {
      try {
        navigator.clipboard.writeText(content);
        this.copied = label;
        window.setTimeout(() => this.copied = null, 3e3);
      } catch (e) {
        this.pasteFailContent = content;
        this.copied = false;
      }
    },
    copyText() {
      const allLinesContent = this.currentBook.elements.map((e) => this.elementFactory.elementString(e)).join("\r\n");
      this.copy(allLinesContent, "TEXT");
    },
    copyVocab() {
      const allVocabContent = this.allVocab().map((w) => this.elementFactory.vocabString(w)).join("\r\n");
      this.copy(allVocabContent, "VOCAB");
    },
    copyJson() {
      const json = JSON.stringify(this.currentBook.elements);
      this.copy(json, "JSON");
    },
    load(overwrite) {
      if (!overwrite) {
        this.save();
        this.currentBook = newBook();
      }
      this.currentBook.elements = JSON.parse(this.importContent);
      this.importContent = "";
      this.save();
    },
    toast(msg) {
      this.message = msg;
      window.setTimeout(this.untoast, 3e3);
    },
    untoast() {
      this.message = null;
    },
    async login() {
      const data = { "username": this.username, "password": this.password };
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const json = await response.json();
      if (json.status === "OK") {
        this.setUser(json.model);
        this.username = "";
        this.password = "";
        this.message = null;
        this.menu = false;
      } else {
        this.message = json.message;
      }
    },
    async logout() {
      console.log("logout");
      await fetch("/api/logout/", {
        method: "POST"
      });
      this.userModel = null;
    },
    setUser(model) {
      console.log("setUser", model);
      this.userModel = model;
      if (model) {
        this.dialog = null;
        this.getBooksList();
        this.save();
      } else
        this.toast("Log in to sync data");
    },
    async checkSession() {
      try {
        const response = await fetch("/api/user");
        if (response.status === 401) {
          this.setUser(null);
          return;
        }
        const json = await response.json();
        if (json.status === "OK") {
          this.setUser(json.model);
        }
      } catch (error) {
        console.log("Catch checkSession", error);
      }
    },
    booksDialog() {
      this.dialog = "BOOKS";
      this.getBooksList();
    },
    async getBooksList() {
      const response = await fetch("/api/books");
      if (response.status === 401) {
        this.setUser(null);
        return;
      }
      const json = await response.json();
      console.log("getBooksList", json);
      if (json.status === "OK") {
        this.books = json.model;
      }
    },
    async postBook() {
      const data = this.currentBook;
      const url = "/api/book/" + data.cuid;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (response.status === 401) {
        this.setUser(null);
        return;
      }
      const json = await response.json();
      if (json.status !== "OK")
        this.message = json.message;
    },
    async startNew() {
      this.save();
      if (!this.userModel) {
        this.dialog = "LOGIN";
        return;
      }
      const lastBookName = this.currentBook.name;
      this.currentBook = newBook();
      this.toast(`Saved ${lastBookName} and created ${this.currentBook.name} \u2728`);
    },
    async loadBook(book) {
      this.save();
      console.log("load", book.cuid);
      if (!this.userModel) {
        this.dialog = "LOGIN";
        return;
      }
      const response = await fetch("/api/book/" + book.cuid);
      const json = await response.json();
      const bookModel = json.model;
      bookModel.elements = JSON.parse(bookModel.elementsJson);
      delete bookModel["elementsJson"];
      this.currentBook = bookModel;
      this.toast(`Loaded ${this.currentBook.name}`);
      this.dialog = null;
      this.menu = false;
    },
    timeSince(uts) {
      return getTimeSince(uts);
    }
  }).mount();
})();
