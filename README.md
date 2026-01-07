# PollMap - Real-time Polling & Engagement Platform

A high-performance real-time polling and Q&A platform designed for live events, classrooms, and interactive presentations. Built with React, Node.js, WebSockets, and Redis for sub-300ms latency real-time updates.

## Features

### Polling System
- Create polls manually or extract from images using Google Gemini AI OCR
- Real-time voting with instant synchronization across all connected clients
- Password-protected polls for secure access control
- Expiring session links for time-bound events
- Live vote counters and participant tracking
- Role-based access control for event organizers and participants

### Analytics & Reporting
- Comprehensive analytics dashboard with multiple chart types (Bar, Pie, Line, Radar)
- Real-time vote statistics and trends
- Export results as PNG images or PDF documents
- Share analytics across social media platforms

### Real-time Infrastructure
- WebSocket-based bidirectional communication using Socket.io
- Redis Pub/Sub for message queuing and caching
- Horizontally scalable WebSocket servers for high availability
- Stateless API design for microservices architecture
- 99% uptime with auto-scaling capability

## Tech Stack

**Frontend**
- React 19 - UI library
- Vite - Build tool and development server
- Tailwind CSS - Styling framework
- Nivo Charts - Data visualization
- Lucide React - Icon library
- html2canvas - Image export
- jsPDF - PDF generation

**Backend**
- Node.js - Server runtime
- Express.js - Web framework
- Socket.io - WebSocket communication
- Redis - Caching and pub/sub messaging
- Supabase - PostgreSQL database and authentication

**DevOps**
- Docker - Containerization
- AWS EC2 - Cloud hosting
- Nginx - Reverse proxy and load balancing

**AI Integration**
- Google Gemini AI - OCR and text extraction

## Installation

### Prerequisites
- Node.js 18 or higher
- Redis server
- Supabase account
- Google Gemini AI API key
- Docker (optional, for containerized deployment)

### Setup

1. Clone the repository
```bash
git clone https://github.com/lande26/pollmap.git
cd pollmap
```

2. Install frontend dependencies
```bash
cd client
npm install
```

3. Install backend dependencies
```bash
cd ../server
npm install
```

4. Configure environment variables

Create a `.env` file in the `server` directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

# Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

5. Setup database

Run the Supabase schema migration:
```bash
cd server/supabase
psql -h your-project.supabase.co -U postgres -d postgres -f schema.sql
```

6. Start Redis server
```bash
redis-server
```

7. Run the application

Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend (in a new terminal):
```bash
cd client
npm run dev
```

8. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Redis: localhost:6379

## Docker Deployment

### Using Docker Compose

Build and start all services:
```bash
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f
```

Stop services:
```bash
docker-compose down
```

### Manual Docker Build

Build frontend image:
```bash
docker build -t pollmap-client ./client
```

Build backend image:
```bash
docker build -t pollmap-server ./server
```

Run containers:
```bash
docker run -p 5173:5173 pollmap-client
docker run -p 3000:3000 pollmap-server
```

## Usage

### Creating a Poll

1. Navigate to the "Create Poll" page
2. Choose between manual creation or AI extraction
   - Manual: Enter your question and answer options
   - AI: Upload an image containing poll text
3. Configure security settings:
   - Password protection (optional)
   - Expiration time
   - Maximum votes per user
4. Click "Create Poll" to generate a shareable link

### Voting in a Poll

1. Access the poll via the shared link or room code
2. Enter password if the poll is protected
3. Select your answer option
4. View real-time results and analytics

### Managing Events

1. Access the event dashboard to monitor active polls
2. Track real-time votes and participant engagement
3. View comprehensive analytics with multiple chart types
4. Export results as images or PDF documents
5. Share results via social media or direct links

### API Endpoints

