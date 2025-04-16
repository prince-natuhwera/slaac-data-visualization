// SLAAC DATA VIEWER Database Logic
// Handles connection to PostgreSQL/PostGIS and parcel search for multiple tables

const { Pool } = require('pg');

// Configure your database connection here
const pool = new Pool({
  user: 'postgres',         // Change if your DB user is different
  host: 'localhost',        // Change if your DB is hosted elsewhere
  database: 'slaacdb',      // Your database name
  password: 'Prince@0230',  // Your database password
  port: 5432,               // Default PostgreSQL port
});

// Whitelist allowed tables and their columns for security and schema handling
const tableConfigs = {
  sheema: {
    columns: `
      gid, pin, district, county, subcounty, parish, village, block, area_ha,
      tenancy, brn, occupied, by_whom, cur_use, int_use, gov_charge, amount_gc,
      prn, is_number, laf_number, min_dlb, citizenshi, address, name, nin,
      gender, dob, marital, tel_number,
      ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry
    `,
    searchFields: ['pin', 'name']
  },
  ibanda: {
    columns: `
      gid, objectid, parcel_id, district, county, parish, village, block, area_ha,
      tenancy, occupied, by_whom, cur_use, int_use, gov_charge, is_number,
      laf_number, min_dlb, subcounty, shape_leng, shape_area, pin, full_names,
      nin, gender, date_of_bi, marital_st, phone_numb, no, party_type, citizenshi,
      address,
      ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry
    `,
    searchFields: ['parcel_id', 'full_names', 'pin']
  }
};

// Function to search parcels by Parcel ID or Owner Name in specified table
async function searchParcels(query, table = 'sheema') {
  // Validate table name for security
  if (!tableConfigs[table]) {
    throw new Error('Invalid table name');
  }
  
  const config = tableConfigs[table];

  // Build WHERE clause for search fields
  const whereClause = config.searchFields
    .map((field, idx) => `${field} ILIKE $1`)
    .join(' OR ');

  const sql = `
    SELECT ${config.columns}
    FROM public.${table}
    WHERE ${whereClause}
    LIMIT 10
  `;
  const values = [`%${query}%`];

  const result = await pool.query(sql, values);

  // Convert each row to GeoJSON Feature
  return result.rows.map(row => {
    // Create a copy of the row without the geometry field for properties
    const { geometry, ...properties } = row;
    return {
      type: "Feature",
      geometry: geometry,
      properties: properties
    };
  });
}

// Get available tables for UI dropdown
function getAvailableTables() {
  return Object.keys(tableConfigs);
}

module.exports = { searchParcels, getAvailableTables };
