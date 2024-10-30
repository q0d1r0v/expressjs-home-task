const express = require("express");
const fs = require("fs");
const server = express();

server.use(express.json());

const readBooks = () => {
  try {
    const data = fs.readFileSync("./database/books.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeBooks = (books) => {
  fs.writeFileSync("./database/books.json", JSON.stringify(books, null, 2));
};

server.get("/books", (req, res) => {
  const books = readBooks();
  res.json(books);
});

server.get("/books/:id", (req, res) => {
  const books = readBooks();
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Ma'lumot topilmadi" });
  }
});

server.post("/books", (req, res) => {
  const { title, author } = req.body;
  const books = readBooks();

  const existingBook = books.find((b) => b.title === title);
  if (existingBook) {
    return res.status(400).json({ message: "Bu kitob bazada mavjud" });
  }

  const newBook = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
    title,
    author,
  };

  books.push(newBook);
  writeBooks(books);
  res.status(201).json(newBook);
});

server.put("/books/:id", (req, res) => {
  const { title, author } = req.body;
  const books = readBooks();
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));

  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], title, author };
    writeBooks(books);
    res.json(books[bookIndex]);
  } else {
    res.status(404).json({ message: "Ma'lumot topilmadi" });
  }
});

server.delete("/books/:id", (req, res) => {
  const books = readBooks();
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));

  if (bookIndex !== -1) {
    const deletedBook = books.splice(bookIndex, 1);
    writeBooks(books);
    res.json(deletedBook);
  } else {
    res.status(404).json({ message: "Ma'lumot topilmadi" });
  }
});

const port = 3001;
server.listen(port, () => {
  console.log("Server is running on port " + port);
});
