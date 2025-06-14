import { response } from "express";
import Pin from "../models/pinModel.js";
import User from "../models/userModel.js";
import Like from "../models/likeModels.js";
import Save from "../models/saveModel.js";
import imagekit from "imagekit"
import jwt from "jsonwebtoken"

export const getPins = async (req, res) => {
  try {
    const pageNumber = Number(req.query.cursor) || 0;
    const search = req.query.search;
    const boardId = req.query.boardId;
    const userId = req.query.userId;
    const LIMIT = 18;

    // Get LIMIT + 1 to check if there's a next page
    const pins = await Pin.find(
      search
        ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { tags: { $in: [search] } },
          ],
        } : userId ? { user: userId } : boardId ? { board: boardId } : {}
    )

      .sort({ createdAt: -1 }) // optional: newest first
      .skip(pageNumber * LIMIT)
      .limit(LIMIT + 1);

    const hasNextPage = pins.length > LIMIT;

    if (hasNextPage) {
      pins.pop(); // remove extra pin used for checking
    }

    res.status(200).json({
      pins,
      nextCursor: hasNextPage ? pageNumber + 1 : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getPin = async (req, res) => {
  try {
    const { id } = req.params;
    const pin = await Pin.findById(id).populate("user", "userName displayName img");

    if (!pin) return res.status(404).json({ message: "Pin not found" });

    res.status(200).json(pin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createPin = async (req, res) => {
  const { title, description, link, board, tags } = req.body;

  const media = req.files.media;

  if (!title, !description, !media) {
    return res.status(400).json({ message: "All fiends are required!" })
  }
  const imageKitInstance = new imagekit({
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY,
    urlEndpoint: process.env.IK_URL_ENDPOINT,
  });

  imageKitInstance.upload({
    file: media.data,
    fileName: media.name,
    folder: "pins",
  }).then(async (response) => {
    const newPin = await Pin.create({
      user: req.userId,
      title,
      description,
      link: link || null,
      board: board && mongoose.Types.ObjectId.isValid(board) ? board : null,
      tags: tags ? tags.split("#").map(tag => tag.trim()) : [],
      media: response.filePath,
      width: response.width,
      height: response.height,
    });
    return res.status(201).json(newPin)
  }).catch(err => {
    console.log(err);
    return res.status(500).json(err)
  })

}

export const interactionCheck = async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;

  const likeCount = await Like.countDocuments({ pin: id })

  if (!token) {
    return res.status(200).json({ likeCount, isLiked: false, isSaved: false })
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(200).json({ likeCount, isLiked: false, isSaved: false })
    }
    req.userId = payload.userId;

    const isLiked = await Like.findOne({
      user: req.userId,
      pin: id,
    });

    const isSaved = await Save.findOne({
      user: req.userId,
      pin: id,
    });

    return res.status(200).json({ likeCount, isLiked: isLiked ? true : false, isSaved: isSaved ? true : false })
  })
}


export const interact = async (req, res) => {
  const { id } = req.params

  const { type } = req.body

  if (type === "like") {
    const isLike = await Like.findOne({
      pin: id,
      user: req.userId
    });

    if (isLike) {
      await Like.deleteOne({
        pin: id,
        user: req.userId
      })
    } else {
      await Like.create({
        pin: id,
        user: req.userId
      })
    }
  }

  else {
    const isSaved = await Save.findOne({
      pin: id,
      user: req.userId
    });

    if (isSaved) {
      await Save.deleteOne({
        pin: id,
        user: req.userId
      })
    } else {
      await Save.create({
        pin: id,
        user: req.userId
      })
    }
  }

  return res.status(201).json({message: "Successful "})
}


export const getSavedPins = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const saves = await Save.find({ user: userId });
    const pinIds = saves.map((save) => save.pin);

    const pins = await Pin.find({ _id: { $in: pinIds } }).sort({ createdAt: -1 });

    res.status(200).json({
      pins,
      nextCursor: null, // update later if pagination needed
    });
  } catch (err) {
    next(err);
  }
};
