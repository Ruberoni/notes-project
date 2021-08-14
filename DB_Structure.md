# User

- ID Primary key

... fields to work with Google Auth (to investigate)

# Note

- ID Primary key
- User ID Foreign key
- Title
- Body

# Category

Used for identify a note. Each user has various categories.

The color will be an ENUM. [More info...](https://dev.mysql.com/doc/refman/8.0/en/enum.html)

To investigate:

- Creating an ENUM in MySQL
- Using an ENUM
- Adding items to a already created ENUM
- ...
- ID Primary key
- User ID Foreign key
- Label
- Color: ENUM [more info](https://dev.mysql.com/doc/refman/8.0/en/enum.html)

# Note categories

This is a junction table for establish relationship between a note and various categories, and vice versa.

- Note ID Foreign key
- Category ID Foreign key
