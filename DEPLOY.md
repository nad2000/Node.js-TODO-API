```bash

node --version # set this verions in package.json for node engine.
heroku create
# heroku addons:create mongolab:sandbox
# create manually a free account for DB:
heroku config:set MONGODB_URI=mongodb://USER:PASSWORD@ds263707.mlab.com:63707/todo-app
heroku config
git push heroku master
```
