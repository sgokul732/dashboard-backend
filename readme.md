

Prerequisites:
a. Nodejs installed on your local machine - https://nodejs.org/
b. MongoDB installed on your local machine - https://www.mongodb.com

1. Install packages "csvtojson" and "mongodb" using the following command:
    $ npm install --save express mongodb fast-csv multer

2. Run the index.js file using the following command:
    $ node index.js

3. Let's use Postman to make an HTTP POST request with a CSV file
    - Use `file` key in Body -> form-data

4. Select employees.csv file in postman and Send request in postman

5. After CSV file upload successfully, we see succsess message in API response

6. Retrieve employees data from the database using GET API
    - http://localhost:5000/api/
