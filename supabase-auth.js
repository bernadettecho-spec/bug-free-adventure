// ============================================
// Little Chefs Weekly - Supabase Auth Module
// Handles sign-up, log-in, log-out, and session
// ============================================

(function () {
  "use strict";

  // ─── SUPABASE CLIENT ───────────────────────────────
  // The SUPABASE_URL and SUPABASE_KEY are set in index.html before this script loads.
  // They are safe to expose in the browser — they are "anon" keys with Row Level Security.

  let supabase = null;
  let currentUser = null;

  function initSupabase() {
    if (!window.SUPABASE_URL || !window.SUPABASE_KEY) {
      console.warn("Supabase not configured — running in local-only mode.");
      return false;
    }
    supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
    return true;
  }

  // ─── AUTH STATE ────────────────────────────────────

  async function checkSession() {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      currentUser = session.user;
      updateAuthUI(true);
      return session.user;
    }
    updateAuthUI(false);
    return null;
  }

  async function signUp(email, password, displayName) {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } }
    });
    if (!error && data.user) {
      currentUser = data.user;
      updateAuthUI(true);
      // Show confirmation message if email confirmation required
      if (!data.session) {
        window.LittleChefs.showToast("Check your email to confirm your account!");
      }
    }
    return { data, error };
  }

  async function logIn(email, password) {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      currentUser = data.user;
      updateAuthUI(true);
    }
    return { data, error };
  }

  async function logOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    currentUser = null;
    updateAuthUI(false);
  }

  // ─── AUTH UI ───────────────────────────────────────

  function updateAuthUI(isLoggedIn) {
    const authBtn = document.getElementById("btn-auth");
    const prefsBtn = document.getElementById("btn-preferences");
    const userLabel = document.getElementById("user-label");

    if (!authBtn) return;

    if (isLoggedIn && currentUser) {
      const name = currentUser.user_metadata?.display_name || currentUser.email.split("@")[0];
      authBtn.textContent = "Log Out";
      authBtn.onclick = handleLogout;
      if (userLabel) {
        userLabel.textContent = name;
        userLabel.classList.remove("hidden");
      }
      if (prefsBtn) prefsBtn.classList.remove("hidden");
    } else {
      authBtn.textContent = "Log In";
      authBtn.onclick = showAuthModal;
      if (userLabel) {
        userLabel.textContent = "";
        userLabel.classList.add("hidden");
      }
    }
  }

  function showAuthModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) modal.classList.remove("hidden");
    // Default to login tab
    switchAuthTab("login");
  }

  function hideAuthModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) modal.classList.add("hidden");
    clearAuthErrors();
  }

  function switchAuthTab(tab) {
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
    document.querySelector(`.auth-tab[data-tab="${tab}"]`)?.classList.add("active");
    document.getElementById(`auth-form-${tab}`)?.classList.add("active");
    clearAuthErrors();
  }

  function clearAuthErrors() {
    document.querySelectorAll(".auth-error").forEach(e => { e.textContent = ""; });
  }

  async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const errorEl = document.getElementById("login-error");

    if (!email || !password) {
      errorEl.textContent = "Please fill in both fields.";
      return;
    }

    errorEl.textContent = "";
    const { error } = await logIn(email, password);

    if (error) {
      errorEl.textContent = error.message;
    } else {
      hideAuthModal();
      window.LittleChefs.showToast("Welcome back!");
      // Load saved preferences
      if (window.LittleChefs.loadPreferencesFromCloud) {
        await window.LittleChefs.loadPreferencesFromCloud();
      }
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const errorEl = document.getElementById("signup-error");

    if (!name || !email || !password) {
      errorEl.textContent = "Please fill in all fields.";
      return;
    }
    if (password.length < 6) {
      errorEl.textContent = "Password must be at least 6 characters.";
      return;
    }

    errorEl.textContent = "";
    const { error } = await signUp(email, password, name);

    if (error) {
      errorEl.textContent = error.message;
    } else {
      hideAuthModal();
      window.LittleChefs.showToast("Account created! You're logged in.");
      if (window.LittleChefs.savePreferencesToCloud) {
        await window.LittleChefs.savePreferencesToCloud();
      }
    }
  }

  async function handleLogout() {
    await logOut();
    window.LittleChefs.showToast("You've been logged out.");
    // Reset to default preferences
    if (window.LittleChefs.resetPreferences) {
      window.LittleChefs.resetPreferences();
    }
  }

  // ─── INIT AUTH UI EVENTS ───────────────────────────

  function initAuthUI() {
    // Auth modal tabs
    document.querySelectorAll(".auth-tab").forEach(tab => {
      tab.addEventListener("click", () => switchAuthTab(tab.dataset.tab));
    });

    // Auth forms
    const loginForm = document.getElementById("auth-form-login");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);

    const signupForm = document.getElementById("auth-form-signup");
    if (signupForm) signupForm.addEventListener("submit", handleSignup);

    // Modal close
    const modal = document.getElementById("auth-modal");
    if (modal) {
      modal.querySelector(".modal-backdrop")?.addEventListener("click", hideAuthModal);
      modal.querySelector(".modal-close")?.addEventListener("click", hideAuthModal);
    }
  }

  // ─── PUBLIC API ────────────────────────────────────

  window.LittleChefsAuth = {
    initSupabase,
    checkSession,
    initAuthUI,
    showAuthModal,
    getSupabase: () => supabase,
    getCurrentUser: () => currentUser
  };
})();
