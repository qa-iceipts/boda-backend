BODA-DROP-BACKEND
//SETUP GUIDE for boda-drop-api

Prerequisites softwares : Node LTS version, npm , MySql Workbench, git , postman

=> clone repo and run  => git checkout development 
=> if you have downloaded the code from git repositery so node_modules folder is missing
	you have to delete package-lock.json file and run first 

	==>npm install

=> Then total 3 .env environment files are required contact me for that i will share u in all 3 servers kindly copy paste it first,this are our credentials so not uploaded on git , 
	only on servers
	
=> ENTER your database local credentials in .env files for 3 server and set first NODE_ENV variable to desired Environment development,production or test
=> Start Command execute inside server directory one by one on 3 servers
		
		=> npm start 
 		or you can use also => node app

=> if all goes right Check in MySQL workbench database and tables will be created automatically.

if YES time to insert our user roles,vehicles predefined data stop the API_SERVER AND RUN BELOW COMMANDS,

1.run => 
    npm install sequelize-cli -g
2.run => 
    npx sequelize-cli db:seed:all 
    or => 
    sequelize-cli db:seed:all

if there are no errors all servers are started at respective ports you can login signup  and access all the apis from postman

=> API - SERVER (PORT = 8080)
	
	- BaseURL = http://localhost:8080/
	- API URL =  http://localhost:8080/api
	- HealthURL = http://localhost:8080/api/health

=> DNS - SERVER (PORT = 4200)
	
	- BaseURL = http://localhost:4200)/
	- API URL =  http://localhost:4200)/dns
	- HealthURL = http://localhost:4200)/dns/health

=> LOCATION - SERVER (PORT = 4000)
	
	- BaseURL = http://localhost:4000)/
	- API URL =  http://localhost:4000)/location
	- HealthURL = http://localhost:4000)/location/health
  
