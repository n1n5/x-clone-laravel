# Laravel React Starter Kit

A modern social media application built with Laravel 12 and React 19, featuring a complete set of social networking capabilities including posts, comments, bookmarks, and user relationships.

## Technology Stack

### Backend

- **Framework**: Laravel 12
- **PHP Version**: 8.2+
- **Database**: SQLite (default), MySQL/PostgreSQL supported
- **Authentication**: Laravel Sanctum
- **API Handling**: Inertia.js

### Frontend

- **UI Framework**: React 19
- **Styling**: Tailwind CSS with animations
- **Component Library**: Radix UI
- **State Management**: Inertia.js
- **Icons**: SVG Repo (https://www.svgrepo.com/)

### Development Tools

- **Bundler**: Vite
- **Testing**: Pest PHP
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/laravel-react-starter.git
cd laravel-react-starter
```

2. Install PHP dependencies:

```bash
composer install
```

3. Install JavaScript dependencies:

```bash
npm install
```

4. Set up environment configuration:

```bash
cp .env.example .env
php artisan key:generate
```

5. Create database file (SQLite):

```bash
touch database/database.sqlite
```

6. Run migrations:

```bash
php artisan migrate
```

7. Start the development servers:

```bash
composer run dev
```

## Configuration

Key environment variables in `.env`:

```ini
APP_NAME="Laravel React Starter"
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
# DB_DATABASE=/full/path/to/database.sqlite

SESSION_DRIVER=database
QUEUE_CONNECTION=database
```

## Development Workflow

- **Frontend development**: `npm run dev`
- **Backend development**: `php artisan serve`
- **Combined workflow**: `composer run dev` (runs both)
- **Production build**: `npm run build`
- **Code formatting**: `npm run format`
- **Linting**: `npm run lint`
- **Testing**: `composer test`

## Features

- **User Authentication**: Login, registration, password reset
- **Content Management**:
    - Create/edit/delete posts
    - Add images to posts
    - Comment on posts
    - React to posts (like/repost)
- **Social Features**:
    - Follow/unfollow users
    - Bookmark posts
    - User profile pages
- **UI Components**:
    - Responsive sidebar navigation
    - Modal dialogs
    - Customizable appearance (light/dark mode)
    - Interactive feed with infinite scrolling

## Project Structure

```
├── app
│   ├── Http
│   │   ├── Controllers   # All application controllers
│   │   └── Middleware    # Custom middleware
│   └── Models            # Eloquent models
├── config                # Configuration files
├── database
│   ├── migrations        # Database migrations
│   └── seeders           # Database seeders
├── public                # Publicly accessible assets
├── resources
│   ├── js
│   │   ├── components    # React components
│   │   ├── hooks         # Custom React hooks
│   │   ├── layouts       # Application layouts
│   │   ├── pages         # Page components
│   │   └── lib           # Utility functions
│   └── views             # Blade templates
├── routes                # Application routes
└── tests                 # PHP tests
```

## Contributing

Contributions are welcome!
