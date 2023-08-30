import "./db/database.js";
import express from 'express';
import cookieParser from 'cookie-parser'
import session from 'express-session'
import mongoStore from 'connect-mongo'
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import ProductManager from "./persistence/daos/mongodb/dao/products.dao.js";
import MessagesManager from "./persistence/daos/filesystem/messages.dao.js";
import passport from 'passport';
import routerApi from './routes/index.js';
import config from './config.js';
import { logger } from './utils/logger.js';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { info } from './docs/info.js';
import "./persistence/daos/mongodb/connection.js";
import './passport/local.js';
import './passport/github.js';
import './passport/jwt.js';


const productManager = new ProductManager(__dirname + "/daos/filesystem/products.json");
const messagesManager = new MessagesManager(__dirname + "/daos/filesystem/messages.json");

const app = express();

const specs = swaggerJSDoc(info);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan('dev'));
app.use(errorHandler);
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(
  session({
    secret: 'sessionKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 100000
    },
    store: new mongoStore({
      mongoUrl: 'mongodb+srv://ezequielM:admin@cluster0.rbgchkc.mongodb.net/ecommerce?retryWrites=true&w=majority',
    }),
  })
)

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routerApi);

const PORT = config.PORT;

const httpServer = app.listen(PORT, () => {
  logger.info(`Servidor express escuchando en el puerto ${PORT}`)

});

const socketServer = new Server(httpServer);

const arrayProducts = [];

socketServer.on("connection", async (socket) => {
  logger.info("Usuario socket conectado")
  socket.on("disconnect", () => {
   logger.info("usuario desconectado!");
  });

  socketServer.emit("messages", await messagesManager.getAllmessage());

  socketServer.emit("arrayProducts", arrayProducts);

  socket.on("chat:message", async (message) => {
    await messagesManager.createMessage(message);
    socketServer.emit("messages", await messagesManager.getAllMessage());
  });

  socket.on("newProduct", (obj) => {
    arrayProducts.push(obj);
    socketServer.emit("arrayProducts", arrayProducts);
  });
});
