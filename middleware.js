const {campgroundSchema, reviewSchema} = require('./schemas.js');
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.validateCampground = (req,res,next) => {
    const  { error }=campgroundSchema.validate(req.body);
    if (error){
        const msg= error.details.map(el => el.message).join(',')
        throw new ExpressError(msg ,400)
    } else{
        next();
    }
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);
    
    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }

    if (!req.user || !campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }

    // ✅ THIS LINE IS MANDATORY
    next();
};

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg= error.details.map(el => el.message).join(',')
        throw new ExpressError(msg ,400)
    } else{
        next();
    }
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    
    const review = await Review.findById(reviewId); // ✅ correct usage now
    if (!review) {
        req.flash('error', 'Review not found!');
        return res.redirect(`/campgrounds/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }

    next();
};
