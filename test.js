const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');
chai.should();
chai.use(chaiHttp);

describe('Books', ()=>{
 
    var token;
    const user = {
        name: "pk",
        password: "pank7"
    }
     
        before(function(done){
            chai.request(app)
            .post('/auth')
            .send(user)
            .end((err, res)=>{
                if(err) throw err;
                res.should.have.status(200);
                token = res.text;
                console.log('access-token : ', token);
                done();
            });
        });     

        describe('get all books', ()=>{
          it('get /books', (done)=>{
              chai.request(app)
                 .get('/books')
                 .set('Authorization', 'Bearer ' + token)
                 .end((err, res)=>{
                     res.should.have.status(200);
                     res.body.should.be.a('array');
                     done();
                 });
          });
        });

        describe('get one books', ()=>{
            it('get book by id', (done)=>{
                chai.request(app)
                   .get('/books/' + "5f2454242e2f8326b0746856")
                   .set('Authorization', 'Bearer ' + token)
                   .end((err, res)=>{
                       res.should.have.status(200);
                       res.body.should.be.a('object');
                       done();
                   });
            });
          });
    
    
          describe('add book', ()=>{
              let book = {
                  "title": "Mind of mine",
                  "author": "Zayn malik"
              }
            it('add new book', (done)=>{
                chai.request(app)
                   .post('/books/')
                   .set('Authorization', 'Bearer ' + token)
                   .send(book)
                   .end((err, res)=>{
                       res.should.have.status(200);
                       res.body.should.be.a('object');
                       done();
                   });
            });
          });  
    
          
          describe('update book', ()=>{
            let data = {
                "title": "My secrets",
            }
          it('update a book', (done)=>{
              chai.request(app)
                 .put('/books/' + "5f2454242e2f8326b0746856")
                 .set('Authorization', 'Bearer ' + token)
                 .send(data)
                 .end((err, res)=>{
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                 });
          });
        });
    
    
        describe('delete books', ()=>{
            it('delete a book by id', (done)=>{
                chai.request(app)
                   .delete('/books/' + "5f28e6e379df9f31e8319ae2")
                   .set('Authorization', 'Bearer ' + token)
                   .end((err, res)=>{
                       res.should.have.status(200);
                       done();
                   });
            });
          });    
});