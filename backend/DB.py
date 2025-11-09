import sqlite3


def create_database():
    with sqlite3.connect("store.db") as conn:
        cur = conn.cursor()

        # customers table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS customers (
                customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE
            )
        """)

        # products table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS products (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                stock_quantity INTEGER DEFAULT 1 NOT NULL,
                latitude FLOAT NOT NULL,
                longitude FLOAT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # transactions table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
                seller_id INTEGER NOT NULL,
                buyer_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                total_price REAL NOT NULL,
                transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (seller_id) REFERENCES customers(customer_id),
                FOREIGN KEY (buyer_id) REFERENCES customers(customer_id),
                FOREIGN KEY (product_id) REFERENCES products(product_id)
            )
        """)

        # Commit changes and close connection
        conn.commit()

    print("Database and tables: customers, products and transactions created successfully (or already exist)")


def customers_insert_one(name: str, phone: str, email: str = "none@none.none"):
    con = sqlite3.connect("store.db")
    cur = con.cursor()

    if name is None:
        print("name must NOT be None!")
        return
    if phone is None:
        print("phone must NOT be None!")
        return

    cur.execute("INSERT INTO customers (name, phone, email) VALUES(?, ?, ?)", (name, phone, email))
    con.commit()
    con.close()


def customers_insert_many(customer_list: list[tuple[str, str, str]]):
    con = sqlite3.connect("store.db")
    cur = con.cursor()

    for i, (name, phone, email) in enumerate(customer_list):
        if name is None:
            print(f"{i}: name must NOT be None!")
            return
        if phone is None:
            print(f"{i}: phone must NOT be None!")
            return

    cur.executemany("INSERT INTO customers (name, phone, email) VALUES(?, ?, ?)", customer_list)
    con.commit()
    con.close()


def customers_update_one(customer_id: int, name: str = None, phone: str = None, email: str = None):
    with sqlite3.connect("store.db") as con:
        cur = con.cursor()

        updates = []
        params = []

        if name is not None:
            updates.append("name = ?")
            params.append(name)
        if phone is not None:
            updates.append("phone = ?")
            params.append(phone)
        if email is not None:
            updates.append("email = ?")
            params.append(email)

        if not updates:
            print("No fields to update!")
            return

        params.append(customer_id)
        query = f"UPDATE customers SET {', '.join(updates)} WHERE customer_id = ?"
        cur.execute(query, params)
        con.commit()


def customers_update_many(where_clause: str, params: tuple, name: str = None, phone: str = None, email: str = None):
    with sqlite3.connect("store.db") as con:
        cur = con.cursor()

        updates = []
        update_params = []

        if name is not None:
            updates.append("name = ?")
            update_params.append(name)
        if phone is not None:
            updates.append("phone = ?")
            update_params.append(phone)
        if email is not None:
            updates.append("email = ?")
            update_params.append(email)

        if not updates:
            print("No fields to update!")
            return

        query = f"UPDATE customers SET {', '.join(updates)} WHERE {where_clause}"
        cur.execute(query, update_params + list(params))
        con.commit()


def customers_delete_one(customer_id: int):
    with sqlite3.connect("store.db") as con:
        cur = con.cursor()
        cur.execute("DELETE FROM customers WHERE customer_id = ?", (customer_id,))
        con.commit()


def customers_delete_many(where_clause: str, params: tuple):
    with sqlite3.connect("store.db") as con:
        cur = con.cursor()
        query = f"DELETE FROM customers WHERE {where_clause}"
        cur.execute(query, params)
        con.commit()


def products_insert_one(name: str, price: float, stock_quantity: int = 1, latitude: float = None, longitude: float = None, description: str = None):
    con = sqlite3.connect("store.db")
    cur = con.cursor()

    if name is None:
        print("name must NOT be None!")
        return
    if price is None:
        print("price must NOT be None!")
        return
    if latitude is None:
        print("latitude must NOT be None!")
        return
    if longitude is None:
        print("longitude must NOT be None!")
        return

    cur.execute("INSERT INTO products (name, price, stock_quantity, latitude, longitude, description) VALUES(?, ?, ?, ?, ?, ?)", (name, price, stock_quantity, latitude, longitude, description))
    con.commit()
    con.close()


def products_insert_many(product_list: list[tuple[str, float, int, float, float, str]]):
    con = sqlite3.connect("store.db")
    cur = con.cursor()

    for i, (name, price, stock_quantity, latitude, longitude, description) in enumerate(product_list):
        if name is None:
            print(f"{i}: name must NOT be None!")
            return
        if price is None:
            print(f"{i}: price must NOT be None!")
            return
        if latitude is None:
            print(f"{i}: latitude must NOT be None!")
            return
        if longitude is None:
            print(f"{i}: longitude must NOT be None!")
            return

    cur.executemany("INSERT INTO products (name, price, stock_quantity, latitude, longitude, description) VALUES(?, ?, ?, ?, ?, ?)", product_list)
    con.commit()
    con.close()


def products_update_one(product_id: int, name: str = None, price: float = None, stock_quantity: int = None, latitude: float = None, longitude: float = None, description: str = None):
    with sqlite3.connect("store.db") as con:
        cur = con.cursor()

        updates = []
        params = []

        if name is not None:
            updates.append("name = ?")
            params.append(name)
        if price is not None:
            updates.append("price = ?")
            params.append(price)
        if stock_quantity is not None:
            updates.append("stock_quantity = ?")
            params.append(stock_quantity)
        if latitude is not None:
            updates.append("latitude = ?")
            params.append(latitude)
        if longitude is not None:
            updates.append("longitude = ?")
            params.append(longitude)
        if description is not None:
            updates.append("description = ?")
            params.append(description)

        if not updates:
            print("No fields to update!")
            return

        params.append(product_id)
        query = f"UPDATE products SET {', '.join(updates)} WHERE product_id = ?"
        cur.execute(query, params)
        con.commit()


