const request = require("supertest");
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// const assert = require('assert');

const serverConfig = require('../serverConfig')


// Comment this out to run tests on production database (but don't do this)
serverConfig.setConnectFunction(connect_to_database_for_testing);


console.log("Requiring index")
const app = require("../index");

let count = -1;

function setCount(c) {
    count = c;
    console.log(`Setting count to ${c}`)
}

async function connect_to_database_for_testing(app, port) { 
    console.log("Setting up test database");
    
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    await mongoose.connect(uri);
}



describe("Test example", () => {
    // test("POST /send", (done) => {
    //   request(app)
    //     .post("/posts")
    //     .expect("Content-Type", /json/)
    //     .send({
    //       email: "francisco@example.com",
    //     })
    //     .expect(201)
    //     .expect((res) => {
    //       res.body.data.length = 2;
    //       res.body.data[0].email = "test@example.com";
    //       res.body.data[1].email = "francisco@example.com";
    //     })
    //     .end((err, res) => {
    //       if (err) return done(err);
    //       elementId = res.body.data[1].id;
    //       return done();
    //     });
    // });



    afterAll(async () => {
        // TODO: Need to close mongo!!!
        console.log("Cleaning up test database")
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongod.stop();
    });


    test("Insert post", (done) => {
        request(app)
            .get("/posts")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((res) => {
                console.log(res);
                setCount(res.body.length);
                console.log(count);
            })
            .end((err, res) => {
                if (err) return done(err);
            });
            
            
            newPost = {"title": "test", "body": "xxxxxxxx", "date": "2023-07-09T22:14:03.473Z", "images": [], "tagData": [], "interactions": { "likes": 0, "dislikes": 0, "comments": [] }, "__v": 0 }

            request(app)
                .post("/posts")
                .send(newPost)
                .expect("Content-Type", /json/)
                .expect(200)
                .expect((res) => {
                    // TODO: Check that the object comes back with ids that look ok
                })
                .end((err, res) => {
                    if (err) return done(err);
                });


            request(app)
                .get("/posts")
                .expect("Content-Type", /json/)
                .expect(200)
                .expect((res) => {
                    if (res.body.length != count + 1) throw new Error(`Did not add new item to database! (count = ${count}, res.body.length = ${res.body.length})`);
                })
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });     
    });


    //   test("PUT /update/:id", (done) => {
    //     request(app)
    //       .put(`/update/${elementId}`)
    //       .expect("Content-Type", /json/)
    //       .send({
    //         email: "mendes@example.com",
    //       })
    //       .expect(200)
    //       .expect((res) => {
    //         res.body.data.length = 2;
    //         res.body.data[0].email = "test@example.com";
    //         res.body.data[1].id = elementId;
    //         res.body.data[1].email = "mendes@example.com";
    //       })
    //       .end((err, res) => {
    //         if (err) return done(err);
    //         return done();
    //       });
    //   });

    //   test("DELETE /destroy/:id", (done) => {
    //     request(app)
    //       .delete(`/destroy/${elementId}`)
    //       .expect("Content-Type", /json/)
    //       .expect(200)
    //       .expect((res) => {
    //         res.body.data.length = 1;
    //         res.body.data[0].email = "test@example.com";
    //       })
    //       .end((err, res) => {
    //         if (err) return done(err);
    //         return done();
    //       });
    //   });
});