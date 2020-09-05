# MERN-front-2-back

https://serene-harbor-42747.herokuapp.com/

## App Structure
|-- client -->
	 |-- [+] public --> auto build generated folder
         |-- src
	       |-- actions 
			 |-- alert.js
	       		 |-- auth.js
			 |-- post.js
			 |-- profile.js
			 |-- types.js
	       |-- components
			    |-- [+] auth
			    |-- [+] dashboard
			    |-- [+] layout
			    |-- [+] post
			    |-- [+] posts
			    |-- [+] profile
			    |-- [+] profile-forms
			    |-- [+] profiles
			    |-- [+] routing
	       |-- [+] img --> image assets
	       |-- reducers
			  |-- alert.js
			  |-- auth.js
			  |-- index.js
			  |-- post.js
			  |-- profile.js
	       |-- utils
		       |-- setAuthHeader.js
	       |-- App.js
	       |-- App.test.js
	       |-- App.css
	       |-- index.css
	       |-- index.js
	       |-- logo.svg
	       |-- serviceWorker.js
	       |-- setupTests.js
	       |-- store.js
|-- config
	 |-- default.json
	 |-- production.json
|-- models
	 |-- auth-model.js
	 |-- post-model.js
	 |-- profile-model.js
|-- routes
	 |-- api
	       |-- auth.js
	       |-- index.js
	       |-- post.js
	       |-- profile.js
|-- utils
	|-- checkObjectId.js
	|-- db.js
	|-- passport-middleware.js
|-- server.js
