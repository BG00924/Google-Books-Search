const express = require('express');
const path = require('path');
// these shall be replaced 
// const db = require('./config/connection');
// const routes = require('./routes');

// import ApolloServer
const { ApolloServer } = require('apollo-server-express')
const { authMiddleware } = require('./utils/auth')

// import out typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas')
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// create a new apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})

// integrate our apollo server with the express application as middleware
server.applyMiddleware({ app })

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

// old restful api routes
// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`)
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  });
});
