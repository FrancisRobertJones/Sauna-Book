# Sauna Book 🧖‍♂️

Sauna Book is a modern solution for managing and booking sauna facilities, created as my final project at Medieinstitutet's Fullstack Development course. I built it to make life easier for both sauna owners and users - owners can manage their facilities without hassle, while users get a simple way to book their sauna sessions. 

## 🚀 Features

### Admin Dashboard
- **User Management**
  - Send and manage user invitations
  - Add/remove user access to specific saunas
  - View user booking statistics
  - Email notifications for system actions

- **Sauna Management**
  - Create and configure sauna facilities
  - Set booking parameters:
    - Slot duration
    - Maximum concurrent bookings
    - Total booking limits per user
    - Operating hours
  - View booking analytics and usage statistics

### User Interface
- **Booking System**
  - Interactive calendar and time slot selection
  - Multiple slot booking capability
  - Booking confirmation emails
  - Automated reminder system
  - Waitlist functionality for popular time slots

- **Account Management**
  - Accept sauna invitations
  - View and manage personal bookings
  - Set booking reminders
  - Join and track waitlist positions

## 🛠 Technology Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Styling and responsive design
- **Framer Motion** - Animations and transitions
- **ShadcnUI** - Component library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - Object modeling
- **Auth0** - Authentication and authorization

### Services
- **Nodemailer** - Email notifications
- **Upstash/Qstash** - Scheduling and cron jobs
- **ngrok** - Tunnel for webhook development

## 📋 Key Features in Detail

### Booking System
- **Flexible Slot Duration**: Configurable booking durations
- **Concurrent Bookings**: Support for multiple simultaneous bookings
- **Booking Limits**: Customisable limits per user
- **Waitlist System**: Automated waitlist management with email notifications

### Email Notifications
- Booking confirmations
- Reminder notifications
- Waitlist updates
- Invitation management

### Waitlist Management
- Automated position tracking
- Cascading notifications
- Time-based expiry system
- Email notifications when slots become available

## 🌐 Live Demo

The application is deployed and accessible at:
- Frontend: [Sauna Book](https://sauna-book.xyz/)
- Backend: Hosted on Railway

### Hosting Infrastructure
- **Frontend**: Deployed on Vercel for optimal static site delivery
- **Backend**: Hosted on Railway's free tier (US servers)
- **Database**: MongoDB Atlas

⚠️ **Note**: Initial load times might be slower than optimal due to the backend being hosted on Railway's free tier in the US region. The server may need to "wake up" if it hasn't been accessed recently.

## 🔗 Links
- [Live Application](https://sauna-book.xyz/)
- [GitHub Repository](https://github.com/FrancisRobertJones/book-a--bastu)

## 👨‍💻 Author

Francis Jones

