import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


declare var window : any;
@Injectable()
export class SqliteProvider {

  public text : string = "";
  public db = null;
  public arr = [];
  public arr1 = [];
  public arr2 = [];
  public arrFav = [];
  public arrBrr = [];
  public arrLend = [];
  public arrLastId = [];
  public arrDel = [];
  public arrSearchMainCat = [];
  public arrRemoveSC = [];
  public arrCount = [];
  public arrIsbn = [];
  public arrBkmrk = [];
  public arrRding = [];
  public arrBg = [];
  constructor() {}
  lastId : any;
 /**
  * 
  * Open The Datebase
  */
  openDb() {
    this.db = window
      .sqlitePlugin
      .openDatabase({name: 'lib.db', location: 'default'});
    this
      .db
      .transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS bCat (id integer primary key,bCatName text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (uId integer primary key,username text,password text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS subCat (subId integer primary key,mainCatId integer,sCatName text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS books (bId integer primary key,bName text,description text,catId text,subCatId integer,currPosition text,fav integer,borrowed integer,qty integer,delStatus integer, isbn integer, specs integer, specsDetail text, rding integer)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS borrowedBook (bBookId integer primary key,bId integer, owner text, tp integer, rDate text, borrDate text, borrTime text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS lendBooks (lBId integer primary key, bId integer, lenderName text, lTp integer, lRDate text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS bgImg (imgId integer DEFAULT 1,bgImage text NOT NULL DEFAULT " ")');


      }, (e) => {
        console.log('Transtion Error', e);
      }, () => {
        console.log('Populated Datebase OK..');
      })
  }
  /**
   * 
   * @param addItem for adding: function
   */
  addItem(i) {
  console.log(i);
    return new Promise(resolve => {
      var InsertQuery = "INSERT INTO bCat (bCatName) VALUES (?)";
      this
        .db
        .executeSql(InsertQuery, [i], (r) => {
          console.log('Inserted... Sucess..', i);
          this
            .getRows()
            .then(s => {
              resolve(true)
            });
        }, e => {
          console.log('Inserted Error', e);
          resolve(false);
        })
    })
  }

  //Refresh everytime

  getRows() {


    return new Promise(res => {
      this.arr = [];
      let query = "SELECT * FROM bCat";
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arr
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })

  }
  //to delete any Item
  del(id) {
    return new Promise(resolve => {
      var query = "DELETE FROM bCat WHERE id=?";
      this
        .db
        .executeSql(query, [id], (s) => {
          console.log('Delete Success...', s);
          this
            .getRows()
            .then(s => {
              resolve(true);
            });
        }, (err) => {
          console.log('Deleting Error', err);
        });
    })

  }
  //to Update any Item
  update(id, txt) {
    return new Promise(res => {
      var query = "UPDATE bCat SET bCatName=?  WHERE id=?";
      this
        .db
        .executeSql(query, [
          txt, id
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getRows()
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

  }

  searchByName(txt){

    return new Promise(res => {
      this.arr = [];
      let query = "SELECT bCatName FROM bCat WHERE bCatName LIKE ?";
      this
        .db
        .executeSql(query, [ "%" +txt+ "%"], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arr
                .push(item);
                console.log(item);
            }
          }
          res(true);

          console.log('Success');

        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })
  }
  //*************************************find book****************************************************

  searchBookMainCat(txt, mainCatId){

    return new Promise(res => {
      this.arrSearchMainCat = [];
      let query = "SELECT * FROM books LEFT JOIN lendBooks USING(bId) WHERE catId = ? AND delStatus = '0' AND bName LIKE ?";
      this
        .db
        .executeSql(query, [mainCatId, "%" +txt+ "%"], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arrSearchMainCat
                .push(item);
                console.log(item);
            }
          }
          res(true);

          console.log('Success');

        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })
  }

  //**************************************************************************************************

  // Sub cat queris ***********************************************************************************

    addSubCat(sCatName, mainCatId) {
    console.log("aa",sCatName, mainCatId);
    return new Promise(resolve => {
      var InsertQuery = "INSERT INTO subCat (sCatName, mainCatId) VALUES (?, ?)";
      this
        .db
        .executeSql(InsertQuery, [sCatName, mainCatId], (r) => {
          console.log('Inserted... Sucess..', sCatName, mainCatId);
          this
            .getSubCat(mainCatId)
            .then(s => {
              resolve(true)
            });
        }, e => {
          console.log('Inserted Error', e);
          resolve(false);
        })
    })
  }

    getSubCat(mCatId) {

    return new Promise(res => {
      this.arr = [];
      let query = "SELECT * FROM subCat WHERE mainCatId=?";
      this
        .db
        .executeSql(query, [mCatId], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arr
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
      })
	}

	updateSubCatName(subCatName, subId, mCatId) {
    return new Promise(res => {
      var query = "UPDATE subCat SET sCatName=?  WHERE subId=?";
      this
        .db
        .executeSql(query, [
          subCatName, subId
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getSubCat(mCatId)
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })
 }

// Removing sub cat******************************************************************************************

getSubCatBooks(subCat){
	
	return new Promise(res => {
      this.arrRemoveSC = [];
      let query = "SELECT * FROM books WHERE subCatId = ?";
      
      this
        .db
        .executeSql(query, [subCat], rs => {

          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arrRemoveSC
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })

}

updateSubCatToNull(bId, catId, sCatId) {

    return new Promise(res => {
      var query = "UPDATE books SET subCatId=105500  WHERE bId=?";
      this
        .db
        .executeSql(query, [
          bId
        ], (s) => {
          console.log('Update Success...', s);
          
        }, (err) => {
          console.log('Updating Error', err);
        });
    })
 }


removeSubCat(catId, subId) {
    return new Promise(resolve => {
      var query = "DELETE FROM subCat WHERE subId=?";
      this
        .db
        .executeSql(query, [subId], (s) => {
          console.log('Delete Success...', s);
          this
            .getSubCat(catId)
            .then(s => {
              resolve(true);
            });        
        }, (err) => {
          console.log('Deleting Error', err);
        });
    })

  }

//Add book queries...****************************************************************************************

addBook(bName, description, catId, subCatId, currPosition, fav, borrowed, qty, delStatus, isbn) {
    //console.log("aa",sCatName, mainCatId);
    return new Promise(resolve => {
    
      var InsertQuery = "INSERT INTO books (bName, description, catId, subCatId, currPosition, fav, borrowed, qty, delStatus, isbn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      this
        .db
        .executeSql(InsertQuery, [bName, description, catId, subCatId, currPosition, fav, borrowed, qty, delStatus, isbn], (r) => {
          console.log('Inserted... Sucess..', bName, description, catId, subCatId, currPosition, fav, borrowed, qty, delStatus, isbn);

          
         /* this
            .getBookLastId()
            .then(s => {
              resolve(true);
            });*/

        }, e => {
          console.log('Inserted Error', e);
          resolve(false);
        })
    })

  }

addBorrowedBook(bId, owner, tp, rDate, borrDate, borrTime) {
    
    return new Promise(resolve => {
      var InsertQuery = "INSERT INTO borrowedBook (bId, owner, tp, rDate, borrDate, borrTime) VALUES (?, ?, ?, ?, ?, ?)";
      this
        .db
        .executeSql(InsertQuery, [ bId, owner, tp, rDate, borrDate, borrTime], (r) => {
          console.log('Inserted... Sucess..', this.lastId, owner, tp, rDate, borrDate, borrTime);

          var lastId1 = r.insertId;
          console.log('inserted id on sqlite borrowed',lastId1 );
          
        }, e => {
          console.log('Inserted Error', e);
          resolve(false);
        })
    })
  }

getBooks(catId, subCatId) { 

    if (subCatId == 105500){
    		console.log('woo null',subCatId);
    	return new Promise(res => {
      	this.arr1 = [];
      	let query = "SELECT * FROM books LEFT JOIN lendBooks USING(bId) WHERE catId = ? AND delStatus = '0' AND subCatId = 105500";
      
      	this
        	.db
        	.executeSql(query, [catId], rs => {
	          if (rs.rows.length > 0) {
	            for (var i = 0; i < rs.rows.length; i++) {
	              var item = rs
	                .rows
	                .item(i);
	              this
	                .arr1
	                .push(item);
	            }
	          }
	          res(true);
	        }, (e) => {
	          console.log('Sql Query Error', e);
	        });
	    })

    }
    else{
console.log('doo not null',subCatId);
    	return new Promise(res => {
      	this.arr1 = [];
      	let query = "SELECT * FROM books LEFT JOIN lendBooks USING(bId) WHERE catId = ? AND delStatus = '0' AND subCatId =?";
      
      	this
        	.db
        	.executeSql(query, [catId, subCatId], rs => {
	          if (rs.rows.length > 0) {
	            for (var i = 0; i < rs.rows.length; i++) {
	              var item = rs
	                .rows
	                .item(i);
	              this
	                .arr1
	                .push(item);
	            }
	          }
	          res(true);
	        }, (e) => {
	          console.log('Sql Query Error', e);
	        });
	    })

    }
  }

  deleteBook(bid, catId, subCatId) {
    return new Promise(res => {
      var query = "UPDATE books SET delStatus='1' WHERE bId=?";
      this
        .db
        .executeSql(query, [
          bid
        ], (s) => {
          console.log('Delete book Success...', s);
          this
            .getBooks(catId,subCatId)
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Delete book Error', err);
        });
    })

  }

  updateFav(val, bid, catId, subCatId) {
    return new Promise(res => {
      var query = "UPDATE books SET fav=?  WHERE bId=?";
      this
        .db
        .executeSql(query, [
          val, bid
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getBooks(catId, subCatId)
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

  }

  getBookLastId() {

    return new Promise(res => {
      this.arrLastId = [];
      let query = "SELECT * FROM books ORDER BY bId DESC LIMIT 1";
      
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arrLastId
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })
  }

getIsbn(){
  return new Promise(res => {
      	this.arrIsbn = [];
      	let query = "SELECT isbn FROM books";
      
      	this
        	.db
        	.executeSql(query, [], rs => {
	          if (rs.rows.length > 0) {
	            for (var i = 0; i < rs.rows.length; i++) {
	              var item = rs
	                .rows
	                .item(i);
	              this
	                .arrIsbn
	                .push(item);
	            }
	          }
	          res(true);
	        }, (e) => {
	          console.log('Sql Query Error', e);
	        });
	    })
	}


//Lend book queries...****************************************************************************************

addLendedBook(bId, lenderName, lTp, lRDate, catId) {
    //console.log("aa",sCatName, mainCatId);
    return new Promise(resolve => {
      var InsertQuery = "INSERT INTO lendBooks (bId, lenderName, lTp, lRDate) VALUES (?, ?, ?, ?)";
      this
        .db
        .executeSql(InsertQuery, [bId, lenderName, lTp, lRDate], (r) => {
          console.log('Inserted... Sucess..', bId, lenderName, lTp, lRDate);
          
           
        }, e => {
          console.log('Inserted Error', e);
          resolve(false);
        })
    })
  }

  updateLendBookStatus(lendStatus, bId, catId) {
    return new Promise(res => {
      var query = "UPDATE books SET currPosition=?  WHERE bId=?";
      this
        .db
        .executeSql(query, [
          lendStatus, bId
        ], (s) => {
          console.log('Update Success...', s);
          
            
          
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

  }

  removeLendedBook(bId, catId) {
    return new Promise(resolve => {
      var query = "DELETE FROM lendBooks WHERE bId=?";
      this
        .db
        .executeSql(query, [bId], (s) => {
          console.log('Delete Success...', s);
          
            
         
        }, (err) => {
          console.log('Deleting Error', err);
        });
    })

  }

//***************************************** Book control **************************************************

updateBookName(bName, bid, catId, subCatId) {
    return new Promise(res => {
      var query = "UPDATE books SET bName=?  WHERE bId=?";
      this
        .db
        .executeSql(query, [
          bName, bid
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getBooks(catId, subCatId)
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

}

updateBookDescription(bDes, bid, catId, subCatId) {
    return new Promise(res => {
      var query = "UPDATE books SET description=?  WHERE bId=?";
      this
        .db
        .executeSql(query, [
          bDes, bid
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getBooks(catId, subCatId)
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

}

getAllFavoriteBooks() {

    return new Promise(res => {
      this.arrFav = [];
      let query = "SELECT * FROM books WHERE fav = '1'";
      
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arrFav
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })

  }

  updateFavAlll(val, bid) {
    return new Promise(res => {
      var query = "UPDATE books SET fav=?  WHERE bId=?";
      this
        .db
        .executeSql(query, [
          val, bid
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getAllFavoriteBooks()
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

  }

  getAllBorrowedBook(){

  	return new Promise(res => {
      this.arrBrr = [];
      let query = "SELECT * FROM books LEFT JOIN borrowedBook USING(bId) WHERE books.borrowed = '1'";
      
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arrBrr
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })

  }

  deleteBrrBFromBook(bid) {
    return new Promise(res => {
      var query = "DELETE FROM books WHERE bId=?";
      this
        .db
        .executeSql(query, [
          bid
        ], (s) => {
          console.log('Update Success...', s);
         /* this
            .getAllBorrowedBook()
            .then(s => {
              res(true);
            });*/
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

  }

  delBorrowedBookc(id) {
    return new Promise(resolve => {
      var query = "DELETE FROM borrowedBook WHERE bId=?";
      this
        .db
        .executeSql(query, [id], (s) => {
          console.log('Delete Success...', s);
          this
            .getAllBorrowedBook()
            .then(s => {
              resolve(true);
            });
        }, (err) => {
          console.log('Deleting Error', err);
        });
    })

  }

  getBooksAllLend() {

    return new Promise(res => {
      this.arrLend = [];
      let query = "SELECT * FROM books LEFT JOIN lendBooks USING(bId) WHERE books.currPosition = 'lended'";
      
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arrLend
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })
  }

  updateLendToInhand(bid) {
    return new Promise(res => {
      var query = "UPDATE books SET currPosition='inHand' WHERE bId=?";
      this
        .db
        .executeSql(query, [
          bid
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getBooksAllLend()
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

  }

  delLendedBookc(id) {
    return new Promise(resolve => {
      var query = "DELETE FROM lendBooks WHERE bId=?";
      this
        .db
        .executeSql(query, [id], (s) => {
          console.log('Delete Success...', s);
          this
            .getAllBorrowedBook()
            .then(s => {
              resolve(true);
            });
        }, (err) => {
          console.log('Deleting Error', err);
        });
    })

  }

  getBooksAllDelete() {

    return new Promise(res => {
      this.arrDel = [];
      let query = "SELECT * FROM books LEFT JOIN lendBooks USING(bId) WHERE books.delStatus = '1'";
      
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arrDel
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })
  }

  restoreDelBook(bid) {
    return new Promise(res => {
      var query = "UPDATE books SET delStatus='0' WHERE bId=?";
      this
        .db
        .executeSql(query, [
          bid
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getBooksAllDelete()
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

  }

  delBookPermenant(id) {
    return new Promise(resolve => {
      var query = "DELETE FROM books WHERE bId=?";
      this
        .db
        .executeSql(query, [id], (s) => {
          console.log('Delete Success...', s);
          this
            .getBooksAllDelete()
            .then(s => {
              resolve(true);
            });
        }, (err) => {
          console.log('Deleting Error', err);
        });
    })

  }

  getBooksCount(subCatId) {
console.log('from sqlite',subCatId);
    return new Promise(res => {
      this.arrCount = [];

      let query = "SELECT COUNT(*) AS bb FROM books WHERE fav =1 AND subCatId = ?";
      /*let query = "SELECT fav,borrowed,COUNT(*) FROM books WHERE fav =1 OR borrowed = 1 AND subCatId = ? GROUP BY fav, borrowed";
      */
      this
        .db
        .executeSql(query, [subCatId], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arrCount
                .push(item);
            }
          }
          res(true);
          console.log('from sqlite',JSON.stringify(this.arrCount));
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })

  }


   addBookmark(specsDetail, bId, catId, subCatId){
      return new Promise(res => {
      var query = "UPDATE books SET specs=1, specsDetail=? WHERE bId=?";
      this
        .db
        .executeSql(query, [
          specsDetail, bId
        ], (s) => {
        console.log('Update Success add...', s);
         this
            .getBooks(catId,subCatId)
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })
   }

   removeBookmark(bId, catId, subCatId){
      return new Promise(res => {
      var query = "UPDATE books SET specs=0, specsDetail='' WHERE bId=?";
      this
        .db
        .executeSql(query, [
          bId
        ], (s) => {
          console.log('Update Success remove...', s);
          this
            .getBooks(catId,subCatId)
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })
   }

   getBooksAllBookmark() {

    return new Promise(res => {
      this.arrBkmrk = [];
      let query = "SELECT * FROM books LEFT JOIN lendBooks USING(bId) WHERE books.specs = '1'";
      
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arrBkmrk
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })
  }

  removeAllBookmark(bid) {
    return new Promise(res => {
      var query = "UPDATE books SET specs='0', specsDetail='' WHERE bId=?";
      this
        .db
        .executeSql(query, [
          bid
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getBooksAllBookmark()
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

  }


   addReading(bId, catId, subCatId){
      return new Promise(res => {
      var query = "UPDATE books SET rding=1 WHERE bId=?";
      this
        .db
        .executeSql(query, [
           bId
        ], (s) => {
        console.log('Update Success add...', s);
         this
            .getBooks(catId,subCatId)
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })
   }

   removeReading(bId, catId, subCatId){
      return new Promise(res => {
      var query = "UPDATE books SET rding=0 WHERE bId=?";
      this
        .db
        .executeSql(query, [
          bId
        ], (s) => {
          console.log('Update Success remove...', s);
          this
            .getBooks(catId,subCatId)
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })
   }

   getBooksAllReading() {

    return new Promise(res => {
      this.arrRding = [];
      let query = "SELECT * FROM books LEFT JOIN lendBooks USING(bId) WHERE books.rding = '1'";
      
      this
        .db
        .executeSql(query, [], rs => {
          if (rs.rows.length > 0) {
            for (var i = 0; i < rs.rows.length; i++) {
              var item = rs
                .rows
                .item(i);
              this
                .arrRding
                .push(item);
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })
  }

  removeAllReadings(bid) {
    return new Promise(res => {
      var query = "UPDATE books SET rding='0' WHERE bId=?";
      this
        .db
        .executeSql(query, [
          bid
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getBooksAllReading()
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })
  }

//************************************  bg  **************************************************************
 
  getBg() {
  
    return new Promise(res => {
      this.arrBg = [];
      let query = "SELECT bgImage FROM bgImg WHERE imgId=1";
      
      this
        .db
        .executeSql(query, [], rs => {

  
          if (rs.rows.length > 0) {
  
            for (var i = 0; i < rs.rows.length; i++) {
  
              var item = rs
                .rows
                .item(i);
              this
                .arrBg
                .push(item);
                
            }
          }
          res(true);
        }, (e) => {
          console.log('Sql Query Error', e);
        });
    })
  }

 setBg(img) {
 
    return new Promise(res => {
      var query = "UPDATE bgImg SET bgImage=? WHERE imgId=1";
      this
        .db
        .executeSql(query, [
          img
        ], (s) => {
          console.log('Update Success...', s);
          this
            .getBg()
            .then(s => {
              res(true);
            });
        }, (err) => {
          console.log('Updating Error', err);
        });
    })

  }
//**********************Only run once after installation*******************
  addBg() {
  
    return new Promise(resolve => {
      var InsertQuery = "INSERT INTO bgImg (bgImage,imgId) VALUES ('whiteBg.png',1)";
      this
        .db
        .executeSql(InsertQuery, [], (r) => {
          console.log('Inserted... Sucess..');
          //this
            //.getBg()
            //.then(s => {
            //  resolve(true)
            //});
        }, e => {
          console.log('Inserted Error', e);
          resolve(false);
        })
    })
  }
//********************************************************************************************************

}

