// ============================================
// Little Chefs Weekly - Preferences Module
// Manages user preferences with local + cloud storage
// ============================================

(function () {
  "use strict";

  // ─── CUISINE MASTER LIST (A-Z) ──────────────────────
  // Single source of truth for all cuisines in the app

  const CUISINE_OPTIONS = [
    { key: "american",   label: "American",     defaultOn: true },
    { key: "brazilian",  label: "Brazilian",     defaultOn: false },
    { key: "chinese",    label: "Chinese",       defaultOn: true },
    { key: "ethiopian",  label: "Ethiopian",     defaultOn: false },
    { key: "french",     label: "French",        defaultOn: true },
    { key: "greek",      label: "Greek",         defaultOn: false },
    { key: "indian",     label: "Indian",        defaultOn: true },
    { key: "italian",    label: "Italian",       defaultOn: true },
    { key: "japanese",   label: "Japanese",      defaultOn: true },
    { key: "korean",     label: "Korean",        defaultOn: true },
    { key: "lebanese",   label: "Lebanese",      defaultOn: false },
    { key: "mexican",    label: "Mexican",       defaultOn: true },
    { key: "moroccan",   label: "Moroccan",      defaultOn: false },
    { key: "peruvian",   label: "Peruvian",      defaultOn: false },
    { key: "spanish",    label: "Spanish",       defaultOn: false },
    { key: "thai",       label: "Thai",          defaultOn: true },
    { key: "turkish",    label: "Turkish",       defaultOn: false },
    { key: "vietnamese", label: "Vietnamese",    defaultOn: false },
    { key: "vegetarian", label: "Vegetarian",    defaultOn: false },
    { key: "vegan",      label: "Vegan",         defaultOn: false },
    { key: "comfort",    label: "Comfort Food",  defaultOn: true },
    { key: "adventure",  label: "Adventure",     defaultOn: false }
  ];

  // Build default cuisines object from the master list
  function buildDefaultCuisines() {
    const obj = {};
    CUISINE_OPTIONS.forEach(c => { obj[c.key] = c.defaultOn; });
    return obj;
  }

  // ─── DEFAULT STORES ────────────────────────────────
  // Each store has a name, color, and a list of ingredient categories assigned to it.
  // The ingredient categories come from INGREDIENT_CATEGORIES in recipes.js:
  //   Proteins, Dairy, Produce, Pantry, Grains & Noodles, Frozen, Asian & World Specialty

  const ALL_CATEGORIES = [
    "Proteins", "Dairy", "Produce", "Pantry",
    "Grains & Noodles", "Frozen", "Asian & World Specialty", "Other"
  ];

  const STORE_COLORS = [
    { bg: ["#2d6a4f", "#52b788"], rgb: [45, 106, 79] },
    { bg: ["#7f4f24", "#c68b59"], rgb: [127, 79, 36] },
    { bg: ["#9b2226", "#e63946"], rgb: [155, 34, 38] },
    { bg: ["#1d3557", "#457b9d"], rgb: [29, 53, 87] },
    { bg: ["#6a4c93", "#b185db"], rgb: [106, 76, 147] },
    { bg: ["#e07a5f", "#f2cc8f"], rgb: [224, 122, 95] },
    { bg: ["#264653", "#2a9d8f"], rgb: [38, 70, 83] },
    { bg: ["#bc6c25", "#dda15e"], rgb: [188, 108, 37] }
  ];

  function buildDefaultStores() {
    return [];
  }

  // ─── DEFAULT PREFERENCES ───────────────────────────

  const DEFAULTS = {
    maxCookTime: 30,       // minutes
    cuisines: buildDefaultCuisines(),
    adventureLevel: 1,      // 1 = cautious, 2 = moderate, 3 = adventurous
    excludedIngredients: [], // e.g. ["peanut butter", "tofu"]
    childAges: "2-4",       // display label
    mealsPerDay: 2,          // lunch + dinner
    customStores: buildDefaultStores()
  };

  let preferences = JSON.parse(JSON.stringify(DEFAULTS));

  // ─── LOCAL STORAGE ─────────────────────────────────

  function loadFromLocal() {
    try {
      const saved = localStorage.getItem("littlechefs_preferences");
      if (saved) {
        const parsed = JSON.parse(saved);
        preferences = { ...JSON.parse(JSON.stringify(DEFAULTS)), ...parsed };
        // Ensure cuisines object has all keys
        for (const key of Object.keys(DEFAULTS.cuisines)) {
          if (preferences.cuisines[key] === undefined) {
            preferences.cuisines[key] = DEFAULTS.cuisines[key];
          }
        }
        // Ensure customStores exists
        if (!preferences.customStores || !Array.isArray(preferences.customStores)) {
          preferences.customStores = buildDefaultStores();
        }
      }
    } catch (e) {
      console.warn("Could not load preferences from localStorage:", e);
    }
  }

  function saveToLocal() {
    try {
      localStorage.setItem("littlechefs_preferences", JSON.stringify(preferences));
    } catch (e) {
      console.warn("Could not save preferences to localStorage:", e);
    }
  }

  // ─── CLOUD STORAGE (SUPABASE) ──────────────────────

  async function saveToCloud() {
    const auth = window.LittleChefsAuth;
    if (!auth) return;
    const supabase = auth.getSupabase();
    const user = auth.getCurrentUser();
    if (!supabase || !user) return;

    const { error } = await supabase
      .from("user_preferences")
      .upsert({
        user_id: user.id,
        preferences: preferences,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });

    if (error) {
      console.warn("Could not save preferences to cloud:", error.message);
    }
  }

  async function loadFromCloud() {
    const auth = window.LittleChefsAuth;
    if (!auth) return false;
    const supabase = auth.getSupabase();
    const user = auth.getCurrentUser();
    if (!supabase || !user) return false;

    const { data, error } = await supabase
      .from("user_preferences")
      .select("preferences")
      .eq("user_id", user.id)
      .single();

    if (error || !data) return false;

    preferences = { ...JSON.parse(JSON.stringify(DEFAULTS)), ...data.preferences };
    saveToLocal(); // sync cloud -> local
    updatePreferencesUI();
    // Regenerate meal plan with loaded preferences
    if (window.LittleChefs.regenerateWithPreferences) {
      window.LittleChefs.regenerateWithPreferences();
    }
    return true;
  }

  // ─── DYNAMIC CUISINE CHECKBOXES ─────────────────────

  function renderCuisineCheckboxes() {
    const container = document.getElementById("cuisine-checkboxes");
    if (!container) return;

    container.innerHTML = CUISINE_OPTIONS.map(c => {
      const checked = preferences.cuisines[c.key] ? "checked" : "";
      return `<label class="pref-checkbox">
        <input type="checkbox" id="pref-cuisine-${c.key}" ${checked}>
        <span class="pref-checkbox-label">${c.label}</span>
      </label>`;
    }).join("");
  }

  // ─── PREFERENCES UI ───────────────────────────────

  function showPreferencesModal() {
    const modal = document.getElementById("preferences-modal");
    if (modal) {
      updatePreferencesUI();
      modal.classList.remove("hidden");
    }
  }

  function hidePreferencesModal() {
    const modal = document.getElementById("preferences-modal");
    if (modal) modal.classList.add("hidden");
  }

  function updatePreferencesUI() {
    // Cook time slider
    const slider = document.getElementById("pref-max-time");
    const sliderLabel = document.getElementById("pref-max-time-label");
    if (slider) {
      slider.value = preferences.maxCookTime;
      if (sliderLabel) sliderLabel.textContent = `${preferences.maxCookTime} mins`;
    }

    // Render and update cuisine checkboxes
    renderCuisineCheckboxes();

    // Adventure level
    const adventureSlider = document.getElementById("pref-adventure");
    const adventureLabel = document.getElementById("pref-adventure-label");
    if (adventureSlider) {
      adventureSlider.value = preferences.adventureLevel;
      if (adventureLabel) {
        const labels = ["", "Cautious", "Moderate", "Adventurous"];
        adventureLabel.textContent = labels[preferences.adventureLevel] || "Cautious";
      }
    }

    // Excluded ingredients
    renderExcludedIngredients();

    // Custom stores
    renderCustomStores();
  }

  function renderExcludedIngredients() {
    const container = document.getElementById("excluded-ingredients-list");
    if (!container) return;

    if (preferences.excludedIngredients.length === 0) {
      container.innerHTML = '<span class="no-exclusions">None — all ingredients included</span>';
      return;
    }

    container.innerHTML = preferences.excludedIngredients.map(ing =>
      `<span class="excluded-tag">${ing} <button class="remove-excluded" data-ingredient="${ing}">&times;</button></span>`
    ).join("");

    // Attach remove handlers
    container.querySelectorAll(".remove-excluded").forEach(btn => {
      btn.addEventListener("click", () => {
        const ing = btn.dataset.ingredient;
        preferences.excludedIngredients = preferences.excludedIngredients.filter(i => i !== ing);
        renderExcludedIngredients();
      });
    });
  }

  function addExcludedIngredient(name) {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return;
    if (preferences.excludedIngredients.includes(trimmed)) return;
    preferences.excludedIngredients.push(trimmed);
    renderExcludedIngredients();
  }

  // ─── CUISINE AUTOCOMPLETE ──────────────────────────

  function renderSuggestions(suggestionsEl, list, searchInput) {
    suggestionsEl.innerHTML = list.map(c => {
      const cb = document.getElementById(`pref-cuisine-${c.key}`);
      const isChecked = cb ? cb.checked : !!preferences.cuisines[c.key];
      return `<div class="cuisine-suggestion" data-key="${c.key}">
        <span>${c.label}</span>
        <span class="cuisine-suggestion-status">${isChecked ? "&#10003; included" : "not included"}</span>
      </div>`;
    }).join("");

    suggestionsEl.classList.remove("hidden");

    suggestionsEl.querySelectorAll(".cuisine-suggestion").forEach(el => {
      el.addEventListener("click", () => {
        const key = el.dataset.key;
        const cb = document.getElementById(`pref-cuisine-${key}`);
        if (cb) {
          cb.checked = !cb.checked;
          const label = cb.closest(".pref-checkbox");
          if (label) {
            label.classList.add("cuisine-highlight");
            setTimeout(() => label.classList.remove("cuisine-highlight"), 800);
          }
        }
        searchInput.value = "";
        suggestionsEl.classList.add("hidden");
      });
    });
  }

  function initCuisineAutocomplete() {
    const searchInput = document.getElementById("cuisine-search");
    const suggestionsEl = document.getElementById("cuisine-suggestions");
    if (!searchInput || !suggestionsEl) return;

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        suggestionsEl.classList.add("hidden");
        return;
      }

      const matches = CUISINE_OPTIONS.filter(c =>
        c.label.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        suggestionsEl.innerHTML = '<div class="cuisine-suggestion-empty">No matching cuisines</div>';
        suggestionsEl.classList.remove("hidden");
        return;
      }

      renderSuggestions(suggestionsEl, matches, searchInput);
    });

    // Close suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".cuisine-autocomplete-wrapper")) {
        suggestionsEl.classList.add("hidden");
      }
    });

    // Show all options on focus when input is empty
    searchInput.addEventListener("focus", () => {
      if (!searchInput.value.trim()) {
        renderSuggestions(suggestionsEl, CUISINE_OPTIONS, searchInput);
      }
    });
  }

  // ─── CUSTOM STORES UI ──────────────────────────────

  function generateStoreId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function getAssignedCategories() {
    const assigned = new Set();
    (preferences.customStores || []).forEach(s => {
      (s.categories || []).forEach(c => assigned.add(c));
    });
    return assigned;
  }

  function getUnassignedCategories() {
    const assigned = getAssignedCategories();
    return ALL_CATEGORIES.filter(c => !assigned.has(c));
  }

  function renderCustomStores() {
    const container = document.getElementById("custom-stores-list");
    if (!container) return;

    const stores = preferences.customStores || [];

    if (stores.length === 0) {
      container.innerHTML = '<p class="pref-hint">No stores added yet. Add your first store below.</p>';
      return;
    }

    container.innerHTML = stores.map((store, idx) => {
      const color = STORE_COLORS[store.colorIndex % STORE_COLORS.length];
      const gradient = `linear-gradient(135deg, ${color.bg[0]}, ${color.bg[1]})`;
      const assignedCats = store.categories || [];
      const unassigned = ALL_CATEGORIES.filter(c => !assignedCats.includes(c) && !stores.some((s, i) => i !== idx && s.categories.includes(c)));

      return `
        <div class="custom-store-card" data-store-idx="${idx}">
          <div class="custom-store-header" style="background: ${gradient}">
            <div class="custom-store-info">
              <span class="custom-store-name">${store.name}</span>
              <span class="custom-store-tagline">${store.tagline || ""}</span>
            </div>
            <button class="custom-store-remove" data-idx="${idx}" title="Remove store">&times;</button>
          </div>
          <div class="custom-store-body">
            <div class="custom-store-categories">
              ${assignedCats.map(cat => `
                <span class="store-category-tag">
                  ${cat}
                  <button class="remove-category" data-idx="${idx}" data-cat="${cat}" title="Remove category">&times;</button>
                </span>
              `).join("")}
            </div>
            ${unassigned.length > 0 ? `
              <div class="custom-store-add-cat">
                <select class="select-add-category" data-idx="${idx}">
                  <option value="">+ Assign category...</option>
                  ${unassigned.map(c => `<option value="${c}">${c}</option>`).join("")}
                </select>
              </div>
            ` : ""}
            <div class="custom-store-field-row">
              <input type="text" class="input-store-tagline" data-idx="${idx}" placeholder="Short description (optional)" value="${store.tagline || ""}">
            </div>
            <div class="custom-store-field-row">
              <input type="url" class="input-store-url" data-idx="${idx}" placeholder="Store website URL (optional)" value="${store.url || ""}">
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Show unassigned categories warning
    const allUnassigned = getUnassignedCategories();
    if (allUnassigned.length > 0) {
      container.insertAdjacentHTML("beforeend", `
        <div class="unassigned-warning">
          <strong>Unassigned categories:</strong> ${allUnassigned.join(", ")}
          <br><small>These items will appear under the first store.</small>
        </div>
      `);
    }

    // Attach event handlers
    container.querySelectorAll(".custom-store-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        preferences.customStores.splice(idx, 1);
        renderCustomStores();
      });
    });

    container.querySelectorAll(".remove-category").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const cat = btn.dataset.cat;
        preferences.customStores[idx].categories = preferences.customStores[idx].categories.filter(c => c !== cat);
        renderCustomStores();
      });
    });

    container.querySelectorAll(".select-add-category").forEach(sel => {
      sel.addEventListener("change", () => {
        if (!sel.value) return;
        const idx = parseInt(sel.dataset.idx, 10);
        preferences.customStores[idx].categories.push(sel.value);
        renderCustomStores();
      });
    });

    container.querySelectorAll(".input-store-tagline").forEach(input => {
      input.addEventListener("input", () => {
        const idx = parseInt(input.dataset.idx, 10);
        preferences.customStores[idx].tagline = input.value;
      });
    });

    container.querySelectorAll(".input-store-url").forEach(input => {
      input.addEventListener("input", () => {
        const idx = parseInt(input.dataset.idx, 10);
        preferences.customStores[idx].url = input.value;
      });
    });
  }

  function addCustomStore(name) {
    const trimmed = name.trim();
    if (!trimmed) return;

    const stores = preferences.customStores || [];
    // Prevent duplicate names
    if (stores.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) return;

    const nextColorIndex = stores.length > 0
      ? (Math.max(...stores.map(s => s.colorIndex)) + 1) % STORE_COLORS.length
      : 0;

    stores.push({
      id: generateStoreId(trimmed),
      name: trimmed,
      tagline: "",
      url: "",
      colorIndex: nextColorIndex,
      categories: []
    });

    preferences.customStores = stores;
    renderCustomStores();
  }

  function resetStoresToDefaults() {
    preferences.customStores = buildDefaultStores();
    renderCustomStores();
  }

  // ─── SHAREABLE LINK ────────────────────────────────

  function generateShareableLink() {
    const url = new URL(window.location.href);
    // Clear existing params
    for (const key of [...url.searchParams.keys()]) {
      url.searchParams.delete(key);
    }
    // Encode preferences
    url.searchParams.set("maxTime", preferences.maxCookTime);
    url.searchParams.set("cuisines", Object.entries(preferences.cuisines)
      .filter(([, v]) => v).map(([k]) => k).join(","));
    url.searchParams.set("adventure", preferences.adventureLevel);
    if (preferences.excludedIngredients.length > 0) {
      url.searchParams.set("exclude", preferences.excludedIngredients.join(","));
    }
    return url.toString();
  }

  function loadFromURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.has("maxTime")) {
      preferences.maxCookTime = Math.min(60, Math.max(10, parseInt(params.get("maxTime"), 10) || 30));
    }
    if (params.has("cuisines")) {
      const enabledCuisines = params.get("cuisines").split(",").map(c => c.trim());
      for (const key of Object.keys(preferences.cuisines)) {
        preferences.cuisines[key] = enabledCuisines.includes(key);
      }
    }
    if (params.has("adventure")) {
      preferences.adventureLevel = Math.min(3, Math.max(1, parseInt(params.get("adventure"), 10) || 1));
    }
    if (params.has("exclude")) {
      preferences.excludedIngredients = params.get("exclude").split(",").map(i => i.trim().toLowerCase()).filter(Boolean);
    }
  }

  // ─── SAVE HANDLER ──────────────────────────────────

  async function savePreferences() {
    // Read UI values
    const slider = document.getElementById("pref-max-time");
    if (slider) preferences.maxCookTime = parseInt(slider.value, 10);

    for (const cuisine of Object.keys(preferences.cuisines)) {
      const cb = document.getElementById(`pref-cuisine-${cuisine}`);
      if (cb) preferences.cuisines[cuisine] = cb.checked;
    }

    const adventureSlider = document.getElementById("pref-adventure");
    if (adventureSlider) preferences.adventureLevel = parseInt(adventureSlider.value, 10);

    // Ensure at least one cuisine is selected
    const anyEnabled = Object.values(preferences.cuisines).some(v => v);
    if (!anyEnabled) {
      preferences.cuisines.comfort = true;
      const cb = document.getElementById("pref-cuisine-comfort");
      if (cb) cb.checked = true;
      window.LittleChefs.showToast("At least one cuisine must be selected.");
      return;
    }

    // Save locally
    saveToLocal();
    localStorage.setItem("littlechefs_has_visited", "1");

    // Save to cloud if logged in
    await saveToCloud();

    // Regenerate meal plans
    if (window.LittleChefs.regenerateWithPreferences) {
      window.LittleChefs.regenerateWithPreferences();
    }

    hidePreferencesModal();
    window.LittleChefs.showToast("Preferences saved! Meals updated.");
  }

  function showFirstVisit() {
    showPreferencesModal();
  }

  // ─── INIT ──────────────────────────────────────────

  function initPreferencesUI() {
    // Load from URL first (shared links override local)
    const params = new URLSearchParams(window.location.search);
    const hasURLPrefs = params.has("maxTime") || params.has("cuisines");

    if (hasURLPrefs) {
      loadFromURL();
    } else {
      loadFromLocal();
    }

    // Render dynamic cuisine checkboxes
    renderCuisineCheckboxes();

    // Preferences button
    const prefsBtn = document.getElementById("btn-preferences");
    if (prefsBtn) prefsBtn.addEventListener("click", showPreferencesModal);

    // Modal close
    const modal = document.getElementById("preferences-modal");
    if (modal) {
      modal.querySelector(".modal-backdrop")?.addEventListener("click", hidePreferencesModal);
      modal.querySelector(".modal-close")?.addEventListener("click", hidePreferencesModal);
    }

    // Cook time slider
    const slider = document.getElementById("pref-max-time");
    const sliderLabel = document.getElementById("pref-max-time-label");
    if (slider && sliderLabel) {
      slider.addEventListener("input", () => {
        sliderLabel.textContent = `${slider.value} mins`;
      });
    }

    // Adventure slider
    const adventureSlider = document.getElementById("pref-adventure");
    const adventureLabel = document.getElementById("pref-adventure-label");
    if (adventureSlider && adventureLabel) {
      adventureSlider.addEventListener("input", () => {
        const labels = ["", "Cautious", "Moderate", "Adventurous"];
        adventureLabel.textContent = labels[parseInt(adventureSlider.value, 10)] || "Cautious";
      });
    }

    // Add excluded ingredient
    const addExclBtn = document.getElementById("btn-add-excluded");
    const exclInput = document.getElementById("input-excluded");
    if (addExclBtn && exclInput) {
      addExclBtn.addEventListener("click", () => {
        addExcludedIngredient(exclInput.value);
        exclInput.value = "";
      });
      exclInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addExcludedIngredient(exclInput.value);
          exclInput.value = "";
        }
      });
    }

    // Add store button
    const addStoreBtn = document.getElementById("btn-add-store");
    const storeInput = document.getElementById("input-new-store");
    if (addStoreBtn && storeInput) {
      addStoreBtn.addEventListener("click", () => {
        addCustomStore(storeInput.value);
        storeInput.value = "";
      });
      storeInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addCustomStore(storeInput.value);
          storeInput.value = "";
        }
      });
    }

    // Reset stores button
    const resetStoresBtn = document.getElementById("btn-reset-stores");
    if (resetStoresBtn) {
      resetStoresBtn.addEventListener("click", resetStoresToDefaults);
    }

    // Save button
    const saveBtn = document.getElementById("btn-save-preferences");
    if (saveBtn) saveBtn.addEventListener("click", savePreferences);

    // Share preferences link
    const sharePrefsBtn = document.getElementById("btn-share-preferences");
    if (sharePrefsBtn) {
      sharePrefsBtn.addEventListener("click", () => {
        const link = generateShareableLink();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(() =>
            window.LittleChefs.showToast("Preferences link copied! Share it with friends.")
          );
        } else {
          const ta = document.createElement("textarea");
          ta.value = link;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          window.LittleChefs.showToast("Preferences link copied! Share it with friends.");
        }
      });
    }

    // Initialize cuisine autocomplete
    initCuisineAutocomplete();

    updatePreferencesUI();
  }

  // ─── PUBLIC API ────────────────────────────────────

  window.LittleChefsPrefs = {
    initPreferencesUI,
    showFirstVisit,
    getPreferences: () => preferences,
    getCuisineOptions: () => CUISINE_OPTIONS,
    getStoreColors: () => STORE_COLORS,
    getAllCategories: () => ALL_CATEGORIES,
    resetPreferences: () => {
      preferences = JSON.parse(JSON.stringify(DEFAULTS));
      saveToLocal();
      updatePreferencesUI();
    },
    saveToCloud: saveToCloud,
    loadFromCloud: loadFromCloud
  };
})();
