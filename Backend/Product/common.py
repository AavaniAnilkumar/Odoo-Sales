# Example content of common.py

# Dummy data for user authentication
VALID_USERS = {
    "admin": "loyal123",
   
}

def authenticate(db, username, password, additional_info):
    # Check if the provided username exists in the dummy data
    if username in VALID_USERS:
        # Check if the provided password matches the stored password for the username
        if password == VALID_USERS[username]:
            # Authentication successful
            return "user_authenticated"
        else:
            # Incorrect password
            return "incorrect_password"
    else:
        # Username not found
        return "username_not_found"
