const express = require('express');
const bodyParser = require('body-parser');
const data = require('./data.json');
const fs = require('file-system');
const moment = require('moment');
moment().format();

const application = express();
application.use(bodyParser.urlencoded({extended: true }));
application.use(bodyParser.json());

application.get('/api/customer/items', function (request, response) {
     return response.json(data.items);
});

application.get('/api/vendor/purchases', function ( request, response) {
     return response.json(data.purchases);
});

application.get('/api/vendor/money', function ( request, response) {
     return response.status(200).json(data.money);
});

application.post('/api/customer/items/:itemId/purchases', ( request, response) => {
     var itemId = parseInt(request.params.itemId);
     var moneyReceived = parseInt(request.body.moneyReceived);
     var item = data.items.find( q => q.id === itemId);
     if(!item){
          var modelStatus = {
               status: "fail",
               data: "Item does not exist"
          }
          return response.status(200).json(modelStatus);
     }
     else if(item && item.quantity > 0) {
          if(moneyReceived < item.cost) {
               var modelState = {
                    status: "fail",
                    data: item.cost + " too much " + moneyReceived
               }
               return response.status(200).json(modelState);
          }
          else if(moneyReceived === item.cost) {
               item.quantity -= 1;
               var purchase = {
                    item_purchased: item.description,
                    price: item.cost,
                    date: ("dddd, MMMMM Do YYY, h:mm a")
               }
               data.purchases.push(purchase);
               data.money += item.cost;

               var modelState = {
                    status: "success",
                    data: "collect your " + item.description + " from the bin!"
               }
               var itemsJSON = JSON.stringify(data);
               fs.writeFile('./data.json', itemsJSON, function(err) { });
               return response.status(200).json(modelState);
          } else if( moneyReceived > item.cost) {
               var change = moneyReceived - item.cost;
               item.quantity -= 1;

               var purchase = {
                    item_purchased: item.description,
                    price: item.cost,
                    date: moment().format("dddd, MMM Do YYYY, h:mm a")
               }
               data.purchases.push(purchase);
               data.money += item.cost;

               var modelState = {
                    status: "success",
                    data: "collect your " + item.description + " from the bin. Your change is " + change
               }

               var itemsJSON = JSON.stringify(data);
               fs.writeFile('./data.json', itemsJSON, function (err) { });
               return response.status(200).json(modelState);
          }
     } else {
          var modelState = {
               status: "fail",
               data: "Item is unavailable"
          }
          return response.status(200).json(modelState);
     }
});

application.post('/api/vendor/items', ( request, response) => {
     var description = request.body.description;
     var cost = request.body.cost;
     var quantity = request.body.quantity;
     var newItem = {
          description: description,
          cost: cost,
          quantity: quantity,
          id: data.items.length + 1
     }

     if (description && cost && quantity) {
          var addItem = data.items.push(newItem);
          var modelState = {
               status: "success",
               data: addItem
          }
          var itemsJSON = JSON.stringify(data);
          fs.writeFile('./data.json', itemsJSON, function (err) { });
          return response.status(200).json(modelState);
     } else {
          var modelState = {
               status: "fail",
               data: newItem
          }
          return response.json(modelState);
     }
});

application.put('/api/vendor/items/:itemId', ( request, response) => {
     var itemId = request.body.id;
     var description = request.body.description;
     var cost = request.body.cost;
     var quantity = request.body.quantity;
     var updatedItem = {
          description: description,
          cost: cost,
          quantity: quantity,
          id: itemId
     }
     var item = data.items.find(q => q.id === itemId);
     if (item && description && cost && quantity) {
          var updatedItem = data.items.splice(data.items[item], 1, updatedItem);
          response.json(modelState);
     } else {
          var modelState = {
               status: "fail",
               data: updatedItem
          }
          response.json(modelState);
     }
});

application.listen(3000);

module.exports = application;
