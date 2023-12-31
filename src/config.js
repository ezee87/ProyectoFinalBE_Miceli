import 'dotenv/config';

export default {
    NODE_ENV: process.env.NODE_ENV,
    MONGO_LOCAL: process.env.MONGO_LOCAL,
    MONGO_QA: process.env.MONGO_QA,
    MONGO_PROD: process.env.MONGO_PROD,
    PORT: process.env.PORT,
    host: process.env.HOST,
    passEthereal: process.env.PASSETHEREAL,
    emailEthereal: process.env.EMAILETHEREAL,
    portEthereal: process.env.PORTETHEREAL
}