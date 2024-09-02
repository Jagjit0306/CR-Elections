# CR Elections

This is a website built to facilitate the election of the Class Representative (CR) for the junior batch at our institution. The platform allows students to nominate candidates, vote for their preferred representative, and view the election results in real-time.

## Features

- **Nomination Process**: Students can nominate themselves or others for the CR position.
- **Voting System**: Secure and anonymous voting process.
- **User Authentication**: Secure login to ensure only eligible students participate in the election.
- **Responsive Design**: Accessible on various devices, including smartphones, tablets, and desktops.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (React.js)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: OTP
- **Hosting**: Render

## Setup and Installation

To set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/Jagjit0306/CR-Elections.git
   cd CR-Elections
   ```

2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and client directory and add your MongoDB connection string, and other environment variables.

4. Start the development server:
   ```bash
   npm run dev
   ```
   
   ```bash
   cd client
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the website in action.

## Usage

- **Nomination**: Students can contact the admin providing their details and a brief statement of intent.
- **Voting**: After nominations are closed, eligible students can log in and vote for their preferred candidate.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
