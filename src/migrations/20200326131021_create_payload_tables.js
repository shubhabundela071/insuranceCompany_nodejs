exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
         table.increments('id').primary();
         table.integer('carId').references('id').inTable('car').onDelete('cascade');
         table.string('name');
         table.string('email');
         table.string('password');
         table.integer('userType');
         table.boolean('isPhoneVerified').defaultTo(false);
         table.boolean('isAdminVerified').defaultTo(true);
         table.string('countryCode');
         table.string('phoneNo');
         table.string('token');
         table.string('address');
         table.string('city');
         table.string('state');
         table.string('zip');
         table.string('profilePic');
         table.boolean('isActive').defaultTo(true);
         table.boolean('isNotify').defaultTo(true);
         table.text('deviceToken');
         table.integer('deviceId');
         table.string('deviceType');
         table.integer('created_by');
         table.timestamp('created_at').defaultTo(knex.fn.now());
         table.timestamp('updated_at').defaultTo(knex.fn.now()); 
     })

    .createTable('car', function (table) {
         table.increments('id').primary();
         table.string('carName').notNullable();
         table.string('carNo');
         table.string('carColor');
         table.string('carModel');
         table.string('companyName');
         table.boolean('isActive').defaultTo(true);
         table.timestamp('created_at').defaultTo(knex.fn.now());
         table.timestamp('updated_at').defaultTo(knex.fn.now()); 
        
     })
     .createTable('admin',function(table){
        table.increments('id').primary();
        table.string('first_name', 60).collate('utf8_general_ci');
        table.string('last_name', 60).collate('utf8_general_ci');
        table.string('email_id', 60).unique().collate('utf8_general_ci');
        table.string('password').collate('utf8_general_ci');
        table.text('token').collate('utf8_general_ci');
        table.text('verification').collate('utf8_general_ci').comment('it will store verification otp for drivers and link for others.');
        table.enum('user_type', ['super_admin', 'customer']).collate('utf8_general_ci').comment('This defines users type');;
        table.enum('user_status', ['active', 'pending', 'block']).defaultTo('pending');
        table.boolean('is_email_verified').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now()); 
    })
     
 };
 
 exports.down = function(knex) {
 };
 
