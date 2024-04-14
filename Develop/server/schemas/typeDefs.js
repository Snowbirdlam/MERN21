const { gql } = require("apollo-server-express");

const typeDefs = `
type Book {
    bookId: ID!
    authors: [String!]!
    title: String!
    description: String!
    link: String!
    image: String
}
type User {
 id: ID!
 username: String!
 email: String!   
 password: String!
 savedBooks: [Book!]!
}
type Auth {
    token: ID!
    user: User!
}
type Query {
    me: User
}
type Mutation {
    signupUser(name: String!, username: String!, email: String!, password: String!): Auth
    loginUser(email: String!, password: String!): Auth
    addBook(bookId: String!, title: String!, description: String, authors:[String!], link: String!, image: String): User
    removeBook(bookId: String!): User
}
`;

module.exports = typeDefs;
