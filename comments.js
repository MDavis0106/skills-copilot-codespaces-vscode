// Create web server
var express = require("express");
var router = express.Router();
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middleware = require("../middleware");

// ============================
// COMMENTS ROUTES
// ============================
// Comments New
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
       if(err) {
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground});
       }
    });
});

// Comments Create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
    // lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    // save comment
                    comment.save();
                    
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    
                    // redirect campground show page
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Comments Edit Route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, foundCampground) {
       if(err || !foundCampground) {
           req.flash("error", "Campground not found");
           return res.redirect("back");
       } 
       Comment.findById(req.params.comment_id, function(err, foundComment) {
           if(err) {
               res.redirect("back");
           } else {
               res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
           }
       });
    });
});

// Comments Update Route
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res