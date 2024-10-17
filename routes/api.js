/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';


const connect_db = require('../connection.js')
const book = require('../book_schema')


 
module.exports = function (app) {
  
connect_db()//////////connect to database
  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
     ///////////////////////////////////////////
    try {
        const data = await book.find({}); // retrieve all book (promise)
        console.log(data)
        if (!data) {
            return res.status(404).json([]); // 404 if not found
        } else { // else if found
          res.json(data); // Return the book
        }
        
    } catch (error) {
        console.error("Error retrieving book:", error.message);
        res.json({ message: 'Internal Server Error' }); // Handle errors
    }
    })
    
    .post((req, res) =>{
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (title) {
        const new_book = new book({title: title})
        new_book.save().then(data => {
          console.log("New book saved")
          return res.status(200).json({_id: data._id, title: data.title})
        }).catch(err => {
          console.error("Error saving book:")
          return res.status(500)
        })

      } else {
        res.send('missing required field title')
      }

    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      book.deleteMany({}).then(() => res.status(200).send('complete delete successful')).catch(err => {
        console.error("error in deleting:")
        return res.status(500) // internal error
      })
      /////////////////////////////////
    });



  app.route('/api/books/:id')
       .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      book.findById(bookid, (err, data) => {
        if (!data) {
           return res.send("no book exists");
        } else {
          res.json({
            comments: data.comments,
            _id: data._id,
            title: data.title,
            commentcount: data.comments.length,
          });
        }
      });
    })


  .post((req, res) => {
    const bookid = req.params.id;
    const comment = req.body.comment;

    // Check if book ID or comment is missing
    if (!bookid || !comment) {
      return res.send('missing required field comment'); // 400 Bad Request
    }

    // Find the book by its ID
    book.findById(bookid, (err, data) => {
      if (err) {
        console.error("Error retrieving data:", err.message);
        return res.send("no book exists"); // 500 Internal Server Error
      }

      // If no book is found
      if (!data) {
        console.log("Book doesn't exist");
        return res.send('no book exists'); // 404 Not Found
      }

      // Add the new comment to the book's comments array
      data.comments.push(comment);
      data.commentcount = data.comments.length; // Update comment count
      data.__v = data.commentcount;

      // Save the updated book document
      data.save()
        .then(updatedBook => {
          console.log("Updated successfully");
          const { comments, _id, title, commentcount } = updatedBook;
          return res.json({ comments, _id, title, commentcount }); 
        })
        .catch(saveErr => {
          console.error("Error saving updated data:", saveErr.message);
          return res.send('No book exists'); 
        });
    });
  })

    
  
  .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      book.findByIdAndDelete(bookid).then((deleted) => {
        console.log(deleted)
        if (deleted) {
           return res.send("delete successful")
        } else {
          return res.send("no book exists") 
        }
      }).catch(err => {console.log("Error")
      return res.send("no book exists")
    })
      })

    
  
};
