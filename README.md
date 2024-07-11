# Create Report Shortcut

This project provides an example of how to create a shortcut and handle state and interaction of it in Bettermode.

## Flow Overview

1. **Create an App and Install It**
    - Obtain `client_id`, `client_secret`, and `webhook_signing_secret`.

2. **Setup Webhook domain**
    - Add a domain for handling webhooks.
    - Update webhooks.

3. **Create a Shortcut**
    - Create a shortcut with custom `Name`, `Key` and `Interaction URL`.
    - Set the context to `POST`.
    - Create at least one `State`.

4. **Create a `.env` File**
    ```sh
    CLIENT_ID=XXXXXXX-XXXXXXXXXXXXXXXXX
    CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
    WEBHOOK_SIGNING_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
    ```

5. **Fill the shortcut data**
    - Fill shortcut data in `consts/shortcuts.ts`.
    - The data should be in the following format:
   ```sh
   [
     {
         "key": '-- Created Shortcut Key --',
         "context": '-- Created Shortcut Context --',
         "states": [
            "-- Created State [1] --",
            ...
         ],
         "interactions": [
            {
              ...
            }
         ]     
     }
   ] 
   ```

6. **Fill in the Blanks in the Project**

7. **Run the Project**

## Environment Variables

Create a `.env` file in the root directory of the project and fill it with the following variables:

## Installation

1. Clone the repository:
   ```sh
   git clone <https://github.com/AliAghamiriBettermode/AutoJoinSubSpaces>
    ```
2. Install the dependencies:
   ```sh
   npm install
    ```
3. Run the project:
   ```sh
   npm start
    ```
4. The project will be running on `http://localhost:5000`.