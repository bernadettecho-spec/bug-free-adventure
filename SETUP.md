# How to Set Up Little Chefs Weekly (for Non-Technical Users)

This guide walks you through every step to get Little Chefs Weekly running online so you can share it with friends. Each friend will be able to create an account, set their own cooking preferences, and get personalised meal plans.

No coding experience needed — just follow the steps below.

---

## What You're Building

```
Your App (the website)
   │
   ├── Hosted on Vercel (free) — makes your site live on the internet
   │
   └── Connected to Supabase (free) — stores user accounts & preferences
```

Think of it like this:
- **Vercel** = the shop front (what people see)
- **Supabase** = the filing cabinet in the back (remembers who your users are)

---

## Step 1: Create a GitHub Account (if you don't have one)

GitHub is where your code lives. Vercel reads from it to build your website.

1. Go to [github.com](https://github.com)
2. Click **"Sign up"**
3. Follow the steps (email, password, username)
4. Verify your email

---

## Step 2: Put Your Code on GitHub

You need to upload the Little Chefs Weekly files to GitHub.

1. Log into [github.com](https://github.com)
2. Click the **"+"** button (top right) → **"New repository"**
3. Name it: `little-chefs-weekly`
4. Keep it **Public**
5. Click **"Create repository"**
6. Upload all the files from this folder:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `recipes.js`
   - `preferences.js`
   - `supabase-auth.js`

   You can drag and drop them onto the GitHub page, then click **"Commit changes"**.

---

## Step 3: Set Up Supabase (Your Database — Free)

Supabase is a free service that stores user accounts and their preferences.

### 3a. Create an account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign in with your GitHub account (easiest option)

### 3b. Create a new project

1. Click **"New Project"**
2. Fill in:
   - **Name:** `little-chefs-weekly`
   - **Database Password:** pick something strong (you won't need to remember this)
   - **Region:** pick the one closest to you (e.g., Singapore)
3. Click **"Create new project"**
4. Wait 1-2 minutes while it sets up

### 3c. Create the preferences table

This is where user preferences get saved. You need to run one command.

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste this entire block:

```sql
-- Create the user_preferences table
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preferences JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security (keeps each user's data private)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only see their own preferences
CREATE POLICY "Users can read own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only create their own preferences
CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own preferences
CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);
```

4. Click the **"Run"** button (or press Ctrl+Enter)
5. You should see "Success. No rows returned" — that's correct!

### 3d. Get your Supabase keys

1. In the left sidebar, click **"Project Settings"** (the gear icon)
2. Click **"API"** (under "Configuration")
3. You'll see two important values:
   - **Project URL** — looks like `https://abc123xyz.supabase.co`
   - **anon public** key — a long string starting with `eyJ...`

4. Copy both of these. You'll need them in the next step.

### 3e. Put the keys in your code

1. Go back to GitHub and open `index.html`
2. Click the pencil icon to edit
3. Find these two lines near the top:

```javascript
window.SUPABASE_URL = "";
window.SUPABASE_KEY = "";
```

4. Paste your values inside the quotes:

```javascript
window.SUPABASE_URL = "https://abc123xyz.supabase.co";
window.SUPABASE_KEY = "eyJhbGciOi...your-long-key-here";
```

5. Click **"Commit changes"**

> **Is this safe?** Yes! The "anon" key is designed to be public. Supabase uses Row Level Security (which you set up in step 3c) to keep each user's data private. Nobody can read someone else's preferences.

---

## Step 4: Deploy to Vercel (Put It on the Internet — Free)

Vercel will take your GitHub code and turn it into a live website.

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Click **"Add New..."** → **"Project"**
5. Find `little-chefs-weekly` in the list and click **"Import"**
6. Leave all settings as default
7. Click **"Deploy"**
8. Wait about 30 seconds

You'll see a success screen with a URL like:
```
https://little-chefs-weekly.vercel.app
```

**That's your live website!** Share this link with your friends.

---

## Step 5: Share With Friends

### Option A: Just share the website link
Send your friends the Vercel URL. They can:
- Browse meal plans immediately (no account needed)
- Create an account to save their preferences
- Set their own cuisine preferences, cook times, and ingredient exclusions

### Option B: Share with your preferences pre-loaded
1. On the website, click **"Preferences"**
2. Set up your preferences
3. Click **"Copy Shareable Link"**
4. Send this link to a friend — it will load the app with YOUR preferences pre-filled
5. They can then create their own account to save and modify them

---

## How It All Works Together

```
Friend opens your link
       │
       ▼
  Sees the meal planner (hosted on Vercel)
       │
       ▼
  Clicks "Log In" → "Sign Up"
       │
       ▼
  Creates account (stored in Supabase)
       │
       ▼
  Clicks "Preferences"
       │
       ▼
  Sets cook time, cuisines, excluded ingredients
       │
       ▼
  Clicks "Save & Update Meals"
       │
       ├── Preferences saved to Supabase (so they persist)
       └── Meal plan regenerates using their preferences
```

---

## Troubleshooting

### "Nothing happens when I click Log In"
- Check that you pasted the Supabase URL and Key correctly in `index.html`
- Make sure there are no extra spaces in the values
- The URL should start with `https://` and the key should start with `eyJ`

### "I see the site but it looks broken"
- Make sure ALL files are uploaded to GitHub (especially `preferences.js` and `supabase-auth.js`)
- Check that the file names match exactly (lowercase, correct extensions)

### "My friend can't create an account"
- Go to Supabase → Authentication → Settings
- Under "Email Auth", make sure **"Enable Email Signup"** is ON
- You can also turn OFF **"Confirm Email"** if you want instant access (under Email settings, disable "Confirm email")

### "Preferences aren't saving"
- Make sure you ran the SQL in step 3c
- Check Supabase → Table Editor → you should see a `user_preferences` table

### Changes to recipes or styles aren't showing up
- After editing files on GitHub, Vercel automatically redeploys (takes ~30 seconds)
- Try a hard refresh in your browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Costs

Everything used here is **free**:

| Service  | Free Tier Includes |
|----------|-------------------|
| GitHub   | Unlimited public repositories |
| Supabase | 50,000 monthly active users, 500 MB database |
| Vercel   | 100 deployments per day, custom domains |

You won't need to pay unless you have tens of thousands of users.

---

## Optional: Custom Domain

If you want a nicer URL (like `littlechefsweekly.com`):

1. Buy a domain from [Namecheap](https://namecheap.com) or [Google Domains](https://domains.google.com) (~$10/year)
2. In Vercel, go to your project → Settings → Domains
3. Add your domain and follow the DNS instructions

---

## Need Help?

If you get stuck on any step, take a screenshot of what you see and share it — that makes it much easier to figure out what went wrong.
