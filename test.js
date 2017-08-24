const request = require('supertest');
const assert = require('assert');
const application = require('./server.js');

describe("GET /api/customer/items", function () {
     it("should return successfully", function (done) {
          request(application)
               .get("/api/customer/items")
               .expect(200)
               .expect("Content-Type", "application/json; charset=utf-8")
               .end(done);
     })
});

describe("GET /api/vendor/purchases", function () {
     it("should list vendor purchases", function(done) {
          request(application)
               .get("/api/vendor/purchases")
               .expect(200)
               .expect("Content-Type", "application/json; charset=utf-8")
               .end(done);
     })
});

describe("GET /api/vendor/money", function () {
    it("should return vendor's money amount", function (done) {
        request(application)
            .get("/api/vendor/money")
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .end(done);
    })
});

describe("POST /api/vendor/items", function () {
    it("should return successfully", function (done) {
        request(application)
            .post("/api/vendor/items")
            .expect(200)
            .send({description : "food",
                cost : 50,
                quantity : 4})
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    }),
    it("should return unsuccessfully", function (done) {
        request(application)
            .post("/api/vendor/items")
            .expect(200)
            .send({
                cost : 50,
                quantity : 4})
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })
});

describe("PUT /api/vendor/items", function () {
    it("should return successfully", function (done) {
        request(application)
            .put("/api/vendor/items/1")
            .expect(200)
            .send({description : "chips of type plain",
                cost : 50,
                quantity : 4})
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    }),
    it("should return unsuccessfully", function (done) {
        request(application)
            .put("/api/vendor/items/1")
            .expect(200)
            .send({
                cost : 50,
                quantity : 4})
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })
});



describe("POST /api/customer/items/:itemId/purchases", function () {
    it("should return unsuccessfully, not available", function (done) {
        request(application)
            .post("/api/customer/items/11/purchases")
            .expect(200)
            .send({moneyReceived: 200})
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    }),
    it("should return unsuccessfully, not enough money", function (done) {
        request(application)
            .post("/api/customer/items/2/purchases")
            .expect(200)
            .send({moneyReceived: 10})
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })
    it("should return successfully, no change", function (done) {
        request(application)
            .post("/api/customer/items/4/purchases")
            .expect(200)
            .send({moneyReceived: 50})
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })
    it("should return successfully, with change", function (done) {
        request(application)
            .post("/api/customer/items/5/purchases")
            .expect(200)
            .send({moneyReceived : 100})
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })
    it("should return unsuccessfully, route doesnt exist", function (done) {
        request(application)
            .post("/api/customer/items/27/purchases")
            .expect(200)
            .send({moneyReceived: 200})
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })
});
