# back4app-serverless (frontend)

1. Install the dependencies:
    ```sh
    $ npm install
    ```

2. Follow the article to create the serverless backend.

3. Navigate to *pages/_app.js* and replace the placeholders with your Application ID and JavaScript key:
    ```js
    // to get the keys navigate to your Back4app app > App Settings > Security & Keys
   
    Parse.initialize(
      "<your_app_id>", 
      "<your_javascript_key>",
    );
    ```

4. Run the development server:
    ```sh
    $ npm run dev
    ```
   
5. Navigate to [http://localhost:3000](http://localhost:3000) in your favorite browser.