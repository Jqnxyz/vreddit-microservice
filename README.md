# vreddit-microservice

  *[Live Example](http://vreddit.zlux.us/)*
  
vreddit-microservice is a website built on NodeJS to offer a method of downloading v.redd.it videos.

  - Audio support
  - RESTful API
  - AWS S3

### Acknowledgements

vreddit-microservice uses [UI Kit](https://getuikit.com/) as a front-end HTML & CSS boilerplate framework

### Prerequisites

vreddit-microservice requires [Node.js](https://nodejs.org/) v4+ and [ffmpeg](https://www.ffmpeg.org/) to run.

If you do not currently have an AWS Credentials file set up, do the following;

Create an AWS Credentials file and folder in your user directory.

```sh
$ cd ~
$ mkdir .aws
$ cd .aws/
$ touch credentials
```
Open the credentials file, add the following text, edit as necessary.


```
[default]
aws_access_key_id=[PUT YOUR OWN ACCESS KEY ID]
aws_secret_access_key=[PUT YOUR OWN SECRET ACCESS KEY HERE]
```
If you do not have an access key pair at hand, get one [here](https://console.aws.amazon.com/iam/home?region=global#/security_credential).

### Installation

Pull the latest project files from the Github repo.

```sh
$ git clone https://github.com/Jqnxyz/vreddit-microservice
```

Update *routes.js*
```sh
$ cd vreddit-microservice
$ nano routes/routes.js
```
Modify the following line, replace *'zluxstore'* to your own S3 bucket name.
```js
const s3bucket = 'zluxstore'; //Replace 'zluxstore' with your own
..
```

Install the dependencies and start the server.

```sh
$ npm install -d
$ sudo node app.js
```

**Sudo is required as server runs on port :80**
### Todos

 - Write Tests
 - Add SSL support
 - Add more RESTful endpoints
 - Spam protection

License
----

GPL3.0


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [vreddit-microservice]: <https://github.com/Jqnxyz/vreddit-microservice>
   [git-repo-url]: <https://github.com/Jqnxyz/vreddit-microservice.git>
   [Jerome Quah]: <http://jqnxy.xyz>
   [zlux.us]: <https://zlux.us/>
   [node.js]: <http://nodejs.org>
   [jQuery]: <http://jquery.com>
   [express]: <http://expressjs.com>
