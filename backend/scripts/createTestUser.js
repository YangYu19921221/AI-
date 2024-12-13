const User = require('../models/user');
const sequelize = require('../config/database');

async function createTestUser() {
    try {
        await sequelize.sync();
        
        const testStudent = await User.create({
            username: 'student',
            phone: '13900139000',
            password: '123456',
            role: 'student'
        });

        console.log('Test student account created successfully:');
        console.log({
            username: testStudent.username,
            phone: testStudent.phone,
            role: testStudent.role
        });

    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        await sequelize.close();
    }
}

createTestUser();
