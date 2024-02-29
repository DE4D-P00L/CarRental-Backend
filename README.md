## Wheelocity - MERN STACK Car Rental Website

This repository showcases a MERN stack car rental website built with React and Vite. It utilizes various libraries and frameworks to provide a user-friendly and visually appealing experience.

[Frontend Repository](https://github.com/DE4D-P00L/CarRental)

### Features

- **Search and filter cars:** Search for cars based on various criteria, including model, capacity, availability, and other features.
- **User accounts:** Register and login to manage rental bookings and view past rentals.
- **Booking system:** Select dates, choose a car and pay rent to submit a booking request.
- **Admin panel:** Manage car inventory, add new cars, and review rental requests.
- **Responsive design:** Adapts seamlessly to different screen sizes.

### Technologies

- **Frontend:**
  - React
  - Vite
  - Tailwind CSS
  - Framer Motion
  - Axios
  - DaisyUI
  - React-redux
  - react-router-dom
  - react-icons
  - react-hook-form
  - RazorPay
- **Backend:**
  - Express.js
  - Mongoose
  - Multer
  - Cloudinary
  - Jsonwebtoken
  - RazorPay
- **Database:** MongoDB

### Getting Started

1. Clone the Frontend repository:

```bash
git clone https://github.com/DE4D-P00L/CarRental.git
npm install
```

2. Clone the Backend repository:

```bash
git clone https://github.com/DE4D-P00L/CarRental-Backend.git
npm install
```

3. Create a `.env` file in the Backend and add the following environment variables:

- MONGO_URI: Your MongoDB connection string
- CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
- CLOUDINARY_API_KEY: Your Cloudinary API key
- CLOUDINARY_API_SECRET: Your Cloudinary API secret
- JWT_SECRET: Your JWT secret
- RZP_ID: Your RazorPay Key
- RZP_SECRET: Your RazorPay Secret
- FRONTEND_URL: Frontend URL

4. Create a `.env` file in the Frontend and add the following environment variables:

- VITE_BACKEND_URL: Your Backend URL, eg: http://localhost:3000/api/v1

5. Run Backend and Frontend:

```bash
npm run dev
```

5. Access the application in your browser at http://localhost:5173

### Deployment

For production deployment, you can choose platforms like Render, Vercel, Netlify, or Heroku. Refer to the specific platform's documentation for detailed deployment instructions.