def products_update_many(where_clause: str, params: tuple, name: str = None, price: float = None, stock_quantity: int = None, latitude: float = None, longitude: float = None, description: str = None):
    with sqlite3.connect("store.db") as con:
        cur = con.cursor()

        updates = []
        update_params = []

        if name is not None:
            updates.append("name = ?")
            update_params.append(name)
        if price is not None:
            updates.append("price = ?")
            update_params.append(price)
        if stock_quantity is not None:
            updates.append("stock_quantity = ?")
            update_params.append(stock_quantity)
        if latitude is not None:
            updates.append("latitude = ?")
            update_params.append(latitude)
        if longitude is not None:
            updates.append("longitude = ?")
            update_params.append(longitude)
        if description is not None:
            updates.append("description = ?")
            update_params.append(description)

        if not updates:
            print("No fields to update!")
            return

        query = f"UPDATE products SET {', '.join(updates)} WHERE {where_clause}"
        cur.execute(query, update_params + list(params))
        con.commit()


def products_delete_one(product_id: int):
    with sqlite3.connect("store.db") as con:
        cur = con.cursor()
        cur.execute("DELETE FROM products WHERE product_id = ?", (product_id,))
        con.commit()


def products_delete_many(where_clause: str, params: tuple):
    with sqlite3.connect("store.db") as con:
        cur = con.cursor()
        query = f"DELETE FROM products WHERE {where_clause}"
        cur.execute(query, params)
        con.commit()


def transactions_insert_one(seller_id: int, buyer_id: int, product_id: int, quantity: int, total_price: float):
    con = sqlite3.connect("store.db")
    cur = con.cursor()

    if seller_id is None:
        print("seller_id must NOT be None!")
        return
    if buyer_id is None:
        print("buyer_id must NOT be None!")
        return
    if product_id is None:
        print("product_id must NOT be None!")
        return
    if quantity is None:
        print("quantity must NOT be None!")
        return
    if total_price is None:
        print("total_price must NOT be None!")
        return

    cur.execute("INSERT INTO transactions (seller_id, buyer_id, product_id, quantity, total_price) VALUES(?, ?, ?, ?, ?)", (seller_id, buyer_id, product_id, quantity, total_price))
    con.commit()
    con.close()


def transactions_insert_many(transaction_list: list[tuple[int, int, int, int, float]]):
    con = sqlite3.connect("store.db")
    cur = con.cursor()

    for i, (seller_id, buyer_id, product_id, quantity, total_price) in enumerate(transaction_list):
        if seller_id is None:
            print(f"{i}: seller_id must NOT be None!")
            return
        if buyer_id is None:
            print(f"{i}: buyer_id must NOT be None!")
            return
        if product_id is None:
            print(f"{i}: product_id must NOT be None!")
            return
        if quantity is None:
            print(f"{i}: quantity must NOT be None!")
            return
        if total_price is None:
            print(f"{i}: total_price must NOT be None!")
            return

    cur.executemany("INSERT INTO transactions (seller_id, buyer_id, product_id, quantity, total_price) VALUES(?, ?, ?, ?, ?)", transaction_list)
    con.commit()
    con.close()


def transactions_update_one(transaction_id: int, seller_id: int = None, buyer_id: int = None, product_id: int = None, quantity: int = None, total_price: float = None):
    with sqlite3.connect("store.db") as con:
        cur = con.cursor()

        updates = []
        params = []

        if seller_id is not None:
            updates.append("seller_id = ?")
            params.append(seller_id)
        if buyer_id is not None:
            updates.append("buyer_id = ?")
            params.append(buyer_id)
        if product_id is not None:
            updates.append("product_id = ?")
            params.append(product_id)
        if quantity is not None:
            updates.append("quantity = ?")
            params.append(quantity)
        if total_price is not None:
            updates.append("total_price = ?")
            params.append(total_price)

        if not updates:
            print("No fields to update!")
            return

        params.append(transaction_id)
        query = f"UPDATE transactions SET {', '.join(updates)} WHERE transaction_id = ?"
        cur.execute(query, params)
        con.commit()


def transactions_update_many(where_clause: str, params: tuple, seller_id: int = None, buyer_id: int = None, product_id: int = None, quantity: int = None, total_price: float = None):
    with sqlite3.connect("store.db") as con:
        cur = con.cursor()

        updates = []
        update_params = []

        if seller_id is not None:
            updates.append("seller_id = ?")
            update_params.append(seller_id)
        if buyer_id is not None:
            updates.append("buyer_id = ?")
            update_params.append(buyer_id)
        if product_id is not None:
            updates.append("product_id = ?")
            update_params.append(product_id)
        if quantity is not None:
            updates.append("quantity = ?")
            update_params.append(quantity)
        if total_price is not None:
            updates.append("total_price = ?")
            update_params.append(total_price)

        if not updates:
            print("No fields to update!")
            return

        query = f"UPDATE transactions SET {', '.join(updates)} WHERE {where_clause}"
        cur.execute(query, update_params + list(params))
        con.commit()


def transactions_delete_one(transaction_id: int):
    with sqlite3.connect("store.db") as con:
        cur = con.cursor()
        cur.execute("DELETE FROM transactions WHERE transaction_id = ?", (transaction_id,))
        con.commit()


def transactions_delete_many(where_clause: str, params: tuple):
    with sqlite3.connect("store.db") as con:
        cur = con.cursor()
        query = f"DELETE FROM transactions WHERE {where_clause}"
        cur.execute(query, params)
        con.commit()