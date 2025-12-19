import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ForumPostDetailsPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // For comment submission

  const fetchPostDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:1350/api/forum/posts/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch post");

      const data = await response.json();
      if (data.success) {
        setPost(data.post);
        setComments(data.comments);
      } else {
        throw new Error(data.error || "Could not load post data.");
      }
    } catch (err) {
      console.error("Error fetching post details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId, navigate]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  const handleLikePost = async () => {
    if (!post) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:1350/api/forum/posts/${postId}/like`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update like status.");
      }

      // Update state based on the reliable response from the server
      setPost((prev) => ({
        ...prev,
        likeCount: data.likeCount,
        isLiked: data.isLiked,
      }));
    } catch (err) {
      console.error("Error liking post:", err);
      alert(err.message); // Give user feedback
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:1350/api/forum/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: commentInput }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to add comment.");
      }

      // Add the new comment from the server response to the list
      setComments((prev) => [...prev, data.comment]);
      setCommentInput(""); // Clear input on success
    } catch (err) {
      console.error("Error adding comment:", err);
      alert(err.message); // Give user feedback
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:1350/api/forum/comments/${commentId}/like`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to like comment.");
      }

      // Update the specific comment in the comments array
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, likeCount: data.likeCount, isLiked: data.isLiked }
            : comment
        )
      );
    } catch (err) {
      console.error("Error liking comment:", err);
      alert(err.message); // Give user feedback
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <p className="text-red-600 text-xl mb-4">
            {error || "Post not found"}
          </p>
          <button
            onClick={() => navigate("/forum")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
          >
            Back to Forum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/forum")}
          className="mb-4 text-blue-600 font-semibold"
        >
          ← Back to Forum
        </button>

        {/* Post */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>By {post.author.name}</span>
            <span>• {formatDate(post.createdAt)}</span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap mb-6">
            {post.content}
          </p>
          <div className="flex items-center gap-6 pt-6 border-t">
            <button
              onClick={handleLikePost}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                post.isLiked
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={post.isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="font-semibold">{post.likeCount}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-semibold">{comments.length} Comments</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-semibold">{post.views} Views</span>
            </div>
          </div>
        </div>

        {/* Add Comment */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Add a Comment
          </h2>
          <form onSubmit={handleAddComment}>
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Share your thoughts..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md mb-3"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold disabled:bg-gray-400"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>

        {/* Comments */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Comments ({comments.length})
          </h2>
          {comments.length === 0 ? (
            <p className="text-gray-600">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-800">
                      {comment.author.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      • {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className={`flex items-center gap-1 text-sm ${
                      comment.isLiked ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill={comment.isLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{comment.likeCount}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForumPostDetailsPage;
