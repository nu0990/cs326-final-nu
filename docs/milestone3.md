# DataBase document
* node

| Column  | Datatype  | Description  |
|---|---|---|
| node id  | string  | id of the node  |
| info  | json  | information for node such as ip addr,port number and password |
| uid  | string  | id of user who posted the node  |
| name | string  | location of node ip  |
| description | string  | include url and additional info |

* user_table

| column  | Datatype  | Description  |
|---|---|---|
| salt | string  |random string for password protection|
| email | string  | user's email address  |
| name  | string  | user name  |
| password | string  | password of user  |

* comment

| column  | Datatype  | Description  |
|---|---|---|
| comment_id | string  | number id of comment  |
| text  | string  | content of comment  |
| node_id  | string  | id of node that has this comment  |
| uid | string  | id of user who posted this comment  |
| create_date | string  | create date of this comment  |

# Labor division
* Sihan Cheng：
* Yidan Gong:Backend implementation in app.js,db_func.js and index.js. Homepage and profile rendering update.
* Haoyu Guan:Login, profile page front-end and back-end js integration and docking, testing, debugging, meeting arrangement

