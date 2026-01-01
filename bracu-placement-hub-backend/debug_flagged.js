const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bracu-placement-hub";

const ReviewSchema = new mongoose.Schema({ flagged: { type: Boolean, default: false }, comment: String, reviewer: mongoose.Schema.Types.ObjectId });
const ForumPostSchema = new mongoose.Schema({ flagged: { type: Boolean, default: false }, title: String, content: String, author: mongoose.Schema.Types.ObjectId });
const ForumCommentSchema = new mongoose.Schema({ flagged: { type: Boolean, default: false }, content: String, author: mongoose.Schema.Types.ObjectId });

// Use existing models if already compiled (to avoid OverwriteModelError)
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
const ForumPost = mongoose.models.ForumPost || mongoose.model("ForumPost", ForumPostSchema);
const ForumComment = mongoose.models.ForumComment || mongoose.model("ForumComment", ForumCommentSchema);

async function debug() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    const reviewCount = await Review.countDocuments({ flagged: true });
    const postCount = await ForumPost.countDocuments({ flagged: true });
    const commentCount = await ForumComment.countDocuments({ flagged: true });

    console.log("COUNTS:");
    console.log(`Reviews: ${reviewCount}`);
    console.log(`Posts: ${postCount}`);
    console.log(`Comments: ${commentCount}`);

    console.log("\nFIND RESULTS:");
    const reviews = await Review.find({ flagged: true });
    console.log(`Reviews Found: ${reviews.length}`);
    if (reviews.length > 0) console.log(JSON.stringify(reviews[0], null, 2));

    const posts = await ForumPost.find({ flagged: true });
    console.log(`Posts Found: ${posts.length}`);
    if (posts.length > 0) console.log(JSON.stringify(posts[0], null, 2));

    const comments = await ForumComment.find({ flagged: true });
    console.log(`Comments Found: ${comments.length}`);
    if (comments.length > 0) console.log(JSON.stringify(comments[0], null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

debug();
