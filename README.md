# RE-CrankCase-Pairing
To pair and page crank cases.

This is a web app developed for a a manufacturing company.
Node Express is used to create the web server.

Mongo is used as the database.

Front end is developed using jQuery Mobile (this is to ensure that web app is accessible from all contemporary browsers, including mobile phone browsers.

Process to run the app
1. Clone the repository.

2. cd cc-pairing

3. run the "npm install"

4. rename the file "config/config - Copy.json" to "config/config.json"

5. edit config.json to have the mongodb uri, server port and server ip.
		if mongodb uri is not specified the following uri will be used "mongodb://localhost:27017/recrankcasedb".
		if server port is not specified, 8080 is used as the port.
		if server ip is not specified "localhost" is used as the ip.
		
6. ensure mongod is running.

7. run "npm run-script populateDb"
		this will populate the database with an admin user (user name : admin, password : admin).
		it will also add a regular user (user name : user1, password : user1).
		
8. run "npm start"

9. open the browser and connect to the server using the server ip and port. 

