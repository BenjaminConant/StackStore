'use strict';

angular.module('stackStoreApp')
    .factory('Cart', function(socket, User, $http, Auth, localStorageService) {

        var user;
        var cart = {
            ids: []
        };

        if (Auth.isLoggedIn()) {
            user = Auth.getCurrentUser();
        }
        else{
        	cart.ids = localStorageService.get('cart') ? localStorageService.get('cart') : [];
        }

        function getProductsFromCache(callback) {
        		console.log(cart.ids);
            $http.post('/api/products/cache', {
                    products: cart.ids
                })
                .success(function(products) {
	                	console.log(products);
                    callback(null, products);
                })
                .error(function(err) {
                    console.log(err);
                    callback(err);
                });
        }

        function get(callback) {
            if (Auth.isLoggedIn()) {
                user = Auth.getCurrentUser();
                $http.get('/api/users/' + user._id + '/populate')
                    .success(function(user) {
                        callback(null, user);
                    })
                    .error(function(err) {
                        console.log(err);
                        callback(err);
                    });
            } else {
                getProductsFromCache(function(err, products) {
                    if (err) console.log(err);
                    else {
                        callback(null, {
                            cart: products
                        });
                    }
                })
            }
        }

        // Public API here
        return {
            getProductsFromCache: getProductsFromCache,
            get: get,
            add: function(productId, callback) {
                if (Auth.isLoggedIn()) {
                    user = Auth.getCurrentUser();
                    $http.put('/api/users/' + user._id + '/cart', {
                            _id: productId
                        })
                        .success(function(user) {
                            get(function(err,user){
                            	callback(err, user);
                            });
                        })
                        .error(function(err) {
                            console.log(err);
                            callback(err);
                        });
                } else {
                    console.log(cart.ids);
                    cart.ids.push(productId);
                    localStorageService.set('cart', cart.ids);
                    get(function(err,data){
                    	callback(err,data);
                    });
                }
            },
            update: function() {
                return true;
            },
            delete: function() {
                return true;
            }
        };
    });
