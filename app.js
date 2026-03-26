// ============================================
// Little Chefs Weekly - Application Logic
// ============================================

(function () {
  "use strict";

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let currentWeek = 0;
  let weekPlans = [];
  let usedIdsGlobal = new Set();

  // ─── PREFERENCES HELPERS ───────────────────────────
  // Get the current user preferences (from preferences.js module)
  function getPrefs() {
    if (window.LittleChefsPrefs && window.LittleChefsPrefs.getPreferences) {
      return window.LittleChefsPrefs.getPreferences();
    }
    // Fallback defaults if preferences module not loaded
    return {
      maxCookTime: 30,
      cuisines: {
        american: true, chinese: true, french: true, indian: true,
        italian: true, japanese: true, korean: true, mexican: true,
        thai: true, comfort: true, adventure: false, brazilian: false,
        ethiopian: false, greek: false, lebanese: false, moroccan: false,
        peruvian: false, spanish: false, turkish: false, vietnamese: false,
        vegetarian: false, vegan: false
      },
      adventureLevel: 1,
      excludedIngredients: []
    };
  }

  function isRecipeAllowed(recipe) {
    const prefs = getPrefs();

    // Filter by cook time
    if (recipe.time > prefs.maxCookTime) return false;

    // Filter by enabled cuisines
    if (!prefs.cuisines[recipe.cuisine]) return false;

    // Filter by excluded ingredients
    if (prefs.excludedIngredients.length > 0) {
      const hasExcluded = recipe.ingredients.some(ing =>
        prefs.excludedIngredients.some(excl =>
          ing.item.toLowerCase().includes(excl.toLowerCase())
        )
      );
      if (hasExcluded) return false;
    }

    return true;
  }

  // ─── ROTATION ENGINE ──────────────────────────────
  // Generates non-repeating weekly plans with palate expansion

  function generateAllWeeks() {
    usedIdsGlobal = new Set();
    weekPlans = [];
    // Pre-generate the first 4 weeks; additional weeks are generated on demand
    for (let w = 0; w < 4; w++) {
      const plan = generateWeekPlan(usedIdsGlobal, w);
      weekPlans.push(plan);
    }
  }

  function ensureWeekExists(weekIndex) {
    while (weekPlans.length <= weekIndex) {
      const plan = generateWeekPlan(usedIdsGlobal, weekPlans.length);
      weekPlans.push(plan);
    }
  }

  // ─── INGREDIENT OVERLAP HELPERS ──────────────────
  // Extract normalised ingredient names from a recipe for overlap scoring
  function getIngredientKeys(recipe) {
    return recipe.ingredients.map(i => i.item.toLowerCase().replace(/\s*\(.*?\)\s*/g, "").trim());
  }

  // Score how many ingredients a candidate recipe shares with the already-selected set
  function ingredientOverlapScore(candidate, selectedRecipes) {
    if (selectedRecipes.length === 0) return 0;
    const candidateKeys = getIngredientKeys(candidate);
    const poolKeys = new Set();
    selectedRecipes.forEach(r => getIngredientKeys(r).forEach(k => poolKeys.add(k)));
    return candidateKeys.filter(k => poolKeys.has(k)).length;
  }

  function generateWeekPlan(usedIds, weekIndex) {
    const available = RECIPES.filter(r => !usedIds.has(r.id) && isRecipeAllowed(r));

    // If we've used all allowed recipes, reset pool
    if (available.length < 14) {
      usedIds.clear();
      const retryAvailable = RECIPES.filter(r => isRecipeAllowed(r));
      // If still not enough recipes after clearing, relax time filter
      if (retryAvailable.length < 14) {
        return generateWeekPlanFallback(weekIndex);
      }
      return generateWeekPlan(usedIds, weekIndex);
    }

    const weekPlan = [];

    // Calculate palate expansion: combines user preference with week progression
    const prefs = getPrefs();
    const adventureBoost = Math.min(weekIndex * 0.5, 2) * (prefs.adventureLevel / 2);

    // Separate recipes by meal suitability
    const lunchRecipes = available.filter(r => r.meal === "lunch" || r.meal === "both");
    const dinnerRecipes = available.filter(r => r.meal === "dinner" || r.meal === "both");

    const selected = [];
    const selectedIds = new Set();

    for (let d = 0; d < 7; d++) {
      // Determine target cuisine distribution
      const targetCuisines = getCuisineTargetForDay(d, weekIndex);

      // Select lunch (with ingredient overlap scoring)
      const lunch = selectRecipe(lunchRecipes, selectedIds, targetCuisines[0], adventureBoost, selected);
      if (lunch) {
        selected.push(lunch);
        selectedIds.add(lunch.id);
      }

      // Select dinner (with ingredient overlap scoring)
      const dinner = selectRecipe(dinnerRecipes, selectedIds, targetCuisines[1], adventureBoost, selected);
      if (dinner) {
        selected.push(dinner);
        selectedIds.add(dinner.id);
      }

      weekPlan.push({
        day: DAYS[d],
        lunch: lunch || lunchRecipes[0],
        dinner: dinner || dinnerRecipes[0]
      });
    }

    // Mark all selected recipes as used
    selected.forEach(r => usedIds.add(r.id));

    return weekPlan;
  }

  function getCuisineTargetForDay(dayIndex, weekIndex) {
    // Build dynamic cuisine list from enabled preferences
    const prefs = getPrefs();
    const enabledCuisines = Object.entries(prefs.cuisines)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (enabledCuisines.length === 0) return ["comfort", "comfort"];

    // Use a deterministic shuffle based on weekIndex so each week gets
    // a unique rotation, avoiding repeated weekly patterns
    const shuffled = [...enabledCuisines];
    let seed = (weekIndex + 1) * 2654435761; // Knuth multiplicative hash
    for (let i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      const j = (seed >>> 0) % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Assign lunch and dinner cuisines from the shuffled list
    const lunchIdx = (dayIndex * 2) % shuffled.length;
    const dinnerIdx = (dayIndex * 2 + 1) % shuffled.length;
    return [shuffled[lunchIdx], shuffled[dinnerIdx]];
  }

  function selectRecipe(pool, excludeIds, preferredCuisine, adventureBoost, selectedSoFar) {
    const available = pool.filter(r => !excludeIds.has(r.id));
    if (available.length === 0) return null;

    // Score recipes
    const scored = available.map(r => {
      let score = Math.random() * 5; // base randomness (reduced to let overlap dominate)

      // Cuisine match bonus
      if (r.cuisine === preferredCuisine) score += 12;

      // Adventure bonus for palate expansion (increases over weeks)
      if (r.tags.includes("new") || r.tags.includes("adventure")) {
        score += adventureBoost * 3;
      }

      // Variety in food types (soups, noodles, rice, potato)
      if (r.tags.includes("soup")) score += 2;
      if (r.tags.includes("noodle")) score += 2;
      if (r.tags.includes("rice")) score += 2;
      if (r.tags.includes("potato")) score += 2;

      // INGREDIENT OVERLAP BONUS — strongly prefer recipes sharing ingredients
      // with those already selected for this week (reduces waste, maximises freshness)
      const overlap = ingredientOverlapScore(r, selectedSoFar || []);
      score += overlap * 4; // each shared ingredient adds significant weight

      return { recipe: r, score };
    });

    scored.sort((a, b) => b.score - a.score);
    // Pick from top 3 for some controlled randomness
    const topN = Math.min(3, scored.length);
    const pick = Math.floor(Math.random() * topN);
    return scored[pick].recipe;
  }

  // ─── GROCERY LIST GENERATOR ───────────────────────

  function getCustomStores() {
    const prefs = getPrefs();
    if (prefs.customStores && prefs.customStores.length > 0) {
      return prefs.customStores;
    }
    // Fallback: single catch-all store when user hasn't added any
    return [
      { id: "all", name: "Grocery List", tagline: "All ingredients", url: "", colorIndex: 0, categories: ALL_CATEGORIES.slice() }
    ];
  }

  // Get ALL_CATEGORIES from preferences module or use defaults
  const ALL_CATEGORIES = (window.LittleChefsPrefs && window.LittleChefsPrefs.getAllCategories)
    ? window.LittleChefsPrefs.getAllCategories()
    : ["Proteins", "Dairy", "Produce", "Pantry", "Grains & Noodles", "Frozen", "Asian & World Specialty", "Other"];

  // Build a map from ingredient category -> store id based on user's custom stores
  function buildCategoryToStoreMap(stores) {
    const map = {};
    stores.forEach(store => {
      (store.categories || []).forEach(cat => {
        map[cat] = store.id;
      });
    });
    return map;
  }

  function generateGroceryList(weekPlan) {
    const stores = getCustomStores();
    const categoryToStore = buildCategoryToStoreMap(stores);
    const fallbackStoreId = stores.length > 0 ? stores[0].id : "default";

    // Initialize store groups
    const storeGroups = {};
    stores.forEach(s => { storeGroups[s.id] = {}; });

    weekPlan.forEach(day => {
      [day.lunch, day.dinner].forEach(recipe => {
        if (!recipe) return;
        recipe.ingredients.forEach(ing => {
          const category = getIngredientCategory(ing.item);
          // Route ingredient to user's store based on category mapping
          const storeId = categoryToStore[category] || fallbackStoreId;

          if (!storeGroups[storeId]) storeGroups[storeId] = {};
          if (!storeGroups[storeId][category]) storeGroups[storeId][category] = {};

          // Aggregate quantities
          if (storeGroups[storeId][category][ing.item]) {
            storeGroups[storeId][category][ing.item].recipes.push(recipe.name);
          } else {
            storeGroups[storeId][category][ing.item] = {
              qty: ing.qty,
              recipes: [recipe.name]
            };
          }
        });
      });
    });

    return storeGroups;
  }

  // ─── UI RENDERING ─────────────────────────────────

  function renderWeekLabel() {
    document.getElementById("week-label").textContent = `Week ${currentWeek + 1}`;
    const startDate = getWeekStartDate(currentWeek);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    document.getElementById("week-date-range").textContent =
      `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  function getWeekStartDate(weekIndex) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setDate(monday.getDate() + weekIndex * 7);
    return monday;
  }

  function formatDate(date) {
    return date.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
  }

  function renderMealPlan() {
    ensureWeekExists(currentWeek);
    const grid = document.getElementById("meal-plan-grid");
    const plan = weekPlans[currentWeek];

    grid.innerHTML = plan.map(day => `
      <div class="day-card">
        <div class="day-header">${day.day}</div>
        <div class="meal-slot" data-recipe-id="${day.lunch.id}">
          <div class="meal-type">Lunch</div>
          <div class="meal-name">${day.lunch.name}</div>
          <div class="meal-tags">
            ${day.lunch.tags.map(t => `<span class="tag tag-${t}">${t}</span>`).join("")}
          </div>
          <div class="meal-time">${day.lunch.time} mins</div>
        </div>
        <div class="meal-slot" data-recipe-id="${day.dinner.id}">
          <div class="meal-type">Dinner</div>
          <div class="meal-name">${day.dinner.name}</div>
          <div class="meal-tags">
            ${day.dinner.tags.map(t => `<span class="tag tag-${t}">${t}</span>`).join("")}
          </div>
          <div class="meal-time">${day.dinner.time} mins</div>
        </div>
      </div>
    `).join("");

    // Show ingredient overlap stats
    const allIngredients = [];
    const uniqueIngredients = new Set();
    plan.forEach(day => {
      [day.lunch, day.dinner].forEach(recipe => {
        recipe.ingredients.forEach(ing => {
          const key = ing.item.toLowerCase().replace(/\s*\(.*?\)\s*/g, "").trim();
          allIngredients.push(key);
          uniqueIngredients.add(key);
        });
      });
    });
    const reusedCount = allIngredients.length - uniqueIngredients.size;
    const overlapPct = Math.round((reusedCount / allIngredients.length) * 100);

    // Insert or update the freshness banner
    let banner = document.getElementById("freshness-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "freshness-banner";
      grid.parentNode.insertBefore(banner, grid);
    }
    banner.className = "freshness-banner";
    banner.innerHTML = `<span class="freshness-icon">&#127807;</span> <strong>${overlapPct}% ingredient overlap</strong> this week &mdash; ${uniqueIngredients.size} unique items across 14 meals means less waste &amp; fresher food!`;

    // Attach click handlers
    grid.querySelectorAll(".meal-slot").forEach(slot => {
      slot.addEventListener("click", () => {
        const id = slot.getAttribute("data-recipe-id");
        showRecipeDetail(id);
      });
    });
  }

  function getStoreColor(store) {
    const STORE_COLORS = window.LittleChefsPrefs && window.LittleChefsPrefs.getStoreColors
      ? window.LittleChefsPrefs.getStoreColors()
      : [
          { bg: ["#2d6a4f", "#52b788"], rgb: [45, 106, 79] },
          { bg: ["#7f4f24", "#c68b59"], rgb: [127, 79, 36] },
          { bg: ["#9b2226", "#e63946"], rgb: [155, 34, 38] }
        ];
    return STORE_COLORS[store.colorIndex % STORE_COLORS.length];
  }

  function renderGroceryList() {
    const container = document.getElementById("grocery-stores");
    const plan = weekPlans[currentWeek];
    const groceryData = generateGroceryList(plan);
    const stores = getCustomStores();

    container.innerHTML = stores.map(store => {
      const categories = groceryData[store.id] || {};
      const categoryEntries = Object.entries(categories).filter(([, items]) => Object.keys(items).length > 0);

      if (categoryEntries.length === 0) return "";

      const color = getStoreColor(store);
      const gradient = `linear-gradient(135deg, ${color.bg[0]}, ${color.bg[1]})`;

      const nameHtml = store.url
        ? `<a href="${store.url}" target="_blank" rel="noopener" class="store-link">${store.name}</a>`
        : `<span>${store.name}</span>`;

      return `
        <div class="store-card">
          <div class="store-header" style="background: ${gradient}">
            ${nameHtml}
            <span class="store-tagline">${store.tagline || ""}</span>
          </div>
          ${categoryEntries.map(([category, items]) => `
            <div class="grocery-category">
              <h4>${category}</h4>
              ${Object.entries(items).map(([itemName, info]) => `
                <div class="grocery-item">
                  <span class="grocery-item-name">${itemName}</span>
                  <span class="grocery-item-qty">${info.qty}${info.recipes.length > 1 ? ` (x${info.recipes.length})` : ""}</span>
                </div>
              `).join("")}
            </div>
          `).join("")}
        </div>
      `;
    }).join("");
  }

  function showRecipeDetail(recipeId) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    const modal = document.getElementById("recipe-modal");
    const detail = document.getElementById("recipe-detail");

    detail.innerHTML = `
      <h2 class="recipe-title">${recipe.name}</h2>
      <div class="recipe-meta">
        <span>${recipe.time} minutes</span>
        <span>${recipe.cuisine.charAt(0).toUpperCase() + recipe.cuisine.slice(1)}</span>
        <span>${recipe.meal === "both" ? "Lunch or Dinner" : recipe.meal.charAt(0).toUpperCase() + recipe.meal.slice(1)}</span>
      </div>
      <p style="margin-bottom: 1rem; color: var(--clr-text-light); font-size: 0.9rem;">${recipe.description}</p>

      <div class="recipe-section">
        <h3>Ingredients</h3>
        <ul>
          ${recipe.ingredients.map(i => `
            <li>${i.item} - ${i.qty} <span style="font-size:0.75rem; color:var(--clr-text-light)">(${STORES[getStoreForIngredient(i)].name})</span></li>
          `).join("")}
        </ul>
      </div>

      <div class="recipe-section">
        <h3>Steps</h3>
        <ol>
          ${recipe.steps.map(s => `<li>${s}</li>`).join("")}
        </ol>
      </div>

      <div class="recipe-tips">
        <strong>Toddler Tips:</strong> ${recipe.tips}
      </div>

      ${recipe.video ? `
      <div class="recipe-video-section">
        <button class="btn btn-small btn-video-toggle" id="btn-toggle-video">Watch Video</button>
        <div class="recipe-video-container hidden" id="recipe-video-container">
          <iframe src="${recipe.video}" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
        </div>
      </div>
      ` : `
      <div class="recipe-video-section">
        <span class="recipe-video-placeholder">No video available yet</span>
      </div>
      `}
    `;

    // Attach video toggle handler
    const videoToggleBtn = detail.querySelector("#btn-toggle-video");
    if (videoToggleBtn) {
      videoToggleBtn.addEventListener("click", () => {
        const container = detail.querySelector("#recipe-video-container");
        container.classList.toggle("hidden");
        videoToggleBtn.textContent = container.classList.contains("hidden") ? "Watch Video" : "Hide Video";
      });
    }

    modal.classList.remove("hidden");
  }

  // ─── PDF GENERATION ───────────────────────────────

  function generateMealPlanPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const plan = weekPlans[currentWeek];

    // Title
    doc.setFontSize(20);
    doc.setTextColor(61, 64, 91);
    doc.text("Little Chefs Weekly", 105, 20, { align: "center" });
    doc.setFontSize(11);
    doc.setTextColor(107, 107, 107);
    doc.text(`Week ${currentWeek + 1} Meal Plan`, 105, 28, { align: "center" });

    const startDate = getWeekStartDate(currentWeek);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    doc.text(`${formatDate(startDate)} - ${formatDate(endDate)}`, 105, 34, { align: "center" });

    // Meal plan table
    const tableData = plan.map(day => [
      day.day,
      `${day.lunch.name}\n(${day.lunch.cuisine}, ${day.lunch.time} mins)`,
      `${day.dinner.name}\n(${day.dinner.cuisine}, ${day.dinner.time} mins)`
    ]);

    doc.autoTable({
      head: [["Day", "Lunch", "Dinner"]],
      body: tableData,
      startY: 42,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [61, 64, 91] },
      columnStyles: {
        0: { cellWidth: 30, fontStyle: "bold" },
        1: { cellWidth: 75 },
        2: { cellWidth: 75 }
      }
    });

    // Add recipes detail pages
    plan.forEach((day, i) => {
      [day.lunch, day.dinner].forEach((recipe, mealIdx) => {
        doc.addPage();
        const mealType = mealIdx === 0 ? "Lunch" : "Dinner";

        doc.setFontSize(14);
        doc.setTextColor(224, 122, 95);
        doc.text(`${day.day} - ${mealType}`, 14, 20);

        doc.setFontSize(16);
        doc.setTextColor(61, 64, 91);
        doc.text(recipe.name, 14, 30);

        doc.setFontSize(9);
        doc.setTextColor(107, 107, 107);
        doc.text(`${recipe.cuisine} | ${recipe.time} mins | ${recipe.description}`, 14, 37, { maxWidth: 180 });

        // Ingredients
        let y = 48;
        doc.setFontSize(11);
        doc.setTextColor(224, 122, 95);
        doc.text("Ingredients", 14, y);
        y += 6;

        doc.setFontSize(9);
        doc.setTextColor(45, 45, 45);
        recipe.ingredients.forEach(ing => {
          const store = STORES[getStoreForIngredient(ing)].name;
          doc.text(`\u2022  ${ing.item} - ${ing.qty} (${store})`, 16, y);
          y += 5;
        });

        // Steps
        y += 4;
        doc.setFontSize(11);
        doc.setTextColor(224, 122, 95);
        doc.text("Steps", 14, y);
        y += 6;

        doc.setFontSize(9);
        doc.setTextColor(45, 45, 45);
        recipe.steps.forEach((step, idx) => {
          const lines = doc.splitTextToSize(`${idx + 1}. ${step}`, 170);
          lines.forEach(line => {
            if (y > 275) { doc.addPage(); y = 20; }
            doc.text(line, 16, y);
            y += 5;
          });
          y += 2;
        });

        // Tips
        y += 4;
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFillColor(253, 245, 230);
        const tipLines = doc.splitTextToSize(`Toddler Tips: ${recipe.tips}`, 166);
        doc.rect(14, y - 4, 180, tipLines.length * 5 + 8, "F");
        doc.setFontSize(9);
        doc.setTextColor(107, 107, 107);
        tipLines.forEach(line => {
          doc.text(line, 18, y + 2);
          y += 5;
        });
      });
    });

    doc.save(`Little_Chefs_Week_${currentWeek + 1}_Recipes.pdf`);
  }

  function generateGroceryPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const plan = weekPlans[currentWeek];
    const groceryData = generateGroceryList(plan);

    doc.setFontSize(20);
    doc.setTextColor(61, 64, 91);
    doc.text("Little Chefs Weekly", 105, 20, { align: "center" });
    doc.setFontSize(11);
    doc.setTextColor(107, 107, 107);
    doc.text(`Week ${currentWeek + 1} - Grocery Lists`, 105, 28, { align: "center" });

    let isFirst = true;
    const stores = getCustomStores();

    stores.forEach(store => {
      const categories = groceryData[store.id] || {};
      const categoryEntries = Object.entries(categories).filter(([, items]) => Object.keys(items).length > 0);
      if (categoryEntries.length === 0) return;

      if (!isFirst) doc.addPage();
      isFirst = false;

      // Store header
      const color = getStoreColor(store);
      const c = color.rgb;

      doc.setFillColor(c[0], c[1], c[2]);
      doc.rect(0, 38, 210, 12, "F");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(store.name, 14, 46);
      doc.setFontSize(8);
      doc.text(store.tagline || "", 196, 46, { align: "right" });

      // Store URL below header
      let y = 54;
      if (store.url) {
        doc.setFontSize(7);
        doc.setTextColor(c[0], c[1], c[2]);
        doc.textWithLink(store.url, 14, y, { url: store.url });
        y = 60;
      } else {
        y = 58;
      }

      categoryEntries.forEach(([category, items]) => {
        if (y > 265) { doc.addPage(); y = 20; }

        doc.setFontSize(10);
        doc.setTextColor(c[0], c[1], c[2]);
        doc.text(category.toUpperCase(), 14, y);
        y += 2;
        doc.setDrawColor(200, 200, 200);
        doc.line(14, y, 196, y);
        y += 5;

        doc.setFontSize(9);
        doc.setTextColor(45, 45, 45);

        Object.entries(items).forEach(([itemName, info]) => {
          if (y > 275) { doc.addPage(); y = 20; }
          const qtyText = info.recipes.length > 1 ? `${info.qty} (x${info.recipes.length})` : info.qty;
          doc.text(`\u2610  ${itemName}`, 16, y);
          doc.setTextColor(130, 130, 130);
          doc.text(qtyText, 196, y, { align: "right" });
          doc.setTextColor(45, 45, 45);
          y += 6;
        });

        y += 4;
      });
    });

    doc.save(`Little_Chefs_Week_${currentWeek + 1}_Grocery.pdf`);
  }

  // ─── SHARE FUNCTIONALITY ──────────────────────────

  function shareWeek() {
    // Encode current week and seed in URL for sharing
    const url = new URL(window.location.href);
    url.searchParams.set("week", currentWeek);
    url.searchParams.set("seed", weekSeed);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url.toString()).then(() => showToast("Link copied to clipboard!"));
    } else {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = url.toString();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showToast("Link copied to clipboard!");
    }
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3000);
  }

  // ─── SEEDED RANDOM FOR REPRODUCIBLE PLANS ─────────

  let weekSeed = Date.now();

  function seededRandom(seed) {
    let s = seed;
    return function () {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };
  }

  // ─── FALLBACK PLAN (when not enough recipes match filters) ─────

  function generateWeekPlanFallback(weekIndex) {
    // Use all recipes of enabled cuisines, ignoring time filter
    const prefs = getPrefs();
    const available = RECIPES.filter(r => prefs.cuisines[r.cuisine]);
    const weekPlan = [];
    for (let d = 0; d < 7; d++) {
      const lunch = available[(d * 2) % available.length];
      const dinner = available[(d * 2 + 1) % available.length];
      weekPlan.push({ day: DAYS[d], lunch, dinner });
    }
    return weekPlan;
  }

  // ─── PUBLIC API (for auth and preferences modules) ─

  window.LittleChefs = {
    showToast: null, // set in init
    regenerateWithPreferences: null, // set in init
    loadPreferencesFromCloud: null,
    resetPreferences: null
  };

  // ─── INITIALIZATION ───────────────────────────────

  function init() {
    // Expose public API
    window.LittleChefs.showToast = showToast;
    window.LittleChefs.regenerateWithPreferences = function () {
      weekSeed = Date.now();
      generateAllWeeks();
      renderMealPlan();
      renderGroceryList();
    };
    window.LittleChefs.loadPreferencesFromCloud = async function () {
      if (window.LittleChefsPrefs && window.LittleChefsPrefs.loadFromCloud) {
        await window.LittleChefsPrefs.loadFromCloud();
      }
    };
    window.LittleChefs.resetPreferences = function () {
      if (window.LittleChefsPrefs && window.LittleChefsPrefs.resetPreferences) {
        window.LittleChefsPrefs.resetPreferences();
      }
      window.LittleChefs.regenerateWithPreferences();
    };

    // Initialize preferences (loads from URL or localStorage)
    if (window.LittleChefsPrefs) {
      window.LittleChefsPrefs.initPreferencesUI();
    }

    // Initialize Supabase auth
    if (window.LittleChefsAuth) {
      const supabaseReady = window.LittleChefsAuth.initSupabase();
      window.LittleChefsAuth.initAuthUI();
      if (supabaseReady) {
        // Check for existing session and load cloud preferences
        window.LittleChefsAuth.checkSession().then(user => {
          if (user && window.LittleChefsPrefs) {
            window.LittleChefsPrefs.loadFromCloud();
          }
        });
      }
    }

    // Check URL params for shared state
    const params = new URLSearchParams(window.location.search);
    if (params.has("week")) {
      currentWeek = parseInt(params.get("week"), 10) || 0;
    }
    if (params.has("seed")) {
      weekSeed = parseInt(params.get("seed"), 10) || Date.now();
    }

    // First visit: show preferences before generating recipes
    const hasVisited = localStorage.getItem("littlechefs_has_visited");
    if (!hasVisited && !params.has("maxTime") && !params.has("cuisines")) {
      // Show preferences modal first; recipes generate after save
      if (window.LittleChefsPrefs && window.LittleChefsPrefs.showFirstVisit) {
        window.LittleChefsPrefs.showFirstVisit();
      }
    } else {
      generateAllWeeks();
      renderWeekLabel();
      renderMealPlan();
      renderGroceryList();
    }

    // Event listeners
    document.getElementById("btn-prev-week").addEventListener("click", () => {
      if (currentWeek > 0) {
        currentWeek--;
        renderWeekLabel();
        renderMealPlan();
        renderGroceryList();
      }
    });

    document.getElementById("btn-next-week").addEventListener("click", () => {
      currentWeek++;
      ensureWeekExists(currentWeek);
      renderWeekLabel();
      renderMealPlan();
      renderGroceryList();
    });

    document.getElementById("btn-regenerate").addEventListener("click", () => {
      weekSeed = Date.now();
      generateAllWeeks();
      renderMealPlan();
      renderGroceryList();
      showToast("Menu regenerated with new recipes!");
    });

    document.getElementById("btn-download-pdf").addEventListener("click", generateMealPlanPDF);
    document.getElementById("btn-download-grocery-pdf").addEventListener("click", generateGroceryPDF);
    document.getElementById("btn-share").addEventListener("click", shareWeek);

    // Tabs
    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
      });
    });

    // Modal
    const modal = document.getElementById("recipe-modal");
    modal.querySelector(".modal-backdrop").addEventListener("click", () => modal.classList.add("hidden"));
    modal.querySelector(".modal-close").addEventListener("click", () => modal.classList.add("hidden"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") modal.classList.add("hidden");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
