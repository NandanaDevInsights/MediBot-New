"""
Database connection pool for the Flask backend.

All credentials are pulled from environment variables; nothing is hard-coded.
Uses mysql-connector pooling for efficient reuse across requests.
"""

import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import pooling

load_dotenv()



def get_pool():
    """Initialize the connection pool."""
    return pooling.MySQLConnectionPool(
        pool_name="medibot_pool",
        pool_size=int(os.environ.get("DB_POOL_SIZE", 10)),
        host=os.environ.get("MYSQLHOST"),
        port=int(os.environ.get("MYSQLPORT", 3306)),
        user=os.environ.get("MYSQLUSER"),
        password=os.environ.get("MYSQLPASSWORD"),
        database=os.environ.get("MYSQLDATABASE"),
        use_pure=True,  # Use pure Python to avoid C-extension SSL path errors
        ssl_verify_cert=True if os.environ.get("MYSQL_SSL_MODE") != "DISABLED" else False,
        ssl_ca=os.environ.get("MYSQL_SSL_CA")  # Path to CA cert for Aiven
    )


pool = None

def get_connection():
    """Get a pooled connection for request-scoped use."""
    global pool
    if pool is None:
        pool = get_pool()
    return pool.get_connection()

