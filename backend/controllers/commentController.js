import Comment from "../models/commentModel.js"
import User from "../models/userModel.js"


export const getPostComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ pin: postId })
    .populate("user", "userName img displayName")
    .sort({ createdAt: -1 });

  res.status(200).json(comments);
};


export const addComment = async (req, res) => {
  const { description, pin } = req.body;
  const userId = req.userId;

  try {
    const comment = new Comment({ description, pin, user: userId });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error });
  }
};


export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userId;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment", err });
  }
};
