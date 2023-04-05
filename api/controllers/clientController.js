import Product from '../models/Products.js';
import ProductStat from '../models/ProductStat.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import getCountryIso3 from "country-iso-2-to-3";

export const getProducts = async (req, res) => {
    try {
      const products = await Product.find();
      //foreign primary key matching and data fetching
      const productsWithStats = await Promise.all(
       //mongo db provides aggregate that's used for joining tables
        products.map(async (product) => {
          const stat = await ProductStat.find({
            productId: product._id,
          });
          //when using Promise.all _doc is used
          return {
            ...product._doc,
            stat,
          }; //this code section combnes data from both product
          //and productStat table into one
        })
      );
  
      res.status(200).json(productsWithStats);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
}

export const getCustomers = async (req, res) => {
  try {
    //--password means sending everything except password to the frontend
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const transactions = await Transaction.find({
     //this code allows searching of the cost and userId field based on user input in the frontend
     //or allows searching of both cost field and userId field
     $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
    .sort(sortFormatted)
    .skip(page * pageSize)
    .limit(pageSize);

  const total = await Transaction.countDocuments({
    name: { $regex: search, $options: "i" },
  });

  res.status(200).json({
    transactions,
    total,
  });
} catch (error) {
  res.status(404).json({ message: error.message });
}
};

export const getGeography = async(req, res)=>{
  try {
    const users = await User.find();
 //getting nu,ber of users in each country, country being the key and users the values returned
    const mappedLocations = users.reduce((acc, { country }) => {
      //reduce methods returns the accomulated value
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    //formatting to what nivo excepts at the frontend
    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
