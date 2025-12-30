import sqlite3

def check_superadmin():
    try:
        conn = sqlite3.connect('/Users/fyi/app064/backend/project_invest_dev.db')
        cursor = conn.cursor()
        
        cursor.execute("SELECT username, role, password_hash FROM users WHERE username = 'superadmin'")
        user = cursor.fetchone()
        
        if user:
            print(f"FOUND: User '{user[0]}' with role '{user[1]}' exists.")
        else:
            print("NOT FOUND: User 'superadmin' does not exist.")
            
        conn.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    check_superadmin()
