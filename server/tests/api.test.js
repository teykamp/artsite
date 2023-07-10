const request = require("supertest");
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const serverConfig = require('../serverConfig')


serverConfig.setIsProdServer(false);


console.log("Requiring index")
const app = require("../index");

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



    // beforeAll(() => {
    //     console.log("Before all");
    // });

    // afterAll(() => {
    //     console.log("After all")
    // });


    beforeAll(async () => {

        console.log("Setting up test database")

        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        await mongoose.connect(uri);

    });

    afterAll(async () => {
        // TODO: Need to close mongo!!!
        console.log("Cleaning up test database")
        //     await mongoose.connection.dropDatabase();
        //     await mongoose.connection.close();
        //     await mongod.stop();
    });


    test("Insert post", (done) => {
        request(app)
            .get("/posts")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((res) => {
                // console.log(res.body[0]._id);

                let count = res.body.length;
                // if (res.body.length != 0) throw new Error("Database should be empty");
                
                // Create an obj in db
                
                if (res.body.length != count + 1) throw new Error("Database should have an item in it");
                
                
                // if (res.body.length > 0 && res.body[0]._id != "64ab312b91c08d51fb737a42") throw new Error("missing data");

                // [{ "_id": "64ab312b91c08d51fb737a42", "title": "test", "body": "bodybody", "date": "2023-07-09T22:14:03.473Z", "images": [], "tagData": [], "interactions": { "likes": 0, "dislikes": 0, "comments": [], "_id": "64ab312b91c08d51fb737a41" }, "__v": 0 }]
                // res.body.data.length = 1;
                // res.body.data[0].email = "test@example.com";
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