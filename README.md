## Node File Upload

Simple Node File Upload with Docker Setup

To upload the file:

```
const formData = new FormData()
formData.append('userFile', file)

try {
    const { data } = await axios.post(
      `http://192.168.0.8:2000/upload`,
      formData
    )

    return `http://192.168.0.8:2000${data.url}`
  } catch (error) {
    console.log(error)
  }

```

### Docker installation - recomended for production

#### For new instance

```
git clone <repository link>
cd npt-upload
docker-compose up --build -d
```

#### For existing instance

```
cd npt-upload
git pull
docker-compose up --build -d
```

### Restart Docker Container

```
docker-compose down
docker-compose up -d
```

## Standard installation - recommended for development

### Install Dependencies

```
git clone <repository link>
cd npt-upload
npm install
```

### Env Variables - recommended for development

Create a .env file in root folder and add the following

```
NODE_PORT = 2000
NODE_ENV = development
FILE_AGE = 1
DELETE_FILES_INTERVAL = 10000
```

### Run

Please run all commands from application root directory

```
npm run server

```

### Main Dependencies

HTTP Server - [express](https://expressjs.com/)  
Extension for file upload - [express-fileupload](https://www.npmjs.com/package/express-fileupload)  
Library for removing files - [find-remove](https://www.npmjs.com/package/find-remove)
