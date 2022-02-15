const { ApolloServer, gql } = require('apollo-server');

console.log('1111 :>> ', 111122); // hk-log
const typeDefs = gql`
	type Query {
		hello: String
		books: [Book]
		book(id: String): Book
	}

	type Mutation {
		createBook(title: String, author: String): Book!
		clearBook: Boolean
	}

	type Book {
		id: String
		title: String
		author: String
	}
`;

const books = (() =>
	Array(5)
		.fill()
		.map((v, i) => ({
			id: '' + i,
			title: 'Title' + i,
			author: 'Author' + i,
		})))();

const resolvers = {
	Query: {
		hello: () => 'Hello graphQl',
		books: () => books,
		book: (parent, { id }) => books.find((v) => v.id === id),
	},
	Mutation: {
		createBook: (parent, args) => {
			const book = { ...args, id: books.length + 1 + '' };
			books.push(book);
			console.log('args :>> ', args); // hk-log
			return book;
		},
		clearBook: () => {
			books.length = 0;
			return true;
		},
	},
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`server listen at :>> ${url}`); // hk-log
});
