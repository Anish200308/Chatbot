import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Gemini SDK import

// Assuming you have a config to store the API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Function to generate a chat completion using Gemini
export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    // Grab user's chat history
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    }));

    // Add the new message from the user
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" }); // Ensure this works with Mongoose

    // Prepare the prompt for the Gemini API (formatting chats into the required format)
    const prompt = chats.map(({ content }) => content).join("\n");

    // Send the prompt to Gemini API
    let chatResponse;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);

      // Assuming the response comes in a format similar to OpenAI
      chatResponse = result.response.text(); // Extract the response text
    } catch (apiError) {
      console.log("Gemini API error:", apiError.response?.data || apiError.message);
      return res.status(500).json({ message: "Error generating chat completion" });
    }

    // Add the response to the user's chat history
    user.chats.push({ content: chatResponse, role: "assistant" });
    await user.save();

    // Return the updated chat history
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Function to send chats to the user
export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// Function to delete all chats for a user
export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    // Clear the chat history using Mongoose's array manipulation methods
    user.chats.splice(0); // This will clear the array but maintain its Mongoose structure
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};
