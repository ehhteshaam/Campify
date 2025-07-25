const express=require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware.js');
const {index,renderNewForm,createCampground,showCampground,renderEditForm,deleteForm,updateCampground} = require('../controllers/campgrounds');
const campground = require('../models/campground');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage }); 
router.route('/')
    .get( catchAsync(index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(createCampground));

    
router.get('/new', isLoggedIn,renderNewForm);

router.route('/:id')
    .get(catchAsync(showCampground))
    .put( isLoggedIn, isAuthor, upload.array('image'), validateCampground,catchAsync(updateCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(deleteForm));




router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(renderEditForm));

module.exports = router;
