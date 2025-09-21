import sequelize from '../src/database/config.js';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Create station
const createStation = async () => {
  try {
    console.log('\x1b[36m%s\x1b[0m', 'Creating police station...');
    // Create police station
    const station_id = uuidv4();
    const stationData = await sequelize.query(`
      INSERT INTO police_stations (
        station_id,
        station_name, 
        station_code, 
        station_phone, 
        station_email,
        station_latitude, 
        station_longitude, 
        station_zone, 
        station_address,
        station_city, 
        station_state, 
        station_jurisdiction, 
        station_type,
        station_incharge,
        created_at,
        created_by,
        updated_at,
        updated_by
      ) VALUES (
        '${station_id}',
        'Baner', 
        'MH_PL_BANER', 
        9876543210, 
        'baner@gmail.com',
        18.5686432, 
        73.7749747, 
        'ZONE_4', 
        'Ganeshkhind, 
        Pune, 
        Maharashtra, 
        India',
        'Pune', 
        'Maharashtra', 
        'Pune', 
        '', 
        'PI Ganesh',
        '${new Date()}',
        null,
        '${new Date()}',
        null
      ) RETURNING *;
    `);

    // Create police officer
    if (stationData[0].length > 0) {
      const stationId = stationData[0][0].id;
      console.log('\x1b[32m%s\x1b[0m', '✓ Police station created successfully');
      console.log('\x1b[36m%s\x1b[0m', 'Creating police officer...');
      const officer_id = uuidv4();
      const hashedPassword = await bcryptjs.hash('admin', 10);
      await sequelize.query(`
        INSERT INTO police_officers (
          officer_id,
          station_id, 
          officer_name, 
          officer_username,
          officer_password,
          officer_designation, 
          officer_badge_number,
          officer_mobile_number, 
          officer_email, 
          officer_joining_date, 
          officer_status,
          created_at,
          created_by,
          updated_at,
          updated_by
        ) VALUES (
          '${officer_id}',
          '${stationId}', 
          'Admin User', 
          'admin',
          '${hashedPassword}',
          'PI', 
          'MH_PL_2025_001',
          987654321, 
          'admin@gmail.com', 
          '', 
          'Active',
          '${new Date()}',
          null,
          '${new Date()}',
          null
        );
      `);

      // Update station with officer_id
      await sequelize.query(`
        UPDATE police_stations 
        SET updated_by = '${officer_id}',
            updated_at = '${new Date()}'
        WHERE id = '${stationId}';
      `);

      console.log('\x1b[32m%s\x1b[0m', '✓ Police officer created successfully');
      console.log('\n\x1b[33mStation Details:\x1b[0m');
      console.table(stationData[0][0]);
    }

  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', '✗ Error occurred:');
    console.error('\x1b[31m%s\x1b[0m', error.message);
  }
};

createStation();
