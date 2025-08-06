# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/389fa0a3-1fea-4c47-afdc-ce562938b7e6

## How can I edit this code?

There are several ways of editing your application.

## Supabase Setup

This application uses Supabase for database and authentication. To set up Supabase:

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

3. **Run Database Migrations**
   - The SQL migration files are in `supabase/migrations/`
   - Run these in your Supabase SQL editor in the following order:
     1. `create_users_table.sql`
     2. `create_savings_accounts_table.sql`
     3. `create_loans_table.sql`
     4. `create_transactions_table.sql`
     5. `create_savings_goals_table.sql`

4. **Data Migration**
   - Use the "Migrate to Supabase" button in the dashboard
   - This will migrate mock data to your Supabase database
   - The migration includes user profiles, savings accounts, loans, transactions, and goals

## Database Schema

The application uses the following main tables:

- **users**: User profiles and member information
- **savings_accounts**: Different types of savings accounts
- **loans**: Loan applications and repayment tracking
- **transactions**: All financial transactions
- **savings_goals**: User-defined savings targets

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/389fa0a3-1fea-4c47-afdc-ce562938b7e6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/389fa0a3-1fea-4c47-afdc-ce562938b7e6) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
