import psycopg2
from psycopg2.extras import RealDictCursor

# Database Configuration
DB_CONFIG = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': 'new_password',  
    'host': 'localhost',
    'port': '5432'
}

# Get DB Connection
def get_connection():
    try:
        connection = psycopg2.connect(**DB_CONFIG)
        return connection
    except Exception as e:
        print("Error while connecting to PostgreSQL:", e)
        return None

# Function to Fetch Data
def get_db(query, args=()):
    try:
        connection = get_connection()
        if connection:
            cursor = connection.cursor(cursor_factory=RealDictCursor)
            cursor.execute(query, args)
            result = cursor.fetchall()
            connection.close()
            return result
    except Exception as e:
        print("Error executing query:", e)
        return None

# Function to Insert/Update Data
def put_db(query, args=()):
    try:
        connection = get_connection()
        if connection:
            cursor = connection.cursor()
            cursor.execute(query, args)
            connection.commit()
            connection.close()
            return True
    except Exception as e:
        print("Error executing query:", e)
        return False