**Authentication**
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
POST /api/auth/logout      - Logout user
GET  /api/auth/me          - Get current user
```

**Polls**
```
GET    /api/polls          - Get all polls
POST   /api/polls          - Create new poll
GET    /api/polls/:id      - Get poll by ID
PUT    /api/polls/:id      - Update poll
DELETE /api/polls/:id      - Delete poll
POST   /api/polls/:id/vote - Submit vote
```

**Analytics**
```
GET /api/analytics/:pollId       - Get poll analytics
GET /api/analytics/:pollId/export - Export analytics as PDF
```

## Project Structure

```
pollmap/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Poll/
│   │   │   ├── Analytics/
│   │   │   └── Auth/
│   │   ├── pages/             # Application pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreatePoll.jsx
│   │   │   └── VotePage.jsx
│   │   ├── context/           # React context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── services/          # API services
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── utils/             # Helper functions
│   │   └── App.jsx
│   └── package.json
├── server/                     # Node.js backend
│   ├── socket/                # WebSocket handlers
│   │   ├── pollHandler.js
│   │   └── voteHandler.js
│   ├── routes/                # API routes
│   │   ├── polls.js
│   │   ├── auth.js
│   │   └── analytics.js
│   ├── middleware/            # Express middleware
│   │   ├── auth.js
│   │   └── rateLimiter.js
│   ├── services/              # Business logic
│   │   ├── redis.js
│   │   └── gemini.js
│   ├── supabase/              # Database schemas
│   │   └── schema.sql
│   └── server.js
├── docker-compose.yml         # Docker orchestration
├── nginx.conf                 # Nginx configuration
└── README.md
```

## Architecture

### System Design

The application follows a microservices architecture with the following components:

1. **Frontend Layer** - React application served via Nginx
2. **API Layer** - RESTful Express.js server with stateless endpoints
3. **WebSocket Layer** - Socket.io servers for real-time communication
4. **Cache Layer** - Redis for session management and pub/sub
5. **Database Layer** - Supabase PostgreSQL for persistent storage
6. **Load Balancer** - Nginx for distributing traffic across servers

### Real-time Communication Flow

```
Client ──WebSocket──> Socket.io Server ──Pub/Sub──> Redis ──Subscribe──> Other Socket.io Servers
```

When a user votes:
1. Vote sent via WebSocket to Socket.io server
2. Server publishes vote event to Redis
3. All Socket.io servers subscribed to Redis receive the event
4. Servers broadcast update to their connected clients
5. All clients receive real-time vote update (sub-300ms latency)

### Database Schema

**users**
- id (UUID, primary key)
- email (string, unique)
- password_hash (string)
- created_at (timestamp)

**polls**
- id (UUID, primary key)
- user_id (UUID, foreign key)
- title (string)
- options (jsonb)
- password_hash (string, nullable)
- expires_at (timestamp, nullable)
- created_at (timestamp)

**votes**
- id (UUID, primary key)
- poll_id (UUID, foreign key)
- user_id (UUID, foreign key)
- option_id (string)
- created_at (timestamp)

## Performance Metrics

- **Real-time Latency**: Sub-300ms for vote updates
- **Latency Improvement**: 150ms reduction using Redis Pub/Sub
- **System Uptime**: 99% availability with auto-scaling
- **Concurrent Connections**: Horizontally scalable WebSocket servers
- **Database Queries**: 70% reduction through Redis caching

## Development

### Available Scripts

**Frontend (`client/`)**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

**Backend (`server/`)**
```bash
npm run dev        # Start with nodemon
npm start          # Start production server
npm test           # Run tests
npm run lint       # Run ESLint
```

### Code Style Guidelines

- Use ESLint and Prettier for code formatting
- Follow React Hooks best practices
- Use async/await for asynchronous operations
- Implement error boundaries in React components
- Validate and sanitize all user inputs
- Use environment variables for configuration

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration for API protection
- Rate limiting on API endpoints
- Input validation and sanitization
- Password-protected polls
- Session expiration management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

**Kartik Lande**
- Email: kartiklande70@gmail.com
- GitHub: [@lande26](https://github.com/lande26)
- LinkedIn: [linkedin.com/in/kartik-lande](https://linkedin.com/in/kartik-lande)

## Acknowledgments

- Supabase for database and authentication services
- Socket.io for real-time WebSocket communication
- Redis for high-performance caching and pub/sub
- Google Gemini AI for OCR functionality
- Nivo for data visualization components
