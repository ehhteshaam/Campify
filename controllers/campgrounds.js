const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken: mapBoxToken})

module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}
module.exports.renderNewForm= (req, res) => { 
    res.render('campgrounds/new');
}
module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    if (!geoData.body.features.length) {
        req.flash('error', 'Invalid location. Please try again.');
        return res.redirect('/campgrounds/new');
    }

    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();

    req.flash('success', 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate:{
            path:'author'
        }

    }).populate('author');
    console.log();
    if(!campground){
        req.flash('error','Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground,msg: req.flash("success") });
}
module.exports.renderEditForm=async (req, res) => {
    const {id}=req.params;
    const campground= await Campground.findById(id);
    if(!campground){
        req.flash('error','Cannot find that campground!');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { campground });
}
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;

    // Find and update the campground
    const campground = await Campground.findById(id);
    Object.assign(campground, req.body.campground);

    // Add newly uploaded images
    if (req.files && req.files.length > 0) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        campground.images.push(...imgs);
    }

    // Delete selected images
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            // Remove from Cloudinary
            await cloudinary.uploader.destroy(filename);
        }
        // Remove from MongoDB
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } }
        });
    }

    await campground.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};


module.exports.deleteForm=async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','successfully deleted Campground!');
    res.redirect('/campgrounds');
}