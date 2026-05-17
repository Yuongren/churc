const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/db');
const Service = require('./models/Service');

dotenv.config();

const seedServices = async () => {
    await connectDB();

    const services = [
        { name: 'Workers Service', time: '6:00 AM – 8:45 AM', day: 'Sunday' },
        { name: 'English Service', time: '9:00 AM – 12:30 PM', day: 'Sunday' },
        { name: 'Swahili Service', time: '2:00 PM – 5:30 PM', day: 'Sunday' },
        { name: 'Evening Service', time: '6:00 PM – 8:00 PM', day: 'Sunday' },
        { name: 'Midweek Service', time: '7:00 PM – 9:00 PM', day: 'Wednesday' }
    ];

    try {
        await sequelize.sync();

        await Service.destroy({ where: {} });

        await Service.bulkCreate(services);

        console.log('✅ Services seeded successfully');
    } catch (error) {
        console.error('❌ Seeding error:', error);
    }

    process.exit();
};

seedServices();