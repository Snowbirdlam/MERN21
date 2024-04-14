const { User } = require("../models");
const { signToken, verfiyToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (_, args, context) => {
      if (!context.user || !context.user._id) {
        throw new Error("User not authenticated or missing _id");
      }
      return await User.findById(context.user._id);
    },
  },
  Mutation: {
    signupUser: async (_, { name, username, email, password }) => {
      if (!name) {
        throw new Error("Variable $name is required");
      }
      const newUser = await User.create({
        name,
        username,
        email,
        password,
      });
      const token = signToken(newUser);
      console.log(newUser);
      return { user: newUser, token };
    },
    loginUser: async (_, { email, password }) => {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new Error("No such user found");
      }

      const validPassword = await existingUser.isCorrectPassword(password);
      if (!validPassword) {
        throw new Error("Invalid password");
      }
      const token = signToken(existingUser);
      console.log(existingUser);
      return { user: existingUser, token };
    },
    addBook: async (
      _,
      { title, description, authors, link, image, bookId },
      context
    ) => {
      try {
        if (!context.user || !context.user._id) {
          throw new Error("Missing");
        }
        if (!title || !authors || !description) {
          throw new Error("Missing required book information");
        }
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: {
                bookId,
                title,
                description,
                authors,
                link,
                image,
              },
            },
          },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error("Variable $name is required");
        }
        return updatedUser;
      } catch (err) {
        console.error(err);
      }
    },
    removeBook: async (_, args, context) => {
      if (!context.user || !context.user._id) {
        throw new Error("User not authenticated or missing _id");
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: args.bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("Variable $name is required");
      }
      return updatedUser;
    },
    // Add more resolver functions as needed
  },
};

module.exports = resolvers;
