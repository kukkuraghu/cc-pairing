start  start_db.bat
set NODE_ENV=development
set debug=example-server
REM
REM database server ip and port. Also the database name
set db_ip=192.168.56.1
set db_Port=27017
set db_name=recrankcasedb
REM
REM set the web server ip and port
REM set server_ip=127.0.0.1
set server_ip=192.168.56.1
set server_port=8080
REM
REM provide the transmitter ip address, port and capcode
set transmitter_ip=192.168.1.37
set transmitter_port=30090
set transmitter_capCode=039
node bin/www