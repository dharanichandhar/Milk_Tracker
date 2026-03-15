import psycopg2


def main():
    conn = psycopg2.connect(
        host="localhost",
        database="postgres",
        user="admin",
        password="secret"
    )
    conn.autocommit = True
    cursor = conn.cursor()

    cursor.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'trainingdb'
        )
    """)
    result = cursor.fetchone()
    table_exists = result is not None and result[0] is True

    if not table_exists:
        cursor.execute("""
            CREATE TABLE trainingdb (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                marks NUMERIC
            )
        """)

        cursor.execute("""
            INSERT INTO trainingdb (name, marks) VALUES 
            ('ram', 20),
            ('anjali', 30),
            ('varsha', 40)
        """)

        print("populated the database")

    cursor.execute("SELECT AVG(marks) FROM trainingdb")
    result = cursor.fetchone()
    avg_marks = result[0] if result is not None else None
    if avg_marks is not None:
        print("Average marks = ", avg_marks)

    cursor.close()
    conn.close()


if __name__ == "__main__":
    main()
