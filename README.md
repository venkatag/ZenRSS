# ZenRSS

ZenRSS is a minimalistic RSS reader that aggregates RSS feeds and provides a clean and focused reading experience. It allows users to pull RSS feeds client-side, while maintaining a record of read RSS feeds on the server.

## Features

- Pull RSS feeds client-side: ZenRSS fetches RSS feeds directly on the client-side, ensuring that users have the most up-to-date content.
- Minimalistic design: The user interface of ZenRSS provides a clean and distraction-free reading experience.
- Server-side read records: ZenRSS keeps a record of read RSS feeds on the server, allowing users to keep track of the feeds they have already read.
- Authentication: ZenRSS includes a user authentication system to ensure secure access to the application.
- Error handling: The application handles errors gracefully and provides appropriate error messages to the users.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/venkatag/ZenRSS.git
   ```

2. Install the dependencies:

   ```bash
   cd ZenRSS
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

4. Open your web browser and visit `http://localhost:3000` to access ZenRSS.

## Usage

1. Register a new user account or login with an existing account.
2. Add RSS feed URLs to start pulling the latest content.
3. Click on the feed titles to read the full content in a new tab.
4. The application automatically marks read feeds on the server-side, allowing you to keep track of your reading progress.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for new features, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
```

Feel free to customize the README.md file according to your specific project requirements, including adding or modifying the features, installation instructions, usage guidelines, and contributing information.


Here are deployment instructions for the ZenRSS app:

**Prerequisites:**
- Node.js and npm installed on the deployment server
- A hosting provider or server to deploy the application

1. Prepare the Application for Deployment:

   - Clone the ZenRSS repository:

     ```bash
     git clone https://github.com/venkatag/ZenRSS.git
     ```

   - Navigate to the project directory:

     ```bash
     cd ZenRSS
     ```

   - Install the project dependencies:

     ```bash
     npm install
     ```

   - Build the application:

     ```bash
     npm run build
     ```

2. Configure the Environment Variables:

   - Create a `.env` file in the root directory of the application.

   - Set the following environment variables in the `.env` file:

     ```
     PORT=<port_number>           # The port number on which the application will run (default: 3000)
     SECRET_KEY=<secret_key>      # A secret key for JWT token generation and verification
     ```

3. Start the Application:

   - Start the application using a process manager like `pm2`:

     ```bash
     npm install pm2 -g   # Install pm2 globally (if not already installed)
     pm2 start server.js  # Start the application
     ```

   - Alternatively, you can use other process managers or deployment methods suitable for your hosting environment.

4. Set Up a Reverse Proxy (Optional):

   - If you want to use a reverse proxy, such as Nginx, to serve the application, configure it to forward requests to the application running on the specified port (default: 3000).

     Example Nginx configuration:

     ```
     server {
         listen 80;
         server_name example.com;

         location / {
             proxy_pass http://localhost:3000;
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
         }
     }
     ```

5. Access the Application:

   - Visit the URL of your deployed application in a web browser.

     Example: `http://example.com`

That's it! Your ZenRSS application should now be deployed and accessible. Remember to customize the deployment process based on your specific hosting environment and requirements.

Note: It's recommended to use HTTPS for secure communication. To enable HTTPS, you'll need to obtain an SSL certificate and configure your server accordingly.