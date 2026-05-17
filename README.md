# JCC City Altar Church Website

A full-stack web application for JCC City Altar church, featuring a responsive frontend, admin panel for content management, and a REST API backend with PostgreSQL database.

## Features

- **Responsive Frontend**: Static HTML/CSS/JavaScript pages for home, services, ministries, about, and contact
- **Admin Panel**: Secure admin interface for managing messages, services, and media uploads
- **Media Management**: Upload and display images/videos for home and services sections
- **Contact System**: Prayer request submission and admin message management
- **Services Management**: Admin can add/edit church services
- **Dark/Light Theme**: User-selectable theme with local storage persistence
- **REST API**: Full API for all data operations

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database with Sequelize ORM
- **Multer** for file uploads
- **CORS** for cross-origin requests
- **Dotenv** for environment configuration

### Frontend
- **HTML5/CSS3** with responsive design
- **Vanilla JavaScript** for interactivity
- **AOS (Animate On Scroll)** for animations
- **Font Awesome** for icons

### Database
- **PostgreSQL** with tables for:
  - Contacts (prayer requests)
  - Services (church programs)
  - Media (uploaded images/videos)

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- PostgreSQL (v12 or higher)
- Git

## Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd church
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Set up PostgreSQL database:**
   - Install PostgreSQL on your system
   - Create a database named `church_db`
   - Create a user with appropriate permissions

4. **Configure environment variables:**
   Create `.env` file in `backend/` directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=church_db
   ```

5. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

## Running the Application

### Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Production
```bash
cd backend
npm start
```

Open your browser to `http://localhost:5000`

### Access Points
- **Home Page**: `http://localhost:5000/index.html`
- **Services Page**: `http://localhost:5000/services.html`
- **Admin Panel**: `http://localhost:5000/admin.html`
- **API Base**: `http://localhost:5000/api/`

## API Documentation

### Contacts
- `GET /api/contact` - Get all contact messages
- `POST /api/contact` - Submit new contact/prayer request
- `DELETE /api/contact/:id` - Delete a contact message

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Add new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Media
- `GET /api/media` - Get all media
- `GET /api/media/section/:section` - Get media by section (home/services)
- `GET /api/media/:id` - Get single media item
- `POST /api/media/upload` - Upload new media (multipart/form-data)
  - Fields: `file`, `type` (image/video), `section` (home/services), `title`, `description`
- `PUT /api/media/:id` - Update media title/description
- `DELETE /api/media/:id` - Delete media

### File Serving
- Uploaded files are served from `/uploads/media/filename`

## Project Structure

```
church/
├── README.md
├── backend/
│   ├── server.js              # Main Express server
│   ├── package.json
│   ├── .env                   # Environment variables
│   ├── config/
│   │   └── db.js             # Database configuration
│   ├── models/
│   │   ├── Contact.js        # Contact model
│   │   ├── Service.js        # Service model
│   │   └── Media.js          # Media model
│   ├── routes/
│   │   ├── contact.js        # Contact routes
│   │   ├── services.js       # Services routes
│   │   └── media.js          # Media routes
│   ├── uploads/              # Uploaded files directory
│   │   └── media/
│   └── seed.js               # Database seeding script
└── frontend/
    ├── index.html            # Home page
    ├── services.html         # Services page
    ├── ministries.html       # Ministries page
    ├── about.html            # About page
    ├── contact.html          # Contact page
    ├── admin.html            # Admin panel
    ├── style.css             # Main stylesheet
    ├── contact.js            # Contact form script
    ├── admin.js              # Admin panel script
    ├── admin-media.js        # Media management script
    └── images/               # Static images
```

## Deployment

### Option 1: VPS/Server
1. Set up a Linux server with Node.js and PostgreSQL
2. Clone the repository
3. Follow installation steps above
4. Use PM2 for process management:
   ```bash
   sudo npm install -g pm2
   cd backend
   pm2 start server.js --name church-app
   pm2 save
   pm2 startup
   ```
5. Configure Nginx as reverse proxy
6. Set up SSL with Certbot

### Option 2: Docker
Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=db
      - DB_USER=postgres
      - DB_PASSWORD=password
      - DB_NAME=church_db
    depends_on:
      - db
    volumes:
      - ./backend/uploads:/app/uploads

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=church_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Option 3: Cloud Platforms
- **Render**: Connect GitHub repo, set build/start commands
- **Railway**: Automatic deployment from Git
- **Fly.io**: Good for full-stack apps
- **DigitalOcean App Platform**: Managed deployment

**Important**: For file uploads, ensure persistent storage. Use object storage (S3, Cloudinary) for production.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.