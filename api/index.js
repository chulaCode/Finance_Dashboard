import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import clientRoute from "./routes/client.js";
import generalRoute from "./routes/general.js";
import managementRoute from "./routes/management.js"
import saleRoute from "./routes/sale.js";

//data import 
import User from './models/User.js';
import Products from './models/Products.js'
import ProductStat from './models/ProductStat.js'
import Transaction from './models/Transaction.js';
import OverallStat from './models/OverallStat.js';
import AffiliateStat from './models/AffiliateStat.js';
import {
  dataUser, 
  dataProduct, 
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat} from './data/index.js';

/*CONFIGURATION*/
dotenv.config();
const app= express();
app.use(express.json());
//helmet helps for passing api's
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
//morgan helps protect api calls
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors());

/*ROUTES*/
app.use("/client", clientRoute);
app.use("/general", generalRoute);
app.use("/management", managementRoute);
app.use("/sales", saleRoute);



/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    app.listen(PORT, () => 
    console.log(`Connected established Server Port: ${PORT}`));
    //AffiliateStat.insertMany(dataAffiliateStat);
    //OverallStat.insertMany(dataOverallStat);
    //User.insertMany(dataUser);
    //Products.insertMany(dataProduct);
    //ProductStat.insertMany(dataProductStat);
    //Transaction.insertMany(dataTransaction);
  })
  .catch((error) => console.log(`${error} did not connect`));