# 🏕️ Campify

**Live Demo**: [https://campify-jf6u.onrender.com](https://campify-jf6u.onrender.com)

Campify is a full-stack web application where users can explore, create, and review campgrounds. It features secure authentication, interactive maps, image uploads, and a clean user experience. Built with Node.js, Express, MongoDB, EJS, and integrated with Cloudinary and Mapbox.

---

## 🔧 Features

- 👥 User Authentication & Authorization
- 🏞️ Add/Edit/Delete Campgrounds
- 🖼️ Upload Images via Cloudinary
- 💬 Leave Reviews for Campgrounds
- 🗺️ Display Campground Locations using Mapbox
- 🛡️ Secure Forms with Input Validation and Sanitization
- 💡 Flash Messaging and Custom Error Pages

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Templating Engine**: EJS + EJS-Mate
- **Authentication**: Passport.js
- **File Uploads**: Multer, Cloudinary
- **Maps**: Mapbox GL JS
- **Validation**: Joi
- **Deployment**: Render

---

## 📸 Screenshots


![Home Page](https://campify-jf6u.onrender.com/)
![Campground Page](https://campify-jf6u.onrender.com/campgrounds)

---

## ⚙️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/campify.git
   cd campify
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory and add the following:

   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_api_key
   CLOUDINARY_SECRET=your_api_secret
   MAPBOX_TOKEN=your_mapbox_token
   DB_URL=mongodb://localhost:27017/campify
   SECRET=your_cookie_secret
   ```

4. **Run the App**
   ```bash
   nodemon app.js
   ```

5. Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment (Render)

- Push code to GitHub
- Create a new Web Service on [Render](https://render.com)
- Add the same environment variables used in `.env`
- Set Build Command: `npm install`
- Set Start Command: `node app.js`
- Connect your MongoDB Atlas DB (or use Render’s managed Mongo)

---

## 📚 Future Improvements

- Profile pages for users
- Edit & delete uploaded images
- Pagination for campgrounds and reviews
- Responsive layout & mobile support
- Save/bookmark campgrounds

---

## 🙋‍♂️ Author

- [LinkedIn](www.linkedin.com/in/ehteshaamkhan)
- [GitHub](https://github.com/ehhteshaam)

