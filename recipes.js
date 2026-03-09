// ============================================
// Little Chefs Weekly - Recipe Database
// 30-minute recipes for 2yo & 4yo
// Cuisines: Italian, Japanese, Chinese + comfort
// Sourced from: Little Farms, Talula Farms, Zairyo (Singapore)
// ============================================

const RECIPES = [
  // ─── ITALIAN ──────────────────────────────────────
  {
    id: "it-01",
    name: "Mini Margherita Flatbreads",
    cuisine: "italian",
    meal: "both",
    time: 25,
    tags: ["italian", "new"],
    description: "Crispy flatbreads with fresh tomato sauce, mozzarella and basil - a viral TikTok favourite simplified for little hands.",
    ingredients: [
      { item: "Flatbread / naan", qty: "2 pieces", store: "little-farms" },
      { item: "Tinned San Marzano tomatoes", qty: "200g", store: "little-farms" },
      { item: "Fresh mozzarella", qty: "1 ball (125g)", store: "little-farms" },
      { item: "Fresh basil", qty: "1 small bunch", store: "little-farms" },
      { item: "Olive oil", qty: "1 tbsp", store: "little-farms" },
      { item: "Garlic", qty: "1 clove", store: "little-farms" }
    ],
    steps: [
      "Preheat oven to 200°C. Crush tomatoes with garlic and a pinch of salt.",
      "Spread tomato sauce on flatbreads. Tear mozzarella over the top.",
      "Bake for 10-12 minutes until cheese is bubbly and golden.",
      "Top with fresh basil leaves. Cut into small strips for easy gripping."
    ],
    tips: "Let kids tear the basil and place cheese. For the 2yo, cut into finger-width strips."
  },
  {
    id: "it-02",
    name: "Creamy Pumpkin Risotto",
    cuisine: "italian",
    meal: "dinner",
    time: 30,
    tags: ["italian", "rice"],
    description: "Silky risotto with roasted pumpkin, parmesan and a touch of sage - a cozy classic.",
    ingredients: [
      { item: "Arborio rice", qty: "1 cup", store: "little-farms" },
      { item: "Pumpkin, peeled & diced", qty: "200g", store: "little-farms" },
      { item: "Parmesan cheese", qty: "30g", store: "little-farms" },
      { item: "Chicken stock (low sodium)", qty: "500ml", store: "little-farms" },
      { item: "Butter (unsalted)", qty: "1 tbsp", store: "little-farms" },
      { item: "Onion", qty: "1 small", store: "little-farms" },
      { item: "Fresh sage", qty: "3-4 leaves", store: "little-farms" }
    ],
    steps: [
      "Microwave diced pumpkin with a splash of water for 5 mins until soft. Mash half, keep half chunky.",
      "Sauté finely diced onion in butter until soft (3 mins). Add rice, stir 1 min.",
      "Add warm stock a ladle at a time, stirring between additions (about 18 mins total).",
      "Stir in mashed pumpkin, pumpkin chunks, and parmesan. Season lightly."
    ],
    tips: "The 4yo can help stir the risotto. Freeze leftovers into small portions for quick future meals."
  },
  {
    id: "it-03",
    name: "Hidden Veggie Bolognese Pasta",
    cuisine: "italian",
    meal: "dinner",
    time: 30,
    tags: ["italian"],
    description: "Classic bolognese with finely grated carrot and zucchini blended into the sauce.",
    ingredients: [
      { item: "Penne or fusilli pasta", qty: "200g", store: "little-farms" },
      { item: "Beef mince", qty: "200g", store: "little-farms" },
      { item: "Tinned chopped tomatoes", qty: "1 can (400g)", store: "little-farms" },
      { item: "Carrot", qty: "1 medium", store: "little-farms" },
      { item: "Zucchini", qty: "1 small", store: "little-farms" },
      { item: "Onion", qty: "1 small", store: "little-farms" },
      { item: "Garlic", qty: "1 clove", store: "little-farms" },
      { item: "Olive oil", qty: "1 tbsp", store: "little-farms" },
      { item: "Parmesan cheese", qty: "for topping", store: "little-farms" }
    ],
    steps: [
      "Boil pasta according to packet. Finely grate carrot and zucchini.",
      "Sauté onion and garlic in olive oil. Add mince, cook until browned.",
      "Add grated veg and tinned tomatoes. Simmer 15 mins until thick.",
      "Toss with drained pasta. Serve with grated parmesan."
    ],
    tips: "Grate the veg very finely so they dissolve into the sauce. The 4yo can help grate the zucchini with a box grater under supervision."
  },
  {
    id: "it-04",
    name: "Butter & Parmesan Gnocchi",
    cuisine: "italian",
    meal: "both",
    time: 15,
    tags: ["italian", "potato"],
    description: "Pillowy potato gnocchi tossed in brown butter and parmesan - simple, quick and irresistible.",
    ingredients: [
      { item: "Fresh potato gnocchi", qty: "400g", store: "little-farms" },
      { item: "Butter (unsalted)", qty: "2 tbsp", store: "little-farms" },
      { item: "Parmesan cheese", qty: "30g", store: "little-farms" },
      { item: "Fresh sage", qty: "4-5 leaves", store: "little-farms" }
    ],
    steps: [
      "Boil gnocchi until they float (2-3 mins). Drain, reserving a splash of pasta water.",
      "Melt butter in a pan until golden and nutty. Add sage leaves, cook 30 seconds.",
      "Add gnocchi and a splash of pasta water. Toss until coated.",
      "Serve with generous parmesan."
    ],
    tips: "The 2yo loves the pillow shape. Gnocchi freezes well - make double and freeze half."
  },
  {
    id: "it-05",
    name: "Mini Meatball Soup (Italian Wedding)",
    cuisine: "italian",
    meal: "both",
    time: 30,
    tags: ["italian", "soup"],
    description: "Tiny meatballs in a light broth with mini pasta and spinach - a viral comfort soup.",
    ingredients: [
      { item: "Chicken mince", qty: "200g", store: "little-farms" },
      { item: "Stelline / small pasta", qty: "80g", store: "little-farms" },
      { item: "Chicken stock (low sodium)", qty: "750ml", store: "little-farms" },
      { item: "Baby spinach", qty: "1 handful", store: "little-farms" },
      { item: "Parmesan cheese", qty: "2 tbsp grated", store: "little-farms" },
      { item: "Breadcrumbs", qty: "2 tbsp", store: "little-farms" },
      { item: "Egg", qty: "1", store: "little-farms" },
      { item: "Carrot", qty: "1 small", store: "little-farms" }
    ],
    steps: [
      "Mix mince with breadcrumbs, egg, 1 tbsp parmesan, and a pinch of salt. Roll into tiny (1cm) balls.",
      "Bring stock to a boil with finely diced carrot. Add meatballs, simmer 8 mins.",
      "Add pasta, cook until tender (about 8 mins). Stir in spinach to wilt.",
      "Serve in bowls with parmesan sprinkled on top."
    ],
    tips: "The 4yo can help roll the tiny meatballs. Make them truly small - toddler-mouth sized."
  },
  {
    id: "it-06",
    name: "Creamy Tomato Orzo",
    cuisine: "italian",
    meal: "both",
    time: 25,
    tags: ["italian", "new"],
    description: "A viral one-pot creamy tomato orzo that kids go wild for - rice-shaped pasta in a velvety sauce.",
    ingredients: [
      { item: "Orzo pasta", qty: "200g", store: "little-farms" },
      { item: "Tinned chopped tomatoes", qty: "1 can (400g)", store: "little-farms" },
      { item: "Cream cheese", qty: "2 tbsp", store: "little-farms" },
      { item: "Chicken stock (low sodium)", qty: "250ml", store: "little-farms" },
      { item: "Garlic", qty: "1 clove", store: "little-farms" },
      { item: "Baby spinach", qty: "1 handful", store: "little-farms" },
      { item: "Parmesan cheese", qty: "for topping", store: "little-farms" }
    ],
    steps: [
      "Sauté garlic in a little olive oil. Add tomatoes and stock, bring to a boil.",
      "Add orzo, reduce heat. Simmer 10-12 mins, stirring often, until orzo is tender.",
      "Stir in cream cheese and spinach until wilted and creamy.",
      "Serve with parmesan on top."
    ],
    tips: "Orzo's rice-like shape makes it easy for toddlers to scoop. This one-pot meal is a viral favourite for a reason."
  },

  // ─── JAPANESE ─────────────────────────────────────
  {
    id: "jp-01",
    name: "Teriyaki Chicken Rice Bowls",
    cuisine: "japanese",
    meal: "both",
    time: 25,
    tags: ["japanese", "rice"],
    description: "Sweet teriyaki glazed chicken over fluffy rice with edamame - a kid-friendly donburi.",
    ingredients: [
      { item: "Chicken thigh (boneless)", qty: "200g", store: "little-farms" },
      { item: "Japanese short-grain rice", qty: "1 cup", store: "zairyo" },
      { item: "Soy sauce", qty: "2 tbsp", store: "zairyo" },
      { item: "Mirin", qty: "2 tbsp", store: "zairyo" },
      { item: "Sugar", qty: "1 tsp", store: "little-farms" },
      { item: "Frozen edamame", qty: "100g", store: "zairyo" },
      { item: "Nori strips", qty: "for garnish", store: "zairyo" }
    ],
    steps: [
      "Cook rice in a rice cooker or pot. Boil edamame for 3 mins, drain and shell.",
      "Cut chicken into small, thin pieces. Pan-fry until golden (5-6 mins).",
      "Mix soy sauce, mirin, and sugar. Pour over chicken, simmer until glossy (2-3 mins).",
      "Serve chicken over rice with edamame. Garnish with nori strips."
    ],
    tips: "Cut chicken very small for the 2yo. The sweet teriyaki glaze is naturally appealing to little palates."
  },
  {
    id: "jp-02",
    name: "Miso Udon Noodle Soup",
    cuisine: "japanese",
    meal: "both",
    time: 20,
    tags: ["japanese", "noodle", "soup"],
    description: "Comforting udon in a gentle miso broth with tofu, corn and wakame - a gentle intro to Japanese flavours.",
    ingredients: [
      { item: "Udon noodles (fresh or frozen)", qty: "2 portions", store: "zairyo" },
      { item: "White miso paste", qty: "2 tbsp", store: "zairyo" },
      { item: "Dashi stock powder", qty: "1 tsp", store: "zairyo" },
      { item: "Soft tofu", qty: "150g", store: "zairyo" },
      { item: "Sweet corn (frozen)", qty: "3 tbsp", store: "little-farms" },
      { item: "Dried wakame", qty: "1 tsp", store: "zairyo" },
      { item: "Spring onion", qty: "1 stalk", store: "little-farms" }
    ],
    steps: [
      "Bring 600ml water to a boil. Add dashi powder and corn, simmer 3 mins.",
      "Cook udon noodles per packet directions. Add cubed tofu and wakame to broth.",
      "Remove broth from heat. Dissolve miso paste into the broth (don't boil after adding miso).",
      "Place noodles in bowls, pour miso broth over. Top with spring onion."
    ],
    tips: "Cut udon noodles shorter for the 2yo with kitchen scissors. The mild miso broth is perfect for young palates."
  },
  {
    id: "jp-03",
    name: "Salmon Onigiri (Rice Balls)",
    cuisine: "japanese",
    meal: "lunch",
    time: 25,
    tags: ["japanese", "rice", "new"],
    description: "Cute triangle rice balls stuffed with flaked salmon - trending onigiri that kids love to hold and eat.",
    ingredients: [
      { item: "Japanese short-grain rice", qty: "1.5 cups", store: "zairyo" },
      { item: "Salmon fillet", qty: "1 piece (120g)", store: "little-farms" },
      { item: "Nori sheets", qty: "2 sheets", store: "zairyo" },
      { item: "Soy sauce", qty: "1 tsp", store: "zairyo" },
      { item: "Sesame seeds", qty: "1 tsp", store: "zairyo" },
      { item: "Rice vinegar", qty: "1 tsp", store: "zairyo" },
      { item: "Salt", qty: "a pinch", store: "little-farms" }
    ],
    steps: [
      "Cook rice and let cool slightly. Mix with a splash of rice vinegar.",
      "Pan-fry salmon until cooked through (4-5 mins each side). Flake with a fork, mix with soy sauce.",
      "Wet hands with salted water. Take a handful of rice, press salmon into centre, shape into a triangle.",
      "Wrap bottom half of each onigiri with a strip of nori. Sprinkle with sesame seeds."
    ],
    tips: "Make them small for little hands. The 4yo can help shape the rice balls - use cling wrap if they find it easier."
  },
  {
    id: "jp-04",
    name: "Japanese Curry Rice (Mild)",
    cuisine: "japanese",
    meal: "dinner",
    time: 30,
    tags: ["japanese", "rice", "potato"],
    description: "Sweet and mild Japanese curry with potato and carrot - a beloved comfort food across all ages.",
    ingredients: [
      { item: "Japanese curry roux (mild)", qty: "2 blocks", store: "zairyo" },
      { item: "Chicken thigh (boneless)", qty: "200g", store: "little-farms" },
      { item: "Potato", qty: "1 medium", store: "little-farms" },
      { item: "Carrot", qty: "1 medium", store: "little-farms" },
      { item: "Onion", qty: "1 medium", store: "little-farms" },
      { item: "Japanese short-grain rice", qty: "1 cup", store: "zairyo" }
    ],
    steps: [
      "Cook rice. Cut chicken, potato, carrot, and onion into small cubes.",
      "Sauté onion until soft, add chicken and cook through. Add potato and carrot.",
      "Add 400ml water, bring to boil, then simmer 15 mins until vegetables are tender.",
      "Turn off heat. Add curry roux blocks, stir until dissolved. Simmer 3 more mins. Serve over rice."
    ],
    tips: "Japanese curry roux is naturally mild and sweet - perfect for kids. Cut potato pieces small so they cook quickly."
  },
  {
    id: "jp-05",
    name: "Tamago (Egg) Fried Rice",
    cuisine: "japanese",
    meal: "lunch",
    time: 15,
    tags: ["japanese", "rice"],
    description: "Simple Japanese-style egg fried rice with a touch of soy and sesame - a quick lunch favourite.",
    ingredients: [
      { item: "Cooked Japanese short-grain rice", qty: "2 cups (day-old best)", store: "zairyo" },
      { item: "Eggs", qty: "2", store: "little-farms" },
      { item: "Soy sauce", qty: "1 tbsp", store: "zairyo" },
      { item: "Sesame oil", qty: "1 tsp", store: "zairyo" },
      { item: "Frozen peas", qty: "3 tbsp", store: "little-farms" },
      { item: "Spring onion", qty: "1 stalk", store: "little-farms" }
    ],
    steps: [
      "Beat eggs. Heat sesame oil in a wok over high heat.",
      "Scramble eggs until just set, break into small pieces.",
      "Add rice and peas, stir-fry for 3-4 minutes.",
      "Add soy sauce around edge of wok, toss to combine. Top with spring onion."
    ],
    tips: "Use day-old rice for best results - the drier texture fries better. The 4yo can help crack the eggs."
  },
  {
    id: "jp-06",
    name: "Kabocha Pumpkin Soup (Japanese-style)",
    cuisine: "japanese",
    meal: "both",
    time: 25,
    tags: ["japanese", "soup", "new"],
    description: "Silky sweet kabocha pumpkin soup with a hint of miso - a comforting Japanese autumn staple.",
    ingredients: [
      { item: "Kabocha pumpkin", qty: "300g, peeled & cubed", store: "zairyo" },
      { item: "White miso paste", qty: "1 tbsp", store: "zairyo" },
      { item: "Onion", qty: "1 small", store: "little-farms" },
      { item: "Dashi stock powder", qty: "1 tsp", store: "zairyo" },
      { item: "Butter (unsalted)", qty: "1 tbsp", store: "little-farms" },
      { item: "Milk or cream", qty: "100ml", store: "little-farms" }
    ],
    steps: [
      "Sauté onion in butter until soft. Add kabocha and 300ml water with dashi powder.",
      "Bring to a boil, then simmer 15 mins until kabocha is very soft.",
      "Blend until silky smooth. Stir in milk/cream and miso paste.",
      "Serve warm in small bowls - kabocha's natural sweetness needs no added sugar."
    ],
    tips: "Kabocha is naturally sweet and creamy, making it perfect for fussy eaters. Pair with rice or bread."
  },
  {
    id: "jp-07",
    name: "Chicken Katsu Bites",
    cuisine: "japanese",
    meal: "both",
    time: 25,
    tags: ["japanese", "new"],
    description: "Crispy panko-coated chicken bites - the viral kid-approved Japanese comfort food.",
    ingredients: [
      { item: "Chicken breast", qty: "200g", store: "little-farms" },
      { item: "Panko breadcrumbs", qty: "1 cup", store: "zairyo" },
      { item: "Egg", qty: "1", store: "little-farms" },
      { item: "Plain flour", qty: "3 tbsp", store: "little-farms" },
      { item: "Tonkatsu sauce", qty: "for dipping", store: "zairyo" },
      { item: "Japanese short-grain rice", qty: "1 cup", store: "zairyo" },
      { item: "Vegetable oil", qty: "for frying", store: "little-farms" }
    ],
    steps: [
      "Cook rice. Cut chicken into bite-sized pieces.",
      "Coat chicken: flour → beaten egg → panko breadcrumbs.",
      "Shallow-fry in 1cm oil until golden and cooked through (3-4 mins per side). Drain on paper towel.",
      "Serve with rice and tonkatsu sauce on the side for dipping."
    ],
    tips: "Cut pieces small for the 2yo. You can bake instead of fry at 200°C for 15 mins for a lighter option."
  },

  // ─── CHINESE ──────────────────────────────────────
  {
    id: "cn-01",
    name: "Egg Drop Corn Soup",
    cuisine: "chinese",
    meal: "both",
    time: 15,
    tags: ["chinese", "soup"],
    description: "Silky egg ribbons in a sweet corn broth - a Cantonese restaurant classic simplified for home.",
    ingredients: [
      { item: "Chicken stock (low sodium)", qty: "500ml", store: "little-farms" },
      { item: "Creamed corn", qty: "1 can (200g)", store: "little-farms" },
      { item: "Eggs", qty: "2", store: "little-farms" },
      { item: "Cornstarch", qty: "1 tbsp", store: "little-farms" },
      { item: "Sesame oil", qty: "½ tsp", store: "zairyo" },
      { item: "Spring onion", qty: "1 stalk", store: "little-farms" }
    ],
    steps: [
      "Bring stock to a boil. Add creamed corn, stir to combine.",
      "Mix cornstarch with 2 tbsp cold water. Stir into soup to thicken slightly.",
      "Beat eggs. While soup is simmering, slowly pour in egg in a thin stream while stirring gently.",
      "Drizzle with sesame oil, top with chopped spring onion."
    ],
    tips: "The 2yo loves the silky texture. Pour the egg very slowly for beautiful ribbon strands."
  },
  {
    id: "cn-02",
    name: "Sweet Soy Noodles with Greens",
    cuisine: "chinese",
    meal: "both",
    time: 20,
    tags: ["chinese", "noodle"],
    description: "Springy egg noodles in a gentle sweet soy sauce with bok choy - simple Shanghainese-inspired comfort.",
    ingredients: [
      { item: "Fresh egg noodles", qty: "200g", store: "zairyo" },
      { item: "Bok choy", qty: "2 heads (baby)", store: "little-farms" },
      { item: "Soy sauce (light)", qty: "2 tbsp", store: "zairyo" },
      { item: "Dark soy sauce", qty: "1 tsp", store: "zairyo" },
      { item: "Sugar", qty: "1 tsp", store: "little-farms" },
      { item: "Sesame oil", qty: "1 tsp", store: "zairyo" },
      { item: "Garlic", qty: "1 clove", store: "little-farms" }
    ],
    steps: [
      "Boil noodles per packet instructions. Drain and toss with a drizzle of sesame oil.",
      "Cut bok choy into quarters. Blanch in boiling water for 1 min, drain.",
      "Stir-fry garlic in oil. Add noodles, soy sauces, and sugar. Toss on high heat 2 mins.",
      "Plate noodles with bok choy on the side."
    ],
    tips: "Cut noodles shorter for the 2yo. The slightly sweet sauce is very gentle for young palates."
  },
  {
    id: "cn-03",
    name: "Steamed Egg Custard (Zheng Shui Dan)",
    cuisine: "chinese",
    meal: "both",
    time: 20,
    tags: ["chinese", "new"],
    description: "Silky-smooth steamed egg with soy sauce - a trending viral Chinese comfort food, gentle enough for toddlers.",
    ingredients: [
      { item: "Eggs", qty: "3", store: "little-farms" },
      { item: "Chicken stock (warm, low sodium)", qty: "250ml", store: "little-farms" },
      { item: "Soy sauce (light)", qty: "1 tsp", store: "zairyo" },
      { item: "Sesame oil", qty: "½ tsp", store: "zairyo" },
      { item: "Spring onion", qty: "1 stalk", store: "little-farms" }
    ],
    steps: [
      "Beat eggs gently (avoid bubbles). Mix in warm stock at a 1:1.5 ratio (egg to stock).",
      "Strain mixture through a sieve into a heatproof bowl for a silky texture.",
      "Cover tightly with foil. Steam over medium-low heat for 12-15 mins until just set (jiggly in the centre is OK).",
      "Drizzle with soy sauce, sesame oil, and spring onion."
    ],
    tips: "The key is gentle heat - too high and you get bubbles. This is one of the most nutritious simple foods for toddlers."
  },
  {
    id: "cn-04",
    name: "Congee with Chicken & Corn",
    cuisine: "chinese",
    meal: "both",
    time: 30,
    tags: ["chinese", "rice", "soup"],
    description: "Creamy rice porridge with shredded chicken and sweet corn - the ultimate comfort meal for little ones.",
    ingredients: [
      { item: "Jasmine rice", qty: "½ cup", store: "little-farms" },
      { item: "Chicken thigh (boneless)", qty: "1 piece", store: "little-farms" },
      { item: "Chicken stock (low sodium)", qty: "700ml", store: "little-farms" },
      { item: "Sweet corn (frozen)", qty: "3 tbsp", store: "little-farms" },
      { item: "Ginger", qty: "2 slices", store: "zairyo" },
      { item: "Soy sauce (light)", qty: "1 tsp", store: "zairyo" },
      { item: "Spring onion", qty: "1 stalk", store: "little-farms" },
      { item: "Sesame oil", qty: "½ tsp", store: "zairyo" }
    ],
    steps: [
      "Bring stock and ginger to a boil. Add rice and whole chicken thigh. Reduce to a simmer.",
      "Cook 25 mins, stirring occasionally, until rice breaks down into a porridge.",
      "Remove chicken, shred with forks. Return to pot with corn. Cook 3 more mins.",
      "Serve with a drizzle of soy sauce, sesame oil, and spring onion."
    ],
    tips: "For speedier congee, use leftover cooked rice and reduce cooking time to 15 mins. The 2yo loves the smooth, spoonable texture."
  },
  {
    id: "cn-05",
    name: "Tomato Egg Stir-Fry with Rice",
    cuisine: "chinese",
    meal: "both",
    time: 15,
    tags: ["chinese", "rice"],
    description: "The iconic Chinese home-cooking staple - fluffy scrambled eggs in a sweet tomato sauce over rice.",
    ingredients: [
      { item: "Eggs", qty: "3", store: "little-farms" },
      { item: "Tomatoes", qty: "2 medium, ripe", store: "little-farms" },
      { item: "Sugar", qty: "1 tsp", store: "little-farms" },
      { item: "Ketchup", qty: "1 tsp (optional)", store: "little-farms" },
      { item: "Jasmine rice", qty: "1 cup cooked", store: "little-farms" },
      { item: "Spring onion", qty: "1 stalk", store: "little-farms" },
      { item: "Vegetable oil", qty: "2 tbsp", store: "little-farms" }
    ],
    steps: [
      "Score and blanch tomatoes to peel, then cut into chunks.",
      "Scramble eggs in oil until just set and fluffy. Remove from pan.",
      "In the same pan, cook tomatoes with sugar until saucy (5 mins). Add a touch of ketchup if desired.",
      "Return eggs to pan, gently fold together. Serve over rice with spring onion."
    ],
    tips: "This is many Chinese kids' first favourite meal. The sweet-tangy tomato with fluffy egg is universally loved."
  },
  {
    id: "cn-06",
    name: "Wonton Noodle Soup",
    cuisine: "chinese",
    meal: "dinner",
    time: 30,
    tags: ["chinese", "noodle", "soup"],
    description: "Tiny pork wontons in a clear broth with thin egg noodles and bok choy.",
    ingredients: [
      { item: "Wonton wrappers", qty: "20 pieces", store: "zairyo" },
      { item: "Pork mince", qty: "150g", store: "little-farms" },
      { item: "Thin egg noodles", qty: "150g", store: "zairyo" },
      { item: "Chicken stock (low sodium)", qty: "600ml", store: "little-farms" },
      { item: "Bok choy", qty: "2 heads (baby)", store: "little-farms" },
      { item: "Soy sauce (light)", qty: "1 tbsp", store: "zairyo" },
      { item: "Sesame oil", qty: "1 tsp", store: "zairyo" },
      { item: "Ginger", qty: "2 slices", store: "zairyo" },
      { item: "Spring onion", qty: "1 stalk", store: "little-farms" }
    ],
    steps: [
      "Mix pork mince with 1 tsp soy sauce and ½ tsp sesame oil. Place 1 tsp filling in each wrapper, fold and seal.",
      "Bring stock with ginger to a boil. Drop in wontons, cook 5-6 mins until they float.",
      "Cook noodles separately per packet, drain. Blanch bok choy in the broth.",
      "Place noodles in bowls, top with wontons and bok choy, ladle broth over. Garnish with spring onion."
    ],
    tips: "The 4yo can help fold wontons - they don't need to look perfect! Make extras and freeze uncooked for a quick future meal."
  },
  {
    id: "cn-07",
    name: "Fried Rice with Vegetables",
    cuisine: "chinese",
    meal: "lunch",
    time: 15,
    tags: ["chinese", "rice"],
    description: "Classic Chinese fried rice with colourful diced vegetables and egg - a lunchtime staple.",
    ingredients: [
      { item: "Cooked jasmine rice", qty: "2 cups (day-old best)", store: "little-farms" },
      { item: "Eggs", qty: "2", store: "little-farms" },
      { item: "Frozen peas and corn", qty: "4 tbsp", store: "little-farms" },
      { item: "Carrot", qty: "1 small, finely diced", store: "little-farms" },
      { item: "Soy sauce (light)", qty: "1.5 tbsp", store: "zairyo" },
      { item: "Sesame oil", qty: "1 tsp", store: "zairyo" },
      { item: "Spring onion", qty: "1 stalk", store: "little-farms" }
    ],
    steps: [
      "Heat oil in wok over high heat. Scramble eggs, break into small pieces.",
      "Add carrot, peas and corn. Stir-fry 2 mins.",
      "Add rice, toss over high heat. Add soy sauce around edge of wok.",
      "Drizzle with sesame oil, toss to combine. Top with spring onion."
    ],
    tips: "Dice everything very small for the 2yo. Day-old rice makes the best fried rice - less sticky."
  },

  // ─── COMFORT / PALATE EXPANSION ───────────────────
  {
    id: "cf-01",
    name: "Creamy Potato & Leek Soup",
    cuisine: "comfort",
    meal: "both",
    time: 25,
    tags: ["comfort", "soup", "potato"],
    description: "Velvety smooth potato and leek soup - a warming classic that toddlers find irresistible.",
    ingredients: [
      { item: "Potatoes", qty: "3 medium", store: "little-farms" },
      { item: "Leek", qty: "1 large", store: "little-farms" },
      { item: "Chicken stock (low sodium)", qty: "500ml", store: "little-farms" },
      { item: "Butter (unsalted)", qty: "1 tbsp", store: "little-farms" },
      { item: "Cream", qty: "3 tbsp", store: "little-farms" },
      { item: "Chives", qty: "for garnish", store: "little-farms" }
    ],
    steps: [
      "Peel and dice potatoes small. Wash leek thoroughly, slice the white and light green parts.",
      "Sauté leek in butter until soft (3 mins). Add potatoes and stock.",
      "Boil, then simmer 15 mins until potatoes are very soft.",
      "Blend until silky smooth. Stir in cream. Serve with a snip of chives."
    ],
    tips: "Add a little cheese on top for extra appeal. Pair with bread soldiers for dipping."
  },
  {
    id: "cf-02",
    name: "Mac & Cheese with Hidden Cauliflower",
    cuisine: "comfort",
    meal: "both",
    time: 25,
    tags: ["comfort"],
    description: "Creamy mac & cheese with steamed cauliflower blended right into the sauce - they will never know.",
    ingredients: [
      { item: "Macaroni pasta", qty: "200g", store: "little-farms" },
      { item: "Cauliflower", qty: "150g florets", store: "little-farms" },
      { item: "Cheddar cheese", qty: "80g grated", store: "little-farms" },
      { item: "Milk", qty: "100ml", store: "little-farms" },
      { item: "Butter (unsalted)", qty: "1 tbsp", store: "little-farms" },
      { item: "Plain flour", qty: "1 tbsp", store: "little-farms" }
    ],
    steps: [
      "Boil pasta. Steam cauliflower until very soft (8 mins). Blend cauliflower with milk until smooth.",
      "Melt butter, stir in flour, cook 1 min. Add cauliflower-milk mixture, stir until thick.",
      "Remove from heat, stir in grated cheese until melted and smooth.",
      "Toss sauce with drained pasta. Serve immediately."
    ],
    tips: "The cauliflower disappears completely into the cheese sauce. A masterclass in hidden vegetables."
  },
  {
    id: "cf-03",
    name: "Sweet Potato & Coconut Soup",
    cuisine: "adventure",
    meal: "both",
    time: 25,
    tags: ["adventure", "soup", "new"],
    description: "Naturally sweet and creamy soup with a hint of coconut - expanding little palates gently.",
    ingredients: [
      { item: "Sweet potatoes", qty: "2 medium", store: "little-farms" },
      { item: "Coconut milk", qty: "200ml", store: "zairyo" },
      { item: "Chicken stock (low sodium)", qty: "300ml", store: "little-farms" },
      { item: "Onion", qty: "1 small", store: "little-farms" },
      { item: "Ginger", qty: "1 tsp grated", store: "zairyo" },
      { item: "Butter (unsalted)", qty: "1 tbsp", store: "little-farms" }
    ],
    steps: [
      "Peel and cube sweet potatoes small. Sauté onion and ginger in butter until fragrant.",
      "Add sweet potatoes, stock, and coconut milk. Bring to a boil.",
      "Simmer 15 mins until sweet potatoes are very soft.",
      "Blend until smooth. Serve warm - natural sweetness means no added sugar needed."
    ],
    tips: "A great bridge from familiar potato soup to more adventurous flavours. The coconut adds creaminess kids love."
  },
  {
    id: "cf-04",
    name: "Crispy Potato Pancakes (Latkes)",
    cuisine: "comfort",
    meal: "lunch",
    time: 25,
    tags: ["comfort", "potato", "new"],
    description: "Shredded golden potato pancakes - crispy outside, soft inside. A worldwide comfort favourite.",
    ingredients: [
      { item: "Potatoes", qty: "3 medium", store: "little-farms" },
      { item: "Egg", qty: "1", store: "little-farms" },
      { item: "Plain flour", qty: "2 tbsp", store: "little-farms" },
      { item: "Onion", qty: "1 small, grated", store: "little-farms" },
      { item: "Vegetable oil", qty: "for frying", store: "little-farms" },
      { item: "Sour cream or applesauce", qty: "for dipping", store: "little-farms" }
    ],
    steps: [
      "Grate potatoes and onion. Squeeze out excess moisture in a clean tea towel.",
      "Mix with egg, flour, and a pinch of salt.",
      "Heat oil in a pan. Drop tablespoons of mixture, flatten slightly. Fry 3-4 mins per side until golden.",
      "Drain on paper towels. Serve with sour cream or applesauce."
    ],
    tips: "Make them small for little hands. The 4yo can help shape the pancakes. Great for using up potatoes."
  },
  {
    id: "cf-05",
    name: "Shepherd's Pie Cups",
    cuisine: "comfort",
    meal: "dinner",
    time: 30,
    tags: ["comfort", "potato"],
    description: "Individual portions of savoury mince topped with fluffy mashed potato - a cozy classic made toddler-sized.",
    ingredients: [
      { item: "Beef or lamb mince", qty: "200g", store: "little-farms" },
      { item: "Potatoes", qty: "3 medium", store: "little-farms" },
      { item: "Carrot", qty: "1 medium, finely diced", store: "little-farms" },
      { item: "Frozen peas", qty: "3 tbsp", store: "little-farms" },
      { item: "Onion", qty: "1 small", store: "little-farms" },
      { item: "Butter (unsalted)", qty: "2 tbsp", store: "little-farms" },
      { item: "Milk", qty: "2 tbsp", store: "little-farms" },
      { item: "Tomato paste", qty: "1 tbsp", store: "little-farms" }
    ],
    steps: [
      "Peel and boil potatoes until soft (12 mins). Mash with butter and milk.",
      "Sauté onion, then add mince and cook until browned. Add diced carrot, peas, and tomato paste with a splash of water.",
      "Simmer filling 10 mins until carrot is tender. Spoon into ramekins or a small baking dish.",
      "Top with mashed potato. Grill for 3-5 mins until golden on top."
    ],
    tips: "Individual ramekins make these fun for kids. The 4yo can help spoon the mash on top."
  },
  {
    id: "cf-06",
    name: "Peanut Noodles (Sesame Style)",
    cuisine: "adventure",
    meal: "lunch",
    time: 15,
    tags: ["adventure", "noodle", "new"],
    description: "Cold sesame-peanut noodles inspired by Sichuan dan dan mian (minus the spice) - a viral lunchbox favourite.",
    ingredients: [
      { item: "Thin egg noodles or somen", qty: "200g", store: "zairyo" },
      { item: "Peanut butter (smooth)", qty: "2 tbsp", store: "little-farms" },
      { item: "Soy sauce", qty: "1 tbsp", store: "zairyo" },
      { item: "Sesame oil", qty: "1 tbsp", store: "zairyo" },
      { item: "Rice vinegar", qty: "1 tsp", store: "zairyo" },
      { item: "Cucumber", qty: "½, cut into matchsticks", store: "little-farms" },
      { item: "Sesame seeds", qty: "1 tsp", store: "zairyo" }
    ],
    steps: [
      "Cook noodles per packet directions. Rinse under cold water and drain.",
      "Whisk peanut butter, soy sauce, sesame oil, rice vinegar, and 2 tbsp warm water until smooth.",
      "Toss noodles with sauce. Top with cucumber matchsticks and sesame seeds.",
      "Serve cold or at room temperature."
    ],
    tips: "Check for peanut allergies first. These noodles are great for lunchboxes - they taste even better after sitting. Cut noodles short for the 2yo."
  },
  {
    id: "cf-07",
    name: "Chicken & Sweetcorn Dumplings",
    cuisine: "chinese",
    meal: "both",
    time: 30,
    tags: ["chinese", "new"],
    description: "Plump steamed dumplings with a simple chicken and sweetcorn filling - fun to make together.",
    ingredients: [
      { item: "Dumpling wrappers (round)", qty: "20 pieces", store: "zairyo" },
      { item: "Chicken mince", qty: "200g", store: "little-farms" },
      { item: "Sweet corn (frozen)", qty: "3 tbsp", store: "little-farms" },
      { item: "Soy sauce (light)", qty: "1 tbsp", store: "zairyo" },
      { item: "Sesame oil", qty: "1 tsp", store: "zairyo" },
      { item: "Ginger", qty: "1 tsp grated", store: "zairyo" },
      { item: "Spring onion", qty: "1 stalk, finely chopped", store: "little-farms" }
    ],
    steps: [
      "Mix chicken mince with corn, soy sauce, sesame oil, ginger, and spring onion.",
      "Place 1 tsp filling in centre of each wrapper. Wet edges, fold in half and press to seal.",
      "Steam dumplings in a lined bamboo steamer for 10-12 minutes until cooked through.",
      "Serve with a little soy sauce mixed with rice vinegar for dipping."
    ],
    tips: "The 4yo will love helping to fill and fold! Make a big batch and freeze extras on a tray before transferring to a bag."
  },
  {
    id: "cf-08",
    name: "Grilled Cheese & Tomato Soup Dippers",
    cuisine: "comfort",
    meal: "lunch",
    time: 20,
    tags: ["comfort"],
    description: "Classic grilled cheese cut into soldiers with a smooth tomato soup for dipping - the ultimate comfort duo.",
    ingredients: [
      { item: "Bread (white or sourdough)", qty: "4 slices", store: "little-farms" },
      { item: "Cheddar cheese", qty: "60g, sliced", store: "little-farms" },
      { item: "Butter (unsalted)", qty: "2 tbsp", store: "little-farms" },
      { item: "Tinned chopped tomatoes", qty: "1 can (400g)", store: "little-farms" },
      { item: "Chicken stock (low sodium)", qty: "100ml", store: "little-farms" },
      { item: "Cream", qty: "2 tbsp", store: "little-farms" }
    ],
    steps: [
      "For soup: simmer tinned tomatoes with stock for 10 mins. Blend smooth, stir in cream.",
      "For grilled cheese: butter bread outsides. Place cheese between slices.",
      "Cook in a pan over medium heat, 3 mins per side until golden and melted.",
      "Cut into strips/soldiers. Serve with warm soup for dipping."
    ],
    tips: "The dipping format makes this extra fun. Both ages love dunking their cheesy soldiers."
  },
  {
    id: "adv-01",
    name: "Okonomiyaki (Japanese Cabbage Pancake)",
    cuisine: "japanese",
    meal: "both",
    time: 25,
    tags: ["japanese", "new", "adventure"],
    description: "A fun, savoury Japanese pancake loaded with cabbage - a trending street food made toddler-friendly.",
    ingredients: [
      { item: "Plain flour", qty: "½ cup", store: "little-farms" },
      { item: "Eggs", qty: "2", store: "little-farms" },
      { item: "Cabbage", qty: "2 cups, finely shredded", store: "little-farms" },
      { item: "Dashi stock powder", qty: "½ tsp", store: "zairyo" },
      { item: "Okonomiyaki sauce", qty: "for topping", store: "zairyo" },
      { item: "Japanese mayonnaise", qty: "for topping", store: "zairyo" },
      { item: "Bonito flakes", qty: "for topping", store: "zairyo" }
    ],
    steps: [
      "Mix flour, eggs, dashi, and 3 tbsp water to make a batter. Fold in shredded cabbage.",
      "Heat a non-stick pan with oil over medium heat. Pour in half the batter, shape into a round disc.",
      "Cook 4-5 mins per side until golden and cooked through.",
      "Top with okonomiyaki sauce, mayo zigzag, and bonito flakes (the kids will love watching them dance)."
    ],
    tips: "The 4yo will be mesmerised by the bonito flakes moving in the heat. Cut into small wedges for serving."
  },
  {
    id: "adv-02",
    name: "Gyoza (Pan-Fried Dumplings)",
    cuisine: "japanese",
    meal: "both",
    time: 30,
    tags: ["japanese", "new"],
    description: "Crispy-bottomed Japanese dumplings with a juicy pork filling - the ultimate kid-approved finger food.",
    ingredients: [
      { item: "Gyoza wrappers", qty: "20 pieces", store: "zairyo" },
      { item: "Pork mince", qty: "150g", store: "little-farms" },
      { item: "Cabbage", qty: "1 cup, finely chopped", store: "little-farms" },
      { item: "Garlic", qty: "1 clove, minced", store: "little-farms" },
      { item: "Ginger", qty: "1 tsp grated", store: "zairyo" },
      { item: "Soy sauce", qty: "1 tbsp", store: "zairyo" },
      { item: "Sesame oil", qty: "1 tsp", store: "zairyo" },
      { item: "Rice vinegar", qty: "for dipping sauce", store: "zairyo" }
    ],
    steps: [
      "Salt and squeeze chopped cabbage dry. Mix with pork, garlic, ginger, soy sauce, and sesame oil.",
      "Place 1 tsp filling on each wrapper. Wet edges, fold in half, pleat to seal.",
      "Heat oil in a non-stick pan. Place gyoza flat-side down, cook 2 mins until golden on bottom.",
      "Add 3 tbsp water, cover, steam 5-6 mins. Uncover, cook until water evaporates and bottoms re-crisp."
    ],
    tips: "The steam-then-crisp method gives the signature crispy bottom. Dipping sauce: mix soy sauce + rice vinegar."
  },
  {
    id: "adv-03",
    name: "Mini Onigirazu (Sushi Sandwiches)",
    cuisine: "japanese",
    meal: "lunch",
    time: 20,
    tags: ["japanese", "rice", "new", "adventure"],
    description: "Trendy sushi sandwiches wrapped in nori - easier than rolling sushi, endlessly customisable.",
    ingredients: [
      { item: "Japanese short-grain rice", qty: "1.5 cups cooked", store: "zairyo" },
      { item: "Nori sheets", qty: "3 sheets", store: "zairyo" },
      { item: "Eggs", qty: "2", store: "little-farms" },
      { item: "Cucumber", qty: "½, sliced thin", store: "little-farms" },
      { item: "Canned tuna", qty: "1 small can", store: "little-farms" },
      { item: "Japanese mayonnaise", qty: "1 tbsp", store: "zairyo" },
      { item: "Soy sauce", qty: "for dipping", store: "zairyo" }
    ],
    steps: [
      "Make a thin egg omelette, cut into squares. Mix tuna with mayo.",
      "Lay nori sheet shiny-side down. Place rice in the centre, spread into a square.",
      "Layer omelette, tuna, and cucumber on rice. Top with more rice.",
      "Fold nori corners to centre like a parcel. Flip, rest 2 mins, then cut in half."
    ],
    tips: "These are easier than sushi rolls and great for little hands. Let the 4yo choose their own fillings."
  },
  {
    id: "adv-04",
    name: "Chinese Scallion Pancakes",
    cuisine: "chinese",
    meal: "lunch",
    time: 30,
    tags: ["chinese", "new", "adventure"],
    description: "Flaky, layered scallion pancakes - a beloved Chinese street food snack that kids devour.",
    ingredients: [
      { item: "Plain flour", qty: "1.5 cups", store: "little-farms" },
      { item: "Boiling water", qty: "½ cup", store: "little-farms" },
      { item: "Spring onion", qty: "3 stalks, finely chopped", store: "little-farms" },
      { item: "Sesame oil", qty: "2 tbsp", store: "zairyo" },
      { item: "Salt", qty: "½ tsp", store: "little-farms" },
      { item: "Vegetable oil", qty: "for frying", store: "little-farms" },
      { item: "Soy sauce", qty: "for dipping", store: "zairyo" }
    ],
    steps: [
      "Mix flour with boiling water and a pinch of cold water until a dough forms. Rest 10 mins.",
      "Roll dough thin. Brush with sesame oil, sprinkle with salt and spring onion.",
      "Roll up like a log, then coil into a disc. Roll flat again.",
      "Pan-fry in oil over medium heat, 3-4 mins per side until golden and flaky. Cut into wedges."
    ],
    tips: "The resting time allows the dough to become pliable. These are addictive - make extra! The layers come from the rolling technique."
  },
  {
    id: "adv-05",
    name: "Yakisoba (Japanese Stir-Fried Noodles)",
    cuisine: "japanese",
    meal: "both",
    time: 20,
    tags: ["japanese", "noodle"],
    description: "Sweet and savoury Japanese stir-fried noodles with vegetables - a festival favourite.",
    ingredients: [
      { item: "Yakisoba noodles", qty: "2 packets", store: "zairyo" },
      { item: "Yakisoba sauce", qty: "2 tbsp (from packet or bottle)", store: "zairyo" },
      { item: "Cabbage", qty: "1 cup, shredded", store: "little-farms" },
      { item: "Carrot", qty: "1 small, julienned", store: "little-farms" },
      { item: "Pork belly (thinly sliced)", qty: "100g", store: "zairyo" },
      { item: "Bonito flakes", qty: "for topping", store: "zairyo" },
      { item: "Japanese mayonnaise", qty: "for topping", store: "zairyo" }
    ],
    steps: [
      "Loosen noodles per packet instructions (usually a quick microwave or soak).",
      "Stir-fry pork until cooked. Add cabbage and carrot, cook 2-3 mins.",
      "Add noodles and yakisoba sauce. Toss over high heat for 2-3 mins.",
      "Serve with bonito flakes and a zigzag of mayo on top."
    ],
    tips: "If you can't find yakisoba sauce, mix: 1 tbsp Worcestershire, 1 tbsp ketchup, 1 tsp soy sauce. Cut noodles shorter for the 2yo."
  },
  {
    id: "adv-06",
    name: "Mapo Tofu (Mild Version)",
    cuisine: "chinese",
    meal: "dinner",
    time: 20,
    tags: ["chinese", "rice", "new", "adventure"],
    description: "The famous Sichuan dish reimagined without the heat - silky tofu in a savoury sauce over rice.",
    ingredients: [
      { item: "Soft tofu", qty: "1 block (300g)", store: "zairyo" },
      { item: "Pork mince", qty: "100g", store: "little-farms" },
      { item: "Soy sauce (light)", qty: "1 tbsp", store: "zairyo" },
      { item: "Sesame oil", qty: "1 tsp", store: "zairyo" },
      { item: "Cornstarch", qty: "1 tsp", store: "little-farms" },
      { item: "Garlic", qty: "1 clove", store: "little-farms" },
      { item: "Spring onion", qty: "1 stalk", store: "little-farms" },
      { item: "Jasmine rice", qty: "1 cup cooked", store: "little-farms" }
    ],
    steps: [
      "Cut tofu into small cubes. Gently blanch in salted water for 2 mins to firm up. Drain.",
      "Stir-fry pork mince with garlic until browned. Add soy sauce.",
      "Add 100ml water. Gently slide in tofu cubes. Simmer 5 mins.",
      "Mix cornstarch with 1 tbsp water, stir into pan to thicken. Drizzle sesame oil, top with spring onion. Serve over rice."
    ],
    tips: "No chilli at all for the kids - the savoury soy-pork flavour is plenty. Introduce a tiny pinch of white pepper first if expanding spice tolerance."
  },
  {
    id: "adv-07",
    name: "Potato Croquettes (Korokke)",
    cuisine: "japanese",
    meal: "both",
    time: 30,
    tags: ["japanese", "potato", "new"],
    description: "Japanese-style potato croquettes - creamy inside, crunchy outside. A beloved yoshoku classic.",
    ingredients: [
      { item: "Potatoes", qty: "3 medium", store: "little-farms" },
      { item: "Beef or pork mince", qty: "100g", store: "little-farms" },
      { item: "Onion", qty: "1 small, finely diced", store: "little-farms" },
      { item: "Panko breadcrumbs", qty: "1 cup", store: "zairyo" },
      { item: "Egg", qty: "1", store: "little-farms" },
      { item: "Plain flour", qty: "3 tbsp", store: "little-farms" },
      { item: "Tonkatsu sauce", qty: "for dipping", store: "zairyo" },
      { item: "Vegetable oil", qty: "for frying", store: "little-farms" }
    ],
    steps: [
      "Boil potatoes until soft (12 mins). Mash until smooth.",
      "Sauté onion and mince until cooked. Mix into mashed potato. Season lightly.",
      "Shape into small oval patties. Coat: flour → egg → panko.",
      "Shallow-fry until golden all over (3-4 mins total). Drain on paper towels. Serve with tonkatsu sauce."
    ],
    tips: "Make them small and oval - easy to grip. These freeze well before frying. Bake at 200°C as a lighter alternative."
  },
  {
    id: "adv-08",
    name: "Mushroom & Chicken Udon Stir-Fry",
    cuisine: "japanese",
    meal: "dinner",
    time: 20,
    tags: ["japanese", "noodle"],
    description: "Thick, chewy udon noodles stir-fried with chicken and mushrooms in a sweet soy glaze.",
    ingredients: [
      { item: "Udon noodles (fresh or frozen)", qty: "2 portions", store: "zairyo" },
      { item: "Chicken thigh (boneless)", qty: "150g, sliced thin", store: "little-farms" },
      { item: "Shiitake mushrooms", qty: "4-5, sliced", store: "zairyo" },
      { item: "Soy sauce", qty: "2 tbsp", store: "zairyo" },
      { item: "Mirin", qty: "1 tbsp", store: "zairyo" },
      { item: "Sesame oil", qty: "1 tsp", store: "zairyo" },
      { item: "Spring onion", qty: "1 stalk", store: "little-farms" }
    ],
    steps: [
      "Cook udon per packet. Drain and toss with a drop of sesame oil.",
      "Stir-fry chicken until golden. Add mushrooms, cook 2-3 mins.",
      "Add udon, soy sauce, and mirin. Toss over high heat for 2 mins.",
      "Garnish with spring onion. Serve immediately."
    ],
    tips: "Udon's thick, chewy texture is great for toddlers learning to use chopsticks (or forks). Cut noodles shorter for the 2yo."
  }
];

