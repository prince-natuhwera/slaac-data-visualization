
# SLAAC DATA VIEWER

A modern, interactive web mapping application for searching and visualizing land parcel data from multiple districts in Uganda.  
Built with Node.js, Express, Leaflet, and PostgreSQL/PostGIS.

---

## Features

- Search parcels by ID or owner name across multiple districts (tables)
- Visualize parcel boundaries on an interactive map (OpenStreetMap & Satellite)
- View detailed parcel information in popups
- Responsive and modern UI
- Easily extensible for more districts/tables

---

## Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, JavaScript, Leaflet.js
- **Database:** PostgreSQL with PostGIS extension

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [PostgreSQL](https://www.postgresql.org/) with [PostGIS](https://postgis.net/) extension
- [Git](https://git-scm.com/) (for cloning and version control)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/slaac-data-viewer.git
   cd slaac-data-viewer
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up your PostgreSQL/PostGIS database:**
   - Create your database (e.g., `slaacdb`)
   - Enable PostGIS:
     ```sql
     CREATE EXTENSION postgis;
     ```
   - Run the provided SQL scripts to create tables (e.g., `sheema`, `ibanda`).

4. **Configure environment variables:**
   - Create a `.env` file or set the following variables in your environment:
     ```
     PGUSER=your_db_user
     PGHOST=your_db_host
     PGDATABASE=slaacdb
     PGPASSWORD=your_db_password
     PGPORT=5432
     ```
   - If deploying to a cloud provider, set these in your dashboard.

5. **Start the server:**
   ```sh
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000) by default.

---

## Usage

- Open your browser and go to [http://localhost:3000](http://localhost:3000)
- Select the district/table, enter a Parcel ID or Owner Name, and click "Search"
- Click on a parcel on the map to view its details

---

## Deployment

You can deploy this project for free using platforms like [Render](https://render.com) or [Railway](https://railway.app):

1. Push your code to GitHub.
2. Create a new Web Service on Render/Railway and connect your repo.
3. Add your environment variables for the database connection.
4. Provision a PostgreSQL/PostGIS database (Render, Railway, Supabase, or Neon).
5. Deploy and access your app via the provided URL.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Credits

Designed by: **PRINCE NATUHWERA**

---

## Contact

For questions or support, please open an issue or contact the project maintainer.

