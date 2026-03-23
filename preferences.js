// ============================================
// Little Chefs Weekly - Preferences Module
// Manages user preferences with local + cloud storage
// ============================================

(function () {
  "use strict";

  // ─── DEFAULT PREFERENCES ───────────────────────────

  const DEFAULTS = {
    maxCookTime: 30,       // minutes
    cuisines: {
      italian: true,
      japanese: true,
      chinese: true,
      comfort: true,
      adventure: false      // disabled by default for picky eaters
    },
    adventureLevel: 1,      // 1 = cautious, 2 = moderate, 3 = adventurous
    excludedIngredients: [], // e.g. ["peanut butter", "tofu"]
    childAges: "2-4",       // display label
    mealsPerDay: 2           // lunch + dinner
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

    // Cuisine checkboxes
    for (const [cuisine, enabled] of Object.entries(preferences.cuisines)) {
      const cb = document.getElementById(`pref-cuisine-${cuisine}`);
      if (cb) cb.checked = enabled;
    }

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

    // Save to cloud if logged in
    await saveToCloud();

    // Regenerate meal plans
    if (window.LittleChefs.regenerateWithPreferences) {
      window.LittleChefs.regenerateWithPreferences();
    }

    hidePreferencesModal();
    window.LittleChefs.showToast("Preferences saved! Meals updated.");
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

    updatePreferencesUI();
  }

  // ─── PUBLIC API ────────────────────────────────────

  window.LittleChefsPrefs = {
    initPreferencesUI,
    getPreferences: () => preferences,
    resetPreferences: () => {
      preferences = JSON.parse(JSON.stringify(DEFAULTS));
      saveToLocal();
      updatePreferencesUI();
    },
    saveToCloud: saveToCloud,
    loadFromCloud: loadFromCloud
  };
})();
