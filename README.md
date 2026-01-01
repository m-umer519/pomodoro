### Step 3a: Configure Supabase Authentication

For user login to work, you need to enable the authentication providers in your Supabase dashboard.

1.  **Email/Password**:
    - Go to **Authentication** -> **Providers** in your Supabase project.
    - Click on **Email** and enable it. Leave the default settings for now.

2.  **Google (Optional)**:
    - Follow the official Supabase guide: [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google).
    - When you configure your Google Cloud project, you will need a **callback URL**. Use this one (replace `YOUR_PROJECT_ID` with your actual Supabase project ID):
      `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
    - Add the **Client ID** and **Client Secret** from Google to the **Google** provider section in your Supabase dashboard.

3.  **GitHub (Optional)**:
    - Follow the official Supabase guide: [GitHub OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-github).
    - The **callback URL** format is the same as for Google.
    - Add the **Client ID** and **Client Secret** from your GitHub OAuth App to the **GitHub** provider section in Supabase.