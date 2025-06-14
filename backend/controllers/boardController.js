import Board from "../models/boardModel.js"
import Pin from "../models/pinModel.js"

export const getUserBoards = async (req, res) => {
  try {
    const { userId } = req.params;
    const boards = await Board.find({ user: userId });
    const boardsWithPinDetails = await Promise.all(
      boards.map(async (board) => {
        const pinCount = await Pin.countDocuments({ board: board._id });
        const firstPin = await Pin.findOne({ board: board._id });
        return { ...board.toObject(), pinCount, firstPin };
      })
    );
    res.status(200).json(boardsWithPinDetails);
  } catch (err) {
    console.error("getUserBoards error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
