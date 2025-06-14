import User from "../models/userModel.js";
import Follow from "../models/followModel.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken"


export const getUser = async (req, res) => {
  const { userName } = req.params;

  const user = await User.findOne({ userName });

  const { hashedPassword, ...detailsWithoutPassword } = user.toObject();

  const followerCount = await Follow.countDocuments({ following: user._id });
  const followingCount = await Follow.countDocuments({ follower: user._id });

  const token = req.cookies.token;

  if (!token) {
    res.status(200).json({
      ...detailsWithoutPassword,
      followerCount,
      followingCount,
      isFollowing: false,
    });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (!err) {
        const isExists = await Follow.exists({
          follower: payload.userId,
          following: user._id,
        });

        res.status(200).json({
          ...detailsWithoutPassword,
          followerCount,
          followingCount,
          isFollowing: isExists ? true : false,
        });
      }
    });
  }
};


// ----------------


export const registerUser = async (req, res) => {
  try {
    const { userName, displayName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newHashedPassword = await bycrypt.hash(password, 10);

    const user = await User.create({
      userName,
      displayName,
      email,
      hashedPassword: newHashedPassword
    })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    const userObj = user.toObject();
    const { hashedPassword, ...detailsWithoutPassword } = userObj;
    res.status(200).json(detailsWithoutPassword);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const isPasswordCorrect = await bycrypt.compare(password, user.hashedPassword)

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" })
    }


    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    const userObj = user.toObject();
    const { hashedPassword, ...detailsWithoutPassword } = userObj;
    res.status(200).json(detailsWithoutPassword);


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token")
  res.status(200).json({ message: "Logout successful" })
}



export const followUser = async (req, res) => {
  const { userName } = req.params;

  const user = await User.findOne({ userName: userName });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isFollowing = await Follow.exists({
    follower: req.userId,
    following: user._id,
  });

  if (isFollowing) {
    await Follow.deleteOne({ follower: req.userId, following: user._id });
  } else {
    await Follow.create({ follower: req.userId, following: user._id });
  }

  const followerCount = await Follow.countDocuments({ following: user._id });
  const followingCount = await Follow.countDocuments({ follower: user._id });

  res.status(200).json({
    message: "Success",
    isFollowing: !isFollowing,
    followerCount,
    followingCount,
  });
};