// ─── STORE METADATA ────────────────────────────────
const STORES = {
  "little-farms": {
    name: "Little Farms",
    tagline: "Premium groceries, dairy, meat & produce",
    cssClass: "little-farms"
  },
  "talula-farms": {
    name: "Talula Farms",
    tagline: "Organic produce & specialty items",
    cssClass: "talula-farms"
  },
  "zairyo": {
    name: "Zairyo",
    tagline: "Japanese & Asian specialty ingredients",
    cssClass: "zairyo"
  }
};

// Map certain ingredients to Talula Farms (organic produce focus)
const TALULA_OVERRIDES = [
  "Carrot", "Zucchini", "Baby spinach", "Bok choy", "Cabbage", "Leek",
  "Sweet potatoes", "Cucumber", "Tomatoes", "Spring onion", "Cauliflower",
  "Fresh basil", "Chives", "Fresh sage", "Pumpkin, peeled & diced",
  "Kabocha pumpkin"
];

// Ingredient category mapping for grocery list organization
const INGREDIENT_CATEGORIES = {
  "Proteins": ["Chicken thigh", "Chicken breast", "Chicken mince", "Beef mince", "Pork mince",
    "Beef or lamb mince", "Beef or pork mince", "Pork belly", "Salmon fillet", "Canned tuna",
    "Soft tofu", "Eggs", "Egg"],
  "Dairy": ["Fresh mozzarella", "Parmesan cheese", "Cheddar cheese", "Cream cheese", "Butter",
    "Cream", "Milk", "Milk or cream", "Sour cream or applesauce", "Japanese mayonnaise"],
  "Produce": ["Carrot", "Zucchini", "Onion", "Garlic", "Baby spinach", "Bok choy", "Leek",
    "Potatoes", "Sweet potatoes", "Tomatoes", "Cucumber", "Cabbage", "Cauliflower",
    "Spring onion", "Fresh basil", "Fresh sage", "Chives", "Pumpkin, peeled & diced",
    "Kabocha pumpkin", "Ginger"],
  "Pantry": ["Olive oil", "Vegetable oil", "Sugar", "Salt", "Plain flour", "Cornstarch",
    "Breadcrumbs", "Ketchup", "Tomato paste", "Peanut butter", "Tinned San Marzano tomatoes",
    "Tinned chopped tomatoes", "Creamed corn", "Boiling water"],
  "Grains & Noodles": ["Arborio rice", "Japanese short-grain rice", "Jasmine rice",
    "Cooked jasmine rice", "Cooked Japanese short-grain rice",
    "Penne or fusilli pasta", "Macaroni pasta", "Orzo pasta", "Stelline / small pasta",
    "Fresh potato gnocchi", "Flatbread / naan", "Bread",
    "Udon noodles", "Fresh egg noodles", "Thin egg noodles", "Thin egg noodles or somen",
    "Yakisoba noodles", "Wonton wrappers", "Dumpling wrappers", "Gyoza wrappers"],
  "Frozen": ["Frozen edamame", "Frozen peas", "Frozen peas and corn", "Sweet corn"],
  "Japanese/Asian": ["Soy sauce", "Soy sauce (light)", "Dark soy sauce", "Mirin",
    "Sesame oil", "Sesame seeds", "Rice vinegar", "Dashi stock powder",
    "White miso paste", "Nori sheets", "Nori strips", "Dried wakame",
    "Panko breadcrumbs", "Tonkatsu sauce", "Okonomiyaki sauce", "Yakisoba sauce",
    "Bonito flakes", "Japanese curry roux", "Coconut milk",
    "Japanese mayonnaise"]
};

function getIngredientCategory(itemName) {
  for (const [category, items] of Object.entries(INGREDIENT_CATEGORIES)) {
    for (const item of items) {
      if (itemName.toLowerCase().includes(item.toLowerCase()) ||
          item.toLowerCase().includes(itemName.toLowerCase())) {
        return category;
      }
    }
  }
  return "Other";
}

function getStoreForIngredient(ingredient) {
  // Check if produce item should go to Talula Farms
  for (const talulaItem of TALULA_OVERRIDES) {
    if (ingredient.item.toLowerCase().includes(talulaItem.toLowerCase()) ||
        talulaItem.toLowerCase().includes(ingredient.item.toLowerCase())) {
      return "talula-farms";
    }
  }
  return ingredient.store;
}
